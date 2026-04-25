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
  const activeChapter = chapterNavigation.find(
    (item) => item.id === activeSectionId,
  ) ?? (activeSectionId === journeyStartSection.id ? journeyStartSection : null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")

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
      <div className="ml-auto md:hidden">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
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
          className="max-h-[calc(100svh-4rem)] basis-full overflow-y-auto overscroll-contain border-t border-border bg-background py-3 md:hidden"
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
                  data-complete={isComplete || undefined}
                  className={cn(
                    "flex min-h-11 items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive && "bg-foreground text-background",
                    !isActive && "hover:bg-accent hover:text-accent-foreground",
                    isComplete && !isActive && "text-foreground",
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
