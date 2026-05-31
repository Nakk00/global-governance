import {
  ArrowDown,
  ArrowRight,
  Building2,
  Cpu,
  CircleDot,
  FileText,
  Flag,
  Globe2,
  Handshake,
  Landmark,
  Leaf,
  Network,
  Scale,
  Users,
} from "lucide-react"
import type { ComponentType, CSSProperties } from "react"

import { Button } from "@/components/ui/button"
import { resolveNarrativeRecapCue } from "@/data/sections/core-narrative"
import type { NarrativeSectionContent } from "@/data/sections/narrative-types"
import { useNavigation } from "@/hooks/useNavigation"

type GlobalGovernanceOverviewChapterProps = {
  content: NarrativeSectionContent
}

type OverviewPanel = {
  id: string
  label: string
  description: string
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}

type SystemNode = {
  label: string
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}

const overviewPanels: OverviewPanel[] = [
  {
    id: "states",
    label: "States & Power",
    description:
      "Sovereign actors remain central, but shared problems limit acting alone.",
    icon: Landmark,
  },
  {
    id: "institutions",
    label: "Institutions & Coordination",
    description:
      "Organizations create meeting rooms, procedures, records, and pressure.",
    icon: Building2,
  },
  {
    id: "rules",
    label: "Rules & Expectations",
    description:
      "Norms shape what governments can justify, contest, and enforce together.",
    icon: FileText,
  },
]

const systemNodes: SystemNode[] = [
  { label: "States", icon: Flag },
  { label: "Institutions", icon: Building2 },
  { label: "Norms", icon: Scale },
  { label: "Civil Society", icon: Users },
  { label: "Markets & Technology", icon: Cpu },
  { label: "Issue Areas", icon: Leaf },
]

const lensControls: OverviewPanel[] = [
  {
    id: "system-framing",
    label: "System Framing",
    description: "Map the whole system before zooming into single actors.",
    icon: Network,
  },
  {
    id: "actor-relationships",
    label: "Actor Relationships",
    description:
      "Follow how states, institutions, markets, and civil society interact.",
    icon: Users,
  },
  {
    id: "rules-cooperation",
    label: "Rules & Cooperation",
    description:
      "Watch how expectations and procedures make coordination possible.",
    icon: Handshake,
  },
  {
    id: "power-inequality",
    label: "Power & Inequality",
    description:
      "Ask who benefits, who is constrained, and whose voice carries weight.",
    icon: Scale,
  },
]

