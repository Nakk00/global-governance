import { Fragment, type ComponentType } from "react"
import {
  ArrowRight,
  CircleDot,
  FileText,
  Globe2,
  Hand,
  Landmark,
  Lightbulb,
  Map,
  Network,
  Scale,
  ShieldCheck,
  Target,
  Users,
  UsersRound,
  Vote,
} from "lucide-react"

import { getChapterById } from "@/data/navigation"
import type { NarrativeSectionContent } from "@/data/sections/narrative-types"
import {
  systemPressureBackground,
  systemPressureConstraints,
  systemPressureNodes,
  systemPressurePreviewChapters,
  unOrgans,
  type UNCommandCenterShellContent,
} from "@/data/sections/un-command-center"
import { useNavigation } from "@/hooks/useNavigation"

type UNCommandCenterProps = {
  content: NarrativeSectionContent
  shell: UNCommandCenterShellContent
}

type IconComponent = ComponentType<{
  "aria-hidden"?: boolean
  className?: string
}>

const organIcons: IconComponent[] = [
  Users,
  ShieldCheck,
  Network,
  Landmark,
  Scale,
]
const pressureNodeIcons: IconComponent[] = [
  FileText,
  Landmark,
  UsersRound,
  Target,
]
const constraintIcons: IconComponent[] = [
  UsersRound,
  Hand,
  Vote,
  ShieldCheck,
  CircleDot,
]
const previewIcons: IconComponent[] = [Globe2, Network, Landmark, Map]
const detailIcons: IconComponent[] = [ShieldCheck, Globe2, Hand, Lightbulb]

