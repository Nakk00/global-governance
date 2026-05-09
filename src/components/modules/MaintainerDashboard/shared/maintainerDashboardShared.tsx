/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useRef, useState } from "react"
import {
  Archive,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Eye,
  FileUp,
  Link2,
  Loader2,
  LogOut,
  Pencil,
  Play,
  RefreshCcw,
  ShieldCheck,
  Square,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MaintainerLogin } from "@/components/modules/MaintainerDashboard/MaintainerLogin"
import {
  fetchAdminMe,
  fetchChunkDetail,
  fetchCitationDetail,
  fetchValidationRunDetail,
  fetchValidationRuns,
  fetchValidationSets,
  fetchSourceChunks,
  fetchSourceCitations,
  fetchSourceDetail,
  fetchStewardshipDashboard,
  ingestSource,
  launchValidationRun,
  MaintainerApiError,
  mutateSourceLifecycle,
  updateSourceMetadata,
  uploadSource,
  type AdminIdentity,
  type ChunkDetail,
  type ChunkRow,
  type CitationDetail,
  type CitationRow,
  type InspectionAnchor,
  type PartialDataMarker,
  type SourceDetail,
  type SourceInventoryItem,
  type SourceLifecycleState,
  type SourceMetadataPayload,
  type SourceMutationResult,
  type SourceUploadPayload,
  type StewardshipDashboard,
  type StewardshipEvent,
  type ValidationResult,
  type ValidationRunDetail,
  type ValidationRunSummary,
  type ValidationSet,
} from "@/lib/maintainer/api"
import {
  clearSupabaseSession,
  getSupabaseSession,
  isSupabaseSessionExpired,
  type SupabaseSession,
} from "@/lib/supabase/browser-client"

export type GateState =
  | { state: "loading" }
  | { state: "signedOut" }
  | { state: "expiredSession" }
  | { state: "unauthorized"; message: string }
  | { state: "inactive"; message: string }
  | { state: "revokedSession"; message: string }
  | { state: "outage"; message: string }
  | { state: "ready"; identity: AdminIdentity; session: SupabaseSession }

export type DashboardState =
  | { state: "loading" }
  | { state: "empty" }
  | { state: "outage"; message: string }
  | { state: "ready"; dashboard: StewardshipDashboard }

export type MaintainerPreset =
  | "sources-needing-attention"
  | "validation-follow-up"
  | "operations-recent-activity"

export type MaintainerRoute =
  | { section: "overview"; path: string; preset: MaintainerPreset | null }
  | { section: "sources"; path: string; preset: MaintainerPreset | null }
  | { section: "sourceNew"; path: string; preset: MaintainerPreset | null }
  | {
      section: "sourceDetail"
      path: string
      preset: MaintainerPreset | null
      sourceId: string
    }
  | { section: "validation"; path: string; preset: MaintainerPreset | null }
  | { section: "operations"; path: string; preset: MaintainerPreset | null }

export type DetailState =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "empty"; message: string }
  | { state: "outage"; message: string }
  | { state: "ready"; source: SourceDetail }

export type MutationMode =
  | "upload"
  | "edit"
  | "approve"
  | "activate"
  | "disable"
  | "archive"
  | "ingest"

export type MutationState =
  | { state: "idle" }
  | { state: "submitting"; mode: MutationMode }
  | { state: "succeeded"; message: string }
  | {
      state: "failed"
      message: string
      retryable: boolean
      fields: Record<string, string>
    }

type ConfirmationState = {
  action: "disable" | "archive"
  sourceId: string
  title: string
} | null

type InspectorTab = "overview" | "chunks" | "citations" | "history"

type InspectionListState<T> =
  | { state: "idle" }
  | { state: "loading" }
  | {
      state: "ready"
      anchor: InspectionAnchor
      records: T[]
      partialData: PartialDataMarker[]
    }
  | {
      state: "empty"
      anchor: InspectionAnchor
      message: string
      partialData: PartialDataMarker[]
    }
  | { state: "outage"; message: string }

type InspectionDetailState =
  | { state: "idle" }
  | { state: "loading"; kind: "chunk" | "citation" }
  | { state: "ready"; kind: "chunk"; detail: ChunkDetail }
  | { state: "ready"; kind: "citation"; detail: CitationDetail }
  | { state: "outage"; message: string }

type ValidationWorkbenchState =
  | { state: "loading" }
  | { state: "empty"; message: string }
  | { state: "outage"; message: string; retryable: boolean }
  | {
      state: "ready"
      sets: ValidationSet[]
      selectedSetId: string
      runs: ValidationRunSummary[]
      activeRun: ValidationRunDetail | null
      isLaunching: boolean
      notice: string | null
      alert: ValidationWorkbenchAlert | null
    }

type ValidationWorkbenchAlert = {
  title: string
  message: string
  tone: "info" | "warning" | "error"
}

const INSPECTION_ROW_LIMIT = 50
export const EMPTY_STEWARDSHIP_DASHBOARD: StewardshipDashboard = {
  overview: {
    sourceCount: 0,
    activeSourceCount: 0,
    draftSourceCount: 0,
    partialSourceCount: 0,
    latestIngestionStatus: null,
    latestValidationStatus: null,
    readinessState: "empty",
  },
  sources: [],
  ingestionRuns: [],
  validationRuns: [],
  auditEvents: [],
}

export function MaintainerDashboard({
  initialPath,
}: {
  initialPath?: string
} = {}) {
  const [route, setRoute] = useState<MaintainerRoute>(() =>
    parseMaintainerRoute(
      initialPath ?? `${window.location.pathname}${window.location.search}`
    )
  )
  const [gate, setGate] = useState<GateState>({ state: "loading" })
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    state: "loading",
  })
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [detailState, setDetailState] = useState<DetailState>({ state: "idle" })
  const [mutationState, setMutationState] = useState<MutationState>({
    state: "idle",
  })
  const detailRequestKeyRef = useRef(0)

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

  const loadSourceDetail = useCallback(
    async (sourceId: string, session: SupabaseSession) => {
      const requestKey = ++detailRequestKeyRef.current
      setDetailState({ state: "loading" })
      try {
        const source = await fetchSourceDetail(sourceId, session)
        if (requestKey !== detailRequestKeyRef.current) {
          return
        }
        setDetailState({
          state: "ready",
          source,
        })
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
    []
  )

  const loadDashboard = useCallback(async (session: SupabaseSession) => {
    setDashboardState({ state: "loading" })
    try {
      const dashboard = await fetchStewardshipDashboard(session)
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
  }, [])

  useEffect(() => {
    // The gate bootstrap has to hydrate from browser session storage and backend auth.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void resolveGate()
  }, [resolveGate])

  useEffect(() => {
    if (gate.state !== "ready") {
      return
    }
    // Dashboard data is pulled only after the authoritative admin gate resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDashboard(gate.session)
  }, [gate, loadDashboard])

  useEffect(() => {
    function syncRouteFromHistory() {
      setRoute(
        parseMaintainerRoute(
          `${window.location.pathname}${window.location.search}`
        )
      )
    }

    window.addEventListener("popstate", syncRouteFromHistory)
    return () => window.removeEventListener("popstate", syncRouteFromHistory)
  }, [])

  useEffect(() => {
    if (gate.state !== "ready") {
      return
    }
    if (route.section === "sourceDetail") {
      // Source detail is a follow-up backend read keyed by the routed selection.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadSourceDetail(route.sourceId, gate.session)
      return
    }
    detailRequestKeyRef.current += 1
    setDetailState({ state: "idle" })
  }, [gate, route, loadSourceDetail])

  function signOut() {
    clearSupabaseSession()
    setGate({ state: "signedOut" })
    setDashboardState({ state: "loading" })
    setDetailState({ state: "idle" })
    setMutationState({ state: "idle" })
  }

  function applyMutationResult(result: SourceMutationResult, message: string) {
    setDashboardState({ state: "ready", dashboard: result.dashboard })
    setSelectedSourceId(result.source.sourceId)
    setDetailState({ state: "ready", source: result.source })
    setMutationState({ state: "succeeded", message })
    navigateTo(
      `/maintainer/sources/${encodeURIComponent(result.source.sourceId)}`
    )
  }

  function navigateTo(path: string) {
    const nextRoute = parseMaintainerRoute(path)
    window.history.pushState(null, "", nextRoute.path)
    setRoute(nextRoute)
  }

  async function runMutation(
    mode: MutationMode,
    action: () => Promise<SourceMutationResult>,
    successMessage: string
  ) {
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
  }

  if (gate.state === "loading") {
    return (
      <MaintainerFrame>
        <SectionSkeleton label="Resolving maintainer access" />
      </MaintainerFrame>
    )
  }

  if (gate.state === "signedOut") {
    return <MaintainerLogin onSignedIn={resolveGate} />
  }

  if (gate.state !== "ready") {
    return (
      <MaintainerFrame>
        <AccessStateView gate={gate} onRetry={resolveGate} />
      </MaintainerFrame>
    )
  }

  return (
    <MaintainerFrame>
      <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Private source stewardship
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">
            Maintainer dashboard
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Approved source review, protected uploads, lifecycle actions,
            ingestion readiness, and audit trail.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-md border px-3 py-2">
            <ShieldCheck className="size-4" aria-hidden="true" />
            {gate.identity.email}
          </span>
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 font-medium"
            onClick={signOut}
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      <DashboardView
        route={route}
        dashboardState={dashboardState}
        session={gate.session}
        selectedSourceId={selectedSourceId}
        detailState={detailState}
        mutationState={mutationState}
        onNavigate={navigateTo}
        onRetryDashboard={() => loadDashboard(gate.session)}
        onSelectSource={setSelectedSourceId}
        onUploadSource={(payload) =>
          runMutation(
            "upload",
            () => uploadSource(payload, gate.session),
            "Source uploaded as draft and inactive."
          )
        }
        onUpdateSource={(sourceId, payload) =>
          runMutation(
            "edit",
            () => updateSourceMetadata(sourceId, payload, gate.session),
            "Source metadata updated."
          )
        }
        onLifecycleAction={(sourceId, action) =>
          runMutation(
            action,
            () => mutateSourceLifecycle(sourceId, action, gate.session),
            `Source ${action} request completed.`
          )
        }
        onIngestSource={(sourceId) =>
          runMutation(
            "ingest",
            () => ingestSource(sourceId, gate.session),
            "Protected ingest request queued."
          )
        }
        onRetrySourceDetail={(sourceId) =>
          void loadSourceDetail(sourceId, gate.session)
        }
      />
    </MaintainerFrame>
  )
}

export function MaintainerFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-8 lg:px-10">
        {children}
      </div>
    </main>
  )
}

