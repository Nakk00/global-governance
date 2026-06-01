import { expect, test } from "@playwright/test"

import {
  chapterNames,
  narrativeSections,
  responsiveWidths,
  storyWidths,
  visualStyleFor,
  expectNoHorizontalOverflow,
  expectReadableBodyText,
  expectNoHorizontalOverflowAtTextScale,
  expectTouchTarget,
  expectContainedWithinViewport,
  expectVisibleFocus,
  expectUNComparisonLayout,
  expectWpsEvidenceLayout,
} from "../playwright/home-page-helpers"

test("@layout source-aware chat remains contained on mobile and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })

  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 820 })
    await page.goto("/")

    const trigger = page.getByRole("button", {
      name: "Open source-aware chat",
    })
    await expect(trigger).toBeVisible()
    await expectTouchTarget(trigger)
    await trigger.click()

    const panel = page.getByRole("region", {
      name: "Source-aware academic chat",
    })
    await expect(panel).toBeVisible()
    await expectContainedWithinViewport(panel, width)
    await expectReadableBodyText(
      panel.getByRole("textbox", { name: "Course question" })
    )
    await expectNoHorizontalOverflow(page)
    await expect(
      panel.getByRole("button", { name: "Open source-aware chat" })
    ).toHaveCount(0)

    const transitionDurationMs = await panel.evaluate((element) => {
      const duration = window.getComputedStyle(element).transitionDuration

      return duration.endsWith("ms")
        ? Number.parseFloat(duration)
        : Number.parseFloat(duration) * 1000
    })
    expect(transitionDurationMs).toBeLessThanOrEqual(0.01)

    await panel.getByRole("button", { name: "Close source-aware chat" }).focus()
    await expectVisibleFocus(
      panel.getByRole("button", { name: "Close source-aware chat" })
    )
    await page.keyboard.press("Tab")
    await expectVisibleFocus(
      panel.getByRole("textbox", { name: "Course question" })
    )

    await page.keyboard.press("Escape")
    await expect(trigger).toBeFocused()
  }
})

test("@layout UN organ comparison adapts across breakpoints without hiding controls", async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion })

    for (const width of [360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 920 })
      await page.goto("/#un-command-center")

      const commandCenter = page.getByRole("region", {
        name: "UN Command Center",
      })
      const explorer = commandCenter.getByRole("region", {
        name: "Inspect the rooms of the UN system",
      })
      const generalAssembly = explorer.getByRole("button", {
        name: /General Assembly/i,
      })
      const securityCouncil = explorer.getByRole("button", {
        name: /Security Council/i,
      })
      const details = explorer.locator('[data-un-comparison-part="details"]')

      await expectUNComparisonLayout(page, width)
      await expectNoHorizontalOverflow(page)

      for (const organControl of [generalAssembly, securityCouncil]) {
        await expectTouchTarget(organControl)
        await organControl.focus()
        await expectVisibleFocus(organControl)
      }

      await page.keyboard.press("Enter")
      await expect(securityCouncil).toHaveAttribute("aria-pressed", "true")
      await expect(
        explorer.getByRole("region", { name: "Security Council details" })
      ).toBeVisible()
      await expect(details.getByText("Role")).toBeVisible()
      await expect(details.getByText("Scope of power")).toBeVisible()
      await expect(details.getByText("Limitation")).toBeVisible()
      await expect(details.getByText("Why it matters")).toBeVisible()

      if (reducedMotion === "reduce") {
        const motionStyle = await details.evaluate((element) => {
          const style = window.getComputedStyle(element)

          return {
            transitionDuration: Number.parseFloat(style.transitionDuration),
            transitionProperty: style.transitionProperty,
          }
        })

        expect(
          motionStyle.transitionProperty === "none" ||
            motionStyle.transitionDuration <= 0.001
        ).toBe(true)
      }
    }
  }
})

