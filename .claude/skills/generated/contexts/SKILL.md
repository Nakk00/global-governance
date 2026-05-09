---
name: contexts
description: "Skill for the Contexts area of global-governance-docuweb. 17 symbols across 3 files."
---

# Contexts

17 symbols | 3 files | Cohesion: 98%

## When to Use

- Working with code in `src/`
- Understanding how isChapterId, isKnownSectionId, getChapterIndex work
- Modifying contexts-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/contexts/NavigationContext.tsx` | focusSection, getHashSectionId, getSectionDocumentTop, NavigationProvider, reconcileHash (+2) |
| `src/contexts/theme-provider.tsx` | isTheme, getSystemTheme, disableTransitionsTemporarily, isEditableTarget, ThemeProvider (+2) |
| `src/data/navigation.ts` | isChapterId, isKnownSectionId, getChapterIndex |

## Entry Points

Start here when exploring this area:

- **`isChapterId`** (Function) — `src/data/navigation.ts:62`
- **`isKnownSectionId`** (Function) — `src/data/navigation.ts:66`
- **`getChapterIndex`** (Function) — `src/data/navigation.ts:70`
- **`NavigationProvider`** (Function) — `src/contexts/NavigationContext.tsx:45`
- **`reconcileHash`** (Function) — `src/contexts/NavigationContext.tsx:89`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `isChapterId` | Function | `src/data/navigation.ts` | 62 |
| `isKnownSectionId` | Function | `src/data/navigation.ts` | 66 |
| `getChapterIndex` | Function | `src/data/navigation.ts` | 70 |
| `NavigationProvider` | Function | `src/contexts/NavigationContext.tsx` | 45 |
| `reconcileHash` | Function | `src/contexts/NavigationContext.tsx` | 89 |
| `updateActiveSection` | Function | `src/contexts/NavigationContext.tsx` | 125 |
| `scheduleUpdate` | Function | `src/contexts/NavigationContext.tsx` | 207 |
| `ThemeProvider` | Function | `src/contexts/theme-provider.tsx` | 79 |
| `handleKeyDown` | Function | `src/contexts/theme-provider.tsx` | 142 |
| `handleStorageChange` | Function | `src/contexts/theme-provider.tsx` | 182 |
| `focusSection` | Function | `src/contexts/NavigationContext.tsx` | 22 |
| `getHashSectionId` | Function | `src/contexts/NavigationContext.tsx` | 35 |
| `getSectionDocumentTop` | Function | `src/contexts/NavigationContext.tsx` | 39 |
| `isTheme` | Function | `src/contexts/theme-provider.tsx` | 25 |
| `getSystemTheme` | Function | `src/contexts/theme-provider.tsx` | 33 |
| `disableTransitionsTemporarily` | Function | `src/contexts/theme-provider.tsx` | 41 |
| `isEditableTarget` | Function | `src/contexts/theme-provider.tsx` | 60 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `WpsDossier → IsChapterId` | cross_community | 4 |
| `NarrativeSection → IsChapterId` | cross_community | 4 |
| `UNCommandCenter → IsChapterId` | cross_community | 4 |
| `NavigationProvider → IsChapterId` | intra_community | 3 |
| `ReconcileHash → IsChapterId` | intra_community | 3 |

## How to Explore

1. `gitnexus_context({name: "isChapterId"})` — see callers and callees
2. `gitnexus_query({query: "contexts"})` — find related execution flows
3. Read key files listed above for implementation details
