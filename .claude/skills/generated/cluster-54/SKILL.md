---
name: cluster-54
description: "Skill for the Cluster_54 area of global-governance-docuweb. 6 symbols across 1 files."
---

# Cluster_54

6 symbols | 1 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how OverviewPage, SourcesPage work
- Modifying cluster_54-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | OverviewPage, SourcesPage, buildWorkflowCards, buildSourceDetailPath, filterSourcesForPreset (+1) |

## Entry Points

Start here when exploring this area:

- **`OverviewPage`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:781`
- **`SourcesPage`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:835`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `OverviewPage` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 781 |
| `SourcesPage` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 835 |
| `buildWorkflowCards` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2588 |
| `buildSourceDetailPath` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2656 |
| `filterSourcesForPreset` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2679 |
| `getPresetFocusItems` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2699 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `SourcesPage → BuildSourceDetailPath` | intra_community | 3 |
| `SourcesPage → FilterSourcesForPreset` | intra_community | 3 |
| `OverviewPage → BuildSourceDetailPath` | intra_community | 3 |

## How to Explore

1. `gitnexus_context({name: "OverviewPage"})` — see callers and callees
2. `gitnexus_query({query: "cluster_54"})` — find related execution flows
3. Read key files listed above for implementation details
