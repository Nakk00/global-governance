import type { SourceInventoryItem } from "@/lib/maintainer/source-api"

import type { MaintainerPreset } from "../shared/types"
import { buildSourceDetailPath } from "../shared/routing"

type SourceInventoryCardsProps = {
  sources: SourceInventoryItem[]
  selectedSourceId: string | null
  onSelectSource: (sourceId: string | null) => void
  onNavigate: (path: string) => void
  routePreset: MaintainerPreset | null
  pageIndex: number
  totalPages: number
  onPageChange: (pageIndex: number) => void
  pageStart: number
  pageEnd: number
  totalCount: number
}

export function SourceInventoryCards({
  sources,
  selectedSourceId,
  onSelectSource,
  onNavigate,
  routePreset,
  pageIndex,
  totalPages,
  onPageChange,
  pageStart,
  pageEnd,
  totalCount,
}: SourceInventoryCardsProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-card/70 p-4 shadow-sm shadow-black/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">Quick picks</h3>
          <p className="text-sm text-muted-foreground">
            Scan the current page before drilling into the full inventory.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {pageStart} to {pageEnd} of {totalCount} sources
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {sources.map((source) => {
          const selected = source.sourceId === selectedSourceId
          return (
            <article
              key={source.sourceId}
              className={`rounded-2xl border p-4 shadow-sm ${
                selected
                  ? "border-cyan-300/40 bg-cyan-300/8"
                  : "border-white/10 bg-background/70"
              }`}
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => onSelectSource(source.sourceId)}
              >
                <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  {source.sourceType}
                </p>
                <h4 className="mt-2 font-semibold">{source.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  {source.provenance}
                </p>
              </button>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {source.lifecycleState}
                </span>
                <button
                  type="button"
                  className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
                  onClick={() =>
                    onNavigate(buildSourceDetailPath(source.sourceId, routePreset))
                  }
                >
                  Inspect
                </button>
              </div>
            </article>
          )
        })}
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm"
          onClick={() => onPageChange(Math.max(1, pageIndex - 1))}
          disabled={pageIndex <= 1}
        >
          Previous page
        </button>
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm"
          onClick={() => onPageChange(Math.min(totalPages, pageIndex + 1))}
          disabled={pageIndex >= totalPages}
        >
          Next page
        </button>
      </div>
    </section>
  )
}
