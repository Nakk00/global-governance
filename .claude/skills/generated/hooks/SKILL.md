---
name: hooks
description: "Skill for the Hooks area of global-governance-docuweb. 38 symbols across 8 files."
---

# Hooks

38 symbols | 8 files | Cohesion: 74%

## When to Use

- Working with code in `src/`
- Understanding how uploadSource, updateSourceMetadata, mutateSourceLifecycle work
- Modifying hooks-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | applyMutationResult, runMutation, uploadDraft, updateSource, runLifecycleAction (+7) |
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | MaintainerDashboard, MaintainerFrame, AccessStateView, loadSourceDetail, loadDashboard (+5) |
| `src/lib/maintainer/mutation-api.ts` | uploadSource, updateSourceMetadata, mutateSourceLifecycle, ingestSource |
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts` | useMaintainerGate, resolveGate, signOut |
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation.ts` | useMaintainerNavigation, navigateTo, syncRouteFromHistory |
| `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | MaintainerLogin, reveal |
| `src/lib/maintainer/source-api.ts` | fetchStewardshipDashboard, fetchSourceDetail |
| `src/lib/supabase/browser-client.ts` | getSupabaseSession, clearSupabaseSession |

## Entry Points

Start here when exploring this area:

- **`uploadSource`** (Function) — `src/lib/maintainer/mutation-api.ts:15`
- **`updateSourceMetadata`** (Function) — `src/lib/maintainer/mutation-api.ts:38`
- **`mutateSourceLifecycle`** (Function) — `src/lib/maintainer/mutation-api.ts:54`
- **`ingestSource`** (Function) — `src/lib/maintainer/mutation-api.ts:66`
- **`applyMutationResult`** (Function) — `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts:232`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `uploadSource` | Function | `src/lib/maintainer/mutation-api.ts` | 15 |
| `updateSourceMetadata` | Function | `src/lib/maintainer/mutation-api.ts` | 38 |
| `mutateSourceLifecycle` | Function | `src/lib/maintainer/mutation-api.ts` | 54 |
| `ingestSource` | Function | `src/lib/maintainer/mutation-api.ts` | 66 |
| `applyMutationResult` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 232 |
| `runMutation` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 247 |
| `uploadDraft` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 272 |
| `updateSource` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 286 |
| `runLifecycleAction` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 300 |
| `queueIngest` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 317 |
| `MaintainerLogin` | Function | `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | 24 |
| `reveal` | Function | `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx` | 35 |
| `MaintainerDashboard` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 246 |
| `MaintainerFrame` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 539 |
| `AccessStateView` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 554 |
| `fetchStewardshipDashboard` | Function | `src/lib/maintainer/source-api.ts` | 28 |
| `fetchSourceDetail` | Function | `src/lib/maintainer/source-api.ts` | 35 |
| `useMaintainerDashboardData` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 37 |
| `loadSourceDetail` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 63 |
| `loadSourcePreview` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 101 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `MaintainerDashboard → IsApiEnvelope` | cross_community | 7 |
| `UseMaintainerDashboardData → IsApiEnvelope` | cross_community | 7 |
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 6 |
| `MaintainerDashboard → MaintainerApiError` | cross_community | 6 |
| `UseMaintainerDashboardData → ClearSupabaseSession` | cross_community | 6 |
| `UseMaintainerDashboardData → MaintainerApiError` | cross_community | 6 |
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 5 |
| `MaintainerDashboard → MaintainerApiError` | cross_community | 5 |
| `ValidationWorkbench → ClearSupabaseSession` | cross_community | 5 |
| `ValidationWorkbench → ClearSupabaseSession` | cross_community | 5 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Maintainer | 6 calls |
| Supabase | 3 calls |
| MaintainerDashboard | 2 calls |
| Cluster_74 | 1 calls |

## How to Explore

1. `gitnexus_context({name: "uploadSource"})` — see callers and callees
2. `gitnexus_query({query: "hooks"})` — find related execution flows
3. Read key files listed above for implementation details
