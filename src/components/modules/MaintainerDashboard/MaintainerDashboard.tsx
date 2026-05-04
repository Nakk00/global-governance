import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Archive,
  CheckCircle2,
  FileUp,
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
import { MaintainerLogin } from "@/components/modules/MaintainerDashboard/MaintainerLogin"
import {
  fetchAdminMe,
  fetchSourceDetail,
  fetchStewardshipDashboard,
  ingestSource,
  MaintainerApiError,
  mutateSourceLifecycle,
  updateSourceMetadata,
  uploadSource,
  type AdminIdentity,
  type SourceDetail,
  type SourceInventoryItem,
  type SourceLifecycleState,
  type SourceMetadataPayload,
  type SourceMutationResult,
  type SourceUploadPayload,
  type StewardshipDashboard,
  type StewardshipEvent,
} from "@/lib/maintainer/api"
import {
  clearSupabaseSession,
  getSupabaseSession,
  isSupabaseSessionExpired,
  type SupabaseSession,
} from "@/lib/supabase/browser-client"

type GateState =
  | { state: "loading" }
  | { state: "signedOut" }
  | { state: "expiredSession" }
  | { state: "unauthorized"; message: string }
  | { state: "inactive"; message: string }
  | { state: "revokedSession"; message: string }
  | { state: "outage"; message: string }
  | { state: "ready"; identity: AdminIdentity; session: SupabaseSession }

type DashboardState =
  | { state: "loading" }
  | { state: "empty" }
  | { state: "outage"; message: string }
  | { state: "ready"; dashboard: StewardshipDashboard }

type DetailState =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "empty"; message: string }
  | { state: "outage"; message: string }
  | { state: "ready"; source: SourceDetail }

type MutationMode =
  | "upload"
  | "edit"
  | "approve"
  | "activate"
  | "disable"
  | "archive"
  | "ingest"

type MutationState =
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

export function MaintainerDashboard() {
  const [gate, setGate] = useState<GateState>({ state: "loading" })
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    state: "loading",
  })
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [detailState, setDetailState] = useState<DetailState>({ state: "idle" })
  const [mutationState, setMutationState] = useState<MutationState>({
    state: "idle",
  })

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
      setDetailState({ state: "loading" })
      try {
        setDetailState({
          state: "ready",
          source: await fetchSourceDetail(sourceId, session),
        })
      } catch (error) {
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
      setDetailState({ state: "idle" })
    } catch (error) {
      if (handleMaintainerReadAuthFailure(error, setGate)) {
        setDetailState({ state: "idle" })
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
    if (gate.state === "ready" && selectedSourceId) {
      // Source detail is a follow-up backend read keyed by the current selection.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadSourceDetail(selectedSourceId, gate.session)
    }
  }, [gate, selectedSourceId, loadSourceDetail])

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

      {dashboardState.state === "loading" ? (
        <SectionSkeleton label="Loading source stewardship records" />
      ) : dashboardState.state === "empty" ? (
        <SectionState
          title="No approved sources yet"
          body="The approved inventory returned an empty dataset."
        />
      ) : dashboardState.state === "outage" ? (
        <RetryState
          message={dashboardState.message}
          onRetry={() => loadDashboard(gate.session)}
        />
      ) : (
        <DashboardView
          dashboard={dashboardState.dashboard}
          selectedSourceId={selectedSourceId}
          detailState={detailState}
          mutationState={mutationState}
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
      )}
    </MaintainerFrame>
  )
}

function MaintainerFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-8 lg:px-10">
        {children}
      </div>
    </main>
  )
}

function AccessStateView({
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
  dashboard,
  selectedSourceId,
  detailState,
  mutationState,
  onSelectSource,
  onUploadSource,
  onUpdateSource,
  onLifecycleAction,
  onIngestSource,
  onRetrySourceDetail,
}: {
  dashboard: StewardshipDashboard
  selectedSourceId: string | null
  detailState: DetailState
  mutationState: MutationState
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
  const selectedSource = useMemo(
    () =>
      dashboard.sources.find(
        (source) => source.sourceId === selectedSourceId
      ) ?? dashboard.sources[0],
    [dashboard.sources, selectedSourceId]
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.9fr)]">
      <section className="space-y-6">
        <OverviewCards dashboard={dashboard} />
        <MutationStatus state={mutationState} />
        <SourceUploadPanel
          mutationState={mutationState}
          onSubmit={onUploadSource}
        />
        <SourceTable
          sources={dashboard.sources}
          selectedSourceId={selectedSource?.sourceId ?? null}
          onSelectSource={onSelectSource}
        />
        <OperationalRecords
          ingestionRuns={dashboard.ingestionRuns}
          validationRuns={dashboard.validationRuns}
          auditEvents={dashboard.auditEvents}
        />
      </section>
      <aside aria-label="Source detail and history" className="space-y-4">
        {detailState.state === "loading" ? (
          <SectionSkeleton label="Loading source history" />
        ) : detailState.state === "ready" ? (
          <SourceDetailPanel
            source={detailState.source}
            mutationState={mutationState}
            onUpdateSource={onUpdateSource}
            onLifecycleAction={onLifecycleAction}
            onIngestSource={onIngestSource}
          />
        ) : detailState.state === "empty" ? (
          <SectionState title="Source unavailable" body={detailState.message} />
        ) : detailState.state === "outage" ? (
          <RetryState
            message={detailState.message}
            onRetry={() =>
              selectedSource
                ? onRetrySourceDetail(selectedSource.sourceId)
                : null
            }
          />
        ) : (
          <SectionState
            title="Select a source"
            body="Choose an approved source to inspect its metadata and action trail."
          />
        )}
      </aside>
    </div>
  )
}

function handleMaintainerReadAuthFailure(
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
  mutationState,
  onUpdateSource,
  onLifecycleAction,
  onIngestSource,
}: {
  source: SourceDetail
  mutationState: MutationState
  onUpdateSource: (sourceId: string, payload: SourceMetadataPayload) => void
  onLifecycleAction: (
    sourceId: string,
    action: "approve" | "activate" | "disable" | "archive"
  ) => void
  onIngestSource: (sourceId: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [confirmation, setConfirmation] = useState<ConfirmationState>(null)
  const isSubmitting = mutationState.state === "submitting"

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
      {source.partialData.length ? (
        <div className="mt-5 rounded-md border border-dashed p-3 text-sm">
          <p className="font-medium">Partial-data markers</p>
          <ul className="mt-2 space-y-2">
            {source.partialData.map((marker) => (
              <li key={marker.field}>
                {marker.field}: {marker.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
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

function SectionSkeleton({ label }: { label: string }) {
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

function SectionState({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-lg border bg-card p-6" aria-live="polite">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </section>
  )
}

function RetryState({
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

function mapGateError(error: unknown): GateState {
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

function mutationErrorState(error: unknown): MutationState {
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
