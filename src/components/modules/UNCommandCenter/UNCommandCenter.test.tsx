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
  it("renders the merged system pressure chapter surface", () => {
    renderWithNavigation(
      <UNCommandCenter content={unCommandCenter} shell={unCommandCenterShell} />
    )

    expect(
      screen.getByRole("heading", { name: "The System Under Pressure" })
    ).toBeVisible()
    const diagram = screen.getByRole("region", {
      name: /pressure diagram/i,
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

    await user.click(securityCouncil)

    expect(securityCouncil).toHaveAttribute("aria-pressed", "true")
    expect(defaultOrgan).toHaveAttribute("aria-pressed", "false")
    expect(securityCouncil).toHaveTextContent(/focus on peace and security/i)
    expect(
      screen.getByText(/Security Council: Assesses threats/i)
    ).toBeInTheDocument()
  })

  it("keeps selected room detail inside the composed chapter surface", () => {
    renderWithNavigation(
      <UNCommandCenter content={unCommandCenter} shell={unCommandCenterShell} />
    )

    expect(screen.getByText("How the system rooms work together")).toBeVisible()
    expect(
      screen.getByRole("link", {
        name: "Continue to West Philippine Sea Case File",
      })
    ).toBeVisible()
  })
})
