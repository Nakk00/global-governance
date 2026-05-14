import type { SupabaseSession } from "@/lib/supabase/browser-client"

import type {
  ChunkDetail,
  CitationDetail,
  SourceCitationsInspection,
  SourceChunksInspection,
  SourceDetail,
  StewardshipDashboard,
} from "./api"
import { fetchMaintainerJson } from "./client"

export type {
  ChunkDetail,
  ChunkRow,
  CitationDetail,
  CitationRow,
  InspectionAnchor,
  PartialDataMarker,
  NextAction,
  SourceCitationsInspection,
  SourceChunksInspection,
  SourceDetail,
  SourceInventoryItem,
  StewardshipDashboard,
  StewardshipEvent,
} from "./api"

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
