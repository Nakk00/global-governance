from __future__ import annotations

from collections.abc import Callable
from typing import Any, TypeVar

from django.conf import settings
from django.core.files.uploadedfile import UploadedFile

from .base import (
    ChunkDetailDto,
    ChunkRecord,
    CitationDetailDto,
    CitationRecord,
    DocumentRecord,
    LifecycleState,
    SourceChunksInspectionDto,
    SourceCitationsInspectionDto,
    SourceDetailDto,
    SourceMutationError,
    SourceMutationResult,
    SourceRecord,
    SourceSnapshot,
    StewardshipDashboardDto,
    StewardshipRepository,
)
from .memory import (
    InMemoryStewardshipRepository,
    get_test_repository,
)
from .memory import (
    reset_stewardship_state as _reset_stewardship_state,
)
from .seeds import APPROVED_SOURCE_SEEDS, source_from_seed
from .supabase import SupabaseStewardshipRepository

T = TypeVar("T")

_RUNTIME_FALLBACK_REPOSITORY: InMemoryStewardshipRepository | None = None


def _repository() -> StewardshipRepository:
    test_repository = get_test_repository()
    if test_repository is not None:
        return test_repository
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY:
        return SupabaseStewardshipRepository(
            supabase_url=settings.SUPABASE_URL,
            service_role_key=settings.SUPABASE_SERVICE_ROLE_KEY,
        )
    return InMemoryStewardshipRepository()


def _runtime_fallback_repository() -> InMemoryStewardshipRepository:
    global _RUNTIME_FALLBACK_REPOSITORY
    if _RUNTIME_FALLBACK_REPOSITORY is None:
        _RUNTIME_FALLBACK_REPOSITORY = InMemoryStewardshipRepository()
    return _RUNTIME_FALLBACK_REPOSITORY


def _with_runtime_fallback(action: Callable[[StewardshipRepository], T]) -> T:
    repository = _repository()
    try:
        return action(repository)
    except SourceMutationError as error:
        if _should_use_runtime_fallback(error, repository):
            return action(_runtime_fallback_repository())
        raise


def _should_use_runtime_fallback(
    error: SourceMutationError,
    repository: StewardshipRepository,
) -> bool:
    return (
        isinstance(repository, SupabaseStewardshipRepository)
        and error.code in {"admin_source_store_missing", "admin_source_store_unavailable"}
    )


def get_stewardship_dashboard() -> StewardshipDashboardDto:
    return _with_runtime_fallback(lambda repository: repository.get_dashboard())


def get_source_detail(source_id: str) -> SourceDetailDto | None:
    return _with_runtime_fallback(lambda repository: repository.get_source_detail(source_id))


def get_source_chunks(source_id: str) -> SourceChunksInspectionDto | None:
    return _with_runtime_fallback(lambda repository: repository.get_source_chunks(source_id))


def get_source_citations(source_id: str) -> SourceCitationsInspectionDto | None:
    return _with_runtime_fallback(
        lambda repository: repository.get_source_citations(source_id)
    )


def get_chunk_detail(chunk_id: str) -> ChunkDetailDto | None:
    return _with_runtime_fallback(lambda repository: repository.get_chunk_detail(chunk_id))


def get_citation_detail(citation_id: str) -> CitationDetailDto | None:
    return _with_runtime_fallback(
        lambda repository: repository.get_citation_detail(citation_id)
    )


def upload_source(
    *,
    uploaded_file: UploadedFile | None,
    metadata: dict[str, Any],
    actor: str,
) -> SourceMutationResult:
    return _with_runtime_fallback(
        lambda repository: repository.upload_source(
            uploaded_file=uploaded_file,
            metadata=metadata,
            actor=actor,
        )
    )


def update_source_metadata(
    *, source_id: str, payload: dict[str, Any], actor: str
) -> SourceMutationResult:
    return _with_runtime_fallback(
        lambda repository: repository.update_source_metadata(
            source_id=source_id,
            payload=payload,
            actor=actor,
        )
    )


def transition_source(
    *, source_id: str, target_state: LifecycleState, actor: str
) -> SourceMutationResult:
    return _with_runtime_fallback(
        lambda repository: repository.transition_source(
            source_id=source_id,
            target_state=target_state,
            actor=actor,
        )
    )


def dispatch_ingest(*, source_id: str, actor: str) -> SourceMutationResult:
    return _with_runtime_fallback(
        lambda repository: repository.dispatch_ingest(source_id=source_id, actor=actor)
    )


def reset_stewardship_state() -> None:
    global _RUNTIME_FALLBACK_REPOSITORY
    _reset_stewardship_state()
    _RUNTIME_FALLBACK_REPOSITORY = None


__all__ = [
    "APPROVED_SOURCE_SEEDS",
    "ChunkDetailDto",
    "ChunkRecord",
    "CitationDetailDto",
    "CitationRecord",
    "DocumentRecord",
    "InMemoryStewardshipRepository",
    "LifecycleState",
    "SourceChunksInspectionDto",
    "SourceCitationsInspectionDto",
    "SourceDetailDto",
    "SourceMutationError",
    "SourceMutationResult",
    "SourceRecord",
    "SourceSnapshot",
    "StewardshipDashboardDto",
    "StewardshipRepository",
    "SupabaseStewardshipRepository",
    "dispatch_ingest",
    "get_citation_detail",
    "get_chunk_detail",
    "get_source_citations",
    "get_source_chunks",
    "get_source_detail",
    "get_stewardship_dashboard",
    "reset_stewardship_state",
    "source_from_seed",
    "transition_source",
    "update_source_metadata",
    "upload_source",
]
