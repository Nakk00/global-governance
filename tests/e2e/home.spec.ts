import { expect, type Locator, type Page, test } from "@playwright/test"

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
const storyWidths = [360, 768, 1440]

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

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }))

  expect(overflow.body).toBeLessThanOrEqual(overflow.viewport)
  expect(overflow.document).toBeLessThanOrEqual(overflow.viewport)
}

async function expectReadableBodyText(locator: Locator) {
  const fontSize = await locator.evaluate((element) =>
    Number.parseFloat(window.getComputedStyle(element).fontSize)
  )

  expect(fontSize).toBeGreaterThanOrEqual(16)
}

async function expectNoHorizontalOverflowAtTextScale(
  page: Page,
  fontSizePercent: number
) {
  await page.addStyleTag({
    content: `html { font-size: ${fontSizePercent}% !important; }`,
  })

  await expectNoHorizontalOverflow(page)
}

async function expectTouchTarget(locator: Locator) {
  const box = await locator.boundingBox()

  expect(box).not.toBeNull()
  expect(box!.width).toBeGreaterThanOrEqual(44)
  expect(box!.height).toBeGreaterThanOrEqual(44)
}

async function expectVisibleFocus(locator: Locator) {
  await expect(locator).toBeFocused()

  const focusStyle = await locator.evaluate((element) => {
    const style = window.getComputedStyle(element)

    return {
      boxShadow: style.boxShadow,
      outlineColor: style.outlineColor,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
    }
  })

  expect(
    focusStyle.outlineStyle !== "none" ||
      focusStyle.outlineWidth !== "0px" ||
      focusStyle.boxShadow !== "none"
  ).toBe(true)
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

test("UN command center introduces an explorable shell with keyboard entry", async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion })

    for (const width of storyWidths) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto("/#un-command-center")

      const commandCenter = page.getByRole("region", {
        name: "UN Command Center",
      })
      const summary = commandCenter.getByRole("region", {
        name: "Command Center summary",
      })
      const exploreControl = commandCenter.getByRole("button", {
        name: "Explore the Command Center",
      })
      const whyControl = commandCenter.getByRole("button", {
        name: "Why the UN matters",
      })
      const shellMapControl = commandCenter.getByRole("button", {
        name: "Inside this section",
      })

      await expect(commandCenter).toBeVisible()
      await expect(commandCenter).toBeFocused()
      await expect(
        commandCenter.getByRole("heading", {
          name: "The UN gives global politics a shared address",
        })
      ).toBeVisible()
      await expect(
        commandCenter.getByText(/institutional system within global governance/i)
      ).toBeVisible()
      await expect(summary).toBeVisible()
      await expect(exploreControl).toBeVisible()
      await expect(whyControl).toBeVisible()
      await expect(shellMapControl).toBeVisible()
      await expectTouchTarget(exploreControl)
      await expectTouchTarget(whyControl)
      await expectTouchTarget(shellMapControl)

      for (const control of [exploreControl, whyControl, shellMapControl]) {
        await control.focus()
        await expectVisibleFocus(control)
      }

      await expectNoHorizontalOverflow(page)
      if (width >= 768) {
        await expect(
          page
            .getByRole("navigation", { name: "Primary" })
            .getByRole("link", { name: "UN Command Center" })
        ).toHaveAttribute("aria-current", "location")
        await expect(
          page.getByText("Current chapter: UN Command Center").first()
        ).toBeVisible()
      } else {
        await page.getByRole("button", { name: "Open navigation" }).click()
        const mobileNav = page.getByRole("navigation", { name: "Mobile chapters" })

        await expect(
          mobileNav.getByRole("link", { name: "UN Command Center" })
        ).toHaveAttribute("aria-current", "location")
        await expect(
          mobileNav.getByText("Current chapter: UN Command Center")
        ).toBeVisible()
      }
    }
  }
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

test("core journey has no horizontal overflow in default and reduced motion modes", async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion })

    for (const width of storyWidths) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto("/")

      await expectNoHorizontalOverflow(page)
      await expectReadableBodyText(
        page.getByRole("region", { name: "Journey start" }).locator("p").nth(2)
      )

      const menuButton = page.getByRole("button", { name: "Open navigation" })
      if (width < 768) {
        await menuButton.click()
        await expect(
          page.getByRole("navigation", { name: "Mobile chapters" })
        ).toBeVisible()
        await expectNoHorizontalOverflow(page)
      }

      const disclosure = page.getByRole("button", {
        name: /why rules still shape choices/i,
      })
      await disclosure.click()
      await expect(disclosure).toHaveAttribute("aria-expanded", "true")
      await expectNoHorizontalOverflow(page)

      const recapCue = page
        .getByRole("region", { name: "Global governance overview" })
        .getByRole("link", { name: "Continue to UN Command Center" })
      await recapCue.focus()
      await expectVisibleFocus(recapCue)
      await expectNoHorizontalOverflow(page)

      const returnControl =
        width >= 1280
          ? page.getByRole("button", {
              name: "Return to start from progress rail",
            })
          : width >= 768
            ? page.getByRole("button", { name: "Return to start" })
            : page.getByRole("button", { name: "Close navigation" })

      await expect(returnControl).toBeVisible()
      await expectTouchTarget(returnControl)
      await expectNoHorizontalOverflow(page)
    }
  }
})

