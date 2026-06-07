from __future__ import annotations

import json
from copy import deepcopy
from dataclasses import asdict
from datetime import UTC, datetime
from typing import TypedDict
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

from django.conf import settings

from ingestion.dtos import (
    IngestionChunk,
    IngestionDocument,
    IngestionPayload,
    IngestionReference,
    IngestionRunResult,
)

PRIVATE_STORAGE_BUCKETS = {"project-source-pdfs", "processed-exports"}


class IngestionPersistenceError(RuntimeError):
    pass


class InMemoryRepositorySnapshot(TypedDict):
    private_objects: dict[tuple[str, str], bytes]
    documents: dict[str, IngestionDocument]
    chunks: dict[str, IngestionChunk]
    references: dict[str, IngestionReference]
    reference_chunks: set[tuple[str, str]]


class InMemoryIngestionRepository:
    def __init__(self, *, fail_after: str | None = None) -> None:
        self.fail_after = fail_after
        self.private_objects: dict[tuple[str, str], bytes] = {}
        self.documents: dict[str, IngestionDocument] = {}
        self.chunks: dict[str, IngestionChunk] = {}
        self.references: dict[str, IngestionReference] = {}
        self.reference_chunks: set[tuple[str, str]] = set()

    def persist(self, payload: IngestionPayload) -> IngestionRunResult:
        _validate_payload_for_persistence(payload)
        before = self.snapshot()
        try:
            storage_key = (
                payload.document.storage.bucket,
                payload.document.storage.path,
            )
            self.private_objects[storage_key] = payload.source_bytes
            self._fail_if_requested("storage")
            self.documents[payload.document.id] = payload.document
            self._fail_if_requested("document")
            self.chunks = {
                chunk_id: chunk
                for chunk_id, chunk in self.chunks.items()
                if getattr(chunk, "document_id", None) != payload.document.id
            }
            self.chunks.update({chunk.id: chunk for chunk in payload.chunks})
            self._fail_if_requested("chunks")
            self.references = {
                reference_id: reference
                for reference_id, reference in self.references.items()
                if getattr(reference, "document_id", None) != payload.document.id
            }
            self.references.update({reference.id: reference for reference in payload.references})
            current_reference_ids = {reference.id for reference in payload.references}
            self.reference_chunks = {
                link for link in self.reference_chunks if link[0] not in current_reference_ids
            }
            self.reference_chunks.update(
                (reference.id, chunk_id)
                for reference in payload.references
                for chunk_id in reference.chunk_ids
            )
            self._fail_if_requested("references")
        except Exception:
            self._restore(before)
            raise
        return _result(payload)

    def snapshot(self) -> InMemoryRepositorySnapshot:
        return {
            "private_objects": deepcopy(self.private_objects),
            "documents": deepcopy(self.documents),
            "chunks": deepcopy(self.chunks),
            "references": deepcopy(self.references),
            "reference_chunks": deepcopy(self.reference_chunks),
        }

    def _restore(self, snapshot: InMemoryRepositorySnapshot) -> None:
        self.private_objects = deepcopy(snapshot["private_objects"])
        self.documents = deepcopy(snapshot["documents"])
        self.chunks = deepcopy(snapshot["chunks"])
        self.references = deepcopy(snapshot["references"])
        self.reference_chunks = deepcopy(snapshot["reference_chunks"])

    def _fail_if_requested(self, stage: str) -> None:
        if self.fail_after == stage:
            raise IngestionPersistenceError(f"Injected persistence failure after {stage}")


