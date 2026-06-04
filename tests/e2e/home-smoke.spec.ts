import { expect, test } from "@playwright/test"

import {
  chapterNames,
  storyWidths,
  expectNoHorizontalOverflow,
  waitForScrollIdle,
  waitForDocumentFonts,
  expectTouchTarget,
  expectContainedWithinViewport,
  expectVisibleFocus,
} from "../playwright/home-page-helpers"

test("@smoke home page opens the journey and continues in-page", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const continueLink = page.getByRole("link", { name: "Begin the journey" })
  const overview = page.getByRole("region", {
    name: "Global Governance Overview",
  })

  await expect(
    page.getByRole("heading", { name: "Global Governance", exact: true })
  ).toBeVisible()
  await expect(page.getByText(/step into an interactive guide/i)).toBeVisible()
  await expect(continueLink).toBeVisible()

  await continueLink.focus()
  await expect(continueLink).toBeFocused()
  await page.keyboard.press("Enter")

  await expect(page).toHaveURL(/#global-governance-overview$/)
  await expect(overview).toBeVisible()
  await expect(overview).toBeFocused()
})

test("@smoke legacy journey-start hash redirects to Chapter 2", async ({
  page,
}) => {
  await page.goto("/#journey-start", { waitUntil: "domcontentloaded" })

  const overview = page.getByRole("region", {
    name: "Global Governance Overview",
  })

  await expect(page).toHaveURL(/#global-governance-overview$/)
  await expect(overview).toBeFocused()
})

test("@smoke desktop navigation jumps between chapter sections and restores history", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const topNav = page.getByRole("navigation", { name: "Primary" })
  const systemPressure = page.getByRole("region", {
    name: "The System Under Pressure",
  })
  const dossier = page.getByRole("region", {
    name: "West Philippine Sea Case File",
  })

  for (const chapterName of chapterNames) {
    await expect(topNav.getByRole("link", { name: chapterName })).toBeVisible()
  }

  await topNav.getByRole("link", { name: "The System Under Pressure" }).click()
  await expect(page).toHaveURL(/#un-command-center$/)
  await expect(systemPressure).toBeFocused()
  await expect(
    topNav.getByRole("link", { name: "The System Under Pressure" })
  ).toHaveAttribute("aria-current", "location")

  await topNav
    .getByRole("link", { name: "West Philippine Sea Case File" })
    .click()
  await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
  await expect(dossier).toBeFocused()
  await expect(
    topNav.getByRole("link", { name: "West Philippine Sea Case File" })
  ).toHaveAttribute("aria-current", "location")

  await page.goBack()
  await expect(page).toHaveURL(/#un-command-center$/)
  await expect(systemPressure).toBeFocused()

  await page.reload()
  await expect(page).toHaveURL(/#un-command-center$/)
  await expect(systemPressure).toBeFocused()
})

test("@smoke source-aware chat opens from the shell without disrupting the learning flow", async ({
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
    name: "West Philippine Sea Case File",
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
  await sourceChip.focus()
  await expectVisibleFocus(sourceChip)
  await page.keyboard.press("Enter")
  await expect(sourceChip).toHaveAttribute("aria-expanded", "true")
  await expect(panel.getByText("gg-src-un-charter-institutions")).toBeVisible()
  await expectNoHorizontalOverflow(page)

  await page.keyboard.press("Escape")
  await expect(panel).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
})

test("@smoke system under pressure introduces a keyboard-safe chapter shell", async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion })

    for (const width of storyWidths) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto("/#un-command-center")
      await waitForDocumentFonts(page)
      await waitForScrollIdle(page)

      const systemPressure = page.getByRole("region", {
        name: "The System Under Pressure",
      })
      const generalAssembly = systemPressure.getByRole("button", {
        name: /General Assembly/i,
      })
      const securityCouncil = systemPressure.getByRole("button", {
        name: /Security Council/i,
      })
      const roomsTogether = systemPressure.getByRole("button", {
        name: "How the system rooms work together",
      })
      const pressureFlow = systemPressure.getByRole("region", {
        name: /pressure flow/i,
      })

      await expect(systemPressure).toBeVisible()
      await expect(systemPressure).toBeFocused()
      await expect(
        systemPressure.getByRole("heading", {
          name: "The System Under Pressure",
        })
      ).toBeVisible()
      await expect(
        systemPressure.getByText(/Institutions organize cooperation/i)
      ).toBeVisible()
      await expect(
        pressureFlow.getByRole("heading", { name: "Rules" })
      ).toBeVisible()
      await expect(
        pressureFlow.getByRole("heading", { name: "Outcomes" })
      ).toBeVisible()
      await expect(
        systemPressure.getByText("Uneven Enforcement", { exact: true })
      ).toBeVisible()
      await expect(
        systemPressure.getByRole("link", {
          name: "Continue to West Philippine Sea Case File",
        })
      ).toBeVisible()

      for (const control of [generalAssembly, securityCouncil, roomsTogether]) {
        await expect(control).toBeVisible()
        await expectTouchTarget(control)
        await control.focus()
        await expectVisibleFocus(control)
      }

      await expectNoHorizontalOverflow(page)
      if (width >= 1024) {
        await expect(
          page
            .getByRole("navigation", { name: "Primary" })
            .getByRole("link", { name: "The System Under Pressure" })
        ).toHaveAttribute("aria-current", "location")
      } else {
        const navigationToggle = page.getByRole("button", {
          name: /navigation/i,
        })
        await expect(navigationToggle).toBeVisible()

        if ((await navigationToggle.getAttribute("aria-expanded")) !== "true") {
          await navigationToggle.click()
        }

        const mobileNav = page.getByRole("navigation", {
          name: "Mobile chapters",
        })
        const mobilePressureLink = mobileNav.getByRole("link", {
          name: "The System Under Pressure",
        })

        await expect(mobilePressureLink).toBeVisible()
        await expect(mobilePressureLink).toHaveAttribute("data-state", "active")
        await expect(
          mobileNav.getByText(/Current chapter:\s*The System Under Pressure/)
        ).toBeVisible()
      }
    }
  }
})

