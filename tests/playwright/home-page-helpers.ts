import { expect, type Locator, type Page } from "@playwright/test"

export const chapterNames = [
  "Hero Narrative Frame",
  "Global governance overview",
  "UN Command Center",
  "Governance limits and enforcement",
  "West Philippine Sea dossier",
  "Conclusion and references",
]

export const narrativeSections = [
  "Global governance overview",
  "UN Command Center",
  "Governance limits and enforcement",
  "West Philippine Sea dossier",
  "Conclusion and references",
]

export const summaryFirstSections = [
  "Governance limits and enforcement",
  "West Philippine Sea dossier",
  "Conclusion and references",
]

export const recapCues = [
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
    cueName: "Return to opening chapter",
    hash: /#hero-narrative-frame$/,
    targetName: "Global Governance",
  },
]

export const responsiveWidths = [360, 480, 768, 1024, 1440]
export const storyWidths = [360, 768, 1440]

export async function visualStyleFor(locator: Locator) {
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

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }))

  expect(overflow.body).toBeLessThanOrEqual(overflow.viewport)
  expect(overflow.document).toBeLessThanOrEqual(overflow.viewport)
}

export async function waitForScrollIdle(page: Page) {
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

export async function waitForDocumentFonts(page: Page) {
  await page.waitForFunction(async () => {
    if (!("fonts" in document)) {
      return true
    }

    await document.fonts.ready
    return document.fonts.status !== "loading"
  })
}

export async function waitForElementOrder(
  locators: Locator[],
  direction: "vertical" | "horizontal" = "vertical"
) {
  await expect
    .poll(async () => {
      const boxes = await Promise.all(
        locators.map(async (locator) => locator.boundingBox())
      )

      if (boxes.some((box) => box === null)) {
        return false
      }

      const axis = direction === "vertical" ? "y" : "x"

      return boxes.every((box, index) => {
        const nextBox = boxes[index + 1]

        return !nextBox || box![axis] < nextBox[axis]
      })
    })
    .toBe(true)
}

export async function expectReadableBodyText(locator: Locator) {
  const fontSize = await locator.evaluate((element) =>
    Number.parseFloat(window.getComputedStyle(element).fontSize)
  )

  expect(fontSize).toBeGreaterThanOrEqual(16)
}

export async function expectNoHorizontalOverflowAtTextScale(
  page: Page,
  fontSizePercent: number
) {
  await page.addStyleTag({
    content: `html { font-size: ${fontSizePercent}% !important; }`,
  })

  await expectNoHorizontalOverflow(page)
}

export async function expectTouchTarget(locator: Locator) {
  const box = await locator.boundingBox()

  expect(box).not.toBeNull()
  expect(box!.width).toBeGreaterThanOrEqual(44)
  expect(box!.height).toBeGreaterThanOrEqual(44)
}

export async function expectContainedWithinViewport(
  locator: Locator,
  width: number
) {
  const box = await locator.boundingBox()

  expect(box).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(width)
}

export async function expectVisibleFocus(locator: Locator) {
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

export async function expectUNComparisonLayout(page: Page, width: number) {
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

export async function expectWpsTimelineLayout(page: Page, width: number) {
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

export async function expectWpsComparisonLayout(page: Page, width: number) {
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

export async function expectWpsEvidenceLayout(page: Page, width: number) {
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
