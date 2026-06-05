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
  const finalAward = timeline.getByRole("button", {
    name: /2016.*Final Award/i,
  })
  const legalFindings = evidence.getByRole("button", {
    name: "Inspect evidence for Legal Findings (2016 Award)",
  })
  const statePractice = evidence.getByRole("button", {
    name: "Inspect evidence for State Practice & Conduct",
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

  await expect(evidenceDetail).toContainText("Historical Records")
  await legalFindings.focus()
  await expectVisibleFocus(legalFindings)
  await legalFindings.press("Enter")
  await expect(evidenceDetail).toContainText("Tribunal Award")
  await expect(evidenceDetail).toContainText(
    "Rulings on jurisdiction, maritime rights, and entitlements."
  )
  await statePractice.click()
  await expect(evidenceDetail).toContainText("Official Records")

  await expect(
    comparison.getByText("Nine-dash line has no legal basis.")
  ).toBeVisible()
  await expect(
    comparison.getByText("The line continues to be asserted.")
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
