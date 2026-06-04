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
- **`resolveApprovedSourceId`** (Function) — `src/data/source-bundles/approved-source-bundle.ts:375`
- **`getApprovedSource`** (Function) — `src/data/source-bundles/approved-source-bundle.ts:392`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `validateIngestionInput` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 34 |
| `getServerChatApprovedSources` | Function | `supabase/functions/_shared/approved-source-bundle.ts` | 14 |
| `getServerSectionSourceMap` | Function | `supabase/functions/_shared/approved-source-bundle.ts` | 18 |
| `resolveApprovedSourceId` | Function | `src/data/source-bundles/approved-source-bundle.ts` | 375 |
| `getApprovedSource` | Function | `src/data/source-bundles/approved-source-bundle.ts` | 392 |
| `getConclusionReferenceSources` | Function | `src/data/source-bundles/approved-source-bundle.ts` | 405 |
| `getDossierEvidenceSources` | Function | `src/data/source-bundles/approved-source-bundle.ts` | 421 |
| `getChatCitationSources` | Function | `src/data/source-bundles/approved-source-bundle.ts` | 437 |
| `normalizeSourcePath` | Function | `supabase/functions/_shared/ingestion-pipeline.ts` | 226 |
| `createWpsEvidenceRegistry` | Function | `src/data/sections/west-philippine-sea-dossier.ts` | 117 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `BuildIngestionPayload → ResolveApprovedSourceId` | cross_community | 4 |

## How to Explore

1. `gitnexus_context({name: "validateIngestionInput"})` — see callers and callees
2. `gitnexus_query({query: "source-bundles"})` — find related execution flows
3. Read key files listed above for implementation details