test("@layout West Philippine Sea dossier evidence stays local, accessible, and context-linked", async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion })

    for (const width of [360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 980 })
      await page.goto(
        `/?evidence=${reducedMotion}-${width}#west-philippine-sea-dossier`
      )

      const dossier = page.getByRole("region", {
        name: "West Philippine Sea dossier",
      })
      const timeline = dossier.getByRole("region", {
        name: "Follow the dispute in order",
      })
      const comparison = dossier.getByRole("region", {
        name: "Legal clarity met political limits",
      })
      const arbitration = timeline.getByRole("button", {
        name: /2013\s+(Selected\s+)?Arbitration filing/i,
      })
      const timelineEvidenceTrigger = timeline.getByRole("button", {
        name: "Inspect evidence for Scarborough Shoal incident",
      })

      await expect(timelineEvidenceTrigger).toBeVisible()
      await timelineEvidenceTrigger.focus()
      await expectVisibleFocus(timelineEvidenceTrigger)
      await page.keyboard.press("Enter")

      const scarboroughEvidence = timeline.getByRole("region", {
        name: "Evidence for Scarborough Shoal incident",
      })

      await expect(scarboroughEvidence).toBeVisible()
      await expect(scarboroughEvidence).toContainText(
        "gg-src-scarborough-standoff-record"
      )
      await expect(scarboroughEvidence).toContainText("Why it matters")
      await expectWpsEvidenceLayout(page, width)
      await expectNoHorizontalOverflow(page)
      await expect(
        dossier.getByRole("link", {
          name: "Continue to Conclusion and references",
        })
      ).toBeVisible()

      await arbitration.click()

      const arbitrationEvidence = timeline.getByRole("region", {
        name: "Evidence for Arbitration filing",
      })

      await expect(arbitrationEvidence).toBeVisible()
      await expect(arbitrationEvidence).toContainText(
        "gg-src-philippines-arbitration-filing"
      )
      await expect(scarboroughEvidence).toBeHidden()
      await expectNoHorizontalOverflow(page)

      const updatedTimelineTrigger = timeline.getByRole("button", {
        name: "Inspect evidence for Arbitration filing",
      })
      await comparison
        .getByRole("radio", { name: /Governance lesson/i })
        .click()

      const comparisonEvidenceTrigger = comparison.getByRole("button", {
        name: "Inspect evidence for Governance lesson",
      })

      await comparisonEvidenceTrigger.focus()
      await expectVisibleFocus(comparisonEvidenceTrigger)
      await page.keyboard.press("Enter")

      const emptyEvidence = comparison.getByRole("region", {
        name: "Evidence for Governance lesson",
      })

      await expect(emptyEvidence).toBeVisible()
      await expect(emptyEvidence).toContainText(
        "Evidence is unavailable for this selection."
      )
      await expect(emptyEvidence).toContainText(
        "The current context remains Governance lesson"
      )
      await expect(updatedTimelineTrigger).toHaveAttribute(
        "aria-expanded",
        "false"
      )
      await expectWpsEvidenceLayout(page, width)
      await expectNoHorizontalOverflow(page)

      const closeComparisonEvidence = comparison.getByRole("button", {
        name: "Close evidence for Governance lesson",
      })

      await closeComparisonEvidence.focus()
      await expectVisibleFocus(closeComparisonEvidence)
      await page.keyboard.press("Enter")
      await expect(comparisonEvidenceTrigger).toBeFocused()
      await expect(emptyEvidence).toBeHidden()

      if (reducedMotion === "reduce") {
        const motionStyle = await comparisonEvidenceTrigger.evaluate(
          (element) => {
            const style = window.getComputedStyle(element)

            return {
              transitionDuration: Number.parseFloat(style.transitionDuration),
              transitionProperty: style.transitionProperty,
            }
          }
        )

        expect(
          motionStyle.transitionProperty === "none" ||
            motionStyle.transitionDuration <= 0.001
        ).toBe(true)
      }
    }
  }
})

test("@layout mobile navigation is touch-friendly, dismissible, and resets at desktop", async ({
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

test("@layout core journey has no horizontal overflow in default and reduced motion modes", async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion })

    for (const width of storyWidths) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto("/")

      await expectNoHorizontalOverflow(page)
      await expectReadableBodyText(
        page
          .getByRole("region", { name: "Global governance overview" })
          .getByText(/A closer look at the system/i)
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
        width >= 768
          ? page.getByRole("button", { name: "Return to start" })
          : page.getByRole("button", { name: "Close navigation" })

      await expect(returnControl).toBeVisible()
      await expectTouchTarget(returnControl)
      await expectNoHorizontalOverflow(page)
    }
  }
})

test("@layout keyboard path exposes the active layout controls with visible focus", async ({
  page,
}) => {
  for (const width of storyWidths) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/")

    const heroCta = page.getByRole("link", { name: "Begin the journey" })
    await heroCta.focus()
    await expectVisibleFocus(heroCta)

    if (width < 1024) {
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

    const recapCue = page
      .getByRole("region", { name: "Global governance overview" })
      .getByRole("link", { name: "Continue to UN Command Center" })
    await recapCue.focus()
    await expectVisibleFocus(recapCue)

    const returnControls = page.getByRole("button", {
      name: /return to start/i,
    })
    if (width >= 768) {
      const returnControl = returnControls.first()
      await returnControl.focus()
      await expectVisibleFocus(returnControl)
    }
  }
})

test("@layout touch interactions keep controls usable without trapping reading flow", async ({
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

  await heroCta.tap()
  await expect(page).toHaveURL(/#global-governance-overview$/)

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

test("@layout semantic landmarks and headings describe the core journey", async ({
  page,
}) => {
  await page.goto("/")

  await expect(page.getByRole("main")).toHaveCount(1)
  await expect(page.getByRole("banner")).toHaveCount(1)
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible()

  await expect(
    page.getByRole("heading", { level: 1, name: "Global Governance" })
  ).toBeVisible()

  for (const sectionName of narrativeSections) {
    const region = page.getByRole("region", { name: sectionName })
    await expect(region).toBeVisible()
    await expect(region.getByRole("heading", { level: 2 })).toBeVisible()
  }
})

test("@layout home page respects reduced motion and keeps hero responsive", async ({
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
  const overview = page.getByRole("region", {
    name: "Global governance overview",
  })

  await continueLink.focus()
  await page.keyboard.press("Enter")

  await expect(page).toHaveURL(/#global-governance-overview$/)
  await expect(overview).toBeFocused()
})

test("@layout editorial system applies shared surfaces and action hierarchy", async ({
  page,
}) => {
  await page.goto("/")

  const hero = page.locator('[data-editorial-surface="hero"]')
  const transition = page
    .locator('[data-editorial-surface="transition"]')
    .first()
  const narrative = page.locator('[data-editorial-surface="narrative"]').first()
  const recap = page.locator(
    '#governance-limits [data-editorial-surface="recap"]'
  )
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

test("@layout editorial system remains readable in light and dark mode", async ({
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

test("@layout full narrative stays readable across responsive checkpoints", async ({
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