export function UNCommandCenter({ content, shell }: UNCommandCenterProps) {
  const { activePanelByChapter, setActiveChapterPanel } = useNavigation()
  const headingId = `${content.id}-heading`
  const organPanelId = `${content.id}-organ-panel`
  const organDetailHeadingId = `${content.id}-organ-detail-heading`
  const pressureMapId = `${content.id}-pressure-map`
  const fallbackOrganId =
    getChapterById(content.id)?.defaultPanelId ?? unOrgans[0]?.id
  const activeOrganId = activePanelByChapter[content.id] ?? fallbackOrganId
  const fallbackOrgan =
    unOrgans.find((organ) => organ.id === fallbackOrganId) ?? unOrgans[0]
  const selectedOrgan =
    unOrgans.find((organ) => organ.id === activeOrganId) ?? fallbackOrgan
  const selectedOrganIndex = Math.max(
    unOrgans.findIndex((organ) => organ.id === selectedOrgan?.id),
    0
  )
  const SelectedOrganIcon = organIcons[selectedOrganIndex] ?? Landmark
  const selectedOrganDetails = selectedOrgan
    ? [
        {
          label: "Role",
          body: selectedOrgan.role,
          Icon: detailIcons[0] ?? ShieldCheck,
        },
        {
          label: "Scope of power",
          body: selectedOrgan.power,
          Icon: detailIcons[1] ?? Globe2,
        },
        {
          label: "Limitation",
          body: selectedOrgan.limit,
          Icon: detailIcons[2] ?? Hand,
        },
        {
          label: "Why it matters",
          body: selectedOrgan.whyItMatters,
          Icon: detailIcons[3] ?? Lightbulb,
        },
      ]
    : []
  const nextStep = content.recap
  const nextPreview = systemPressurePreviewChapters.find(
    (chapter) => chapter.id === nextStep?.nextStepTargetId
  )

  if (!selectedOrgan) {
    return null
  }

  return (
    <section
      id={content.id}
      aria-labelledby={headingId}
      data-editorial-surface="system-under-pressure"
      className="mockup-chapter-stage system-pressure-chapter-stage editorial-section relative isolate min-h-svh overflow-hidden"
      tabIndex={-1}
    >
      <img
        className="system-pressure-background pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
        src={systemPressureBackground}
        alt=""
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="system-pressure-backdrop pointer-events-none absolute inset-0 -z-10"
      />

      <div className="editorial-container system-pressure-grid">
        <header className="system-pressure-heading-block text-center">
          <p className="system-pressure-eyebrow">
            <span aria-hidden="true" />
            Chapter 3
            <span aria-hidden="true" />
          </p>
          <h2 id={headingId} className="system-pressure-title">
            {content.title}
          </h2>
          <p className="system-pressure-support">
            Institutions organize cooperation. Politics tests the limits.
          </p>
          <p className="sr-only">{content.thesis}</p>
        </header>

        <aside className="system-pressure-panel system-pressure-rooms">
          <p className="system-pressure-kicker">Institution Rooms</p>
          <p className="system-pressure-room-intro">
            Explore the key institutions that shape global governance.
          </p>
          <div
            role="group"
            aria-label="Institution room selector"
            className="system-pressure-room-list"
          >
            {unOrgans.map((organ, index) => {
              const isSelected = organ.id === selectedOrgan.id
              const Icon = organIcons[index] ?? Landmark

              return (
                <button
                  key={organ.id}
                  type="button"
                  aria-pressed={isSelected}
                  aria-controls={organPanelId}
                  data-active={isSelected || undefined}
                  data-state={isSelected ? "selected" : "idle"}
                  className="system-pressure-room"
                  onClick={() => setActiveChapterPanel(content.id, organ.id)}
                >
                  <span className="system-pressure-room-icon">
                    <Icon aria-hidden={true} />
                  </span>
                  <span className="min-w-0">
                    <strong>{organ.label}</strong>
                    <small>{organ.summary}</small>
                  </span>
                  <ArrowRight aria-hidden="true" className="size-4" />
                </button>
              )
            })}
          </div>
          <button className="system-pressure-room-link" type="button">
            <Landmark aria-hidden="true" />
            <span>
              {shell.controls[0]?.title ?? "How the rooms work together"}
            </span>
          </button>
        </aside>

        <section
          className="system-pressure-center-stage"
          aria-label="Inspect the rooms of the UN system"
        >
          <section
            id={organPanelId}
            className="system-pressure-detail"
            aria-labelledby={organDetailHeadingId}
          >
            <div className="system-pressure-detail-header">
              <span className="system-pressure-detail-emblem">
                <SelectedOrganIcon aria-hidden={true} />
              </span>
              <div>
                <p className="system-pressure-kicker">
                  Selected institution room
                </p>
                <h3 id={organDetailHeadingId}>{selectedOrgan.label} details</h3>
                <p className="system-pressure-selected-badge">
                  <CircleDot aria-hidden={true} />
                  <span>Selected room: {selectedOrgan.label}</span>
                </p>
              </div>
            </div>

            <div className="system-pressure-detail-grid">
              {selectedOrganDetails.map(({ label, body, Icon }) => (
                <article key={label} className="system-pressure-detail-block">
                  <span className="system-pressure-detail-icon">
                    <Icon aria-hidden={true} />
                  </span>
                  <span>
                    <strong>{label}</strong>
                    <small>{body}</small>
                  </span>
                </article>
              ))}
            </div>
            <p aria-live="polite" className="sr-only">
              {selectedOrgan.label}: {selectedOrgan.role}
            </p>
          </section>

          <section
            className="system-pressure-diagram"
            aria-labelledby={pressureMapId}
          >
            <h3 id={pressureMapId}>Pressure flow</h3>
            <p className="sr-only">
              The diagram moves from shared rules to institutional rooms, then
              to state choices and real-world outcomes.
            </p>
            <div className="system-pressure-coordination" aria-hidden="true">
              <span>Coordination</span>
            </div>
            <div className="system-pressure-node-row">
              {systemPressureNodes.map((node, index) => {
                const Icon = pressureNodeIcons[index] ?? CircleDot

                return (
                  <Fragment key={node.label}>
                    <article
                      className="system-pressure-node"
                      data-tone={node.tone}
                    >
                      <span className="system-pressure-node-icon">
                        <Icon aria-hidden={true} />
                      </span>
                      <h4>{node.label}</h4>
                      <p>{node.body}</p>
                    </article>
                    {index < systemPressureNodes.length - 1 ? (
                      <span
                        className="system-pressure-flow"
                        data-tone={node.tone}
                        aria-hidden="true"
                      >
                        <ArrowRight />
                      </span>
                    ) : null}
                  </Fragment>
                )
              })}
            </div>
            <div className="system-pressure-pressure" aria-hidden="true">
              <span>Pressure</span>
            </div>
          </section>
        </section>

        <aside className="system-pressure-panel system-pressure-constraints">
          <p className="system-pressure-kicker">
            Constraints That Limit Outcomes
          </p>
          <div className="system-pressure-constraint-list">
            {systemPressureConstraints.map((constraint, index) => {
              const Icon = constraintIcons[index] ?? CircleDot

              return (
                <article
                  key={constraint.label}
                  className="system-pressure-constraint"
                >
                  <Icon aria-hidden={true} />
                  <span>
                    <strong>{constraint.label}</strong>
                    <small>{constraint.body}</small>
                  </span>
                </article>
              )
            })}
          </div>
          <strong className="system-pressure-closing">
            The system is not powerless. But it is not all-powerful either.
          </strong>
        </aside>

        <footer className="system-pressure-bottom-nav">
          {systemPressurePreviewChapters.map((chapter, index) => {
            const isActive = chapter.id === content.id
            const Icon = previewIcons[index] ?? CircleDot

            return (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                className="system-pressure-bottom-chapter"
                data-active={isActive || undefined}
                aria-current={isActive ? "location" : undefined}
              >
                <span className="system-pressure-bottom-icon">
                  <Icon aria-hidden={true} />
                </span>
                <span>
                  <strong>
                    <small>{chapter.number}</small> {chapter.label}
                  </strong>
                  <em>{chapter.summary}</em>
                </span>
              </a>
            )
          })}
          {nextStep ? (
            <a
              href={`#${nextStep.nextStepTargetId}`}
              className="system-pressure-next-card"
              aria-label={nextStep.nextStepLabel}
            >
              <span>
                <small>Next</small>
                <strong>{nextPreview?.label ?? nextStep.nextStepLabel}</strong>
              </span>
              <span className="system-pressure-next-icon">
                <ArrowRight aria-hidden="true" />
              </span>
            </a>
          ) : null}
        </footer>
      </div>
    </section>
  )
}
