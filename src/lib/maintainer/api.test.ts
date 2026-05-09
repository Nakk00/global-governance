import { afterEach, describe, expect, it, vi } from "vitest"

import { http, HttpResponse } from "msw"

import * as browserClient from "@/lib/supabase/browser-client"

import {
  adminIdentity,
  maintainerSession,
  validationRun,
  validationRunList,
} from "../../../tests/support/msw/fixtures"
import {
  errorEnvelope,
  mockValidationRuns,
  successEnvelope,
} from "../../../tests/support/msw/handlers"
import { server } from "../../../tests/support/msw/server"

import {
  fetchAdminMe,
  fetchValidationRuns,
  launchValidationRun,
  MaintainerApiError,
} from "./api"

describe("maintainer api fetch integration", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    globalThis.localStorage?.clear?.()
  })

  it("parses safe envelopes for protected reads", async () => {
    const result = await fetchAdminMe(maintainerSession)

    expect(result).toEqual(adminIdentity)
  })

  it("launches validation runs through the typed POST contract", async () => {
    let receivedBody: unknown

    server.use(
      http.post("/api/admin/validation-runs", async ({ request }) => {
        receivedBody = await request.json()

        return HttpResponse.json(successEnvelope(validationRun), {
          status: 201,
        })
      })
    )

    const result = await launchValidationRun(
      validationRun.validationSetId,
      maintainerSession
    )

    expect(receivedBody).toEqual({
      validationSetId: validationRun.validationSetId,
    })
    expect(result).toEqual(validationRun)
  })

  it("preserves typed list payloads for validation history", async () => {
    server.use(mockValidationRuns(validationRunList))

    const result = await fetchValidationRuns(maintainerSession)

    expect(result).toEqual(validationRunList)
  })

  it("throws a malformed-response error when the envelope shape is broken", async () => {
    server.use(
      http.get("/api/admin/validation-runs", () =>
        HttpResponse.json({ ok: true }, { status: 200 })
      )
    )

    await expect(fetchValidationRuns(maintainerSession)).rejects.toMatchObject({
      code: "admin_response_malformed",
      status: 200,
    })
  })

  it("clears the stored session on protected auth failures", async () => {
    const clearSpy = vi
      .spyOn(browserClient, "clearSupabaseSession")
      .mockImplementation(() => undefined)

    server.use(
      http.get("/api/admin/me", () =>
        HttpResponse.json(
          errorEnvelope(
            "admin_auth_invalid",
            "Use a valid Supabase Auth bearer token.",
            401
          ),
          { status: 401 }
        )
      )
    )

    await expect(fetchAdminMe(maintainerSession)).rejects.toBeInstanceOf(
      MaintainerApiError
    )
    expect(clearSpy).toHaveBeenCalledTimes(1)
  })
})
