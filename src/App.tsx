import { HeroNarrativeFrame } from "@/components/sections/HeroNarrativeFrame"
import { heroContent } from "@/data/sections/hero-content"

export function App() {
  return (
    <main className="bg-background text-foreground">
      <HeroNarrativeFrame content={heroContent} />
      <section
        id={heroContent.continueTargetId}
        aria-labelledby="journey-start-heading"
        className="mx-auto min-h-[42svh] w-full max-w-6xl scroll-mt-8 px-5 py-14 outline-none focus:ring-2 focus:ring-ring focus:ring-offset-4 focus:ring-offset-background sm:px-8 lg:px-12"
        tabIndex={-1}
      >
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">
            Continue
          </p>
          <h2
            id="journey-start-heading"
            className="text-2xl font-semibold tracking-normal sm:text-3xl"
          >
            {heroContent.journeyStartHeading}
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            {heroContent.journeyStartText}
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
