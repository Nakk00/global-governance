import { ArrowRight, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import type {
  ValidationResult,
  ValidationRunDetail,
} from "@/lib/maintainer/api"

import {
  buildValidationRemediationItems,
  type ValidationRemediationItem,
} from "./validation-remediation"

function DetailTerm({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  )
}

function RemediationAction({
  item,
  onInspectResult,
}: {
  item: ValidationRemediationItem
  onInspectResult: (result: ValidationResult) => void
}) {
  if (item.followUp.kind === "sourceDetail") {
    return (
      <Button asChild variant="outline" size="sm" className="w-fit">
        <a href={item.followUp.href}>
          {item.followUp.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="w-fit"
      onClick={() => onInspectResult(item.result)}
    >
      {item.followUp.label}
      <Eye className="size-4" aria-hidden="true" />
    </Button>
  )
}

export function ValidationRemediationQueue({
  run,
  onInspectResult,
}: {
  run: ValidationRunDetail
  onInspectResult: (result: ValidationResult) => void
}) {
  if (run.status !== "completed" || run.state !== "ready") {
    return null
  }

  const items = buildValidationRemediationItems(run)

  return (
    <section
      className="rounded-lg border border-amber-300/20 bg-amber-300/5 p-4"
      aria-labelledby="validation-remediation-heading"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Guided triage
          </p>
          <h3
            id="validation-remediation-heading"
            className="mt-2 font-semibold"
          >
            Remediation queue
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Completed non-pass results stay read-only and point to the safest
            existing follow-up surface.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {items.length} remediation item{items.length === 1 ? "" : "s"}
        </p>
      </div>

      {items.length ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.resultId}
              className="rounded-xl border border-border bg-card/70 p-4 shadow-sm"
            >
              <article className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                      Item {item.order} · {item.outcome}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold">
                      {item.result.questionText}
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.likelyCauseLabel}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium">
                      {item.reviewStatusLabel}
                    </span>
                    <RemediationAction
                      item={item}
                      onInspectResult={onInspectResult}
                    />
                  </div>
                </div>

                <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <DetailTerm
                    label="Destination surface"
                    value={item.destinationSurfaceLabel}
                  />
                  <DetailTerm
                    label="Next action"
                    value={item.nextActionLabel}
                  />
                  <DetailTerm
                    label="Source context"
                    value={item.sourceContextLabel}
                  />
                  <DetailTerm label="Result id" value={item.resultId} />
                </dl>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-background/70 p-4">
          <p className="font-medium">No remediation items</p>
          <p className="mt-2 text-sm text-muted-foreground">
            This completed validation run only contains pass results, so the
            evidence table is the only place that needs review.
          </p>
        </div>
      )}
    </section>
  )
}
