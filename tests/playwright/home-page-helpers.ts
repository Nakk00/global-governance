import { expect, type Locator, type Page } from "@playwright/test"

export const chapterNames = [
  "Hero Narrative Frame",
  "Global Governance Overview",
  "The System Under Pressure",
  "West Philippine Sea Case File",
]

export const narrativeSections = [
  "Global Governance Overview",
  "The System Under Pressure",
  "West Philippine Sea Case File",
]

export const summaryFirstSections = [
  "The System Under Pressure",
  "West Philippine Sea Case File",
]

export const recapCues = [
  {
    sectionId: "global-governance-overview",
    sectionName: "Global Governance Overview",
    cueName: "Continue to The System Under Pressure",
    hash: /#un-command-center$/,
    targetName: "The System Under Pressure",
  },
  {
    sectionId: "un-command-center",
    sectionName: "The System Under Pressure",
    cueName: "Continue to West Philippine Sea Case File",
    hash: /#west-philippine-sea-dossier$/,
    targetName: "West Philippine Sea Case File",
  },
  {
    sectionId: "west-philippine-sea-dossier",
    sectionName: "West Philippine Sea Case File",
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
    name: "The System Under Pressure",
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
