import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  westPhilippineSeaDossier,
  wpsDossierShell,
} from "@/data/sections/west-philippine-sea-dossier"

import { renderWithNavigation } from "../../../../tests/support/render-with-navigation"

import { WpsDossier } from "./WpsDossier"

describe("WpsDossier", () => {
  it("updates timeline details when a milestone is selected", async () => {
    const user = userEvent.setup()

    renderWithNavigation(
      <WpsDossier content={westPhilippineSeaDossier} shell={wpsDossierShell} />
    )

    expect(screen.getByText(/2012: Scarborough Shoal incident/i)).toBeVisible()

    await user.click(screen.getByRole("button", { name: /Tribunal ruling/i }))

    expect(screen.getByText(/2016: Tribunal ruling/i)).toBeVisible()
    expect(
      screen.getByText(/rejected broad historic-rights claims/i)
    ).toBeVisible()
  })

  it("supports keyboard-driven comparison changes without a full browser journey", async () => {
    const user = userEvent.setup()

    renderWithNavigation(
      <WpsDossier content={westPhilippineSeaDossier} shell={wpsDossierShell} />
    )

    const enforcementGap = screen.getByRole("radio", {
      name: /Enforcement gap/i,
    })

    enforcementGap.focus()
    await user.keyboard("{ArrowDown}")

    const politicalReality = screen.getByRole("radio", {
      name: /Political reality/i,
    })

    expect(politicalReality).toHaveFocus()
    expect(politicalReality).toHaveAttribute("aria-checked", "true")
    expect(
      screen.getByText(/states still calculate interests, capacity/i)
    ).toBeVisible()
  })

  it("opens and closes the evidence surface locally", async () => {
    const user = userEvent.setup()

    renderWithNavigation(
      <WpsDossier content={westPhilippineSeaDossier} shell={wpsDossierShell} />
    )

    const trigger = screen.getByRole("button", {
      name: /Inspect evidence for Scarborough Shoal incident/i,
    })

    await user.click(trigger)

    expect(
      screen.getByRole("region", {
        name: "Evidence for Scarborough Shoal incident",
      })
    ).toBeVisible()

    await user.click(
      screen.getByRole("button", {
        name: "Close evidence for Scarborough Shoal incident",
      })
    )

    expect(
      screen.queryByRole("region", {
        name: "Evidence for Scarborough Shoal incident",
      })
    ).not.toBeInTheDocument()
  })
})
