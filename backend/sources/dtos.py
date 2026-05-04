from __future__ import annotations

from dataclasses import dataclass
from typing import Literal, TypedDict

LifecycleState = Literal["draft", "approved", "active", "disabled", "archived"]
ReadinessState = Literal["ready", "partial", "empty"]
RunStatus = Literal["succeeded", "warning", "failed", "queued"]


class PartialDataMarker(TypedDict):
    field: str
    reason: str


class StewardshipEventDto(TypedDict):
    eventId: str
    sourceId: str
    eventType: str
    origin: str
    occurredAt: str
    outcome: RunStatus
    summary: str


class IngestJobDto(TypedDict):
    jobId: str
    sourceId: str
    status: RunStatus
    requestedAt: str
    summary: str


class SourceInventoryItemDto(TypedDict):
    sourceId: str
    title: str
    sourceType: str
    lifecycleState: LifecycleState
    aliases: list[str]
    usageScope: list[str]
    provenance: str
    ingestionReadiness: ReadinessState
    latestValidationOutcome: RunStatus | None
    latestIngestJob: IngestJobDto | None
    partialData: list[PartialDataMarker]


class SourceDetailDto(SourceInventoryItemDto):
    summary: str
    metadata: dict[str, str | list[str]]
    approvalLineage: list[StewardshipEventDto]
    ingestionProvenance: list[StewardshipEventDto]
    validationHistory: list[StewardshipEventDto]
    auditTrail: list[StewardshipEventDto]


class StewardshipOverviewDto(TypedDict):
    sourceCount: int
    activeSourceCount: int
    draftSourceCount: int
    partialSourceCount: int
    latestIngestionStatus: RunStatus | None
    latestValidationStatus: RunStatus | None
    readinessState: ReadinessState


class StewardshipDashboardDto(TypedDict):
    overview: StewardshipOverviewDto
    sources: list[SourceInventoryItemDto]
    ingestionRuns: list[StewardshipEventDto]
    validationRuns: list[StewardshipEventDto]
    auditEvents: list[StewardshipEventDto]


class SourceMutationResult(TypedDict):
    source: SourceDetailDto
    dashboard: StewardshipDashboardDto


@dataclass(frozen=True)
class ApprovedSourceSeed:
    source_id: str
    title: str
    source_type: str
    provenance: str
    summary: str
    usage_scope: tuple[str, ...]
    aliases: tuple[str, ...] = ()
    lifecycle_state: LifecycleState = "active"