test("@smoke West Philippine Sea case file opens as an anchored case surface", async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion })

    for (const width of [360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 920 })
      await page.goto("/#west-philippine-sea-dossier")
      await waitForDocumentFonts(page)
      await waitForScrollIdle(page)

      const dossier = page.getByRole("region", {
        name: "West Philippine Sea Case File",
      })
      const timeline = dossier.getByRole("region", { name: "Timeline" })
      const map = dossier.getByRole("region", { name: "Maritime Case Map" })
      const evidence = dossier.getByRole("region", { name: "Evidence" })
      const comparison = dossier.getByRole("region", {
        name: "Ruling vs Reality",
      })
      const finalAward = timeline.getByRole("button", {
        name: /2016.*Final Award/i,
      })
      const legalFindings = evidence.getByRole("button", {
        name: "Inspect evidence for Legal Findings (2016 Award)",
      })

      await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
      await expect(dossier).toBeVisible()
      await expect(dossier).toBeFocused()
      await expect(
        dossier.getByRole("heading", {
          name: "West Philippine Sea Case File",
        })
      ).toBeVisible()
      await expect(dossier.getByText("Chapter 4")).toBeVisible()
      await expect(timeline).toBeVisible()
      await expect(map).toBeVisible()
      await expect(evidence).toBeVisible()
      await expect(comparison).toBeVisible()
      await expect(
        dossier.getByRole("region", { name: "References & Sources" })
      ).toBeVisible()
      await expect(
        dossier.getByRole("region", { name: "Source Trust Guide" })
      ).toBeVisible()
      await expect(
        dossier.getByText(/Nine-dash line has no legal basis/i)
      ).toBeVisible()

      for (const control of [finalAward, legalFindings]) {
        await expect(control).toBeVisible()
        await expectTouchTarget(control)
        await expectContainedWithinViewport(control, width)
        await control.focus()
        await expectVisibleFocus(control)
      }

      await finalAward.press("Enter")
      await expect(map.getByText("2016")).toBeVisible()
      await expect(
        map.getByText("Legal clarity enters the record.")
      ).toBeVisible()

      await legalFindings.press("Enter")
      await expect(evidence.getByText("Tribunal Award")).toBeVisible()
      await expectNoHorizontalOverflow(page)
    }
  }
})
