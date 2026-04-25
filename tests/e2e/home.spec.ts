import { expect, test } from "@playwright/test"

const chapterNames = [
  "Hero Narrative Frame",
  "Global governance overview",
  "UN Command Center",
  "Governance limits and enforcement",
  "West Philippine Sea dossier",
  "Conclusion and references",
]

test("home page opens the journey and continues in-page", async ({ page }) => {
  await page.goto("/")

  const continueLink = page.getByRole("link", { name: "Begin the journey" })
  const journeyStart = page.getByRole("region", {
    name: "Journey start",
  })

  await expect(
    page.getByRole("heading", { name: "Global Governance", exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText(/step into an interactive guide/i),
  ).toBeVisible()
  await expect(continueLink).toBeVisible()

  await continueLink.focus()
  await expect(continueLink).toBeFocused()
  await page.keyboard.press("Enter")

  await expect(page).toHaveURL(/#journey-start$/)
  await expect(journeyStart).toBeVisible()
  await expect(journeyStart).toBeFocused()
})

test("desktop navigation jumps between chapter sections and restores history", async ({
  page,
}) => {
  await page.goto("/")

  const topNav = page.getByRole("navigation", { name: "Primary" })
  const rail = page.getByRole("navigation", { name: "Section progress" })
  const dossier = page.getByRole("region", {
    name: "West Philippine Sea dossier",
  })

  for (const chapterName of chapterNames) {
    await expect(
      topNav.getByRole("link", { name: chapterName }),
    ).toBeVisible()
    await expect(rail.getByRole("link", { name: chapterName })).toBeVisible()
  }

  await topNav.getByRole("link", { name: "UN Command Center" }).click()
  await expect(page).toHaveURL(/#un-command-center$/)
  await expect(
    page.getByRole("region", { name: "UN Command Center" }),
  ).toBeFocused()
  await expect(
    topNav.getByRole("link", { name: "UN Command Center" }),
  ).toHaveAttribute("aria-current", "location")
  await expect(page.getByText("Current chapter: UN Command Center")).toBeVisible()

  await rail.getByRole("link", { name: "West Philippine Sea dossier" }).click()
  await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
  await expect(dossier).toBeFocused()
  await expect(
    rail.getByRole("link", { name: "West Philippine Sea dossier" }),
  ).toHaveAttribute("aria-current", "location")

  await page.goBack()
  await expect(page).toHaveURL(/#un-command-center$/)
  await expect(
    page.getByRole("region", { name: "UN Command Center" }),
  ).toBeFocused()

  await page.reload()
  await expect(page).toHaveURL(/#un-command-center$/)
  await expect(
    page.getByRole("region", { name: "UN Command Center" }),
  ).toBeFocused()
})

test("hash entry falls back predictably and keyboard users can activate navigation", async ({
  page,
}) => {
  await page.goto("/#governance-limits")

  const governanceLimits = page.getByRole("region", {
    name: "Governance limits and enforcement",
  })

  await expect(governanceLimits).toBeVisible()
  await expect(governanceLimits).toBeFocused()
  await expect(
    page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Governance limits and enforcement" }),
  ).toHaveAttribute("aria-current", "location")

  await page.goto("/#not-a-real-section")
  await expect(page).toHaveURL(/#hero-narrative-frame$/)
  await expect(
    page.getByRole("region", { name: "Global Governance", exact: true }),
  ).toBeFocused()

  const keyboardTarget = page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Global governance overview" })

  await keyboardTarget.focus()
  await expect(keyboardTarget).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#global-governance-overview$/)
  await expect(
    page.getByRole("region", { name: "Global governance overview" }),
  ).toBeFocused()
})

test("mobile navigation is touch-friendly, dismissible, and resets at desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 740 })
  await page.goto("/")

  const menuButton = page.getByRole("button", { name: "Open navigation" })
  await expect(menuButton).toBeVisible()

  const buttonBox = await menuButton.boundingBox()
  expect(buttonBox).not.toBeNull()
  expect(buttonBox!.width).toBeGreaterThanOrEqual(44)
  expect(buttonBox!.height).toBeGreaterThanOrEqual(44)

  await menuButton.click()

  const mobileNav = page.getByRole("navigation", { name: "Mobile chapters" })
  await expect(mobileNav).toBeVisible()

  const mobileTarget = mobileNav.getByRole("link", {
    name: "Conclusion and references",
  })
  const mobileTargetBox = await mobileTarget.boundingBox()
  expect(mobileTargetBox).not.toBeNull()
  expect(mobileTargetBox!.height).toBeGreaterThanOrEqual(44)

  await mobileTarget.click()
  await expect(page).toHaveURL(/#conclusion-references$/)
  await expect(mobileNav).toBeHidden()
  await expect(
    page.getByRole("region", { name: "Conclusion and references" }),
  ).toBeFocused()

  await menuButton.click()
  await expect(mobileNav).toBeVisible()
  await page.getByRole("button", { name: "Close navigation" }).click()
  await expect(mobileNav).toBeHidden()

  await menuButton.click()
  await expect(mobileNav).toBeVisible()
  await page.setViewportSize({ width: 1024, height: 740 })
  await expect(mobileNav).toBeHidden()
  await expect(
    page.getByRole("navigation", { name: "Primary" }),
  ).toBeVisible()
})

test("home page respects reduced motion and keeps hero responsive", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })

  for (const width of [360, 480, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 820 })
    await page.goto("/")

    const heading = page.getByRole("heading", {
      name: "Global Governance",
      exact: true,
    })
    const continueLink = page.getByRole("link", { name: "Begin the journey" })

    await expect(heading).toBeVisible()
    await expect(continueLink).toBeVisible()
    await expect(
      page.getByText(/step into an interactive guide/i),
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toBeVisible({ visible: width < 768 })

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(hasHorizontalOverflow).toBe(false)

    for (const locator of [heading, continueLink]) {
      const box = await locator.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width)
    }
  }

  const continueLink = page.getByRole("link", { name: "Begin the journey" })
  const journeyStart = page.getByRole("region", {
    name: "Journey start",
  })

  await continueLink.focus()
  await page.keyboard.press("Enter")

  await expect(page).toHaveURL(/#journey-start$/)
  await expect(journeyStart).toBeFocused()
})
