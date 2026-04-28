import {
  createChatErrorEnvelope,
  retrieveApprovedSources,
} from "../_shared/chat-grounding.ts"

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
      createChatErrorEnvelope(
        "method_not_allowed",
        "Use POST for approved-source retrieval."
      ),
      {
        status: 405,
        headers: corsHeaders,
      }
    )
  }

  try {
    const body = await request.json()
    const question =
      typeof body?.question === "string" ? body.question.trim() : ""
    const context =
      typeof body?.context === "object" && body.context !== null
        ? {
            currentSectionId:
              typeof body.context.currentSectionId === "string"
                ? body.context.currentSectionId.trim()
                : undefined,
          }
        : undefined

    return Response.json(
      {
        success: true,
        data: {
          sources:
            question.length > 0
              ? retrieveApprovedSources(question, context)
              : [],
        },
      },
      {
        headers: corsHeaders,
      }
    )
  } catch {
    return Response.json(
      createChatErrorEnvelope(
        "invalid_request",
        "Use a valid JSON body for approved-source retrieval."
      ),
      {
        status: 400,
        headers: corsHeaders,
      }
    )
  }
})
