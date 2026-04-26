import { expect, type Locator, test } from "@playwright/test"

const chapterNames = [
  "Hero Narrative Frame",
  "Global governance overview",
  "UN Command Center",
  "Governance limits and enforcement",
  "West Philippine Sea dossier",
  "Conclusion and references",
]

const narrativeSections = [
  "Global governance overview",
  "UN Command Center",
  "Governance limits and enforcement",
  "West Philippine Sea dossier",
  "Conclusion and references",
]

const recapCues = [
  {
    sectionId: "global-governance-overview",
    sectionName: "Global governance overview",
    cueName: "Continue to UN Command Center",
    hash: /#un-command-center$/,
    targetName: "UN Command Center",
  },
  {
    sectionId: "un-command-center",
    sectionName: "UN Command Center",
    cueName: "Continue to Governance limits and enforcement",
    hash: /#governance-limits$/,
    targetName: "Governance limits and enforcement",
  },
  {
    sectionId: "governance-limits",
    sectionName: "Governance limits and enforcement",
    cueName: "Continue to West Philippine Sea dossier",
    hash: /#west-philippine-sea-dossier$/,
    targetName: "West Philippine Sea dossier",
  },
  {
    sectionId: "west-philippine-sea-dossier",
    sectionName: "West Philippine Sea dossier",
    cueName: "Continue to Conclusion and references",
    hash: /#conclusion-references$/,
    targetName: "Conclusion and references",
  },
  {
    sectionId: "conclusion-references",
    sectionName: "Conclusion and references",
    cueName: "Return to Journey start",
    hash: /#journey-start$/,
    targetName: "Journey start",
  },
]

const responsiveWidths = [360, 480, 768, 1024, 1440]

async function visualStyleFor(locator: Locator) {
  return locator.evaluate((element) => {
    const style = window.getComputedStyle(element)

    return {
      backgroundColor: style.backgroundColor,
      backgroundImage: style.backgroundImage,
      borderColor: style.borderColor,
      borderRadius: style.borderRadius,
      boxShadow: style.boxShadow,
      color: style.color,
      outlineStyle: style.outlineStyle,
    }
  })
}

test("home page opens the journey and continues in-page", async ({ page }) => {
  await page.goto("/")

  const continueLink = page.getByRole("link", { name: "Begin the journey" })
  const journeyStart = page.getByRole("region", {
    name: "Journey start",
  })

  await expect(
    page.getByRole("heading", { name: "Global Governance", exact: true })
  ).toBeVisible()
  await expect(page.getByText(/step into an interactive guide/i)).toBeVisible()
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
    await expect(topNav.getByRole("link", { name: chapterName })).toBeVisible()
    await expect(rail.getByRole("link", { name: chapterName })).toBeVisible()
  }

  await topNav.getByRole("link", { name: "UN Command Center" }).click()
  await expect(page).toHaveURL(/#un-command-center$/)
  await expect(
    page.getByRole("region", { name: "UN Command Center" })
  ).toBeFocused()
  await expect(
    topNav.getByRole("link", { name: "UN Command Center" })
  ).toHaveAttribute("aria-current", "location")
  await expect(
    page.getByText("Current chapter: UN Command Center")
  ).toBeVisible()

  await rail.getByRole("link", { name: "West Philippine Sea dossier" }).click()
  await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
  await expect(dossier).toBeFocused()
  await expect(
    rail.getByRole("link", { name: "West Philippine Sea dossier" })
  ).toHaveAttribute("aria-current", "location")

  await page.goBack()
  await expect(page).toHaveURL(/#un-command-center$/)
  await expect(
    page.getByRole("region", { name: "UN Command Center" })
  ).toBeFocused()

  await page.reload()
  await expect(page).toHaveURL(/#un-command-center$/)
  await expect(
    page.getByRole("region", { name: "UN Command Center" })
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
      .getByRole("link", { name: "Governance limits and enforcement" })
  ).toHaveAttribute("aria-current", "location")

  await page.goto("/#not-a-real-section")
  await expect(page).toHaveURL(/#hero-narrative-frame$/)
  await expect(
    page.getByRole("region", { name: "Global Governance", exact: true })
  ).toBeFocused()

  const keyboardTarget = page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Global governance overview" })

  await keyboardTarget.focus()
  await expect(keyboardTarget).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#global-governance-overview$/)
  await expect(
    page.getByRole("region", { name: "Global governance overview" })
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
    page.getByRole("region", { name: "Conclusion and references" })
  ).toBeFocused()

  await menuButton.click()
  await expect(mobileNav).toBeVisible()
  await page.getByRole("button", { name: "Close navigation" }).click()
  await expect(mobileNav).toBeHidden()

  await menuButton.click()
  await expect(mobileNav).toBeVisible()
  await page.setViewportSize({ width: 1024, height: 740 })
  await expect(mobileNav).toBeHidden()
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible()
})

test("home page respects reduced motion and keeps hero responsive", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })

  for (const width of responsiveWidths) {
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
      page.getByText(/step into an interactive guide/i)
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: "Open navigation" })
    ).toBeVisible({ visible: width < 768 })

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
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

