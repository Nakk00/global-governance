import { expect, test } from "@playwright/test"

test("home page loads", async ({ page }) => {
  await page.goto("/")

  await expect(
    page.getByRole("heading", { name: "Foundation ready" }),
  ).toBeVisible()
  await expect(page.getByText("Global Governance")).toBeVisible()
})
