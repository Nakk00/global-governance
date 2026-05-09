import { http, HttpResponse } from "msw"

import {
  adminIdentity,
  answeredChatResponse,
  chunkDetail,
  chunkInspection,
  citationDetail,
  citationInspection,
  cooldownChatResponse,
  refusedChatResponse,
  sourceDetail,
  stewardshipDashboard,
  validationRun,
  validationRunList,
  validationSets,
  weakSupportChatResponse,
} from "./fixtures"

export const localChatEndpoint = "http://127.0.0.1:54321/functions/v1/chat"

type EnvelopeErrorDetails = {
  fields?: Record<string, string>
}

export function successEnvelope<T>(data: T) {
  return {
    success: true,
    data,
    error: null,
    meta: {},
  }
}

export function errorEnvelope(
  code: string,
  message: string,
  status: number,
  details?: EnvelopeErrorDetails
) {
  return {
    success: false,
    data: null,
    error: {
      code,
      message,
      status,
      ...(details ? { details } : {}),
    },
    meta: {},
  }
}

function createChatHandlers(
  resolver: Parameters<typeof http.post>[1]
): ReturnType<typeof http.post>[] {
  return [
    http.post(localChatEndpoint, resolver),
    http.post("/functions/v1/chat", resolver),
  ]
}

export function mockChatAnswered(response = answeredChatResponse) {
  return createChatHandlers(() => HttpResponse.json(successEnvelope(response)))
}

export function mockChatWeakSupport(response = weakSupportChatResponse) {
  return createChatHandlers(() => HttpResponse.json(successEnvelope(response)))
}

export function mockChatRefused(response = refusedChatResponse) {
  return createChatHandlers(() => HttpResponse.json(successEnvelope(response)))
}

export function mockChatCooldown(response = cooldownChatResponse) {
  return createChatHandlers(() =>
    HttpResponse.json(successEnvelope(response), { status: 429 })
  )
}

export function mockChatResponsesByQuestion(
  responses: Record<string, unknown>,
  fallbackResponse: unknown = answeredChatResponse
) {
  return createChatHandlers(async ({ request }) => {
    const payload = (await request.json()) as { question?: string }
    const response = responses[payload.question ?? ""] ?? fallbackResponse
    const status =
      typeof response === "object" &&
      response !== null &&
      "state" in response &&
      response.state === "cooldown"
        ? 429
        : 200

    return HttpResponse.json(successEnvelope(response), { status })
  })
}

export function mockAdminMe(response = adminIdentity) {
  return http.get("/api/admin/me", () =>
    HttpResponse.json(successEnvelope(response))
  )
}

export function mockMaintainerDashboard(response = stewardshipDashboard) {
  return http.get("/api/admin/sources", () =>
    HttpResponse.json(successEnvelope(response))
  )
}

export function mockSourceDetail(response = sourceDetail) {
  return http.get("/api/admin/sources/:sourceId", ({ params }) => {
    if (params.sourceId === "gg-src-south-china-sea-award") {
      return HttpResponse.json(
        successEnvelope({
          ...response,
          ...stewardshipDashboard.sources[1],
          summary: "South China Sea arbitration record.",
          metadata: {},
          approvalLineage: [],
          ingestionProvenance: [],
          validationHistory: [],
          auditTrail: [],
        })
      )
    }

    return HttpResponse.json(successEnvelope(response))
  })
}

export function mockSourceChunks(response = chunkInspection) {
  return http.get("/api/admin/sources/:sourceId/chunks", () =>
    HttpResponse.json(successEnvelope(response))
  )
}

export function mockSourceCitations(response = citationInspection) {
  return http.get("/api/admin/sources/:sourceId/citations", () =>
    HttpResponse.json(successEnvelope(response))
  )
}

export function mockChunkDetail(response = chunkDetail) {
  return http.get("/api/admin/chunks/:chunkId", () =>
    HttpResponse.json(successEnvelope(response))
  )
}

export function mockCitationDetail(response = citationDetail) {
  return http.get("/api/admin/citations/:citationId", () =>
    HttpResponse.json(successEnvelope(response))
  )
}

export function mockValidationSets(response = validationSets) {
  return http.get("/api/admin/validation-sets", () =>
    HttpResponse.json(successEnvelope(response))
  )
}

export function mockValidationRuns(response = validationRunList) {
  return http.get("/api/admin/validation-runs", () =>
    HttpResponse.json(successEnvelope(response))
  )
}

export function mockValidationRunDetail(response = validationRun) {
  return http.get("/api/admin/validation-runs/:runId", () =>
    HttpResponse.json(successEnvelope(response))
  )
}

export function mockLaunchValidationRun(response = validationRun) {
  return http.post("/api/admin/validation-runs", () =>
    HttpResponse.json(successEnvelope(response), { status: 201 })
  )
}

export const handlers = [
  ...mockChatAnswered(),
  mockAdminMe(),
  mockMaintainerDashboard(),
  mockSourceDetail(),
  mockSourceChunks(),
  mockSourceCitations(),
  mockChunkDetail(),
  mockCitationDetail(),
  mockValidationSets(),
  mockValidationRuns(),
  mockValidationRunDetail(),
  mockLaunchValidationRun(),
]
