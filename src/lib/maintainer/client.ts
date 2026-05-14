import {
  clearSupabaseSession,
  type SupabaseSession,
} from "@/lib/supabase/browser-client"

import { MaintainerApiError, parseMaintainerEnvelope } from "./envelope"

export async function fetchMaintainerJson<T>(
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
