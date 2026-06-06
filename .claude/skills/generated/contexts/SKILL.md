---
name: contexts
description: "Skill for the Contexts area of global-governance-docuweb. 28 symbols across 3 files."
---

# Contexts

28 symbols | 3 files | Cohesion: 78%

## When to Use

- Working with code in `src/`
- Understanding how ThemeProvider, applyTheme, handleChange work
- Modifying contexts-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/contexts/NavigationContext.tsx` | getHashSectionId, getSectionDocumentTop, NavigationProvider, updateActiveSection, scheduleUpdate (+10) |
| `src/contexts/theme-provider.tsx` | isTheme, getSystemTheme, disableTransitionsTemporarily, isEditableTarget, ThemeProvider (+4) |
| `src/data/navigation.ts` | getChapterIndex, isChapterId, getAdjacentChapterId, resolveKnownSectionId |

## Entry Points

Start here when exploring this area:

- **`ThemeProvider`** (Function) — `src/contexts/theme-provider.tsx:79`
- **`applyTheme`** (Function) — `src/contexts/theme-provider.tsx:103`
- **`handleChange`** (Function) — `src/contexts/theme-provider.tsx:130`
- **`handleKeyDown`** (Function) — `src/contexts/theme-provider.tsx:142`
- **`handleStorageChange`** (Function) — `src/contexts/theme-provider.tsx:182`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ThemeProvider` | Function | `src/contexts/theme-provider.tsx` | 79 |
| `applyTheme` | Function | `src/contexts/theme-provider.tsx` | 103 |
| `handleChange` | Function | `src/contexts/theme-provider.tsx` | 130 |
| `handleKeyDown` | Function | `src/contexts/theme-provider.tsx` | 142 |
| `handleStorageChange` | Function | `src/contexts/theme-provider.tsx` | 182 |
| `getChapterIndex` | Function | `src/data/navigation.ts` | 115 |
| `NavigationProvider` | Function | `src/contexts/NavigationContext.tsx` | 56 |
| `updateActiveSection` | Function | `src/contexts/NavigationContext.tsx` | 192 |
| `scheduleUpdate` | Function | `src/contexts/NavigationContext.tsx` | 275 |
| `completedChapterIds` | Function | `src/contexts/NavigationContext.tsx` | 306 |
| `isChapterId` | Function | `src/data/navigation.ts` | 93 |
| `getAdjacentChapterId` | Function | `src/data/navigation.ts` | 119 |
| `navigateToChapter` | Function | `src/contexts/NavigationContext.tsx` | 104 |
| `navigateToAdjacentChapter` | Function | `src/contexts/NavigationContext.tsx` | 115 |
| `setActiveChapterPanel` | Function | `src/contexts/NavigationContext.tsx` | 134 |
| `resetToStart` | Function | `src/contexts/NavigationContext.tsx` | 154 |
| `resolveKnownSectionId` | Function | `src/data/navigation.ts` | 105 |
| `setActiveAndFocus` | Function | `src/contexts/NavigationContext.tsx` | 69 |
| `navigateToSection` | Function | `src/contexts/NavigationContext.tsx` | 77 |
| `resetToTop` | Function | `src/contexts/NavigationContext.tsx` | 100 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `NavigateToAdjacentChapter → IsChapterId` | cross_community | 5 |
| `NavigateToAdjacentChapter → FocusSection` | cross_community | 5 |
| `AppShell → GetHashSectionId` | cross_community | 4 |
| `NavigateToAdjacentChapter → GetHashSectionId` | cross_community | 4 |
| `NarrativeSection → IsChapterId` | cross_community | 4 |
| `NavigationProvider → FocusSection` | cross_community | 4 |
| `NavigationProvider → IsChapterId` | cross_community | 4 |
| `AppShell → ScheduleUpdate` | cross_community | 3 |
| `AppShell → IsChapterId` | cross_community | 3 |
| `AppShell → GetChapterIndex` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Sections | 1 calls |

## How to Explore

1. `gitnexus_context({name: "ThemeProvider"})` — see callers and callees
2. `gitnexus_query({query: "contexts"})` — find related execution flows
3. Read key files listed above for implementation details
