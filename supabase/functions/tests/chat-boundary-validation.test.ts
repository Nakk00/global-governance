import { describe, expect, it } from "vitest"

import {
  chatBoundaryCases,
  normalizeSourceIds,
  protectionValidationCases,
  sourceIdsMatch,
} from "../../../tests/support/chat-boundary-cases"
import {
  assembleGroundedChatResponse,
  createCooldownChatResponse,
  createRefusedChatResponse,
  retrieveApprovedSources,
} from "../_shared/chat-grounding"
import {
  createMemoryProtectionStore,
  evaluateChatProtection,
  resetProtectionStore,
  resolveAnonymousSessionId,
} from "../_shared/chat-protection"

describe("fixed chat boundary validation matrix", () => {
  it("uses explicit anonymous session ids before network fingerprints for validation isolation", async () => {
    const firstSession = await resolveAnonymousSessionId(
      new Request("http://localhost/functions/v1/chat", {
        headers: {
          "x-anonymous-session-id": "boundary-session-one",
          "x-forwarded-for": "203.0.113.10",
          "user-agent": "boundary-test",
        },
      })
    )
    const secondSession = await resolveAnonymousSessionId(
      new Request("http://localhost/functions/v1/chat", {
        headers: {
          "x-anonymous-session-id": "boundary-session-two",
          "x-forwarded-for": "203.0.113.10",
          "user-agent": "boundary-test",
        },
      })
    )

    expect(firstSession).not.toBe(secondSession)
  })

  it.each(chatBoundaryCases)(
    "keeps $id aligned across protection, retrieval, and grounded response helpers",
    async (testCase) => {
      const store = createMemoryProtectionStore()
      const protectionDecision = await evaluateChatProtection({
        sessionId: `boundary-${testCase.id}`,
        question: testCase.prompt,
        currentSectionId: testCase.currentSectionId,
        now: 1_000,
        store,
      })

      const response =
        protectionDecision.state === "refused"
          ? createRefusedChatResponse()
          : assembleGroundedChatResponse({
              question: testCase.prompt,
              sources: retrieveApprovedSources(testCase.prompt, {
                currentSectionId: testCase.currentSectionId,
              }),
              context: {
                currentSectionId: testCase.currentSectionId,
              },
            })

      expect(response.success).toBe(true)
      expect(response.data.state).toBe(testCase.expectedState)

      const citations =
        "citations" in response.data ? response.data.citations : []
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

      if (testCase.expectedState === "answered") {
        expect(protectionDecision.state).toBe("allowed")
        expect(citationSourceIds).toEqual(
          expect.arrayContaining(testCase.expectedSourceIds)
        )
      }

      if (testCase.expectedState === "weakSupport") {
        expect(citations).toEqual([])
        expect(response.data).toMatchObject({
          state: "weakSupport",
          grounding: {
            supportLevel: "weak",
          },
        })
      }

      if (testCase.expectedState === "refused") {
        expect(protectionDecision.state).toBe("refused")
        expect("citations" in response.data).toBe(false)
      }

      await resetProtectionStore(store)
    }
  )

  it.each(chatBoundaryCases.filter((testCase) => testCase.retrievalParity))(
    "matches answered citation ids to retrieval ids for $id",
    (testCase) => {
      const sources = retrieveApprovedSources(testCase.prompt, {
        currentSectionId: testCase.currentSectionId,
      })
      const response = assembleGroundedChatResponse({
        question: testCase.prompt,
        sources,
        context: {
          currentSectionId: testCase.currentSectionId,
        },
      })

      expect(response.success).toBe(true)
      expect(response.data.state).toBe("answered")
      if (response.data.state !== "answered") {
        throw new Error("Expected answered state")
      }

      expect(
        sourceIdsMatch(
          response.data.citations.map((citation) => citation.sourceId),
          sources.map((source) => source.sourceId)
        )
      ).toBe(true)
    }
  )

  it.each(protectionValidationCases)(
    "observes typed protection cooldown for $id",
    async (testCase) => {
      const store = createMemoryProtectionStore()
      let finalDecision: Awaited<ReturnType<typeof evaluateChatProtection>> = {
        state: "allowed",
      }

      for (const [index, prompt] of testCase.prompts.entries()) {
        finalDecision = await evaluateChatProtection({
          sessionId: testCase.sessionId,
          question: prompt,
          currentSectionId: testCase.currentSectionId,
          now: 1_000 + index,
          store,
        })
      }

      expect(finalDecision).toMatchObject({
        state: "cooldown",
        code: testCase.code,
        retryAfterSeconds: testCase.expectedRetryAfterSeconds,
      })

      if (finalDecision.state !== "cooldown") {
        throw new Error("Expected cooldown")
      }

      expect(
        createCooldownChatResponse({
          code: finalDecision.code,
          retryAfterSeconds: finalDecision.retryAfterSeconds,
        })
      ).toMatchObject({
        success: true,
        data: {
          state: "cooldown",
          code: testCase.code,
          retryAfterSeconds: testCase.expectedRetryAfterSeconds,
        },
      })

      await resetProtectionStore(store)
    }
  )
})
