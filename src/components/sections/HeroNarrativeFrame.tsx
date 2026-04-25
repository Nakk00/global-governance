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
      className="relative isolate flex min-h-svh overflow-hidden bg-background px-5 py-8 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:px-8 lg:px-12"
      tabIndex={id ? -1 : undefined}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,color-mix(in_oklch,var(--primary)_13%,transparent),transparent_29%),linear-gradient(135deg,color-mix(in_oklch,var(--muted)_80%,white)_0%,var(--background)_52%,color-mix(in_oklch,var(--secondary)_86%,white)_100%)] motion-reduce:bg-[linear-gradient(135deg,color-mix(in_oklch,var(--muted)_85%,white)_0%,var(--background)_100%)]"
      />
      <div className="mx-auto grid w-full max-w-6xl content-center gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(17rem,0.65fr)] md:items-center">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-semibold tracking-normal text-muted-foreground">
            {content.eyebrow}
          </p>
          <div className="space-y-4">
            <h1
              id="hero-heading"
              className="max-w-3xl text-5xl leading-none font-semibold tracking-normal text-balance sm:text-6xl lg:text-7xl"
            >
              {content.headline}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {content.supportText}
            </p>
          </div>
          <Button asChild size="lg" className="h-11 px-4 text-sm sm:text-base">
            <a href={targetHref} onClick={handleContinue}>
              {content.ctaLabel}
              <ArrowDown aria-hidden="true" data-icon="inline-end" />
            </a>
          </Button>
        </div>

        <div
          aria-hidden="true"
          className="hidden min-h-64 border-l border-border pl-8 md:block"
        >
          <div className="flex h-full flex-col justify-end gap-4 text-sm text-muted-foreground">
            <div className="h-1 w-24 bg-primary" />
            <p className="max-w-xs leading-6">
              Institutions, power, cooperation, disputes, and choices in one
              guided flow.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