class SupabaseIngestionRepository:
    def __init__(
        self,
        *,
        supabase_url: str | None = None,
        service_role_key: str | None = None,
        timeout_seconds: float | None = None,
    ) -> None:
        self.supabase_url = (
            supabase_url if supabase_url is not None else settings.SUPABASE_URL
        ).rstrip("/")
        self.service_role_key = (
            service_role_key if service_role_key is not None else settings.SUPABASE_SERVICE_ROLE_KEY
        )
        self.timeout_seconds = (
            timeout_seconds
            if timeout_seconds is not None
            else settings.SUPABASE_REST_TIMEOUT_SECONDS
        )

    def persist(self, payload: IngestionPayload) -> IngestionRunResult:
        _validate_payload_for_persistence(payload)
        self._require_config()
        previous = self.read_private_source(
            payload.document.storage.bucket,
            payload.document.storage.path,
        )
        self._upload_private_source(payload)
        try:
            self._persist_payload(payload)
        except Exception:
            if previous is None:
                self._delete_private_source(
                    payload.document.storage.bucket,
                    payload.document.storage.path,
                )
            else:
                self._upload_bytes(
                    payload.document.storage.bucket,
                    payload.document.storage.path,
                    previous,
                    _content_type(payload.document.file_type),
                )
            raise
        self._activate_source_record(payload)
        self._record_successful_ingest(payload)
        return _result(payload)

    def read_private_source(self, bucket: str, path: str) -> bytes | None:
        self._require_config()
        request = Request(
            self._storage_url(bucket, path),
            headers=self._headers(),
            method="GET",
        )
        try:
            with urlopen(request, timeout=self.timeout_seconds) as response:
                return response.read()
        except HTTPError as error:
            if _is_missing_storage_object(error):
                return None
            raise IngestionPersistenceError(
                f"Private source read failed with status {error.code}"
            ) from error
        except TimeoutError:
            return None
        except URLError as error:
            raise IngestionPersistenceError("Private source storage is unavailable") from error

    def _upload_private_source(self, payload: IngestionPayload) -> None:
        self._upload_bytes(
            payload.document.storage.bucket,
            payload.document.storage.path,
            payload.source_bytes,
            _content_type(payload.document.file_type),
        )

    def _upload_bytes(
        self,
        bucket: str,
        path: str,
        content: bytes,
        content_type: str,
    ) -> None:
        request = Request(
            self._storage_url(bucket, path),
            data=content,
            headers={
                **self._headers(),
                "Content-Type": content_type,
                "x-upsert": "true",
            },
            method="POST",
        )
        self._execute(request, "Private source upload")

    def _delete_private_source(self, bucket: str, path: str) -> None:
        request = Request(
            self._storage_url(bucket, path),
            headers=self._headers(),
            method="DELETE",
        )
        try:
            self._execute(request, "Private source cleanup")
        except IngestionPersistenceError:
            pass

    def _persist_payload(self, payload: IngestionPayload) -> None:
        request = Request(
            f"{self.supabase_url}/rest/v1/rpc/persist_ingestion_document",
            data=json.dumps({"payload": _rpc_payload(payload)}).encode("utf-8"),
            headers={**self._headers(), "Content-Type": "application/json"},
            method="POST",
        )
        response = self._execute(request, "Ingestion persistence")
        try:
            evidence = json.loads(response)
        except (UnicodeDecodeError, json.JSONDecodeError) as error:
            raise IngestionPersistenceError(
                "Ingestion persistence returned invalid vector evidence"
            ) from error
        if (
            not isinstance(evidence, dict)
            or evidence.get("embeddingCount") != len(payload.chunks)
            or evidence.get("embeddingDimensions") != payload.embedding_evidence.dimensions
        ):
            raise IngestionPersistenceError(
                "Ingestion persistence returned incomplete vector evidence"
            )

    def _activate_source_record(self, payload: IngestionPayload) -> None:
        document = payload.document
        now = _utc_now()
        request = Request(
            f"{self.supabase_url}/rest/v1/source_records?on_conflict=source_id",
            data=json.dumps(
                {
                    "source_id": document.source_id,
                    "title": document.title,
                    "source_type": document.source_type,
                    "provenance": "approved-source-manifest",
                    "summary": "Approved source ingested for public grounded chat retrieval.",
                    "usage_scope": ["public-chat", "approved-source-bundle"],
                    "aliases": _source_aliases(payload),
                    "lifecycle_state": "active",
                    "storage_bucket": document.storage.bucket,
                    "storage_path": document.storage.path,
                    "updated_at": now,
                }
            ).encode("utf-8"),
            headers={
                **self._headers(),
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates,return=minimal",
            },
            method="POST",
        )
        self._execute(request, "Source activation")

    def _record_successful_ingest(self, payload: IngestionPayload) -> None:
        document = payload.document
        now = _utc_now()
        request = Request(
            f"{self.supabase_url}/rest/v1/source_ingest_jobs",
            data=json.dumps(
                {
                    "source_id": document.source_id,
                    "status": "succeeded",
                    "requested_by": "approved-source-ingestion",
                    "started_at": now,
                    "document_id": document.id,
                    "chunk_count": len(payload.chunks),
                    "reference_count": len(payload.references),
                    "embedding_model": payload.embedding_evidence.model,
                    "embedding_dimensions": payload.embedding_evidence.dimensions,
                    "completed_at": now,
                    "summary": "Approved source ingest completed and is retrieval eligible.",
                }
            ).encode("utf-8"),
            headers={
                **self._headers(),
                "Content-Type": "application/json",
                "Prefer": "return=minimal",
            },
            method="POST",
        )
        self._execute(request, "Ingestion job recording")

    def _execute(self, request: Request, operation: str) -> bytes:
        try:
            with urlopen(request, timeout=self.timeout_seconds) as response:
                return response.read()
        except HTTPError as error:
            raise IngestionPersistenceError(
                f"{operation} failed with status {error.code}"
            ) from error
        except URLError as error:
            raise IngestionPersistenceError(f"{operation} service is unavailable") from error

    def _headers(self) -> dict[str, str]:
        return {
            "apikey": self.service_role_key,
            "Authorization": f"Bearer {self.service_role_key}",
        }

    def _storage_url(self, bucket: str, path: str) -> str:
        encoded = "/".join(quote(part, safe="") for part in (bucket, *path.split("/")) if part)
        return f"{self.supabase_url}/storage/v1/object/{encoded}"

    def _require_config(self) -> None:
        if not self.supabase_url or not self.service_role_key:
            raise IngestionPersistenceError(
                "Supabase service configuration is required for ingestion"
            )


