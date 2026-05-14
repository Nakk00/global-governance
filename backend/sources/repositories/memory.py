from __future__ import annotations

from typing import Any, cast
from uuid import uuid4

from django.core.files.uploadedfile import UploadedFile

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
    StewardshipRepository,
)
from .mappers import (
    chunk_row as _chunk_row,
)
from .mappers import (
    citation_row as _citation_row,
)
from .mappers import (
    dashboard_from_snapshots as _dashboard_from_snapshots,
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
from .storage import build_storage_path as _build_storage_path
from .storage import read_uploaded_bytes as _read_uploaded_bytes

_TEST_REPOSITORY: StewardshipRepository | None = None


class InMemoryStewardshipRepository:
    def __init__(self) -> None:
        self._sources: dict[str, SourceRecord] = {
            seed.source_id: _source_from_seed(seed) for seed in APPROVED_SOURCE_SEEDS
        }
        self._jobs: dict[str, list[IngestJobDto]] = {}
        self._audit_events: dict[str, list[StewardshipEventDto]] = {}
        self._validation_events: dict[str, list[StewardshipEventDto]] = {}
        self._documents: dict[str, list[DocumentRecord]] = {}
        self._chunks: dict[str, list[ChunkRecord]] = {}
        self._citations: dict[str, list[CitationRecord]] = {}
        self._reference_chunks: dict[str, list[str]] = {}

    def get_dashboard(self) -> StewardshipDashboardDto:
        snapshots = self._snapshots()
        return _dashboard_from_snapshots(snapshots)

    def get_source_detail(self, source_id: str) -> SourceDetailDto | None:
        snapshot = self._find_snapshot(source_id)
        return _source_detail(snapshot) if snapshot else None

    def get_source_chunks(self, source_id: str) -> SourceChunksInspectionDto | None:
        snapshot = self._find_snapshot(source_id)
        if snapshot is None:
            return None
        document = self._latest_document(snapshot.source.source_id)
        chunks = (
            sorted(self._chunks.get(document.document_id, []), key=lambda chunk: chunk.chunk_index)
            if document
            else []
        )
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
        citations = self._citations.get(document.document_id, []) if document else []
        return cast(
            SourceCitationsInspectionDto,
            {
                "anchor": _inspection_anchor(snapshot, document, "citation"),
                "citations": [
                    _citation_row(
                        citation,
                        self._reference_chunks.get(citation.citation_id, []),
                        _inspection_state(snapshot, document, citation),
                    )
                    for citation in citations
                ],
                "partialData": _inspection_partial_data(snapshot, document, citations),
            },
        )

    def get_chunk_detail(self, chunk_id: str) -> ChunkDetailDto | None:
        chunk = next(
            (
                item
                for chunks in self._chunks.values()
                for item in chunks
                if item.chunk_id == chunk_id
            ),
            None,
        )
        if chunk is None:
            return None
        snapshot = self._require_snapshot(chunk.source_id)
        document = self._latest_document(snapshot.source.source_id)
        linked_citation_ids = [
            citation_id
            for citation_id, chunk_ids in self._reference_chunks.items()
            if chunk.chunk_id in chunk_ids
        ]
        return {
            **_chunk_row(chunk, _inspection_state(snapshot, document, chunk)),
            "content": chunk.content,
            "linkedCitationIds": linked_citation_ids,
            "createdAt": chunk.created_at,
            "updatedAt": chunk.updated_at,
        }

    def get_citation_detail(self, citation_id: str) -> CitationDetailDto | None:
        citation = next(
            (
                item
                for citations in self._citations.values()
                for item in citations
                if item.citation_id == citation_id
            ),
            None,
        )
        if citation is None:
            return None
        snapshot = self._require_snapshot(citation.source_id)
        document = self._latest_document(snapshot.source.source_id)
        linked_chunk_ids = self._reference_chunks.get(citation.citation_id, [])
        linked_chunks = [
            chunk
            for chunk in self._chunks.get(citation.document_id, [])
            if chunk.chunk_id in linked_chunk_ids
        ]
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
        _ensure_source_id_available(source_id, self._sources)
        storage_path = _build_storage_path(source_id, uploaded_file.name or "source-file")
        _read_uploaded_bytes(uploaded_file)
        record = SourceRecord(
            source_id=source_id,
            title=title,
            source_type=source_type,
            provenance=provenance,
            summary=summary,
            usage_scope=usage_scope,
            lifecycle_state="draft",
            storage_path=storage_path,
            created_at=_now(),
            updated_at=_now(),
        )
        self._sources[source_id] = record
        self._add_audit_event(
            source_id,
            event_type="upload",
            actor=actor,
            outcome="succeeded",
            summary="Uploaded as draft and inactive.",
        )
        return _mutation_result(self._snapshots(), source_id)

    def update_source_metadata(
        self,
        *,
        source_id: str,
        payload: dict[str, Any],
        actor: str,
    ) -> SourceMutationResult:
        snapshot = self._require_snapshot(source_id)
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
        source.title = title
        source.provenance = provenance
        source.summary = summary
        source.usage_scope = usage_scope
        if "sourceType" in payload:
            cleaned_type = _clean_text(payload["sourceType"])
            if cleaned_type:
                source.source_type = cleaned_type
        source.updated_at = _now()
        self._add_audit_event(
            source.source_id,
            event_type="edit",
            actor=actor,
            outcome="succeeded",
            summary="Updated source metadata.",
        )
        return _mutation_result(self._snapshots(), source.source_id)

    def transition_source(
        self,
        *,
        source_id: str,
        target_state: LifecycleState,
        actor: str,
    ) -> SourceMutationResult:
        snapshot = self._require_snapshot(source_id)
        _validate_transition(snapshot, target_state)
        snapshot.source.lifecycle_state = target_state
        snapshot.source.updated_at = _now()
        self._add_audit_event(
            source_id=snapshot.source.source_id,
            event_type=_lifecycle_event_type(target_state),
            actor=actor,
            outcome="succeeded",
            summary=f"Moved source to {target_state}.",
        )
        return _mutation_result(self._snapshots(), snapshot.source.source_id)

    def dispatch_ingest(self, *, source_id: str, actor: str) -> SourceMutationResult:
        snapshot = self._require_snapshot(source_id)
        _validate_ingest_request(snapshot)
        is_reingest = len(snapshot.ingest_jobs) > 0
        event_type = "re-ingest" if is_reingest else "ingest"
        now = _now()
        queued_job: IngestJobDto = {
            "jobId": f"ingest-{uuid4().hex[:12]}",
            "sourceId": snapshot.source.source_id,
            "status": "queued",
            "requestedAt": now,
            "summary": "Protected ingest request accepted for processing.",
        }
        self._jobs.setdefault(snapshot.source.source_id, []).insert(0, queued_job)
        self._add_audit_event(
            source_id=snapshot.source.source_id,
            event_type=event_type,
            actor=actor,
            outcome="queued",
            summary=queued_job["summary"],
        )
        completed_job: IngestJobDto = {
            **queued_job,
            "status": "succeeded",
            "summary": "Protected ingest request completed and is ready for activation.",
        }
        self._jobs[snapshot.source.source_id][0] = completed_job
        self._persist_demo_inspection_records(snapshot.source, len(snapshot.ingest_jobs) + 1)
        self._add_audit_event(
            source_id=snapshot.source.source_id,
            event_type=event_type,
            actor=actor,
            outcome="succeeded",
            summary=completed_job["summary"],
        )
        return _mutation_result(self._snapshots(), snapshot.source.source_id)

    def _latest_document(self, source_id: str) -> DocumentRecord | None:
        documents = self._documents.get(source_id, [])
        return (
            sorted(
                documents,
                key=lambda document: document.updated_at or document.created_at or "",
                reverse=True,
            )[0]
            if documents
            else None
        )

    def _persist_demo_inspection_records(self, source: SourceRecord, revision: int) -> None:
        now = _now()
        document = DocumentRecord(
            document_id=f"doc-{source.source_id}-v{revision}",
            source_id=source.source_id,
            title=source.title,
            source_path=source.storage_path,
            version=f"v{revision}",
            created_at=now,
            updated_at=now,
        )
        chunk = ChunkRecord(
            chunk_id=f"chunk-{source.source_id}-v{revision}-0",
            document_id=document.document_id,
            source_id=source.source_id,
            chunk_index=0,
            content=f"{source.title}: {source.summary}",
            token_count=max(8, len(source.summary.split()) + len(source.title.split())),
            embedding_present=True,
            metadata={"heading": "Source summary", "pageNumber": 1},
            created_at=now,
            updated_at=now,
        )
        citation = CitationRecord(
            citation_id=f"ref-{source.source_id}-v{revision}",
            document_id=document.document_id,
            source_id=source.source_id,
            citation_label=source.title,
            source_title=source.title,
            source_path=source.storage_path,
            metadata={"sectionHeading": "Source summary"},
            created_at=now,
            updated_at=now,
        )
        self._documents.setdefault(source.source_id, []).append(document)
        self._chunks[document.document_id] = [chunk]
        self._citations[document.document_id] = [citation]
        self._reference_chunks[citation.citation_id] = [chunk.chunk_id]

    def _snapshots(self) -> dict[str, SourceSnapshot]:
        snapshots: dict[str, SourceSnapshot] = {}
        for source_id, source in self._sources.items():
            audit_events = sorted(
                self._audit_events.get(source_id, []),
                key=lambda event: event["occurredAt"],
                reverse=True,
            )
            ingest_jobs = sorted(
                self._jobs.get(source_id, []),
                key=lambda job: job["requestedAt"],
                reverse=True,
            )
            validation_events = sorted(
                self._validation_events.get(source_id, []),
                key=lambda event: event["occurredAt"],
                reverse=True,
            )
            snapshots[source_id] = SourceSnapshot(
                source=source,
                latest_ingest_job=ingest_jobs[0] if ingest_jobs else None,
                ingest_jobs=ingest_jobs,
                audit_events=audit_events,
                validation_events=validation_events,
            )
        return snapshots

    def _find_snapshot(self, source_id: str) -> SourceSnapshot | None:
        snapshots = self._snapshots()
        if source_id in snapshots:
            return snapshots[source_id]
        return next(
            (snapshot for snapshot in snapshots.values() if source_id in snapshot.source.aliases),
            None,
        )

    def _require_snapshot(self, source_id: str) -> SourceSnapshot:
        snapshot = self._find_snapshot(source_id)
        if snapshot is None:
            raise SourceMutationError(
                code="admin_source_not_found",
                message="The requested approved source was not found.",
                status=404,
            )
        return snapshot

    def _add_audit_event(
        self,
        source_id: str,
        *,
        event_type: str,
        actor: str,
        outcome: str,
        summary: str,
    ) -> None:
        event: StewardshipEventDto = {
            "eventId": f"audit-{uuid4().hex[:12]}",
            "sourceId": source_id,
            "eventType": event_type,
            "origin": actor,
            "occurredAt": _now(),
            "outcome": cast(Any, outcome),
            "summary": summary,
        }
        self._audit_events.setdefault(source_id, []).insert(0, event)


def get_test_repository() -> StewardshipRepository | None:
    return _TEST_REPOSITORY


def reset_stewardship_state() -> None:
    global _TEST_REPOSITORY
    _TEST_REPOSITORY = InMemoryStewardshipRepository()


__all__ = [
    "InMemoryStewardshipRepository",
    "get_test_repository",
    "reset_stewardship_state",
]
