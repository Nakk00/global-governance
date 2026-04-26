import { ArrowDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { HeroContent } from "@/data/sections/hero-content"

type HeroNarrativeFrameProps = {
  content: HeroContent
  id?: string
}

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
      className="editorial-section relative isolate flex min-h-svh overflow-hidden px-4 py-8 sm:px-8 lg:px-12"
      tabIndex={id ? -1 : undefined}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,color-mix(in_oklch,var(--atlas-glow)_18%,transparent),transparent_18%),radial-gradient(circle_at_68%_32%,color-mix(in_oklch,var(--atlas-marker)_14%,transparent),transparent_18%),linear-gradient(135deg,color-mix(in_oklch,var(--editorial-surface-raised)_88%,var(--background))_0%,var(--background)_48%,color-mix(in_oklch,var(--ledger-surface)_74%,var(--background))_100%)]"
      />
      <div className="editorial-container grid content-center gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(16rem,0.72fr)] md:items-center">
        <div className="editorial-surface orbital-hero-panel editorial-measure relative space-y-6 overflow-hidden rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-10 lg:p-12">
          <p className="editorial-kicker">{content.eyebrow}</p>
          <div className="space-y-4">
            <h1 id="hero-heading" className="editorial-display max-w-3xl">
              {content.headline}
            </h1>
            <p className="editorial-prose max-w-2xl sm:text-lg sm:leading-8">
              {content.supportText}
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="editorial-primary-action w-full text-sm sm:w-auto sm:text-base"
          >
            <a
              href={targetHref}
              data-action-priority="primary"
              onClick={handleContinue}
            >
              {content.ctaLabel}
              <ArrowDown aria-hidden="true" data-icon="inline-end" />
            </a>
          </Button>
        </div>

        <div
          aria-hidden="true"
          className="orbital-rail-card orbital-hero-aside hidden min-h-64 p-8 md:block"
        >
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-3">
              <p className="orbital-chip">Orbital route</p>
              <p className="max-w-[16rem] text-sm leading-6 text-muted-foreground">
                Institutions, power, cooperation, disputes, and choices in one
                guided flow.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-px w-full bg-[linear-gradient(90deg,color-mix(in_oklch,var(--atlas-marker)_72%,transparent),transparent)]" />
              <div className="grid gap-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-3">
                  <span className="orbital-rail-marker size-6 text-[0.65rem]">
                    1
                  </span>
                  Entry vector
                </p>
                <p className="flex items-center gap-3">
                  <span className="orbital-rail-marker size-6 text-[0.65rem]">
                    2
                  </span>
                  Institutional gravity
                </p>
                <p className="flex items-center gap-3">
                  <span className="orbital-rail-marker size-6 text-[0.65rem]">
                    3
                  </span>
                  Regional collision
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
