import { expect, test } from "@playwright/test"

import {
  summaryFirstSections,
  recapCues,
  expectNoHorizontalOverflow,
  expectTouchTarget,
  expectContainedWithinViewport,
  expectVisibleFocus,
  expectWpsTimelineLayout,
  expectWpsComparisonLayout,
} from "../playwright/home-page-helpers"

test("@journey source-aware chat keeps shift enter for multiline prompts", async ({
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

test("@journey source-aware chat shows weak support without unsupported certainty", async ({
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

test("@journey source-aware chat renders calm refusal with a rephrase action", async ({
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

test("@journey source-aware chat renders cooldown quickly without blocking the page", async ({
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

test("@journey UN command center organ explorer updates selection and details", async ({
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

test("@journey West Philippine Sea dossier compares the ruling and reality locally", async ({
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

test("@journey West Philippine Sea dossier timeline follows chronological selection", async ({
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

test("@journey West Philippine Sea dossier keeps canonical hash and recap handoff", async ({
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

test("@journey hash entry falls back predictably and keyboard users can activate navigation", async ({
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

test("@journey core narrative renders summary-first sections with local synthesis", async ({
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

test("@journey recap cues explain re-entry and use canonical next anchors", async ({
  page,
}) => {
  await page.goto("/")

  for (const cue of recapCues) {
    const section = page.getByRole("region", { name: cue.sectionName })
    if (cue.sectionName === "Global governance overview") {
      await expect(section.getByText("Selected relationship")).toBeVisible()
    } else {
      await expect(section.getByText("Key takeaway")).toBeVisible()
    }
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
  }
})

test("@journey dense narrative detail is keyboard-operable and preserves collapsed meaning", async ({
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

test("@journey narrative flow has transition beats without requiring an account", async ({
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
