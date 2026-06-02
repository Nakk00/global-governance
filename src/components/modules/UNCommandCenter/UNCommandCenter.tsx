import type { ComponentType } from "react"
import { useState } from "react"
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

import type { NarrativeSectionContent } from "@/data/sections/narrative-types"
import {
  systemPressureBackground,
  systemPressureConstraints,
  systemPressureNodes,
  systemPressurePreviewChapters,
  unOrgans,
  type UNCommandCenterShellContent,
} from "@/data/sections/un-command-center"

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

export function UNCommandCenter({ content, shell }: UNCommandCenterProps) {
  const [selectedOrganId, setSelectedOrganId] = useState(unOrgans[0]?.id)
  const headingId = `${content.id}-heading`
  const organPanelId = `${content.id}-organ-panel`
  const pressureMapId = `${content.id}-pressure-map`
  const selectedOrgan =
    unOrgans.find((organ) => organ.id === selectedOrganId) ?? unOrgans[0]
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
          <p className="sr-only">{content.summary}</p>
        </header>

        <aside className="system-pressure-panel system-pressure-rooms">
          <p className="system-pressure-kicker">Institution Rooms</p>
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
                  onClick={() => setSelectedOrganId(organ.id)}
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
          <p id={organPanelId} aria-live="polite" className="sr-only">
            {selectedOrgan.label}: {selectedOrgan.role}
          </p>
          <button className="system-pressure-room-link" type="button">
            <Landmark aria-hidden="true" />
            <span>
              {shell.controls[0]?.title ?? "How the rooms work together"}
            </span>
          </button>
        </aside>

        <section
          className="system-pressure-diagram"
          aria-labelledby={pressureMapId}
        >
          <h3 id={pressureMapId} className="sr-only">
            Rules, institutions, state choices, and outcomes pressure diagram
          </h3>
          <p className="sr-only">
            Rules and institutions organize cooperation, while state choices and
            outcomes show how politics tests enforcement.
          </p>
          <div className="system-pressure-coordination" aria-hidden="true">
            <span>Coordination</span>
          </div>
          <div className="system-pressure-node-row">
            {systemPressureNodes.map((node, index) => {
              const Icon = pressureNodeIcons[index] ?? CircleDot

              return (
                <article
                  key={node.label}
                  className="system-pressure-node"
                  data-tone={node.tone}
                >
                  <span className="system-pressure-node-icon">
                    <Icon aria-hidden={true} />
                  </span>
                  <h4>{node.label}</h4>
                  <p>{node.body}</p>
                  {index < systemPressureNodes.length - 1 ? (
                    <ArrowRight
                      className="system-pressure-flow"
                      aria-hidden="true"
                    />
                  ) : null}
                </article>
              )
            })}
          </div>
          <div className="system-pressure-pressure" aria-hidden="true">
            <span>Pressure</span>
          </div>
          <aside className="system-pressure-takeaway">
            <span className="system-pressure-takeaway-icon">
              <Lightbulb aria-hidden="true" />
            </span>
            <span>
              <strong>Key takeaway</strong>
              <small>{content.synthesis}</small>
            </span>
          </aside>
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
