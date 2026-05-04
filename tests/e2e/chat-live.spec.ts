import { expect, type Page, test } from "@playwright/test"

const liveChatEndpoint = "http://127.0.0.1:54321/functions/v1/chat"
const heroPrompt =
  "How do institutions coordinate global governance without becoming a world government?"

async function openLiveChat(page: Page) {
  await page.setViewportSize({ width: 1024, height: 820 })
  await page.goto("/#hero-narrative-frame")
  await page.getByRole("button", { name: "Open source-aware chat" }).click()

  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })

  await expect(panel).toBeVisible()

  return {
    panel,
    input: panel.getByRole("textbox", { name: "Course question" }),
  }
}

test("@chat-live source-aware chat uses the live Supabase function for the hero prompt", async ({
  page,
}) => {
  const { panel, input } = await openLiveChat(page)
  const institutionsPrompt = panel.getByRole("button", {
    name: "Institutions",
  })

  await institutionsPrompt.click()
  await expect(input).toHaveValue(heroPrompt)

  const chatResponsePromise = page.waitForResponse(
    (response) =>
      response.url() === liveChatEndpoint &&
      response.request().method() === "POST"
  )

  await panel.getByRole("button", { name: "Ask" }).click()
  await expect(panel.getByRole("button", { name: "Asking" })).toBeVisible()

  const chatResponse = await chatResponsePromise
  expect(chatResponse.ok()).toBe(true)

  const requestPayload = chatResponse.request().postDataJSON() as {
    question: string
    context?: {
      currentSectionId?: string
    }
  }

  expect(requestPayload).toEqual({
    question: heroPrompt,
    context: {
      currentSectionId: "hero-narrative-frame",
    },
  })

  const envelope = (await chatResponse.json()) as
    | {
        success: true
        data: {
          state: "answered" | "weakSupport" | "refused" | "cooldown"
          citations?: Array<{
            sourceId: string
          }>
        }
      }
    | {
        success: false
        error: {
          code: string
          message: string
        }
      }

  expect(envelope.success).toBe(true)
  if (!envelope.success) {
    throw new Error(
      `Live chat backend was reachable but returned an error: ${envelope.error.code} ${envelope.error.message}`
    )
  }

  expect(envelope.data.state).toBe("answered")
  if (envelope.data.state !== "answered") {
    throw new Error(
      `Expected hero prompt to be answered by the live chat backend, received ${envelope.data.state} instead.`
    )
  }

  expect(
    envelope.data.citations?.map((citation) => citation.sourceId)
  ).toContain("gg-src-global-governance-course-frame")

  await expect(
    panel.getByText(/grounded with 1 approved source/i)
  ).toBeVisible()
})

test("@chat-live source-aware chat renders a live refusal for off-topic prompts", async ({
  page,
}) => {
  const { panel, input } = await openLiveChat(page)

  await input.fill("Can you write a cooking recipe?")
  await panel.getByRole("button", { name: "Ask" }).click()

  await expect(panel.getByText("Course boundary reached")).toBeVisible()
  await expect(
    panel.getByText(/only help with this Global Governance course/i)
  ).toBeVisible()
})

test("@chat-live source-aware chat enters cooldown after repeated off-topic prompts", async ({
  page,
}) => {
  const { panel, input } = await openLiveChat(page)

  for (const prompt of [
    "Can you write a cooking recipe?",
    "Can you predict basketball scores?",
    "Help me buy a phone.",
  ]) {
    await input.fill(prompt)
    await panel.getByRole("button", { name: "Ask" }).click()
  }

  await expect(panel.getByText("Assistant temporarily limited")).toBeVisible({
    timeout: 2_000,
  })
  await expect(panel.getByText(/Retry in about \d+ seconds/i)).toBeVisible()
})
