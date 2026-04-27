import { ChevronDown, FileSearch, X } from "lucide-react"
import { useId, useRef } from "react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { WpsEvidenceItem } from "@/data/sections/west-philippine-sea-dossier"

type WpsEvidenceSurfaceProps = {
  contextLabel: string
  contextTypeLabel: string
  evidence: WpsEvidenceItem[]
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function WpsEvidenceSurface({
  contextLabel,
  contextTypeLabel,
  evidence,
  isOpen,
  onOpenChange,
}: WpsEvidenceSurfaceProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const hasEvidence = evidence.length > 0

  const closeEvidence = () => {
    onOpenChange(false)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="mt-5 min-w-0 space-y-3"
    >
      <CollapsibleTrigger asChild>
        <Button
          ref={triggerRef}
          type="button"
          variant="outline"
          aria-controls={panelId}
          className="group w-full min-w-0 justify-between gap-3 rounded-2xl text-left whitespace-normal sm:w-auto sm:rounded-full"
        >
          <span className="flex min-w-0 items-center gap-2">
            <FileSearch aria-hidden="true" data-icon="inline-start" />
            <span>Inspect evidence for {contextLabel}</span>
          </span>
          <ChevronDown
            aria-hidden="true"
            data-icon="inline-end"
            className="transition-transform duration-200 group-aria-expanded/button:rotate-180 motion-reduce:transition-none"
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent
        id={panelId}
        role="region"
        aria-label={`Evidence for ${contextLabel}`}
        data-wps-evidence-surface=""
        className="min-w-0 rounded-2xl border border-border bg-card/70 p-4 shadow-sm data-[state=closed]:animate-none data-[state=open]:animate-none sm:p-5"
      >
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="editorial-kicker">Evidence surface</p>
            <h5 className="text-lg leading-7 font-semibold break-words text-card-foreground">
              {contextTypeLabel}: {contextLabel}
            </h5>
          </div>
          <Button
            type="button"
            variant="outline"
            aria-label={`Close evidence for ${contextLabel}`}
            className="w-full justify-center rounded-full sm:w-auto"
            onClick={closeEvidence}
          >
            <X aria-hidden="true" data-icon="inline-start" />
            Close
          </Button>
        </div>

        {hasEvidence ? (
          <div className="mt-4 grid min-w-0 gap-3">
            {evidence.map((item) => (
              <article
                key={item.sourceId}
                className="min-w-0 rounded-xl border border-border bg-background/55 p-4"
              >
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="editorial-kicker">Source</p>
                    <h6 className="mt-1 text-base leading-7 font-semibold break-words text-foreground">
                      {item.sourceLabel}
                    </h6>
                  </div>
                  <span className="w-fit max-w-full rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold break-all text-muted-foreground">
                    {item.sourceId}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 break-words text-muted-foreground">
                  {item.metadata}
                </p>
                <p className="mt-3 text-base leading-7 break-words text-card-foreground">
                  {item.summary}
                </p>
                <p className="mt-3 text-sm leading-6 break-words text-muted-foreground">
                  <span className="font-semibold text-card-foreground">
                    Why it matters:
                  </span>{" "}
                  {item.whyItMatters}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 min-w-0 rounded-xl border border-dashed border-border bg-background/55 p-4">
            <p className="text-base leading-7 font-semibold text-card-foreground">
              Evidence is unavailable for this selection.
            </p>
            <p className="mt-2 text-sm leading-6 break-words text-muted-foreground">
              The current context remains {contextLabel}. You can keep reading
              the dossier, choose another {contextTypeLabel.toLowerCase()}, or
              close this surface to return to the local evidence trigger.
            </p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
