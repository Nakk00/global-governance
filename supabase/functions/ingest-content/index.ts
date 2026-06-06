import { buildIngestionPayload } from "../_shared/ingestion-pipeline.ts"
import { parseContentIngestionRequest } from "../_shared/ingestion-request-validation.ts"

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
          message: "Use POST for content ingestion dry runs.",
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

    return Response.json(
      {
        success: true,
        data: {
          dryRun: true,
          activationAllowed: false,
          delegate: "django-approved-source-ingestion",
          documentId: payload.document.id,
          chunkCount: payload.chunks.length,
          referenceCount: payload.references.length,
          embeddingConfig: payload.document.embeddingConfig,
        },
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
              : "Content ingestion dry run was rejected.",
        },
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    )
  }
})