test("editorial system applies shared surfaces and action hierarchy", async ({
  page,
}) => {
  await page.goto("/")

  const hero = page.locator('[data-editorial-surface="hero"]')
  const transition = page
    .locator('[data-editorial-surface="transition"]')
    .first()
  const narrative = page.locator('[data-editorial-surface="narrative"]').first()
  const recap = narrative.locator('[data-editorial-surface="recap"]')
  const sourceLanding = page.locator('[data-editorial-surface="source"]')

  await expect(hero).toBeVisible()
  await expect(transition).toBeVisible()
  await expect(narrative).toBeVisible()
  await expect(recap).toBeVisible()
  await expect(sourceLanding).toBeVisible()

  await expect(hero.locator('[data-action-priority="primary"]')).toHaveCount(1)
  await expect(
    page
      .getByRole("navigation", { name: "Primary" })
      .locator('[data-action-priority="primary"]')
  ).toHaveCount(0)
  await expect(
    page
      .getByRole("navigation", { name: "Primary" })
      .locator('[data-action-priority="secondary"]')
  ).toHaveCount(chapterNames.length)
  await expect(recap.locator('[data-action-priority="primary"]')).toHaveCount(1)

  const heroAction = hero.locator('[data-action-priority="primary"]')
  const navAction = page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "UN Command Center" })
  const heroActionStyle = await visualStyleFor(heroAction)
  const navActionStyle = await visualStyleFor(navAction)

  expect(heroActionStyle.backgroundColor).not.toBe(
    navActionStyle.backgroundColor
  )
  expect(heroActionStyle.color).not.toBe(navActionStyle.color)

  const narrativeSummaryStyle = await visualStyleFor(
    page.locator("#global-governance-overview .editorial-summary")
  )
  const sourceSummaryStyle = await visualStyleFor(
    page.locator("#conclusion-references .editorial-summary")
  )
  const transitionStyle = await visualStyleFor(
    transition.locator("div").first()
  )

  expect(narrativeSummaryStyle.borderRadius).toBe(
    sourceSummaryStyle.borderRadius
  )
  expect(sourceSummaryStyle.backgroundImage).not.toBe(
    narrativeSummaryStyle.backgroundImage
  )
  expect(transitionStyle.backgroundImage).toContain("linear-gradient")
})

test("editorial system remains readable in light and dark mode", async ({
  page,
}) => {
  for (const theme of ["light", "dark"]) {
    await page.addInitScript((nextTheme) => {
      window.localStorage.setItem("theme", nextTheme)
    }, theme)
    await page.goto("/")

    await expect(page.locator("html")).toHaveClass(new RegExp(theme))

    const bodyStyle = await visualStyleFor(page.locator("body"))
    const sourceStyle = await visualStyleFor(
      page.locator("#conclusion-references .editorial-summary")
    )

    expect(bodyStyle.color).not.toBe(bodyStyle.backgroundColor)
    expect(sourceStyle.color).not.toBe(sourceStyle.backgroundColor)
  }
})

test("core narrative renders summary-first sections with local synthesis", async ({
  page,
}) => {
  await page.goto("/")

  for (const sectionName of narrativeSections) {
    const section = page.getByRole("region", { name: sectionName })
    await expect(section.getByText("Summary")).toBeVisible()
    await expect(section.getByText("Supporting detail")).toBeVisible()
    await expect(section.getByText("Key takeaway")).toBeVisible()
    await expect(section.getByText("Next step")).toBeVisible()

    const summaryBox = await section.getByText("Summary").boundingBox()
    const detailBox = await section.getByText("Supporting detail").boundingBox()
    const takeawayBox = await section.getByText("Key takeaway").boundingBox()
    const nextStepBox = await section.getByText("Next step").boundingBox()

    expect(summaryBox).not.toBeNull()
    expect(detailBox).not.toBeNull()
    expect(takeawayBox).not.toBeNull()
    expect(nextStepBox).not.toBeNull()
    expect(summaryBox!.y).toBeLessThan(detailBox!.y)
    expect(detailBox!.y).toBeLessThan(takeawayBox!.y)
    expect(takeawayBox!.y).toBeLessThan(nextStepBox!.y)
  }

  await expect(page.getByText(/without a world government/i)).toBeVisible()
  await expect(
    page.getByText(/global governance is not a world state/i)
  ).toBeVisible()
})

