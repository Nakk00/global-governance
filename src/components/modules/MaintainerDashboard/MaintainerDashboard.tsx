import { LogOut, ShieldCheck } from "lucide-react"

import { MaintainerLogin } from "@/components/modules/MaintainerDashboard/MaintainerLogin"
import { useMaintainerDashboardData } from "@/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData"
import { useMaintainerGate } from "@/components/modules/MaintainerDashboard/hooks/useMaintainerGate"
import { useMaintainerNavigation } from "@/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation"
import { AuditTrailPage } from "@/components/modules/MaintainerDashboard/audit-trail/AuditTrailPage"
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
import { ChatbotTrustPage } from "@/components/modules/MaintainerDashboard/trust/ChatbotTrustPage"
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
      <header className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold tracking-normal text-cyan-300 uppercase">
            Private source stewardship
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-normal text-white">
            Maintainer control center
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-100">
            Readiness, blockers, validation health, audit history, and chatbot
            trust for the private maintainer workflow.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm lg:justify-end">
          <img
            src="/admin-logo.png"
            alt="Global Governance admin"
            className="h-12 w-12 rounded-lg bg-white p-1 shadow-lg shadow-sky-950/30"
          />
          <span className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 font-semibold text-white shadow-sm shadow-black/20 backdrop-blur-md">
            <ShieldCheck className="size-4" aria-hidden="true" />
            {gate.identity.email}
          </span>
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 font-semibold text-white shadow-sm shadow-black/20 backdrop-blur-md transition hover:border-sky-300/45 hover:bg-white/15 focus-visible:ring-3 focus-visible:ring-sky-300/40 focus-visible:outline-none"
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
        ) : route.section === "auditTrail" ? (
          dashboard ? (
            <AuditTrailPage dashboard={dashboard} onNavigate={navigateTo} />
          ) : (
            <DashboardDataState
              state={dashboardState}
              onRetry={retryDashboard}
            />
          )
        ) : route.section === "chatbotTrust" ? (
          dashboard ? (
            <ChatbotTrustPage dashboard={dashboard} />
          ) : (
            <DashboardDataState
              state={dashboardState}
              onRetry={retryDashboard}
            />
          )
        ) : dashboard ? (
          <OperationsPage dashboard={dashboard} />
        ) : (
          <DashboardDataState state={dashboardState} onRetry={retryDashboard} />
        )}
      </div>
    </MaintainerFrame>
  )
}
