import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  westPhilippineSeaDossier,
  wpsDossierShell,
} from "@/data/sections/west-philippine-sea-dossier"

import { renderWithNavigation } from "../../../../tests/support/render-with-navigation"

import { WpsDossier } from "./WpsDossier"

function renderDossier() {
  renderWithNavigation(
    <WpsDossier content={westPhilippineSeaDossier} shell={wpsDossierShell} />
  )
}

describe("WpsDossier", () => {
  it("renders mode controls and syncs the active investigation state", async () => {
    const user = userEvent.setup()

    renderDossier()

    const evidenceMode = screen.getByRole("button", {
      name: /Open the evidence file/i,
    })
    const lawPowerMode = screen.getByRole("button", {
      name: /Trace law and power/i,
    })

    expect(evidenceMode).toHaveAttribute("aria-pressed", "true")
    expect(lawPowerMode).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByText(/claims, rulings, state behavior/i)).toBeVisible()

    await user.click(lawPowerMode)

    expect(evidenceMode).toHaveAttribute("aria-pressed", "false")
    expect(lawPowerMode).toHaveAttribute("aria-pressed", "true")
    expect(
      screen.getByText(/legal clarity can shape claims and diplomacy/i)
    ).toBeVisible()
    expect(
      screen.getAllByText(/Legal clarity enters the record/i).length
    ).toBeGreaterThan(0)
  })

  it("updates timeline details when a milestone is selected", async () => {
    const user = userEvent.setup()

    renderDossier()

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
    expect(screen.getByText(/Spratly Islands context selected/i)).toBeVisible()
  })

  it("renders accessible map hotspots and updates the selected tooltip", async () => {
    const user = userEvent.setup()

    renderDossier()

    const scarboroughHotspot = screen.getByRole("button", {
      name: "Scarborough Shoal",
    })
    const spratlyHotspot = screen.getByRole("button", {
      name: "Spratly Islands",
    })
    const connector = document.querySelector(".wps-case-file__sync-line")

    expect(scarboroughHotspot).toHaveAttribute("aria-pressed", "true")
    expect(spratlyHotspot).toHaveAttribute("data-wps-map-hotspot")
    expect(connector).not.toBeNull()
    expect(connector).toHaveAttribute("aria-hidden", "true")
    expect(
      screen.getByText(/A 2012 standoff turned contested access/i)
    ).toBeVisible()

    await user.click(spratlyHotspot)

    expect(spratlyHotspot).toHaveAttribute("aria-pressed", "true")
    expect(
      screen.getByText(/The Award clarified what maritime features can/i)
    ).toBeVisible()
    expect(
      screen.getByText(/Geography shapes the legal question/i)
    ).toBeVisible()
  })

  it("updates the evidence inspector tray from source-backed category cards", async () => {
    const user = userEvent.setup()

    renderDossier()

    const evidenceDetail = document.querySelector("[data-wps-evidence-surface]")

    expect(evidenceDetail).not.toBeNull()
    expect(
      within(evidenceDetail as HTMLElement).getByText(/Historical records/i)
    ).toBeVisible()
    expect(
      within(evidenceDetail as HTMLElement).getByText(
        /2 approved source records/i
      )
    ).toBeVisible()
    expect(
      within(evidenceDetail as HTMLElement).getByText(
        /United Nations Convention on the Law of the Sea/i
      )
    ).toBeVisible()
    expect(
      screen.getByRole("link", { name: /View source excerpts/i })
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
      within(evidenceDetail as HTMLElement).getByText(/Linked to 2016 ruling/i)
    ).toBeVisible()
    expect(
      within(evidenceDetail as HTMLElement).getByText(/PCA Case No\. 2013-19/i)
    ).toBeVisible()
    expect(
      screen.queryByText(/gg-src-south-china-sea-award/i)
    ).not.toBeInTheDocument()

    const sourceExcerptLink = screen.getByRole("link", {
      name: /View source excerpts/i,
    })
    sourceExcerptLink.focus()
    expect(sourceExcerptLink).toHaveFocus()
  })

  it("renders expandable ruling versus reality rows with citation chips", async () => {
    const user = userEvent.setup()

    renderDossier()

    const defaultRow = screen.getByRole("button", {
      name: /Nine-dash line has no legal basis/i,
    })
    const scarboroughRow = screen.getByRole("button", {
      name: /Features like Scarborough Shoal/i,
    })

    expect(defaultRow).toHaveAttribute("aria-expanded", "true")
    expect(screen.queryByRole("radio")).not.toBeInTheDocument()
    expect(screen.getByText(/PCA Award and UNCLOS record/i)).toBeVisible()
    expect(
      screen.getByText(/rejected broad historic-rights claims/i)
    ).toBeVisible()

    await user.click(scarboroughRow)

    expect(defaultRow).toHaveAttribute("aria-expanded", "false")
    expect(scarboroughRow).toHaveAttribute("aria-expanded", "true")
    expect(
      screen.getByText(/Scarborough Shoal shows why the case is more than map/i)
    ).toBeVisible()
    expect(screen.getByText(/Scarborough standoff record/i)).toBeVisible()
    const evidenceDetail = document.querySelector("[data-wps-evidence-surface]")

    expect(evidenceDetail).not.toBeNull()
    expect(
      within(evidenceDetail as HTMLElement).getByText(/Historical Records/i)
    ).toBeVisible()
    expect(screen.queryByText(/gg-src-/i)).not.toBeInTheDocument()
  })

  it("renders the final thesis with visible source trust cues", () => {
    renderDossier()

    expect(screen.getByRole("heading", { name: "Final Thesis" })).toBeVisible()
    expect(screen.getByText(/References & Sources/i)).toBeVisible()
    expect(screen.getByText(/Source Trust Guide/i)).toBeVisible()
    expect(
      screen.getAllByText(/PCA Case No\. 2013-19/i).length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByText(/United Nations Convention on the Law of the Sea/i)
        .length
    ).toBeGreaterThan(0)
    expect(screen.getByText(/ASEAN Regional Forum/i)).toBeVisible()
    expect(
      screen.queryByText(/Open the case as a continuation of the journey/i)
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/gg-src-/i)).not.toBeInTheDocument()
  })
})
