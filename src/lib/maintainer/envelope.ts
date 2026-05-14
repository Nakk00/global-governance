type ApiEnvelope<T> =
  | { success: true; data: T; error: null; meta: Record<string, unknown> }
  | {
      success: false
      data: null
      error: {
        code: string
        message: string
        status: number
        details?: { fields?: Record<string, string> }
      }
      meta: Record<string, unknown>
    }

export type { ApiEnvelope }

export class MaintainerApiError extends Error {
  readonly code: string
  readonly status: number
  readonly fields: Record<string, string>

  constructor(
    code: string,
    status: number,
    message: string,
    fields: Record<string, string> = {}
  ) {
    super(message)
    this.code = code
    this.status = status
    this.fields = fields
  }
}

export async function parseMaintainerEnvelope<T>(
  response: Response
): Promise<ApiEnvelope<T>> {
  try {
    const payload = (await response.json()) as unknown
    if (!isApiEnvelope(payload)) {
      throw new Error("malformed_envelope")
    }
    return payload as ApiEnvelope<T>
  } catch {
    return {
      success: false,
      data: null,
      error: {
        code: "admin_response_malformed",
        message: "The maintainer request returned an unreadable response.",
        status: response.status || 502,
      },
      meta: {},
    }
  }
}

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  if (!value || typeof value !== "object") {
    return false
  }

  const record = value as Record<string, unknown>

  if (!("success" in record) || typeof record.success !== "boolean") {
    return false
  }

  if (!("meta" in record) || !record.meta || typeof record.meta !== "object") {
    return false
  }

  if (record.success) {
    return "data" in record && "error" in record
  }

  const error = record.error

  return (
    "data" in record &&
    "error" in record &&
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    "message" in error &&
    "status" in error
  )
}
