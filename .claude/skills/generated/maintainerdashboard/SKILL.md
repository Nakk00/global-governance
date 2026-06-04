---
name: maintainerdashboard
description: "Skill for the MaintainerDashboard area of global-governance-docuweb. 24 symbols across 4 files."
---

# MaintainerDashboard

24 symbols | 4 files | Cohesion: 69%

## When to Use

- Working with code in `src/`
- Understanding how MaintainerDashboard, DashboardDataState, MaintainerSectionNav work
- Modifying maintainerdashboard-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | DashboardView, DashboardDataState, MaintainerSectionNav, SourceUploadPage, SourceDetailPage (+16) |
| `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` | MaintainerDashboard |
| `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | renderMaintainer |
| `src/components/modules/MaintainerDashboard/sources/SourceDetailPage.test.tsx` | renderSourceDetail |

## Entry Points

Start here when exploring this area:

- **`MaintainerDashboard`** (Function) — `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx:23`
- **`DashboardDataState`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:694`
- **`MaintainerSectionNav`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:776`
- **`SourceUploadPage`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:956`
- **`SourceDetailPage`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:982`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `MaintainerDashboard` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` | 23 |
| `DashboardDataState` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 694 |
| `MaintainerSectionNav` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 776 |
| `SourceUploadPage` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 956 |
| `SourceDetailPage` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 982 |
| `OperationsPage` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 1062 |
| `SectionSkeleton` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3928 |
| `RetryState` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3954 |
| `renderMaintainer` | Function | `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` | 362 |
| `renderSourceDetail` | Function | `src/components/modules/MaintainerDashboard/sources/SourceDetailPage.test.tsx` | 165 |
| `DashboardView` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 589 |
| `MutationStatus` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 1959 |
| `pathForPreset` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2929 |
| `SourceHistoryTab` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3038 |
| `ChunkInspectionTab` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3055 |
| `CitationInspectionTab` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3106 |
| `InspectionSurface` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3163 |
| `PartialDataList` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3374 |
| `InspectionFilter` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3389 |
| `filterChunks` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3608 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `MaintainerDashboard → IsApiEnvelope` | cross_community | 7 |
| `MaintainerDashboard → ClearSupabaseSession` | cross_community | 6 |
| `MaintainerDashboard → MaintainerApiError` | cross_community | 6 |
| `DashboardView → Cn` | cross_community | 5 |
| `MaintainerDashboard → IsSupabaseSessionExpired` | cross_community | 4 |
| `MaintainerDashboard → ParseMaintainerPreset` | cross_community | 4 |
| `DashboardView → BuildSourceDetailPath` | cross_community | 4 |
| `DashboardView → FilterSourcesForPreset` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Hooks | 6 calls |
| Public-homepage-redesign | 5 calls |
| Ui | 5 calls |
| Cluster_75 | 2 calls |
| Validation | 2 calls |
| Cluster_76 | 2 calls |
| Overview | 1 calls |

## How to Explore

1. `gitnexus_context({name: "MaintainerDashboard"})` — see callers and callees
2. `gitnexus_query({query: "maintainerdashboard"})` — find related execution flows
3. Read key files listed above for implementation details
