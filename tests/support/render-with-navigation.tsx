import { render, type RenderOptions } from "@testing-library/react"
import type { ReactElement } from "react"

import {
  NavigationContext,
  type NavigationContextValue,
} from "@/contexts/navigation-context"

type NavigationRenderOptions = Omit<RenderOptions, "wrapper"> & {
  navigation?: Partial<NavigationContextValue>
}

export function createNavigationContextValue(
  overrides: Partial<NavigationContextValue> = {}
): NavigationContextValue {
  return {
    activeChapterId: "hero-narrative-frame",
    activeChapterIndex: 0,
    activeSectionId: "hero-narrative-frame",
    activePanelByChapter: {},
    completedChapterIds: new Set<string>(),
    completedSectionIds: new Set<string>(),
    navigateToChapter: () => undefined,
    navigateToSection: () => undefined,
    navigateToAdjacentChapter: () => undefined,
    setActiveChapterPanel: () => undefined,
    resetToStart: () => undefined,
    resetToTop: () => undefined,
    ...overrides,
  }
}

export function renderWithNavigation(
  ui: ReactElement,
  options: NavigationRenderOptions = {}
) {
  const { navigation, ...renderOptions } = options
  const value = createNavigationContextValue(navigation)

  return {
    navigation: value,
    ...render(
      <NavigationContext.Provider value={value}>
        {ui}
      </NavigationContext.Provider>,
      renderOptions
    ),
  }
}
