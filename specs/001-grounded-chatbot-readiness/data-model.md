# Data Model: Grounded Chatbot Readiness

## Overview

This feature extends the current public chat and protected readiness models rather than introducing a new standalone domain. The central design idea is that learner-visible chat states and maintainer-visible readiness evidence remain explicit contracts across runtime boundaries.

## Entities

### GroundedChatRequest

Represents one learner question submitted to the public chat workflow.

| Field | Type | Notes |
|---|---|---|
| `question` | string | Required trimmed learner prompt |
| `context.currentSectionId` | string optional | Current narrative or lesson section identifier |
| `context.depthMode` | enum | Proposed values: `student`, `expert` |

**Validation rules**

- `question` must be present and within request-size limits.
- `currentSectionId` must be optional and normalized at the boundary.
- `depthMode` defaults to `student` if the client does not provide a value during the rollout period.

### GroundedChatOutcome

Represents the typed learner-visible result of one public chat request.

| Variant | Required fields | Meaning |
|---|---|---|
| `answered` | `answer`, `grounding`, `citations` | Strongly supported grounded response |
| `weakSupport` | `message`, `nextStep`, `grounding`, `citations` | Limited-support grounded response |
| `refused` | `code`, `message`, `nextStep` | Off-topic or boundary refusal |
| `cooldown` | `code`, `message`, `nextStep`, `retryAfterSeconds` | Protection-triggered temporary limit |
| `fallback` | `message`, `nextStep`, `suggestedPrompts`, `fallbackSource` optional | Degraded but lesson-safe response |

**Relationships**

- Produced from one `GroundedChatRequest`
- May reference zero or more `SourceSupportRecord`
- May be shaped by one `ProtectionRecord`

### SourceSupportRecord

Represents the evidence shown to the learner for a grounded or limited-support answer.

| Field | Type | Notes |
|---|---|---|
| `sourceId` | string | Stable source identifier |
| `title` | string | Full source title |
| `shortTitle` | string | Compact UI label |
| `sourceType` | enum | Existing source-type taxonomy |
| `detail` | string | Display summary of why the source supports the answer |
| `url` | string optional | Publicly safe source link when available |

### ProtectionRecord

Represents short-lived operational protection state for one anonymous chat identity.

| Field | Type | Notes |
|---|---|---|
| `sessionKey` | string | Hashed anonymous session or network fingerprint |
| `submissions` | number[] | Timestamps used for rate-window checks |
| `consecutiveAbuseCount` | number | Repeated off-topic/abusive attempts |
| `cooldownUntil` | number | Epoch milliseconds for active cooldown |

**State transitions**

- `allowed` -> `refused` after an off-topic or abusive prompt
- `refused` -> `cooldown` after repeated abuse threshold
- `allowed` -> `cooldown` after rate-limit threshold
- `cooldown` -> `allowed` once retry window expires and new request is valid

### OperationalCacheEntry

Represents one Redis cache entry used by Django to speed up repeated public-chat runtime decisions without becoming a durable knowledge record.

| Field | Type | Notes |
|---|---|---|
| `cacheKey` | string | Server-generated key using a non-reversible HMAC/hash for learner text |
| `cacheClass` | enum | `protection`, `guardDecision`, `queryHelper`, `retrievalResult` |
| `schemaVersion` | string | Cache value parser version |
| `policyVersion` | string | Topic/safety/retrieval policy version where relevant |
| `modelVersion` | string optional | Model identifier or adapter version for model-dependent entries |
| `sourceIndexVersion` | string optional | Active approved-source index/version for retrieval-dependent entries |
| `expiresAt` | timestamp | Required TTL boundary |
| `value` | object | Short-lived operational value; never canonical source content |

**Validation rules**

- Cache entries must expire and must not be treated as durable records.
- Cache keys derived from learner text must not contain raw prompts.
- Retrieval cache values may include chunk IDs, scores, and lightweight metadata, but must not become the canonical store for chunk text, embeddings, citations, or source records.
- Final grounded-answer cache entries are excluded from MVP by default.

### ApprovedSourceManifestEntry

Represents one staged or protected approved-source input eligible for ingestion.

| Field | Type | Notes |
|---|---|---|
| `sourcePath` | string | Repo staging path or protected storage path |
| `sourceId` | string | Canonical approved source identity |
| `fileType` | enum | Supported initial values: `md`, `pdf` |
| `storageBucket` | string optional | Private Supabase bucket for durable source storage |
| `storagePath` | string optional | Private object path |
| `revision` | string optional | Human-readable source revision/version |

**Validation rules**

- Repo-local paths must remain under `archive/docs/approved-sources/`.
- Every entry must resolve to a canonical approved `sourceId`.
- Normalized derivatives must retain lineage to the same canonical source identity.

### IngestionRun

Represents one real attempt to turn an approved source into retrieval-ready evidence.

