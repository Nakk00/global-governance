import { expect, type Page, test } from "@playwright/test"

import {
  chatBoundaryCases,
  protectionValidationCases,
} from "../support/chat-boundary-cases"

const weakSupportCase = chatBoundaryCases.find(
  (testCase) => testCase.id === "weak-support-speculative-vote"
)
const refusedCase = chatBoundaryCases.find(
  (testCase) => testCase.id === "refused-cooking-recipe"
)
const abuseCooldownCase = protectionValidationCases.find(
  (testCase) => testCase.id === "abuse-cooldown"
)

if (!weakSupportCase || !refusedCase || !abuseCooldownCase) {
  throw new Error("Expected chat boundary fallback fixtures to be available.")
}

async function askVisibleChat(page: Page, prompt: string) {
  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })
  const input = panel.getByRole("textbox", { name: "Course question" })

  await input.fill(prompt)
  await panel.getByRole("button", { name: "Ask" }).click()

  return { panel, input }
}

test("@journey source-aware chat keeps shift enter for multiline prompts", async ({
  page,
}) => {
  await page.goto("/#hero-narrative-frame")
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

test("@journey mocked chat fallback states stay visible and recoverable in the browser", async ({
  page,
}) => {
  await page.route("**/api/chat", async (route) => {
    const request = route.request().postDataJSON() as {
      question: string
    }

    if (request.question === weakSupportCase.prompt) {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            state: "weakSupport",
            message:
              "The approved materials do not support a confident answer to that question.",
            nextStep:
              "Reframe the question around the course sources, the UN, or the West Philippine Sea Case File.",
            grounding: {
              supportLevel: "weak",
              cue: "Limited support in approved materials",
            },
            citations: [],
          },
        }),
      })
      return
    }

    if (request.question === refusedCase.prompt) {
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
              "Try a question about the UN, global governance, or the West Philippine Sea case.",
          },
        }),
      })
      return
    }

    if (request.question === abuseCooldownCase.prompts.at(-1)) {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            state: "cooldown",
            code: "abuse_cooldown",
            message:
              "The assistant is temporarily limited after repeated off-topic prompts.",
            nextStep: "Wait briefly before trying a course-focused question.",
            retryAfterSeconds: 60,
          },
        }),
      })
      return
    }

    if (request.question === "Trigger provider fallback") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            state: "fallback",
            message:
              "The assistant could not complete a grounded answer right now.",
            nextStep: "Continue with the lesson or try a course question.",
            suggestedPrompts: ["What is global governance?"],
            fallbackSource: {
              label: "Current lesson summary",
            },
          },
        }),
      })
      return
    }

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          state: "answered",
          answer: "Grounded answer",
          grounding: {
            supportLevel: "strong",
            cue: "Grounded with 1 approved source",
          },
          citations: [
            {
              sourceId: "gg-src-global-governance-course-frame",
              title: "Global Governance Course Frame",
              shortTitle: "Course frame",
              sourceType: "course",
              detail: "Course framing source.",
            },
          ],
        },
      }),
    })
  })

  await page.goto("/#hero-narrative-frame")
  await page.getByRole("button", { name: "Open source-aware chat" }).click()

  const { panel, input } = await askVisibleChat(page, weakSupportCase.prompt)
  await expect(
    panel.getByText("Limited support in approved materials")
  ).toBeVisible()
  await expect(
    panel.getByText(/do not support a confident answer/i)
  ).toBeVisible()

  await askVisibleChat(page, refusedCase.prompt)
  await expect(panel.getByText("Course boundary reached")).toBeVisible()
  const rephraseButton = panel.getByRole("button", {
    name: "Rephrase a course question",
  })
  await rephraseButton.click()
  await expect(input).toBeFocused()

  await askVisibleChat(page, "Trigger provider fallback")
  await expect(panel.getByText("Grounded answer unavailable")).toBeVisible()
  await expect(panel.getByText("Current lesson summary")).toBeVisible()
  await panel
    .getByRole("button", { name: "What is global governance?" })
    .click()
  await expect(input).toHaveValue("What is global governance?")
  await expect(page).toHaveURL(/#hero-narrative-frame$/)

  await askVisibleChat(page, abuseCooldownCase.prompts.at(-1)!)
  await expect(panel.getByText("Assistant temporarily limited")).toBeVisible()
  await expect(panel.getByText(/Retry in about 60 seconds/i)).toBeVisible()
  await panel.getByRole("button", { name: "Try again shortly" }).click()
  await expect(input).toBeFocused()
})
