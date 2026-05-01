---
name: sections
description: "Skill for the Sections area of global-governance-docuweb. 10 symbols across 4 files."
---

# Sections

10 symbols | 4 files | Cohesion: 83%

## When to Use

- Working with code in `src/`
- Understanding how resolveNarrativeRecapCue, NarrativeSection, WpsDossier work
- Modifying sections-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/components/sections/NarrativeSection.tsx` | NarrativeSection, hasInspectableReferences, NarrativeDisclosureBlock, closeAndReturnFocus, handleDisclosureKeyDown |
| `src/data/sections/core-narrative.ts` | getCanonicalRecapTargetId, resolveNarrativeRecapCue |
| `src/components/modules/WpsDossier/WpsDossier.tsx` | WpsDossier, handleComparisonKeyDown |
| `src/components/modules/UNCommandCenter/UNCommandCenter.tsx` | UNCommandCenter |

## Entry Points

Start here when exploring this area:

- **`resolveNarrativeRecapCue`** (Function) — `src/data/sections/core-narrative.ts:56`
- **`NarrativeSection`** (Function) — `src/components/sections/NarrativeSection.tsx:152`
- **`WpsDossier`** (Function) — `src/components/modules/WpsDossier/WpsDossier.tsx:36`
- **`handleComparisonKeyDown`** (Function) — `src/components/modules/WpsDossier/WpsDossier.tsx:71`
- **`UNCommandCenter`** (Function) — `src/components/modules/UNCommandCenter/UNCommandCenter.tsx:37`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `resolveNarrativeRecapCue` | Function | `src/data/sections/core-narrative.ts` | 56 |
| `NarrativeSection` | Function | `src/components/sections/NarrativeSection.tsx` | 152 |
| `WpsDossier` | Function | `src/components/modules/WpsDossier/WpsDossier.tsx` | 36 |
| `handleComparisonKeyDown` | Function | `src/components/modules/WpsDossier/WpsDossier.tsx` | 71 |
| `UNCommandCenter` | Function | `src/components/modules/UNCommandCenter/UNCommandCenter.tsx` | 37 |
| `getCanonicalRecapTargetId` | Function | `src/data/sections/core-narrative.ts` | 42 |
| `hasInspectableReferences` | Function | `src/components/sections/NarrativeSection.tsx` | 37 |
| `NarrativeDisclosureBlock` | Function | `src/components/sections/NarrativeSection.tsx` | 43 |
| `closeAndReturnFocus` | Function | `src/components/sections/NarrativeSection.tsx` | 54 |
| `handleDisclosureKeyDown` | Function | `src/components/sections/NarrativeSection.tsx` | 59 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `WpsDossier → IsChapterId` | cross_community | 4 |
| `NarrativeSection → IsChapterId` | cross_community | 4 |
| `UNCommandCenter → IsChapterId` | cross_community | 4 |
| `WpsDossier → GetCanonicalRecapTargetId` | intra_community | 3 |
| `NarrativeSection → GetCanonicalRecapTargetId` | intra_community | 3 |
| `UNCommandCenter → GetCanonicalRecapTargetId` | intra_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Layout | 3 calls |
| Contexts | 1 calls |

## How to Explore

1. `gitnexus_context({name: "resolveNarrativeRecapCue"})` — see callers and callees
2. `gitnexus_query({query: "sections"})` — find related execution flows
3. Read key files listed above for implementation details
