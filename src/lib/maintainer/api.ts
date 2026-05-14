export type AdminIdentity = {
  userId: string
  email: string
  role: string
  isActive: boolean
}

export type PartialDataMarker = {
  field: string
  reason: string
}

export type StewardshipEvent = {
  eventId: string
  sourceId: string
  eventType: string
  origin: string
  occurredAt: string
  outcome: "succeeded" | "warning" | "failed" | "queued"
  summary: string
}

export type MonitoringMetric = {
  label: string
  value: string
  tone: "good" | "warning" | "critical" | "neutral"
  detail: string
}

export type NextAction = {
  label: string
  detail: string
  href: string
  priority: "high" | "medium" | "low"
}

export type SourceLifecycleState =
  | "draft"
  | "approved"
  | "active"
  | "disabled"
  | "archived"

export type IngestJob = {
  jobId: string
  sourceId: string
  status: StewardshipEvent["outcome"]
  requestedAt: string
  summary: string
}

export type SourceInventoryItem = {
  sourceId: string
  title: string
  sourceType: string
  lifecycleState: SourceLifecycleState
  createdAt?: string | null
  updatedAt?: string | null
  aliases: string[]
  usageScope: string[]
  provenance: string
  ingestionReadiness: "ready" | "partial" | "empty"
  latestValidationOutcome: StewardshipEvent["outcome"] | null
  latestIngestJob: IngestJob | null
  partialData: PartialDataMarker[]
}

export type SourceDetail = SourceInventoryItem & {
  summary: string
  metadata: Record<string, string | string[]>
  approvalLineage: StewardshipEvent[]
  ingestionProvenance: StewardshipEvent[]
  validationHistory: StewardshipEvent[]
  auditTrail: StewardshipEvent[]
}

export type StewardshipDashboard = {
  overview: {
    sourceCount: number
    activeSourceCount: number
    draftSourceCount: number
    partialSourceCount: number
    latestIngestionStatus: StewardshipEvent["outcome"] | null
    latestValidationStatus: StewardshipEvent["outcome"] | null
    readinessState: "ready" | "partial" | "empty"
  }
  monitoring: {
    readiness: MonitoringMetric
    blockers: MonitoringMetric
    validationHealth: MonitoringMetric
    nextActions: NextAction[]
  }
  auditTrail: {
    totalEvents: number
    latestOutcome: StewardshipEvent["outcome"] | null
    latestEventAt: string | null
    recentEvents: StewardshipEvent[]
  }
  chatbotTrust: {
    state: "ready" | "partial" | "empty"
    groundedSourceCount: number
    validationRunCount: number
    latestValidationStatus: StewardshipEvent["outcome"] | null
    warningCount: number
    failedCount: number
    evidence: MonitoringMetric[]
  }
  sources: SourceInventoryItem[]
  ingestionRuns: StewardshipEvent[]
  validationRuns: StewardshipEvent[]
  auditEvents: StewardshipEvent[]
}

export type SourceMutationResult = {
  source: SourceDetail
  dashboard: StewardshipDashboard
}

export type InspectionState =
  | "empty"
  | "partial"
  | "stale"
  | "inactive"
  | "ready"
  | "unavailable"

export type InspectionAnchor = {
  documentId: string | null
  version: string | null
  sourceId: string
  state: InspectionState
  message: string
  nextStep: string
}

export type ChunkRow = {
  id: string
  documentId: string
  sourceId: string
  chunkIndex: number
  tokenCount: number
  contentPreview: string
  embeddingPresent: boolean
  activeState: InspectionState
  pageNumber: number | null
  heading: string | null
  metadata: Record<string, unknown>
}

export type ChunkDetail = ChunkRow & {
  content: string
  linkedCitationIds: string[]
  createdAt: string | null
  updatedAt: string | null
}

export type CitationRow = {
  id: string
  documentId: string
  sourceId: string
  citationLabel: string
  displayLabel: string
  linkedChunkIds: string[]
  activeState: InspectionState
  pageNumber: number | null
  sectionHeading: string | null
  metadata: Record<string, unknown>
}

export type CitationDetail = CitationRow & {
  sourceTitle: string
  sourcePath: string | null
  copyableLabel: string
  linkedChunks: ChunkRow[]
}

export type SourceChunksInspection = {
  anchor: InspectionAnchor
  chunks: ChunkRow[]
  partialData: PartialDataMarker[]
}

export type SourceCitationsInspection = {
  anchor: InspectionAnchor
  citations: CitationRow[]
  partialData: PartialDataMarker[]
}

export type SourceUploadPayload = {
  file: File
  sourceId: string
  title: string
  sourceType: string
  provenance: string
  summary: string
  usageScope: string[]
}

export type SourceMetadataPayload = {
  title: string
  sourceType: string
  provenance: string
  summary: string
  usageScope: string[]
}

export type ValidationRunStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"

export type ValidationOutcome =
  | "pass"
  | "weakSupport"
  | "refused"
  | "failed"
  | "error"

export type ValidationSet = {
  validationSetId: string
  name: string
  description: string
  version: number
  isDefault: boolean
  questionCount: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type ValidationSetList = {
  sets: ValidationSet[]
  defaultSetId: string | null
}

export type ValidationResult = {
  resultId: string
  validationQuestionId: string
  questionText: string
  expectedState: "grounded" | "weakSupport" | "refused"
  actualState: string
  outcome: ValidationOutcome
  answerPreview: string
  retrievedSourceIds: string[]
  citationIds: string[]
  supportScore: number | null
  latencyMs: number | null
  notes: string
  createdAt: string
}

export type ValidationRunSummary = {
  runId: string
  validationSetId: string
  validationSetName: string
  validationSetVersion: number
  status: ValidationRunStatus | (string & {})
  totalCount: number
  passCount: number
  weakSupportCount: number
  refusedCount: number
  failedCount: number
  errorCount: number
  averageLatencyMs: number | null
  createdBy: string
  createdAt: string
  startedAt: string | null
  completedAt: string | null
  sourceSnapshotIds: string[]
  state: "empty" | "stale" | "partial" | "ready" | (string & {})
  notes: string
}

export type ValidationRunList = {
  runs: ValidationRunSummary[]
}

export type ValidationRunDetail = ValidationRunSummary & {
  results: ValidationResult[]
  auditEvents: {
    eventId: string
    runId: string
    eventType: "launch" | "completion" | "failure"
    origin: string
    occurredAt: string
    summary: string
  }[]
}

export { MaintainerApiError } from "./envelope"
export { fetchAdminMe } from "./auth-api"
export {
  fetchChunkDetail,
  fetchCitationDetail,
  fetchSourceCitations,
  fetchSourceChunks,
  fetchSourceDetail,
  fetchStewardshipDashboard,
} from "./source-api"
export {
  fetchValidationRunDetail,
  fetchValidationRuns,
  fetchValidationSets,
  launchValidationRun,
} from "./validation-api"
export {
  ingestSource,
  mutateSourceLifecycle,
  updateSourceMetadata,
  uploadSource,
} from "./mutation-api"
