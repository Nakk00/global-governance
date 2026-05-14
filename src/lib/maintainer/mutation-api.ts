import type { SupabaseSession } from "@/lib/supabase/browser-client"

import type {
  SourceMetadataPayload,
  SourceMutationResult,
  SourceUploadPayload,
} from "./api"
import { fetchMaintainerJson } from "./client"

export type {
  SourceMetadataPayload,
  SourceMutationResult,
  SourceUploadPayload,
} from "./api"

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
