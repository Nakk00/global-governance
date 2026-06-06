from __future__ import annotations

import json
from typing import Any, cast
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urljoin
from urllib.request import Request, urlopen

from django.conf import settings
from django.core.files.uploadedfile import UploadedFile

from ingestion.dtos import IngestionRunner

from .base import (
    ChunkDetailDto,
    ChunkRecord,
    CitationDetailDto,
    CitationRecord,
    DocumentRecord,
    IngestJobDto,
    LifecycleState,
    SourceChunksInspectionDto,
    SourceCitationsInspectionDto,
    SourceDetailDto,
    SourceMutationError,
    SourceMutationResult,
    SourceRecord,
    SourceSnapshot,
    StewardshipDashboardDto,
    StewardshipEventDto,
)
from .mappers import (
    chunk_from_row as _chunk_from_row,
)
from .mappers import (
    chunk_row as _chunk_row,
)
from .mappers import (
    citation_from_row as _citation_from_row,
)
from .mappers import (
    citation_row as _citation_row,
)
from .mappers import (
    dashboard_from_snapshots as _dashboard_from_snapshots,
)
from .mappers import (
    document_from_row as _document_from_row,
)
from .mappers import (
    event_from_row as _event_from_row,
)
from .mappers import (
    inspection_anchor as _inspection_anchor,
)
from .mappers import (
    inspection_partial_data as _inspection_partial_data,
)
from .mappers import (
    inspection_state as _inspection_state,
)
from .mappers import (
    mutation_result as _mutation_result,
)
from .mappers import (
    source_detail as _source_detail,
)
from .mutations import (
    clean_list as _clean_list,
)
from .mutations import (
    clean_text as _clean_text,
)
from .mutations import (
    ensure_source_id_available as _ensure_source_id_available,
)
from .mutations import (
    lifecycle_event_type as _lifecycle_event_type,
)
from .mutations import (
    now as _now,
)
from .mutations import (
    validate_ingest_request as _validate_ingest_request,
)
from .mutations import (
    validate_source_metadata as _validate_source_metadata,
)
from .mutations import (
    validate_transition as _validate_transition,
)
from .mutations import (
    validate_upload_file as _validate_upload_file,
)
from .seeds import APPROVED_SOURCE_SEEDS
from .seeds import source_from_seed as _source_from_seed
from .storage import (
    build_storage_path as _build_storage_path,
)
from .storage import (
    content_type_for_name as _content_type_for_name,
)
from .storage import (
    quoted_csv as _quoted_csv,
)
from .storage import (
    read_uploaded_bytes as _read_uploaded_bytes,
)


