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

const summaryFirstSections = [
  "Global governance overview",
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

async function waitForScrollIdle(page: Page) {
  await page.waitForFunction(
    () =>
      new Promise((resolve) => {
        let lastScrollY = window.scrollY
        let stableFrames = 0

        function checkScroll() {
          const currentScrollY = window.scrollY

          if (Math.abs(currentScrollY - lastScrollY) <= 1) {
            stableFrames += 1
          } else {
            stableFrames = 0
            lastScrollY = currentScrollY
          }

          if (stableFrames >= 3) {
            resolve(true)
            return
          }

          window.requestAnimationFrame(checkScroll)
        }

        window.requestAnimationFrame(checkScroll)
      })
  )
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

async function expectContainedWithinViewport(locator: Locator, width: number) {
  const box = await locator.boundingBox()

  expect(box).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(width)
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

async function expectUNComparisonLayout(page: Page, width: number) {
  const commandCenter = page.getByRole("region", {
    name: "UN Command Center",
  })
  const explorer = commandCenter.getByRole("region", {
    name: "Inspect the rooms of the UN system",
  })
  const comparisonSurface = explorer.locator(
    '[data-un-comparison-layout="organ-comparison"]'
  )
  const selector = explorer.locator('[data-un-comparison-part="selector"]')
  const details = explorer.locator('[data-un-comparison-part="details"]')

  await expect(comparisonSurface).toBeVisible()
  await expect(selector).toBeVisible()
  await expect(details).toBeVisible()

  const surfaceBox = await comparisonSurface.boundingBox()
  const selectorBox = await selector.boundingBox()
  const detailsBox = await details.boundingBox()

  expect(surfaceBox).not.toBeNull()
  expect(selectorBox).not.toBeNull()
  expect(detailsBox).not.toBeNull()
  expect(surfaceBox!.x).toBeGreaterThanOrEqual(0)
  expect(surfaceBox!.x + surfaceBox!.width).toBeLessThanOrEqual(width)
  expect(selectorBox!.x).toBeGreaterThanOrEqual(surfaceBox!.x)
  expect(detailsBox!.x + detailsBox!.width).toBeLessThanOrEqual(
    surfaceBox!.x + surfaceBox!.width
  )

  if (width >= 1024) {
    expect(selectorBox!.x + selectorBox!.width).toBeLessThanOrEqual(
      detailsBox!.x
    )
  } else {
    expect(selectorBox!.width).toBeLessThanOrEqual(surfaceBox!.width)
    expect(detailsBox!.width).toBeLessThanOrEqual(surfaceBox!.width)
    expect(selectorBox!.x).toBeGreaterThanOrEqual(surfaceBox!.x)
    expect(detailsBox!.x).toBeGreaterThanOrEqual(surfaceBox!.x)
  }
}

async function expectWpsTimelineLayout(page: Page, width: number) {
  const dossier = page.getByRole("region", {
    name: "West Philippine Sea dossier",
  })
  const timeline = dossier.getByRole("region", {
    name: "Follow the dispute in order",
  })
  const timelineSurface = timeline.locator(
    '[data-wps-timeline-layout="chronology"]'
  )
  const selector = timeline.locator('[data-wps-timeline-part="selector"]')
  const details = timeline.locator('[data-wps-timeline-part="details"]')

  await expect(timeline).toBeVisible()
  await expect(timelineSurface).toBeVisible()
  await expect(selector).toBeVisible()
  await expect(details).toBeVisible()

  const surfaceBox = await timelineSurface.boundingBox()
  const selectorBox = await selector.boundingBox()
  const detailsBox = await details.boundingBox()

  expect(surfaceBox).not.toBeNull()
  expect(selectorBox).not.toBeNull()
  expect(detailsBox).not.toBeNull()
  expect(surfaceBox!.x).toBeGreaterThanOrEqual(0)
  expect(surfaceBox!.x + surfaceBox!.width).toBeLessThanOrEqual(width)
  expect(selectorBox!.x).toBeGreaterThanOrEqual(surfaceBox!.x)
  expect(detailsBox!.x + detailsBox!.width).toBeLessThanOrEqual(
    surfaceBox!.x + surfaceBox!.width
  )

  if (width >= 1024) {
    expect(selectorBox!.x + selectorBox!.width).toBeLessThanOrEqual(
      detailsBox!.x
    )
  } else {
    expect(selectorBox!.width).toBeLessThanOrEqual(surfaceBox!.width)
    expect(detailsBox!.width).toBeLessThanOrEqual(surfaceBox!.width)
    expect(selectorBox!.x).toBeGreaterThanOrEqual(surfaceBox!.x)
    expect(detailsBox!.x).toBeGreaterThanOrEqual(surfaceBox!.x)
  }
}

async function expectWpsComparisonLayout(page: Page, width: number) {
  const dossier = page.getByRole("region", {
    name: "West Philippine Sea dossier",
  })
  const comparison = dossier.getByRole("region", {
    name: "Legal clarity met political limits",
  })
  const pairedSurface = comparison.locator(
    '[data-wps-comparison-layout="ruling-reality"]'
  )
  const controls = comparison.locator('[data-wps-comparison-part="controls"]')
  const details = comparison.locator('[data-wps-comparison-part="details"]')
  const ruling = pairedSurface.getByText("Legal or institutional ruling")
  const reality = pairedSurface.getByText("Enforcement or geopolitical reality")

  await expect(comparison).toBeVisible()
  await expect(pairedSurface).toBeVisible()
  await expect(controls).toBeVisible()
  await expect(details).toBeVisible()
  await expect(ruling).toBeVisible()
  await expect(reality).toBeVisible()

  const surfaceBox = await pairedSurface.boundingBox()
  const controlsBox = await controls.boundingBox()
  const detailsBox = await details.boundingBox()

  expect(surfaceBox).not.toBeNull()
  expect(controlsBox).not.toBeNull()
  expect(detailsBox).not.toBeNull()
  expect(surfaceBox!.x).toBeGreaterThanOrEqual(0)
  expect(surfaceBox!.x + surfaceBox!.width).toBeLessThanOrEqual(width)
  expect(controlsBox!.x).toBeGreaterThanOrEqual(0)
  expect(controlsBox!.x + controlsBox!.width).toBeLessThanOrEqual(width)
  expect(detailsBox!.x).toBeGreaterThanOrEqual(0)
  expect(detailsBox!.x + detailsBox!.width).toBeLessThanOrEqual(width)

  if (width >= 1024) {
    const cards = await pairedSurface.locator("article").evaluateAll((items) =>
      items.map((item) => {
        const box = item.getBoundingClientRect()

        return { x: box.x, y: box.y, width: box.width }
      })
    )

    expect(cards).toHaveLength(2)
    expect(cards[0].x + cards[0].width).toBeLessThanOrEqual(cards[1].x)
    expect(Math.abs(cards[0].y - cards[1].y)).toBeLessThanOrEqual(2)
    expect(controlsBox!.x + controlsBox!.width).toBeLessThanOrEqual(
      detailsBox!.x
    )
  } else {
    expect(controlsBox!.width).toBeLessThanOrEqual(width)
    expect(detailsBox!.width).toBeLessThanOrEqual(width)

    const controlBoxes = await controls
      .getByRole("radio")
      .evaluateAll((items) =>
        items.map((item) => {
          const box = item.getBoundingClientRect()

          return { x: box.x, y: box.y, width: box.width }
        })
      )

    if (width >= 768) {
      expect(controlBoxes).toHaveLength(3)
      expect(controlBoxes[0].x).toBeCloseTo(controlBoxes[1].x, 0)
      expect(controlBoxes[1].x).toBeCloseTo(controlBoxes[2].x, 0)
      expect(controlBoxes[0].y).toBeLessThan(controlBoxes[1].y)
      expect(controlBoxes[1].y).toBeLessThan(controlBoxes[2].y)
    }
  }
}

async function expectWpsEvidenceLayout(page: Page, width: number) {
  const evidenceSurface = page.locator('[data-wps-evidence-surface=""]:visible')

  await expect(evidenceSurface).toBeVisible()
  await expectContainedWithinViewport(evidenceSurface, width)

  const sourceCards = evidenceSurface.locator("article")
  const unavailableState = evidenceSurface.getByText(
    "Evidence is unavailable for this selection."
  )

  if ((await sourceCards.count()) > 0) {
    const sourceCardBoxes = await sourceCards.evaluateAll((cards) =>
      cards.map((card) => {
        const box = card.getBoundingClientRect()

        return { x: box.x, width: box.width }
      })
    )

    for (const box of sourceCardBoxes) {
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width)
    }

    await expectReadableBodyText(sourceCards.first().locator("p").nth(2))
  } else {
    await expect(unavailableState).toBeVisible()
    await expectReadableBodyText(unavailableState)
  }
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

test("source-aware chat opens from the shell without disrupting the learning flow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 820 })
  let releaseGroundedAnswer!: () => void
  const groundedAnswerReady = new Promise<void>((resolve) => {
    releaseGroundedAnswer = resolve
  })

  await page.route("**/functions/v1/chat", async (route) => {
    await groundedAnswerReady
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          state: "answered",
          answer:
            "Global governance coordinates rules and institutions without becoming world government.",
          grounding: {
            supportLevel: "strong",
            cue: "Grounded with 2 approved sources",
          },
          citations: [
            {
              sourceId: "gg-src-un-charter-institutions",
              title: "Charter of the United Nations",
              shortTitle: "UN Charter",
              sourceType: "primary",
              detail:
                "The Charter supplies the institutional coordination frame used in the course.",
              url: "https://www.un.org/en/about-us/un-charter/full-text",
            },
            {
              sourceId: "gg-src-global-governance-course-frame",
              title: "Global Governance Course Frame",
              shortTitle: "Course frame",
              sourceType: "course",
              detail:
                "The course distinguishes global governance from world government.",
            },
          ],
        },
      }),
    })
  })
  await page.goto("/#west-philippine-sea-dossier")

  const trigger = page.getByRole("button", {
    name: "Open source-aware chat",
  })
  const dossier = page.getByRole("region", {
    name: "West Philippine Sea dossier",
  })

  await expect(dossier).toBeFocused()
  await page.waitForFunction(() => window.scrollY > 1000)
  await waitForScrollIdle(page)
  await page.evaluate(() => window.scrollBy(0, 120))
  await waitForScrollIdle(page)
  const scrollBefore = await page.evaluate(() => window.scrollY)

  await trigger.focus()
  await expectVisibleFocus(trigger)
  await page.keyboard.press("Enter")

  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })
  const input = panel.getByRole("textbox", { name: "Course question" })
  const prompt = panel.getByRole("button", {
    name: "Ruling and reality",
  })

  await expect(panel).toBeVisible()
  await expect(input).toBeFocused()
  await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
  const scrollAfterOpen = await page.evaluate(() => window.scrollY)
  expect(Math.abs(scrollAfterOpen - scrollBefore)).toBeLessThanOrEqual(2)
  await expect(
    panel.getByText(/bounded to the Global Governance learning experience/i)
  ).toBeVisible()
  await expect(panel.getByText("Suggested prompts")).toBeVisible()

  await prompt.click()
  await expect(input).toHaveValue(
    "Connect the West Philippine Sea ruling to the gap between legal clarity and political enforcement."
  )
  await expect(input).toBeFocused()
  await expect(
    panel.getByText(/answers stay inside the approved course materials/i)
  ).toBeVisible()
  await page.keyboard.press("Enter")
  await expect(panel.getByRole("button", { name: "Asking" })).toBeVisible()
  await expect(
    panel.getByText(/checking approved materials for a grounded answer/i)
  ).toBeVisible()
  releaseGroundedAnswer()
  await expect(
    panel.getByText(
      /global governance coordinates rules and institutions without becoming world government/i
    )
  ).toBeVisible()
  await expect(
    panel.getByText("Grounded with 2 approved sources")
  ).toBeVisible()
  const sourceChip = panel.getByRole("button", { name: /UN Charter/i })
  await expect(sourceChip).toBeVisible()
  await sourceChip.focus()
  await expectVisibleFocus(sourceChip)
  await page.keyboard.press("Enter")
  await expect(sourceChip).toHaveAttribute("aria-expanded", "true")
  await expect(panel.getByText("gg-src-un-charter-institutions")).toBeVisible()
  await expect(
    panel.getByText(/institutional coordination frame/i)
  ).toBeVisible()
  await expectNoHorizontalOverflow(page)

  await page.keyboard.press("Escape")
  await expect(panel).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
})

