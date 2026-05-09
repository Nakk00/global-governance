---
name: source-bundles
description: "Skill for the Source-bundles area of global-governance-docuweb. 10 symbols across 4 files."
---

# Source-bundles

10 symbols | 4 files | Cohesion: 86%

## When to Use

- Working with code in `src/`
- Understanding how validateIngestionInput, getServerChatApprovedSources, getServerSectionSourceMap work
- Modifying source-bundles-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/data/source-bundles/approved-source-bundle.ts` | resolveApprovedSourceId, getApprovedSource, getConclusionReferenceSources, getDossierEvidenceSources, getChatCitationSources |
| `supabase/functions/_shared/ingestion-pipeline.ts` | validateIngestionInput, normalizeSourcePath |
| `supabase/functions/_shared/approved-source-bundle.ts` | getServerChatApprovedSources, getServerSectionSourceMap |
| `src/data/sections/west-philippine-sea-dossier.ts` | createWpsEvidenceRegistry |

## Entry Points

Start here when exploring this area:

- **`validateIngestionInput`** (Function) — `supabase/functions/_shared/ingestion-pipeline.ts:34`
- **`getServerChatApprovedSources`** (Function) — `supabase/functions/_shared/approved-source-bundle.ts:14`
- **`getServerSectionSourceMap`** (Function) — `supabase/functions/_shared/approved-source-bundle.ts:18`
- **`resolveApprovedSourceId`** (Function) — `src/data/source-bundles/approved-source-bundle.ts:376`
- **`getApprovedSource`** (Function) — `src/data/source-bundles/approved-source-bundle.ts:393`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `validateIngestionInput` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 34 |
| `getServerChatApprovedSources` | Function | `supabase/functions/_shared/approved-source-bundle.ts` | 14 |
| `getServerSectionSourceMap` | Function | `supabase/functions/_shared/approved-source-bundle.ts` | 18 |
| `resolveApprovedSourceId` | Function | `src/data/source-bundles/approved-source-bundle.ts` | 376 |
| `getApprovedSource` | Function | `src/data/source-bundles/approved-source-bundle.ts` | 393 |
| `getConclusionReferenceSources` | Function | `src/data/source-bundles/approved-source-bundle.ts` | 406 |
| `getDossierEvidenceSources` | Function | `src/data/source-bundles/approved-source-bundle.ts` | 422 |
| `getChatCitationSources` | Function | `src/data/source-bundles/approved-source-bundle.ts` | 438 |
| `normalizeSourcePath` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 226 |
| `createWpsEvidenceRegistry` | Function | `src/data/sections/west-philippine-sea-dossier.ts` | 64 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `IngestIntoMemoryStore → ResolveApprovedSourceId` | cross_community | 5 |
| `Main → ResolveApprovedSourceId` | cross_community | 5 |
| `Main → ResolveApprovedSourceId` | cross_community | 5 |
| `IngestIntoMemoryStore → NormalizeSourcePath` | cross_community | 4 |
| `Main → NormalizeSourcePath` | cross_community | 4 |
| `Main → NormalizeSourcePath` | cross_community | 4 |

## How to Explore

1. `gitnexus_context({name: "validateIngestionInput"})` — see callers and callees
2. `gitnexus_query({query: "source-bundles"})` — find related execution flows
3. Read key files listed above for implementation details
