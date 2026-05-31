import { expect, test } from "@playwright/test"

import {
  chapterNames,
  storyWidths,
  expectNoHorizontalOverflow,
  waitForScrollIdle,
  waitForDocumentFonts,
  waitForElementOrder,
  expectTouchTarget,
  expectContainedWithinViewport,
  expectVisibleFocus,
} from "../playwright/home-page-helpers"

test("@smoke home page opens the journey and continues in-page", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

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

test("@smoke desktop navigation jumps between chapter sections and restores history", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })

  const topNav = page.getByRole("navigation", { name: "Primary" })
  const dossier = page.getByRole("region", {
    name: "West Philippine Sea dossier",
  })

  for (const chapterName of chapterNames) {
    await expect(topNav.getByRole("link", { name: chapterName })).toBeVisible()
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

  await topNav
    .getByRole("link", { name: "West Philippine Sea dossier" })
    .click()
  await expect(page).toHaveURL(/#west-philippine-sea-dossier$/)
  await expect(dossier).toBeFocused()
  await expect(
    topNav.getByRole("link", { name: "West Philippine Sea dossier" })
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

test("@smoke UN command center introduces an explorable shell with keyboard entry", async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion })

    for (const width of storyWidths) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto("/#un-command-center")
      await waitForDocumentFonts(page)
      await waitForScrollIdle(page)

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
      if (width >= 1024) {
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
        await waitForScrollIdle(page)
        const mobileNav = page.getByRole("navigation", {
          name: "Mobile chapters",
        })

        if (!(await mobileNav.isVisible().catch(() => false))) {
          const openNavigation = page.getByRole("button", {
            name: "Open navigation",
          })
          await expect(openNavigation).toBeVisible()
          await openNavigation.click()
        }

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

test("@smoke West Philippine Sea dossier opens as an anchored case file shell", async ({
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

      await waitForElementOrder([timeline, comparison, entryControls])

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

test("@smoke conclusion references are inspectable, keyboard-safe, and contained", async ({
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
