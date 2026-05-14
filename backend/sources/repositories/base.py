from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal, Protocol

from django.core.files.uploadedfile import UploadedFile

from sources.dtos import (
    AuditTrailSummaryDto,
    ChatbotTrustDto,
    ChunkDetailDto,
    ChunkRowDto,
    CitationDetailDto,
    CitationRowDto,
    IngestJobDto,
    InspectionAnchorDto,
    InspectionState,
    LifecycleState,
    NextActionDto,
    PartialDataMarker,
    ReadinessState,
    RunStatus,
    SourceChunksInspectionDto,
    SourceCitationsInspectionDto,
    SourceDetailDto,
    SourceInventoryItemDto,
    SourceMutationResult,
    StewardshipDashboardDto,
    StewardshipEventDto,
    StewardshipMonitoringDto,
    StewardshipOverviewDto,
)

MAX_SOURCE_UPLOAD_BYTES = 10 * 1024 * 1024
SUPPORTED_UPLOAD_EXTENSIONS = {".md", ".txt", ".pdf", ".csv"}
PRIVATE_SOURCE_BUCKET = "project-source-pdfs"
MetricTone = Literal["good", "warning", "critical", "neutral"]
ALLOWED_TRANSITIONS: dict[LifecycleState, set[LifecycleState]] = {
    "draft": {"approved", "archived"},
    "approved": {"active", "disabled", "archived"},
    "active": {"disabled", "archived"},
    "disabled": {"active", "archived"},
    "archived": set(),
}
INGESTABLE_STATES: set[LifecycleState] = {"approved", "active", "disabled"}


class SourceMutationError(ValueError):
    def __init__(
        self,
        *,
        code: str,
        message: str,
        status: int,
        fields: dict[str, str] | None = None,
    ) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status = status
        self.fields = fields or {}


@dataclass
class SourceRecord:
    source_id: str
    title: str
    source_type: str
    provenance: str
    summary: str
    usage_scope: list[str]
    aliases: list[str] = field(default_factory=list)
    lifecycle_state: LifecycleState = "draft"
    storage_path: str | None = None
    created_at: str | None = None
    updated_at: str | None = None


@dataclass(frozen=True)
class SourceSnapshot:
    source: SourceRecord
    latest_ingest_job: IngestJobDto | None
    ingest_jobs: list[IngestJobDto]
    audit_events: list[StewardshipEventDto]
    validation_events: list[StewardshipEventDto]


@dataclass(frozen=True)
class DocumentRecord:
    document_id: str
    source_id: str
    title: str
    source_path: str | None
    version: str
    created_at: str | None
    updated_at: str | None


@dataclass(frozen=True)
class ChunkRecord:
    chunk_id: str
    document_id: str
    source_id: str
    chunk_index: int
    content: str
    token_count: int
    embedding_present: bool
    metadata: dict[str, Any]
    created_at: str | None
    updated_at: str | None


@dataclass(frozen=True)
class CitationRecord:
    citation_id: str
    document_id: str
    source_id: str
    citation_label: str
    source_title: str
    source_path: str | None
    metadata: dict[str, Any]
    created_at: str | None
    updated_at: str | None


class StewardshipRepository(Protocol):
    def get_dashboard(self) -> StewardshipDashboardDto: ...

    def get_source_detail(self, source_id: str) -> SourceDetailDto | None: ...

    def get_source_chunks(self, source_id: str) -> SourceChunksInspectionDto | None: ...

    def get_source_citations(self, source_id: str) -> SourceCitationsInspectionDto | None: ...

    def get_chunk_detail(self, chunk_id: str) -> ChunkDetailDto | None: ...

    def get_citation_detail(self, citation_id: str) -> CitationDetailDto | None: ...

    def upload_source(
        self,
        *,
        uploaded_file: UploadedFile | None,
        metadata: dict[str, Any],
        actor: str,
    ) -> SourceMutationResult: ...

    def update_source_metadata(
        self,
        *,
        source_id: str,
        payload: dict[str, Any],
        actor: str,
    ) -> SourceMutationResult: ...

    def transition_source(
        self,
        *,
        source_id: str,
        target_state: LifecycleState,
        actor: str,
    ) -> SourceMutationResult: ...

    def dispatch_ingest(self, *, source_id: str, actor: str) -> SourceMutationResult: ...


__all__ = [
    "ALLOWED_TRANSITIONS",
    "AuditTrailSummaryDto",
    "ChatbotTrustDto",
    "ChunkDetailDto",
    "ChunkRecord",
    "ChunkRowDto",
    "CitationDetailDto",
    "CitationRecord",
    "CitationRowDto",
    "DocumentRecord",
    "INGESTABLE_STATES",
    "IngestJobDto",
    "InspectionAnchorDto",
    "InspectionState",
    "LifecycleState",
    "MAX_SOURCE_UPLOAD_BYTES",
    "MetricTone",
    "NextActionDto",
    "PartialDataMarker",
    "PRIVATE_SOURCE_BUCKET",
    "ReadinessState",
    "RunStatus",
    "SourceChunksInspectionDto",
    "SourceCitationsInspectionDto",
    "SourceDetailDto",
    "SourceInventoryItemDto",
    "SourceMutationError",
    "SourceMutationResult",
    "SourceRecord",
    "SourceSnapshot",
    "StewardshipDashboardDto",
    "StewardshipEventDto",
    "StewardshipMonitoringDto",
    "StewardshipOverviewDto",
    "StewardshipRepository",
    "SUPPORTED_UPLOAD_EXTENSIONS",
]
