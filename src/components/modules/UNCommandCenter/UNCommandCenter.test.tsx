import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  unCommandCenter,
  unCommandCenterShell,
} from "@/data/sections/un-command-center"

import { renderWithNavigation } from "../../../../tests/support/render-with-navigation"

import { UNCommandCenter } from "./UNCommandCenter"

describe("UNCommandCenter", () => {
  it("updates the organ explorer locally when a different organ is selected", async () => {
    const user = userEvent.setup()

    renderWithNavigation(
      <UNCommandCenter content={unCommandCenter} shell={unCommandCenterShell} />
    )

    const defaultOrgan = screen.getByRole("button", {
      name: /General Assembly/i,
    })
    const securityCouncil = screen.getByRole("button", {
      name: /Security Council/i,
    })

    expect(defaultOrgan).toHaveAttribute("aria-pressed", "true")
    expect(
      screen.getByRole("region", { name: "General Assembly details" })
    ).toBeVisible()

    await user.click(securityCouncil)

    const details = screen.getByRole("region", {
      name: "Security Council details",
    })

    expect(securityCouncil).toHaveAttribute("aria-pressed", "true")
    expect(defaultOrgan).toHaveAttribute("aria-pressed", "false")
    expect(details).toBeVisible()
    expect(
      within(details).getByText(
        /primary responsibility for peace and security/i
      )
    ).toBeVisible()
  })

  it("reveals the local disclosure content without relying on browser routing", async () => {
    const user = userEvent.setup()

    renderWithNavigation(
      <UNCommandCenter content={unCommandCenter} shell={unCommandCenterShell} />
    )

    const trigger = screen.getByRole("button", { name: "Inside this section" })

    expect(
      screen.queryByText(
        /The General Assembly gives every member state a forum/i
      )
    ).not.toBeInTheDocument()

    await user.click(trigger)

    expect(
      screen.getByText(/The General Assembly gives every member state a forum/i)
    ).toBeVisible()
  })
})
