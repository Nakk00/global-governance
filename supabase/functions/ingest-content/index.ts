import { buildIngestionPayload } from "../_shared/ingestion-pipeline.ts"
import { parseContentIngestionRequest } from "../_shared/ingestion-request-validation.ts"
import { persistIngestionPayload } from "../_shared/ingestion-persistence.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  if (request.method !== "POST") {
    return Response.json(
      {
        success: false,
        error: {
          code: "method_not_allowed",
          message: "Use POST for content ingestion.",
        },
      },
      {
        status: 405,
        headers: corsHeaders,
      }
    )
  }

  try {
    const body = parseContentIngestionRequest(await request.json())
    const payload = await buildIngestionPayload(body)
    const result = await persistIngestionPayload(payload)

    return Response.json(
      {
        success: true,
        data: result,
      },
      {
        headers: corsHeaders,
      }
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: {
          code: "ingestion_rejected",
          message:
            error instanceof Error
              ? error.message
              : "Content ingestion was rejected.",
        },
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    )
  }
})
