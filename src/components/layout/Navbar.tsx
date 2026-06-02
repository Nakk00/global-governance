import { BookOpen, MessageCircle, Search, ShieldCheck } from "lucide-react"
import type { CSSProperties } from "react"

import { MobileMenu } from "@/components/layout/MobileMenu"
import { Button } from "@/components/ui/button"
import {
  chapterCount,
  chapterNavigation,
  defaultChapterId,
} from "@/data/navigation"
import { useNavigation } from "@/hooks/useNavigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { activeChapterId, completedChapterIds, navigateToChapter } =
    useNavigation()
  const activeChapter =
    chapterNavigation.find((item) => item.id === activeChapterId) ??
    chapterNavigation[0]!

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-2 pt-3 sm:px-4">
      <div
        className="editorial-container orbital-nav-shell chapter-command-shell pointer-events-auto"
        data-active-theme={activeChapter.themeKey}
      >
        <a
          href={`#${defaultChapterId}`}
          data-action-priority="secondary"
          className="chapter-command-brand inline-flex min-h-12 min-w-0 items-center gap-3 rounded-full pr-4 pl-1 text-left text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          onClick={(event) => {
            event.preventDefault()
            navigateToChapter(defaultChapterId)
          }}
        >
          <span className="chapter-brand-mark" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block truncate font-heading text-base leading-none tracking-[0.06em] text-foreground uppercase">
              Global Governance
            </span>
            <span className="mt-1 block truncate text-xs text-muted-foreground">
              Understand. Connect. Act.
            </span>
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="chapter-command-track hidden min-w-0 flex-1 items-center justify-center gap-1 lg:grid"
        >
          {chapterNavigation.map((item) => {
            const isActive = item.id === activeChapterId
            const isComplete = completedChapterIds.has(item.id)

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-label={item.label}
                aria-current={isActive ? "location" : undefined}
                data-action-priority="secondary"
                data-complete={isComplete || undefined}
                data-state={
                  isActive ? "active" : isComplete ? "complete" : "idle"
                }
                className={cn(
                  "orbital-link chapter-command-link outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                )}
                onClick={(event) => {
                  event.preventDefault()
                  navigateToChapter(item.id)
                }}
              >
                <span
                  className="chapter-command-link-number"
                  aria-hidden="true"
                >
                  {item.number}
                </span>
                <span className="min-w-0">
                  <span className="chapter-command-label">
                    {item.shellLabel}
                  </span>
                </span>
              </a>
            )
          })}
        </nav>

        <div className="ml-auto hidden min-w-0 items-center gap-2 md:flex">
          <div
            className="chapter-command-current min-w-0"
            style={
              {
                "--chapter-progress-width": `${(activeChapter.number / chapterCount) * 100}%`,
              } as CSSProperties
            }
          >
            <p className="chapter-command-progress">Progress</p>
            <p className="chapter-command-title">
              {String(activeChapter.number).padStart(2, "0")} /{" "}
              {String(chapterCount).padStart(2, "0")}
            </p>
            <span className="chapter-progress-line" aria-hidden="true" />
          </div>
          <div className="chapter-utility-cluster hidden items-center gap-2 xl:flex">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="chapter-utility-button"
              aria-label="Search"
            >
              <Search aria-hidden="true" />
              <span className="chapter-utility-label">Search</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="chapter-utility-button"
              aria-label="Glossary"
            >
              <BookOpen aria-hidden="true" />
              <span className="chapter-utility-label">Glossary</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="chapter-utility-button"
              aria-label="Guide"
            >
              <ShieldCheck aria-hidden="true" />
              <span className="chapter-utility-label">Guide</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="chapter-utility-button chapter-utility-button-chat"
              aria-label="Chat"
            >
              <MessageCircle aria-hidden="true" />
              <span className="chapter-utility-label">Chat</span>
            </Button>
          </div>
        </div>

        <MobileMenu />
      </div>
    </header>
  )
}
