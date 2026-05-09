from __future__ import annotations

from typing import Any

from django.core.files.uploadedfile import UploadedFile

from sources import repository
from sources.dtos import (
    ChunkDetailDto,
    CitationDetailDto,
    LifecycleState,
    SourceChunksInspectionDto,
    SourceCitationsInspectionDto,
    SourceDetailDto,
    SourceMutationResult,
    StewardshipDashboardDto,
    StewardshipEventDto,
)


def get_stewardship_dashboard() -> StewardshipDashboardDto:
    return repository.get_stewardship_dashboard()


def get_source_detail(source_id: str) -> SourceDetailDto | None:
    return repository.get_source_detail(source_id)


def get_source_chunks(source_id: str) -> SourceChunksInspectionDto | None:
    return repository.get_source_chunks(source_id)


def get_source_citations(source_id: str) -> SourceCitationsInspectionDto | None:
    return repository.get_source_citations(source_id)


def get_chunk_detail(chunk_id: str) -> ChunkDetailDto | None:
    return repository.get_chunk_detail(chunk_id)


def get_citation_detail(citation_id: str) -> CitationDetailDto | None:
    return repository.get_citation_detail(citation_id)


def list_ingestion_runs() -> list[StewardshipEventDto]:
    return get_stewardship_dashboard()["ingestionRuns"]


def list_validation_runs() -> list[StewardshipEventDto]:
    return get_stewardship_dashboard()["validationRuns"]


def list_audit_events() -> list[StewardshipEventDto]:
    return get_stewardship_dashboard()["auditEvents"]


def upload_source(
    *,
    uploaded_file: UploadedFile | None,
    metadata: dict[str, Any],
    actor: str,
) -> SourceMutationResult:
    return repository.upload_source(uploaded_file=uploaded_file, metadata=metadata, actor=actor)


def update_source_metadata(
    *, source_id: str, payload: dict[str, Any], actor: str
) -> SourceMutationResult:
    return repository.update_source_metadata(source_id=source_id, payload=payload, actor=actor)


def transition_source(
    *, source_id: str, target_state: LifecycleState, actor: str
) -> SourceMutationResult:
    return repository.transition_source(source_id=source_id, target_state=target_state, actor=actor)


def dispatch_ingest(*, source_id: str, actor: str) -> SourceMutationResult:
    return repository.dispatch_ingest(source_id=source_id, actor=actor)