export function AccessStateView({
  gate,
  onRetry,
}: {
  gate: Exclude<GateState, { state: "loading" | "ready" | "signedOut" }>
  onRetry: () => void
}) {
  const titleByState = {
    expiredSession: "Session expired",
    unauthorized: "Maintainer access required",
    inactive: "Maintainer profile inactive",
    revokedSession: "Session revoked",
    outage: "Access check unavailable",
  } satisfies Record<typeof gate.state, string>

  return (
    <section className="rounded-lg border bg-card p-6" aria-live="polite">
      <h1 className="text-2xl font-semibold">{titleByState[gate.state]}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        {"message" in gate
          ? gate.message
          : "Sign in again to continue source stewardship."}
      </p>
      <button
        type="button"
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md border px-4 py-2 font-medium"
        onClick={onRetry}
      >
        <RefreshCcw className="size-4" aria-hidden="true" />
        Retry access check
      </button>
    </section>
  )
}

function DashboardView({
  route,
  dashboardState,
  session,
  selectedSourceId,
  detailState,
  mutationState,
  onNavigate,
  onRetryDashboard,
  onSelectSource,
  onUploadSource,
  onUpdateSource,
  onLifecycleAction,
  onIngestSource,
  onRetrySourceDetail,
}: {
  route: MaintainerRoute
  dashboardState: DashboardState
  session: SupabaseSession
  selectedSourceId: string | null
  detailState: DetailState
  mutationState: MutationState
  onNavigate: (path: string) => void
  onRetryDashboard: () => void
  onSelectSource: (sourceId: string) => void
  onUploadSource: (payload: SourceUploadPayload) => void
  onUpdateSource: (sourceId: string, payload: SourceMetadataPayload) => void
  onLifecycleAction: (
    sourceId: string,
    action: "approve" | "activate" | "disable" | "archive"
  ) => void
  onIngestSource: (sourceId: string) => void
  onRetrySourceDetail: (sourceId: string) => void
}) {
  const dashboard =
    dashboardState.state === "ready"
      ? dashboardState.dashboard
      : dashboardState.state === "empty"
        ? EMPTY_STEWARDSHIP_DASHBOARD
        : null
  const selectedSource =
    dashboard?.sources.find((source) => source.sourceId === selectedSourceId) ??
    dashboard?.sources[0]
  const routedSource =
    route.section === "sourceDetail"
      ? dashboard?.sources.find((source) => source.sourceId === route.sourceId)
      : selectedSource

  return (
    <div className="space-y-5">
      <MaintainerSectionNav route={route} onNavigate={onNavigate} />
      {route.section === "overview" ? (
        dashboard ? (
          <OverviewPage dashboard={dashboard} onNavigate={onNavigate} />
        ) : (
          <DashboardDataState
            state={dashboardState}
            onRetry={onRetryDashboard}
          />
        )
      ) : route.section === "sources" ? (
        dashboard ? (
          <SourcesPage
            route={route}
            dashboard={dashboard}
            selectedSourceId={selectedSource?.sourceId ?? null}
            onNavigate={onNavigate}
            onSelectSource={onSelectSource}
          />
        ) : (
          <DashboardDataState
            state={dashboardState}
            onRetry={onRetryDashboard}
          />
        )
      ) : route.section === "sourceNew" ? (
        <SourceUploadPage
          mutationState={mutationState}
          onSubmit={onUploadSource}
        />
      ) : route.section === "sourceDetail" ? (
        <SourceDetailPage
          route={route}
          sourceId={route.sourceId}
          selectedSource={routedSource}
          detailState={detailState}
          session={session}
          mutationState={mutationState}
          onNavigate={onNavigate}
          onUpdateSource={onUpdateSource}
          onLifecycleAction={onLifecycleAction}
          onIngestSource={onIngestSource}
          onRetrySourceDetail={onRetrySourceDetail}
        />
      ) : route.section === "validation" ? (
        <ValidationWorkbench session={session} />
      ) : dashboard ? (
        <OperationsPage dashboard={dashboard} />
      ) : (
        <DashboardDataState state={dashboardState} onRetry={onRetryDashboard} />
      )}
    </div>
  )
}

export function DashboardDataState({
  state,
  onRetry,
}: {
  state: DashboardState
  onRetry: () => void
}) {
  if (state.state === "loading") {
    return <SectionSkeleton label="Loading source stewardship records" />
  }
  if (state.state === "outage") {
    return <RetryState message={state.message} onRetry={onRetry} />
  }
  return (
    <SectionState
      title="No approved sources yet"
      body="The approved inventory returned an empty dataset."
    />
  )
}

export function parseMaintainerRoute(pathname: string): MaintainerRoute {
  const url = new URL(pathname, "https://maintainer.local")
  const normalized = url.pathname.replace(/\/+$/, "") || "/maintainer"
  const preset = parseMaintainerPreset(url.searchParams.get("preset"))
  const path = `${normalized}${url.search}`
  if (normalized === "/maintainer" || normalized === "/maintainer/overview") {
    return {
      section: "overview",
      path,
      preset,
    }
  }
  if (normalized === "/maintainer/sources") {
    return { section: "sources", path, preset }
  }
  if (normalized === "/maintainer/sources/new") {
    return { section: "sourceNew", path, preset }
  }
  if (normalized.startsWith("/maintainer/sources/")) {
    const sourceSegment = normalized.replace("/maintainer/sources/", "")
    let sourceId = ""
    try {
      sourceId = decodeURIComponent(sourceSegment)
    } catch {
      return { section: "overview", path: "/maintainer", preset: null }
    }
    if (sourceId) {
      return {
        section: "sourceDetail",
        path,
        preset,
        sourceId,
      }
    }
  }
  if (normalized === "/maintainer/validation") {
    return { section: "validation", path, preset }
  }
  if (normalized === "/maintainer/operations") {
    return { section: "operations", path, preset }
  }
  return { section: "overview", path: "/maintainer", preset: null }
}

function parseMaintainerPreset(value: string | null): MaintainerPreset | null {
  if (
    value === "sources-needing-attention" ||
    value === "validation-follow-up" ||
    value === "operations-recent-activity"
  ) {
    return value
  }
  return null
}

export function MaintainerSectionNav({
  route,
  onNavigate,
}: {
  route: MaintainerRoute
  onNavigate: (path: string) => void
}) {
  const links = [
    {
      path: "/maintainer",
      label: "Overview",
      active: route.section === "overview",
    },
    {
      path: "/maintainer/sources",
      label: "Sources",
      active:
        route.section === "sources" ||
        route.section === "sourceNew" ||
        route.section === "sourceDetail",
    },
    {
      path: "/maintainer/validation",
      label: "Validation",
      active: route.section === "validation",
    },
    {
      path: "/maintainer/operations",
      label: "Operations",
      active: route.section === "operations",
    },
  ]

  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-border pb-4"
      aria-label="Maintainer sections"
    >
      {links.map((link) => (
        <button
          key={link.path}
          type="button"
          className={`min-h-11 rounded-md border px-4 py-2 text-sm font-medium ${
            link.active
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground"
          }`}
          aria-current={link.active ? "page" : undefined}
          onClick={() => onNavigate(link.path)}
        >
          {link.label}
        </button>
      ))}
    </nav>
  )
}

export function OverviewPage({
  dashboard,
  onNavigate,
}: {
  dashboard: StewardshipDashboard
  onNavigate: (path: string) => void
}) {
  const workflowCards = buildWorkflowCards(dashboard)

  return (
    <section className="space-y-6" aria-labelledby="overview-page-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Readiness overview
          </p>
          <h2
            id="overview-page-heading"
            className="mt-2 text-2xl font-semibold"
          >
            Maintainer overview
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => onNavigate("/maintainer/sources")}
          >
            Review sources
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onNavigate("/maintainer/sources/new")}
          >
            <Upload className="size-4" aria-hidden="true" />
            Upload source
          </Button>
        </div>
      </div>
      <OverviewCards dashboard={dashboard} />
      <div className="grid gap-4 lg:grid-cols-3">
        {workflowCards.map((card) => (
          <WorkflowHealthCard
            key={card.title}
            card={card}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  )
}

export function SourcesPage({
  route,
  dashboard,
  selectedSourceId,
  onNavigate,
  onSelectSource,
}: {
  route: Extract<MaintainerRoute, { section: "sources" }>
  dashboard: StewardshipDashboard
  selectedSourceId: string | null
  onNavigate: (path: string) => void
  onSelectSource: (sourceId: string) => void
}) {
  const filteredSources = filterSourcesForPreset(
    dashboard.sources,
    route.preset
  )
  const focusItems = getPresetFocusItems(dashboard, route.preset)

  return (
    <section className="space-y-5" aria-labelledby="sources-page-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Source lifecycle
          </p>
          <h2 id="sources-page-heading" className="mt-2 text-2xl font-semibold">
            Source stewardship
          </h2>
        </div>
        <Button
          type="button"
          onClick={() => onNavigate("/maintainer/sources/new")}
        >
          <Upload className="size-4" aria-hidden="true" />
          Upload source
        </Button>
      </div>
      {route.preset ? (
        <ReadinessPresetBanner
          preset={route.preset}
          items={focusItems}
          onNavigate={onNavigate}
        />
      ) : null}
      <SourceTable
        sources={filteredSources}
        selectedSourceId={selectedSourceId}
        onSelectSource={(sourceId) => {
          onSelectSource(sourceId)
          onNavigate(buildSourceDetailPath(sourceId, route.preset))
        }}
      />
    </section>
  )
}

export function SourceUploadPage({
  mutationState,
  onSubmit,
}: {
  mutationState: MutationState
  onSubmit: (payload: SourceUploadPayload) => void
}) {
  return (
    <section className="space-y-5" aria-labelledby="source-upload-page-heading">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase">
          Protected source intake
        </p>
        <h2
          id="source-upload-page-heading"
          className="mt-2 text-2xl font-semibold"
        >
          Upload a source draft
        </h2>
      </div>
      <MutationStatus state={mutationState} />
      <SourceUploadPanel mutationState={mutationState} onSubmit={onSubmit} />
    </section>
  )
}

export function SourceDetailPage({
  route,
  sourceId,
  selectedSource,
  detailState,
  session,
  mutationState,
  onNavigate,
  onUpdateSource,
  onLifecycleAction,
  onIngestSource,
  onRetrySourceDetail,
}: {
  route: Extract<MaintainerRoute, { section: "sourceDetail" }>
  sourceId: string
  selectedSource: SourceInventoryItem | undefined
  detailState: DetailState
  session: SupabaseSession
  mutationState: MutationState
  onNavigate: (path: string) => void
  onUpdateSource: (sourceId: string, payload: SourceMetadataPayload) => void
  onLifecycleAction: (
    sourceId: string,
    action: "approve" | "activate" | "disable" | "archive"
  ) => void
  onIngestSource: (sourceId: string) => void
  onRetrySourceDetail: (sourceId: string) => void
}) {
  return (
    <section className="space-y-5" aria-labelledby="source-detail-page-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Source detail
          </p>
          <h2
            id="source-detail-page-heading"
            className="mt-2 text-2xl font-semibold"
          >
            {selectedSource?.title ?? sourceId}
          </h2>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => onNavigate(pathForPreset(route.preset))}
        >
          {route.preset ? "Back to filtered queue" : "Back to sources"}
        </Button>
      </div>
      <MutationStatus state={mutationState} />
      {detailState.state === "loading" ? (
        <SectionSkeleton label="Loading source history" />
      ) : detailState.state === "ready" ? (
        <SourceDetailPanel
          source={detailState.source}
          session={session}
          mutationState={mutationState}
          onNavigate={onNavigate}
          onUpdateSource={onUpdateSource}
          onLifecycleAction={onLifecycleAction}
          onIngestSource={onIngestSource}
        />
      ) : detailState.state === "empty" ? (
        <SectionState title="Source unavailable" body={detailState.message} />
      ) : detailState.state === "outage" ? (
        <RetryState
          message={detailState.message}
          onRetry={() => onRetrySourceDetail(sourceId)}
        />
      ) : (
        <SectionState
          title="Source detail loading"
          body="The selected source detail is being prepared."
        />
      )}
    </section>
  )
}

