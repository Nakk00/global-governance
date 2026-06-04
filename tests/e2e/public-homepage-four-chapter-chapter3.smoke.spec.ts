import { expect, test } from "@playwright/test"

import {
  expectNoHorizontalOverflow,
  waitForDocumentFonts,
  waitForScrollIdle,
} from "../playwright/home-page-helpers"

const visibleChapters = [
  "Hero Narrative Frame",
  "Global Governance Overview",
  "The System Under Pressure",
  "West Philippine Sea Case File",
]

test("@smoke four-chapter Chapter 3 flow renders and redirects legacy hashes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1024 })
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await waitForDocumentFonts(page)

  const primaryNav = page.getByRole("navigation", { name: "Primary" })

  await expect(primaryNav.getByRole("link")).toHaveCount(4)
  for (const chapter of visibleChapters) {
    await expect(primaryNav.getByRole("link", { name: chapter })).toBeVisible()
  }

  await primaryNav
    .getByRole("link", { name: "The System Under Pressure" })
    .click()
  await expect(page).toHaveURL(/#un-command-center$/)

  const chapter3 = page.getByRole("region", {
    name: "The System Under Pressure",
  })
  await expect(chapter3).toBeFocused()
  await expect(
    chapter3.getByText(
      "Institutions organize cooperation. Politics tests the limits."
    )
  ).toBeVisible()
  await expect(
    chapter3.getByRole("region", { name: "General Assembly details" })
  ).toBeVisible()

  await chapter3.getByRole("button", { name: /Security Council/i }).click()
  const selectedRoom = chapter3.getByRole("region", {
    name: "Security Council details",
  })

  await expect(selectedRoom).toBeVisible()
  await expect(
    selectedRoom.getByText("Selected room: Security Council")
  ).toBeVisible()
  for (const label of [
    "Role",
    "Scope of power",
    "Limitation",
    "Why it matters",
  ]) {
    await expect(selectedRoom.getByText(label, { exact: true })).toBeVisible()
  }

  const diagram = chapter3.getByRole("region", {
    name: /pressure flow/i,
  })
  for (const label of ["Rules", "Institutions", "State Choices", "Outcomes"]) {
    await expect(diagram.getByText(label, { exact: true })).toBeVisible()
  }

  for (const label of [
    "Consent",
    "Veto",
    "Political Will",
    "Leverage",
    "Uneven Enforcement",
  ]) {
    await expect(chapter3.getByText(label, { exact: true })).toBeVisible()
  }

  await expectNoHorizontalOverflow(page)

  await page.goto("/#governance-limits", { waitUntil: "domcontentloaded" })
  await waitForScrollIdle(page)
  await expect(page).toHaveURL(/#un-command-center$/)
  await expect(chapter3).toBeFocused()
  await expectNoHorizontalOverflow(page)
})

test("@smoke four-chapter Chapter 3 mobile navigation stays contained", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#un-command-center", { waitUntil: "domcontentloaded" })
  await waitForDocumentFonts(page)
  await waitForScrollIdle(page)

  const chapter3 = page.getByRole("region", {
    name: "The System Under Pressure",
  })
  await expect(chapter3).toBeFocused()
  await expect(chapter3.getByText("Consent", { exact: true })).toBeVisible()

  await page.getByRole("button", { name: "Open navigation" }).click()
  const mobileNav = page.getByRole("navigation", { name: "Mobile chapters" })

  await expect(mobileNav.getByRole("link")).toHaveCount(4)
  for (const chapter of visibleChapters) {
    await expect(mobileNav.getByRole("link", { name: chapter })).toBeVisible()
  }
  await expect(
    mobileNav.getByText(/Current chapter:\s*The System Under Pressure/)
  ).toBeVisible()

  await expectNoHorizontalOverflow(page)
})
