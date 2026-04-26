import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { resolveNarrativeRecapCue } from "@/data/sections/core-narrative"
import type { NarrativeSectionContent } from "@/data/sections/narrative-types"
import { cn } from "@/lib/utils"

import { InsightRecapCard } from "./InsightRecapCard"

type NarrativeSectionProps = {
  content: NarrativeSectionContent
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
          <Collapsible
            key={disclosure.title}
            className="editorial-surface orbital-disclosure shadow-none"
          >
            <div className="space-y-3 p-5">
              <p className="text-sm leading-6 text-muted-foreground">
                {disclosure.collapsedSummary}
              </p>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  data-action-priority="secondary"
                  className="group w-full justify-between rounded-full text-left whitespace-normal sm:w-auto"
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
            <CollapsibleContent className="border-t border-border px-5 py-4 data-[state=closed]:animate-none data-[state=open]:animate-none">
              <div className="space-y-3">
                {disclosure.details.map((detail) => (
                  <p key={detail} className="editorial-prose">
                    {detail}
                  </p>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        <InsightRecapCard nextStep={recapCue.nextStep}>
          {recapCue.takeaway}
        </InsightRecapCard>
      </div>
    </section>
  )
}