test("source-aware chat keeps shift enter for multiline prompts", async ({
  page,
}) => {
  await page.goto("/")
  await page.getByRole("button", { name: "Open source-aware chat" }).click()

  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })
  const input = panel.getByRole("textbox", { name: "Course question" })

  await input.fill("Explain global governance")
  await page.keyboard.press("Shift+Enter")
  await input.pressSequentially("with one example")

  await expect(input).toHaveValue("Explain global governance\nwith one example")
})

test("source-aware chat shows weak support without unsupported certainty", async ({
  page,
}) => {
  await page.route("**/functions/v1/chat", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          state: "weakSupport",
          message:
            "I can connect this to the course, but the approved materials do not support a confident answer.",
          nextStep:
            "Try asking about global governance, the UN system, or the West Philippine Sea case.",
          grounding: {
            supportLevel: "weak",
            cue: "Limited support in approved materials",
          },
          citations: [],
        },
      }),
    })
  })

  await page.goto("/")
  await page.getByRole("button", { name: "Open source-aware chat" }).click()

  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })
  const input = panel.getByRole("textbox", { name: "Course question" })

  await input.fill("What should happen tomorrow?")
  await panel.getByRole("button", { name: "Ask" }).click()
  await expect(
    panel.getByText(/approved materials do not support a confident answer/i)
  ).toBeVisible()
  await expect(
    panel.getByText(/try asking about global governance/i)
  ).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

