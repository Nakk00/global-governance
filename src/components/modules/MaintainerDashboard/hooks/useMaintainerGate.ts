import { useCallback, useEffect, useState } from "react"

import { fetchAdminMe } from "@/lib/maintainer/api"
import {
  clearSupabaseSession,
  getSupabaseSession,
  isSupabaseSessionExpired,
} from "@/lib/supabase/browser-client"

import {
  mapGateError,
  type GateState,
} from "../shared/maintainerDashboardShared"

export function useMaintainerGate() {
  const [gate, setGate] = useState<GateState>({ state: "loading" })

  const resolveGate = useCallback(async () => {
    setGate({ state: "loading" })
    const session = getSupabaseSession()
    if (!session) {
      setGate({ state: "signedOut" })
      return
    }
    if (isSupabaseSessionExpired(session)) {
      clearSupabaseSession()
      setGate({ state: "expiredSession" })
      return
    }

    try {
      const identity = await fetchAdminMe(session)
      setGate({ state: "ready", identity, session })
    } catch (error) {
      setGate(mapGateError(error))
    }
  }, [])

  const signOut = useCallback(() => {
    clearSupabaseSession()
    setGate({ state: "signedOut" })
  }, [])

  useEffect(() => {
    // The access boundary has to hydrate from browser session storage first.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void resolveGate()
  }, [resolveGate])

  return { gate, setGate, resolveGate, signOut }
}
