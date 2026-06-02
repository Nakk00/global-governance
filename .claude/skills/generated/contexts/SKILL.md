---
name: contexts
description: "Skill for the Contexts area of global-governance-docuweb. 29 symbols across 3 files."
---

# Contexts

29 symbols | 3 files | Cohesion: 89%

## When to Use

- Working with code in `src/`
- Understanding how isChapterId, isKnownSectionId, getChapterIndex work
- Modifying contexts-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/contexts/NavigationContext.tsx` | getSectionDocumentTop, NavigationProvider, navigateToChapter, navigateToAdjacentChapter, setActiveChapterPanel (+10) |
| `src/contexts/theme-provider.tsx` | isTheme, getSystemTheme, disableTransitionsTemporarily, isEditableTarget, ThemeProvider (+4) |
| `src/data/navigation.ts` | isChapterId, isKnownSectionId, getChapterIndex, getAdjacentChapterId, resolveKnownSectionId |

## Entry Points

Start here when exploring this area:

- **`isChapterId`** (Function) — `src/data/navigation.ts:116`
- **`isKnownSectionId`** (Function) — `src/data/navigation.ts:124`
- **`getChapterIndex`** (Function) — `src/data/navigation.ts:138`
- **`getAdjacentChapterId`** (Function) — `src/data/navigation.ts:142`
- **`NavigationProvider`** (Function) — `src/contexts/NavigationContext.tsx:56`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `isChapterId` | Function | `src/data/navigation.ts` | 116 |
| `isKnownSectionId` | Function | `src/data/navigation.ts` | 124 |
| `getChapterIndex` | Function | `src/data/navigation.ts` | 138 |
| `getAdjacentChapterId` | Function | `src/data/navigation.ts` | 142 |
| `NavigationProvider` | Function | `src/contexts/NavigationContext.tsx` | 56 |
| `navigateToChapter` | Function | `src/contexts/NavigationContext.tsx` | 104 |
| `navigateToAdjacentChapter` | Function | `src/contexts/NavigationContext.tsx` | 115 |
| `setActiveChapterPanel` | Function | `src/contexts/NavigationContext.tsx` | 134 |
| `resetToStart` | Function | `src/contexts/NavigationContext.tsx` | 154 |
| `updateActiveSection` | Function | `src/contexts/NavigationContext.tsx` | 192 |
| `scheduleUpdate` | Function | `src/contexts/NavigationContext.tsx` | 275 |
| `completedChapterIds` | Function | `src/contexts/NavigationContext.tsx` | 306 |
| `ThemeProvider` | Function | `src/contexts/theme-provider.tsx` | 79 |
| `applyTheme` | Function | `src/contexts/theme-provider.tsx` | 103 |
| `handleChange` | Function | `src/contexts/theme-provider.tsx` | 130 |
| `handleKeyDown` | Function | `src/contexts/theme-provider.tsx` | 142 |
| `handleStorageChange` | Function | `src/contexts/theme-provider.tsx` | 182 |
| `resolveKnownSectionId` | Function | `src/data/navigation.ts` | 128 |
| `setActiveAndFocus` | Function | `src/contexts/NavigationContext.tsx` | 69 |
| `navigateToSection` | Function | `src/contexts/NavigationContext.tsx` | 77 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `NavigateToAdjacentChapter → IsChapterId` | cross_community | 5 |
| `NavigateToAdjacentChapter → FocusSection` | cross_community | 5 |
| `AppShell → GetHashSectionId` | cross_community | 4 |
| `NavigateToAdjacentChapter → GetHashSectionId` | cross_community | 4 |
| `NarrativeSection → IsChapterId` | cross_community | 4 |
| `WpsDossier → IsChapterId` | cross_community | 4 |
| `NavigationProvider → FocusSection` | cross_community | 4 |
| `NavigationProvider → IsChapterId` | cross_community | 4 |
| `UNCommandCenter → IsChapterId` | cross_community | 4 |
| `GlobalGovernanceOverviewChapter → IsChapterId` | cross_community | 4 |

## How to Explore

1. `gitnexus_context({name: "isChapterId"})` — see callers and callees
2. `gitnexus_query({query: "contexts"})` — find related execution flows
3. Read key files listed above for implementation details
