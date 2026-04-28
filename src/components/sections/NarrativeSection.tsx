import { useRef, useState, type KeyboardEvent } from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { resolveNarrativeRecapCue } from "@/data/sections/core-narrative"
import type {
  NarrativeDisclosure,
  NarrativeReferenceSource,
  NarrativeSectionContent,
} from "@/data/sections/narrative-types"
import { cn } from "@/lib/utils"

import { InsightRecapCard } from "./InsightRecapCard"

type NarrativeSectionProps = {
  content: NarrativeSectionContent
}

type NarrativeDisclosureBlockProps = {
  disclosure: NarrativeDisclosure
}

function isCompleteReference(source: NarrativeReferenceSource) {
  return (
    source.sourceId.trim() &&
    source.title.trim() &&
    source.provenance.trim() &&
    source.summary.trim() &&
    source.whyItMatters.trim()
  )
}

function hasInspectableReferences(disclosure: NarrativeDisclosure) {
  const references = disclosure.references ?? []

  return references.length >= 3 && references.every(isCompleteReference)
}

function NarrativeDisclosureBlock({
  disclosure,
}: NarrativeDisclosureBlockProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const hasReferences = hasInspectableReferences(disclosure)
  const hasReferenceContent =
    (disclosure.references?.length ?? 0) > 0 ||
    disclosure.unavailableMessage !== undefined
  const unavailableMessage = disclosure.unavailableMessage?.trim()

  function closeAndReturnFocus() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  function handleDisclosureKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      closeAndReturnFocus()
    }
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="editorial-surface orbital-disclosure shadow-none"
      onKeyDown={handleDisclosureKeyDown}
    >
      <div className="space-y-3 p-5 sm:p-6">
        <p className="text-sm leading-6 text-muted-foreground">
          {disclosure.collapsedSummary}
        </p>
        <CollapsibleTrigger asChild>
          <Button
            ref={triggerRef}
            type="button"
            variant="outline"
            data-action-priority="secondary"
            className="group w-full justify-between rounded-2xl text-left whitespace-normal sm:w-auto sm:rounded-full"
          >
            {disclosure.title}
            <ChevronDown
              aria-hidden="true"
              data-icon="inline-end"
              className="transition-transform duration-200 group-aria-expanded/button:rotate-180 motion-reduce:transition-none"
            />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent
        aria-label={`${disclosure.title} details`}
        className="border-t border-border px-5 py-4 data-[state=closed]:animate-none data-[state=open]:animate-none sm:px-6"
      >
        <div className="space-y-4">
          {disclosure.details.map((detail) => (
            <p key={detail} className="editorial-prose">
              {detail}
            </p>
          ))}

          {hasReferences ? (
            <div
              className="grid gap-4 lg:grid-cols-3"
              data-reference-surface="conclusion"
            >
              {disclosure.references!.map((source) => (
                <article
                  key={source.sourceId}
                  aria-label={source.title}
                  className="min-w-0 space-y-3 rounded-2xl border border-border/80 bg-background/70 p-4"
                >
                  <div className="space-y-1">
                    <p className="editorial-kicker">{source.sourceId}</p>
                    <h3 className="text-base leading-6 font-semibold text-card-foreground">
                      {source.title}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {source.provenance}
                    </p>
                  </div>
                  <p className="text-base leading-7 text-card-foreground">
                    {source.summary}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    <span className="font-semibold text-card-foreground">
                      Why it matters:
                    </span>{" "}
                    {source.whyItMatters}
                  </p>
                </article>
              ))}
            </div>
          ) : hasReferenceContent ? (
            <p
              className="editorial-prose rounded-2xl border border-border/80 bg-background/70 p-4"
              role="status"
            >
              {unavailableMessage ||
                "Source support is temporarily unavailable. The conclusion remains readable while approved references are restored."}
            </p>
          ) : null}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function NarrativeSection({ content }: NarrativeSectionProps) {
  const headingId = `${content.id}-heading`
  const recapCue = resolveNarrativeRecapCue(content)
  const isSourceLanding = content.id === "conclusion-references"

  return (
    <section
      id={content.id}
      aria-label={content.navigationLabel}
      data-editorial-surface={isSourceLanding ? "source" : "narrative"}
      className="editorial-section editorial-container min-h-[54svh]"
      tabIndex={-1}
    >
      <div className="editorial-measure space-y-8">
        <header className="space-y-4">
          <p className="editorial-kicker">{content.eyebrow}</p>
          <h2 id={headingId} className="editorial-heading">
            {content.title}
          </h2>
          <div
            className={cn(
              "editorial-surface editorial-summary",
              isSourceLanding && "editorial-source"
            )}
          >
            <p className="editorial-kicker">Summary</p>
            <p className="mt-3 max-w-2xl text-base leading-7 text-card-foreground">
              {content.summary}
            </p>
          </div>
          <p className="editorial-lede">{content.thesis}</p>
        </header>

        <div className="space-y-4">
          <p className="editorial-kicker">Supporting detail</p>
          {content.supportingDetails.map((detail) => (
            <p key={detail} className="editorial-prose">
              {detail}
            </p>
          ))}
        </div>

        {content.disclosures.map((disclosure) => (
          <NarrativeDisclosureBlock
            key={disclosure.title}
            disclosure={disclosure}
          />
        ))}

        <InsightRecapCard nextStep={recapCue.nextStep}>
          {recapCue.takeaway}
        </InsightRecapCard>
      </div>
    </section>
  )
}
