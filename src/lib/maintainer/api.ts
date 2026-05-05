import {
  clearSupabaseSession,
  type SupabaseSession,
} from "@/lib/supabase/browser-client"

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

type ApiEnvelope<T> =
  | { success: true; data: T; error: null; meta: Record<string, unknown> }
  | {
      success: false
      data: null
      error: {
        code: string
        message: string
        status: number
        details?: { fields?: Record<string, string> }
      }
      meta: Record<string, unknown>
    }

export class MaintainerApiError extends Error {
  readonly code: string
  readonly status: number
  readonly fields: Record<string, string>

  constructor(
    code: string,
    status: number,
    message: string,
    fields: Record<string, string> = {}
  ) {
    super(message)
    this.code = code
    this.status = status
    this.fields = fields
  }
}

export async function fetchAdminMe(session: SupabaseSession) {
  return fetchMaintainerJson<AdminIdentity>("/api/admin/me", session)
}

export async function fetchStewardshipDashboard(session: SupabaseSession) {
  return fetchMaintainerJson<StewardshipDashboard>(
    "/api/admin/sources",
    session
  )
}

export async function fetchSourceDetail(
  sourceId: string,
  session: SupabaseSession
) {
  return fetchMaintainerJson<SourceDetail>(
    `/api/admin/sources/${encodeURIComponent(sourceId)}`,
    session
  )
}

export async function fetchSourceChunks(
  sourceId: string,
  session: SupabaseSession
) {
  return fetchMaintainerJson<SourceChunksInspection>(
    `/api/admin/sources/${encodeURIComponent(sourceId)}/chunks`,
    session
  )
}

export async function fetchSourceCitations(
  sourceId: string,
  session: SupabaseSession
) {
  return fetchMaintainerJson<SourceCitationsInspection>(
    `/api/admin/sources/${encodeURIComponent(sourceId)}/citations`,
    session
  )
}

export async function fetchChunkDetail(
  chunkId: string,
  session: SupabaseSession
) {
  return fetchMaintainerJson<ChunkDetail>(
    `/api/admin/chunks/${encodeURIComponent(chunkId)}`,
    session
  )
}

export async function fetchCitationDetail(
  citationId: string,
  session: SupabaseSession
) {
  return fetchMaintainerJson<CitationDetail>(
    `/api/admin/citations/${encodeURIComponent(citationId)}`,
    session
  )
}

export async function uploadSource(
  payload: SourceUploadPayload,
  session: SupabaseSession
) {
  const formData = new FormData()
  formData.set("file", payload.file)
  formData.set("sourceId", payload.sourceId)
  formData.set("title", payload.title)
  formData.set("sourceType", payload.sourceType)
  formData.set("provenance", payload.provenance)
  formData.set("summary", payload.summary)
  payload.usageScope.forEach((scope) => formData.append("usageScope", scope))

  return fetchMaintainerJson<SourceMutationResult>(
    "/api/admin/sources/upload",
    session,
    {
      method: "POST",
      body: formData,
    }
  )
}

export async function updateSourceMetadata(
  sourceId: string,
  payload: SourceMetadataPayload,
  session: SupabaseSession
) {
  return fetchMaintainerJson<SourceMutationResult>(
    `/api/admin/sources/${encodeURIComponent(sourceId)}`,
    session,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    }
  )
}

export async function mutateSourceLifecycle(
  sourceId: string,
  action: "approve" | "activate" | "disable" | "archive",
  session: SupabaseSession
) {
  return fetchMaintainerJson<SourceMutationResult>(
    `/api/admin/sources/${encodeURIComponent(sourceId)}/${action}`,
    session,
    { method: "POST" }
  )
}

export async function ingestSource(sourceId: string, session: SupabaseSession) {
  return fetchMaintainerJson<SourceMutationResult>(
    `/api/admin/sources/${encodeURIComponent(sourceId)}/ingest`,
    session,
    { method: "POST" }
  )
}

async function fetchMaintainerJson<T>(
  path: string,
  session: SupabaseSession,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      Accept: "application/json",
      ...init.headers,
    },
  })
  const payload = await parseMaintainerEnvelope<T>(response)

  if (!payload.success) {
    if (response.status === 401 || response.status === 403) {
      clearSupabaseSession()
    }
    throw new MaintainerApiError(
      payload.error.code,
      payload.error.status,
      payload.error.message,
      payload.error.details?.fields
    )
  }

  return payload.data
}

async function parseMaintainerEnvelope<T>(
  response: Response
): Promise<ApiEnvelope<T>> {
  try {
    const payload = (await response.json()) as unknown
    if (!isApiEnvelope(payload)) {
      throw new Error("malformed_envelope")
    }
    return payload as ApiEnvelope<T>
  } catch {
    return {
      success: false,
      data: null,
      error: {
        code: "admin_response_malformed",
        message: "The maintainer request returned an unreadable response.",
        status: response.status || 502,
      },
      meta: {},
    }
  }
}

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  if (!value || typeof value !== "object") {
    return false
  }

  const record = value as Record<string, unknown>

  if (!("success" in record) || typeof record.success !== "boolean") {
    return false
  }

  if (!("meta" in record) || !record.meta || typeof record.meta !== "object") {
    return false
  }

  if (record.success) {
    return "data" in record && "error" in record
  }

  const error = record.error

  return (
    "data" in record &&
    "error" in record &&
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    "message" in error &&
    "status" in error
  )
}
