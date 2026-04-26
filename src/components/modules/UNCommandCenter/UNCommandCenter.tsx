import { ChevronDown, Compass, Info } from "lucide-react"

import { InsightRecapCard } from "@/components/sections/InsightRecapCard"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { resolveNarrativeRecapCue } from "@/data/sections/core-narrative"
import type { NarrativeSectionContent } from "@/data/sections/narrative-types"
import type { UNCommandCenterShellContent } from "@/data/sections/un-command-center"
import { cn } from "@/lib/utils"

type UNCommandCenterProps = {
  content: NarrativeSectionContent
  shell: UNCommandCenterShellContent
}

const controlIcons = [Compass, Info]

export function UNCommandCenter({ content, shell }: UNCommandCenterProps) {
  const headingId = `${content.id}-heading`
  const recapCue = resolveNarrativeRecapCue(content)

  return (
    <section
      id={content.id}
      aria-label={content.navigationLabel}
      data-editorial-surface="un-command-center"
      className="editorial-section editorial-container min-h-[54svh]"
      tabIndex={-1}
    >
      <div className="editorial-measure space-y-8">
        <header className="space-y-4">
          <p className="editorial-kicker">{content.eyebrow}</p>
          <h2 id={headingId} className="editorial-heading">
            {content.title}
          </h2>
          <p className="editorial-lede">{shell.introduction}</p>
          <div
            role="region"
            aria-label={shell.summaryLabel}
            className="editorial-surface editorial-summary"
          >
            <p className="editorial-kicker">Summary</p>
            <p className="mt-3 max-w-2xl text-base leading-7 text-card-foreground">
              {content.summary}
            </p>
          </div>
        </header>

        <div
          role="region"
          aria-label="Command Center entry controls"
          className="editorial-surface space-y-5"
        >
          <div className="space-y-2">
            <p className="editorial-kicker">{shell.entryLabel}</p>
            <p className="editorial-prose">{shell.entryPrompt}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {shell.controls.map((control, index) => {
              const Icon = controlIcons[index] ?? Compass

              return (
                <Collapsible key={control.title} className="space-y-3">
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant={index === 0 ? "default" : "outline"}
                      data-action-priority={
                        index === 0 ? "primary" : "secondary"
                      }
                      className={cn(
                        "w-full justify-between gap-3 rounded-2xl text-left whitespace-normal",
                        index === 0 && "editorial-primary-action"
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <Icon aria-hidden="true" data-icon="inline-start" />
                        <span>{control.title}</span>
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        data-icon="inline-end"
                        className="transition-transform duration-200 group-aria-expanded/button:rotate-180 motion-reduce:transition-none"
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="rounded-2xl border border-border bg-background/45 px-4 py-3 data-[state=closed]:animate-none data-[state=open]:animate-none">
                    <p className="editorial-prose">{control.detail}</p>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>
        </div>

        <Collapsible className="editorial-surface orbital-disclosure shadow-none">
          <div className="space-y-3 p-5 sm:p-6">
            <p className="text-sm leading-6 text-muted-foreground">
              Open a short map of the institutions this shell will unpack next.
            </p>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="outline"
                data-action-priority="secondary"
                className="group w-full justify-between rounded-2xl text-left whitespace-normal sm:w-auto sm:rounded-full"
              >
                Inside this section
                <ChevronDown
                  aria-hidden="true"
                  data-icon="inline-end"
                  className="transition-transform duration-200 group-aria-expanded/button:rotate-180 motion-reduce:transition-none"
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="border-t border-border px-5 py-4 data-[state=closed]:animate-none data-[state=open]:animate-none sm:px-6">
            <div className="space-y-4">
              <p className="editorial-kicker">Supporting detail</p>
              {content.supportingDetails.map((detail) => (
                <p key={detail} className="editorial-prose">
                  {detail}
                </p>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <InsightRecapCard nextStep={recapCue.nextStep}>
          {recapCue.takeaway}
        </InsightRecapCard>
      </div>
    </section>
  )
}
