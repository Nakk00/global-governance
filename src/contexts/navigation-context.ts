import { createContext } from "react"

export type ChapterPanelState = Partial<Record<string, string>>

export type NavigationContextValue = {
  activeChapterId: string
  activeChapterIndex: number
  activeSectionId: string
  activePanelByChapter: ChapterPanelState
  completedChapterIds: Set<string>
  completedSectionIds: Set<string>
  navigateToChapter: (chapterId: string) => void
  navigateToSection: (sectionId: string) => void
  navigateToAdjacentChapter: (direction: "previous" | "next") => void
  setActiveChapterPanel: (chapterId: string, panelId: string) => void
  resetToStart: () => void
  resetToTop: () => void
}

export const NavigationContext = createContext<NavigationContextValue | null>(
  null
)
