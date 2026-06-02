---
name: sections
description: "Skill for the Sections area of global-governance-docuweb. 21 symbols across 11 files."
---

# Sections

21 symbols | 11 files | Cohesion: 69%

## When to Use

- Working with code in `src/`
- Understanding how resolveNarrativeRecapCue, NarrativeSection, InsightRecapCard work
- Modifying sections-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/sections/NarrativeSection.tsx` | hasInspectableReferences, NarrativeDisclosureBlock, NarrativeSection, closeAndReturnFocus, handleDisclosureKeyDown |
| `src/App.tsx` | MaintainerDashboard, PublicHomepageHeroMockup, PublicHomepageOverviewMockup, PublicHomepageSystemUnderPressureMockup, App |
| `src/data/sections/core-narrative.ts` | getCanonicalRecapTargetId, resolveNarrativeRecapCue |
| `src/components/modules/WpsDossier/WpsDossier.tsx` | WpsDossier, handleComparisonKeyDown |
| `src/data/sections/core-narrative.test.ts` | cues |
| `src/components/sections/InsightRecapCard.tsx` | InsightRecapCard |
| `src/components/modules/WpsDossier/WpsEvidenceSurface.tsx` | WpsEvidenceSurface |
| `src/components/modules/UNCommandCenter/UNCommandCenter.tsx` | UNCommandCenter |
| `src/components/sections/HeroNarrativeFrame.tsx` | HeroNarrativeFrame |
| `src/components/sections/GlobalGovernanceOverviewChapter.tsx` | GlobalGovernanceOverviewChapter |

## Entry Points

Start here when exploring this area:

- **`resolveNarrativeRecapCue`** (Function) — `src/data/sections/core-narrative.ts:53`
- **`NarrativeSection`** (Function) — `src/components/sections/NarrativeSection.tsx:152`
- **`InsightRecapCard`** (Function) — `src/components/sections/InsightRecapCard.tsx:10`
- **`WpsEvidenceSurface`** (Function) — `src/components/modules/WpsDossier/WpsEvidenceSurface.tsx:19`
- **`WpsDossier`** (Function) — `src/components/modules/WpsDossier/WpsDossier.tsx:36`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `resolveNarrativeRecapCue` | Function | `src/data/sections/core-narrative.ts` | 53 |
| `NarrativeSection` | Function | `src/components/sections/NarrativeSection.tsx` | 152 |
| `InsightRecapCard` | Function | `src/components/sections/InsightRecapCard.tsx` | 10 |
| `WpsEvidenceSurface` | Function | `src/components/modules/WpsDossier/WpsEvidenceSurface.tsx` | 19 |
| `WpsDossier` | Function | `src/components/modules/WpsDossier/WpsDossier.tsx` | 36 |
| `handleComparisonKeyDown` | Function | `src/components/modules/WpsDossier/WpsDossier.tsx` | 71 |
| `UNCommandCenter` | Function | `src/components/modules/UNCommandCenter/UNCommandCenter.tsx` | 37 |
| `App` | Function | `src/App.tsx` | 42 |
| `HeroNarrativeFrame` | Function | `src/components/sections/HeroNarrativeFrame.tsx` | 46 |
| `GlobalGovernanceOverviewChapter` | Function | `src/components/sections/GlobalGovernanceOverviewChapter.tsx` | 17 |
| `ChapterTransitionBlock` | Function | `src/components/sections/ChapterTransitionBlock.tsx` | 6 |
| `getCanonicalRecapTargetId` | Function | `src/data/sections/core-narrative.ts` | 39 |
| `cues` | Function | `src/data/sections/core-narrative.test.ts` | 9 |
| `hasInspectableReferences` | Function | `src/components/sections/NarrativeSection.tsx` | 37 |
| `NarrativeDisclosureBlock` | Function | `src/components/sections/NarrativeSection.tsx` | 43 |
| `MaintainerDashboard` | Function | `src/App.tsx` | 18 |
| `PublicHomepageHeroMockup` | Function | `src/App.tsx` | 24 |
| `PublicHomepageOverviewMockup` | Function | `src/App.tsx` | 30 |
| `PublicHomepageSystemUnderPressureMockup` | Function | `src/App.tsx` | 36 |
| `closeAndReturnFocus` | Function | `src/components/sections/NarrativeSection.tsx` | 54 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `NarrativeSection → IsChapterId` | cross_community | 4 |
| `NarrativeSection → Cn` | cross_community | 4 |
| `WpsDossier → IsChapterId` | cross_community | 4 |
| `WpsDossier → Cn` | cross_community | 4 |
| `UNCommandCenter → IsChapterId` | cross_community | 4 |
| `GlobalGovernanceOverviewChapter → IsChapterId` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Public-homepage-redesign | 5 calls |
| Layout | 3 calls |
| Overview | 3 calls |
| Contexts | 1 calls |

## How to Explore

1. `gitnexus_context({name: "resolveNarrativeRecapCue"})` — see callers and callees
2. `gitnexus_query({query: "sections"})` — find related execution flows
3. Read key files listed above for implementation details
