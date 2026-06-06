import type { SourceInventoryItem } from "@/lib/maintainer/source-api"

import type { MaintainerPreset } from "../shared/types"
import { buildSourceDetailPath } from "../shared/routing"

type SourceInventoryTableProps = {
  sources: SourceInventoryItem[]
  selectedSourceId: string | null
  pageIndex: number
  totalPages: number
  pageStart: number
  pageEnd: number
  totalCount: number
  rowsPerPage: number
  searchQuery: string
  typeFilter: string
  lifecycleFilter: string
  readinessFilter: string
  validationFilter: string
  onSearchQueryChange: (value: string) => void
  onTypeFilterChange: (value: string) => void
  onLifecycleFilterChange: (value: string) => void
  onReadinessFilterChange: (value: string) => void
  onValidationFilterChange: (value: string) => void
  onClearFilters: () => void
  onRowsPerPageChange: (value: number) => void
  onPageChange: (pageIndex: number) => void
  onSelectSource: (sourceId: string | null) => void
  onNavigate: (path: string) => void
  routePreset: MaintainerPreset | null
}

const ROWS_PER_PAGE_OPTIONS = [10, 20, 50]

export function SourceInventoryTable({
  sources,
  selectedSourceId,
  pageIndex,
  totalPages,
  pageStart,
  pageEnd,
  totalCount,
  rowsPerPage,
  searchQuery,
  typeFilter,
  lifecycleFilter,
  readinessFilter,
  validationFilter,
  onSearchQueryChange,
  onTypeFilterChange,
  onLifecycleFilterChange,
  onReadinessFilterChange,
  onValidationFilterChange,
  onClearFilters,
  onRowsPerPageChange,
  onPageChange,
  onSelectSource,
  onNavigate,
  routePreset,
}: SourceInventoryTableProps) {
  const sourceTypes = Array.from(new Set(sources.map((source) => source.sourceType)))
  const lifecycleStates = Array.from(
    new Set(sources.map((source) => source.lifecycleState))
  )
  const readinessStates = Array.from(
    new Set(sources.map((source) => source.ingestionReadiness))
  )

  return (
    <section className="space-y-4 lg:block" aria-labelledby="source-inventory-heading">
      <div className="rounded-2xl border border-white/10 bg-card/70 p-4 shadow-sm shadow-black/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 id="source-inventory-heading" className="font-semibold">
              Source Stewardship Inventory
            </h3>
            <p className="text-sm text-muted-foreground">
              Showing {pageStart} to {pageEnd} of {totalCount} sources
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">
              <span className="sr-only">Rows per page</span>
              <select
                aria-label="Rows per page"
                className="rounded-md border bg-background px-3 py-2"
                value={String(rowsPerPage)}
                onChange={(event) =>
                  onRowsPerPageChange(Number(event.target.value))
                }
              >
                {ROWS_PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="rounded-md border px-3 py-2 text-sm"
              onClick={onClearFilters}
            >
              Clear filters
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="text-sm font-medium">
            Search
            <input
              type="search"
              className="mt-2 w-full rounded-md border bg-background px-3 py-2"
              placeholder="Search title, slug, alias, or provenance"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
            />
          </label>
          <label className="text-sm font-medium">
            Type
            <select
              className="mt-2 w-full rounded-md border bg-background px-3 py-2"
              value={typeFilter}
              onChange={(event) => onTypeFilterChange(event.target.value)}
            >
              <option value="all">All</option>
              {sourceTypes.map((sourceType) => (
                <option key={sourceType} value={sourceType}>
                  {sourceType}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Lifecycle State
            <select
              className="mt-2 w-full rounded-md border bg-background px-3 py-2"
              value={lifecycleFilter}
              onChange={(event) => onLifecycleFilterChange(event.target.value)}
            >
              <option value="all">All</option>
              {lifecycleStates.map((lifecycleState) => (
                <option key={lifecycleState} value={lifecycleState}>
                  {lifecycleState}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Readiness
            <select
              className="mt-2 w-full rounded-md border bg-background px-3 py-2"
              value={readinessFilter}
              onChange={(event) => onReadinessFilterChange(event.target.value)}
            >
              <option value="all">All</option>
              {readinessStates.map((readinessState) => (
                <option key={readinessState} value={readinessState}>
                  {readinessState}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Validation Status
            <select
              aria-label="Validation Status"
              className="mt-2 w-full rounded-md border bg-background px-3 py-2"
              value={validationFilter}
              onChange={(event) => onValidationFilterChange(event.target.value)}
            >
              <option value="all">All</option>
              <option value="warning">Warning</option>
              <option value="succeeded">Succeeded</option>
              <option value="queued">Queued</option>
              <option value="failed">Failed</option>
              <option value="missing">Missing</option>
            </select>
          </label>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="border-b px-3 py-2 font-medium">Source</th>
                <th className="border-b px-3 py-2 font-medium">Type</th>
                <th className="border-b px-3 py-2 font-medium">Lifecycle</th>
                <th className="border-b px-3 py-2 font-medium">Readiness</th>
                <th className="border-b px-3 py-2 font-medium">Validation</th>
                <th className="border-b px-3 py-2 font-medium text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => {
                const isSelected = source.sourceId === selectedSourceId
                return (
                  <tr
                    key={source.sourceId}
                    aria-selected={isSelected}
                    className={isSelected ? "bg-cyan-300/8" : undefined}
                  >
                    <td className="border-b px-3 py-3">
                      <button
                        type="button"
                        className="text-left font-medium hover:text-cyan-300"
                        onClick={() => onSelectSource(source.sourceId)}
                      >
                        {source.title}
                      </button>
                    </td>
                    <td className="border-b px-3 py-3">{source.sourceType}</td>
                    <td className="border-b px-3 py-3">{source.lifecycleState}</td>
                    <td className="border-b px-3 py-3">
                      {source.ingestionReadiness}
                    </td>
                    <td className="border-b px-3 py-3">
                      {source.latestValidationOutcome ?? "Missing"}
                    </td>
                    <td className="border-b px-3 py-3 text-right">
                      <button
                        type="button"
                        className="rounded-md border px-3 py-2"
                        onClick={() =>
                          onNavigate(
                            buildSourceDetailPath(source.sourceId, routePreset)
                          )
                        }
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-md border px-3 py-2"
            onClick={() => onPageChange(Math.max(1, pageIndex - 1))}
            disabled={pageIndex <= 1}
          >
            Previous page
          </button>
          <button
            type="button"
            className="rounded-md border px-3 py-2"
            onClick={() => onPageChange(Math.min(totalPages, pageIndex + 1))}
            disabled={pageIndex >= totalPages}
          >
            Next page
          </button>
        </div>
      </div>
    </section>
  )
}
