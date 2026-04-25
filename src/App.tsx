import { AppShell } from "@/components/layout/AppShell"
import { ChapterTransitionBlock } from "@/components/sections/ChapterTransitionBlock"
import { HeroNarrativeFrame } from "@/components/sections/HeroNarrativeFrame"
import { NarrativeSection } from "@/components/sections/NarrativeSection"
import { defaultChapterId } from "@/data/navigation"
import {
  chapterTransitionsBySectionId,
  coreNarrativeSections,
  journeyStartContent,
} from "@/data/sections/core-narrative"
import { heroContent } from "@/data/sections/hero-content"

export function App() {
  return (
    <AppShell>
      <main>
        <HeroNarrativeFrame content={heroContent} id={defaultChapterId} />
        <section
          id={journeyStartContent.id}
          aria-label={journeyStartContent.navigationLabel}
          className="mx-auto min-h-[42svh] w-full max-w-6xl scroll-mt-24 px-5 py-16 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:px-8 lg:px-12"
          tabIndex={-1}
        >
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold text-muted-foreground">
              {journeyStartContent.eyebrow}
            </p>
            <h2
              id="journey-start-heading"
              className="text-2xl leading-tight font-semibold tracking-normal text-balance sm:text-3xl"
            >
              {journeyStartContent.title}
            </h2>
            <p className="text-lg leading-8 font-medium text-foreground">
              {journeyStartContent.summary}
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              {journeyStartContent.body}
            </p>
            <p className="max-w-2xl border-l border-border pl-4 text-sm leading-6 text-muted-foreground">
              {journeyStartContent.note}
            </p>
          </div>
        </section>
        {coreNarrativeSections.map((section) => {
          const transition = chapterTransitionsBySectionId.get(section.id)

          return (
            <div key={section.id}>
              <NarrativeSection content={section} />
              {transition ? (
                <ChapterTransitionBlock content={transition} />
              ) : null}
            </div>
          )
        })}
      </main>
    </AppShell>
  )
}

export default App