test("source-aware chat renders calm refusal with a rephrase action", async ({
  page,
}) => {
  await page.route("**/functions/v1/chat", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          state: "refused",
          code: "off_topic",
          message:
            "I can only help with this Global Governance course and its approved materials.",
          nextStep:
            "Rephrase the question around global governance, the UN system, approved sources, or the West Philippine Sea case.",
        },
      }),
    })
  })

  await page.goto("/#un-command-center")
  await page.getByRole("button", { name: "Open source-aware chat" }).click()

  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })
  const input = panel.getByRole("textbox", { name: "Course question" })
  const commandCenter = page.getByRole("region", { name: "UN Command Center" })

  await input.fill("Can you recommend a phone?")
  await panel.getByRole("button", { name: "Ask" }).click()

  await expect(panel.getByText("Course boundary reached")).toBeVisible()
  await expect(
    panel.getByText(/only help with this Global Governance course/i)
  ).toBeVisible()
  await expect(
    panel.getByText(/Rephrase the question around global governance/i)
  ).toBeVisible()

  const rephrase = panel.getByRole("button", {
    name: "Rephrase a course question",
  })
  await rephrase.focus()
  await expectVisibleFocus(rephrase)
  await page.keyboard.press("Enter")
  await expect(input).toBeFocused()
  await expect(commandCenter.getByText(/Security Council/i)).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

