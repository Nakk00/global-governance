import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { NavigationContext } from "@/contexts/navigation-context"
import {
  chapterNavigation,
  defaultChapterId,
  getAdjacentChapterId,
  getChapterIndex,
  isChapterId,
  isKnownSectionId,
} from "@/data/navigation"

type NavigationProviderProps = {
  children: ReactNode
}

const focusSection = (sectionId: string) => {
  const target = document.getElementById(sectionId)

  if (!target) {
    return
  }

  target.scrollIntoView({ block: "start" })
  window.setTimeout(() => {
    target.focus({ preventScroll: true })
  }, 0)
}

const getHashSectionId = () => window.location.hash.replace(/^#/, "")
const SCROLL_ANCHOR_OFFSET = 180
const PROGRAMMATIC_NAVIGATION_HOLD_MS = 800

const getSectionDocumentTop = (sectionId: string) => {
  const section = document.getElementById(sectionId)

  return section ? section.getBoundingClientRect().top + window.scrollY : null
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [activeSectionId, setActiveSectionId] = useState(defaultChapterId)
  const [activePanelByChapter, setActivePanelByChapter] = useState<
    Partial<Record<string, string>>
  >({})
  const activeSectionIdRef = useRef(activeSectionId)
  const programmaticNavigationUntilRef = useRef(0)
  const programmaticNavigationTargetRef = useRef<string | null>(null)

  useEffect(() => {
    activeSectionIdRef.current = activeSectionId
  }, [activeSectionId])

  const setActiveAndFocus = useCallback((sectionId: string) => {
    programmaticNavigationUntilRef.current =
      Date.now() + PROGRAMMATIC_NAVIGATION_HOLD_MS
    programmaticNavigationTargetRef.current = sectionId
    setActiveSectionId(sectionId)
    focusSection(sectionId)
  }, [])

  const navigateToSection = useCallback(
    (sectionId: string) => {
      if (!isKnownSectionId(sectionId)) {
        return
      }

      if (activeSectionIdRef.current === sectionId) {
        if (getHashSectionId() !== sectionId) {
          window.history.replaceState(null, "", `#${sectionId}`)
        }

        focusSection(sectionId)
        return
      }

      window.history.pushState(null, "", `#${sectionId}`)
      setActiveAndFocus(sectionId)
    },
    [setActiveAndFocus]
  )

  const resetToTop = useCallback(() => {
    navigateToSection(defaultChapterId)
  }, [navigateToSection])

  const navigateToChapter = useCallback(
    (chapterId: string) => {
      if (!isChapterId(chapterId)) {
        return
      }

      navigateToSection(chapterId)
    },
    [navigateToSection]
  )

  const navigateToAdjacentChapter = useCallback(
    (direction: "previous" | "next") => {
      const currentChapterId = isChapterId(activeSectionIdRef.current)
        ? activeSectionIdRef.current
        : defaultChapterId
      const adjacentChapterId = getAdjacentChapterId(
        currentChapterId,
        direction
      )

      if (!adjacentChapterId) {
        return
      }

      navigateToChapter(adjacentChapterId)
    },
    [navigateToChapter]
  )

  const setActiveChapterPanel = useCallback(
    (chapterId: string, panelId: string) => {
      if (!isChapterId(chapterId) || panelId.trim().length === 0) {
        return
      }

      setActivePanelByChapter((current) => {
        if (current[chapterId] === panelId) {
          return current
        }

        return {
          ...current,
          [chapterId]: panelId,
        }
      })
    },
    []
  )

  const resetToStart = useCallback(() => {
    navigateToChapter(defaultChapterId)
  }, [navigateToChapter])

  useEffect(() => {
    const reconcileHash = () => {
      const hashSectionId = getHashSectionId()

      if (!hashSectionId) {
        setActiveAndFocus(defaultChapterId)
        return
      }

      const nextSectionId = isChapterId(hashSectionId)
        ? hashSectionId
        : isKnownSectionId(hashSectionId)
          ? hashSectionId
          : defaultChapterId

      if (hashSectionId !== nextSectionId) {
        window.history.replaceState(null, "", `#${nextSectionId}`)
      }

      setActiveAndFocus(nextSectionId)
    }

    reconcileHash()

    window.addEventListener("hashchange", reconcileHash)
    window.addEventListener("popstate", reconcileHash)

    return () => {
      window.removeEventListener("hashchange", reconcileHash)
      window.removeEventListener("popstate", reconcileHash)
    }
  }, [setActiveAndFocus])

  useEffect(() => {
    let frame = 0
    let delayedFrame = 0

    const updateActiveSection = () => {
      frame = 0

      if (Date.now() < programmaticNavigationUntilRef.current) {
        if (!delayedFrame) {
          delayedFrame = window.setTimeout(
            () => {
              delayedFrame = 0
              scheduleUpdate()
            },
            programmaticNavigationUntilRef.current - Date.now() + 16
          )
        }

        return
      }

      const anchorLine = window.scrollY + SCROLL_ANCHOR_OFFSET
      const programmaticTarget = programmaticNavigationTargetRef.current

      if (programmaticTarget && isChapterId(programmaticTarget)) {
        const targetIndex = getChapterIndex(programmaticTarget)
        const targetTop = getSectionDocumentTop(programmaticTarget)
        const nextChapterId = chapterNavigation[targetIndex + 1]?.id
        const nextTop = nextChapterId
          ? getSectionDocumentTop(nextChapterId)
          : Number.POSITIVE_INFINITY

        if (
          targetTop !== null &&
          anchorLine >= targetTop &&
          anchorLine < (nextTop ?? Number.POSITIVE_INFINITY)
        ) {
          setActiveSectionId((current) =>
            current === programmaticTarget ? current : programmaticTarget
          )
          return
        }

        programmaticNavigationTargetRef.current = null
      }

      const hashSectionId = getHashSectionId()
      if (
        hashSectionId &&
        isKnownSectionId(hashSectionId) &&
        !isChapterId(hashSectionId)
      ) {
        const firstChapter = document.getElementById(chapterNavigation[1]?.id)
        const firstChapterTop = firstChapter
          ? firstChapter.getBoundingClientRect().top + window.scrollY
          : Number.POSITIVE_INFINITY

        if (anchorLine < firstChapterTop) {
          setActiveSectionId((current) =>
            current === hashSectionId ? current : hashSectionId
          )
          return
        }
      }

      const nearestPrevious = chapterNavigation.reduce((current, item) => {
        const section = document.getElementById(item.id)

        if (!section) {
          return current
        }

        const top = section.getBoundingClientRect().top + window.scrollY

        if (top <= anchorLine) {
          return item.id
        }

        return current
      }, defaultChapterId)

      setActiveSectionId((current) =>
        current === nearestPrevious ? current : nearestPrevious
      )
    }

    const scheduleUpdate = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(updateActiveSection)
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    scheduleUpdate()

    return () => {
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)

      if (frame) {
        window.cancelAnimationFrame(frame)
      }

      if (delayedFrame) {
        window.clearTimeout(delayedFrame)
      }
    }
  }, [])

  const activeChapterId = isChapterId(activeSectionId)
    ? activeSectionId
    : defaultChapterId
  const activeChapterIndex = getChapterIndex(activeChapterId)

  const completedChapterIds = useMemo(() => {
    const activeIndex = getChapterIndex(activeChapterId)
    return new Set(
      chapterNavigation
        .slice(0, Math.max(activeIndex, 0))
        .map((item) => item.id)
    )
  }, [activeChapterId])

  const completedSectionIds = completedChapterIds

  const value = useMemo(
    () => ({
      activeChapterId,
      activeChapterIndex,
      activeSectionId,
      activePanelByChapter,
      completedChapterIds,
      completedSectionIds,
      navigateToChapter,
      navigateToSection,
      navigateToAdjacentChapter,
      setActiveChapterPanel,
      resetToStart,
      resetToTop,
    }),
    [
      activeChapterId,
      activeChapterIndex,
      activePanelByChapter,
      activeSectionId,
      completedChapterIds,
      completedSectionIds,
      navigateToAdjacentChapter,
      navigateToChapter,
      navigateToSection,
      resetToStart,
      resetToTop,
      setActiveChapterPanel,
    ]
  )

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}
