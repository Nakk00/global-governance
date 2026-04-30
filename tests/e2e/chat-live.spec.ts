import { expect, test } from "@playwright/test"

const liveChatEndpoint = "http://127.0.0.1:54321/functions/v1/chat"
const heroPrompt =
  "How do institutions coordinate global governance without becoming a world government?"

test("@chat-live source-aware chat uses the live Supabase function for the hero prompt", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 820 })
  await page.goto("/#hero-narrative-frame")

  const trigger = page.getByRole("button", {
    name: "Open source-aware chat",
  })

  await trigger.click()

  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })
  const input = panel.getByRole("textbox", { name: "Course question" })
  const institutionsPrompt = panel.getByRole("button", {
    name: "Institutions",
  })

  await expect(panel).toBeVisible()
  await expect(institutionsPrompt).toBeVisible()
  await expect(
    panel.getByRole("button", {
      name: "UN limits",
    })
  ).toHaveCount(0)

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
    panel.getByText(/limited support in approved materials/i)
  ).toHaveCount(0)
  await expect(
    panel.getByText(/grounded with 1 approved source/i)
  ).toBeVisible()

  const courseFrameChip = panel.getByRole("button", {
    name: /Course frame/i,
  })
  await expect(courseFrameChip).toBeVisible()
  await courseFrameChip.click()
  await expect(
    panel.getByText("gg-src-global-governance-course-frame")
  ).toBeVisible()
})

test("@chat-live source-aware chat renders live refusal and cooldown states", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 820 })
  await page.goto("/#hero-narrative-frame")
  await page.getByRole("button", { name: "Open source-aware chat" }).click()

  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })
  const input = panel.getByRole("textbox", { name: "Course question" })

  await input.fill("Can you write a cooking recipe?")
  await panel.getByRole("button", { name: "Ask" }).click()

  await expect(panel.getByText("Course boundary reached")).toBeVisible()
  await expect(
    panel.getByText(/only help with this Global Governance course/i)
  ).toBeVisible()

  await input.fill("Can you predict basketball scores?")
  await panel.getByRole("button", { name: "Ask" }).click()
  await expect(panel.getByText("Course boundary reached")).toBeVisible()

  await input.fill("Help me buy a phone.")
  await panel.getByRole("button", { name: "Ask" }).click()

  await expect(panel.getByText("Assistant temporarily limited")).toBeVisible({
    timeout: 2_000,
  })
  await expect(panel.getByText(/Retry in about 60 seconds/i)).toBeVisible()
})