test("source-aware chat renders cooldown quickly without blocking the page", async ({
  page,
}) => {
  await page.route("**/functions/v1/chat", async (route) => {
    await route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          state: "cooldown",
          code: "rate_limited",
          message:
            "The assistant is temporarily limited after repeated submissions.",
          nextStep: "Wait briefly, then ask a course-focused question.",
          retryAfterSeconds: 60,
        },
      }),
    })
  })

  await page.emulateMedia({ reducedMotion: "reduce" })

  for (const width of [360, 480, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 820 })
    await page.goto("/#governance-limits")
    await page.getByRole("button", { name: "Open source-aware chat" }).click()

    const panel = page.getByRole("region", {
      name: "Source-aware academic chat",
    })
    const input = panel.getByRole("textbox", { name: "Course question" })

    await input.fill("How does the UN coordinate global governance?")
    await panel.getByRole("button", { name: "Ask" }).click()

    await expect(panel.getByText("Assistant temporarily limited")).toBeVisible({
      timeout: 2_000,
    })
    await expect(panel.getByText(/Retry in about 60 seconds/i)).toBeVisible()

    const retry = panel.getByRole("button", { name: "Try again shortly" })
    await retry.focus()
    await expectVisibleFocus(retry)
    await expectContainedWithinViewport(panel, width)
    await expectNoHorizontalOverflow(page)
    await expect(
      page
        .getByRole("region", { name: "Governance limits and enforcement" })
        .getByRole("link", { name: "Continue to West Philippine Sea dossier" })
    ).toBeVisible()
    await page.keyboard.press("Escape")
  }
})

test("source-aware chat remains contained on mobile and reduced motion", async ({
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
        commandCenter.getByText(
          /institutional system within global governance/i
        )
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
        await page.waitForFunction(() => {
          const section = document.getElementById("un-command-center")

          if (!section) {
            return false
          }

          return section.getBoundingClientRect().top <= 180
        })
        const openNavigation = page.getByRole("button", {
          name: "Open navigation",
        })
        await expect(openNavigation).toBeVisible()
        await openNavigation.click()
        const mobileNav = page.getByRole("navigation", {
          name: "Mobile chapters",
        })

        const mobileUnLink = mobileNav.getByRole("link", {
          name: "UN Command Center",
        })

        await expect(mobileUnLink).toBeVisible()
        await expect(mobileUnLink).toHaveAttribute(
          "data-state",
          /active|complete/
        )
        await expect(mobileNav.getByText(/Current chapter:/)).toBeVisible()
      }
    }
  }
})

