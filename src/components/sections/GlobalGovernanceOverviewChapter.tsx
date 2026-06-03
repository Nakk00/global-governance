import { CircleDot } from "lucide-react"

import { resolveNarrativeRecapCue } from "@/data/sections/core-narrative"
import {
  overviewLegendItems,
  overviewLensControls,
  overviewRelationships,
  overviewSystemNodes,
  overviewVisualCopy,
} from "@/data/sections/global-governance-overview-visual"
import type { NarrativeSectionContent } from "@/data/sections/narrative-types"
import { useNavigation } from "@/hooks/useNavigation"

type GlobalGovernanceOverviewChapterProps = {
  content: NarrativeSectionContent
}

export function GlobalGovernanceOverviewChapter({
  content,
}: GlobalGovernanceOverviewChapterProps) {
  const headingId = `${content.id}-heading`
  const recapCue = resolveNarrativeRecapCue(content)
  const { activePanelByChapter, navigateToSection, setActiveChapterPanel } =
    useNavigation()
  const fallbackLens = overviewLensControls[0]
  const activeLensId =
    activePanelByChapter[content.id] ?? fallbackLens?.id ?? "system-framing"

  if (!fallbackLens) {
    return null
  }

  const activeLens =
    overviewLensControls.find((lens) => lens.id === activeLensId) ??
    fallbackLens
  const CenterIcon = overviewVisualCopy.centerIcon
  const NextIcon = overviewVisualCopy.nextIcon
  const nextTargetId = recapCue.nextStep?.targetId ?? "un-command-center"
  const nextLabel =
    recapCue.nextStep?.label ?? "Continue to The System Under Pressure"
  const activeLensRegionId = `${content.id}-active-lens`

  return (
    <section
      id={content.id}
      aria-labelledby={headingId}
      data-editorial-surface="narrative"
      className="mockup-chapter-stage overview-chapter-stage editorial-section relative isolate min-h-svh overflow-hidden px-4 sm:px-8 lg:px-12"
      tabIndex={-1}
    >
      <div
        aria-hidden="true"
        className="overview-chapter-backdrop pointer-events-none absolute inset-0 -z-10"
      />

      <div className="editorial-container mockup-overview-grid">
        <header className="mockup-overview-header text-center">
          <p className="overview-eyebrow">
            <span aria-hidden="true" />
            {overviewVisualCopy.eyebrow}
            <span aria-hidden="true" />
          </p>
          <h2 id={headingId} className="mockup-overview-title">
            {overviewVisualCopy.title}
          </h2>
          <span className="overview-title-divider" aria-hidden="true">
            <CenterIcon />
          </span>
          <p className="overview-support">{overviewVisualCopy.support}</p>
        </header>

        <aside className="mockup-panel overview-left-panel">
          <p className="mockup-panel-kicker">
            {overviewVisualCopy.selectedKicker}
          </p>
          <h3 className="mt-3 font-heading text-2xl leading-tight text-card-foreground">
            {activeLens.selectedTitle}
          </h3>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {activeLens.selectedBody}
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {activeLens.selectedDetail}
          </p>

          <div className="overview-panel-rule" aria-hidden="true" />
          <p className="mockup-panel-kicker">
            {overviewVisualCopy.relationshipKicker}
          </p>
          <div className="mt-3 grid gap-3">
            {overviewRelationships.map((relationship) => {
              const Icon = relationship.icon
              const isRelationshipFocused =
                activeLens.focusRelationshipIds.includes(relationship.id)

              return (
                <article
                  key={relationship.id}
                  className="overview-relation-card"
                  data-focus={isRelationshipFocused ? "true" : undefined}
                >
                  <Icon className="size-4" aria-hidden={true} />
                  <div>
                    <h4>{relationship.label}</h4>
                    <p>{relationship.body}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </aside>

        <section
          className="overview-system-diagram"
          aria-label="Global governance system diagram"
        >
          <p className="sr-only">{activeLens.diagramSummary}</p>
          <div className="overview-system-lines" aria-hidden="true">
            <span data-line="horizontal" />
            <span data-line="vertical" />
            <span data-line="diagonal-a" />
            <span data-line="diagonal-b" />
            <span data-line="ring-one" />
            <span data-line="ring-two" />
            <span data-line="ring-three" />
          </div>

          <div className="overview-system-core">
            <CenterIcon className="size-8" aria-hidden="true" />
            <span>{overviewVisualCopy.centerLabel}</span>
          </div>

          {overviewSystemNodes.map((node) => {
            const Icon = node.icon
            const isNodeFocused = activeLens.focusNodeLabels.includes(
              node.label
            )

            return (
              <div
                key={node.label}
                className="overview-system-node"
                data-position={node.position}
                data-focus={isNodeFocused ? "true" : undefined}
              >
                <Icon className="size-5" aria-hidden={true} />
                <span>{node.label}</span>
              </div>
            )
          })}
        </section>

        <aside className="mockup-panel overview-right-panel">
          <p className="mockup-panel-kicker">{overviewVisualCopy.whyKicker}</p>
          <h3 className="mt-3 font-heading text-2xl leading-tight text-card-foreground">
            {activeLens.whyTitle}
          </h3>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {activeLens.whyBody}
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {activeLens.whyDetail}
          </p>

          <div className="overview-quote-card">
            <span aria-hidden="true">
              <img src={overviewVisualCopy.quoteAsset} alt="" />
            </span>
            <strong>{activeLens.whyQuote}</strong>
          </div>
        </aside>

        <aside className="mockup-panel overview-legend">
          <p className="mockup-panel-kicker">System Connections Legend</p>
          <ul>
            {overviewLegendItems.map((item) => {
              const isLegendFocused =
                activeLens.focusLegendTones?.includes(item.tone) ?? false

              return (
                <li
                  key={item.label}
                  data-focus={isLegendFocused ? "true" : undefined}
                >
                  <span data-tone={item.tone} aria-hidden="true" />
                  {item.label}
                </li>
              )
            })}
          </ul>
        </aside>

        <div className="overview-lenses">
          <p>
            <span aria-hidden="true" />
            {overviewVisualCopy.lensesKicker}
            <span aria-hidden="true" />
          </p>
          <div className="overview-lens-controls" aria-label="System insights">
            {overviewLensControls.map((lens) => {
              const Icon = lens.icon
              const isActive = lens.id === activeLens.id

              return (
                <button
                  key={lens.id}
                  className="mockup-lens-button"
                  type="button"
                  aria-pressed={isActive}
                  aria-controls={activeLensRegionId}
                  onClick={() => setActiveChapterPanel(content.id, lens.id)}
                >
                  {isActive ? (
                    lens.asset ? (
                      <img src={lens.asset} alt="" aria-hidden="true" />
                    ) : (
                      <CircleDot className="size-3" aria-hidden="true" />
                    )
                  ) : (
                    <Icon className="size-3" aria-hidden={true} />
                  )}
                  <span>{lens.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <a
          className="mockup-panel overview-next-card"
          href={`#${nextTargetId}`}
          onClick={(event) => {
            event.preventDefault()
            navigateToSection(nextTargetId)
          }}
        >
          <img src={overviewVisualCopy.nextAsset} alt="" aria-hidden="true" />
          <span>
            <small>{overviewVisualCopy.nextKicker}</small>
            <strong>{overviewVisualCopy.nextTitle}</strong>
            <em>{overviewVisualCopy.nextBody}</em>
          </span>
          <NextIcon aria-hidden="true" />
          <span className="sr-only">{nextLabel}</span>
        </a>

        <aside
          id={activeLensRegionId}
          className="overview-active-lens"
          aria-live="polite"
        >
          <p className="mockup-panel-kicker">Active lens</p>
          <strong>{activeLens.label}</strong>
          <span>{activeLens.description}</span>
        </aside>
      </div>
    </section>
  )
}
