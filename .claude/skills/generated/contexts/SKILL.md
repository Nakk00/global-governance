---
name: contexts
description: "Skill for the Contexts area of global-governance-docuweb. 29 symbols across 3 files."
---

# Contexts

29 symbols | 3 files | Cohesion: 98%

## When to Use

- Working with code in `src/`
- Understanding how isChapterId, isKnownSectionId, resolveKnownSectionId work
- Modifying contexts-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/contexts/NavigationContext.tsx` | focusSection, getHashSectionId, getSectionDocumentTop, NavigationProvider, setActiveAndFocus (+10) |
| `src/contexts/theme-provider.tsx` | isTheme, getSystemTheme, disableTransitionsTemporarily, isEditableTarget, ThemeProvider (+4) |
| `src/data/navigation.ts` | isChapterId, isKnownSectionId, resolveKnownSectionId, getChapterIndex, getAdjacentChapterId |

## Entry Points

Start here when exploring this area:

- **`isChapterId`** (Function) — `src/data/navigation.ts:93`
- **`isKnownSectionId`** (Function) — `src/data/navigation.ts:101`
- **`resolveKnownSectionId`** (Function) — `src/data/navigation.ts:105`
- **`getChapterIndex`** (Function) — `src/data/navigation.ts:115`
- **`getAdjacentChapterId`** (Function) — `src/data/navigation.ts:119`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `isChapterId` | Function | `src/data/navigation.ts` | 93 |
| `isKnownSectionId` | Function | `src/data/navigation.ts` | 101 |
| `resolveKnownSectionId` | Function | `src/data/navigation.ts` | 105 |
| `getChapterIndex` | Function | `src/data/navigation.ts` | 115 |
| `getAdjacentChapterId` | Function | `src/data/navigation.ts` | 119 |
| `NavigationProvider` | Function | `src/contexts/NavigationContext.tsx` | 56 |
| `setActiveAndFocus` | Function | `src/contexts/NavigationContext.tsx` | 69 |
| `navigateToSection` | Function | `src/contexts/NavigationContext.tsx` | 77 |
| `resetToTop` | Function | `src/contexts/NavigationContext.tsx` | 100 |
| `navigateToChapter` | Function | `src/contexts/NavigationContext.tsx` | 104 |
| `navigateToAdjacentChapter` | Function | `src/contexts/NavigationContext.tsx` | 115 |
| `setActiveChapterPanel` | Function | `src/contexts/NavigationContext.tsx` | 134 |
| `resetToStart` | Function | `src/contexts/NavigationContext.tsx` | 154 |
| `reconcileHash` | Function | `src/contexts/NavigationContext.tsx` | 159 |
| `updateActiveSection` | Function | `src/contexts/NavigationContext.tsx` | 192 |
| `scheduleUpdate` | Function | `src/contexts/NavigationContext.tsx` | 275 |
| `completedChapterIds` | Function | `src/contexts/NavigationContext.tsx` | 306 |
| `ThemeProvider` | Function | `src/contexts/theme-provider.tsx` | 79 |
| `applyTheme` | Function | `src/contexts/theme-provider.tsx` | 103 |
| `handleChange` | Function | `src/contexts/theme-provider.tsx` | 130 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `NavigateToAdjacentChapter → IsChapterId` | intra_community | 5 |
| `NavigateToAdjacentChapter → FocusSection` | intra_community | 5 |
| `AppShell → GetHashSectionId` | cross_community | 4 |
| `NavigateToAdjacentChapter → GetHashSectionId` | intra_community | 4 |
| `NarrativeSection → IsChapterId` | cross_community | 4 |
| `NavigationProvider → FocusSection` | intra_community | 4 |
| `NavigationProvider → IsChapterId` | intra_community | 4 |
| `AppShell → ScheduleUpdate` | cross_community | 3 |
| `AppShell → IsChapterId` | cross_community | 3 |
| `AppShell → GetChapterIndex` | cross_community | 3 |

## How to Explore

1. `gitnexus_context({name: "isChapterId"})` — see callers and callees
2. `gitnexus_query({query: "contexts"})` — find related execution flows
3. Read key files listed above for implementation details
