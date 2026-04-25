import { createContext } from "react"

export type NavigationContextValue = {
  activeSectionId: string
  completedSectionIds: Set<string>
  navigateToSection: (sectionId: string) => void
  resetToTop: () => void
}

export const NavigationContext =
  createContext<NavigationContextValue | null>(null)
