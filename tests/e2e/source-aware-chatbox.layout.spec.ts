import { expect, test } from "@playwright/test"

import {
  expectContainedWithinViewport,
  expectNoHorizontalOverflow,
} from "../playwright/home-page-helpers"

test("@layout source-aware chat hides the launcher while open and stays inside desktop and narrow viewports", async ({
  page,
}) => {
  const viewports = [
    { width: 1365, height: 920, hash: "#un-command-center" },
    { width: 1365, height: 768, hash: "#global-governance-overview" },
    { width: 390, height: 844, hash: "#west-philippine-sea-dossier" },
  ]

  for (const viewport of viewports) {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    })
    await page.goto(`/${viewport.hash}`, { waitUntil: "domcontentloaded" })

    const trigger = page.getByRole("button", {
      name: "Open source-aware chat",
    })
    await expect(trigger).toBeVisible()
    await trigger.click()

    const panel = page.getByRole("region", {
      name: "Source-aware academic chat",
    })
    await expect(panel).toBeVisible()
    await expect(page.getByRole("button", { name: "Open source-aware chat" })).toHaveCount(0)
    await expectContainedWithinViewport(panel, viewport.width)
    await expectNoHorizontalOverflow(page)

    const panelBox = await panel.boundingBox()
    expect(panelBox).not.toBeNull()
    expect(panelBox!.y).toBeGreaterThanOrEqual(0)
    expect(panelBox!.y + panelBox!.height).toBeLessThanOrEqual(viewport.height)

    await panel.getByRole("button", { name: "Close source-aware chat" }).click()
    await expect(panel).toBeHidden()
    await expect(
      page.getByRole("button", { name: "Open source-aware chat" })
    ).toBeFocused()
  }
})

test("@layout source-aware chat keeps prior turns visible and caps the multiline composer", async ({
  page,
}) => {
  await page.route("**/api/chat", async (route) => {
    const request = route.request().postDataJSON() as {
      question: string
    }
    const data =
      request.question ===
      "How does the West Philippine Sea ruling show the enforcement gap?\nList one legal point.\nList one political point.\nAdd one governance takeaway.\nTie it back to institutions.\nKeep it grounded."
        ? {
            state: "answered",
            answer:
              "The ruling clarified legal rights, while post-award conduct showed that institutions still depend on political follow-through.",
            grounding: {
              supportLevel: "strong",
              cue: "Grounded with 1 approved source",
            },
            citations: [
              {
                sourceId: "gg-src-south-china-sea-award",
                title: "South China Sea Arbitration Award",
                shortTitle: "SCS award",
                sourceType: "case",
                detail: "Explains the legal findings relevant to the prompt.",
              },
            ],
          }
        : {
            state: "weakSupport",
            message: "Approved materials offer only partial support.",
            nextStep: "Narrow the question to the current lesson.",
            grounding: {
              supportLevel: "weak",
              cue: "Limited support in approved materials",
            },
            citations: [],
          }

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data }),
    })
  })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/#west-philippine-sea-dossier", {
    waitUntil: "domcontentloaded",
  })
  await page.getByRole("button", { name: "Open source-aware chat" }).click()

  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })
  const input = panel.getByRole("textbox", { name: "Course question" })
  const longQuestion =
    "How does the West Philippine Sea ruling show the enforcement gap?\nList one legal point.\nList one political point.\nAdd one governance takeaway.\nTie it back to institutions.\nKeep it grounded."

  await input.fill(longQuestion)

  const composerMetrics = await input.evaluate((element) => {
    const style = window.getComputedStyle(element)

    return {
      height: Number.parseFloat(style.height),
      overflowY: style.overflowY,
    }
  })

  expect(composerMetrics.height).toBeLessThanOrEqual(144)
  expect(["auto", "hidden"]).toContain(composerMetrics.overflowY)

  await panel.getByRole("button", { name: "Ask" }).click()
  await expect(panel.getByText("Grounded with 1 approved source")).toBeVisible()

  await input.fill("Ask for weak support")
  await panel.getByRole("button", { name: "Ask" }).click()
  await expect(
    panel.getByText("Limited support in approved materials")
  ).toBeVisible()

  await expect(
    panel.getByText(
      "How does the West Philippine Sea ruling show the enforcement gap?"
    )
  ).toBeVisible()
  await expect(panel.getByText("Ask for weak support")).toBeVisible()
  await expect(
    panel.getByText(
      "The ruling clarified legal rights, while post-award conduct showed that institutions still depend on political follow-through."
    )
  ).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

test("@layout source-aware chat submits prompt chips and boundary recovery actions", async ({
  page,
}) => {
  const requestedQuestions: string[] = []

  await page.route("**/api/chat", async (route) => {
    const request = route.request().postDataJSON() as {
      question: string
    }
    requestedQuestions.push(request.question)

    const data =
      request.question.toLowerCase() === "what is global governance?"
        ? {
            state: "refused",
            code: "off_topic",
            message:
              "I can help with questions about this Global Governance course and its approved materials.",
            nextStep:
              "Try asking about global governance, the UN, institutions, or the current lesson.",
          }
        : {
            state: "answered",
            answer:
              "The UN gives states a recurring place to coordinate action while enforcement still depends on political agreement.",
            grounding: {
              supportLevel: "strong",
              cue: "Grounded with 1 approved source",
            },
            citations: [
              {
                sourceId: "gg-src-un-charter-institutions",
                title: "Charter of the United Nations",
                shortTitle: "UN Charter",
                sourceType: "primary",
                detail: "Supports the institutional explanation.",
              },
            ],
          }

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data }),
    })
  })

  await page.setViewportSize({ width: 1365, height: 768 })
  await page.goto("/#global-governance-overview", {
    waitUntil: "domcontentloaded",
  })
  await page.getByRole("button", { name: "Open source-aware chat" }).click()

  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })
  await panel.getByRole("button", { name: "UN limits" }).click()
  await expect(panel.getByText("Grounded with 1 approved source")).toBeVisible()
  expect(requestedQuestions[0]).toBe(
    "Where does the UN help coordinate states, and where do its enforcement limits show up?"
  )

  const input = panel.getByRole("textbox", { name: "Course question" })
  await input.fill("what is global governance?")
  await panel.getByRole("button", { name: "Ask" }).click()
  await expect(panel.getByText("Course boundary reached")).toBeVisible()

  await panel.getByRole("button", { name: "Rephrase a course question" }).click()
  await expect(
    panel.getByText(
      "The UN gives states a recurring place to coordinate action while enforcement still depends on political agreement."
    )
  ).toHaveCount(2)
  expect(requestedQuestions).toContain(
    "Where does the UN help coordinate states, and where do its enforcement limits show up?"
  )
})
