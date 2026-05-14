import { useEffect, useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AdminUtilityBar } from "@/components/modules/MaintainerDashboard/AdminPortalShell"
import type { StewardshipDashboard } from "@/lib/maintainer/source-api"
import { cn } from "@/lib/utils"

import { filterSourcesForPreset, getPresetFocusItems } from "../shared/routing"
import type {
  DetailState,
  MaintainerPreset,
  MaintainerRoute,
} from "../shared/types"

import { SourceInventoryCards } from "./SourceInventoryCards"
import { SourceInventoryTable } from "./SourceInventoryTable"
import { SourcePreviewRail } from "./SourcePreviewRail"
import { buildSourceMetrics, type SourceKpiMetric } from "./source-metrics"
import { sourceMatchesSearch, validationStatusKey } from "./source-formatters"

const DEFAULT_ROWS_PER_PAGE = 20

export function SourcesPage({
  route,
  dashboard,
  selectedSourceId,
  previewState,
  onNavigate,
  onSelectSource,
  onRetryPreview,
  userInitials,
  lastSync,
}: {
  route: Extract<MaintainerRoute, { section: "sources" }>
  dashboard: StewardshipDashboard
  selectedSourceId: string | null
  previewState: DetailState
  onNavigate: (path: string) => void
  onSelectSource: (sourceId: string | null) => void
  onRetryPreview: () => void
  userInitials?: string
  lastSync?: string
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [lifecycleFilter, setLifecycleFilter] = useState("all")
  const [readinessFilter, setReadinessFilter] = useState("all")
  const [validationFilter, setValidationFilter] = useState("all")
  const [pageIndex, setPageIndex] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)

  const presetSources = useMemo(
    () => filterSourcesForPreset(dashboard.sources, route.preset),
    [dashboard.sources, route.preset]
  )

  const filteredSources = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return presetSources.filter((source) => {
      if (typeFilter !== "all" && source.sourceType !== typeFilter) {
        return false
      }
      if (
        lifecycleFilter !== "all" &&
        source.lifecycleState !== lifecycleFilter
      ) {
        return false
      }
      if (
        readinessFilter !== "all" &&
        source.ingestionReadiness !== readinessFilter
      ) {
        return false
      }
      if (
        validationFilter !== "all" &&
        validationStatusKey(source) !== validationFilter
      ) {
        return false
      }
      if (!normalizedSearch) {
        return true
      }

      return sourceMatchesSearch(source, normalizedSearch)
    })
  }, [
    presetSources,
    searchQuery,
    typeFilter,
    lifecycleFilter,
    readinessFilter,
    validationFilter,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSources.length / rowsPerPage)
  )
  const currentPageIndex = Math.min(pageIndex, totalPages)

  useEffect(() => {
    if (!filteredSources.length) {
      if (selectedSourceId !== null) {
        onSelectSource(null)
      }
      return
    }

    const selectedStillVisible =
      selectedSourceId != null &&
      filteredSources.some((source) => source.sourceId === selectedSourceId)

    if (!selectedStillVisible) {
      onSelectSource(filteredSources[0].sourceId)
    }
  }, [filteredSources, onSelectSource, selectedSourceId])

  const pageSources = filteredSources.slice(
    (currentPageIndex - 1) * rowsPerPage,
    currentPageIndex * rowsPerPage
  )
  const pageStart = filteredSources.length
    ? (currentPageIndex - 1) * rowsPerPage + 1
    : 0
  const pageEnd = Math.min(
    filteredSources.length,
    currentPageIndex * rowsPerPage
  )
  const selectedSource = selectedSourceId
    ? (dashboard.sources.find(
        (source) => source.sourceId === selectedSourceId
      ) ?? null)
    : null
  const previewSource =
    previewState.state === "ready" ? previewState.source : selectedSource
  const presetFocusItems = useMemo(
    () => getPresetFocusItems(dashboard, route.preset),
    [dashboard, route.preset]
  )
  const metrics = useMemo(
    () => buildSourceMetrics(dashboard.sources),
    [dashboard.sources]
  )

  return (
    <section className="space-y-5" aria-labelledby="sources-page-heading">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Source lifecycle
          </p>
          <h2 id="sources-page-heading" className="mt-2 text-3xl font-semibold">
            Source Stewardship
          </h2>
          <p className="mt-0.5 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Manage and oversee authoritative sources across the global
            governance knowledge base.
          </p>
        </div>
        <AdminUtilityBar
          route={route}
          userInitials={userInitials ?? "AD"}
          onNavigate={onNavigate}
          lastSync={lastSync}
        />
      </div>

      {route.preset ? (
        <PresetBanner
          preset={route.preset}
          items={presetFocusItems}
          onNavigate={onNavigate}
        />
      ) : null}

      <SourcesKpiRow metrics={metrics} />

      <SourceInventoryCards
        sources={pageSources}
        selectedSourceId={selectedSourceId}
        onSelectSource={onSelectSource}
        onNavigate={onNavigate}
        routePreset={route.preset}
        pageIndex={currentPageIndex}
        totalPages={totalPages}
        onPageChange={setPageIndex}
        pageStart={pageStart}
        pageEnd={pageEnd}
        totalCount={filteredSources.length}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2.05fr)_minmax(260px,0.75fr)]">
        <SourceInventoryTable
          sources={pageSources}
          selectedSourceId={selectedSourceId}
          pageIndex={currentPageIndex}
          totalPages={totalPages}
          pageStart={pageStart}
          pageEnd={pageEnd}
          totalCount={filteredSources.length}
          rowsPerPage={rowsPerPage}
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          lifecycleFilter={lifecycleFilter}
          readinessFilter={readinessFilter}
          validationFilter={validationFilter}
          onSearchQueryChange={(value) => {
            setSearchQuery(value)
            setPageIndex(1)
          }}
          onTypeFilterChange={(value) => {
            setTypeFilter(value)
            setPageIndex(1)
          }}
          onLifecycleFilterChange={(value) => {
            setLifecycleFilter(value)
            setPageIndex(1)
          }}
          onReadinessFilterChange={(value) => {
            setReadinessFilter(value)
            setPageIndex(1)
          }}
          onValidationFilterChange={(value) => {
            setValidationFilter(value)
            setPageIndex(1)
          }}
          onClearFilters={() => {
            setSearchQuery("")
            setTypeFilter("all")
            setLifecycleFilter("all")
            setReadinessFilter("all")
            setValidationFilter("all")
            setPageIndex(1)
          }}
          onRowsPerPageChange={(value) => {
            setRowsPerPage(value)
            setPageIndex(1)
          }}
          onPageChange={setPageIndex}
          onSelectSource={onSelectSource}
          onNavigate={onNavigate}
          routePreset={route.preset}
        />
        <SourcePreviewRail
          previewState={previewState}
          source={previewSource}
          hasVisibleSources={filteredSources.length > 0}
          onNavigate={onNavigate}
          onRetryPreview={onRetryPreview}
          routePreset={route.preset}
          selectedSourceId={selectedSourceId}
        />
      </div>
    </section>
  )
}

function SourcesKpiRow({ metrics }: { metrics: SourceKpiMetric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className="rounded-2xl border border-white/10 bg-card/70 p-3 shadow-sm shadow-black/10"
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-2xl border shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
                metric.iconBgClass
              )}
            >
              <metric.icon
                className={cn("size-6", metric.iconClassName)}
                aria-hidden
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                {metric.label}
              </p>
              <p className="mt-1 text-3xl leading-none font-semibold">
                {metric.value}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {metric.detail}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function PresetBanner({
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
      ? "These sources keep blockers and next actions ahead of the full inventory."
      : preset === "validation-follow-up"
        ? "These sources should be checked from source detail first, with validation follow-up ready as the next move."
        : "Recent operational activity stays visible here, but source detail remains the first investigative stop."

  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4 shadow-sm shadow-black/10">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      {items.length ? (
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-white/10 bg-card/70 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-muted-foreground">{item.summary}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => onNavigate(item.path)}
              >
                Open source detail
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
