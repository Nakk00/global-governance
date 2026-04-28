import {
  assembleGroundedChatResponse,
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
        "Use POST for grounded chat requests."
      ),
      {
        status: 405,
        headers: corsHeaders,
      }
    )
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json(
      createChatErrorEnvelope(
        "invalid_request",
        "Use a valid JSON body for grounded chat requests."
      ),
      {
        status: 400,
        headers: corsHeaders,
      }
    )
  }

  try {
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

    if (question.length === 0) {
      return Response.json(
        createChatErrorEnvelope(
          "invalid_question",
          "Ask a course question before requesting a grounded answer."
        ),
        {
          status: 400,
          headers: corsHeaders,
        }
      )
    }

    return Response.json(
      assembleGroundedChatResponse({
        question,
        sources: retrieveApprovedSources(question, context),
        context,
      }),
      {
        headers: corsHeaders,
      }
    )
  } catch {
    return Response.json(
      createChatErrorEnvelope(
        "grounding_failed",
        "The assistant could not return a grounded answer right now."
      ),
      {
        status: 500,
        headers: corsHeaders,
      }
    )
  }
})