export function GlobalGovernanceOverviewChapter({
  content,
}: GlobalGovernanceOverviewChapterProps) {
  const headingId = `${content.id}-heading`
  const recapCue = resolveNarrativeRecapCue(content)
  const { activePanelByChapter, navigateToSection, setActiveChapterPanel } =
    useNavigation()
  const activeLensId =
    activePanelByChapter[content.id] ?? lensControls[0]?.id ?? "system-framing"
  const activeLens =
    lensControls.find((lens) => lens.id === activeLensId) ?? lensControls[0]

  return (
    <section
      id={content.id}
      aria-labelledby={headingId}
      data-editorial-surface="narrative"
      className="mockup-chapter-stage overview-chapter-stage editorial-section relative isolate min-h-svh overflow-hidden px-4 py-10 sm:px-8 lg:px-12"
      tabIndex={-1}
    >
      <div
        aria-hidden="true"
        className="overview-chapter-backdrop pointer-events-none absolute inset-0 -z-10"
      />

      <div className="editorial-container mockup-overview-grid min-h-[calc(100svh-3rem)] pt-24">
        <header className="mockup-overview-header text-center">
          <p className="mockup-chapter-kicker">Chapter 2 of 6</p>
          <h2 id={headingId} className="mockup-overview-title">
            <span>Global Governance</span>
            <span>Overview</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-foreground/70">
            A connected system of actors, rules, and institutions that helps
            states coordinate when no single world government exists.
          </p>
        </header>

        <aside className="mockup-panel overview-left-panel">
          <p className="mockup-panel-kicker">Selected relationship</p>
          <h3 className="mt-3 font-heading text-2xl leading-tight text-card-foreground">
            Actors do not govern alone
          </h3>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            States, institutions, norms, and issue-specific bodies all shape
            outcomes. Governance is a structured web of coordination and
            constraint.
          </p>

          <div className="mt-7 grid gap-3">
            {overviewPanels.map((panel) => {
              const Icon = panel.icon

              return (
                <article key={panel.id} className="overview-relation-card">
                  <Icon className="size-4" aria-hidden={true} />
                  <div>
                    <h4>{panel.label}</h4>
                    <p>{panel.description}</p>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="editorial-summary mt-7 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="editorial-kicker">Summary</p>
            <p className="mt-3 text-sm leading-6 text-card-foreground">
              {content.summary}
            </p>
          </div>
        </aside>

        <div className="overview-system-diagram" aria-label={content.title}>
          <span className="overview-map-ring overview-map-ring-one" />
          <span className="overview-map-ring overview-map-ring-two" />
          <span className="overview-map-ring overview-map-ring-three" />
          <span className="overview-route-line overview-route-line-one" />
          <span className="overview-route-line overview-route-line-two" />
          <span className="overview-route-line overview-route-line-three" />

          <div className="overview-system-core">
            <Globe2 className="size-8" aria-hidden="true" />
            <span>Global governance</span>
          </div>

          {systemNodes.map((node, index) => {
            const Icon = node.icon

            return (
              <span
                key={node.label}
                className="overview-system-node"
                style={{ "--node-index": index } as CSSProperties}
              >
                <Icon className="size-5" aria-hidden={true} />
                <span>{node.label}</span>
              </span>
            )
          })}
        </div>

        <aside className="mockup-panel overview-right-panel">
          <p className="mockup-panel-kicker">Why it matters</p>
          <h3 className="mt-3 font-heading text-2xl leading-tight text-card-foreground">
            Shared problems need structured responses
          </h3>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Climate, trade, security, migration, and finance all demand
            mechanisms that help states coordinate beyond national borders, even
            when interests collide.
          </p>

          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="editorial-kicker">Supporting detail</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-card-foreground">
              {content.supportingDetails.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <p className="editorial-kicker">Key takeaway</p>
            <p className="mt-3 text-sm leading-6 text-card-foreground">
              {recapCue.takeaway}
            </p>
          </div>
        </aside>

        <aside className="mockup-panel overview-legend hidden lg:block">
          <p className="mockup-panel-kicker">Connections legend</p>
          <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
            <span>
              <i className="legend-line legend-line-blue" /> Institutional link
            </span>
            <span>
              <i className="legend-line legend-line-gold" /> Normative influence
            </span>
            <span>
              <i className="legend-line legend-line-green" /> Response pathway
            </span>
          </div>
        </aside>

        <div className="overview-lens-controls" aria-label="System insights">
          {lensControls.map((lens) => {
            const Icon = lens.icon
            const isActive = lens.id === activeLens.id

            return (
              <button
                key={lens.id}
                className="mockup-lens-button"
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveChapterPanel(content.id, lens.id)}
              >
                {isActive ? (
                  <CircleDot className="size-3" aria-hidden="true" />
                ) : (
                  <Icon className="size-3" aria-hidden={true} />
                )}
                <span>{lens.label}</span>
              </button>
            )
          })}
        </div>

        <aside className="mockup-panel overview-next-card">
          <p className="mockup-panel-kicker">Navigate</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {recapCue.nextStep?.label ?? "Continue to UN Command Center"}
          </p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-3">
            <p className="editorial-kicker">Active lens</p>
            <p className="mt-2 text-sm font-semibold text-card-foreground">
              {activeLens.label}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {activeLens.description}
            </p>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Continue from the system map into the institutional layer.
          </p>
          <Button asChild className="mockup-primary-cta mt-4 w-full">
            <a
              href={`#${recapCue.nextStep?.targetId ?? "un-command-center"}`}
              onClick={(event) => {
                event.preventDefault()
                navigateToSection(
                  recapCue.nextStep?.targetId ?? "un-command-center"
                )
              }}
            >
              {recapCue.nextStep?.label ?? "Continue to UN Command Center"}
              <ArrowRight aria-hidden="true" data-icon="inline-end" />
            </a>
          </Button>
        </aside>

        <aside
          aria-hidden="true"
          className="mockup-scroll-cue overview-scroll-cue hidden md:flex"
        >
          <span>Scroll to explore</span>
          <ArrowDown className="size-4" />
        </aside>

        <div
          aria-hidden="true"
          className="overview-insight-chip overview-insight-one"
        >
          <Network className="size-4" />
          <span>
            Interconnected systems mean local actions have global impact.
          </span>
        </div>
        <div
          aria-hidden="true"
          className="overview-insight-chip overview-insight-two"
        >
          <Leaf className="size-4" />
          <span>Inclusive cooperation builds resilient responses.</span>
        </div>
      </div>
    </section>
  )
}
