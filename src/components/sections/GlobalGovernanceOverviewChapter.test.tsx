import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, it } from "vitest"

import {
  NavigationContext,
  type ChapterPanelState,
  type NavigationContextValue,
} from "@/contexts/navigation-context"
import { globalGovernanceOverview } from "@/data/sections/global-governance-overview"

import { createNavigationContextValue } from "../../../tests/support/render-with-navigation"

import { GlobalGovernanceOverviewChapter } from "./GlobalGovernanceOverviewChapter"

function renderOverview(
  navigationOverrides: Partial<NavigationContextValue> = {}
) {
  function NavigationHarness() {
    const [activePanelByChapter, setActivePanelByChapterState] =
      useState<ChapterPanelState>(
        navigationOverrides.activePanelByChapter ?? {}
      )

    const navigation = createNavigationContextValue({
      ...navigationOverrides,
      activePanelByChapter,
      setActiveChapterPanel: (chapterId, panelId) => {
        setActivePanelByChapterState((current) =>
          current[chapterId] === panelId
            ? current
            : {
                ...current,
                [chapterId]: panelId,
              }
        )
      },
    })

    return (
      <NavigationContext.Provider value={navigation}>
        <GlobalGovernanceOverviewChapter content={globalGovernanceOverview} />
      </NavigationContext.Provider>
    )
  }

  return render(<NavigationHarness />)
}

describe("GlobalGovernanceOverviewChapter", () => {
  it("renders the default system framing lens and current next chapter cue", () => {
    renderOverview()

    expect(
      screen.getByRole("heading", { name: "Global Governance Overview" })
    ).toBeVisible()
    expect(
      screen.getByRole("button", { name: "System Framing" })
    ).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText("Actors do not govern alone")).toBeVisible()
    expect(
      screen.getByRole("link", {
        name: /Continue to The System Under Pressure/i,
      })
    ).toHaveAttribute("href", "#un-command-center")

    const activeLens = document.getElementById(
      "global-governance-overview-active-lens"
    )

    expect(activeLens).not.toBeNull()
    expect(
      within(activeLens as HTMLElement).getByText("System Framing")
    ).toBeVisible()
  })

  it("updates the teaching state when Power & Inequality is selected", async () => {
    const user = userEvent.setup()

    renderOverview()

    const systemFraming = screen.getByRole("button", {
      name: "System Framing",
    })
    const powerInequality = screen.getByRole("button", {
      name: "Power & Inequality",
    })

    await user.click(powerInequality)

    expect(powerInequality).toHaveAttribute("aria-pressed", "true")
    expect(systemFraming).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByText("Power shapes every shared rule")).toBeVisible()
    expect(screen.getByText("Cooperation is never neutral")).toBeVisible()

    const activeLens = document.getElementById(
      "global-governance-overview-active-lens"
    )

    expect(activeLens).not.toBeNull()
    expect(
      within(activeLens as HTMLElement).getByText("Power & Inequality")
    ).toBeVisible()
  })

  it("activates a lens from the keyboard", async () => {
    const user = userEvent.setup()

    renderOverview()

    const rulesCooperation = screen.getByRole("button", {
      name: "Rules & Cooperation",
    })

    rulesCooperation.focus()
    expect(rulesCooperation).toHaveFocus()

    await user.keyboard("{Enter}")

    expect(rulesCooperation).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText("Rules make cooperation repeatable")).toBeVisible()
  })

  it("spotlights relationships and nodes without removing the rest of the map", async () => {
    const user = userEvent.setup()

    renderOverview()

    await user.click(screen.getByRole("button", { name: "Power & Inequality" }))

    const statesPower = screen.getByText("States & Power").closest("article")
    const institutionsCoordination = screen
      .getByText("Institutions & Coordination")
      .closest("article")
    const statesNode = screen
      .getByText("States")
      .closest(".overview-system-node")
    const normsNode = screen.getByText("Norms").closest(".overview-system-node")

    expect(statesPower).toHaveAttribute("data-focus", "true")
    expect(institutionsCoordination).not.toHaveAttribute("data-focus")
    expect(statesNode).toHaveAttribute("data-focus", "true")
    expect(normsNode).not.toHaveAttribute("data-focus")
    expect(screen.getByText("Institutions & Coordination")).toBeVisible()
    expect(screen.getByText("Norms")).toBeVisible()
  })

  it("falls back to the default lens when navigation state contains an invalid panel id", () => {
    renderOverview({
      activePanelByChapter: {
        "global-governance-overview": "not-real",
      },
    })

    expect(
      screen.getByRole("button", { name: "System Framing" })
    ).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText("Actors do not govern alone")).toBeVisible()
  })
})