def _validate_payload_for_persistence(payload: IngestionPayload) -> None:
    storage = payload.document.storage
    if storage.bucket not in PRIVATE_STORAGE_BUCKETS:
        raise IngestionPersistenceError("Approved source storage must remain private")
    if payload.embedding_evidence.synthetic and not payload.dry_run:
        raise IngestionPersistenceError("Production persistence cannot accept synthetic embeddings")
    if not payload.chunks or not payload.references:
        raise IngestionPersistenceError("Ingestion payload is incomplete")
    dimensions = payload.embedding_evidence.dimensions
    if any(len(chunk.embedding) != dimensions for chunk in payload.chunks):
        raise IngestionPersistenceError("Chunk vectors do not match embedding evidence")


def _rpc_payload(payload: IngestionPayload) -> dict[str, object]:
    document = payload.document
    evidence = payload.embedding_evidence
    return {
        "document": {
            "id": document.id,
            "sourceId": document.source_id,
            "sourceType": document.source_type,
            "title": document.title,
            "sourcePath": document.source_path,
            "storageBucket": document.storage.bucket,
            "storagePath": document.storage.path,
            "fileType": document.file_type,
            "checksum": document.checksum,
            "version": document.revision,
            "embeddingConfig": asdict(evidence),
            "metadata": document.metadata,
        },
        "chunks": [
            {
                "id": chunk.id,
                "documentId": chunk.document_id,
                "sourceId": chunk.source_id,
                "chunkIndex": chunk.chunk_index,
                "content": chunk.content,
                "contentChecksum": chunk.content_checksum,
                "tokenCount": chunk.token_count,
                "embedding": list(chunk.embedding),
                "metadata": chunk.metadata,
            }
            for chunk in payload.chunks
        ],
        "references": [
            {
                "id": reference.id,
                "documentId": reference.document_id,
                "sourceId": reference.source_id,
                "citationLabel": reference.citation_label,
                "sourceTitle": reference.source_title,
                "canonicalUrl": reference.canonical_url,
                "chunkIds": list(reference.chunk_ids),
                "metadata": reference.metadata,
            }
            for reference in payload.references
        ],
    }


def _result(payload: IngestionPayload) -> IngestionRunResult:
    return IngestionRunResult(
        document_id=payload.document.id,
        chunk_count=len(payload.chunks),
        reference_count=len(payload.references),
        embedding_model=payload.embedding_evidence.model,
        embedding_dimensions=payload.embedding_evidence.dimensions,
    )


def _source_aliases(payload: IngestionPayload) -> list[str]:
    aliases = [payload.document.title]
    aliases.extend(reference.citation_label for reference in payload.references)
    return list(dict.fromkeys(alias for alias in aliases if alias))


def _utc_now() -> str:
    return datetime.now(UTC).isoformat()


def _content_type(file_type: str) -> str:
    return "application/pdf" if file_type == "pdf" else "text/markdown; charset=utf-8"


def _is_missing_storage_object(error: HTTPError) -> bool:
    if error.code == 404:
        return True
    if error.code != 400:
        return False
    try:
        payload = json.loads(error.read().decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return False
    return (
        isinstance(payload, dict)
        and str(payload.get("statusCode")) == "404"
        and payload.get("error") == "not_found"
    )
