import { Button } from "@/components/ui/button"
import type { SourceDetail, SourceInventoryItem } from "@/lib/maintainer/source-api"

import { RetryState } from "../shared/states"
import type { DetailState, MaintainerPreset } from "../shared/types"
import { buildSourceDetailPath } from "../shared/routing"

type PreviewSource = SourceDetail | SourceInventoryItem | null

type SourcePreviewRailProps = {
  previewState: DetailState
  source: PreviewSource
  hasVisibleSources: boolean
  onNavigate: (path: string) => void
  onRetryPreview: () => void
  routePreset: MaintainerPreset | null
  selectedSourceId: string | null
}

function isDetailSource(source: PreviewSource): source is SourceDetail {
  return Boolean(source && "summary" in source)
}

function formatUpdatedAt(source: PreviewSource) {
  return source?.updatedAt ?? source?.createdAt ?? "Not available"
}

export function SourcePreviewRail({
  previewState,
  source,
  hasVisibleSources,
  onNavigate,
  onRetryPreview,
  routePreset,
  selectedSourceId,
}: SourcePreviewRailProps) {
  if (!hasVisibleSources) {
    return (
      <aside className="rounded-2xl border border-dashed border-white/10 bg-card/50 p-4">
        <h3 className="font-semibold">Source details</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No sources match the current filters.
        </p>
      </aside>
    )
  }

  if (previewState.state === "loading") {
    return (
      <aside className="rounded-2xl border border-white/10 bg-card/70 p-4 shadow-sm shadow-black/10">
        <h3 className="font-semibold">Source details</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Loading source details
        </p>
      </aside>
    )
  }

  if (previewState.state === "outage") {
    return <RetryState message={previewState.message} onRetry={onRetryPreview} />
  }

  if (previewState.state === "empty") {
    return (
      <aside className="rounded-2xl border border-white/10 bg-card/70 p-4 shadow-sm shadow-black/10">
        <h3 className="font-semibold">Source details</h3>
        <p className="mt-3 text-sm text-muted-foreground">{previewState.message}</p>
      </aside>
    )
  }

  const summary =
    previewState.state === "ready"
      ? previewState.source.summary
      : isDetailSource(source)
        ? source.summary
        : source?.provenance ?? "No preview available."

  return (
    <aside className="space-y-4 rounded-2xl border border-white/10 bg-card/70 p-4 shadow-sm shadow-black/10">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Selected source
        </p>
        <h3 className="mt-2 font-semibold">Source details</h3>
        <p className="mt-2 text-sm text-muted-foreground">{summary}</p>
      </div>

      <dl className="grid gap-3 text-sm">
        <div>
          <dt className="font-medium">Document Type</dt>
          <dd className="text-muted-foreground">{source?.sourceType ?? "Unknown"}</dd>
        </div>
        <div>
          <dt className="font-medium">Last Updated</dt>
          <dd className="text-muted-foreground">{formatUpdatedAt(source)}</dd>
        </div>
        <div>
          <dt className="font-medium">Steward</dt>
          <dd className="text-muted-foreground">Reviewed</dd>
        </div>
      </dl>

      <div className="grid gap-2">
        <Button
          type="button"
          onClick={() => {
            if (selectedSourceId) {
              onNavigate(buildSourceDetailPath(selectedSourceId, routePreset))
            }
          }}
          disabled={!selectedSourceId}
        >
          Inspect Source
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onNavigate("/maintainer/sources/new")}
        >
          Upload Revision
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (selectedSourceId) {
              onNavigate(
                `/maintainer/validation?preset=validation-follow-up&sourceId=${encodeURIComponent(selectedSourceId)}`
              )
            }
          }}
          disabled={!selectedSourceId}
        >
          Run Validation
        </Button>
      </div>
    </aside>
  )
}
