import { expect, test } from "@playwright/test"

import {
  expectContainedWithinViewport,
  expectNoHorizontalOverflow,
  expectTouchTarget,
  expectVisibleFocus,
  waitForDocumentFonts,
  waitForScrollIdle,
} from "../playwright/home-page-helpers"

const visibleChapters = [
  "Hero Narrative Frame",
  "Global Governance Overview",
  "The System Under Pressure",
  "West Philippine Sea Case File",
]

const removedStandaloneStops = [
  "Governance limits and enforcement",
  "Conclusion and references",
]

test("@smoke four-chapter Chapter 4 flow renders the live WPS contract", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1024 })
  await page.goto("/#west-philippine-sea-dossier", {
    waitUntil: "domcontentloaded",
  })
  await waitForDocumentFonts(page)
  await waitForScrollIdle(page)

  const primaryNav = page.getByRole("navigation", { name: "Primary" })
  const dossier = page.getByRole("region", {
    name: "West Philippine Sea Case File",
  })
  const timeline = dossier.getByRole("complementary", { name: "Timeline" })
  const timelineDetail = timeline.locator('[data-wps-timeline-part="details"]')
  const map = dossier.getByRole("region", { name: "Maritime Case Map" })
  const evidence = dossier.getByRole("region", { name: "Evidence" })
  const evidenceDetail = evidence.locator('[data-wps-evidence-surface=""]')
  const comparison = dossier.getByRole("region", {
    name: "Ruling vs Reality",
  })
  const evidenceMode = dossier.getByRole("button", {
    name: "Open the evidence file",
  })
  const lawPowerMode = dossier.getByRole("button", {
    name: "Trace law and power",
  })
  const finalAward = timeline.getByRole("button", {
    name: /2016.*Final Award/i,
  })
  const spratlyHotspot = map.getByRole("button", {
    name: "Spratly Islands",
  })
  const legalFindings = evidence.getByRole("button", {
    name: "Inspect evidence for Legal Findings (2016 Award)",
  })
  const statePractice = evidence.getByRole("button", {
    name: "Inspect evidence for State Practice & Conduct",
  })
  const scarboroughRow = comparison.getByRole("button", {
    name: /Features like Scarborough Shoal/i,
  })

  await expect(primaryNav.getByRole("link")).toHaveCount(4)
  for (const chapter of visibleChapters) {
    await expect(primaryNav.getByRole("link", { name: chapter })).toBeVisible()
  }
  for (const stop of removedStandaloneStops) {
    await expect(primaryNav.getByRole("link", { name: stop })).toHaveCount(0)
  }

  await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
  await expect(dossier).toBeVisible()
  await expect(dossier).toBeFocused()
  await expect(
    dossier.getByRole("heading", { name: "West Philippine Sea Case File" })
  ).toBeVisible()
  await expect(evidenceMode).toBeVisible()
  await expect(lawPowerMode).toBeVisible()
  await expect(evidenceMode).toHaveAttribute("aria-pressed", "true")
  await expectTouchTarget(evidenceMode)
  await lawPowerMode.click()
  await expect(lawPowerMode).toHaveAttribute("aria-pressed", "true")
  await expect(
    dossier.getByText(/legal clarity can shape claims/i)
  ).toBeVisible()
  await evidenceMode.click()
  await expect(evidenceMode).toHaveAttribute("aria-pressed", "true")

  for (const regionName of [
    "Maritime Case Map",
    "Evidence",
    "Ruling vs Reality",
    "References & Sources",
  ]) {
    await expect(
      dossier.getByRole("region", { name: regionName })
    ).toBeVisible()
  }
  await expect(
    dossier.getByRole("complementary", { name: "Timeline" })
  ).toBeVisible()
  await expect(
    dossier.getByRole("complementary", { name: "Source Trust Guide" })
  ).toBeVisible()
  await expect(
    dossier.getByRole("heading", { name: "Final Thesis" })
  ).toBeVisible()

  await expect(timelineDetail).toContainText(
    "A maritime standoff becomes a legal case."
  )
  await finalAward.focus()
  await expectVisibleFocus(finalAward)
  await finalAward.press("Enter")
  await expect(timelineDetail).toContainText("Legal clarity enters the record.")
  await expect(map.getByText("2016")).toBeVisible()
  await expect(map.getByText(/Spratly Islands context selected/i)).toBeVisible()

  await spratlyHotspot.focus()
  await expectVisibleFocus(spratlyHotspot)
  await spratlyHotspot.click()
  await expect(
    map.getByText(/The Award clarified what maritime features can/i)
  ).toBeVisible()
  await expectNoHorizontalOverflow(page)

  await expect(evidenceDetail).toContainText("Geo-Spatial Data")
  await legalFindings.focus()
  await expectVisibleFocus(legalFindings)
  await legalFindings.press("Enter")
  await expect(evidenceDetail).toContainText("Tribunal Award")
  await expect(evidenceDetail).toContainText(
    "Rulings on jurisdiction, maritime rights, and entitlements."
  )
  await expect(evidenceDetail).toContainText("PCA Case No. 2013-19")
  await expect(
    evidence.getByRole("link", { name: "View source excerpts" })
  ).toBeVisible()
  await statePractice.click()
  await expect(evidenceDetail).toContainText("Official Records")

  await expect(
    comparison.getByText("Nine-dash line has no legal basis.")
  ).toBeVisible()
  await expect(
    comparison.getByText("The line continues to be asserted.")
  ).toBeVisible()
  await expect(comparison.getByText(/Tribunal feature analysis/i)).toBeVisible()
  await scarboroughRow.click()
  await expect(
    comparison.getByText(
      /Scarborough Shoal shows why the case is more than map/i
    )
  ).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

test("@smoke four-chapter Chapter 4 protects conclusion redirect and mobile nav", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#conclusion-references", { waitUntil: "domcontentloaded" })
  await waitForDocumentFonts(page)
  await waitForScrollIdle(page)

  const dossier = page.getByRole("region", {
    name: "West Philippine Sea Case File",
  })

  await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
  await expect(dossier).toBeFocused()

  await page.getByRole("button", { name: "Open navigation" }).click()
  const mobileNav = page.getByRole("navigation", { name: "Mobile chapters" })

  await expect(mobileNav.getByRole("link")).toHaveCount(4)
  for (const chapter of visibleChapters) {
    const chapterLink = mobileNav.getByRole("link", { name: chapter })
    await expect(chapterLink).toBeVisible()
    await expectTouchTarget(chapterLink)
  }
  for (const stop of removedStandaloneStops) {
    await expect(mobileNav.getByRole("link", { name: stop })).toHaveCount(0)
  }
  await expect(
    mobileNav.getByText(/Current chapter:\s*West Philippine Sea Case File/)
  ).toBeVisible()
  await expectContainedWithinViewport(mobileNav, 390)
  await expectNoHorizontalOverflow(page)
})
