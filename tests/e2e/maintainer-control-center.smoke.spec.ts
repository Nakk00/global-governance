import { expect, type Page, test } from "@playwright/test"

import {
  adminIdentity,
  maintainerSession,
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

async function mockMaintainerControlCenter(page: Page) {
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
}

test("@smoke maintainer control center opens audit and trust sections", async ({
  page,
}) => {
  await seedSession(page)
  await mockMaintainerControlCenter(page)

  await page.goto("/maintainer")

  await expect(
    page.getByRole("region", { name: "Readiness Overview" })
  ).toBeVisible()
  await expect(
    page.getByText(
      "Private maintainer console for project readiness and trust monitoring."
    )
  ).toBeVisible()
  await expect(
    page.getByRole("img", { name: "Global Governance" })
  ).toBeVisible()

  await page.getByRole("button", { name: "Audit Trail", exact: true }).click()
  await expect(page).toHaveURL(/\/maintainer\/audit-trail$/)
  await expect(page.getByRole("heading", { name: "Audit Trail" })).toBeVisible()
  await expect(
    page.getByText("Lifecycle action recorded for stewarded source.")
  ).toBeVisible()

  await page.getByRole("button", { name: "Chatbot Trust", exact: true }).click()
  await expect(page).toHaveURL(/\/maintainer\/chatbot-trust$/)
  await expect(
    page.getByRole("heading", { name: "Chatbot Trust" })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Grounded sources" })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Validation runs" })
  ).toBeVisible()
})
