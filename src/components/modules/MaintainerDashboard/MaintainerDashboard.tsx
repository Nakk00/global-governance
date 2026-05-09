import { LogOut, ShieldCheck } from "lucide-react"

import { MaintainerLogin } from "@/components/modules/MaintainerDashboard/MaintainerLogin"
import { useMaintainerDashboardData } from "@/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData"
import { useMaintainerGate } from "@/components/modules/MaintainerDashboard/hooks/useMaintainerGate"
import { useMaintainerNavigation } from "@/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation"
import { OperationsPage } from "@/components/modules/MaintainerDashboard/operations/OperationsPage"
import { OverviewPage } from "@/components/modules/MaintainerDashboard/overview/OverviewPage"
import { SourceDetailPage } from "@/components/modules/MaintainerDashboard/sources/SourceDetailPage"
import { MaintainerSectionNav } from "@/components/modules/MaintainerDashboard/shared/MaintainerSectionNav"
import {
  AccessStateView,
  DashboardDataState,
  EMPTY_STEWARDSHIP_DASHBOARD,
  MaintainerFrame,
  SectionSkeleton,
  SourceUploadPage,
  SourcesPage,
} from "@/components/modules/MaintainerDashboard/shared/maintainerDashboardShared"
import { ValidationWorkbench } from "@/components/modules/MaintainerDashboard/validation/ValidationWorkbench"

export function MaintainerDashboard({
  initialPath,
}: {
  initialPath?: string
} = {}) {
  const { gate, setGate, resolveGate, signOut } = useMaintainerGate()
  const { route, navigateTo } = useMaintainerNavigation({ initialPath })
  const {
    dashboardState,
    detailState,
    mutationState,
    selectedSourceId,
    setSelectedSourceId,
    retryDashboard,
    retrySourceDetail,
    uploadDraft,
    updateSource,
    runLifecycleAction,
    queueIngest,
    resetData,
  } = useMaintainerDashboardData({
    gate,
    route,
    setGate,
    navigateTo,
  })

  function handleSignOut() {
    signOut()
    resetData()
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
            onClick={handleSignOut}
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      <div className="space-y-5">
        <MaintainerSectionNav route={route} onNavigate={navigateTo} />
        {route.section === "overview" ? (
          dashboard ? (
            <OverviewPage dashboard={dashboard} onNavigate={navigateTo} />
          ) : (
            <DashboardDataState
              state={dashboardState}
              onRetry={retryDashboard}
            />
          )
        ) : route.section === "sources" ? (
          dashboard ? (
            <SourcesPage
              route={route}
              dashboard={dashboard}
              selectedSourceId={selectedSource?.sourceId ?? null}
              onNavigate={navigateTo}
              onSelectSource={setSelectedSourceId}
            />
          ) : (
            <DashboardDataState
              state={dashboardState}
              onRetry={retryDashboard}
            />
          )
        ) : route.section === "sourceNew" ? (
          <SourceUploadPage
            mutationState={mutationState}
            onSubmit={uploadDraft}
          />
        ) : route.section === "sourceDetail" ? (
          <SourceDetailPage
            route={route}
            sourceId={route.sourceId}
            selectedSource={routedSource}
            detailState={detailState}
            session={gate.session}
            mutationState={mutationState}
            onNavigate={navigateTo}
            onUpdateSource={updateSource}
            onLifecycleAction={runLifecycleAction}
            onIngestSource={queueIngest}
            onRetrySourceDetail={retrySourceDetail}
          />
        ) : route.section === "validation" ? (
          <ValidationWorkbench session={gate.session} />
        ) : dashboard ? (
          <OperationsPage dashboard={dashboard} />
        ) : (
          <DashboardDataState state={dashboardState} onRetry={retryDashboard} />
        )}
      </div>
    </MaintainerFrame>
  )
}
