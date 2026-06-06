import {
  buildIngestionPayload,
  extractPdfText,
} from "../_shared/ingestion-pipeline.ts"
import { parsePdfIngestionRequest } from "../_shared/ingestion-request-validation.ts"

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
          message: "Use POST for PDF ingestion dry runs.",
        },
      },
      {
        status: 405,
        headers: corsHeaders,
      }
    )
  }

  try {
    const body = parsePdfIngestionRequest(await request.json())
    const pdfBytes = decodeBase64(body.pdfBase64)
    const payload = await buildIngestionPayload({
      sourceId: body.sourceId,
      sourcePath: body.sourcePath,
      fileType: "pdf",
      content: extractPdfText(pdfBytes),
      storage: body.storage,
      metadata: body.metadata,
    })

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
              : "PDF ingestion dry run was rejected.",
        },
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    )
  }
})

function decodeBase64(value: string): Uint8Array {
  if (value.length === 0) {
    throw new Error("Malformed PDF input: missing base64 payload")
  }

  const binary = atob(value)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}
