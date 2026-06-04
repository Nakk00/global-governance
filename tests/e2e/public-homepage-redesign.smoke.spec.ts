import { expect, test } from "@playwright/test"

import {
  expectNoHorizontalOverflow,
  expectTouchTarget,
} from "../playwright/home-page-helpers"

test("@smoke Chapter 1 and 2 render the approved public homepage redesign shell", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1536, height: 1024 })
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const hero = page.getByRole("region", { name: "Global Governance" })

  await expect(hero.getByText("The Global System")).toBeVisible()
  await expect(hero.getByText("States & Governments")).toBeVisible()
  await expect(hero.getByText("International Institutions")).toBeVisible()
  await expect(hero.getByText("System Pillars")).toBeVisible()
  await expect(hero.getByText("Current focus")).toBeVisible()

  const idleCue = page.getByRole("button", {
    name: "Continue to next chapter",
  })
  await expect(idleCue).toBeHidden()
  await expect(idleCue).toBeVisible({ timeout: 5000 })
  await expect(idleCue.getByText("Scroll to explore")).toBeVisible()
  await page.mouse.move(24, 24)
  await expect(idleCue).toBeVisible()
  await page.mouse.wheel(0, 200)
  await expect(idleCue).toBeHidden()

  await page.goto("/#global-governance-overview", {
    waitUntil: "domcontentloaded",
  })
  const overview = page.getByRole("region", {
    name: "Global Governance Overview",
  })
  const overviewDiagram = overview.locator(".overview-system-diagram")

  for (const label of [
    "States",
    "Institutions",
    "Norms",
    "Civil Society",
    "Markets & Technology",
    "Issue Areas",
  ]) {
    await expect(
      overviewDiagram.getByText(label, { exact: true })
    ).toBeVisible()
  }

  for (const lens of [
    "System Framing",
    "Actor Relationships",
    "Rules & Cooperation",
    "Power & Inequality",
  ]) {
    const lensControl = overview.getByRole("button", { name: lens })
    await expect(lensControl).toBeVisible()
    await expectTouchTarget(lensControl)
  }

  await overview.getByRole("button", { name: "Power & Inequality" }).click()
  await expect(overview.getByText("Active lens")).toBeVisible()
  await expect(overview.getByText("Power & Inequality").last()).toBeVisible()
  await expect(
    overview.getByRole("link", {
      name: "Continue to The System Under Pressure",
    })
  ).toBeVisible()
  await expectNoHorizontalOverflow(page)
})
