---
name: sections
description: "Skill for the Sections area of global-governance-docuweb. 22 symbols across 11 files."
---

# Sections

22 symbols | 11 files | Cohesion: 65%

## When to Use

- Working with code in `src/`
- Understanding how App, HeroNarrativeFrame, ChapterTransitionBlock work
- Modifying sections-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/App.tsx` | MaintainerDashboard, PublicHomepageHeroMockup, PublicHomepageOverviewMockup, PublicHomepageSystemUnderPressureMockup, PublicHomepageWestPhilippineSeaCaseFileMockup (+1) |
| `src/components/sections/NarrativeSection.tsx` | hasInspectableReferences, NarrativeDisclosureBlock, NarrativeSection, closeAndReturnFocus, handleDisclosureKeyDown |
| `src/data/sections/core-narrative.ts` | getCanonicalRecapTargetId, resolveNarrativeRecapCue |
| `src/components/sections/GlobalGovernanceOverviewChapter.test.tsx` | renderOverview, NavigationHarness |
| `src/components/sections/HeroNarrativeFrame.tsx` | HeroNarrativeFrame |
| `src/components/sections/ChapterTransitionBlock.tsx` | ChapterTransitionBlock |
| `src/data/navigation.ts` | isKnownSectionId |
| `src/data/sections/core-narrative.test.ts` | cues |
| `tests/support/render-with-navigation.tsx` | createNavigationContextValue |
| `src/components/sections/GlobalGovernanceOverviewChapter.tsx` | GlobalGovernanceOverviewChapter |

## Entry Points

Start here when exploring this area:

- **`App`** (Function) — `src/App.tsx:50`
- **`HeroNarrativeFrame`** (Function) — `src/components/sections/HeroNarrativeFrame.tsx:46`
- **`ChapterTransitionBlock`** (Function) — `src/components/sections/ChapterTransitionBlock.tsx:6`
- **`isKnownSectionId`** (Function) — `src/data/navigation.ts:101`
- **`resolveNarrativeRecapCue`** (Function) — `src/data/sections/core-narrative.ts:42`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `App` | Function | `src/App.tsx` | 50 |
| `HeroNarrativeFrame` | Function | `src/components/sections/HeroNarrativeFrame.tsx` | 46 |
| `ChapterTransitionBlock` | Function | `src/components/sections/ChapterTransitionBlock.tsx` | 6 |
| `isKnownSectionId` | Function | `src/data/navigation.ts` | 101 |
| `resolveNarrativeRecapCue` | Function | `src/data/sections/core-narrative.ts` | 42 |
| `createNavigationContextValue` | Function | `tests/support/render-with-navigation.tsx` | 12 |
| `GlobalGovernanceOverviewChapter` | Function | `src/components/sections/GlobalGovernanceOverviewChapter.tsx` | 17 |
| `NarrativeSection` | Function | `src/components/sections/NarrativeSection.tsx` | 152 |
| `InsightRecapCard` | Function | `src/components/sections/InsightRecapCard.tsx` | 10 |
| `MaintainerDashboard` | Function | `src/App.tsx` | 18 |
| `PublicHomepageHeroMockup` | Function | `src/App.tsx` | 24 |
| `PublicHomepageOverviewMockup` | Function | `src/App.tsx` | 30 |
| `PublicHomepageSystemUnderPressureMockup` | Function | `src/App.tsx` | 36 |
| `PublicHomepageWestPhilippineSeaCaseFileMockup` | Function | `src/App.tsx` | 42 |
| `getCanonicalRecapTargetId` | Function | `src/data/sections/core-narrative.ts` | 28 |
| `cues` | Function | `src/data/sections/core-narrative.test.ts` | 9 |
| `renderOverview` | Function | `src/components/sections/GlobalGovernanceOverviewChapter.test.tsx` | 16 |
| `NavigationHarness` | Function | `src/components/sections/GlobalGovernanceOverviewChapter.test.tsx` | 19 |
| `hasInspectableReferences` | Function | `src/components/sections/NarrativeSection.tsx` | 37 |
| `NarrativeDisclosureBlock` | Function | `src/components/sections/NarrativeSection.tsx` | 43 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `NarrativeSection → IsChapterId` | cross_community | 4 |
| `NarrativeSection → Cn` | cross_community | 4 |
| `RenderSourceAwareChat → CreateNavigationContextValue` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Layout | 3 calls |
| Public-homepage-redesign | 2 calls |
| UNCommandCenter | 1 calls |
| WpsDossier | 1 calls |
| Contexts | 1 calls |
| Overview | 1 calls |

## How to Explore

1. `gitnexus_context({name: "App"})` — see callers and callees
2. `gitnexus_query({query: "sections"})` — find related execution flows
3. Read key files listed above for implementation details
