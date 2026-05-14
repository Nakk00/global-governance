import { expect, type Page, test } from "@playwright/test"

import {
  adminIdentity,
  maintainerSession,
  sourceDetail,
  stewardshipDashboard,
} from "../support/msw/fixtures"

async function seedSession(page: Page) {
  await page.addInitScript((storedSession) => {
    window.localStorage.setItem(
      "global-governance-maintainer-session",
      JSON.stringify(storedSession)
    )
  }, maintainerSession)
}

async function mockMaintainerReadiness(page: Page) {
  await page.route("**/api/admin/me", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: adminIdentity,
        error: null,
        meta: {},
      }),
    })
  })
  await page.route("**/api/admin/sources", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: stewardshipDashboard,
        error: null,
        meta: {},
      }),
    })
  })
  await page.route(
    "**/api/admin/sources/gg-src-un-charter-institutions",
    async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: sourceDetail,
          error: null,
          meta: {},
        }),
      })
    }
  )
}

test("@smoke maintainer readiness overview drills into source detail first", async ({
  page,
}) => {
  await seedSession(page)
  await mockMaintainerReadiness(page)

  await page.goto("/maintainer")
  await expect(
    page.getByRole("region", { name: "Readiness Overview" })
  ).toBeVisible()
  await expect(page.getByRole("heading", { name: "Source Management" })).toBeVisible()

  await page.getByRole("button", { name: "View full details" }).click()

  await expect(page.locator("#source-detail-page-heading")).toHaveText(
    "Charter of the United Nations"
  )
  await expect(page.getByText("Current readiness blocker")).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Open validation workbench" })
  ).toBeVisible()
})
