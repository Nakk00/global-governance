import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { chapterNavigation, journeyStartSection } from "@/data/navigation"
import { useNavigation } from "@/hooks/useNavigation"
import { cn } from "@/lib/utils"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { activeSectionId, completedSectionIds, navigateToSection } =
    useNavigation()
  const activeChapter =
    chapterNavigation.find((item) => item.id === activeSectionId) ??
    (activeSectionId === journeyStartSection.id ? journeyStartSection : null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)")

    const closeAtDesktop = () => {
      if (mediaQuery.matches) {
        setIsOpen(false)
      }
    }

    closeAtDesktop()
    mediaQuery.addEventListener("change", closeAtDesktop)

    return () => {
      mediaQuery.removeEventListener("change", closeAtDesktop)
    }
  }, [])

  return (
    <>
      <div className="ml-auto lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 rounded-full"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          data-action-priority="secondary"
          aria-expanded={isOpen}
          aria-controls="mobile-chapter-navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </div>

      {isOpen ? (
        <nav
          id="mobile-chapter-navigation"
          aria-label="Mobile chapters"
          className="orbital-nav-shell mt-2 max-h-[calc(100svh-5.5rem)] basis-full overflow-y-auto overscroll-contain rounded-3xl border px-4 py-4 lg:hidden"
        >
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Current chapter:{" "}
            <span className="text-foreground">{activeChapter?.label}</span>
          </p>
          <div className="grid gap-1">
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
                    "orbital-link flex min-h-11 items-center justify-between gap-3 text-sm whitespace-normal outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  )}
                  onClick={(event) => {
                    event.preventDefault()
                    navigateToSection(item.id)
                    setIsOpen(false)
                  }}
                >
                  {item.label}
                  {isComplete && !isActive ? (
                    <span className="text-xs" aria-label="Completed">
                      Done
                    </span>
                  ) : null}
                </a>
              )
            })}
          </div>
        </nav>
      ) : null}
    </>
  )
}
