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

async function mockMaintainerShell(page: Page) {
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

test("@smoke maintainer direct load resolves the private dashboard without public navigation", async ({
  page,
}) => {
  await seedSession(page)
  await mockMaintainerShell(page)

  await page.goto("/maintainer")
  await expect(
    page.getByRole("heading", { name: "Maintainer dashboard" })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Maintainer overview" })
  ).toBeVisible()
  await expect(
    page.getByText("admin@example.test", { exact: true })
  ).toBeVisible()
  await expect(page.getByText("Stewarded sources")).toBeVisible()
  await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(0)
})

test("@smoke maintainer-like public paths are not captured by the private route", async ({
  page,
}) => {
  await page.goto("/maintainer-old")

  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Maintainer Sign In" })
  ).toHaveCount(0)
})

test("@smoke maintainer route keeps auth-gate fallbacks visible", async ({
  page,
}) => {
  await page.goto("/maintainer")
  await expect(
    page.getByRole("heading", { name: "Maintainer Sign In" })
  ).toBeVisible()
  await expect(page.getByText("Global Governance")).toBeVisible()
  await expect(page.getByText("Authorized maintainers only")).toBeVisible()
  await expect(page.getByText("Forgot password?")).toBeVisible()
  await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(0)

  const expiredPage = await page.context().newPage()
  await seedSession(expiredPage)
  await expiredPage.route("**/api/admin/me", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        data: null,
        error: {
          code: "admin_auth_invalid",
          message: "Use a valid Supabase Auth bearer token.",
          status: 401,
        },
        meta: {},
      }),
    })
  })
  await expiredPage.goto("/maintainer")
  await expect(
    expiredPage.getByRole("heading", { name: "Session expired" })
  ).toBeVisible()
  await expiredPage.close()
})
