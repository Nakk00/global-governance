import { expect, type Page, type Response, test } from "@playwright/test"

const liveChatEndpointPath = "/api/chat"
const liveChatResponseTimeoutMs = 75_000

test.describe.configure({ timeout: 90_000 })

function isLiveChatResponse(response: Response) {
  const url = new URL(response.url())

  return (
    url.pathname.replace(/\/+$/, "") === liveChatEndpointPath &&
    response.request().method() === "POST"
  )
}

function waitForLiveChatResponse(page: Page) {
  return page.waitForResponse(isLiveChatResponse, {
    timeout: liveChatResponseTimeoutMs,
  })
}

async function openLiveChat(page: Page) {
  await page.setViewportSize({ width: 1024, height: 820 })
  await page.goto("/#un-command-center")
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

test("@chat-live source-aware chat returns one grounded Django answer", async ({
  page,
}) => {
  const { panel, input } = await openLiveChat(page)
  const question = "How does the UN coordinate collective action?"

  await panel.getByRole("button", { name: "Expert depth" }).click()
  await input.fill(question)
  const chatResponsePromise = waitForLiveChatResponse(page)
  await panel.getByRole("button", { name: "Ask" }).click()

  const chatResponse = await chatResponsePromise
  expect(chatResponse.status()).toBe(200)
  expect(chatResponse.request().postDataJSON()).toEqual({
    question,
    context: {
      currentSectionId: "un-command-center",
      depthMode: "expert",
    },
  })

  const envelope = (await chatResponse.json()) as {
    success: true
    data: {
      state: string
      citations?: unknown[]
    }
  }
  expect(envelope.success).toBe(true)
  expect(envelope.data.state).toBe("answered")
  expect(envelope.data.citations?.length).toBeGreaterThan(0)
  await expect(panel.getByText("Source support")).toBeVisible()
})

test("@chat-live source-aware chat returns a bounded Django refusal", async ({
  page,
}) => {
  const { panel, input } = await openLiveChat(page)

  await input.fill("Write a cooking recipe for dinner.")
  const chatResponsePromise = waitForLiveChatResponse(page)
  await panel.getByRole("button", { name: "Ask" }).click()

  const chatResponse = await chatResponsePromise
  expect(chatResponse.status()).toBe(200)
  const envelope = (await chatResponse.json()) as {
    success: true
    data: {
      state: string
      code?: string
    }
  }
  expect(envelope.success).toBe(true)
  expect(envelope.data).toMatchObject({
    state: "refused",
    code: "off_topic",
  })
  await expect(panel.getByText("Course boundary reached")).toBeVisible()
})

test("@chat-live repeated refusals create a Redis-backed cooldown", async ({
  page,
}) => {
  const { panel, input } = await openLiveChat(page)
  await page.evaluate(() => {
    window.localStorage.setItem(
      "global-governance-chat-session",
      `chat-live-cooldown-${Date.now()}`
    )
  })

  let finalStatus = 0
  let finalData: { state?: string; code?: string } = {}
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await input.fill("Write a cooking recipe for dinner.")
    const responsePromise = waitForLiveChatResponse(page)
    await panel.getByRole("button", { name: "Ask" }).click()
    const response = await responsePromise
    finalStatus = response.status()
    finalData = ((await response.json()) as { data: typeof finalData }).data
  }

  expect(finalStatus).toBe(429)
  expect(finalData).toMatchObject({
    state: "cooldown",
    code: "abuse_cooldown",
  })
  await expect(panel.getByText("Assistant temporarily limited")).toBeVisible()
})