test("UN command center organ explorer updates selection and details", async ({
  page,
}) => {
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

  await expect(commandCenter).toBeFocused()
  await expect(explorer).toBeVisible()
  await expect(
    explorer.getByRole("region", { name: "General Assembly details" })
  ).toBeVisible()
  await expect(generalAssembly).toHaveAttribute("aria-pressed", "true")
  await expect(generalAssembly).toHaveAttribute("data-state", "selected")
  await expect(
    explorer
      .getByRole("region", { name: "General Assembly details" })
      .getByText(/every UN member state has a seat and a vote/i)
  ).toBeVisible()
  await expect(explorer.getByText("Role")).toBeVisible()
  await expect(explorer.getByText("Scope of power")).toBeVisible()
  await expect(explorer.getByText("Limitation")).toBeVisible()
  await expect(explorer.getByText("Why it matters")).toBeVisible()

  await securityCouncil.click()
  await expect(securityCouncil).toHaveAttribute("aria-pressed", "true")
  await expect(generalAssembly).toHaveAttribute("aria-pressed", "false")
  await expect(
    explorer.getByRole("region", { name: "Security Council details" })
  ).toBeVisible()
  await expect(
    explorer.getByText(/binding decisions for member states/i)
  ).toBeVisible()
  await expect(
    explorer.getByText(/veto held by the five permanent members/i)
  ).toBeVisible()

  await generalAssembly.focus()
  await expectVisibleFocus(generalAssembly)
  await page.keyboard.press("Tab")
  await expect(securityCouncil).toBeFocused()
  await expectVisibleFocus(securityCouncil)
  await page.keyboard.press("Enter")
  await expect(securityCouncil).toHaveAttribute("aria-pressed", "true")

  await expect(
    commandCenter.getByRole("region", { name: "Command Center summary" })
  ).toBeVisible()
  await expect(
    commandCenter.getByRole("link", {
      name: "Continue to Governance limits and enforcement",
    })
  ).toBeVisible()
  await expect(page).toHaveURL(/#un-command-center$/)
})

test("UN organ comparison adapts across breakpoints without hiding controls", async ({
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

test("West Philippine Sea dossier opens as an anchored case file shell", async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion })

    for (const width of [360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 920 })
      await page.goto("/#west-philippine-sea-dossier")

      const dossier = page.getByRole("region", {
        name: "West Philippine Sea dossier",
      })
      const entryControls = dossier.getByRole("region", {
        name: "Dossier entry controls",
      })
      const timeline = dossier.getByRole("region", {
        name: "Follow the dispute in order",
      })
      const comparison = dossier.getByRole("region", {
        name: "Legal clarity met political limits",
      })
      const openEvidence = entryControls.getByRole("button", {
        name: "Open the evidence file",
      })
      const traceLawPower = entryControls.getByRole("button", {
        name: "Trace law and power",
      })

      await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
      await expect(dossier).toBeVisible()
      await expect(dossier).toBeFocused()
      await expect(
        dossier.getByRole("heading", {
          name: "The West Philippine Sea turns the theory into a test",
        })
      ).toBeVisible()
      await expect(dossier.getByText("Case file")).toBeVisible()
      await expect(
        dossier.getByText("Evidence-led investigation")
      ).toBeVisible()
      await expect(timeline).toBeVisible()
      await expect(comparison).toBeVisible()
      await expect(
        dossier.getByText(/legal rulings, maritime claims/i)
      ).toBeVisible()
      await expect(dossier.getByText("Supporting detail")).toBeVisible()
      await expect(dossier.getByText("Synthesis")).toBeVisible()
      await expect(
        dossier.getByRole("button", {
          name: "How to read the dispute as a governance case",
        })
      ).toBeVisible()
      await expect(
        dossier.getByRole("link", {
          name: "Continue to Conclusion and references",
        })
      ).toBeVisible()
      await expect(entryControls.getByRole("button")).toHaveCount(2)

      const timelineBox = await timeline.boundingBox()
      const comparisonBox = await comparison.boundingBox()
      const entryBox = await entryControls.boundingBox()

      expect(timelineBox).not.toBeNull()
      expect(comparisonBox).not.toBeNull()
      expect(entryBox).not.toBeNull()
      expect(timelineBox!.y).toBeLessThan(comparisonBox!.y)
      expect(comparisonBox!.y).toBeLessThan(entryBox!.y)
      expect(timelineBox!.y).toBeLessThan(entryBox!.y)

      for (const control of [openEvidence, traceLawPower]) {
        await expect(control).toBeVisible()
        await expectTouchTarget(control)
        await expectContainedWithinViewport(control, width)
        await control.focus()
        await expectVisibleFocus(control)
        await control.press("Enter")
        await expect(control).toHaveAttribute("aria-expanded", "true")
        await expectNoHorizontalOverflow(page)
      }

      await expectNoHorizontalOverflow(page)
    }
  }
})

