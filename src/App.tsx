import { lazy, Suspense } from "react"

import { AppShell } from "@/components/layout/AppShell"
import { UNCommandCenter } from "@/components/modules/UNCommandCenter/UNCommandCenter"
import { WpsDossier } from "@/components/modules/WpsDossier/WpsDossier"
import { ChapterTransitionBlock } from "@/components/sections/ChapterTransitionBlock"
import { GlobalGovernanceOverviewChapter } from "@/components/sections/GlobalGovernanceOverviewChapter"
import { HeroNarrativeFrame } from "@/components/sections/HeroNarrativeFrame"
import { NarrativeSection } from "@/components/sections/NarrativeSection"
import { defaultChapterId } from "@/data/navigation"
import {
  chapterTransitionsBySectionId,
  coreNarrativeSections,
} from "@/data/sections/core-narrative"
import { heroContent } from "@/data/sections/hero-content"
import { unCommandCenterShell } from "@/data/sections/un-command-center"
import { wpsDossierShell } from "@/data/sections/west-philippine-sea-dossier"

const MaintainerDashboard = lazy(() =>
  import("@/components/modules/MaintainerDashboard/MaintainerDashboard").then(
    (module) => ({ default: module.MaintainerDashboard })
  )
)

const PublicHomepageHeroMockup = lazy(() =>
  import("@/mockups/public-homepage-redesign/HeroMockupPage").then(
    (module) => ({ default: module.HeroMockupPage })
  )
)

const PublicHomepageOverviewMockup = lazy(() =>
  import("@/mockups/public-homepage-redesign/OverviewMockupPage").then(
    (module) => ({ default: module.OverviewMockupPage })
  )
)

export function App() {
  const pathname = window.location.pathname

  if (pathname === "/maintainer" || pathname.startsWith("/maintainer/")) {
    return (
      <Suspense
        fallback={<main className="min-h-svh bg-background text-foreground" />}
      >
        <MaintainerDashboard />
      </Suspense>
    )
  }

  if (pathname === "/mockups/public-homepage-redesign/hero") {
    return (
      <Suspense
        fallback={<main className="min-h-svh bg-background text-foreground" />}
      >
        <PublicHomepageHeroMockup />
      </Suspense>
    )
  }

  if (pathname === "/mockups/public-homepage-redesign/overview") {
    return (
      <Suspense
        fallback={<main className="min-h-svh bg-background text-foreground" />}
      >
        <PublicHomepageOverviewMockup />
      </Suspense>
    )
  }

  return (
    <AppShell>
      <main>
        <HeroNarrativeFrame content={heroContent} id={defaultChapterId} />
        {coreNarrativeSections.map((section) => {
          const transition = chapterTransitionsBySectionId.get(section.id)

          return (
            <div key={section.id}>
              {section.id === "un-command-center" ? (
                <UNCommandCenter
                  content={section}
                  shell={unCommandCenterShell}
                />
              ) : section.id === "west-philippine-sea-dossier" ? (
                <WpsDossier content={section} shell={wpsDossierShell} />
              ) : section.id === "global-governance-overview" ? (
                <GlobalGovernanceOverviewChapter content={section} />
              ) : (
                <NarrativeSection content={section} />
              )}
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
