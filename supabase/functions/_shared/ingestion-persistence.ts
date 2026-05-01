import type { IngestionPayload } from "./ingestion-types.ts"

export type IngestionPersistenceResult = {
  documentId: string
  chunkCount: number
  referenceCount: number
}

export async function persistIngestionPayload(
  payload: IngestionPayload
): Promise<IngestionPersistenceResult> {
  const { supabaseUrl, serviceRoleKey } = readSupabaseServiceConfig()

  const response = await fetch(
    `${supabaseUrl}/rest/v1/rpc/persist_ingestion_document`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ payload }),
    }
  )

  if (!response.ok) {
    throw new Error(`Ingestion persistence failed: ${response.status}`)
  }

  return {
    documentId: payload.document.id,
    chunkCount: payload.chunks.length,
    referenceCount: payload.references.length,
  }
}

export async function uploadPrivateSourceFile(params: {
  bucket: "project-source-pdfs"
  path: string
  bytes: Uint8Array
  contentType: string
}): Promise<void> {
  const { supabaseUrl, serviceRoleKey } = readSupabaseServiceConfig()
  const encodedPath = encodeStorageObjectPath(params.bucket, params.path)
  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${encodedPath}`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        "content-type": params.contentType,
        "x-upsert": "true",
      },
      body: params.bytes,
    }
  )

  if (!response.ok) {
    throw new Error(`Private source upload failed: ${response.status}`)
  }
}

export async function deletePrivateSourceFile(params: {
  bucket: "project-source-pdfs"
  path: string
}): Promise<void> {
  const { supabaseUrl, serviceRoleKey } = readSupabaseServiceConfig()
  const encodedPath = encodeStorageObjectPath(params.bucket, params.path)
  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${encodedPath}`,
    {
      method: "DELETE",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
      },
    }
  )

  if (!response.ok && response.status !== 404) {
    throw new Error(`Private source cleanup failed: ${response.status}`)
  }
}

function readSupabaseServiceConfig(): {
  supabaseUrl: string
  serviceRoleKey: string
} {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service configuration for ingestion")
  }

  return { supabaseUrl, serviceRoleKey }
}

function encodeStorageObjectPath(bucket: string, path: string): string {
  return [bucket, ...path.split("/").filter(Boolean)]
    .map(encodeURIComponent)
    .join("/")
}