test("West Philippine Sea dossier compares the ruling and reality locally", async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion })

    for (const width of [360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 920 })
      await page.goto(
        `/?comparison=${reducedMotion}-${width}#west-philippine-sea-dossier`
      )

      const dossier = page.getByRole("region", {
        name: "West Philippine Sea dossier",
      })
      const comparison = dossier.getByRole("region", {
        name: "Legal clarity met political limits",
      })
      const controls = comparison.locator(
        '[data-wps-comparison-part="controls"]'
      )
      const details = comparison.locator('[data-wps-comparison-part="details"]')
      const enforcementGap = controls.getByRole("radio", {
        name: /Enforcement gap/i,
      })
      const politicalReality = controls.getByRole("radio", {
        name: /Political reality/i,
      })
      const governanceLesson = controls.getByRole("radio", {
        name: /Governance lesson/i,
      })

      await expectWpsComparisonLayout(page, width)
      await expectNoHorizontalOverflow(page)
      await expect(controls.getByRole("radio")).toHaveCount(3)
      await expect(controls).not.toHaveAttribute("aria-describedby", /.+/)
      await expect(enforcementGap).toHaveAttribute("aria-checked", "true")
      await expect(enforcementGap).toHaveAttribute("tabindex", "0")
      await expect(enforcementGap).toHaveAttribute("data-state", "selected")
      await expect(politicalReality).toHaveAttribute("tabindex", "-1")
      await expect(governanceLesson).toHaveAttribute("tabindex", "-1")
      await expect(enforcementGap.getByText("Active")).toBeVisible()
      await expect(
        comparison.getByText(/2016 arbitral award rejected broad/i)
      ).toBeVisible()
      await expect(
        comparison.getByText(/Activity and pressure at sea continued/i)
      ).toBeVisible()
      await expect(details).not.toHaveAttribute("aria-live", /.+/)
      await expect(details).toContainText(/weak enforcement/i)
      await expect(details).toContainText(/compliance, diplomacy/i)

      for (const control of [
        enforcementGap,
        politicalReality,
        governanceLesson,
      ]) {
        await expectTouchTarget(control)
        await expectContainedWithinViewport(control, width)
        await expect(control).toHaveAttribute(
          "aria-controls",
          /comparison-detail$/
        )
      }

      await politicalReality.click()
      await expect(politicalReality).toHaveAttribute("aria-checked", "true")
      await expect(politicalReality).toHaveAttribute("tabindex", "0")
      await expect(enforcementGap).toHaveAttribute("aria-checked", "false")
      await expect(enforcementGap).toHaveAttribute("tabindex", "-1")
      await expect(details).toContainText(/states still calculate interests/i)

      await politicalReality.focus()
      await expect(politicalReality).toBeFocused()
      await expectVisibleFocus(politicalReality)
      await page.keyboard.press("ArrowRight")
      await expect(governanceLesson).toBeFocused()
      await expect(governanceLesson).toHaveAttribute("aria-checked", "true")
      await expect(governanceLesson).toHaveAttribute("tabindex", "0")
      await expect(politicalReality).toHaveAttribute("tabindex", "-1")
      await expect(governanceLesson.getByText("Active")).toBeVisible()
      await expect(details).toContainText(/not a generic conflict summary/i)
      await expect(
        dossier.getByRole("link", {
          name: "Continue to Conclusion and references",
        })
      ).toBeVisible()

      if (reducedMotion === "reduce") {
        const [detailMotionStyle, controlMotionStyle] = await Promise.all([
          details.evaluate((element) => {
            const style = window.getComputedStyle(element)

            return {
              transitionDuration: Number.parseFloat(style.transitionDuration),
              transitionProperty: style.transitionProperty,
            }
          }),
          governanceLesson.evaluate((element) => {
            const style = window.getComputedStyle(element)

            return {
              transitionDuration: Number.parseFloat(style.transitionDuration),
              transitionProperty: style.transitionProperty,
            }
          }),
        ])

        expect(
          detailMotionStyle.transitionProperty === "none" ||
            detailMotionStyle.transitionDuration <= 0.001
        ).toBe(true)
        expect(
          controlMotionStyle.transitionProperty === "none" ||
            controlMotionStyle.transitionDuration <= 0.001
        ).toBe(true)
      }
    }
  }
})

