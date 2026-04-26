import { RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { chapterNavigation } from "@/data/navigation"
import { useNavigation } from "@/hooks/useNavigation"
import { cn } from "@/lib/utils"

export function SectionProgressRail() {
  const {
    activeSectionId,
    completedSectionIds,
    navigateToSection,
    resetToTop,
  } = useNavigation()

  return (
    <aside className="pointer-events-none fixed top-28 right-4 z-30 hidden xl:block">
      <nav
        aria-label="Section progress"
        className="orbital-rail-card pointer-events-auto flex w-64 flex-col gap-2 px-4 py-4"
      >
        <div className="px-1">
          <p className="orbital-chip">Orbital route</p>
        </div>
        {chapterNavigation.map((item, index) => {
          const isActive = item.id === activeSectionId
          const isComplete = completedSectionIds.has(item.id)

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              data-action-priority="secondary"
              data-complete={isComplete || undefined}
              data-state={isActive ? "active" : isComplete ? "complete" : "idle"}
              className="orbital-rail-link group grid min-h-11 grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              onClick={(event) => {
                event.preventDefault()
                navigateToSection(item.id)
              }}
            >
              <span
                aria-hidden="true"
                className={cn("orbital-rail-marker transition-colors")}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "truncate text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground",
                  isActive && "text-foreground"
                )}
              >
                {item.label}
              </span>
            </a>
          )
        })}
        <Button
          type="button"
          variant="ghost"
          className="editorial-secondary-action mt-1 min-h-11 justify-start rounded-full px-3 text-xs"
          data-action-priority="secondary"
          onClick={resetToTop}
        >
          <RotateCcw aria-hidden="true" data-icon="inline-start" />
          Return to start
        </Button>
      </nav>
    </aside>
  )
}
