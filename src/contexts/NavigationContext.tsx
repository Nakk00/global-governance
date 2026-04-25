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

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [activeSectionId, setActiveSectionId] = useState(defaultChapterId)
  const activeSectionIdRef = useRef(activeSectionId)
  const programmaticNavigationUntilRef = useRef(0)

  useEffect(() => {
    activeSectionIdRef.current = activeSectionId
  }, [activeSectionId])

  const setActiveAndFocus = useCallback((sectionId: string) => {
    programmaticNavigationUntilRef.current = Date.now() + 800
    setActiveSectionId(sectionId)
    focusSection(sectionId)
  }, [])

  const navigateToSection = useCallback(
    (sectionId: string) => {
      if (!isChapterId(sectionId)) {
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
    [setActiveAndFocus],
  )

  const resetToTop = useCallback(() => {
    navigateToSection(defaultChapterId)
  }, [navigateToSection])

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
          delayedFrame = window.setTimeout(() => {
            delayedFrame = 0
            scheduleUpdate()
          }, programmaticNavigationUntilRef.current - Date.now() + 16)
        }

        return
      }

      const anchorLine = window.scrollY + 180
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
        current === nearestPrevious ? current : nearestPrevious,
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

  const completedSectionIds = useMemo(() => {
    const activeIndex = getChapterIndex(activeSectionId)
    return new Set(
      chapterNavigation
        .slice(0, Math.max(activeIndex, 0))
        .map((item) => item.id),
    )
  }, [activeSectionId])

  const value = useMemo(
    () => ({
      activeSectionId,
      completedSectionIds,
      navigateToSection,
      resetToTop,
    }),
    [activeSectionId, completedSectionIds, navigateToSection, resetToTop],
  )

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}
