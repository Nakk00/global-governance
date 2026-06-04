import { expect, test } from "@playwright/test"

import {
  expectContainedWithinViewport,
  expectNoHorizontalOverflow,
  expectTouchTarget,
} from "../playwright/home-page-helpers"

test("@smoke @layout source-aware chatbox opens as a contained right-side overlay", async ({
  page,
}) => {
  const viewport = { width: 1536, height: 1024 }

  await page.setViewportSize(viewport)
  await page.goto("/#hero-narrative-frame", { waitUntil: "domcontentloaded" })

  const trigger = page.getByRole("button", {
    name: "Open source-aware chat",
  })

  await expect(trigger).toBeVisible()
  await expectTouchTarget(trigger)
  await trigger.click()

  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })
  const input = panel.getByRole("textbox", { name: "Course question" })

  await expect(panel).toBeVisible()
  await expect(panel.getByText("Governance Guide")).toBeVisible()
  await expect(panel.getByText("Source-aware • Online")).toBeVisible()
  await expect(panel.getByText("Grounded in course sources")).toBeVisible()
  await expect(panel.getByText("Cite-verified")).toBeVisible()
  await expect(input).toBeFocused()
  await expectContainedWithinViewport(panel, viewport.width)
  await expectNoHorizontalOverflow(page)

  const panelBox = await panel.boundingBox()

  expect(panelBox).not.toBeNull()
  expect(panelBox!.x).toBeGreaterThan(viewport.width / 2)

  await page.keyboard.press("Escape")
  await expect(panel).toBeHidden()
  await expect(trigger).toBeFocused()
})