test("West Philippine Sea dossier timeline follows chronological selection", async ({
  page,
}) => {
  const expectedMilestones = [
    "2012 Scarborough Shoal incident",
    "2013 Arbitration filing",
    "2016 Tribunal ruling",
    "Post-2016 Enforcement limits",
  ]

  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion })

    for (const width of [360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 920 })
      await page.goto(
        `/?timeline=${reducedMotion}-${width}#west-philippine-sea-dossier`
      )

      const dossier = page.getByRole("region", {
        name: "West Philippine Sea dossier",
      })
      const timeline = dossier.getByRole("region", {
        name: "Follow the dispute in order",
      })
      const selector = timeline.locator('[data-wps-timeline-part="selector"]')
      const detail = timeline.locator('[data-wps-timeline-part="details"]')
      const eventButtons = selector.getByRole("button")
      const scarborough = selector.getByRole("button", {
        name: /2012\s+(Selected\s+)?Scarborough Shoal incident/i,
      })
      const arbitration = selector.getByRole("button", {
        name: /2013\s+(Selected\s+)?Arbitration filing/i,
      })
      const ruling = selector.getByRole("button", {
        name: /2016\s+(Selected\s+)?Tribunal ruling/i,
      })
      const enforcement = selector.getByRole("button", {
        name: /Post-2016\s+(Selected\s+)?Enforcement limits/i,
      })

      await expectWpsTimelineLayout(page, width)
      await expectNoHorizontalOverflow(page)
      await expect(eventButtons).toHaveCount(4)
      await expect(scarborough).toHaveAttribute("aria-pressed", "true")
      await expect(scarborough).toHaveAttribute("data-state", "selected")
      await expect(scarborough.getByText("Selected")).toBeVisible()
      await expect(detail).toContainText("Context")
      await expect(detail).toContainText("Legal context")
      await expect(detail).toContainText("Significance")
      await expect(detail).toContainText(/vessels faced one another/i)
      await expect(detail).toContainText(/UN Convention on the Law of the Sea/i)

      const renderedMilestones = await eventButtons.evaluateAll((buttons) =>
        buttons.map((button) =>
          (button as HTMLElement).innerText
            .replace(/\bSelected\b/g, "")
            .replace(/\s+/g, " ")
            .trim()
        )
      )

      for (const [index, milestone] of expectedMilestones.entries()) {
        expect(renderedMilestones[index].toLowerCase()).toContain(
          milestone.toLowerCase()
        )
      }

      for (const button of [scarborough, arbitration, ruling, enforcement]) {
        await expectTouchTarget(button)
        await expectContainedWithinViewport(button, width)
        await expect(button).toHaveAttribute(
          "aria-controls",
          /timeline-detail$/
        )
      }

      await arbitration.click()
      await expect(arbitration).toHaveAttribute("aria-pressed", "true")
      await expect(scarborough).toHaveAttribute("aria-pressed", "false")
      await expect(detail).toContainText(/initiated arbitration/i)
      await expect(detail).toContainText(/UNCLOS dispute-settlement/i)

      await ruling.focus()
      await expectVisibleFocus(ruling)
      await page.keyboard.press("Tab")
      await expect(enforcement).toBeFocused()
      await expectVisibleFocus(enforcement)
      await page.keyboard.press(" ")
      await expect(enforcement).toBeFocused()
      await expect(enforcement).toHaveAttribute("aria-pressed", "true")
      await expect(enforcement).toHaveAttribute("data-state", "selected")
      await expect(enforcement.getByText("Selected")).toBeVisible()
      await expect(detail).toContainText(/legal outcome can shape the debate/i)
      await expect(detail).toContainText(/state compliance, diplomacy/i)

      if (reducedMotion === "reduce") {
        const [detailMotionStyle, buttonMotionStyle] = await Promise.all([
          detail.evaluate((element) => {
            const style = window.getComputedStyle(element)

            return {
              transitionDuration: Number.parseFloat(style.transitionDuration),
              transitionProperty: style.transitionProperty,
            }
          }),
          enforcement.evaluate((element) => {
            const style = window.getComputedStyle(element)

            return {
              transitionDuration: Number.parseFloat(style.transitionDuration),
              transitionProperty: style.transitionProperty,
            }
          }),
        ])

        expect(
          detailMotionStyle.transitionProperty === "none" ||
            detailMotionStyle.transitionDuration <= 0.001
        ).toBe(true)
        expect(
          buttonMotionStyle.transitionProperty === "none" ||
            buttonMotionStyle.transitionDuration <= 0.001
        ).toBe(true)
      }
    }
  }
})