test("keyboard path exposes the active layout controls with visible focus", async ({
  page,
}) => {
  for (const width of storyWidths) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/")

    const heroCta = page.getByRole("link", { name: "Begin the journey" })
    await heroCta.focus()
    await expectVisibleFocus(heroCta)

    if (width < 768) {
      const menuButton = page.getByRole("button", { name: "Open navigation" })
      await menuButton.focus()
      await expectVisibleFocus(menuButton)
      await page.keyboard.press("Enter")

      const mobileLink = page
        .getByRole("navigation", { name: "Mobile chapters" })
        .getByRole("link", { name: "UN Command Center" })
      await mobileLink.focus()
      await expectVisibleFocus(mobileLink)
    } else {
      const primaryLink = page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: "UN Command Center" })
      await primaryLink.focus()
      await expectVisibleFocus(primaryLink)
    }

    if (width >= 1280) {
      const railLink = page
        .getByRole("navigation", { name: "Section progress" })
        .getByRole("link", { name: "West Philippine Sea dossier" })
      await railLink.focus()
      await expectVisibleFocus(railLink)
    }

    const recapCue = page
      .getByRole("region", { name: "Global governance overview" })
      .getByRole("link", { name: "Continue to UN Command Center" })
    await recapCue.focus()
    await expectVisibleFocus(recapCue)

    const returnControls = page.getByRole("button", {
      name: /return to start/i,
    })
    if (width >= 768) {
      const returnControl =
        width >= 1280
          ? page.getByRole("button", {
              name: "Return to start from progress rail",
            })
          : returnControls.first()
      await returnControl.focus()
      await expectVisibleFocus(returnControl)
    }
  }
})

test("touch interactions keep controls usable without trapping reading flow", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 360, height: 740 },
  })
  const page = await context.newPage()

  await page.setViewportSize({ width: 360, height: 740 })
  await page.goto("/")

  const heroCta = page.getByRole("link", { name: "Begin the journey" })
  const menuButton = page.getByRole("button", { name: "Open navigation" })
  await expectTouchTarget(heroCta)
  await expectTouchTarget(menuButton)

  await page.tap('a[href="#journey-start"]')
  await expect(page).toHaveURL(/#journey-start$/)

  await menuButton.tap()
  const mobileNav = page.getByRole("navigation", { name: "Mobile chapters" })
  await expect(mobileNav).toBeVisible()

  for (const label of chapterNames) {
    await expectTouchTarget(mobileNav.getByRole("link", { name: label }))
  }

  const mobileNavBox = await mobileNav.boundingBox()
  const viewport = page.viewportSize()
  expect(mobileNavBox).not.toBeNull()
  expect(viewport).not.toBeNull()
  expect(mobileNavBox!.height).toBeLessThanOrEqual(viewport!.height - 44)

  await mobileNav
    .getByRole("link", { name: "Governance limits and enforcement" })
    .tap()
  await expect(mobileNav).toBeHidden()

  const disclosure = page.getByRole("button", {
    name: /why rules still shape choices/i,
  })
  await expectTouchTarget(disclosure)
  await disclosure.tap()
  await expect(disclosure).toHaveAttribute("aria-expanded", "true")

  const recapCue = page
    .getByRole("region", { name: "Governance limits and enforcement" })
    .getByRole("link", { name: "Continue to West Philippine Sea dossier" })
  await expectTouchTarget(recapCue)
  await expectNoHorizontalOverflow(page)

  await page.goto("/#un-command-center")
  await expectNoHorizontalOverflowAtTextScale(page, 125)

  await context.close()
})

test("semantic landmarks and headings describe the core journey", async ({
  page,
}) => {
  await page.goto("/")

  await expect(page.getByRole("main")).toHaveCount(1)
  await expect(page.getByRole("banner")).toHaveCount(1)
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible()

  await expect(
    page.getByRole("heading", { level: 1, name: "Global Governance" })
  ).toBeVisible()

  for (const sectionName of ["Journey start", ...narrativeSections]) {
    const region = page.getByRole("region", { name: sectionName })
    await expect(region).toBeVisible()
    await expect(region.getByRole("heading", { level: 2 })).toBeVisible()
  }
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

    await expectNoHorizontalOverflow(page)

    const motionStyle = await page.evaluate(() => {
      const htmlStyle = window.getComputedStyle(document.documentElement)
      const heroAside = document.querySelector(".orbital-hero-aside")

      return {
        heroAsideBeforeDisplay: heroAside
          ? window.getComputedStyle(heroAside, "::before").display
          : "none",
        scrollBehavior: htmlStyle.scrollBehavior,
      }
    })

    expect(motionStyle.scrollBehavior).toBe("auto")
    expect(motionStyle.heroAsideBeforeDisplay).toBe("none")

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

    await expectNoHorizontalOverflow(page)
  }
})