export function OperationsPage({
  dashboard,
}: {
  dashboard: StewardshipDashboard
}) {
  return (
    <section className="space-y-5" aria-labelledby="operations-page-heading">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase">
          Operational visibility
        </p>
        <h2
          id="operations-page-heading"
          className="mt-2 text-2xl font-semibold"
        >
          Ingestion and audit records
        </h2>
      </div>
      <OperationalRecords
        ingestionRuns={dashboard.ingestionRuns}
        validationRuns={dashboard.validationRuns}
        auditEvents={dashboard.auditEvents}
      />
    </section>
  )
}

export function ValidationWorkbench({ session }: { session: SupabaseSession }) {
  const [state, setState] = useState<ValidationWorkbenchState>({
    state: "loading",
  })
  const [selectedResult, setSelectedResult] = useState<ValidationResult | null>(
    null
  )
  const selectedSetIdRef = useRef<string | null>(null)
  const validationRequestKeyRef = useRef(0)

  const loadValidation = useCallback(
    async (preferredRunId?: string, preferredSetId?: string) => {
      const requestKey = ++validationRequestKeyRef.current
      setState((current) =>
        current.state === "ready"
          ? { ...current, notice: null, alert: null }
          : { state: "loading" }
      )
      try {
        const [setList, runList] = await Promise.all([
          fetchValidationSets(session),
          fetchValidationRuns(session),
        ])
        if (requestKey !== validationRequestKeyRef.current) {
          return
        }
        if (!setList.sets.length) {
          setState({
            state: "empty",
            message:
              "No validation sets are available. Seed Demo Readiness v1 before checking demo readiness.",
          })
          return
        }
        const rememberedSetId = preferredSetId ?? selectedSetIdRef.current
        const selectedSetId = setList.sets.some(
          (set) => set.validationSetId === rememberedSetId
        )
          ? rememberedSetId!
          : (setList.defaultSetId ?? setList.sets[0].validationSetId)
        const activeRunSummary =
          runList.runs.find((run) => run.runId === preferredRunId) ??
          runList.runs.find((run) => run.validationSetId === selectedSetId) ??
          null
        let activeRun: ValidationRunDetail | null = null
        let alert: ValidationWorkbenchAlert | null = null

        if (activeRunSummary) {
          try {
            activeRun = await fetchValidationRunDetail(
              activeRunSummary.runId,
              session
            )
            if (requestKey !== validationRequestKeyRef.current) {
              return
            }
            alert = validationAlertForRun(activeRun)
          } catch (error) {
            if (requestKey !== validationRequestKeyRef.current) {
              return
            }
            alert = validationDetailAlert(error)
          }
        }

        if (preferredRunId && !activeRunSummary && !alert) {
          alert = {
            title: "Validation run not found",
            message:
              "The requested validation run is no longer available. Choose another immutable history record.",
            tone: "error",
          }
        }

        if (requestKey !== validationRequestKeyRef.current) {
          return
        }
        setState({
          state: "ready",
          sets: setList.sets,
          selectedSetId: activeRunSummary?.validationSetId ?? selectedSetId,
          runs: runList.runs,
          activeRun,
          isLaunching: false,
          alert,
          notice:
            activeRun || activeRunSummary || alert
              ? null
              : "No validation runs exist for this set yet. Launch a run to create immutable history.",
        })
      } catch (error) {
        if (requestKey !== validationRequestKeyRef.current) {
          return
        }
        setState({
          state: "outage",
          message:
            error instanceof Error
              ? error.message
              : "The validation workbench could not load.",
          retryable: true,
        })
      }
    },
    [session]
  )

  useEffect(() => {
    if (state.state === "ready") {
      selectedSetIdRef.current = state.selectedSetId
    }
  }, [state])

  useEffect(() => {
    // Validation contracts load after the same private maintainer gate as source stewardship.
    void loadValidation()
  }, [loadValidation])

  useEffect(() => {
    if (
      state.state !== "ready" ||
      !state.activeRun ||
      !["queued", "processing"].includes(state.activeRun.status)
    ) {
      return
    }
    const timer = window.setTimeout(() => {
      void loadValidation(state.activeRun?.runId)
    }, 2000)
    return () => window.clearTimeout(timer)
  }, [loadValidation, state])

  async function runSelectedSet() {
    if (state.state !== "ready") {
      return
    }
    validationRequestKeyRef.current += 1
    setState((current) =>
      current.state === "ready"
        ? { ...current, isLaunching: true, notice: null, alert: null }
        : current
    )
    try {
      const run = await launchValidationRun(state.selectedSetId, session)
      try {
        const runList = await fetchValidationRuns(session)
        setState((current) =>
          current.state === "ready"
            ? {
                ...current,
                selectedSetId: run.validationSetId,
                runs: runList.runs,
                activeRun: run,
                isLaunching: false,
                notice:
                  "Validation run created as a new immutable history record.",
                alert: validationAlertForRun(run),
              }
            : current
        )
      } catch {
        setState((current) =>
          current.state === "ready"
            ? {
                ...current,
                selectedSetId: run.validationSetId,
                activeRun: run,
                isLaunching: false,
                notice:
                  "Validation run created, but run history could not be refreshed. Retry to sync the latest record list.",
                alert: {
                  title: "Validation history refresh needed",
                  message:
                    "The latest immutable run completed, but the history list could not be refreshed right now.",
                  tone: "warning",
                },
              }
            : current
        )
      }
    } catch (error) {
      setState((current) =>
        current.state === "ready"
          ? {
              ...current,
              isLaunching: false,
              notice:
                error instanceof Error
                  ? error.message
                  : "The validation run could not be launched.",
              alert: validationDetailAlert(error),
            }
          : current
      )
    }
  }

  if (state.state === "loading") {
    return <SectionSkeleton label="Loading validation readiness records" />
  }
  if (state.state === "empty") {
    return <SectionState title="Validation data empty" body={state.message} />
  }
  if (state.state === "outage") {
    return (
      <RetryState
        message={state.message}
        onRetry={() => {
          void loadValidation()
        }}
      />
    )
  }

  const activeSet = state.sets.find(
    (set) => set.validationSetId === state.selectedSetId
  )
  const activeRun = state.activeRun

  return (
    <section className="space-y-5" aria-labelledby="validation-heading">
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Demo readiness
          </p>
          <h2 id="validation-heading" className="mt-2 text-xl font-semibold">
            Validation workbench
          </h2>
          <label className="mt-4 block max-w-md text-sm font-medium">
            Validation set
            <select
              className="mt-2 w-full rounded-md border bg-background px-3 py-2"
              value={state.selectedSetId}
              onChange={(event) => {
                setSelectedResult(null)
                void loadValidation(undefined, event.target.value)
              }}
            >
              {state.sets.map((set) => (
                <option key={set.validationSetId} value={set.validationSetId}>
                  {set.name}
                </option>
              ))}
            </select>
          </label>
          {activeSet ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {activeSet.description} Version {activeSet.version};{" "}
              {activeSet.questionCount} questions.
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          onClick={() => void runSelectedSet()}
          disabled={state.isLaunching}
        >
          {state.isLaunching ? (
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
          ) : (
            <Play className="size-4" aria-hidden="true" />
          )}
          Run validation
        </Button>
      </div>

      {state.notice ? (
        <section
          className="rounded-lg border bg-card p-4 text-sm"
          aria-live="polite"
        >
          {state.notice}
        </section>
      ) : null}

      {state.alert ? <ValidationAlert alert={state.alert} /> : null}

      {activeRun ? (
        <>
          <ValidationSummary run={activeRun} />
          <ValidationResultsTable
            run={activeRun}
            onInspectResult={setSelectedResult}
          />
        </>
      ) : (
        <SectionState
          title="Validation history empty"
          body="No immutable run history exists for this validation set yet."
        />
      )}

      <ValidationRunHistory
        runs={state.runs}
        onOpenRun={(runId) => {
          setSelectedResult(null)
          void loadValidation(runId)
        }}
      />
      <ValidationResultOverlay
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
      />
    </section>
  )
}

function ValidationSummary({ run }: { run: ValidationRunSummary }) {
  const statusText = validationStatusLabel(run.status)
  const cards = [
    ["pass", run.passCount],
    ["weakSupport", run.weakSupportCount],
    ["refused", run.refusedCount],
    ["failed", run.failedCount],
    ["error", run.errorCount],
  ] as const

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">{run.validationSetName}</h3>
          <p className="text-sm text-muted-foreground">
            {statusText} · Version {run.validationSetVersion} · {run.createdAt}
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium">
          {run.status === "failed" ? (
            <AlertTriangle className="size-4" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="size-4" aria-hidden="true" />
          )}
          {statusText}
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(([label, value]) => (
          <article key={label} className="rounded-md border p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </article>
        ))}
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <DetailTerm label="Created" value={run.createdAt} />
        <DetailTerm label="Started" value={run.startedAt ?? "Not available"} />
        <DetailTerm
          label="Completed"
          value={run.completedAt ?? "Not available"}
        />
      </dl>
      <p className="mt-3 text-sm text-muted-foreground">{run.notes}</p>
      {run.sourceSnapshotIds.length ? (
        <p className="mt-2 text-xs break-words text-muted-foreground">
          Source snapshots: {run.sourceSnapshotIds.join(", ")}
        </p>
      ) : null}
    </section>
  )
}