test("West Philippine Sea dossier evidence stays local, accessible, and context-linked", async ({
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

test("West Philippine Sea dossier keeps canonical hash and recap handoff", async ({
  page,
}) => {
  await page.goto("/#governance-limits")

  const governanceLimits = page.getByRole("region", {
    name: "Governance limits and enforcement",
  })
  const dossier = page.getByRole("region", {
    name: "West Philippine Sea dossier",
  })
  const cue = governanceLimits.getByRole("link", {
    name: "Continue to West Philippine Sea dossier",
  })

  await cue.focus()
  await expectVisibleFocus(cue)
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
  await expect(dossier).toBeFocused()

  await page.reload()
  await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
  await expect(dossier).toBeFocused()

  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Conclusion and references" })
    .click()
  await expect(page).toHaveURL(/#conclusion-references$/)

  await page.goBack()
  await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
  await expect(dossier).toBeFocused()
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

  for (const sectionName of summaryFirstSections) {
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

test("conclusion references are inspectable, keyboard-safe, and contained", async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion })

    for (const width of [360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto("/#conclusion-references")

      const conclusion = page.getByRole("region", {
        name: "Conclusion and references",
      })
      const trigger = conclusion.getByRole("button", {
        name: "Inspect the sources",
      })
      const recapCue = conclusion.getByRole("link", {
        name: "Return to Journey start",
      })

      await expect(conclusion).toBeFocused()
      await expect(conclusion.getByText(/not world government/i)).toBeVisible()
      await expect(
        conclusion.getByText(
          /sources below keep the closing claim inspectable/i
        )
      ).toBeVisible()
      await expect(trigger).toBeVisible()
      await expectTouchTarget(trigger)
      await trigger.focus()
      await expectVisibleFocus(trigger)
      await page.keyboard.press("Enter")
      await expect(trigger).toHaveAttribute("aria-expanded", "true")

      const referenceSurface = conclusion.locator(
        '[data-reference-surface="conclusion"]'
      )
      await expect(referenceSurface).toBeVisible()
      await expectContainedWithinViewport(referenceSurface, width)
      await expect(
        conclusion.getByRole("article", {
          name: "Charter of the United Nations",
        })
      ).toBeVisible()
      await expect(
        conclusion.getByText("gg-src-un-charter-institutions")
      ).toBeVisible()
      await expect(
        conclusion.getByText(/why it matters:/i).first()
      ).toBeVisible()
      await expectNoHorizontalOverflow(page)

      const sourceCards = referenceSurface.locator("article")
      await expect(sourceCards).toHaveCount(3)

      const sourceBoxes = await sourceCards.evaluateAll((cards) =>
        cards.map((card) => {
          const box = card.getBoundingClientRect()

          return { x: box.x, width: box.width }
        })
      )

      for (const box of sourceBoxes) {
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(width)
      }

      const referencesBeforeRecap = await referenceSurface.evaluate(
        (surface, cue) =>
          Boolean(
            surface.compareDocumentPosition(cue as Node) &
            Node.DOCUMENT_POSITION_FOLLOWING
          ),
        await recapCue.elementHandle()
      )
      expect(referencesBeforeRecap).toBe(true)

      await page.keyboard.press("Escape")
      await expect(trigger).toHaveAttribute("aria-expanded", "false")
      await expect(trigger).toBeFocused()
      await expectNoHorizontalOverflow(page)

      await recapCue.focus()
      await expectVisibleFocus(recapCue)
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(/#journey-start$/)
      await expect(
        page.getByRole("region", { name: "Journey start" })
      ).toBeFocused()
    }
  }
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
