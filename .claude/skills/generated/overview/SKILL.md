---
name: overview
description: "Skill for the Overview area of global-governance-docuweb. 28 symbols across 5 files."
---

# Overview

28 symbols | 5 files | Cohesion: 68%

## When to Use

- Working with code in `src/`
- Understanding how buildBlockers, buildActions, buildValidationRows work
- Modifying overview-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/modules/MaintainerDashboard/overview/OverviewMetrics.tsx` | ActionPill, RingMetric, ActionIcon, Sparkline, FilterChip (+7) |
| `src/components/modules/MaintainerDashboard/overview/overview-builders.ts` | buildBlockers, buildActions, buildValidationRows, buildAuditRows, buildValidationSummary (+6) |
| `src/components/modules/MaintainerDashboard/overview/OverviewTables.tsx` | CompactTable, DashboardPanel |
| `src/components/modules/MaintainerDashboard/overview/OverviewPage.tsx` | OverviewPage, sourceRows |
| `src/lib/utils.ts` | cn |

## Entry Points

Start here when exploring this area:

- **`buildBlockers`** (Function) — `src/components/modules/MaintainerDashboard/overview/overview-builders.ts:91`
- **`buildActions`** (Function) — `src/components/modules/MaintainerDashboard/overview/overview-builders.ts:139`
- **`buildValidationRows`** (Function) — `src/components/modules/MaintainerDashboard/overview/overview-builders.ts:175`
- **`buildAuditRows`** (Function) — `src/components/modules/MaintainerDashboard/overview/overview-builders.ts:215`
- **`buildValidationSummary`** (Function) — `src/components/modules/MaintainerDashboard/overview/overview-builders.ts:255`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `buildBlockers` | Function | `src/components/modules/MaintainerDashboard/overview/overview-builders.ts` | 91 |
| `buildActions` | Function | `src/components/modules/MaintainerDashboard/overview/overview-builders.ts` | 139 |
| `buildValidationRows` | Function | `src/components/modules/MaintainerDashboard/overview/overview-builders.ts` | 175 |
| `buildAuditRows` | Function | `src/components/modules/MaintainerDashboard/overview/overview-builders.ts` | 215 |
| `buildValidationSummary` | Function | `src/components/modules/MaintainerDashboard/overview/overview-builders.ts` | 255 |
| `buildTrustSummary` | Function | `src/components/modules/MaintainerDashboard/overview/overview-builders.ts` | 267 |
| `formatSyncTime` | Function | `src/components/modules/MaintainerDashboard/overview/overview-builders.ts` | 321 |
| `CompactTable` | Function | `src/components/modules/MaintainerDashboard/overview/OverviewTables.tsx` | 57 |
| `OverviewPage` | Function | `src/components/modules/MaintainerDashboard/overview/OverviewPage.tsx` | 43 |
| `ActionPill` | Function | `src/components/modules/MaintainerDashboard/overview/OverviewMetrics.tsx` | 124 |
| `RingMetric` | Function | `src/components/modules/MaintainerDashboard/overview/OverviewMetrics.tsx` | 161 |
| `ActionIcon` | Function | `src/components/modules/MaintainerDashboard/overview/OverviewMetrics.tsx` | 176 |
| `Sparkline` | Function | `src/components/modules/MaintainerDashboard/overview/OverviewMetrics.tsx` | 194 |
| `FilterChip` | Function | `src/components/modules/MaintainerDashboard/overview/OverviewMetrics.tsx` | 214 |
| `cn` | Function | `src/lib/utils.ts` | 3 |
| `DashboardPanel` | Function | `src/components/modules/MaintainerDashboard/overview/OverviewTables.tsx` | 4 |
| `StatusCard` | Function | `src/components/modules/MaintainerDashboard/overview/OverviewMetrics.tsx` | 16 |
| `StatusPill` | Function | `src/components/modules/MaintainerDashboard/overview/OverviewMetrics.tsx` | 44 |
| `SourceStatusPill` | Function | `src/components/modules/MaintainerDashboard/overview/OverviewMetrics.tsx` | 67 |
| `RunStatusPill` | Function | `src/components/modules/MaintainerDashboard/overview/OverviewMetrics.tsx` | 88 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `DashboardView → Cn` | cross_community | 5 |
| `AppShell → Cn` | cross_community | 4 |
| `NarrativeSection → Cn` | cross_community | 4 |
| `Navbar → Cn` | cross_community | 4 |
| `ValidationRemediationQueue → Cn` | cross_community | 4 |
| `SourcesPage → Cn` | cross_community | 4 |
| `OverviewPage → FormatShortDateTime` | intra_community | 3 |
| `ValidationWorkbench → Cn` | cross_community | 3 |
| `ValidationResultsTable → Cn` | cross_community | 3 |

## How to Explore

1. `gitnexus_context({name: "buildBlockers"})` — see callers and callees
2. `gitnexus_query({query: "overview"})` — find related execution flows
3. Read key files listed above for implementation details
