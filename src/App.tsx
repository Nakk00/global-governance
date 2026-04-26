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
          data-editorial-surface="journey-start"
          className="editorial-section editorial-container min-h-[42svh]"
          tabIndex={-1}
        >
          <div className="editorial-surface editorial-measure space-y-4 rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-10">
            <p className="editorial-kicker">{journeyStartContent.eyebrow}</p>
            <h2 id="journey-start-heading" className="editorial-heading">
              {journeyStartContent.title}
            </h2>
            <p className="editorial-lede">{journeyStartContent.summary}</p>
            <p className="editorial-prose">{journeyStartContent.body}</p>
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
