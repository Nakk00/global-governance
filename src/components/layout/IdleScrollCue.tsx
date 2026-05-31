import { ChevronDown, Mouse } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { chapterNavigation } from "@/data/navigation"
import { useNavigation } from "@/hooks/useNavigation"

const IDLE_SCROLL_CUE_DELAY_MS = 4000

const IDLE_RESET_EVENTS = [
  "pointerdown",
  "keydown",
  "wheel",
  "scroll",
  "touchstart",
] as const

function isChatPanelOpen() {
  return Boolean(document.querySelector("[data-source-aware-chat-panel]"))
}

export function IdleScrollCue() {
  const { activeChapterId, navigateToAdjacentChapter } = useNavigation()
  const [isIdle, setIsIdle] = useState(false)

  const activeIndex = chapterNavigation.findIndex(
    (chapter) => chapter.id === activeChapterId
  )
  const hasNextChapter =
    activeIndex >= 0 && activeIndex < chapterNavigation.length - 1

  useEffect(() => {
    let timeout = window.setTimeout(() => {
      setIsIdle(!isChatPanelOpen())
    }, IDLE_SCROLL_CUE_DELAY_MS)

    const resetIdle = () => {
      setIsIdle(false)
      window.clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        setIsIdle(!isChatPanelOpen())
      }, IDLE_SCROLL_CUE_DELAY_MS)
    }

    IDLE_RESET_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, resetIdle, { passive: true })
    })
    window.addEventListener("blur", resetIdle)

    return () => {
      window.clearTimeout(timeout)
      IDLE_RESET_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, resetIdle)
      })
      window.removeEventListener("blur", resetIdle)
    }
  }, [activeChapterId])

  if (!hasNextChapter || !isIdle) {
    return null
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="idle-scroll-cue"
      aria-label="Continue to next chapter"
      onClick={() => {
        setIsIdle(false)
        navigateToAdjacentChapter("next")
      }}
    >
      <span className="idle-scroll-cue-mouse" aria-hidden="true">
        <Mouse />
      </span>
      <span className="idle-scroll-cue-label">Scroll to explore</span>
      <ChevronDown className="idle-scroll-cue-chevron" aria-hidden="true" />
    </Button>
  )
}
