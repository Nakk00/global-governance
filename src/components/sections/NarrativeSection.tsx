import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { resolveNarrativeRecapCue } from "@/data/sections/core-narrative"
import type { NarrativeSectionContent } from "@/data/sections/narrative-types"

import { InsightRecapCard } from "./InsightRecapCard"

type NarrativeSectionProps = {
  content: NarrativeSectionContent
}

export function NarrativeSection({ content }: NarrativeSectionProps) {
  const headingId = `${content.id}-heading`
  const recapCue = resolveNarrativeRecapCue(content)

  return (
    <section
      id={content.id}
      aria-label={content.navigationLabel}
      className="mx-auto min-h-[54svh] w-full max-w-6xl scroll-mt-24 px-5 py-16 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:px-8 lg:px-12"
      tabIndex={-1}
    >
      <div className="max-w-3xl space-y-8">
        <header className="space-y-4">
          <p className="text-sm font-semibold text-muted-foreground">
            {content.eyebrow}
          </p>
          <h2
            id={headingId}
            className="text-2xl leading-tight font-semibold tracking-normal text-balance sm:text-3xl"
          >
            {content.title}
          </h2>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-xs font-semibold tracking-normal text-muted-foreground uppercase">
              Summary
            </p>
            <p className="mt-3 text-base leading-7 text-card-foreground">
              {content.summary}
            </p>
          </div>
          <p className="text-lg leading-8 font-medium text-foreground">
            {content.thesis}
          </p>
        </header>

        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-normal text-muted-foreground uppercase">
            Supporting detail
          </p>
          {content.supportingDetails.map((detail) => (
            <p
              key={detail}
              className="text-base leading-7 text-muted-foreground"
            >
              {detail}
            </p>
          ))}
        </div>

        {content.disclosures.map((disclosure) => (
          <Collapsible
            key={disclosure.title}
            className="rounded-lg border border-border"
          >
            <div className="space-y-3 p-5">
              <p className="text-sm leading-6 text-muted-foreground">
                {disclosure.collapsedSummary}
              </p>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="group w-full justify-between text-left whitespace-normal sm:w-auto"
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
                  <p
                    key={detail}
                    className="text-base leading-7 text-muted-foreground"
                  >
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
