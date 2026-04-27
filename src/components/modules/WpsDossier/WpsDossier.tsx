import { useState } from "react"
import { CalendarDays, ChevronDown, FileText, Scale } from "lucide-react"

import { InsightRecapCard } from "@/components/sections/InsightRecapCard"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { resolveNarrativeRecapCue } from "@/data/sections/core-narrative"
import type { NarrativeSectionContent } from "@/data/sections/narrative-types"
import {
  wpsTimelineEvents,
  type WpsDossierShellContent,
} from "@/data/sections/west-philippine-sea-dossier"
import { cn } from "@/lib/utils"

type WpsDossierProps = {
  content: NarrativeSectionContent
  shell: WpsDossierShellContent
}

const entryIcons = [FileText, Scale]

export function WpsDossier({ content, shell }: WpsDossierProps) {
  const [openEntry, setOpenEntry] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState(
    wpsTimelineEvents[0]?.id
  )
  const headingId = `${content.id}-heading`
  const timelineHeadingId = `${content.id}-timeline-heading`
  const timelineDetailId = `${content.id}-timeline-detail`
  const recapCue = resolveNarrativeRecapCue(content)
  const selectedEvent =
    wpsTimelineEvents.find((event) => event.id === selectedEventId) ??
    wpsTimelineEvents[0]

  if (!selectedEvent) {
    return null
  }

  return (
    <section
      id={content.id}
      aria-label={content.navigationLabel}
      data-editorial-surface="wps-dossier"
      className="editorial-section editorial-container min-h-[54svh]"
      tabIndex={-1}
    >
      <div className="editorial-measure space-y-8">
        <header className="wps-dossier-shell space-y-6 p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-3">
              <p className="editorial-kicker">{content.eyebrow}</p>
              <h2 id={headingId} className="editorial-heading">
                {content.title}
              </h2>
            </div>
            <p className="wps-dossier-label">{shell.chapterLabel}</p>
          </div>

          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.44fr)] lg:items-stretch">
            <div className="min-w-0 space-y-4">
              <p className="editorial-lede">{shell.openingCue}</p>
              <div
                role="region"
                aria-label="Dossier summary"
                className="wps-dossier-summary"
              >
                <p className="editorial-kicker">Summary</p>
                <p className="mt-3 text-base leading-7 text-card-foreground">
                  {content.summary}
                </p>
              </div>
            </div>

            <aside className="wps-dossier-ledger" aria-label="Dossier frame">
              <p className="editorial-kicker">{shell.investigationLabel}</p>
              <p className="mt-3 text-sm leading-6 text-card-foreground">
                Read the case through rules, evidence, behavior, and public
                stakes.
              </p>
            </aside>
          </div>
        </header>

        <div
          role="region"
          aria-labelledby={timelineHeadingId}
          className="editorial-surface space-y-6"
        >
          <div className="space-y-2">
            <p className="editorial-kicker">Case timeline</p>
            <h3
              id={timelineHeadingId}
              className="text-2xl font-semibold tracking-normal text-foreground"
            >
              Follow the dispute in order
            </h3>
            <p className="editorial-prose">
              Select each milestone to connect the facts, the legal setting, and
              the governance lesson.
            </p>
          </div>

          <div
            data-wps-timeline-layout="chronology"
            className="grid min-w-0 gap-4 lg:grid-cols-[minmax(16rem,0.85fr)_minmax(0,1.15fr)] lg:items-start xl:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)]"
          >
            <div
              role="group"
              aria-labelledby={timelineHeadingId}
              aria-label="Timeline event selector"
              data-wps-timeline-part="selector"
              className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-1"
            >
              {wpsTimelineEvents.map((event) => {
                const isSelected = event.id === selectedEvent.id
                const eventButtonId = `${content.id}-timeline-${event.id}`

                return (
                  <Button
                    key={event.id}
                    id={eventButtonId}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    aria-pressed={isSelected}
                    aria-controls={timelineDetailId}
                    data-state={isSelected ? "selected" : "idle"}
                    data-action-priority={isSelected ? "primary" : "secondary"}
                    className={cn(
                      "min-h-28 w-full min-w-0 justify-start gap-3 rounded-2xl px-4 py-3 text-left whitespace-normal motion-reduce:transition-none",
                      isSelected &&
                        "editorial-primary-action ring-2 ring-ring ring-offset-2 ring-offset-background"
                    )}
                    onClick={() => setSelectedEventId(event.id)}
                  >
                    <CalendarDays
                      aria-hidden="true"
                      data-icon="inline-start"
                      className="mt-1 shrink-0"
                    />
                    <span className="grid min-w-0 gap-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase">
                          {event.year}
                        </span>
                        {isSelected ? (
                          <span className="rounded-full border border-current px-2 py-0.5 text-[0.68rem] font-semibold">
                            Selected
                          </span>
                        ) : null}
                      </span>
                      <span className="font-semibold">{event.label}</span>
                      <span
                        className={cn(
                          "text-sm leading-6",
                          isSelected
                            ? "text-primary-foreground/90"
                            : "text-muted-foreground"
                        )}
                      >
                        {event.summary}
                      </span>
                    </span>
                  </Button>
                )
              })}
            </div>

            <div
              id={timelineDetailId}
              role="region"
              aria-live="polite"
              aria-labelledby={`${content.id}-timeline-${selectedEvent.id}`}
              data-wps-timeline-part="details"
              className="min-w-0 rounded-2xl border border-border bg-background/50 p-4 shadow-sm transition-none sm:p-5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <p className="editorial-kicker">Selected milestone</p>
                  <h4 className="text-xl font-semibold text-foreground">
                    {selectedEvent.year}: {selectedEvent.label}
                  </h4>
                </div>
                <span className="w-fit rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold tracking-normal text-muted-foreground">
                  Chronology
                </span>
              </div>

              <dl className="mt-5 grid min-w-0 gap-3 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                  ["Context", selectedEvent.context],
                  ["Legal context", selectedEvent.legalContext],
                  ["Significance", selectedEvent.significance],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="min-w-0 rounded-xl border border-border bg-card/70 p-4"
                  >
                    <dt className="editorial-kicker">{label}</dt>
                    <dd className="mt-2 text-base leading-7 break-words text-card-foreground">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div
          role="region"
          aria-label="Dossier entry controls"
          className="editorial-surface space-y-5"
        >
          <div className="space-y-2">
            <p className="editorial-kicker">{shell.entryLabel}</p>
            <p className="editorial-prose">{shell.entryPrompt}</p>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            {shell.controls.map((control, index) => {
              const Icon = entryIcons[index] ?? FileText
              const isOpen = openEntry === control.title
              const panelId = `${content.id}-entry-${index}`

              return (
                <div key={control.title} className="min-w-0 space-y-3">
                  <Button
                    type="button"
                    variant="default"
                    data-action-priority="primary"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="editorial-primary-action w-full min-w-0 justify-between gap-3 rounded-2xl text-left whitespace-normal"
                    onClick={() => setOpenEntry(isOpen ? null : control.title)}
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
                  {isOpen ? (
                    <div
                      id={panelId}
                      className="rounded-2xl border border-border bg-background/45 px-4 py-3"
                    >
                      <p className="editorial-prose">{control.detail}</p>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <p className="editorial-kicker">Supporting detail</p>
          <p className="editorial-lede">{content.thesis}</p>
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
            <div className="space-y-3 p-5 sm:p-6">
              <p className="text-sm leading-6 text-muted-foreground">
                {disclosure.collapsedSummary}
              </p>
              <CollapsibleTrigger asChild>
                <Button
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
            <CollapsibleContent className="border-t border-border px-5 py-4 data-[state=closed]:animate-none data-[state=open]:animate-none sm:px-6">
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

        <div className="editorial-surface space-y-3 shadow-none">
          <p className="editorial-kicker">Synthesis</p>
          <p className="editorial-prose">{content.synthesis}</p>
        </div>

        <InsightRecapCard nextStep={recapCue.nextStep}>
          {recapCue.takeaway}
        </InsightRecapCard>
      </div>
    </section>
  )
}