class SupabaseStewardshipRepository:
    def __init__(
        self,
        *,
        supabase_url: str,
        service_role_key: str,
        ingestion_runner: IngestionRunner | None = None,
    ) -> None:
        self.supabase_url = supabase_url.rstrip("/") + "/"
        self.service_role_key = service_role_key
        self._ingestion_runner = ingestion_runner

    def get_dashboard(self) -> StewardshipDashboardDto:
        return _dashboard_from_snapshots(self._snapshots())

    def get_source_detail(self, source_id: str) -> SourceDetailDto | None:
        snapshot = self._find_snapshot(source_id)
        return _source_detail(snapshot) if snapshot else None

    def get_source_chunks(self, source_id: str) -> SourceChunksInspectionDto | None:
        snapshot = self._find_snapshot(source_id)
        if snapshot is None:
            return None
        document = self._latest_document(snapshot.source.source_id)
        chunks = self._document_chunks(document.document_id) if document else []
        return cast(
            SourceChunksInspectionDto,
            {
                "anchor": _inspection_anchor(snapshot, document, "chunk"),
                "chunks": [
                    _chunk_row(chunk, _inspection_state(snapshot, document, chunk))
                    for chunk in chunks
                ],
                "partialData": _inspection_partial_data(snapshot, document, chunks),
            },
        )

    def get_source_citations(self, source_id: str) -> SourceCitationsInspectionDto | None:
        snapshot = self._find_snapshot(source_id)
        if snapshot is None:
            return None
        document = self._latest_document(snapshot.source.source_id)
        citations = self._document_citations(document.document_id) if document else []
        reference_chunks = self._reference_chunk_map(
            [citation.citation_id for citation in citations],
            by_reference=True,
        )
        return cast(
            SourceCitationsInspectionDto,
            {
                "anchor": _inspection_anchor(snapshot, document, "citation"),
                "citations": [
                    _citation_row(
                        citation,
                        reference_chunks.get(citation.citation_id, []),
                        _inspection_state(snapshot, document, citation),
                    )
                    for citation in citations
                ],
                "partialData": _inspection_partial_data(snapshot, document, citations),
            },
        )

    def get_chunk_detail(self, chunk_id: str) -> ChunkDetailDto | None:
        chunk = self._chunk_by_id(chunk_id)
        if chunk is None:
            return None
        snapshot = self._find_snapshot(chunk.source_id)
        if snapshot is None:
            return None
        document = self._latest_document(snapshot.source.source_id)
        reference_chunks = self._reference_chunk_map([chunk.chunk_id], by_reference=False)
        return {
            **_chunk_row(chunk, _inspection_state(snapshot, document, chunk)),
            "content": chunk.content,
            "linkedCitationIds": reference_chunks.get(chunk.chunk_id, []),
            "createdAt": chunk.created_at,
            "updatedAt": chunk.updated_at,
        }

    def get_citation_detail(self, citation_id: str) -> CitationDetailDto | None:
        citation = self._citation_by_id(citation_id)
        if citation is None:
            return None
        snapshot = self._find_snapshot(citation.source_id)
        if snapshot is None:
            return None
        document = self._latest_document(snapshot.source.source_id)
        linked_chunk_ids = self._reference_chunk_map([citation.citation_id], by_reference=True).get(
            citation.citation_id, []
        )
        linked_chunks = [chunk for chunk in self._chunks_by_ids(linked_chunk_ids)]
        row = _citation_row(
            citation,
            linked_chunk_ids,
            _inspection_state(snapshot, document, citation),
        )
        return {
            **row,
            "sourceTitle": citation.source_title,
            "sourcePath": citation.source_path,
            "copyableLabel": row["displayLabel"],
            "linkedChunks": [
                _chunk_row(chunk, _inspection_state(snapshot, document, chunk))
                for chunk in linked_chunks
            ],
        }

    def upload_source(
        self,
        *,
        uploaded_file: UploadedFile | None,
        metadata: dict[str, Any],
        actor: str,
    ) -> SourceMutationResult:
        source_id, title, source_type, provenance, summary, usage_scope = _validate_source_metadata(
            metadata
        )
        _validate_upload_file(uploaded_file)
        assert uploaded_file is not None
        _ensure_source_id_available(
            source_id,
            {snapshot.source.source_id: snapshot.source for snapshot in self._snapshots().values()},
        )
        file_name = uploaded_file.name or "source-file"
        storage_path = _build_storage_path(source_id, file_name)
        content_type = uploaded_file.content_type or _content_type_for_name(file_name)
        file_bytes = _read_uploaded_bytes(uploaded_file)
        self._upload_storage_object(
            bucket="project-source-pdfs",
            path=storage_path,
            data=file_bytes,
            content_type=content_type,
        )
        record = self._request(
            "POST",
            "rest/v1/source_records",
            {
                "source_id": source_id,
                "title": title,
                "source_type": source_type,
                "provenance": provenance,
                "summary": summary,
                "usage_scope": usage_scope,
                "aliases": [],
                "lifecycle_state": "draft",
                "storage_bucket": "project-source-pdfs",
                "storage_path": storage_path,
                "created_at": _now(),
                "updated_at": _now(),
            },
            prefer="return=representation",
        )[0]
        self._create_audit_event(
            source_id=source_id,
            event_type="upload",
            actor=actor,
            outcome="succeeded",
            summary="Uploaded as draft and inactive.",
            metadata={
                "storageBucket": "project-source-pdfs",
                "storagePath": storage_path,
                "recordedAt": _now(),
            },
        )
        return self._mutation_result_from_record(record["source_id"])

    def update_source_metadata(
        self,
        *,
        source_id: str,
        payload: dict[str, Any],
        actor: str,
    ) -> SourceMutationResult:
        snapshot = self._ensure_persisted_snapshot(source_id)
        source = snapshot.source
        title = _clean_text(payload.get("title", source.title))
        provenance = _clean_text(payload.get("provenance", source.provenance))
        summary = _clean_text(payload.get("summary", source.summary))
        usage_scope = _clean_list(payload.get("usageScope", source.usage_scope))
        field_errors = {
            key: value
            for key, value in {
                "title": "Add a source title." if not title else "",
                "provenance": "Describe where this source came from." if not provenance else "",
                "summary": "Add a short source summary." if not summary else "",
                "usageScope": "Choose at least one usage scope." if not usage_scope else "",
            }.items()
            if value
        }
        if field_errors:
            raise SourceMutationError(
                code="admin_source_validation_failed",
                message="The source metadata needs attention.",
                status=400,
                fields=field_errors,
            )
        body: dict[str, Any] = {
            "title": title,
            "provenance": provenance,
            "summary": summary,
            "usage_scope": usage_scope,
            "updated_at": _now(),
        }
        if "sourceType" in payload:
            cleaned_type = _clean_text(payload["sourceType"])
            if cleaned_type:
                body["source_type"] = cleaned_type
        self._request(
            "PATCH",
            f"rest/v1/source_records?source_id=eq.{quote(snapshot.source.source_id, safe='')}",
            body,
            prefer="return=representation",
        )
        self._create_audit_event(
            source_id=snapshot.source.source_id,
            event_type="edit",
            actor=actor,
            outcome="succeeded",
            summary="Updated source metadata.",
            metadata={"changedFields": sorted(body.keys())},
        )
        return self._mutation_result_from_record(snapshot.source.source_id)

    def transition_source(
        self,
        *,
        source_id: str,
        target_state: LifecycleState,
        actor: str,
    ) -> SourceMutationResult:
        snapshot = self._ensure_persisted_snapshot(source_id)
        _validate_transition(snapshot, target_state)
        self._request(
            "PATCH",
            f"rest/v1/source_records?source_id=eq.{quote(snapshot.source.source_id, safe='')}",
            {
                "lifecycle_state": target_state,
                "updated_at": _now(),
            },
            prefer="return=representation",
        )
        self._create_audit_event(
            source_id=snapshot.source.source_id,
            event_type=_lifecycle_event_type(target_state),
            actor=actor,
            outcome="succeeded",
            summary=f"Moved source to {target_state}.",
            metadata={"targetState": target_state},
        )
        return self._mutation_result_from_record(snapshot.source.source_id)

    def dispatch_ingest(self, *, source_id: str, actor: str) -> SourceMutationResult:
        snapshot = self._ensure_persisted_snapshot(source_id)
        _validate_ingest_request(snapshot)
        is_reingest = len(snapshot.ingest_jobs) > 0
        event_type = "re-ingest" if is_reingest else "ingest"
        queued_summary = "Protected ingest request accepted for processing."
        requested_at = _now()
        try:
            queued_job = self._request(
                "POST",
                "rest/v1/source_ingest_jobs",
                {
                    "source_id": snapshot.source.source_id,
                    "status": "queued",
                    "requested_by": actor,
                    "requested_at": requested_at,
                    "summary": queued_summary,
                },
                prefer="return=representation",
            )[0]
        except SourceMutationError as error:
            if error.status == 409:
                raise SourceMutationError(
                    code="admin_source_ingest_in_progress",
                    message="An ingest job is already in progress for this source.",
                    status=409,
                ) from error
            raise
        self._create_audit_event(
            source_id=snapshot.source.source_id,
            event_type=event_type,
            actor=actor,
            outcome="queued",
            summary=queued_summary,
            metadata={"jobId": queued_job["id"]},
        )
        processing_summary = "Approved source extraction and embedding are in progress."
        self._request(
            "PATCH",
            f"rest/v1/source_ingest_jobs?id=eq.{quote(str(queued_job['id']), safe='')}",
            {
                "status": "processing",
                "started_at": _now(),
                "summary": processing_summary,
            },
            prefer="return=representation",
        )
        from ingestion.services import ingest_stewardship_source

        runner = self._ingestion_runner or ingest_stewardship_source
        try:
            result = runner(snapshot.source)
        except Exception:
            failed_summary = "Approved source ingestion failed before activation readiness."
            self._request(
                "PATCH",
                f"rest/v1/source_ingest_jobs?id=eq.{quote(str(queued_job['id']), safe='')}",
                {
                    "status": "failed",
                    "completed_at": _now(),
                    "summary": failed_summary,
                    "error_code": "ingestion_failed",
                },
                prefer="return=representation",
            )
            self._create_audit_event(
                source_id=snapshot.source.source_id,
                event_type=event_type,
                actor=actor,
                outcome="failed",
                summary=failed_summary,
                metadata={"jobId": queued_job["id"]},
            )
            return self._mutation_result_from_record(snapshot.source.source_id)

        completed_summary = "Protected ingest request completed and is ready for activation."
        self._request(
            "PATCH",
            f"rest/v1/source_ingest_jobs?id=eq.{quote(str(queued_job['id']), safe='')}",
            {
                "status": "succeeded",
                "completed_at": _now(),
                "summary": completed_summary,
                "error_code": None,
                "document_id": result.document_id,
                "chunk_count": result.chunk_count,
                "reference_count": result.reference_count,
                "embedding_model": result.embedding_model,
                "embedding_dimensions": result.embedding_dimensions,
            },
            prefer="return=representation",
        )
        self._create_audit_event(
            source_id=snapshot.source.source_id,
            event_type=event_type,
            actor=actor,
            outcome="succeeded",
            summary=completed_summary,
            metadata={"jobId": queued_job["id"]},
        )
        return self._mutation_result_from_record(snapshot.source.source_id)

    def _mutation_result_from_record(self, source_id: str) -> SourceMutationResult:
        snapshots = self._snapshots()
        return _mutation_result(snapshots, source_id)

    def _ensure_persisted_snapshot(self, source_id: str) -> SourceSnapshot:
        snapshot = self._find_snapshot(source_id)
        if snapshot is None:
            raise SourceMutationError(
                code="admin_source_not_found",
                message="The requested approved source was not found.",
                status=404,
            )
        if snapshot.source.created_at is None:
            self._persist_seed_snapshot(snapshot.source)
            snapshot = self._find_snapshot(snapshot.source.source_id)
            assert snapshot is not None
        return snapshot

    def _persist_seed_snapshot(self, source: SourceRecord) -> None:
        self._request(
            "POST",
            "rest/v1/source_records?on_conflict=source_id",
            {
                "source_id": source.source_id,
                "title": source.title,
                "source_type": source.source_type,
                "provenance": source.provenance,
                "summary": source.summary,
                "usage_scope": source.usage_scope,
                "aliases": source.aliases,
                "lifecycle_state": source.lifecycle_state,
                "storage_bucket": None,
                "storage_path": source.storage_path,
                "created_at": _now(),
                "updated_at": _now(),
            },
            prefer="resolution=merge-duplicates,return=representation",
        )

    def _find_snapshot(self, source_id: str) -> SourceSnapshot | None:
        snapshots = self._snapshots()
        if source_id in snapshots:
            return snapshots[source_id]
        return next(
            (snapshot for snapshot in snapshots.values() if source_id in snapshot.source.aliases),
            None,
        )

    def _snapshots(self) -> dict[str, SourceSnapshot]:
        records = self._source_records()
        ingest_jobs = self._ingest_jobs()
        audit_events = self._audit_events()
        validation_events = self._validation_events()
        snapshots: dict[str, SourceSnapshot] = {}
        for seed in APPROVED_SOURCE_SEEDS:
            snapshots[seed.source_id] = SourceSnapshot(
                source=_source_from_seed(seed),
                latest_ingest_job=None,
                ingest_jobs=[],
                audit_events=[],
                validation_events=[],
            )
        for record in records.values():
            snapshots[record.source_id] = SourceSnapshot(
                source=record,
                latest_ingest_job=ingest_jobs.get(record.source_id, [None])[0],
                ingest_jobs=ingest_jobs.get(record.source_id, []),
                audit_events=audit_events.get(record.source_id, []),
                validation_events=validation_events.get(record.source_id, []),
            )
        return snapshots

    def _source_records(self) -> dict[str, SourceRecord]:
        rows = self._request(
            "GET",
            "rest/v1/source_records"
            "?select=source_id,title,source_type,provenance,summary,usage_scope,aliases,"
            "lifecycle_state,storage_path,created_at,updated_at"
            "&order=title.asc",
        )
        return {
            row["source_id"]: SourceRecord(
                source_id=row["source_id"],
                title=row["title"],
                source_type=row["source_type"],
                provenance=row["provenance"],
                summary=row["summary"],
                usage_scope=_clean_list(row.get("usage_scope", [])),
                aliases=_clean_list(row.get("aliases", [])),
                lifecycle_state=cast(LifecycleState, row["lifecycle_state"]),
                storage_path=row.get("storage_path"),
                created_at=row.get("created_at"),
                updated_at=row.get("updated_at"),
            )
            for row in rows
        }

    def _ingest_jobs(self) -> dict[str, list[IngestJobDto]]:
        rows = self._request(
            "GET",
            "rest/v1/source_ingest_jobs"
            "?select=id,source_id,status,requested_at,started_at,completed_at,summary,"
            "document_id,chunk_count,reference_count,embedding_model,"
            "embedding_dimensions,error_code"
            "&order=requested_at.desc",
        )
        jobs: dict[str, list[IngestJobDto]] = {}
        for row in rows:
            jobs.setdefault(row["source_id"], []).append(
                {
                    "jobId": str(row["id"]),
                    "sourceId": row["source_id"],
                    "status": cast(Any, row["status"]),
                    "requestedAt": row["requested_at"],
                    "summary": row["summary"],
                    "startedAt": row.get("started_at"),
                    "completedAt": row.get("completed_at"),
                    "documentId": row.get("document_id"),
                    "chunkCount": row.get("chunk_count"),
                    "referenceCount": row.get("reference_count"),
                    "embeddingModel": row.get("embedding_model"),
                    "embeddingDimensions": row.get("embedding_dimensions"),
                    "errorCode": row.get("error_code"),
                }
            )
        return jobs

    def _audit_events(self) -> dict[str, list[StewardshipEventDto]]:
        rows = self._request(
            "GET",
            "rest/v1/source_audit_events"
            "?select=id,source_id,event_type,origin,occurred_at,outcome_status,summary"
            "&order=occurred_at.desc",
        )
        events: dict[str, list[StewardshipEventDto]] = {}
        for row in rows:
            events.setdefault(row["source_id"], []).append(_event_from_row(row))
        return events

    def _validation_events(self) -> dict[str, list[StewardshipEventDto]]:
        rows = self._request(
            "GET",
            "rest/v1/source_validation_runs"
            "?select=id,source_id,event_type,origin,occurred_at,outcome_status,summary"
            "&order=occurred_at.desc",
        )
        events: dict[str, list[StewardshipEventDto]] = {}
        for row in rows:
            events.setdefault(row["source_id"], []).append(_event_from_row(row))
        return events

    def _latest_document(self, source_id: str) -> DocumentRecord | None:
        rows = self._request(
            "GET",
            "rest/v1/documents"
            "?select=id,source_id,title,source_path,version,created_at,updated_at"
            f"&source_id=eq.{quote(source_id, safe='')}"
            "&order=updated_at.desc"
            "&limit=1",
        )
        return _document_from_row(rows[0]) if rows else None

    def _document_chunks(self, document_id: str) -> list[ChunkRecord]:
        rows = self._request(
            "GET",
            "rest/v1/chunks"
            "?select=id,document_id,source_id,chunk_index,content,token_count,embedding,metadata,created_at,updated_at"
            f"&document_id=eq.{quote(document_id, safe='')}"
            "&order=chunk_index.asc",
        )
        return [_chunk_from_row(row) for row in rows]

    def _document_citations(self, document_id: str) -> list[CitationRecord]:
        rows = self._request(
            "GET",
            "rest/v1/references"
            "?select=id,document_id,source_id,citation_label,source_title,metadata,created_at,updated_at"
            f"&document_id=eq.{quote(document_id, safe='')}"
            "&order=citation_label.asc",
        )
        return [_citation_from_row(row, source_path=None) for row in rows]

    def _document_by_id(self, document_id: str) -> DocumentRecord | None:
        rows = self._request(
            "GET",
            "rest/v1/documents"
            "?select=id,source_id,title,source_path,version,created_at,updated_at"
            f"&id=eq.{quote(document_id, safe='')}"
            "&limit=1",
        )
        return _document_from_row(rows[0]) if rows else None

    def _chunk_by_id(self, chunk_id: str) -> ChunkRecord | None:
        rows = self._request(
            "GET",
            "rest/v1/chunks"
            "?select=id,document_id,source_id,chunk_index,content,token_count,embedding,metadata,created_at,updated_at"
            f"&id=eq.{quote(chunk_id, safe='')}"
            "&limit=1",
        )
        return _chunk_from_row(rows[0]) if rows else None

    def _citation_by_id(self, citation_id: str) -> CitationRecord | None:
        rows = self._request(
            "GET",
            "rest/v1/references"
            "?select=id,document_id,source_id,citation_label,source_title,metadata,created_at,updated_at"
            f"&id=eq.{quote(citation_id, safe='')}"
            "&limit=1",
        )
        if not rows:
            return None
        document = self._document_by_id(str(rows[0]["document_id"]))
        return _citation_from_row(rows[0], source_path=document.source_path if document else None)

    def _chunks_by_ids(self, chunk_ids: list[str]) -> list[ChunkRecord]:
        if not chunk_ids:
            return []
        rows = self._request(
            "GET",
            "rest/v1/chunks"
            "?select=id,document_id,source_id,chunk_index,content,token_count,embedding,metadata,created_at,updated_at"
            f"&id=in.({_quoted_csv(chunk_ids)})"
            "&order=chunk_index.asc",
        )
        return [_chunk_from_row(row) for row in rows]

    def _reference_chunk_map(self, ids: list[str], *, by_reference: bool) -> dict[str, list[str]]:
        if not ids:
            return {}
        column = "reference_id" if by_reference else "chunk_id"
        rows = self._request(
            "GET",
            "rest/v1/reference_chunks"
            "?select=reference_id,chunk_id"
            f"&{column}=in.({_quoted_csv(ids)})",
        )
        mapped: dict[str, list[str]] = {}
        for row in rows:
            key = row["reference_id"] if by_reference else row["chunk_id"]
            value = row["chunk_id"] if by_reference else row["reference_id"]
            mapped.setdefault(key, []).append(value)
        return mapped

    def _create_audit_event(
        self,
        *,
        source_id: str,
        event_type: str,
        actor: str,
        outcome: str,
        summary: str,
        metadata: dict[str, Any],
    ) -> None:
        self._request(
            "POST",
            "rest/v1/source_audit_events",
            {
                "source_id": source_id,
                "event_type": event_type,
                "actor_id": actor,
                "origin": actor,
                "occurred_at": _now(),
                "outcome_status": outcome,
                "summary": summary,
                "metadata": metadata,
            },
        )

    def _upload_storage_object(
        self,
        *,
        bucket: str,
        path: str,
        data: bytes,
        content_type: str,
    ) -> None:
        encoded_path = "/".join(quote(part, safe="") for part in (bucket, path))
        request = Request(
            urljoin(self.supabase_url, f"storage/v1/object/{encoded_path}"),
            data=data,
            headers={
                "apikey": self.service_role_key,
                "Authorization": f"Bearer {self.service_role_key}",
                "Content-Type": content_type,
                "x-upsert": "false",
            },
            method="POST",
        )
        try:
            with urlopen(request, timeout=settings.SUPABASE_REST_TIMEOUT_SECONDS):
                return
        except (HTTPError, URLError) as error:
            raise SourceMutationError(
                code="admin_source_upload_failed",
                message="The protected source file could not be stored.",
                status=502,
            ) from error

    def _request(
        self,
        method: str,
        path: str,
        payload: dict[str, Any] | None = None,
        *,
        prefer: str | None = None,
    ) -> Any:
        body = None if payload is None else json.dumps(payload).encode("utf-8")
        headers = {
            "apikey": self.service_role_key,
            "Authorization": f"Bearer {self.service_role_key}",
            "Accept": "application/json",
        }
        if body is not None:
            headers["Content-Type"] = "application/json"
        if prefer:
            headers["Prefer"] = prefer
        request = Request(
            urljoin(self.supabase_url, path),
            data=body,
            headers=headers,
            method=method,
        )
        try:
            with urlopen(request, timeout=settings.SUPABASE_REST_TIMEOUT_SECONDS) as response:
                return json.loads(response.read().decode("utf-8") or "[]")
        except HTTPError as error:
            if error.code == 409:
                raise SourceMutationError(
                    code="admin_source_conflict",
                    message=(
                        "The requested protected mutation conflicts with current stewardship state."
                    ),
                    status=409,
                ) from error
            raise SourceMutationError(
                code="admin_source_store_unavailable",
                message="The protected stewardship store is temporarily unavailable.",
                status=503,
            ) from error
        except URLError as error:
            raise SourceMutationError(
                code="admin_source_store_unavailable",
                message="The protected stewardship store is temporarily unavailable.",
                status=503,
            ) from error


__all__ = ["SupabaseStewardshipRepository"]