function ValidationResultsTable({
  run,
  onInspectResult,
}: {
  run: ValidationRunDetail
  onInspectResult: (result: ValidationResult) => void
}) {
  if (!run.results.length) {
    return (
      <SectionState
        title="Validation result data partial"
        body="The run exists, but question-level results are not available yet."
      />
    )
  }

  return (
    <section className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold">Question outcomes</h3>
      <div className="mt-3 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Outcome</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead>Actual</TableHead>
              <TableHead>Support</TableHead>
              <TableHead>Latency</TableHead>
              <TableHead>Inspect</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {run.results.map((result) => (
              <TableRow key={result.resultId}>
                <TableCell>{result.outcome}</TableCell>
                <TableCell className="max-w-80 min-w-56">
                  {result.questionText}
                </TableCell>
                <TableCell>{result.expectedState}</TableCell>
                <TableCell>{result.actualState}</TableCell>
                <TableCell>
                  {result.supportScore == null
                    ? "Not available"
                    : result.supportScore.toFixed(2)}
                </TableCell>
                <TableCell>
                  {result.latencyMs == null
                    ? "Not available"
                    : `${result.latencyMs} ms`}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onInspectResult(result)}
                    aria-label="Inspect result"
                  >
                    <Eye className="size-4" aria-hidden="true" />
                    Inspect
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

function ValidationRunHistory({
  runs,
  onOpenRun,
}: {
  runs: ValidationRunSummary[]
  onOpenRun: (runId: string) => void
}) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold">Immutable run history</h3>
      {runs.length ? (
        <ul className="mt-3 space-y-2 text-sm">
          {runs.map((run) => (
            <li
              key={run.runId}
              className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>
                <span className="font-medium">{run.validationSetName}</span>{" "}
                {validationStatusLabel(run.status)} · {run.createdAt}
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenRun(run.runId)}
              >
                Open run
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          No validation run history is available.
        </p>
      )}
    </section>
  )
}

function ValidationResultOverlay({
  result,
  onClose,
}: {
  result: ValidationResult | null
  onClose: () => void
}) {
  const dialogRef = useModalFocus(Boolean(result), onClose)
  if (!result) {
    return null
  }
  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-end bg-background/80 p-0 md:items-center md:justify-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Validation result detail"
    >
      <div className="max-h-[90svh] w-full overflow-y-auto rounded-t-lg border bg-card p-4 shadow-lg md:max-w-2xl md:rounded-lg">
        <h3 className="text-lg font-semibold">{result.outcome}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {result.questionText}
        </p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <DetailTerm label="Expected" value={result.expectedState} />
          <DetailTerm label="Actual" value={result.actualState} />
          <DetailTerm
            label="Support score"
            value={
              result.supportScore == null
                ? "Not available"
                : result.supportScore.toFixed(2)
            }
          />
          <DetailTerm
            label="Latency"
            value={
              result.latencyMs == null
                ? "Not available"
                : `${result.latencyMs} ms`
            }
          />
          <DetailTerm
            label="Retrieved sources"
            value={result.retrievedSourceIds.join(", ") || "None"}
          />
          <DetailTerm
            label="Citations"
            value={result.citationIds.join(", ") || "None"}
          />
          <DetailTerm label="Recorded" value={result.createdAt} />
        </dl>
        <pre className="mt-4 max-h-52 rounded-md border bg-muted/30 p-3 text-sm break-words whitespace-pre-wrap">
          {result.answerPreview}
        </pre>
        <p className="mt-3 text-sm text-muted-foreground">{result.notes}</p>
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

function validationStatusLabel(status: ValidationRunSummary["status"]) {
  if (
    status === "queued" ||
    status === "processing" ||
    status === "completed" ||
    status === "failed"
  ) {
    return status
  }
  return `unknown: ${status}`
}

function validationAlertForRun(
  run: ValidationRunDetail
): ValidationWorkbenchAlert | null {
  if (run.state === "stale") {
    return {
      title: "Validation data stale",
      message:
        run.notes ||
        "This immutable run no longer reflects the latest validation-set or source snapshot.",
      tone: "warning",
    }
  }
  if (run.state === "partial" || !run.results.length) {
    return {
      title: "Validation data partial",
      message:
        run.notes ||
        "The run exists, but some question-level detail is not available yet.",
      tone: "warning",
    }
  }
  return null
}

function validationDetailAlert(error: unknown): ValidationWorkbenchAlert {
  if (error instanceof MaintainerApiError) {
    if (error.status === 404) {
      return {
        title: "Validation run not found",
        message:
          "The requested validation run is no longer available. Choose another immutable history record.",
        tone: "error",
      }
    }
    if (error.status >= 500 || error.code === "admin_response_malformed") {
      return {
        title: "Validation detail unavailable",
        message:
          "The validation summary loaded, but detail is temporarily unavailable. Retry to inspect this run.",
        tone: "warning",
      }
    }
    return {
      title: "Validation detail unavailable",
      message: error.message,
      tone: "error",
    }
  }

  return {
    title: "Validation detail unavailable",
    message: "The validation detail could not be loaded right now.",
    tone: "warning",
  }
}

function ValidationAlert({ alert }: { alert: ValidationWorkbenchAlert }) {
  const toneClass =
    alert.tone === "error"
      ? "border-destructive/40 bg-destructive/5"
      : alert.tone === "warning"
        ? "border-amber-600/40 bg-amber-600/10"
        : "border-border bg-card"

  return (
    <section
      className={`rounded-lg border p-4 ${toneClass}`}
      aria-live="polite"
    >
      <h3 className="font-semibold">{alert.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{alert.message}</p>
    </section>
  )
}

export function handleMaintainerReadAuthFailure(
  error: unknown,
  setGate: (gate: GateState) => void
): boolean {
  if (!(error instanceof MaintainerApiError)) {
    return false
  }
  if (error.status === 401) {
    setGate({ state: "expiredSession" })
    return true
  }
  if (error.status === 403) {
    setGate({ state: "revokedSession", message: error.message })
    return true
  }
  return false
}

function OverviewCards({ dashboard }: { dashboard: StewardshipDashboard }) {
  const cards = [
    ["Stewarded sources", dashboard.overview.sourceCount],
    ["Active sources", dashboard.overview.activeSourceCount],
    ["Draft sources", dashboard.overview.draftSourceCount],
    ["Partial records", dashboard.overview.partialSourceCount],
    ["Readiness", dashboard.overview.readinessState],
  ] as const

  return (
    <section aria-labelledby="maintainer-overview-heading">
      <h2 id="maintainer-overview-heading" className="text-xl font-semibold">
        Overview
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <article key={label} className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function MutationStatus({ state }: { state: MutationState }) {
  if (state.state === "idle") {
    return null
  }
  if (state.state === "submitting") {
    return (
      <section className="rounded-lg border bg-card p-4" aria-live="polite">
        <p className="inline-flex items-center gap-2 text-sm font-medium">
          <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
          Protected {state.mode} request is running
        </p>
      </section>
    )
  }
  return (
    <section
      className="rounded-lg border bg-card p-4 text-sm"
      aria-live="polite"
    >
      <p
        className={
          state.state === "succeeded"
            ? "font-medium"
            : "font-medium text-destructive"
        }
      >
        {state.message}
      </p>
      {state.state === "failed" && Object.keys(state.fields).length ? (
        <ul className="mt-2 space-y-1 text-muted-foreground">
          {Object.entries(state.fields).map(([field, message]) => (
            <li key={field}>
              {field}: {message}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

function SourceUploadPanel({
  mutationState,
  onSubmit,
}: {
  mutationState: MutationState
  onSubmit: (payload: SourceUploadPayload) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [sourceId, setSourceId] = useState("")
  const [title, setTitle] = useState("")
  const [sourceType, setSourceType] = useState("reference")
  const [provenance, setProvenance] = useState("")
  const [summary, setSummary] = useState("")
  const [usageScope, setUsageScope] = useState("ingestion")
  const isSubmitting = mutationState.state === "submitting"

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!file) {
      setFileError("A source file is required.")
      return
    }
    setFileError(null)
    onSubmit({
      file,
      sourceId,
      title,
      sourceType,
      provenance,
      summary,
      usageScope: usageScope
        .split(",")
        .map((scope) => scope.trim())
        .filter(Boolean),
    })
  }

  return (
    <section
      aria-labelledby="source-upload-heading"
      className="rounded-lg border bg-card p-4"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="source-upload-heading" className="text-xl font-semibold">
            Protected source upload
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            New uploads start as draft, inactive, and out of retrieval until
            review, ingest, and activation complete.
          </p>
        </div>
        <FileUp className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <form
        className="mt-4 grid gap-3 md:grid-cols-2"
        onSubmit={submit}
        noValidate
      >
        <FormField label="Source ID" value={sourceId} onChange={setSourceId} />
        <FormField label="Title" value={title} onChange={setTitle} required />
        <FormField
          label="Type"
          value={sourceType}
          onChange={setSourceType}
          required
        />
        <FormField
          label="Usage scope"
          value={usageScope}
          onChange={setUsageScope}
          required
        />
        <FormField
          label="Provenance"
          value={provenance}
          onChange={setProvenance}
          required
        />
        <FormField
          label="Summary"
          value={summary}
          onChange={setSummary}
          required
        />
        <label className="block text-sm font-medium md:col-span-2">
          Source file
          <input
            className="mt-2 min-h-11 w-full rounded-md border bg-background px-3 py-2"
            type="file"
            accept=".md,.txt,.pdf,.csv"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null)
              setFileError(null)
            }}
            required
            aria-describedby={fileError ? "source-file-error" : undefined}
          />
          {fileError ? (
            <p id="source-file-error" className="mt-2 text-sm text-destructive">
              {fileError}
            </p>
          ) : null}
        </label>
        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            <Upload className="size-4" aria-hidden="true" />
            Upload draft
          </Button>
        </div>
      </form>
    </section>
  )
}

function FormField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        className="mt-2 min-h-11 w-full rounded-md border bg-background px-3"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  )
}

function SourceTable({
  sources,
  selectedSourceId,
  onSelectSource,
}: {
  sources: SourceInventoryItem[]
  selectedSourceId: string | null
  onSelectSource: (sourceId: string) => void
}) {
  return (
    <section
      aria-labelledby="source-inventory-heading"
      className="rounded-lg border bg-card p-4"
    >
      <h2 id="source-inventory-heading" className="text-xl font-semibold">
        Source stewardship inventory
      </h2>
      <div className="mt-4 grid gap-3 lg:hidden">
        {sources.map((source) => (
          <article key={source.sourceId} className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{source.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {source.sourceId}
                </p>
              </div>
              <LifecycleBadge state={source.lifecycleState} />
            </div>
            <dl className="mt-3 grid gap-2 text-sm">
              <div>
                <dt className="font-medium">Type</dt>
                <dd className="text-muted-foreground">{source.sourceType}</dd>
              </div>
              <div>
                <dt className="font-medium">Readiness</dt>
                <dd className="text-muted-foreground">
                  {source.ingestionReadiness}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Validation</dt>
                <dd className="text-muted-foreground">
                  {source.latestValidationOutcome ?? "empty"}
                </dd>
              </div>
            </dl>
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              aria-pressed={selectedSourceId === source.sourceId}
              onClick={() => onSelectSource(source.sourceId)}
            >
              Inspect
            </Button>
          </article>
        ))}
      </div>
      <div className="mt-4 hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-xs text-muted-foreground uppercase">
            <tr>
              <th scope="col" className="py-3 pr-4">
                Source
              </th>
              <th scope="col" className="py-3 pr-4">
                Type
              </th>
              <th scope="col" className="py-3 pr-4">
                Lifecycle
              </th>
              <th scope="col" className="py-3 pr-4">
                Readiness
              </th>
              <th scope="col" className="py-3 pr-4">
                Validation
              </th>
              <th scope="col" className="py-3 pr-4">
                Review
              </th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.sourceId} className="border-b last:border-0">
                <td className="py-3 pr-4">
                  <span className="block font-medium">{source.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {source.sourceId}
                  </span>
                </td>
                <td className="py-3 pr-4">{source.sourceType}</td>
                <td className="py-3 pr-4">
                  <LifecycleBadge state={source.lifecycleState} />
                </td>
                <td className="py-3 pr-4">{source.ingestionReadiness}</td>
                <td className="py-3 pr-4">
                  {source.latestValidationOutcome ?? "empty"}
                </td>
                <td className="py-3 pr-4">
                  <button
                    type="button"
                    className="min-h-11 rounded-md border px-3 py-2 font-medium"
                    aria-pressed={selectedSourceId === source.sourceId}
                    onClick={() => onSelectSource(source.sourceId)}
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function SourceDetailPanel({
  source,
  session,
  mutationState,
  onNavigate,
  onUpdateSource,
  onLifecycleAction,
  onIngestSource,
}: {
  source: SourceDetail
  session: SupabaseSession
  mutationState: MutationState
  onNavigate: (path: string) => void
  onUpdateSource: (sourceId: string, payload: SourceMetadataPayload) => void
  onLifecycleAction: (
    sourceId: string,
    action: "approve" | "activate" | "disable" | "archive"
  ) => void
  onIngestSource: (sourceId: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [confirmation, setConfirmation] = useState<ConfirmationState>(null)
  const [activeTab, setActiveTab] = useState<InspectorTab>("overview")
  const [chunkState, setChunkState] = useState<InspectionListState<ChunkRow>>({
    state: "idle",
  })
  const [citationState, setCitationState] = useState<
    InspectionListState<CitationRow>
  >({ state: "idle" })
  const [detailOverlay, setDetailOverlay] = useState<InspectionDetailState>({
    state: "idle",
  })
  const requestKeyRef = useRef(0)
  const detailRequestKeyRef = useRef(0)
  const isSubmitting = mutationState.state === "submitting"

  const loadChunks = useCallback(async () => {
    const requestKey = ++requestKeyRef.current
    setChunkState({ state: "loading" })
    try {
      const payload = await fetchSourceChunks(source.sourceId, session)
      if (requestKey !== requestKeyRef.current) {
        return
      }
      setChunkState(
        payload.chunks.length
          ? {
              state: "ready",
              anchor: payload.anchor,
              records: payload.chunks,
              partialData: payload.partialData,
            }
          : {
              state: "empty",
              anchor: payload.anchor,
              message: payload.anchor.nextStep,
              partialData: payload.partialData,
            }
      )
    } catch (error) {
      if (requestKey !== requestKeyRef.current) {
        return
      }
      setChunkState({
        state: "outage",
        message:
          error instanceof Error
            ? error.message
            : "Chunk inspection could not load.",
      })
    }
  }, [session, source.sourceId])

  const loadCitations = useCallback(async () => {
    const requestKey = ++requestKeyRef.current
    setCitationState({ state: "loading" })
    try {
      const payload = await fetchSourceCitations(source.sourceId, session)
      if (requestKey !== requestKeyRef.current) {
        return
      }
      setCitationState(
        payload.citations.length
          ? {
              state: "ready",
              anchor: payload.anchor,
              records: payload.citations,
              partialData: payload.partialData,
            }
          : {
              state: "empty",
              anchor: payload.anchor,
              message: payload.anchor.nextStep,
              partialData: payload.partialData,
            }
      )
    } catch (error) {
      if (requestKey !== requestKeyRef.current) {
        return
      }
      setCitationState({
        state: "outage",
        message:
          error instanceof Error
            ? error.message
            : "Citation inspection could not load.",
      })
    }
  }, [session, source.sourceId])

  useEffect(() => {
    // Selection changes intentionally reset the lazy inspection subviews.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveTab("overview")
    setChunkState({ state: "idle" })
    setCitationState({ state: "idle" })
    setDetailOverlay({ state: "idle" })
    requestKeyRef.current += 1
    detailRequestKeyRef.current += 1
  }, [source.sourceId])

  useEffect(() => {
    if (activeTab === "chunks" && chunkState.state === "idle") {
      // Lazy inspection data is fetched only after the maintainer opens the tab.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadChunks()
    }
    if (activeTab === "citations" && citationState.state === "idle") {
      // Lazy inspection data is fetched only after the maintainer opens the tab.
      void loadCitations()
    }
  }, [
    activeTab,
    chunkState.state,
    citationState.state,
    loadChunks,
    loadCitations,
  ])

  async function openChunkDetail(chunkId: string) {
    const requestKey = ++detailRequestKeyRef.current
    setDetailOverlay({ state: "loading", kind: "chunk" })
    try {
      const detail = await fetchChunkDetail(chunkId, session)
      if (requestKey !== detailRequestKeyRef.current) {
        return
      }
      setDetailOverlay({
        state: "ready",
        kind: "chunk",
        detail,
      })
    } catch (error) {
      if (requestKey !== detailRequestKeyRef.current) {
        return
      }
      setDetailOverlay({
        state: "outage",
        message:
          error instanceof Error
            ? error.message
            : "Chunk detail could not load.",
      })
    }
  }

  async function openCitationDetail(citationId: string) {
    const requestKey = ++detailRequestKeyRef.current
    setDetailOverlay({ state: "loading", kind: "citation" })
    try {
      const detail = await fetchCitationDetail(citationId, session)
      if (requestKey !== detailRequestKeyRef.current) {
        return
      }
      setDetailOverlay({
        state: "ready",
        kind: "citation",
        detail,
      })
    } catch (error) {
      if (requestKey !== detailRequestKeyRef.current) {
        return
      }
      setDetailOverlay({
        state: "outage",
        message:
          error instanceof Error
            ? error.message
            : "Citation detail could not load.",
      })
    }
  }

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{source.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {source.sourceId}
          </p>
        </div>
        <LifecycleBadge state={source.lifecycleState} />
      </div>
      <p className="mt-4 text-sm leading-6">{source.summary}</p>
      <ReadinessBlockerSummary source={source} />
      <SourceValidationEvidence
        source={source}
        onOpenValidation={() =>
          onNavigate(
            `/maintainer/validation?preset=validation-follow-up&sourceId=${encodeURIComponent(source.sourceId)}`
          )
        }
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setEditing(true)}
        >
          <Pencil className="size-4" aria-hidden="true" />
          Edit
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting || source.lifecycleState !== "draft"}
          onClick={() => onLifecycleAction(source.sourceId, "approve")}
        >
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Approve
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={
            isSubmitting ||
            source.lifecycleState === "archived" ||
            source.latestIngestJob?.status === "queued"
          }
          onClick={() => onIngestSource(source.sourceId)}
        >
          <Play className="size-4" aria-hidden="true" />
          Ingest
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting || source.lifecycleState !== "approved"}
          onClick={() => onLifecycleAction(source.sourceId, "activate")}
        >
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Activate
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting || source.lifecycleState !== "active"}
          onClick={() =>
            setConfirmation({
              action: "disable",
              sourceId: source.sourceId,
              title: source.title,
            })
          }
        >
          <Square className="size-4" aria-hidden="true" />
          Disable
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={isSubmitting || source.lifecycleState === "archived"}
          onClick={() =>
            setConfirmation({
              action: "archive",
              sourceId: source.sourceId,
              title: source.title,
            })
          }
        >
          <Archive className="size-4" aria-hidden="true" />
          Archive
        </Button>
      </div>
      {editing ? (
        <EditSourcePanel
          source={source}
          onClose={() => setEditing(false)}
          onSubmit={(payload) => {
            setEditing(false)
            onUpdateSource(source.sourceId, payload)
          }}
        />
      ) : null}
      {confirmation ? (
        <ConfirmLifecycleAction
          action={confirmation.action}
          title={confirmation.title}
          onCancel={() => setConfirmation(null)}
          onConfirm={() => {
            onLifecycleAction(confirmation.sourceId, confirmation.action)
            setConfirmation(null)
          }}
        />
      ) : null}
      <SourceInspectorTabs activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === "overview" ? (
        <SourceOverviewTab source={source} />
      ) : activeTab === "chunks" ? (
        <ChunkInspectionTab
          state={chunkState}
          onRetry={loadChunks}
          onOpenChunk={openChunkDetail}
        />
      ) : activeTab === "citations" ? (
        <CitationInspectionTab
          state={citationState}
          onRetry={loadCitations}
          onOpenCitation={openCitationDetail}
          onOpenChunk={openChunkDetail}
        />
      ) : (
        <SourceHistoryTab source={source} />
      )}
      <InspectionDetailOverlay
        state={detailOverlay}
        onClose={() => {
          detailRequestKeyRef.current += 1
          setDetailOverlay({ state: "idle" })
        }}
        onOpenCitation={openCitationDetail}
        onOpenChunk={openChunkDetail}
      />
    </section>
  )
}

function SourceInspectorTabs({
  activeTab,
  onChange,
}: {
  activeTab: InspectorTab
  onChange: (tab: InspectorTab) => void
}) {
  const tabs: { id: InspectorTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "chunks", label: "Chunks" },
    { id: "citations", label: "Citations" },
    { id: "history", label: "History" },
  ]

  return (
    <div
      className="mt-5 grid grid-cols-2 gap-2 rounded-md border bg-muted/30 p-1 text-sm sm:grid-cols-4"
      role="tablist"
      aria-label="Source inspection views"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`min-h-10 rounded px-3 font-medium ${
            activeTab === tab.id
              ? "bg-background shadow-sm"
              : "text-muted-foreground"
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function SourceOverviewTab({ source }: { source: SourceDetail }) {
  return (
    <>
      <dl className="mt-4 grid gap-3 text-sm">
        <DetailTerm label="Approval status" value={source.lifecycleState} />
        <DetailTerm label="Provenance" value={source.provenance} />
        <DetailTerm label="Usage scope" value={source.usageScope.join(", ")} />
        <DetailTerm
          label="Latest ingest"
          value={source.latestIngestJob?.status ?? "not requested"}
        />
        <DetailTerm
          label="Aliases"
          value={source.aliases.length ? source.aliases.join(", ") : "None"}
        />
      </dl>
      {source.partialData.length ? (
        <PartialDataList markers={source.partialData} />
      ) : null}
    </>
  )
}

function ReadinessBlockerSummary({ source }: { source: SourceDetail }) {
  const blocker = getSourceReadinessBlocker(source)

  return (
    <section className="mt-4 rounded-lg border border-amber-600/40 bg-amber-600/10 p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase">
        Readiness-first investigation
      </p>
      <h3 className="mt-2 font-semibold">Current readiness blocker</h3>
      <p className="mt-2 text-sm font-medium">{blocker.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{blocker.message}</p>
    </section>
  )
}

function SourceValidationEvidence({
  source,
  onOpenValidation,
}: {
  source: SourceDetail
  onOpenValidation: () => void
}) {
  const latestValidationEvent = source.validationHistory[0] ?? null
  const outcome =
    source.latestValidationOutcome ?? latestValidationEvent?.outcome
  const summary =
    latestValidationEvent?.summary ??
    (outcome === "succeeded"
      ? "Latest validation signals are healthy for this source."
      : outcome === "warning"
        ? "Validation follow-up is recommended before demo use."
        : outcome === "failed"
          ? "Validation evidence points to a readiness risk."
          : "No validation evidence is recorded for this source yet.")

  return (
    <section className="mt-4 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            Inline validation evidence
          </p>
          <h3 className="mt-2 font-semibold">
            {outcome
              ? `Latest outcome: ${outcome}`
              : "Validation evidence pending"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{summary}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {latestValidationEvent
              ? `${latestValidationEvent.origin} · ${latestValidationEvent.occurredAt}`
              : "Use the validation workbench to create or inspect immutable run history."}
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onOpenValidation}>
          Open validation workbench
        </Button>
      </div>
    </section>
  )
}

type WorkflowCard = {
  title: "Sources" | "Validation" | "Audit/Operations"
  status: string
  metricLabel: string
  metricValue: number
  actionLabel: string
  actionPath: string
  highlights: {
    id: string
    label: string
    summary: string
    path: string
  }[]
}

function WorkflowHealthCard({
  card,
  onNavigate,
}: {
  card: WorkflowCard
  onNavigate: (path: string) => void
}) {
  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{card.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{card.status}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => onNavigate(card.actionPath)}
        >
          {card.actionLabel}
        </Button>
      </div>
      <div className="mt-4 rounded-md border border-dashed p-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase">
          {card.metricLabel}
        </p>
        <p className="mt-2 text-2xl font-semibold">{card.metricValue}</p>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {card.highlights.length ? (
          card.highlights.map((item) => (
            <li key={item.id} className="rounded-md border p-3">
              <p className="font-medium">{item.label}</p>
              <p className="mt-1 text-muted-foreground">{item.summary}</p>
              <button
                type="button"
                className="mt-3 min-h-10 rounded-md border px-3 py-2 font-medium"
                onClick={() => onNavigate(item.path)}
              >
                Open source detail
              </button>
            </li>
          ))
        ) : (
          <li className="rounded-md border p-3 text-muted-foreground">
            No urgent findings are recorded right now.
          </li>
        )}
      </ul>
    </article>
  )
}

function ReadinessPresetBanner({
  preset,
  items,
  onNavigate,
}: {
  preset: MaintainerPreset
  items: {
    id: string
    label: string
    summary: string
    path: string
  }[]
  onNavigate: (path: string) => void
}) {
  const title =
    preset === "sources-needing-attention"
      ? "Sources needing attention"
      : preset === "validation-follow-up"
        ? "Validation follow-up queue"
        : "Recent operational findings"
  const body =
    preset === "sources-needing-attention"
      ? "This drill-down keeps blockers and next actions ahead of the full source inventory."
      : preset === "validation-follow-up"
        ? "These sources should be checked from source detail first, with validation follow-up ready as the next move."
        : "Recent operational activity stays visible here, but source detail remains the first investigative stop."

  return (
    <section className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      {items.length ? (
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-muted-foreground">{item.summary}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate(item.path)}
              >
                Open source detail
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

function buildWorkflowCards(dashboard: StewardshipDashboard): WorkflowCard[] {
  const sourceAttention = dashboard.sources.filter(
    (source) =>
      source.partialData.length > 0 ||
      source.ingestionReadiness !== "ready" ||
      source.lifecycleState !== "active"
  )
  const validationAttention = dashboard.sources.filter(
    (source) => source.latestValidationOutcome !== "succeeded"
  )
  const operationsAttention = dashboard.auditEvents
    .slice(0, 2)
    .map((event) => ({
      id: event.eventId,
      label: event.sourceId,
      summary: event.summary,
      path: buildSourceDetailPath(event.sourceId, "operations-recent-activity"),
    }))

  return [
    {
      title: "Sources",
      status: `${sourceAttention.length} sources still need steward attention.`,
      metricLabel: "Sources with blockers",
      metricValue: sourceAttention.length,
      actionLabel: "Open filtered queue",
      actionPath: "/maintainer/sources?preset=sources-needing-attention",
      highlights: sourceAttention.slice(0, 2).map((source) => ({
        id: source.sourceId,
        label: source.title,
        summary:
          source.partialData[0]?.reason ??
          `${source.lifecycleState} sources still need readiness follow-through.`,
        path: buildSourceDetailPath(
          source.sourceId,
          "sources-needing-attention"
        ),
      })),
    },
    {
      title: "Validation",
      status: `${validationAttention.length} sources need validation follow-up or have no latest success signal.`,
      metricLabel: "Sources needing follow-up",
      metricValue: validationAttention.length,
      actionLabel: "Review follow-up queue",
      actionPath: "/maintainer/sources?preset=validation-follow-up",
      highlights: validationAttention.slice(0, 2).map((source) => ({
        id: source.sourceId,
        label: source.title,
        summary:
          source.latestValidationOutcome == null
            ? "No validation evidence has been recorded yet."
            : `Latest validation outcome is ${source.latestValidationOutcome}.`,
        path: buildSourceDetailPath(source.sourceId, "validation-follow-up"),
      })),
    },
    {
      title: "Audit/Operations",
      status: `${dashboard.auditEvents.length} recent audit events are available for review.`,
      metricLabel: "Recent operational events",
      metricValue: dashboard.auditEvents.length,
      actionLabel: "Open operations",
      actionPath: "/maintainer/operations?preset=operations-recent-activity",
      highlights: operationsAttention,
    },
  ]
}

function buildSourceDetailPath(
  sourceId: string,
  preset: MaintainerPreset | null
) {
  const encoded = encodeURIComponent(sourceId)
  return preset
    ? `/maintainer/sources/${encoded}?preset=${preset}`
    : `/maintainer/sources/${encoded}`
}

function pathForPreset(preset: MaintainerPreset | null) {
  if (preset === "operations-recent-activity") {
    return "/maintainer/operations?preset=operations-recent-activity"
  }
  if (preset === "validation-follow-up") {
    return "/maintainer/sources?preset=validation-follow-up"
  }
  if (preset === "sources-needing-attention") {
    return "/maintainer/sources?preset=sources-needing-attention"
  }
  return "/maintainer/sources"
}

function filterSourcesForPreset(
  sources: SourceInventoryItem[],
  preset: MaintainerPreset | null
) {
  if (preset === "sources-needing-attention") {
    return sources.filter(
      (source) =>
        source.partialData.length > 0 ||
        source.ingestionReadiness !== "ready" ||
        source.lifecycleState !== "active"
    )
  }
  if (preset === "validation-follow-up") {
    return sources.filter(
      (source) => source.latestValidationOutcome !== "succeeded"
    )
  }
  return sources
}

function getPresetFocusItems(
  dashboard: StewardshipDashboard,
  preset: MaintainerPreset | null
) {
  if (preset === "operations-recent-activity") {
    return dashboard.auditEvents.slice(0, 3).map((event) => ({
      id: event.eventId,
      label: event.sourceId,
      summary: event.summary,
      path: buildSourceDetailPath(event.sourceId, "operations-recent-activity"),
    }))
  }

  return filterSourcesForPreset(dashboard.sources, preset)
    .slice(0, 3)
    .map((source) => ({
      id: source.sourceId,
      label: source.title,
      summary:
        preset === "validation-follow-up"
          ? source.latestValidationOutcome == null
            ? "No validation evidence has been recorded yet."
            : `Latest validation outcome is ${source.latestValidationOutcome}.`
          : (source.partialData[0]?.reason ??
            `${source.lifecycleState} sources still need maintainer follow-through.`),
      path: buildSourceDetailPath(source.sourceId, preset),
    }))
}

function getSourceReadinessBlocker(source: SourceDetail) {
  if (source.lifecycleState === "draft") {
    return {
      title: "Approval is still blocking the stewardship path.",
      message:
        "Approve this source before activation, retrieval evidence checks, or validation follow-up can become reliable.",
    }
  }
  if (source.latestIngestJob?.status === "queued") {
    return {
      title: "A protected ingest run is still in progress.",
      message:
        "Wait for the queued ingest to finish before treating the latest retrieval evidence as settled.",
    }
  }
  if (source.ingestionReadiness !== "ready") {
    return {
      title: "Retrieval evidence is incomplete for this source.",
      message:
        source.partialData[0]?.reason ??
        "Re-run ingest so the source detail can point to stable chunks and citations.",
    }
  }
  if (
    source.latestValidationOutcome &&
    source.latestValidationOutcome !== "succeeded"
  ) {
    return {
      title: "Validation follow-up is the main readiness blocker.",
      message:
        "This source has evidence available, but the latest validation signal still needs maintainer review before demo use.",
    }
  }
  if (!source.latestValidationOutcome) {
    return {
      title: "Validation evidence has not been recorded yet.",
      message:
        "The source detail is ready, but the next safest move is to create or inspect immutable validation history.",
    }
  }
  return {
    title: "No active blocker is recorded right now.",
    message:
      "This source currently looks ready, so the supporting sections below become the next best place to inspect history and evidence.",
  }
}

function SourceHistoryTab({ source }: { source: SourceDetail }) {
  return (
    <>
      <HistoryGroup title="Approval lineage" events={source.approvalLineage} />
      <HistoryGroup
        title="Ingestion provenance"
        events={source.ingestionProvenance}
      />
      <HistoryGroup
        title="Validation run history"
        events={source.validationHistory}
      />
      <HistoryGroup title="Maintainer audit trail" events={source.auditTrail} />
    </>
  )
}

function ChunkInspectionTab({
  state,
  onRetry,
  onOpenChunk,
}: {
  state: InspectionListState<ChunkRow>
  onRetry: () => void
  onOpenChunk: (chunkId: string) => void
}) {
  const [query, setQuery] = useState("")

  if (state.state === "loading") {
    return <SectionSkeleton label="Loading retrieval chunks" />
  }
  if (state.state === "outage") {
    return <RetryState message={state.message} onRetry={onRetry} />
  }
  if (state.state === "idle") {
    return null
  }
  const filteredChunks =
    state.state === "ready" ? filterChunks(state.records, query) : []

  return (
    <InspectionSurface
      anchor={state.anchor}
      partialData={state.partialData}
      emptyMessage={state.state === "empty" ? state.message : null}
    >
      {state.state === "ready" ? (
        <>
          <InspectionFilter
            label="Filter chunks"
            placeholder="Search by chunk text, heading, id, or page"
            query={query}
            onQueryChange={setQuery}
            visibleCount={Math.min(filteredChunks.length, INSPECTION_ROW_LIMIT)}
            totalCount={filteredChunks.length}
            totalAvailableCount={state.records.length}
            itemLabel="chunks"
          />
          <ResponsiveChunkTable
            chunks={filteredChunks}
            onOpenChunk={onOpenChunk}
          />
        </>
      ) : null}
    </InspectionSurface>
  )
}

function CitationInspectionTab({
  state,
  onRetry,
  onOpenCitation,
  onOpenChunk,
}: {
  state: InspectionListState<CitationRow>
  onRetry: () => void
  onOpenCitation: (citationId: string) => void
  onOpenChunk: (chunkId: string) => void
}) {
  const [query, setQuery] = useState("")

  if (state.state === "loading") {
    return <SectionSkeleton label="Loading citation support" />
  }
  if (state.state === "outage") {
    return <RetryState message={state.message} onRetry={onRetry} />
  }
  if (state.state === "idle") {
    return null
  }
  const filteredCitations =
    state.state === "ready" ? filterCitations(state.records, query) : []

  return (
    <InspectionSurface
      anchor={state.anchor}
      partialData={state.partialData}
      emptyMessage={state.state === "empty" ? state.message : null}
    >
      {state.state === "ready" ? (
        <>
          <InspectionFilter
            label="Filter citations"
            placeholder="Search by display label, citation, chunk id, or page"
            query={query}
            onQueryChange={setQuery}
            visibleCount={Math.min(
              filteredCitations.length,
              INSPECTION_ROW_LIMIT
            )}
            totalCount={filteredCitations.length}
            totalAvailableCount={state.records.length}
            itemLabel="citations"
          />
          <ResponsiveCitationTable
            citations={filteredCitations}
            onOpenCitation={onOpenCitation}
            onOpenChunk={onOpenChunk}
          />
        </>
      ) : null}
    </InspectionSurface>
  )
}

function InspectionSurface({
  anchor,
  partialData,
  emptyMessage,
  children,
}: {
  anchor: InspectionAnchor
  partialData: PartialDataMarker[]
  emptyMessage: string | null
  children: React.ReactNode
}) {
  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-md border border-dashed p-3 text-sm">
        <p className="font-medium">Version anchor</p>
        <p className="mt-2 text-muted-foreground">{anchor.message}</p>
        <dl className="mt-2 grid gap-2 sm:grid-cols-2">
          <DetailTerm label="Document ID" value={anchor.documentId ?? "none"} />
          <DetailTerm label="Version" value={anchor.version ?? "none"} />
          <DetailTerm label="Inspection state" value={anchor.state} />
          <DetailTerm label="Next step" value={anchor.nextStep} />
        </dl>
      </div>
      {emptyMessage ? (
        <SectionState
          title="No retrieval evidence yet"
          body={
            emptyMessage === anchor.message
              ? emptyMessage
              : `${anchor.message} ${emptyMessage}`
          }
        />
      ) : (
        children
      )}
      {partialData.length ? <PartialDataList markers={partialData} /> : null}
    </div>
  )
}

function ResponsiveChunkTable({
  chunks,
  onOpenChunk,
}: {
  chunks: ChunkRow[]
  onOpenChunk: (chunkId: string) => void
}) {
  return (
    <>
      {!chunks.length ? (
        <SectionState
          title="No matching chunks"
          body="Try a different filter to inspect another slice of retrieval evidence."
        />
      ) : null}
      <div className="grid gap-3 md:hidden">
        {chunks.slice(0, INSPECTION_ROW_LIMIT).map((chunk) => (
          <article key={chunk.id} className="rounded-md border p-3 text-sm">
            <p className="font-medium">Chunk {chunk.chunkIndex}</p>
            <p className="mt-1 break-words text-muted-foreground">
              {chunk.contentPreview}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {chunk.tokenCount} tokens · {chunk.activeState}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-3 w-full"
              onClick={() => onOpenChunk(chunk.id)}
            >
              Inspect chunk
            </Button>
          </article>
        ))}
      </div>
      <div className="hidden md:block">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Order</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead className="w-28">Tokens</TableHead>
              <TableHead className="w-32">State</TableHead>
              <TableHead className="w-28">Open</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chunks.slice(0, INSPECTION_ROW_LIMIT).map((chunk) => (
              <TableRow key={chunk.id}>
                <TableCell>{chunk.chunkIndex}</TableCell>
                <TableCell>
                  <span className="block break-words">
                    {chunk.contentPreview}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {chunk.heading ?? "No heading"} · page{" "}
                    {chunk.pageNumber ?? "n/a"}
                  </span>
                </TableCell>
                <TableCell>{chunk.tokenCount}</TableCell>
                <TableCell>{chunk.activeState}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChunk(chunk.id)}
                  >
                    Inspect
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

function ResponsiveCitationTable({
  citations,
  onOpenCitation,
  onOpenChunk,
}: {
  citations: CitationRow[]
  onOpenCitation: (citationId: string) => void
  onOpenChunk: (chunkId: string) => void
}) {
  return (
    <>
      {!citations.length ? (
        <SectionState
          title="No matching citations"
          body="Try a different filter to inspect another slice of citation support."
        />
      ) : null}
      <div className="grid gap-3 md:hidden">
        {citations.slice(0, INSPECTION_ROW_LIMIT).map((citation) => (
          <article key={citation.id} className="rounded-md border p-3 text-sm">
            <p className="font-medium">{citation.displayLabel}</p>
            <p className="mt-1 break-words text-muted-foreground">
              {citation.citationLabel}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-3 w-full"
              onClick={() => onOpenCitation(citation.id)}
            >
              Inspect citation
            </Button>
          </article>
        ))}
      </div>
      <div className="hidden md:block">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead>Display label</TableHead>
              <TableHead>Canonical label</TableHead>
              <TableHead className="w-32">Chunks</TableHead>
              <TableHead className="w-32">State</TableHead>
              <TableHead className="w-28">Open</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {citations.slice(0, INSPECTION_ROW_LIMIT).map((citation) => (
              <TableRow key={citation.id}>
                <TableCell>
                  <span className="break-words">{citation.displayLabel}</span>
                </TableCell>
                <TableCell>
                  <span className="break-words">{citation.citationLabel}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {citation.sectionHeading ?? "No section"} · page{" "}
                    {citation.pageNumber ?? "n/a"}
                  </span>
                </TableCell>
                <TableCell>
                  {citation.linkedChunkIds.slice(0, 2).map((chunkId) => (
                    <button
                      key={chunkId}
                      type="button"
                      className="mr-2 inline-flex min-h-9 items-center rounded-md border px-2 text-xs"
                      onClick={() => onOpenChunk(chunkId)}
                    >
                      <Link2 className="mr-1 size-3" aria-hidden="true" />
                      {chunkId}
                    </button>
                  ))}
                </TableCell>
                <TableCell>{citation.activeState}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenCitation(citation.id)}
                  >
                    Inspect
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

function PartialDataList({ markers }: { markers: PartialDataMarker[] }) {
  return (
    <div className="mt-5 rounded-md border border-dashed p-3 text-sm">
      <p className="font-medium">Partial-data markers</p>
      <ul className="mt-2 space-y-2">
        {markers.map((marker) => (
          <li key={`${marker.field}-${marker.reason}`}>
            {marker.field}: {marker.reason}
          </li>
        ))}
      </ul>
    </div>
  )
}

function InspectionFilter({
  label,
  placeholder,
  query,
  onQueryChange,
  visibleCount,
  totalCount,
  totalAvailableCount,
  itemLabel,
}: {
  label: string
  placeholder: string
  query: string
  onQueryChange: (value: string) => void
  visibleCount: number
  totalCount: number
  totalAvailableCount: number
  itemLabel: string
}) {
  const limitMessage =
    totalCount > INSPECTION_ROW_LIMIT
      ? `Showing first ${INSPECTION_ROW_LIMIT} of ${totalCount} matching ${itemLabel}. Refine the filter to narrow further.`
      : `Showing ${visibleCount} of ${totalCount} matching ${itemLabel}.`

  return (
    <div className="space-y-2 rounded-md border p-3 text-sm">
      <label className="block font-medium">
        {label}
        <input
          type="search"
          className="mt-2 w-full rounded-md border bg-background px-3 py-2"
          placeholder={placeholder}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      <p className="text-muted-foreground">
        {limitMessage}
        {totalAvailableCount !== totalCount
          ? ` Filtered from ${totalAvailableCount} total records.`
          : ""}
      </p>
    </div>
  )
}

function InspectionDetailOverlay({
  state,
  onClose,
  onOpenCitation,
  onOpenChunk,
}: {
  state: InspectionDetailState
  onClose: () => void
  onOpenCitation: (citationId: string) => void
  onOpenChunk: (chunkId: string) => void
}) {
  const dialogRef = useModalFocus(state.state !== "idle", onClose)
  if (state.state === "idle") {
    return null
  }
  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-end bg-background/80 p-0 md:items-center md:justify-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Retrieval evidence detail"
    >
      <div className="max-h-[90svh] w-full overflow-y-auto rounded-t-lg border bg-card p-4 shadow-lg md:max-w-2xl md:rounded-lg">
        {state.state === "loading" ? (
          <p className="font-medium">Loading {state.kind} detail</p>
        ) : state.state === "outage" ? (
          <SectionState title="Evidence unavailable" body={state.message} />
        ) : state.kind === "chunk" ? (
          <ChunkDetailView
            detail={state.detail}
            onOpenCitation={onOpenCitation}
          />
        ) : (
          <CitationDetailView detail={state.detail} onOpenChunk={onOpenChunk} />
        )}
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChunkDetailView({
  detail,
  onOpenCitation,
}: {
  detail: ChunkDetail
  onOpenCitation: (citationId: string) => void
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold">Chunk {detail.chunkIndex}</h3>
      <p className="mt-1 text-xs break-words text-muted-foreground">
        {detail.id}
      </p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <DetailTerm label="Document ID" value={detail.documentId} />
        <DetailTerm label="Inspection state" value={detail.activeState} />
        <DetailTerm label="Heading" value={detail.heading ?? "Not available"} />
        <DetailTerm
          label="Page"
          value={detail.pageNumber?.toString() ?? "Not available"}
        />
        <DetailTerm label="Token count" value={detail.tokenCount.toString()} />
        <DetailTerm
          label="Embedding"
          value={detail.embeddingPresent ? "Present" : "Missing"}
        />
        <DetailTerm
          label="Updated"
          value={detail.updatedAt ?? detail.createdAt ?? "Not available"}
        />
      </dl>
      <pre className="mt-4 max-h-72 rounded-md border bg-muted/30 p-3 text-sm break-words whitespace-pre-wrap">
        {detail.content}
      </pre>
      <CopyButton value={detail.content} label="Copy chunk text" />
      {detail.linkedCitationIds.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {detail.linkedCitationIds.map((citationId) => (
            <Button
              key={citationId}
              type="button"
              variant="outline"
              onClick={() => onOpenCitation(citationId)}
            >
              <Link2 className="size-4" aria-hidden="true" />
              Open citation
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function CitationDetailView({
  detail,
  onOpenChunk,
}: {
  detail: CitationDetail
  onOpenChunk: (chunkId: string) => void
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold">{detail.displayLabel}</h3>
      <p className="mt-1 text-xs break-words text-muted-foreground">
        {detail.id}
      </p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <DetailTerm label="Canonical label" value={detail.citationLabel} />
        <DetailTerm label="Learner display" value={detail.copyableLabel} />
        <DetailTerm label="Source title" value={detail.sourceTitle} />
        <DetailTerm label="Document ID" value={detail.documentId} />
        <DetailTerm label="Inspection state" value={detail.activeState} />
        <DetailTerm
          label="Section"
          value={detail.sectionHeading ?? "Not available"}
        />
        <DetailTerm
          label="Page"
          value={detail.pageNumber?.toString() ?? "Not available"}
        />
        <DetailTerm
          label="Source path"
          value={detail.sourcePath ?? "Not available"}
        />
      </dl>
      <CopyButton value={detail.copyableLabel} label="Copy citation label" />
      <div className="mt-4 flex flex-wrap gap-2">
        {detail.linkedChunks.map((chunk) => (
          <Button
            key={chunk.id}
            type="button"
            variant="outline"
            onClick={() => onOpenChunk(chunk.id)}
          >
            <Link2 className="size-4" aria-hidden="true" />
            Open chunk {chunk.chunkIndex}
          </Button>
        ))}
      </div>
    </div>
  )
}

function CopyButton({ value, label }: { value: string; label: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="mt-3"
      onClick={() => void navigator.clipboard?.writeText(value)}
    >
      <Copy className="size-4" aria-hidden="true" />
      {label}
    </Button>
  )
}

function DetailTerm({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium">{label}</dt>
      <dd className="text-muted-foreground">{value}</dd>
    </div>
  )
}

function filterChunks(chunks: ChunkRow[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return chunks
  }

  return chunks.filter((chunk) =>
    [
      chunk.id,
      chunk.documentId,
      chunk.heading ?? "",
      chunk.contentPreview,
      chunk.pageNumber?.toString() ?? "",
      chunk.chunkIndex.toString(),
    ].some((value) => value.toLowerCase().includes(normalizedQuery))
  )
}

function filterCitations(citations: CitationRow[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return citations
  }

  return citations.filter((citation) =>
    [
      citation.id,
      citation.documentId,
      citation.displayLabel,
      citation.citationLabel,
      citation.sectionHeading ?? "",
      citation.pageNumber?.toString() ?? "",
      citation.linkedChunkIds.join(" "),
    ].some((value) => value.toLowerCase().includes(normalizedQuery))
  )
}

function EditSourcePanel({
  source,
  onClose,
  onSubmit,
}: {
  source: SourceDetail
  onClose: () => void
  onSubmit: (payload: SourceMetadataPayload) => void
}) {
  const dialogRef = useModalFocus(true, onClose)
  const [title, setTitle] = useState(source.title)
  const [sourceType, setSourceType] = useState(source.sourceType)
  const [provenance, setProvenance] = useState(source.provenance)
  const [summary, setSummary] = useState(source.summary)
  const [usageScope, setUsageScope] = useState(source.usageScope.join(", "))

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({
      title,
      sourceType,
      provenance,
      summary,
      usageScope: usageScope
        .split(",")
        .map((scope) => scope.trim())
        .filter(Boolean),
    })
  }

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-end bg-background/80 p-0 sm:items-center sm:justify-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Edit source metadata"
    >
      <form
        className="max-h-[90svh] w-full overflow-y-auto rounded-t-lg border bg-card p-4 shadow-lg sm:max-w-2xl sm:rounded-lg"
        onSubmit={submit}
      >
        <h3 className="text-lg font-semibold">Edit source metadata</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <FormField label="Title" value={title} onChange={setTitle} required />
          <FormField
            label="Type"
            value={sourceType}
            onChange={setSourceType}
            required
          />
          <FormField
            label="Provenance"
            value={provenance}
            onChange={setProvenance}
            required
          />
          <FormField
            label="Usage scope"
            value={usageScope}
            onChange={setUsageScope}
            required
          />
          <label className="block text-sm font-medium sm:col-span-2">
            Summary
            <textarea
              className="mt-2 min-h-24 w-full rounded-md border bg-background px-3 py-2"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              required
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save metadata</Button>
        </div>
      </form>
    </div>
  )
}

function ConfirmLifecycleAction({
  action,
  title,
  onCancel,
  onConfirm,
}: {
  action: "disable" | "archive"
  title: string
  onCancel: () => void
  onConfirm: () => void
}) {
  const dialogRef = useModalFocus(true, onCancel)
  const actionLabel = action === "archive" ? "Archive" : "Disable"
  const body =
    action === "archive"
      ? "This removes the source from active stewardship workflows and cannot be undone from this screen."
      : "This removes the source from retrieval eligibility until a maintainer activates it again."

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-end bg-background/80 p-0 sm:items-center sm:justify-center sm:p-6"
      role="alertdialog"
      aria-modal="true"
      aria-label={`${actionLabel} source`}
    >
      <div className="w-full rounded-t-lg border bg-card p-4 shadow-lg sm:max-w-md sm:rounded-lg">
        <h3 className="text-lg font-semibold">{actionLabel} source</h3>
        <p className="mt-2 text-sm text-muted-foreground">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={action === "archive" ? "destructive" : "outline"}
            onClick={onConfirm}
          >
            {`Confirm ${action.toLowerCase()}`}
          </Button>
        </div>
      </div>
    </div>
  )
}

function useModalFocus(open: boolean, onClose: () => void) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null
    const modalRoot = containerRef.current
    if (!modalRoot) {
      return
    }

    const focusable = getFocusableElements(modalRoot!)
    focusable[0]?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== "Tab") {
        return
      }

      const nodes = getFocusableElements(modalRoot!)
      if (nodes.length === 0) {
        event.preventDefault()
        return
      }

      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocusRef.current?.focus()
    }
  }, [onClose, open])

  return containerRef
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute("disabled"))
}

function LifecycleBadge({ state }: { state: SourceLifecycleState }) {
  const tone = {
    draft: "border-muted-foreground/30 bg-muted text-muted-foreground",
    approved: "border-primary/30 bg-primary/10 text-primary",
    active: "border-emerald-600/30 bg-emerald-600/10 text-emerald-700",
    disabled: "border-amber-600/30 bg-amber-600/10 text-amber-700",
    archived: "border-destructive/30 bg-destructive/10 text-destructive",
  } satisfies Record<SourceLifecycleState, string>

  return (
    <span
      className={`inline-flex min-h-8 items-center rounded-md border px-2.5 text-xs font-semibold uppercase ${tone[state]}`}
    >
      {state}
    </span>
  )
}

function OperationalRecords({
  ingestionRuns,
  validationRuns,
  auditEvents,
}: {
  ingestionRuns: StewardshipEvent[]
  validationRuns: StewardshipEvent[]
  auditEvents: StewardshipEvent[]
}) {
  return (
    <section
      className="grid gap-4 xl:grid-cols-3"
      aria-label="Operational visibility"
    >
      <EventList title="Ingestion records" events={ingestionRuns} />
      <EventList title="Validation records" events={validationRuns} />
      <EventList title="Audit records" events={auditEvents} />
    </section>
  )
}

function HistoryGroup({
  title,
  events,
}: {
  title: string
  events: StewardshipEvent[]
}) {
  return <EventList title={title} events={events} compact />
}

function EventList({
  title,
  events,
  compact = false,
}: {
  title: string
  events: StewardshipEvent[]
  compact?: boolean
}) {
  return (
    <section className={compact ? "mt-5" : "rounded-lg border bg-card p-4"}>
      <h3 className="font-semibold">{title}</h3>
      {events.length ? (
        <ul className="mt-3 space-y-3 text-sm">
          {events.map((event) => (
            <li key={event.eventId} className="rounded-md border p-3">
              <p className="font-medium">{event.outcome}</p>
              <p className="mt-1 text-muted-foreground">{event.summary}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {event.origin} · {event.occurredAt}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          No history is available.
        </p>
      )}
    </section>
  )
}

export function SectionSkeleton({ label }: { label: string }) {
  return (
    <section
      className="rounded-lg border bg-card p-6"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="font-medium">{label}</p>
      <div className="mt-5 grid gap-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-12 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    </section>
  )
}

export function SectionState({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-lg border bg-card p-6" aria-live="polite">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </section>
  )
}

export function RetryState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <section className="rounded-lg border bg-card p-6" aria-live="polite">
      <h2 className="text-xl font-semibold">
        Dashboard temporarily unavailable
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <button
        type="button"
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border px-4 py-2 font-medium"
        onClick={onRetry}
      >
        <RefreshCcw className="size-4" aria-hidden="true" />
        Retry dashboard load
      </button>
    </section>
  )
}

export function mapGateError(error: unknown): GateState {
  if (!(error instanceof MaintainerApiError)) {
    return {
      state: "outage",
      message: "The maintainer access check could not be completed.",
    }
  }
  if (error.code === "admin_auth_missing") {
    return { state: "signedOut" }
  }
  if (error.code === "admin_maintainer_inactive") {
    return { state: "inactive", message: error.message }
  }
  if (error.code === "admin_auth_invalid") {
    return { state: "expiredSession" }
  }
  if (error.status === 403) {
    return { state: "unauthorized", message: error.message }
  }
  return { state: "outage", message: error.message }
}

export function mutationErrorState(error: unknown): MutationState {
  if (error instanceof MaintainerApiError) {
    return {
      state: "failed",
      message: error.message,
      retryable:
        error.status >= 500 || error.code === "admin_response_malformed",
      fields: error.fields,
    }
  }

  return {
    state: "failed",
    message: "The protected source request could not be completed.",
    retryable: true,
    fields: {},
  }
}
