---
name: hooks
description: "Skill for the Hooks area of global-governance-docuweb. 33 symbols across 7 files."
---

# Hooks

33 symbols | 7 files | Cohesion: 72%

## When to Use

- Working with code in `src/`
- Understanding how fetchStewardshipDashboard, fetchSourceDetail, useMaintainerDashboardData work
- Modifying hooks-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | useMaintainerDashboardData, loadSourceDetail, loadSourcePreview, retrySelectedSourcePreview, loadDashboard (+7) |
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | loadSourceDetail, loadDashboard, handleMaintainerReadAuthFailure, signOut, syncRouteFromHistory (+2) |
| `src/lib/maintainer/mutation-api.ts` | uploadSource, updateSourceMetadata, mutateSourceLifecycle, ingestSource |
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerGate.ts` | useMaintainerGate, resolveGate, signOut |
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation.ts` | useMaintainerNavigation, navigateTo, syncRouteFromHistory |
| `src/lib/maintainer/source-api.ts` | fetchStewardshipDashboard, fetchSourceDetail |
| `src/lib/supabase/browser-client.ts` | getSupabaseSession, clearSupabaseSession |

## Entry Points

Start here when exploring this area:

- **`fetchStewardshipDashboard`** (Function) — `src/lib/maintainer/source-api.ts:28`
- **`fetchSourceDetail`** (Function) — `src/lib/maintainer/source-api.ts:35`
- **`useMaintainerDashboardData`** (Function) — `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts:37`
- **`loadSourceDetail`** (Function) — `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts:63`
- **`loadSourcePreview`** (Function) — `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts:101`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `fetchStewardshipDashboard` | Function | `src/lib/maintainer/source-api.ts` | 28 |
| `fetchSourceDetail` | Function | `src/lib/maintainer/source-api.ts` | 35 |
| `useMaintainerDashboardData` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 37 |
| `loadSourceDetail` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 63 |
| `loadSourcePreview` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 101 |
| `retrySelectedSourcePreview` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 141 |
| `loadDashboard` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 148 |
| `selectSource` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 215 |
| `loadSourceDetail` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 288 |
| `loadDashboard` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 325 |
| `handleMaintainerReadAuthFailure` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 1718 |
| `uploadSource` | Function | `src/lib/maintainer/mutation-api.ts` | 15 |
| `updateSourceMetadata` | Function | `src/lib/maintainer/mutation-api.ts` | 38 |
| `mutateSourceLifecycle` | Function | `src/lib/maintainer/mutation-api.ts` | 54 |
| `ingestSource` | Function | `src/lib/maintainer/mutation-api.ts` | 66 |
| `applyMutationResult` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 232 |
| `runMutation` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 247 |
| `uploadDraft` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 272 |
| `updateSource` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 286 |
| `runLifecycleAction` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerDashboardData.ts` | 300 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `UseMaintainerDashboardData → IsApiEnvelope` | cross_community | 7 |
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 6 |
| `MaintainerDashboard → MaintainerApiError` | cross_community | 6 |
| `UseMaintainerDashboardData → ClearSupabaseSession` | cross_community | 6 |
| `UseMaintainerDashboardData → MaintainerApiError` | cross_community | 6 |
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 5 |
| `MaintainerDashboard → HandleMaintainerReadAuthFailure` | cross_community | 5 |
| `ValidationWorkbench → ClearSupabaseSession` | cross_community | 5 |
| `SourceDetailPanel → ClearSupabaseSession` | cross_community | 5 |
| `ResolveGate → IsApiEnvelope` | cross_community | 5 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Maintainer | 6 calls |
| Supabase | 3 calls |
| Cluster_74 | 1 calls |

## How to Explore

1. `gitnexus_context({name: "fetchStewardshipDashboard"})` — see callers and callees
2. `gitnexus_query({query: "hooks"})` — find related execution flows
3. Read key files listed above for implementation details
