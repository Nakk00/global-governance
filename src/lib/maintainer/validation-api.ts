import type { SupabaseSession } from "@/lib/supabase/browser-client"

import type {
  ValidationRunDetail,
  ValidationRunList,
  ValidationSetList,
} from "./api"
import { fetchMaintainerJson } from "./client"

export type {
  ValidationRunDetail,
  ValidationRunList,
  ValidationSetList,
} from "./api"

export async function fetchValidationSets(session: SupabaseSession) {
  return fetchMaintainerJson<ValidationSetList>(
    "/api/admin/validation-sets",
    session
  )
}

export async function fetchValidationRuns(session: SupabaseSession) {
  return fetchMaintainerJson<ValidationRunList>(
    "/api/admin/validation-runs",
    session
  )
}

export async function fetchValidationRunDetail(
  runId: string,
  session: SupabaseSession
) {
  return fetchMaintainerJson<ValidationRunDetail>(
    `/api/admin/validation-runs/${encodeURIComponent(runId)}`,
    session
  )
}

export async function launchValidationRun(
  validationSetId: string,
  session: SupabaseSession
) {
  return fetchMaintainerJson<ValidationRunDetail>(
    "/api/admin/validation-runs",
    session,
    {
      method: "POST",
      body: JSON.stringify({ validationSetId }),
      headers: { "Content-Type": "application/json" },
    }
  )
}