| Field | Type | Notes |
|---|---|---|
| `jobId` | string | Stable ingestion job identifier |
| `sourceId` | string | Canonical approved source identity |
| `status` | enum | `queued`, `processing`, `succeeded`, `failed` |
| `documentId` | string optional | Present after durable persistence |
| `chunkCount` | number optional | Persisted retrieval chunk count |
| `referenceCount` | number optional | Persisted citation/reference count |
| `embeddingModel` | string optional | Server-side NVIDIA embedding model |
| `embeddingDimensions` | number optional | Recorded provider vector dimensions |
| `errorCode` | string optional | Typed failure reason |

**State transitions**

- `queued` -> `processing` when extraction begins.
- `processing` -> `succeeded` only after private storage and durable document, chunk, reference, link, and real vector persistence completes.
- `processing` -> `failed` when extraction, embedding, storage, or persistence fails.
- A failed or incomplete run cannot make a source ready or active.
- The durable store schema must support the `processing` state and the extra embedding evidence fields before this lifecycle can be used in production.

### StewardshipDashboard

Represents the protected maintainer readiness summary returned by the source dashboard endpoint.

| Field group | Notes |
|---|---|
| `overview` | Source counts, active/draft counts, latest ingestion/validation status, readiness state |
| `monitoring` | Readiness, blockers, validation health, next actions |
| `auditTrail` | Recent administrative and operational events |
| `chatbotTrust` | Grounded-source count, validation run count, warning/failed counts, evidence list |
| `sources` | Inventory items used by source-readiness workflows |
| `ingestionRuns`, `validationRuns`, `auditEvents` | Recent operational evidence streams |

### SourceRecord

Represents one approved or in-progress source managed by the protected stewardship workflow.

| Field | Type | Notes |
|---|---|---|
| `sourceId` | string | Stable identifier |
| `title` | string | Display title |
| `sourceType` | string | Category of source |
| `lifecycleState` | enum | Existing lifecycle: draft, approved, active, disabled, archived |
| `usageScope` | string[] | Content areas the source supports |
| `ingestionReadiness` | enum | Current ingest/readiness state |
| `latestValidationOutcome` | enum optional | Latest validation outcome |
| `partialData` | list | Partial/unavailable-data markers |

### ValidationRun

Represents one protected validation workflow result.

| Field | Type | Notes |
|---|---|---|
| `runId` | string | Stable validation run identifier |
| `status` | enum | `queued`, `succeeded`, `warning`, `failed` |
| `setId` | string | Validation set identifier |
| `summary` | string | Human-readable outcome |
| `auditEvents` | list | Evidence trail for the run |
| `answerPreview` | string optional | Chat/trust validation preview when applicable |

### AuditEvent

Represents one protected source, validation, or administrative event.

| Field | Type | Notes |
|---|---|---|
| `eventId` | string | Stable event identifier |
| `sourceId` | string | Related source |
| `eventType` | string | Domain event category |
| `origin` | string | System or workflow origin |
| `occurredAt` | timestamp string | Sorting/filtering anchor |
| `outcome` | enum | Success, warning, failure, queued |
| `summary` | string | Maintainer-readable explanation |

## Relationship Summary

- One `GroundedChatRequest` produces one `GroundedChatOutcome`.
- One `GroundedChatOutcome` may cite many `SourceSupportRecord` items.
- One `ApprovedSourceManifestEntry` may produce many `IngestionRun` attempts but only completed durable revisions are eligible for retrieval.
- One anonymous identity may accumulate many `ProtectionRecord` updates over time, but only one active record is needed operationally.
- One `GroundedChatRequest` may read zero or more `OperationalCacheEntry` values for protection, guard, query-helper, or retrieval-result acceleration, but those entries cannot replace canonical source data.
- One `StewardshipDashboard` aggregates many `SourceRecord`, `ValidationRun`, and `AuditEvent` entries.
- One `SourceRecord` may participate in many `ValidationRun` and `AuditEvent` entries.

## Boundary Notes

- Public chat contracts must stay safe for anonymous browser use and cannot expose private source storage details.
- Strong `answered` outcomes may use only active sources backed by a succeeded `IngestionRun`; missing or failed ingestion must resolve to limited support or fallback behavior.
- A provider-returned embedding is evidenced by recorded model identity and vector dimensions; deterministic fixture vectors are valid only in tests and dry runs.
- Protected readiness contracts may expose richer stewardship and validation detail, but only through authenticated maintainer/admin routes.
- `fallback` is intentionally modeled as a learner-visible success outcome rather than a transport failure so the lesson can continue under degraded conditions.
- Redis cache entries remain Django-owned operational state; browser-facing contracts must not expose cache keys, raw prompt hashes, or private cache internals.
- Entity validation, variant transitions, expiry boundaries, missing optional context, and partial-data mappings must be introduced through focused failing tests before implementation and included in the feature's changed-scope coverage measurement.
