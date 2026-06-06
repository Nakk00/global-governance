from __future__ import annotations

from dataclasses import dataclass
from typing import Literal, NotRequired, TypedDict

LifecycleState = Literal["draft", "approved", "active", "disabled", "archived"]
ReadinessState = Literal["ready", "partial", "empty"]
RunStatus = Literal["succeeded", "warning", "failed", "queued", "processing"]
InspectionState = Literal["empty", "partial", "stale", "inactive", "ready", "unavailable"]


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
    startedAt: NotRequired[str | None]
    completedAt: NotRequired[str | None]
    documentId: NotRequired[str | None]
    chunkCount: NotRequired[int | None]
    referenceCount: NotRequired[int | None]
    embeddingModel: NotRequired[str | None]
    embeddingDimensions: NotRequired[int | None]
    errorCode: NotRequired[str | None]


class SourceInventoryItemDto(TypedDict):
    sourceId: str
    title: str
    sourceType: str
    lifecycleState: LifecycleState
    createdAt: str | None
    updatedAt: str | None
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


class MonitoringMetricDto(TypedDict):
    label: str
    value: str
    tone: Literal["good", "warning", "critical", "neutral"]
    detail: str


class NextActionDto(TypedDict):
    label: str
    detail: str
    href: str
    priority: Literal["high", "medium", "low"]


class StewardshipMonitoringDto(TypedDict):
    readiness: MonitoringMetricDto
    blockers: MonitoringMetricDto
    validationHealth: MonitoringMetricDto
    nextActions: list[NextActionDto]


class AuditTrailSummaryDto(TypedDict):
    totalEvents: int
    latestOutcome: RunStatus | None
    latestEventAt: str | None
    recentEvents: list[StewardshipEventDto]


class ChatbotTrustDto(TypedDict):
    state: ReadinessState
    groundedSourceCount: int
    validationRunCount: int
    latestValidationStatus: RunStatus | None
    warningCount: int
    failedCount: int
    evidence: list[MonitoringMetricDto]


class StewardshipDashboardDto(TypedDict):
    overview: StewardshipOverviewDto
    monitoring: StewardshipMonitoringDto
    auditTrail: AuditTrailSummaryDto
    chatbotTrust: ChatbotTrustDto
    sources: list[SourceInventoryItemDto]
    ingestionRuns: list[StewardshipEventDto]
    validationRuns: list[StewardshipEventDto]
    auditEvents: list[StewardshipEventDto]


class SourceMutationResult(TypedDict):
    source: SourceDetailDto
    dashboard: StewardshipDashboardDto


class InspectionAnchorDto(TypedDict):
    documentId: str | None
    version: str | None
    sourceId: str
    state: InspectionState
    message: str
    nextStep: str


class ChunkRowDto(TypedDict):
    id: str
    documentId: str
    sourceId: str
    chunkIndex: int
    tokenCount: int
    contentPreview: str
    embeddingPresent: bool
    activeState: InspectionState
    pageNumber: int | None
    heading: str | None
    metadata: dict[str, object]


class ChunkDetailDto(ChunkRowDto):
    content: str
    linkedCitationIds: list[str]
    createdAt: str | None
    updatedAt: str | None


class CitationRowDto(TypedDict):
    id: str
    documentId: str
    sourceId: str
    citationLabel: str
    displayLabel: str
    linkedChunkIds: list[str]
    activeState: InspectionState
    pageNumber: int | None
    sectionHeading: str | None
    metadata: dict[str, object]


class CitationDetailDto(CitationRowDto):
    sourceTitle: str
    sourcePath: str | None
    copyableLabel: str
    linkedChunks: list[ChunkRowDto]


class SourceChunksInspectionDto(TypedDict):
    anchor: InspectionAnchorDto
    chunks: list[ChunkRowDto]
    partialData: list[PartialDataMarker]


class SourceCitationsInspectionDto(TypedDict):
    anchor: InspectionAnchorDto
    citations: list[CitationRowDto]
    partialData: list[PartialDataMarker]


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
