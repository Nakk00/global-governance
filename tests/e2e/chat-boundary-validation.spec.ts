import { expect, type Locator, type Page, test } from "@playwright/test"

import {
  chatBoundaryCases,
  getRetrievalParityCases,
  normalizeSourceIds,
  protectionValidationCases,
  sourceIdsMatch,
} from "../playwright/chat-boundary-cases"

const functionsBaseUrl =
  process.env.CHAT_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:54321/functions/v1"
const chatEndpoint = `${functionsBaseUrl}/chat`
const retrieveEndpoint = `${functionsBaseUrl}/chat-retrieve`

type ChatEnvelope =
  | {
      success: true
      data: {
        state: "answered" | "weakSupport" | "refused" | "cooldown"
        code?: "off_topic" | "rate_limited" | "abuse_cooldown"
        retryAfterSeconds?: number
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

type RetrieveEnvelope =
  | {
      success: true
      data: {
        sources: Array<{
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

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }))

  expect(overflow.body).toBeLessThanOrEqual(overflow.viewport)
  expect(overflow.document).toBeLessThanOrEqual(overflow.viewport)
}

async function expectVisibleFocus(locator: Locator) {
  await expect(locator).toBeFocused()

  const focusStyle = await locator.evaluate((element) => {
    const style = window.getComputedStyle(element)

    return {
      boxShadow: style.boxShadow,
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

async function postChat({
  page,
  prompt,
  currentSectionId,
  sessionId,
}: {
  page: Page
  prompt: string
  currentSectionId?: string
  sessionId: string
}) {
  return page.request.post(chatEndpoint, {
    data: {
      question: prompt,
      context: {
        currentSectionId,
      },
    },
    headers: {
      "X-Anonymous-Session-Id": sessionId,
    },
  })
}

async function postRetrieve({
  page,
  prompt,
  currentSectionId,
}: {
  page: Page
  prompt: string
  currentSectionId?: string
}) {
  return page.request.post(retrieveEndpoint, {
    data: {
      question: prompt,
      context: {
        currentSectionId,
      },
    },
  })
}

async function openChat(page: Page, sessionId: string) {
  await page.addInitScript((nextSessionId) => {
    window.localStorage.setItem("global-governance-chat-session", nextSessionId)
  }, sessionId)

  await page.goto("/#hero-narrative-frame")
  await page.getByRole("button", { name: "Open source-aware chat" }).click()

  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })

  await expect(panel).toBeVisible()

  return {
    panel,
    input: panel.getByRole("textbox", { name: "Course question" }),
    askButton: panel.getByRole("button", { name: "Ask" }),
  }
}

async function askVisibleChat(page: Page, prompt: string) {
  const panel = page.getByRole("region", {
    name: "Source-aware academic chat",
  })
  const input = panel.getByRole("textbox", { name: "Course question" })

  await input.fill(prompt)
  await panel.getByRole("button", { name: "Ask" }).click()

  return panel
}

test.describe("@chat-live fixed chatbot boundary validation", () => {
  for (const testCase of chatBoundaryCases) {
    test(`@chat-live endpoint matrix case: ${testCase.id}`, async ({
      page,
    }) => {
      const response = await postChat({
        page,
        prompt: testCase.prompt,
        currentSectionId: testCase.currentSectionId,
        sessionId: `boundary-${testCase.id}-${Date.now()}`,
      })
      const envelope = (await response.json()) as ChatEnvelope

      expect(envelope.success).toBe(true)
      if (!envelope.success) {
        throw new Error(envelope.error.message)
      }

      expect(envelope.data.state).toBe(testCase.expectedState)
      const citations = envelope.data.citations ?? []
      const citationSourceIds = normalizeSourceIds(
        citations.map((citation) => citation.sourceId)
      )

      expect(citationSourceIds).toEqual(
        normalizeSourceIds(testCase.expectedSourceIds)
      )

      if (testCase.expectedCitationCount === "atLeastOne") {
        expect(citations.length).toBeGreaterThan(0)
      } else {
        expect(citations).toHaveLength(testCase.expectedCitationCount)
      }

      if (testCase.expectedState === "refused") {
        expect(envelope.data.code).toBe("off_topic")
        expect(citations).toEqual([])
      }
    })
  }

  for (const testCase of getRetrievalParityCases()) {
    test(`@chat-live retrieval parity case: ${testCase.id}`, async ({
      page,
    }) => {
      const [chatResponse, retrieveResponse] = await Promise.all([
        postChat({
          page,
          prompt: testCase.prompt,
          currentSectionId: testCase.currentSectionId,
          sessionId: `parity-${testCase.id}-${Date.now()}`,
        }),
        postRetrieve({
          page,
          prompt: testCase.prompt,
          currentSectionId: testCase.currentSectionId,
        }),
      ])
      const chatEnvelope = (await chatResponse.json()) as ChatEnvelope
      const retrieveEnvelope =
        (await retrieveResponse.json()) as RetrieveEnvelope

      expect(chatEnvelope.success).toBe(true)
      expect(retrieveEnvelope.success).toBe(true)
      if (!chatEnvelope.success || !retrieveEnvelope.success) {
        throw new Error("Expected successful chat and retrieval envelopes")
      }

      expect(chatEnvelope.data.state).toBe("answered")
      expect(
        sourceIdsMatch(
          chatEnvelope.data.citations?.map((citation) => citation.sourceId) ??
            [],
          retrieveEnvelope.data.sources.map((source) => source.sourceId)
        )
      ).toBe(true)
    })
  }

  for (const testCase of protectionValidationCases) {
    test(`@chat-live protection case: ${testCase.id}`, async ({ page }) => {
      let finalResponse: Awaited<ReturnType<typeof postChat>> | undefined
      let finalEnvelope: ChatEnvelope | undefined
      const sessionId = `${testCase.sessionId}-${Date.now()}`

      for (const prompt of testCase.prompts) {
        finalResponse = await postChat({
          page,
          prompt,
          currentSectionId: testCase.currentSectionId,
          sessionId,
        })
        finalEnvelope = (await finalResponse.json()) as ChatEnvelope
      }

      expect(finalResponse).toBeDefined()
      expect(finalEnvelope?.success).toBe(true)
      if (!finalResponse || !finalEnvelope?.success) {
        throw new Error("Expected typed cooldown envelope")
      }

      expect(finalEnvelope.data).toMatchObject({
        state: "cooldown",
        code: testCase.code,
      })
      expect(finalEnvelope.data.retryAfterSeconds).toBeGreaterThan(0)
      expect(finalResponse.headers()["retry-after"]).toBeDefined()
    })
  }

  test("@chat-live visible weak-support, refusal, and cooldown states stay accessible", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.setViewportSize({ width: 360, height: 740 })

    const { panel, input } = await openChat(
      page,
      `visible-boundary-${Date.now()}`
    )

    await expect(input).toBeFocused()
    await askVisibleChat(
      page,
      "What should tomorrow's Security Council vote be?"
    )
    await expect(
      panel.getByText(/limited support in approved materials/i)
    ).toBeVisible()
    await expect(
      panel.getByText(/do not support a confident answer/i)
    ).toBeVisible()
    await expectNoHorizontalOverflow(page)

    await page.setViewportSize({ width: 768, height: 820 })
    await askVisibleChat(page, "Can you write a cooking recipe?")
    await expect(panel.getByText("Course boundary reached")).toBeVisible()
    const rephraseButton = panel.getByRole("button", {
      name: "Rephrase a course question",
    })
    await rephraseButton.focus()
    await expectVisibleFocus(rephraseButton)
    await rephraseButton.click()
    await expect(input).toBeFocused()
    await expectNoHorizontalOverflow(page)

    await page.setViewportSize({ width: 1024, height: 820 })
    await askVisibleChat(page, "Can you predict basketball scores?")
    await expect(panel.getByText("Course boundary reached")).toBeVisible()
    await askVisibleChat(page, "Help me buy a phone.")
    await expect(panel.getByText("Assistant temporarily limited")).toBeVisible()
    await expect(panel.getByText(/Retry in about \d+ seconds/i)).toBeVisible()
    const retryButton = panel.getByRole("button", {
      name: "Try again shortly",
    })
    await retryButton.focus()
    await expectVisibleFocus(retryButton)
    await retryButton.click()
    await expect(input).toBeFocused()
    await expectNoHorizontalOverflow(page)
  })

  test("@chat-live storage-constrained anonymous session fallback stays deterministic", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const originalLocalStorage = window.localStorage

      Object.defineProperty(window, "localStorage", {
        configurable: true,
        value: {
          get length() {
            return originalLocalStorage.length
          },
          clear() {
            originalLocalStorage.clear()
          },
          getItem(key: string) {
            if (key === "global-governance-chat-session") {
              throw new Error("chat session storage blocked for validation")
            }

            return originalLocalStorage.getItem(key)
          },
          key(index: number) {
            return originalLocalStorage.key(index)
          },
          removeItem(key: string) {
            originalLocalStorage.removeItem(key)
          },
          setItem(key: string, value: string) {
            if (key === "global-governance-chat-session") {
              throw new Error("chat session storage blocked for validation")
            }

            originalLocalStorage.setItem(key, value)
          },
        },
      })
    })

    await page.goto("/#un-command-center")
    await page.getByRole("button", { name: "Open source-aware chat" }).click()

    const panel = page.getByRole("region", {
      name: "Source-aware academic chat",
    })
    const input = panel.getByRole("textbox", { name: "Course question" })
    const chatResponsePromise = page.waitForResponse(
      (response) =>
        response.url() === chatEndpoint &&
        response.request().method() === "POST"
    )

    await input.fill("How does the UN coordinate global governance?")
    await panel.getByRole("button", { name: "Ask" }).click()

    const chatResponse = await chatResponsePromise
    const envelope = (await chatResponse.json()) as ChatEnvelope

    expect(chatResponse.ok()).toBe(true)
    expect(envelope.success).toBe(true)
    if (!envelope.success) {
      throw new Error(envelope.error.message)
    }

    expect(envelope.data.state).toBe("answered")
    expect(
      normalizeSourceIds(
        envelope.data.citations?.map((citation) => citation.sourceId) ?? []
      )
    ).toEqual([
      "gg-src-global-governance-course-frame",
      "gg-src-un-charter-institutions",
    ])
    await expect(panel.getByText(/Grounded with/i)).toBeVisible()
  })
})
