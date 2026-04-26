import { RotateCcw } from "lucide-react"

import { MobileMenu } from "@/components/layout/MobileMenu"
import { Button } from "@/components/ui/button"
import {
  chapterNavigation,
  defaultChapterId,
  journeyStartSection,
} from "@/data/navigation"
import { useNavigation } from "@/hooks/useNavigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const {
    activeSectionId,
    completedSectionIds,
    navigateToSection,
    resetToTop,
  } = useNavigation()
  const activeChapter =
    chapterNavigation.find((item) => item.id === activeSectionId) ??
    (activeSectionId === journeyStartSection.id ? journeyStartSection : null)

  return (
    <header className="sticky top-0 z-40 px-2 pt-3 sm:px-5">
      <div className="editorial-container orbital-nav-shell flex min-h-16 flex-wrap items-center gap-3 rounded-3xl border px-3 py-2 sm:px-5 md:rounded-full">
        <a
          href={`#${defaultChapterId}`}
          data-action-priority="secondary"
          className="inline-flex min-h-11 items-center rounded-full px-2 text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          onClick={(event) => {
            event.preventDefault()
            navigateToSection(defaultChapterId)
          }}
        >
          Global Governance
        </a>

        <nav
          aria-label="Primary"
          className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-1 md:flex"
        >
          {chapterNavigation.map((item) => {
            const isActive = item.id === activeSectionId
            const isComplete = completedSectionIds.has(item.id)

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                data-action-priority="secondary"
                data-complete={isComplete || undefined}
                data-state={
                  isActive ? "active" : isComplete ? "complete" : "idle"
                }
                className={cn(
                  "orbital-link min-h-11 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                )}
                onClick={(event) => {
                  event.preventDefault()
                  navigateToSection(item.id)
                }}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <p className="max-w-52 truncate text-xs text-muted-foreground">
            Current chapter:{" "}
            <span className="font-medium text-foreground">
              {activeChapter?.label}
            </span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Return to start"
            data-action-priority="secondary"
            onClick={resetToTop}
          >
            <RotateCcw aria-hidden="true" />
          </Button>
        </div>

        <MobileMenu />
      </div>
    </header>
  )
}
