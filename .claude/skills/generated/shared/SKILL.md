---
name: shared
description: "Skill for the _shared area of global-governance-docuweb. 55 symbols across 7 files."
---

# _shared

55 symbols | 7 files | Cohesion: 91%

## When to Use

- Working with code in `supabase/`
- Understanding how createMemoryProtectionStore, buildIngestionPayload, ingestIntoMemoryStore work
- Modifying _shared-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `supabase/functions/_shared/chat-protection.ts` | createMemoryProtectionStore, get, set, delete, getProtectionStore (+20) |
| `supabase/functions/_shared/ingestion-pipeline.ts` | buildIngestionPayload, ingestIntoMemoryStore, extractPdfText, normalizeContent, chunkContent (+3) |
| `supabase/functions/_shared/ingestion-request-validation.ts` | parseContentIngestionRequest, readFileType, readOptionalStorage, readOptionalMetadata, parsePdfIngestionRequest (+3) |
| `supabase/functions/_shared/chat-grounding.ts` | getScopedSources, countKeywordHits, isSourceInspectionQuestion, isSpeculativeQuestion, retrieveApprovedSources (+2) |
| `supabase/functions/_shared/ingestion-persistence.ts` | persistIngestionPayload, uploadPrivateSourceFile, deletePrivateSourceFile, readSupabaseServiceConfig, encodeStorageObjectPath |
| `scripts/chatbot/validate-chatbot-set.ts` | main |
| `scripts/chatbot/prepare-ingestion.ts` | main |

## Entry Points

Start here when exploring this area:

- **`createMemoryProtectionStore`** (Function) — `supabase/functions/_shared/chat-protection.ts:100`
- **`buildIngestionPayload`** (Function) — `supabase/functions/_shared/ingestion-pipeline.ts:70`
- **`ingestIntoMemoryStore`** (Function) — `supabase/functions/_shared/ingestion-pipeline.ts:145`
- **`extractPdfText`** (Function) — `supabase/functions/_shared/ingestion-pipeline.ts:186`
- **`evaluateChatProtection`** (Function) — `supabase/functions/_shared/chat-protection.ts:150`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `createMemoryProtectionStore` | Function | `supabase/functions/_shared/chat-protection.ts` | 100 |
| `buildIngestionPayload` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 70 |
| `ingestIntoMemoryStore` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 145 |
| `extractPdfText` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 186 |
| `evaluateChatProtection` | Function | `supabase/functions/_shared/chat-protection.ts` | 150 |
| `retrieveApprovedSources` | Function | `supabase/functions/_shared/chat-grounding.ts` | 104 |
| `assembleGroundedChatResponse` | Function | `supabase/functions/_shared/chat-grounding.ts` | 169 |
| `persistIngestionPayload` | Function | `supabase/functions/_shared/ingestion-persistence.ts` | 8 |
| `uploadPrivateSourceFile` | Function | `supabase/functions/_shared/ingestion-persistence.ts` | 37 |
| `deletePrivateSourceFile` | Function | `supabase/functions/_shared/ingestion-persistence.ts` | 64 |
| `parseContentIngestionRequest` | Function | `supabase/functions/_shared/ingestion-request-validation.ts` | 14 |
| `parsePdfIngestionRequest` | Function | `supabase/functions/_shared/ingestion-request-validation.ts` | 38 |
| `resetProtectionStore` | Function | `supabase/functions/_shared/chat-protection.ts` | 120 |
| `resolveAnonymousSessionId` | Function | `supabase/functions/_shared/chat-protection.ts` | 126 |
| `get` | Method | `supabase/functions/_shared/chat-protection.ts` | 104 |
| `set` | Method | `supabase/functions/_shared/chat-protection.ts` | 107 |
| `delete` | Method | `supabase/functions/_shared/chat-protection.ts` | 111 |
| `get` | Method | `supabase/functions/_shared/chat-protection.ts` | 7 |
| `set` | Method | `supabase/functions/_shared/chat-protection.ts` | 10 |
| `delete` | Method | `supabase/functions/_shared/chat-protection.ts` | 11 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `EvaluateChatProtection → ToRedisKey` | cross_community | 5 |
| `EvaluateChatProtection → ParseProtectionRecord` | cross_community | 5 |
| `IngestIntoMemoryStore → ResolveApprovedSourceId` | cross_community | 5 |
| `Main → ResolveApprovedSourceId` | cross_community | 5 |
| `Main → ResolveApprovedSourceId` | cross_community | 5 |
| `EvaluateChatProtection → EscapeRegExp` | intra_community | 4 |
| `ParseContentIngestionRequest → AsRecord` | cross_community | 4 |
| `ParseContentIngestionRequest → ReadRequiredString` | cross_community | 4 |
| `IngestIntoMemoryStore → NormalizeSourcePath` | cross_community | 4 |
| `Main → NormalizeSourcePath` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Source-bundles | 2 calls |

## How to Explore

1. `gitnexus_context({name: "createMemoryProtectionStore"})` — see callers and callees
2. `gitnexus_query({query: "_shared"})` — find related execution flows
3. Read key files listed above for implementation details