test("recap cues explain re-entry and use canonical next anchors", async ({
  page,
}) => {
  await page.goto("/")

  for (const cue of recapCues) {
    const section = page.getByRole("region", { name: cue.sectionName })
    await expect(section.getByText("Key takeaway")).toBeVisible()
    await expect(section.getByRole("link", { name: cue.cueName })).toBeVisible()
  }

  await page.goto("/#governance-limits")
  const directEntry = page.getByRole("region", {
    name: "Governance limits and enforcement",
  })
  await expect(
    directEntry.getByText(/rules need actors to interpret, defend, and apply/i)
  ).toBeVisible()
  await expect(
    directEntry.getByRole("link", {
      name: "Continue to West Philippine Sea dossier",
    })
  ).toBeVisible()

  for (const cue of recapCues) {
    await page.goto(`/#${cue.sectionId}`)
    const section = page.getByRole("region", { name: cue.sectionName })
    const nextCue = section.getByRole("link", { name: cue.cueName })
    await nextCue.focus()
    await expect(nextCue).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(cue.hash)
    await expect(
      page.getByRole("region", { name: cue.targetName })
    ).toBeFocused()

    if (cue.targetName === "Journey start") {
      await page.waitForTimeout(900)
      await expect(
        page.getByText("Current chapter: Journey start")
      ).toBeVisible()
    }
  }
})

test("dense narrative detail is keyboard-operable and preserves collapsed meaning", async ({
  page,
}) => {
  await page.goto("/#governance-limits")

  const governanceLimits = page.getByRole("region", {
    name: "Governance limits and enforcement",
  })
  const disclosure = governanceLimits.getByRole("button", {
    name: /why rules still shape choices/i,
  })

  await expect(
    governanceLimits.getByText(
      "Law and institutions can narrow the menu of acceptable behavior even when they cannot force a state by themselves."
    )
  ).toBeVisible()
  await expect(
    governanceLimits.getByText(/reputation, reciprocity, domestic pressure/i)
  ).toBeHidden()

  await disclosure.focus()
  await expect(disclosure).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(disclosure).toHaveAttribute("aria-expanded", "true")
  await expect(
    governanceLimits.getByText(/reputation, reciprocity, domestic pressure/i)
  ).toBeVisible()

  await page.keyboard.press("Space")
  await expect(disclosure).toHaveAttribute("aria-expanded", "false")
  await expect(
    governanceLimits.getByText(
      "Law and institutions can narrow the menu of acceptable behavior even when they cannot force a state by themselves."
    )
  ).toBeVisible()
})

test("narrative flow has transition beats without requiring an account", async ({
  page,
}) => {
  await page.goto("/")

  await expect(page.getByText("Next: Institutions")).toBeVisible()
  await expect(page.getByText("Next: Constraints")).toBeVisible()
  await expect(page.getByText("Next: Case file")).toBeVisible()
  await expect(page.getByText("No account needed")).toBeVisible()
  await expect(page.getByText(/create a profile/i)).toHaveCount(0)
  await expect(page.getByText(/sign in/i)).toHaveCount(0)
})

test("full narrative stays readable across responsive checkpoints", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })

  for (const width of responsiveWidths) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/")

    for (const sectionName of [
      ...narrativeSections,
      "Conclusion and references",
    ]) {
      await expect(
        page.getByRole("region", { name: sectionName })
      ).toBeVisible()
    }

    const disclosure = page.getByRole("button", {
      name: /why rules still shape choices/i,
    })
    await expect(disclosure).toBeVisible()
    await disclosure.focus()
    await page.keyboard.press("Enter")
    await expect(disclosure).toHaveAttribute("aria-expanded", "true")

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    )
    expect(hasHorizontalOverflow).toBe(false)
  }
})
