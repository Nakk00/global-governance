import type { SupabaseSession } from "@/lib/supabase/browser-client"

import type { AdminIdentity } from "./api"
import { fetchMaintainerJson } from "./client"

export type { AdminIdentity } from "./api"

export async function fetchAdminMe(session: SupabaseSession) {
  return fetchMaintainerJson<AdminIdentity>("/api/admin/me", session)
}
