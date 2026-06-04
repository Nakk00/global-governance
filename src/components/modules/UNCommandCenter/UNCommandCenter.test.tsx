import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, it } from "vitest"

import {
  NavigationContext,
  type ChapterPanelState,
  type NavigationContextValue,
} from "@/contexts/navigation-context"
import {
  unCommandCenter,
  unCommandCenterShell,
} from "@/data/sections/un-command-center"

import { createNavigationContextValue } from "../../../../tests/support/render-with-navigation"

import { UNCommandCenter } from "./UNCommandCenter"

function renderCommandCenter(
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
        <UNCommandCenter
          content={unCommandCenter}
          shell={unCommandCenterShell}
        />
      </NavigationContext.Provider>
    )
  }

  return render(<NavigationHarness />)
}

describe("UNCommandCenter", () => {
  it("renders the default institution detail stage and pressure surface", () => {
    renderCommandCenter()

    expect(
      screen.getByRole("heading", { name: "The System Under Pressure" })
    ).toBeVisible()

    const detail = screen.getByRole("region", {
      name: "General Assembly details",
    })

    expect(
      within(detail).getByText("Selected room: General Assembly")
    ).toBeVisible()
    expect(within(detail).getByText("Role")).toBeVisible()
    expect(within(detail).getByText("Scope of power")).toBeVisible()
    expect(within(detail).getByText("Limitation")).toBeVisible()
    expect(within(detail).getByText("Why it matters")).toBeVisible()
    expect(within(detail).getByText(/same microphone/i)).toBeVisible()

    const diagram = screen.getByRole("region", {
      name: /pressure flow/i,
    })

    expect(within(diagram).getByText("Rules")).toBeVisible()
    expect(within(diagram).getByText("Institutions")).toBeVisible()
    expect(within(diagram).getByText("State Choices")).toBeVisible()
    expect(within(diagram).getByText("Outcomes")).toBeVisible()
    expect(screen.getByText("Consent")).toBeVisible()
    expect(screen.getByText("Veto")).toBeVisible()
    expect(screen.getByText("Political Will")).toBeVisible()
    expect(screen.getByText("Leverage")).toBeVisible()
    expect(screen.getByText("Uneven Enforcement")).toBeVisible()
    expect(
      screen.getByRole("link", {
        name: /Continue to West Philippine Sea Case File/i,
      })
    ).toHaveAttribute("href", "#west-philippine-sea-dossier")
  })

  it("updates the shared chapter panel state when a different room is selected", async () => {
    const user = userEvent.setup()

    renderCommandCenter()

    const defaultOrgan = screen.getByRole("button", {
      name: /General Assembly/i,
    })
    const securityCouncil = screen.getByRole("button", {
      name: /Security Council/i,
    })

    expect(defaultOrgan).toHaveAttribute("aria-pressed", "true")

    await user.click(securityCouncil)

    expect(securityCouncil).toHaveAttribute("aria-pressed", "true")
    expect(defaultOrgan).toHaveAttribute("aria-pressed", "false")

    const detail = screen.getByRole("region", {
      name: "Security Council details",
    })

    expect(
      within(detail).getByText("Selected room: Security Council")
    ).toBeVisible()
    expect(within(detail).getByText(/binding decisions/i)).toBeVisible()
    expect(within(detail).getByText(/veto held by the five/i)).toBeVisible()
    expect(
      within(detail).getByText(/most operational and most political/i)
    ).toBeVisible()
  })

  it("activates a room from the keyboard", async () => {
    const user = userEvent.setup()

    renderCommandCenter()

    const internationalCourt = screen.getByRole("button", {
      name: /International Court/i,
    })

    internationalCourt.focus()
    expect(internationalCourt).toHaveFocus()

    await user.keyboard("{Enter}")

    expect(internationalCourt).toHaveAttribute("aria-pressed", "true")
    expect(
      screen.getByRole("region", { name: "International Court details" })
    ).toBeVisible()
  })

  it("falls back to the default room when navigation state contains an invalid panel id", () => {
    renderCommandCenter({
      activePanelByChapter: {
        "un-command-center": "not-real",
      },
    })

    expect(
      screen.getByRole("button", { name: /General Assembly/i })
    ).toHaveAttribute("aria-pressed", "true")
    expect(
      screen.getByRole("region", { name: "General Assembly details" })
    ).toBeVisible()
  })
})
