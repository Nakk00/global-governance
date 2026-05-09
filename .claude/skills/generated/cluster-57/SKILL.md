---
name: cluster-57
description: "Skill for the Cluster_57 area of global-governance-docuweb. 7 symbols across 1 files."
---

# Cluster_57

7 symbols | 1 files | Cohesion: 100%

## When to Use

- Working with code in `src/`
- Understanding how ValidationResultOverlay, InspectionDetailOverlay, EditSourcePanel work
- Modifying cluster_57-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | ValidationResultOverlay, InspectionDetailOverlay, EditSourcePanel, ConfirmLifecycleAction, useModalFocus (+2) |

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ValidationResultOverlay` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 1500 |
| `InspectionDetailOverlay` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3172 |
| `EditSourcePanel` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3382 |
| `ConfirmLifecycleAction` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3466 |
| `useModalFocus` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3513 |
| `handleKeyDown` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3531 |
| `getFocusableElements` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3575 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `ValidationResultOverlay → GetFocusableElements` | intra_community | 3 |
| `InspectionDetailOverlay → GetFocusableElements` | intra_community | 3 |
| `EditSourcePanel → GetFocusableElements` | intra_community | 3 |
| `ConfirmLifecycleAction → GetFocusableElements` | intra_community | 3 |

## How to Explore

1. `gitnexus_context({name: "ValidationResultOverlay"})` — see callers and callees
2. `gitnexus_query({query: "cluster_57"})` — find related execution flows
3. Read key files listed above for implementation details
