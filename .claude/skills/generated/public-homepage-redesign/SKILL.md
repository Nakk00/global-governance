---
name: public-homepage-redesign
description: "Skill for the Public-homepage-redesign area of global-governance-docuweb. 26 symbols across 3 files."
---

# Public-homepage-redesign

26 symbols | 3 files | Cohesion: 68%

## When to Use

- Working with code in `src/`
- Understanding how HeroMockupPage, OverviewPage work
- Modifying public-homepage-redesign-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | OverviewPage, ValidationResultOverlay, OverviewCards, SourceUploadPanel, FormField (+19) |
| `src/mockups/public-homepage-redesign/HeroMockupPage.tsx` | HeroMockupPage |
| `src/components/ui/button.tsx` | Button |

## Entry Points

Start here when exploring this area:

- **`HeroMockupPage`** (Function) — `src/mockups/public-homepage-redesign/HeroMockupPage.tsx:20`
- **`OverviewPage`** (Function) — `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx:843`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `HeroMockupPage` | Function | `src/mockups/public-homepage-redesign/HeroMockupPage.tsx` | 20 |
| `OverviewPage` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 843 |
| `Button` | Function | `src/components/ui/button.tsx` | 44 |
| `ValidationResultOverlay` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 1564 |
| `OverviewCards` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 1736 |
| `SourceUploadPanel` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2000 |
| `FormField` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2116 |
| `SourceTable` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2140 |
| `SourceDetailPanel` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2259 |
| `SourceInspectorTabs` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2597 |
| `SourceOverviewTab` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2637 |
| `ReadinessBlockerSummary` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2660 |
| `SourceValidationEvidence` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2675 |
| `WorkflowHealthCard` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2737 |
| `getSourceReadinessBlocker` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 2991 |
| `InspectionDetailOverlay` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3435 |
| `ChunkDetailView` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3481 |
| `CitationDetailView` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3535 |
| `CopyButton` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3585 |
| `DetailTerm` | Function | `src/components/modules/MaintainerDashboard/shared/maintainerDashboardShared.tsx` | 3599 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `SourceDetailPanel → IsApiEnvelope` | cross_community | 6 |
| `SourceDetailPanel → ClearSupabaseSession` | cross_community | 5 |
| `SourceDetailPanel → MaintainerApiError` | cross_community | 5 |
| `DashboardView → Cn` | cross_community | 5 |
| `AppShell → Cn` | cross_community | 4 |
| `NarrativeSection → Cn` | cross_community | 4 |
| `Navbar → Cn` | cross_community | 4 |
| `WpsDossier → Cn` | cross_community | 4 |
| `DashboardView → BuildSourceDetailPath` | cross_community | 4 |
| `ValidationWorkbench → Cn` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Cluster_75 | 3 calls |
| Maintainer | 2 calls |
| Overview | 1 calls |
| Cluster_76 | 1 calls |
| Cluster_77 | 1 calls |
| Ui | 1 calls |

## How to Explore

1. `gitnexus_context({name: "HeroMockupPage"})` — see callers and callees
2. `gitnexus_query({query: "public-homepage-redesign"})` — find related execution flows
3. Read key files listed above for implementation details
