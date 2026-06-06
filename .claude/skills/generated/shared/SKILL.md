---
name: shared
description: "Skill for the _shared area of global-governance-docuweb. 22 symbols across 4 files."
---

# _shared

22 symbols | 4 files | Cohesion: 83%

## When to Use

- Working with code in `supabase/`
- Understanding how buildIngestionPayload, ingestIntoMemoryStore, extractPdfText work
- Modifying _shared-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `supabase/functions/_shared/ingestion-pipeline.ts` | buildIngestionPayload, ingestIntoMemoryStore, extractPdfText, normalizeContent, chunkContent (+3) |
| `supabase/functions/_shared/ingestion-request-validation.ts` | parseContentIngestionRequest, readFileType, readOptionalStorage, readOptionalMetadata, parsePdfIngestionRequest (+3) |
| `supabase/functions/_shared/ingestion-persistence.ts` | persistIngestionPayload, uploadPrivateSourceFile, deletePrivateSourceFile, readSupabaseServiceConfig, encodeStorageObjectPath |
| `scripts/chatbot/validate-chatbot-set.ts` | main |

## Entry Points

Start here when exploring this area:

- **`buildIngestionPayload`** (Function) — `supabase/functions/_shared/ingestion-pipeline.ts:70`
- **`ingestIntoMemoryStore`** (Function) — `supabase/functions/_shared/ingestion-pipeline.ts:147`
- **`extractPdfText`** (Function) — `supabase/functions/_shared/ingestion-pipeline.ts:188`
- **`persistIngestionPayload`** (Function) — `supabase/functions/_shared/ingestion-persistence.ts:8`
- **`uploadPrivateSourceFile`** (Function) — `supabase/functions/_shared/ingestion-persistence.ts:37`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `buildIngestionPayload` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 70 |
| `ingestIntoMemoryStore` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 147 |
| `extractPdfText` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 188 |
| `persistIngestionPayload` | Function | `supabase/functions/_shared/ingestion-persistence.ts` | 8 |
| `uploadPrivateSourceFile` | Function | `supabase/functions/_shared/ingestion-persistence.ts` | 37 |
| `deletePrivateSourceFile` | Function | `supabase/functions/_shared/ingestion-persistence.ts` | 64 |
| `parseContentIngestionRequest` | Function | `supabase/functions/_shared/ingestion-request-validation.ts` | 14 |
| `parsePdfIngestionRequest` | Function | `supabase/functions/_shared/ingestion-request-validation.ts` | 38 |
| `main` | Function | `scripts/chatbot/validate-chatbot-set.ts` | 5 |
| `normalizeContent` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 207 |
| `chunkContent` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 217 |
| `countApproximateTokens` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 224 |
| `buildDeterministicEmbedding` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 249 |
| `stableHash` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 268 |
| `readSupabaseServiceConfig` | Function | `supabase/functions/_shared/ingestion-persistence.ts` | 86 |
| `encodeStorageObjectPath` | Function | `supabase/functions/_shared/ingestion-persistence.ts` | 100 |
| `readFileType` | Function | `supabase/functions/_shared/ingestion-request-validation.ts` | 75 |
| `readOptionalStorage` | Function | `supabase/functions/_shared/ingestion-request-validation.ts` | 79 |
| `readOptionalMetadata` | Function | `supabase/functions/_shared/ingestion-request-validation.ts` | 104 |
| `asRecord` | Function | `supabase/functions/_shared/ingestion-request-validation.ts` | 57 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `BuildIngestionPayload → ResolveApprovedSourceId` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Source-bundles | 2 calls |

## How to Explore

1. `gitnexus_context({name: "buildIngestionPayload"})` — see callers and callees
2. `gitnexus_query({query: "_shared"})` — find related execution flows
3. Read key files listed above for implementation details
