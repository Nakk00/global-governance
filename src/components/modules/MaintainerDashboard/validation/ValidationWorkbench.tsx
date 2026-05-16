import { useCallback, useEffect, useRef, useState } from "react"
import { AlertTriangle, CheckCircle2, Eye, Loader2, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  fetchValidationRunDetail,
  fetchValidationRuns,
  fetchValidationSets,
  launchValidationRun,
  type ValidationResult,
  type ValidationRunDetail,
  type ValidationRunSummary,
  type ValidationSet,
} from "@/lib/maintainer/api"
import type { SupabaseSession } from "@/lib/supabase/browser-client"

import {
  ValidationAlert,
  ValidationResultOverlay,
  ValidationRunHistory,
  validationAlertForRun,
  validationDetailAlert,
  validationStatusLabel,
} from "../shared/maintainerDashboardShared"
import { RetryState, SectionSkeleton, SectionState } from "../shared/states"
import { ValidationRemediationQueue } from "./ValidationRemediationQueue"

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

export function ValidationSummary({ run }: { run: ValidationRunSummary }) {
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

export function ValidationResultsTable({
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

function DetailTerm({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium">{label}</dt>
      <dd className="text-muted-foreground">{value}</dd>
    </div>
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
          <ValidationRemediationQueue
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
