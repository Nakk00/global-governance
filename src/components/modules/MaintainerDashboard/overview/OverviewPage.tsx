import { Link2 } from "lucide-react"

import { AdminUtilityBar } from "@/components/modules/MaintainerDashboard/AdminPortalShell"
import type { StewardshipDashboard } from "@/lib/maintainer/source-api"

import {
  ActionIcon,
  ActionPill,
  AlertTriangle,
  Check,
  ChevronRight,
  CoverageBar,
  Eye,
  FilterChip,
  Info,
  Legend,
  RingMetric,
  RunStatusPill,
  SeverityPill,
  ShieldCheck,
  SourceStatusPill,
  Sparkline,
  StatusCard,
  StatusPill,
} from "./OverviewMetrics"
import { DashboardPanel, CompactTable } from "./OverviewTables"
import {
  CHECKLIST_ITEMS,
  buildActions,
  buildAuditRows,
  buildBlockers,
  buildSourceRow,
  buildTrustSummary,
  buildValidationRows,
  buildValidationSummary,
  formatSyncTime,
} from "./overview-builders"

type OverviewPageProps = {
  dashboard: StewardshipDashboard
  onNavigate: (path: string) => void
}

export function OverviewPage({ dashboard, onNavigate }: OverviewPageProps) {
  const blockers = buildBlockers(dashboard)
  const actions = buildActions(dashboard.monitoring.nextActions)
  const sourceRows = dashboard.sources.slice(0, 5).map((source, index) =>
    buildSourceRow(
      source,
      dashboard.auditEvents.find((event) => event.sourceId === source.sourceId),
      index
    )
  )
  const validationRows = buildValidationRows(dashboard)
  const auditRows = buildAuditRows(dashboard)
  const sourceFocus = sourceRows[0]
  const validationSummary = buildValidationSummary(dashboard.validationRuns)
  const trustSummary = buildTrustSummary(dashboard)
  const lastSync = formatSyncTime(
    dashboard.auditTrail.latestEventAt ??
      dashboard.auditEvents[0]?.occurredAt ??
      dashboard.validationRuns[0]?.occurredAt ??
      null
  )

  return (
    <section aria-labelledby="admin-readiness-heading">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <h1
            id="admin-readiness-heading"
            className="text-2xl font-bold tracking-normal text-white"
          >
            Readiness Overview
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Private maintainer console for project readiness and trust
            monitoring.
          </p>
        </div>
        <AdminUtilityBar
          userInitials="AD"
          lastSync={lastSync}
          onNavigate={onNavigate}
        />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-4">
        <StatusCard
          title="System Readiness"
          icon={<Info className="size-3" aria-hidden />}
          accent="green"
          body={
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full border-4 border-green-500/75 bg-green-500/10 text-green-300 shadow-[0_0_25px_rgba(34,197,94,0.28)]">
                <Check className="size-8" aria-hidden />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  Presentation Ready
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  All critical systems operational.
                </p>
                <StatusPill tone="green">Approved</StatusPill>
              </div>
            </div>
          }
        />
        <StatusCard
          title="Open Blockers"
          icon={<Info className="size-3" aria-hidden />}
          body={
            <div className="flex items-center gap-4">
              <AlertTriangle
                className="size-14 fill-amber-400 text-amber-400"
                aria-hidden
              />
              <div>
                <p className="text-2xl font-semibold text-white">
                  {blockers.length}
                </p>
                <p className="mt-1 text-sm text-slate-300">Require attention</p>
                <StatusPill tone="amber">Warning</StatusPill>
              </div>
            </div>
          }
        />
        <StatusCard
          title="Validation Health"
          icon={<Info className="size-3" aria-hidden />}
          body={
            <div className="flex items-center gap-4">
              <RingMetric value={validationSummary.passRate} tone="green" />
              <div>
                <p className="text-sm font-semibold text-white">Pass Rate</p>
                <p className="mt-1 text-sm text-slate-300">
                  {validationSummary.passed} / {validationSummary.total} checks
                  passed
                </p>
                <StatusPill tone="green">Healthy</StatusPill>
              </div>
            </div>
          }
        />
        <StatusCard
          title="Chat Reliability"
          icon={<Info className="size-3" aria-hidden />}
          body={
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center text-green-300">
                <ShieldCheck className="size-14" aria-hidden />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  {trustSummary.state}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Grounding and responses on track.
                </p>
                <StatusPill tone="green">Healthy</StatusPill>
              </div>
            </div>
          }
        />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1.05fr_1fr_1.24fr]">
        <DashboardPanel
          title="Current Blockers / Warnings"
          badge={String(blockers.length)}
          footer="View all blockers"
          onFooterClick={() => onNavigate("/maintainer/sources")}
        >
          <div className="divide-y divide-sky-300/10">
            {blockers.slice(0, 3).map((blocker) => (
              <button
                key={blocker.id}
                type="button"
                className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-3 py-1 text-left transition hover:bg-sky-400/5 focus-visible:ring-2 focus-visible:ring-sky-300/60 focus-visible:outline-none"
                onClick={() => onNavigate(blocker.href)}
              >
                <span className="flex min-w-0 gap-3">
                  {blocker.icon === "critical" ? (
                    <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      !
                    </span>
                  ) : (
                    <AlertTriangle
                      className="mt-1 size-5 shrink-0 fill-amber-400 text-amber-400"
                      aria-hidden
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block text-[11px] leading-tight font-semibold text-white">
                      {blocker.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] leading-tight text-slate-300">
                      {blocker.detail}
                    </span>
                  </span>
                </span>
                <SeverityPill severity={blocker.severity} />
                <ChevronRight className="size-4 text-slate-300" aria-hidden />
              </button>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel title="Recommended Next Actions">
          <div className="divide-y divide-sky-300/10">
            {actions.slice(0, 4).map((action) => (
              <button
                key={action.id}
                type="button"
                className="grid w-full grid-cols-[1fr_auto] items-center gap-3 py-1 text-left transition hover:bg-sky-400/5 focus-visible:ring-2 focus-visible:ring-sky-300/60 focus-visible:outline-none"
                onClick={() => onNavigate(action.href)}
              >
                <span className="flex min-w-0 gap-3">
                  <ActionIcon type={action.icon} />
                  <span className="min-w-0">
                    <span className="block text-[11px] leading-tight font-semibold text-white">
                      {action.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] leading-tight text-slate-300">
                      {action.detail}
                    </span>
                  </span>
                </span>
                <ChevronRight className="size-4 text-slate-300" aria-hidden />
              </button>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Demo / Release Checklist"
          footer="View full checklist"
          onFooterClick={() => onNavigate("/maintainer/operations")}
        >
          <div className="space-y-1.5 pt-0.5">
            {CHECKLIST_ITEMS.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[1fr_auto] items-center gap-3 text-[11px]"
              >
                <span className="flex items-center gap-2 text-slate-200">
                  {item.status === "done" ? (
                    <span className="flex size-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                      <Check className="size-3" aria-hidden />
                    </span>
                  ) : (
                    <span className="size-4 rounded-full border border-slate-400" />
                  )}
                  {item.label}
                </span>
                {item.status === "pending" ? (
                  <StatusPill tone="blue">{item.time}</StatusPill>
                ) : (
                  <span className="text-slate-400">{item.time}</span>
                )}
              </div>
            ))}
          </div>
        </DashboardPanel>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_0.94fr_1.18fr]">
        <DashboardPanel
          title="Source Management"
          footer="View all sources"
          onFooterClick={() => onNavigate("/maintainer/sources")}
        >
          <CompactTable
            columns={[
              "Source",
              "Status",
              "Last Updated",
              "Coverage",
              "Actions",
            ]}
          >
            {sourceRows.map((row) => (
              <tr
                key={row.source.sourceId}
                className="border-t border-sky-300/8"
              >
                <td className="max-w-[210px] truncate py-1.5 pr-2 text-xs text-slate-200">
                  <span className="mr-2 inline-flex size-4 items-center justify-center rounded border border-sky-400/45 text-[10px] text-sky-300">
                    {row.source.sourceType[0]?.toUpperCase() ?? "S"}
                  </span>
                  {row.source.title}
                </td>
                <td className="py-1.5 pr-2">
                  <SourceStatusPill tone={row.statusTone}>
                    {row.status}
                  </SourceStatusPill>
                </td>
                <td className="py-1.5 pr-2 text-xs text-slate-300">
                  {row.updated}
                </td>
                <td className="py-1.5 pr-2">
                  <CoverageBar value={row.coverage} />
                </td>
                <td className="py-1.5 text-right">
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded text-slate-300 hover:bg-white/8 hover:text-white focus-visible:ring-2 focus-visible:ring-sky-300/60 focus-visible:outline-none"
                    aria-label={`Open ${row.source.title}`}
                    onClick={() =>
                      onNavigate(
                        `/maintainer/sources/${encodeURIComponent(row.source.sourceId)}`
                      )
                    }
                  >
                    <Eye className="size-4" aria-hidden />
                  </button>
                </td>
              </tr>
            ))}
          </CompactTable>

          {sourceFocus ? (
            <div className="mt-3 rounded-md border border-sky-400/25 bg-sky-950/38 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md border border-sky-400/40 bg-sky-500/15 text-sky-300">
                    <Link2 className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {sourceFocus.source.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-300">
                      Primary international legal document establishing core
                      source coverage.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300 hover:text-sky-100"
                  onClick={() =>
                    onNavigate(
                      `/maintainer/sources/${encodeURIComponent(sourceFocus.source.sourceId)}`
                    )
                  }
                >
                  View full details
                  <ChevronRight className="size-3" aria-hidden />
                </button>
              </div>
              <div className="mt-3 grid gap-4 text-xs text-slate-300 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-1 text-white">
                    Source Support Visibility
                    <Info className="size-3 text-slate-400" aria-hidden />
                  </p>
                  <p className="mt-2 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-green-400" />
                    Always shown in chatbot citations and details
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-white">
                    Topics Covered
                    <Info className="size-3 text-slate-400" aria-hidden />
                  </p>
                  <p className="mt-2">26 of 28 key topics</p>
                  <CoverageBar value={93} />
                </div>
              </div>
            </div>
          ) : null}
        </DashboardPanel>

        <DashboardPanel
          title="Validation Center"
          subtitle="Recent Runs"
          footer="View all runs"
          onFooterClick={() => onNavigate("/maintainer/validation")}
        >
          <CompactTable
            columns={[
              "Run ID",
              "Date / Time",
              "Result",
              "Issues (Top)",
              "Next Action",
            ]}
          >
            {validationRows.map((row) => (
              <tr key={row.id} className="border-t border-sky-300/8">
                <td className="py-1.5 pr-2 text-xs text-slate-300">{row.id}</td>
                <td className="py-1.5 pr-2 text-xs text-slate-300">
                  {row.date}
                </td>
                <td className="py-1.5 pr-2">
                  <RunStatusPill result={row.result}>
                    {row.result}
                  </RunStatusPill>
                </td>
                <td className="py-1.5 pr-2 text-xs text-slate-300">
                  {row.issues}
                </td>
                <td className="py-1.5 text-xs text-sky-300">
                  {row.nextAction}
                </td>
              </tr>
            ))}
          </CompactTable>
          <div className="mt-4">
            <p className="text-sm font-semibold text-white">
              Validation Health{" "}
              <span className="font-normal text-slate-300">(last 14 runs)</span>
            </p>
            <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="bg-green-500" style={{ width: "74%" }} />
              <div className="bg-amber-400" style={{ width: "16%" }} />
              <div className="bg-red-500" style={{ width: "10%" }} />
            </div>
            <div className="mt-3 flex gap-5 text-xs text-slate-300">
              <Legend color="bg-green-500" label="Passed (10)" />
              <Legend color="bg-amber-400" label="Warning (3)" />
              <Legend color="bg-red-500" label="Failed (1)" />
            </div>
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Audit Trail"
          subtitle="Recent Activity"
          footer="View full audit trail"
          onFooterClick={() => onNavigate("/maintainer/audit-trail")}
        >
          <div className="mb-3 flex flex-wrap gap-2 text-xs">
            <FilterChip>May 5 - May 12, 2025</FilterChip>
            <FilterChip>All Sources</FilterChip>
            <FilterChip>All Actions</FilterChip>
            <button type="button" className="text-sky-300 hover:text-sky-100">
              Clear filters
            </button>
          </div>
          <CompactTable columns={["Time", "Actor", "Action", "Details"]}>
            {auditRows.map((row) => (
              <tr key={row.id} className="border-t border-sky-300/8">
                <td className="py-1.5 pr-2 text-xs text-slate-300">
                  {row.time}
                </td>
                <td className="py-1.5 pr-2">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-slate-700 text-[10px] text-slate-200">
                    {row.actor}
                  </span>
                </td>
                <td className="py-1.5 pr-2">
                  <ActionPill tone={row.tone}>{row.action}</ActionPill>
                </td>
                <td className="py-1.5 text-xs text-slate-300">{row.details}</td>
              </tr>
            ))}
          </CompactTable>
        </DashboardPanel>
      </div>

      <DashboardPanel className="mt-3" title="Chatbot Trust Monitoring">
        <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr_0.7fr]">
          <div className="grid gap-2 sm:grid-cols-5">
            {trustSummary.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-md border border-sky-300/14 bg-slate-950/32 p-3"
              >
                <p className="text-xs text-slate-300">{metric.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {metric.value}
                </p>
                <p
                  className={
                    metric.tone === "warn"
                      ? "mt-1 text-xs text-amber-300"
                      : "mt-1 text-xs text-green-300"
                  }
                >
                  {metric.delta}
                </p>
                <Sparkline tone={metric.tone} />
              </div>
            ))}
          </div>
          <div className="border-l border-sky-300/10 pl-4">
            <p className="text-xs font-semibold text-white">
              Answer Quality Trend{" "}
              <span className="font-normal text-slate-300">(Last 14 Days)</span>
            </p>
            <div className="mt-4 flex h-28 items-end gap-2">
              {Array.from({ length: 14 }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-full w-full max-w-5 flex-col justify-end overflow-hidden rounded-sm bg-slate-800"
                >
                  <div className="bg-red-500" style={{ height: "6%" }} />
                  <div className="bg-amber-400" style={{ height: "10%" }} />
                  <div
                    className="bg-green-500"
                    style={{ height: `${82 + (index % 4)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-xs text-slate-300">
              <Legend color="bg-green-500" label="Grounded" />
              <Legend color="bg-amber-400" label="Weak Support" />
              <Legend color="bg-red-500" label="Refusal/Fallback" />
            </div>
          </div>
          <div className="border-l border-sky-300/10 pl-4">
            <p className="flex items-center gap-1 text-xs font-semibold text-white">
              Source Alignment
              <Info className="size-3 text-slate-400" aria-hidden />
            </p>
            <p className="mt-4 text-sm font-semibold text-green-300">High</p>
            <p className="mt-1 text-xs text-slate-300">
              Most answers aligned with approved sources.
            </p>
            <div className="mt-4 flex items-center gap-5">
              <RingMetric value={trustSummary.alignment} tone="green" />
              <div className="space-y-2 text-xs text-slate-300">
                <Legend
                  color="bg-green-500"
                  label={`Aligned ${trustSummary.alignment}%`}
                />
                <Legend
                  color="bg-red-500"
                  label={`Unaligned ${100 - trustSummary.alignment}%`}
                />
              </div>
            </div>
            <button
              type="button"
              className="mt-5 text-xs font-semibold text-sky-300 hover:text-sky-100"
              onClick={() => onNavigate("/maintainer/chatbot-trust")}
            >
              View alignment details
            </button>
          </div>
        </div>
      </DashboardPanel>
    </section>
  )
}
