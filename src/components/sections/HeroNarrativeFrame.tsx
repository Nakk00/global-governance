import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Building2,
  Globe2,
  Landmark,
  Leaf,
  Scale,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"
import type { ComponentType } from "react"

import { Button } from "@/components/ui/button"
import type { HeroContent } from "@/data/sections/hero-content"

type HeroNarrativeFrameProps = {
  content: HeroContent
  id?: string
}

type HeroSystemRow = {
  label: string
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}

const heroSystemRows: HeroSystemRow[] = [
  { label: "States & Governments", icon: Landmark },
  { label: "International Institutions", icon: Building2 },
  { label: "Norms & Rules", icon: ShieldCheck },
  { label: "Collective Challenges", icon: Globe2 },
  { label: "Shared Solutions", icon: Sparkles },
]

const systemPillars = [
  { label: "Security", icon: Shield, position: "top" },
  { label: "Development", icon: Leaf, position: "rightTop" },
  { label: "Rights", icon: Users, position: "rightBottom" },
  { label: "Environment", icon: Globe2, position: "bottom" },
  { label: "Economy", icon: BarChart3, position: "leftBottom" },
  { label: "Rule of law", icon: Scale, position: "leftTop" },
]

export function HeroNarrativeFrame({ content, id }: HeroNarrativeFrameProps) {
  const targetHref = `#${content.continueTargetId}`

  function handleContinue() {
    const target = document.getElementById(content.continueTargetId)

    if (!target) {
      return
    }

    window.setTimeout(() => {
      target.focus({ preventScroll: true })
    }, 0)
  }

  return (
    <section
      id={id}
      aria-labelledby="hero-heading"
      data-editorial-surface="hero"
      className="mockup-chapter-stage chapter-hero-stage editorial-section relative isolate flex min-h-svh overflow-hidden px-4 sm:px-8 lg:px-12"
      tabIndex={id ? -1 : undefined}
    >
      <div
        aria-hidden="true"
        className="chapter-hero-backdrop pointer-events-none absolute inset-0 -z-10"
      />

      <div className="editorial-container mockup-hero-grid">
        <aside className="mockup-panel mockup-hero-system-panel hidden lg:block">
          <p className="mockup-panel-kicker">The Global System</p>
          <p className="mt-3 max-w-52 text-sm leading-6 text-muted-foreground">
            Interconnected. Interdependent. Collectively governed.
          </p>
          <div className="mt-8 grid">
            {heroSystemRows.map((row) => {
              const Icon = row.icon

              return (
                <div
                  key={row.label}
                  className="mockup-system-row flex items-center gap-4"
                >
                  <Icon className="size-5" aria-hidden={true} />
                  <span>{row.label}</span>
                </div>
              )
            })}
          </div>
        </aside>

        <div className="chapter-hero-copy mockup-hero-center text-center">
          <p className="mockup-chapter-kicker">Global Systems Overview</p>
          <span className="mockup-hero-divider" aria-hidden="true" />
          <h1
            id="hero-heading"
            className="mockup-hero-title"
            aria-label={content.headline}
          >
            Power, rules, and institutions{" "}
            <span className="mockup-hero-title-highlight">shape</span> our
            shared world.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-foreground/82 sm:text-lg sm:leading-8">
            Explore how global governance connects states, institutions, norms,
            and collective action across borders.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="mockup-primary-cta w-full text-sm sm:w-auto sm:text-base"
            >
              <a
                href={targetHref}
                data-action-priority="primary"
                onClick={handleContinue}
              >
                {content.ctaLabel}
                <ArrowRight aria-hidden="true" data-icon="inline-end" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="mockup-secondary-cta w-full text-sm sm:w-auto sm:text-base"
            >
              <a href="#global-governance-overview">
                Explore chapters
                <ArrowDown aria-hidden="true" data-icon="inline-end" />
              </a>
            </Button>
          </div>
        </div>

        <aside className="mockup-panel mockup-hero-pillars-panel hidden xl:block">
          <p className="mockup-panel-kicker text-center">System Pillars</p>
          <div className="mockup-pillar-orbit mx-auto mt-7">
            <span className="mockup-pillar-ring" aria-hidden="true" />
            <span
              className="mockup-pillar-ring mockup-pillar-ring-inner"
              aria-hidden="true"
            />
            <span
              className="mockup-pillar-line mockup-pillar-line-horizontal"
              aria-hidden="true"
            />
            <span
              className="mockup-pillar-line mockup-pillar-line-vertical"
              aria-hidden="true"
            />
            <span className="mockup-pillar-center">
              <Landmark className="size-7" aria-hidden="true" />
            </span>
            {systemPillars.map((pillar) => {
              const Icon = pillar.icon

              return (
                <span
                  key={pillar.label}
                  className="mockup-pillar-node"
                  data-position={pillar.position}
                >
                  <span className="mockup-pillar-node-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span>{pillar.label}</span>
                </span>
              )
            })}
          </div>
          <p className="mt-8 border-t border-border/60 pt-5 text-sm leading-6 text-muted-foreground">
            No single actor can solve global challenges alone.
            <span className="mt-2 block font-semibold text-[color:var(--mockup-gold)]">
              Coordination creates impact.
            </span>
          </p>
        </aside>

        <aside className="mockup-panel mockup-current-focus hidden md:block">
          <p className="editorial-kicker">Current focus</p>
          <h2 className="mt-2 text-base font-semibold text-card-foreground">
            Hero Narrative Frame
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Setting the stage for how power, rules, and institutions shape
            global outcomes.
          </p>
          <span className="mockup-mini-progress" aria-hidden="true" />
        </aside>
      </div>
    </section>
  )
}
