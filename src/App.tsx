import { AppShell } from "@/components/layout/AppShell"
import { HeroNarrativeFrame } from "@/components/sections/HeroNarrativeFrame"
import {
  chapterNavigation,
  defaultChapterId,
  journeyStartSection,
} from "@/data/navigation"
import { heroContent } from "@/data/sections/hero-content"

const contentChapterNavigation = chapterNavigation.filter(
  (item) => item.id !== defaultChapterId,
)
const pageSections = [journeyStartSection, ...contentChapterNavigation]

const sectionContent = new Map(
  pageSections.map((item) => [
    item.id,
    item.id === heroContent.continueTargetId
      ? {
          heading: heroContent.journeyStartHeading,
          body: heroContent.journeyStartText,
        }
      : {
          heading: item.label,
          body: item.summary,
        },
  ]),
)

export function App() {
  return (
    <AppShell>
      <main>
        <HeroNarrativeFrame content={heroContent} id={defaultChapterId} />
        {pageSections.map((item) => {
          const content = sectionContent.get(item.id)
          const headingId = `${item.id}-heading`

          return (
            <section
              key={item.id}
              id={item.id}
              aria-labelledby={headingId}
              className="mx-auto min-h-[54svh] w-full max-w-6xl scroll-mt-24 px-5 py-16 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:px-8 lg:px-12"
              tabIndex={-1}
            >
              <div className="max-w-2xl space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">
                  {item.eyebrow}
                </p>
                <h2
                  id={headingId}
                  className="text-2xl font-semibold tracking-normal sm:text-3xl"
                >
                  {content?.heading}
                </h2>
                <p className="text-base leading-7 text-muted-foreground">
                  {content?.body}
                </p>
              </div>
            </section>
          )
        })}
      </main>
    </AppShell>
  )
}

export default App
