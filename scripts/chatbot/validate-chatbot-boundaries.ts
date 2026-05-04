import {
  chatBoundaryCases,
  normalizeSourceIds,
  protectionValidationCases,
  sourceIdsMatch,
} from "../../tests/support/chat-boundary-cases.ts"

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

const functionsBaseUrl =
  process.env.CHAT_FUNCTIONS_BASE_URL ?? "http://127.0.0.1:54321/functions/v1"
const chatEndpoint = `${functionsBaseUrl}/chat`
const retrieveEndpoint = `${functionsBaseUrl}/chat-retrieve`

async function postJson<T>({
  url,
  body,
  headers,
}: {
  url: string
  body: unknown
  headers?: Record<string, string>
}): Promise<{ response: Response; envelope: T }> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  })

  return {
    response,
    envelope: (await response.json()) as T,
  }
}

function requireSuccess<T extends { success: boolean }>(
  envelope: T,
  label: string
): asserts envelope is T & { success: true } {
  if (!envelope.success) {
    throw new Error(`${label} returned an error envelope`)
  }
}

async function validateBoundaryCase(
  testCase: (typeof chatBoundaryCases)[number]
) {
  const { envelope: chatEnvelope } = await postJson<ChatEnvelope>({
    url: chatEndpoint,
    body: {
      question: testCase.prompt,
      context: {
        currentSectionId: testCase.currentSectionId,
      },
    },
    headers: {
      "X-Anonymous-Session-Id": `runner-${testCase.id}-${Date.now()}`,
    },
  })

  requireSuccess(chatEnvelope, `${testCase.id} chat`)

  if (chatEnvelope.data.state !== testCase.expectedState) {
    throw new Error(
      `${testCase.id}: expected ${testCase.expectedState}, received ${chatEnvelope.data.state}`
    )
  }

  const citations = chatEnvelope.data.citations ?? []
  const citationSourceIds = normalizeSourceIds(
    citations.map((citation) => citation.sourceId)
  )

  if (!sourceIdsMatch(citationSourceIds, testCase.expectedSourceIds)) {
    throw new Error(
      `${testCase.id}: expected citations ${testCase.expectedSourceIds.join(
        ", "
      )}, received ${citationSourceIds.join(", ")}`
    )
  }

  if (
    testCase.expectedCitationCount !== "atLeastOne" &&
    citations.length !== testCase.expectedCitationCount
  ) {
    throw new Error(
      `${testCase.id}: expected ${testCase.expectedCitationCount} citations, received ${citations.length}`
    )
  }

  if (testCase.expectedCitationCount === "atLeastOne" && citations.length < 1) {
    throw new Error(`${testCase.id}: expected at least one citation`)
  }

  if (!testCase.retrievalParity) {
    return
  }

  const { envelope: retrieveEnvelope } = await postJson<RetrieveEnvelope>({
    url: retrieveEndpoint,
    body: {
      question: testCase.prompt,
      context: {
        currentSectionId: testCase.currentSectionId,
      },
    },
  })

  requireSuccess(retrieveEnvelope, `${testCase.id} retrieve`)

  const retrievalSourceIds = retrieveEnvelope.data.sources.map(
    (source) => source.sourceId
  )

  if (!sourceIdsMatch(citationSourceIds, retrievalSourceIds)) {
    throw new Error(
      `${testCase.id}: chat citations do not match retrieval ids for the same prompt and section`
    )
  }
}

async function validateProtectionCase(
  testCase: (typeof protectionValidationCases)[number]
) {
  const sessionId = `runner-${testCase.sessionId}-${Date.now()}`
  let finalResponse: Response | undefined
  let finalEnvelope: ChatEnvelope | undefined

  for (const prompt of testCase.prompts) {
    const result = await postJson<ChatEnvelope>({
      url: chatEndpoint,
      body: {
        question: prompt,
        context: {
          currentSectionId: testCase.currentSectionId,
        },
      },
      headers: {
        "X-Anonymous-Session-Id": sessionId,
      },
    })

    finalResponse = result.response
    finalEnvelope = result.envelope
  }

  if (!finalResponse || !finalEnvelope) {
    throw new Error(`${testCase.id}: no protection response returned`)
  }

  requireSuccess(finalEnvelope, `${testCase.id} protection`)

  if (
    finalEnvelope.data.state !== "cooldown" ||
    finalEnvelope.data.code !== testCase.code
  ) {
    throw new Error(
      `${testCase.id}: expected cooldown ${testCase.code}, received ${finalEnvelope.data.state}`
    )
  }

  if (!finalResponse.headers.get("retry-after")) {
    throw new Error(`${testCase.id}: missing Retry-After header`)
  }

  if ((finalEnvelope.data.retryAfterSeconds ?? 0) < 1) {
    throw new Error(`${testCase.id}: missing positive retryAfterSeconds`)
  }
}

async function main() {
  const failures: string[] = []

  for (const testCase of chatBoundaryCases) {
    try {
      await validateBoundaryCase(testCase)
      console.log(`PASS ${testCase.id}: ${testCase.assertionNote}`)
    } catch (error) {
      failures.push(
        `FAIL ${testCase.id}: ${
          error instanceof Error ? error.message : "unknown validation error"
        }`
      )
      break
    }
  }

  if (failures.length === 0) {
    for (const testCase of protectionValidationCases) {
      try {
        await validateProtectionCase(testCase)
        console.log(`PASS ${testCase.id}: ${testCase.assertionNote}`)
      } catch (error) {
        failures.push(
          `FAIL ${testCase.id}: ${
            error instanceof Error ? error.message : "unknown validation error"
          }`
        )
        break
      }
    }
  }

  if (failures.length > 0) {
    console.error(failures.join("\n"))
    process.exitCode = 1
    return
  }

  console.log(
    `Validated ${chatBoundaryCases.length} boundary cases and ${protectionValidationCases.length} protection cases against ${functionsBaseUrl}.`
  )
}

await main()
