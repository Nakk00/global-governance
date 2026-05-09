---
name: hooks
description: "Skill for the Hooks area of global-governance-docuweb. 6 symbols across 2 files."
---

# Hooks

6 symbols | 2 files | Cohesion: 77%

## When to Use

- Working with code in `src/`
- Understanding how syncRouteFromHistory, syncRouteFromHistory, applyMutationResult work
- Modifying hooks-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | syncRouteFromHistory, applyMutationResult, navigateTo, parseMaintainerRoute, parseMaintainerPreset |
| `src/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation.ts` | syncRouteFromHistory |

## Entry Points

Start here when exploring this area:

- **`syncRouteFromHistory`** (Function) — `src/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation.ts:25`
- **`syncRouteFromHistory`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:329`
- **`applyMutationResult`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:363`
- **`navigateTo`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:373`
- **`parseMaintainerRoute`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:669`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `syncRouteFromHistory` | Function | `src/components/modules/MaintainerDashboard/hooks/useMaintainerNavigation.ts` | 25 |
| `syncRouteFromHistory` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 329 |
| `applyMutationResult` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 363 |
| `navigateTo` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 373 |
| `parseMaintainerRoute` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 669 |
| `parseMaintainerPreset` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 713 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `RunMutation → ParseMaintainerPreset` | cross_community | 5 |
| `MaintainerDashboard → ParseMaintainerPreset` | cross_community | 4 |
| `MaintainerDashboard → ParseMaintainerPreset` | cross_community | 3 |
| `SyncRouteFromHistory → ParseMaintainerPreset` | intra_community | 3 |
| `SyncRouteFromHistory → ParseMaintainerPreset` | intra_community | 3 |

## How to Explore

1. `gitnexus_context({name: "syncRouteFromHistory"})` — see callers and callees
2. `gitnexus_query({query: "hooks"})` — find related execution flows
3. Read key files listed above for implementation details
