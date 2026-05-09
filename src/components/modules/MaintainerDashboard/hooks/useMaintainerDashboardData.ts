import { useCallback, useEffect, useRef, useState } from "react"

import {
  fetchSourceDetail,
  fetchStewardshipDashboard,
  ingestSource,
  MaintainerApiError,
  mutateSourceLifecycle,
  updateSourceMetadata,
  uploadSource,
  type SourceMetadataPayload,
  type SourceMutationResult,
  type SourceUploadPayload,
} from "@/lib/maintainer/api"

import {
  handleMaintainerReadAuthFailure,
  mutationErrorState,
  type DashboardState,
  type DetailState,
  type GateState,
  type MaintainerRoute,
  type MutationMode,
  type MutationState,
} from "../shared/maintainerDashboardShared"

type UseMaintainerDashboardDataArgs = {
  gate: GateState
  route: MaintainerRoute
  setGate: (gate: GateState) => void
  navigateTo: (path: string) => void
}

export function useMaintainerDashboardData({
  gate,
  route,
  setGate,
  navigateTo,
}: UseMaintainerDashboardDataArgs) {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    state: "loading",
  })
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [detailState, setDetailState] = useState<DetailState>({ state: "idle" })
  const [mutationState, setMutationState] = useState<MutationState>({
    state: "idle",
  })
  const dashboardRequestKeyRef = useRef(0)
  const detailRequestKeyRef = useRef(0)

  const loadSourceDetail = useCallback(
    async (sourceId: string) => {
      if (gate.state !== "ready") {
        return
      }

      const requestKey = ++detailRequestKeyRef.current
      setDetailState({ state: "loading" })
      try {
        const source = await fetchSourceDetail(sourceId, gate.session)
        if (requestKey !== detailRequestKeyRef.current) {
          return
        }
        setDetailState({ state: "ready", source })
      } catch (error) {
        if (requestKey !== detailRequestKeyRef.current) {
          return
        }
        if (handleMaintainerReadAuthFailure(error, setGate)) {
          setDetailState({ state: "idle" })
          return
        }
        if (error instanceof MaintainerApiError && error.status === 404) {
          setDetailState({ state: "empty", message: error.message })
          return
        }
        setDetailState({
          state: "outage",
          message:
            error instanceof Error
              ? error.message
              : "The source history could not load.",
        })
      }
    },
    [gate, setGate]
  )

  const loadDashboard = useCallback(async () => {
    if (gate.state !== "ready") {
      return
    }

    const requestKey = ++dashboardRequestKeyRef.current
    setDashboardState({ state: "loading" })
    try {
      const dashboard = await fetchStewardshipDashboard(gate.session)
      if (requestKey !== dashboardRequestKeyRef.current) {
        return
      }
      setDashboardState(
        dashboard.sources.length
          ? { state: "ready", dashboard }
          : { state: "empty" }
      )
      setSelectedSourceId((currentSourceId) =>
        currentSourceId &&
        dashboard.sources.some((source) => source.sourceId === currentSourceId)
          ? currentSourceId
          : (dashboard.sources[0]?.sourceId ?? null)
      )
    } catch (error) {
      if (requestKey !== dashboardRequestKeyRef.current) {
        return
      }
      if (handleMaintainerReadAuthFailure(error, setGate)) {
        return
      }
      setDashboardState({
        state: "outage",
        message:
          error instanceof Error
            ? error.message
            : "The stewardship dashboard could not load.",
      })
    }
  }, [gate, setGate])

  useEffect(() => {
    // Dashboard data is pulled only after the authoritative admin gate resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    if (gate.state !== "ready") {
      return
    }
    if (route.section === "sourceDetail") {
      // Source detail is a follow-up backend read keyed by the routed selection.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadSourceDetail(route.sourceId)
      return
    }
    detailRequestKeyRef.current += 1
    setDetailState({ state: "idle" })
  }, [gate, loadSourceDetail, route])

  const applyMutationResult = useCallback(
    (result: SourceMutationResult, message: string) => {
      dashboardRequestKeyRef.current += 1
      detailRequestKeyRef.current += 1
      setDashboardState({ state: "ready", dashboard: result.dashboard })
      setSelectedSourceId(result.source.sourceId)
      setDetailState({ state: "ready", source: result.source })
      setMutationState({ state: "succeeded", message })
      navigateTo(
        `/maintainer/sources/${encodeURIComponent(result.source.sourceId)}`
      )
    },
    [navigateTo]
  )

  const runMutation = useCallback(
    async (
      mode: MutationMode,
      action: () => Promise<SourceMutationResult>,
      successMessage: string
    ) => {
      setMutationState({ state: "submitting", mode })
      try {
        applyMutationResult(await action(), successMessage)
      } catch (error) {
        if (handleMaintainerReadAuthFailure(error, setGate)) {
          setMutationState({
            state: "failed",
            message: "Sign in again to continue protected source stewardship.",
            retryable: false,
            fields: {},
          })
          return
        }
        setMutationState(mutationErrorState(error))
      }
    },
    [applyMutationResult, setGate]
  )

  const uploadDraft = useCallback(
    async (payload: SourceUploadPayload) => {
      if (gate.state !== "ready") {
        return
      }
      await runMutation(
        "upload",
        () => uploadSource(payload, gate.session),
        "Source uploaded as draft and inactive."
      )
    },
    [gate, runMutation]
  )

  const updateSource = useCallback(
    async (sourceId: string, payload: SourceMetadataPayload) => {
      if (gate.state !== "ready") {
        return
      }
      await runMutation(
        "edit",
        () => updateSourceMetadata(sourceId, payload, gate.session),
        "Source metadata updated."
      )
    },
    [gate, runMutation]
  )

  const runLifecycleAction = useCallback(
    async (
      sourceId: string,
      action: "approve" | "activate" | "disable" | "archive"
    ) => {
      if (gate.state !== "ready") {
        return
      }
      await runMutation(
        action,
        () => mutateSourceLifecycle(sourceId, action, gate.session),
        `Source ${action} request completed.`
      )
    },
    [gate, runMutation]
  )

  const queueIngest = useCallback(
    async (sourceId: string) => {
      if (gate.state !== "ready") {
        return
      }
      await runMutation(
        "ingest",
        () => ingestSource(sourceId, gate.session),
        "Protected ingest request queued."
      )
    },
    [gate, runMutation]
  )

  const resetData = useCallback(() => {
    dashboardRequestKeyRef.current += 1
    detailRequestKeyRef.current += 1
    setDashboardState({ state: "loading" })
    setSelectedSourceId(null)
    setDetailState({ state: "idle" })
    setMutationState({ state: "idle" })
  }, [])

  return {
    dashboardState,
    detailState,
    mutationState,
    selectedSourceId,
    setSelectedSourceId,
    retryDashboard: loadDashboard,
    retrySourceDetail: loadSourceDetail,
    uploadDraft,
    updateSource,
    runLifecycleAction,
    queueIngest,
    resetData,
  }
}
