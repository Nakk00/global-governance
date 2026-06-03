import { screen, within } from "@testing-library/react"
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

    const timelineDetail = document.querySelector(
      '[data-wps-timeline-part="details"]'
    )

    expect(timelineDetail).not.toBeNull()
    expect(
      within(timelineDetail as HTMLElement).getByText(
        /A maritime standoff becomes a legal case/i
      )
    ).toBeVisible()

    await user.click(
      screen.getByRole("button", { name: /Final Award on 12 July 2016/i })
    )

    expect(
      within(timelineDetail as HTMLElement).getByText(
        /Legal clarity enters the record/i
      )
    ).toBeVisible()
    expect(
      within(timelineDetail as HTMLElement).getByText(
        /rejects broad historic-rights claims/i
      )
    ).toBeVisible()
  })

  it("renders the approved ruling versus reality matrix without extra comparison controls", () => {
    renderWithNavigation(
      <WpsDossier content={westPhilippineSeaDossier} shell={wpsDossierShell} />
    )

    expect(screen.getByText(/Nine-dash line has no legal basis/i)).toBeVisible()
    expect(screen.getByText(/The line continues to be asserted/i)).toBeVisible()
    expect(screen.queryByRole("radio")).not.toBeInTheDocument()
    expect(screen.queryByText(/Enforcement gap/i)).not.toBeInTheDocument()
  })

  it("updates the evidence detail from source-backed category cards", async () => {
    const user = userEvent.setup()

    renderWithNavigation(
      <WpsDossier content={westPhilippineSeaDossier} shell={wpsDossierShell} />
    )

    const evidenceDetail = document.querySelector("[data-wps-evidence-surface]")

    expect(evidenceDetail).not.toBeNull()
    expect(
      within(evidenceDetail as HTMLElement).getByText(/Historical records/i)
    ).toBeVisible()
    expect(
      screen.getByRole("link", { name: /Explore all evidence/i })
    ).toBeVisible()

    await user.click(
      screen.getByRole("button", {
        name: /Inspect evidence for Legal Findings/i,
      })
    )

    expect(
      within(evidenceDetail as HTMLElement).getByText(/Tribunal award/i)
    ).toBeVisible()
    expect(
      screen.queryByText(/gg-src-south-china-sea-award/i)
    ).not.toBeInTheDocument()
  })

  it("renders the final thesis with visible source trust cues", () => {
    renderWithNavigation(
      <WpsDossier content={westPhilippineSeaDossier} shell={wpsDossierShell} />
    )

    expect(screen.getByRole("heading", { name: "Final Thesis" })).toBeVisible()
    expect(screen.getByText(/References & Sources/i)).toBeVisible()
    expect(screen.getByText(/Source Trust Guide/i)).toBeVisible()
    expect(screen.getByText(/PCA Case No\. 2013-19/i)).toBeVisible()
    expect(
      screen.getByText(/United Nations Convention on the Law of the Sea/i)
    ).toBeVisible()
    expect(screen.getByText(/ASEAN Regional Forum/i)).toBeVisible()
    expect(
      screen.queryByText(/Open the case as a continuation of the journey/i)
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/gg-src-/i)).not.toBeInTheDocument()
  })
})
