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
    <aside className="pointer-events-none fixed top-24 right-4 z-30 hidden xl:block">
      <nav
        aria-label="Section progress"
        className="pointer-events-auto flex w-56 flex-col gap-2 border-l border-border bg-background/80 py-2 pl-4 backdrop-blur"
      >
        {chapterNavigation.map((item, index) => {
          const isActive = item.id === activeSectionId
          const isComplete = completedSectionIds.has(item.id)

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              data-complete={isComplete || undefined}
              className="group grid min-h-11 grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-2 rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              onClick={(event) => {
                event.preventDefault()
                navigateToSection(item.id)
              }}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border border-border text-[0.68rem] font-semibold text-muted-foreground transition-colors",
                  isActive && "border-foreground bg-foreground text-background",
                  isComplete && !isActive && "border-foreground text-foreground"
                )}
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
          className="mt-1 min-h-11 justify-start px-0 text-xs"
          onClick={resetToTop}
        >
          <RotateCcw aria-hidden="true" data-icon="inline-start" />
          Return to start
        </Button>
      </nav>
    </aside>
  )
}
