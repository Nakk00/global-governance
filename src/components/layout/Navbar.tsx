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
  const { activeSectionId, completedSectionIds, navigateToSection, resetToTop } =
    useNavigation()
  const activeChapter = chapterNavigation.find(
    (item) => item.id === activeSectionId,
  ) ?? (activeSectionId === journeyStartSection.id ? journeyStartSection : null)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/78">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center gap-3 px-5 sm:px-8 lg:px-12">
        <a
          href={`#${defaultChapterId}`}
          className="rounded-sm text-sm font-semibold tracking-normal outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          onClick={(event) => {
            event.preventDefault()
            navigateToSection(defaultChapterId)
          }}
        >
          Global Governance
        </a>

        <nav
          aria-label="Primary"
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex"
        >
          {chapterNavigation.map((item) => {
            const isActive = item.id === activeSectionId
            const isComplete = completedSectionIds.has(item.id)

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                data-complete={isComplete || undefined}
                className={cn(
                  "min-h-11 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background lg:text-sm",
                  isActive && "bg-foreground text-background",
                  !isActive && "hover:bg-accent hover:text-accent-foreground",
                  isComplete && !isActive && "text-foreground",
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
          <p className="max-w-48 truncate text-xs text-muted-foreground">
            Current chapter:{" "}
            <span className="font-medium text-foreground">
              {activeChapter?.label}
            </span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Return to start"
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
