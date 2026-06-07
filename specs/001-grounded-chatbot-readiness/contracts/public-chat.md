# Contract: Public Grounded Chat

## Purpose

Defines the browser-to-Django contract for the public grounded chat workflow.

## Endpoint

`POST /api/chat`

## Request

```json
{
  "question": "Why is the West Philippine Sea dispute important?",
  "context": {
    "currentSectionId": "west-philippine-sea-dossier",
    "depthMode": "student"
  }
}
```

## Request Rules

- `question` is required.
- `context.currentSectionId` is optional.
- `context.depthMode` is optional during rollout but must normalize to one of `student` or `expert`.
- The request body must not exceed 8 KiB.
- The normalized `question` value must not exceed 2,000 characters.
- The client sends an anonymous session identifier header so protection logic can rate-limit and cooldown repeat traffic.
- MVP requests remain single-turn for backend grounding. The browser may preserve a visible session-local transcript, but prior turns are not sent to Django unless this contract is deliberately extended in a later semantic follow-up task.

## Successful Envelope

```json
{
  "success": true,
  "data": {}
}
```

**Response rules**

- Learner-visible answer text must not exceed 4,000 characters.
- Visible citation arrays must not exceed 6 items.

### `answered`

```json
{
  "success": true,
  "data": {
    "state": "answered",
    "answer": "The dispute matters because ...",
    "grounding": {
      "supportLevel": "strong",
      "cue": "Grounded answer"
    },
    "citations": [
      {
        "sourceId": "wps-arbitral-ruling",
        "title": "South China Sea Arbitration Award",
        "shortTitle": "Arbitration Award",
        "sourceType": "case",
        "detail": "Explains the legal findings relevant to the question"
      }
    ]
  }
}
```

### `weakSupport`

```json
{
  "success": true,
  "data": {
    "state": "weakSupport",
    "message": "Approved materials offer only partial support for this question.",
    "nextStep": "Try narrowing the question to the current lesson topic.",
    "grounding": {
      "supportLevel": "weak",
      "cue": "Limited support"
    },
    "citations": []
  }
}
```

### `refused`

```json
{
  "success": true,
  "data": {
    "state": "refused",
    "code": "off_topic",
    "message": "I can help with questions about approved Global Governance materials.",
    "nextStep": "Try asking about the UN, institutions, or the current section."
  }
}
```

### `cooldown`

This remains a typed success envelope even when the HTTP status is `429`.

```json
{
  "success": true,
  "data": {
    "state": "cooldown",
    "code": "rate_limited",
    "message": "The assistant is temporarily limited.",
    "nextStep": "Try again shortly.",
    "retryAfterSeconds": 42
  }
}
```

### `fallback`

```json
{
  "success": true,
  "data": {
    "state": "fallback",
    "message": "The assistant could not complete a grounded answer right now.",
    "nextStep": "Continue with the lesson or try one of these course questions.",
    "suggestedPrompts": [
      "What is global governance?",
      "Why is the UN important?"
    ],
    "fallbackSource": {
      "label": "Current lesson summary"
    }
  }
}
```

## Error Envelope

Transport-level validation and unclassified server failures use:

```json
{
  "success": false,
  "error": {
    "code": "invalid_request",
    "message": "Use a valid JSON body for grounded chat requests."
  }
}
```

## Notes

- Browser code must never receive private storage paths, service-role credentials, or unrestricted retrieval controls.
- Section context and depth mode are hints for scoped grounding and presentation, not permissions.
- Section-scoped retrieval should align with the approved evidence already used by the visible lesson section. If the backend intentionally narrows a section scope, that narrower policy must be tested and paired with learner-safe limited-support behavior.
- Suggested prompts are release candidates, not proof of source support. Each visible suggested prompt must be auditable against the live `/api/chat` path and either kept, reworded, removed, or backed by deliberately added approved course-relevant sources.
- Transcript-preservation verification must also prove the browser keeps prior turns only as local reviewable UI state; multi-turn sessions still send just the newest learner question plus current section/depth context unless this contract is deliberately expanded later.
- NVIDIA provider names, model IDs, API keys, and routing decisions remain server-only configuration in the Django chat runtime.
- Public chat implementation must begin with failing Django contract tests for valid answers, weak support, refusal, cooldown, fallback, malformed input, oversized input, provider failure, and Redis-unavailable behavior.
- An `answered` outcome with strong support may cite only active sources backed by completed durable ingestion records and real embeddings; staged files or queued/failed ingest jobs are not retrieval evidence.
- Real embeddings mean provider-produced vectors with recorded model identity and dimensions. Deterministic fixture vectors are allowed only in tests and dry runs.
- Public chat tests should use deterministic provider doubles for generation, embedding, reranking, topic guard, and safety guard behavior rather than live NVIDIA calls by default.
- New or materially changed public-chat executable code must meet the feature's 80% changed-scope coverage gate before the live-chat canary is treated as release evidence.
- Django may use Redis for short-lived protection state and narrow operational caches, but browser responses must not expose cache keys, raw prompt hashes, Redis internals, or private source content.
- Broad final-answer caching is disabled by default in MVP; if a future cached answer path is introduced, it must be keyed by section, depth mode, source index version, policy version, and model version, and it must preserve citation integrity.
