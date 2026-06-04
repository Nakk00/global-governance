---
name: uncommandcenter
description: "Skill for the UNCommandCenter area of global-governance-docuweb. 7 symbols across 5 files."
---

# UNCommandCenter

7 symbols | 5 files | Cohesion: 75%

## When to Use

- Working with code in `src/`
- Understanding how getChapterById, createNavigationContextValue, renderWithNavigation work
- Modifying uncommandcenter-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `tests/support/render-with-navigation.tsx` | createNavigationContextValue, renderWithNavigation |
| `src/components/modules/UNCommandCenter/UNCommandCenter.test.tsx` | renderCommandCenter, NavigationHarness |
| `src/data/navigation.ts` | getChapterById |
| `src/components/chat/SourceAwareChat.test.tsx` | openChat |
| `src/components/modules/UNCommandCenter/UNCommandCenter.tsx` | UNCommandCenter |

## Entry Points

Start here when exploring this area:

- **`getChapterById`** (Function) — `src/data/navigation.ts:97`
- **`createNavigationContextValue`** (Function) — `tests/support/render-with-navigation.tsx:12`
- **`renderWithNavigation`** (Function) — `tests/support/render-with-navigation.tsx:32`
- **`UNCommandCenter`** (Function) — `src/components/modules/UNCommandCenter/UNCommandCenter.tsx:64`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getChapterById` | Function | `src/data/navigation.ts` | 97 |
| `createNavigationContextValue` | Function | `tests/support/render-with-navigation.tsx` | 12 |
| `renderWithNavigation` | Function | `tests/support/render-with-navigation.tsx` | 32 |
| `UNCommandCenter` | Function | `src/components/modules/UNCommandCenter/UNCommandCenter.tsx` | 64 |
| `openChat` | Function | `src/components/chat/SourceAwareChat.test.tsx` | 30 |
| `renderCommandCenter` | Function | `src/components/modules/UNCommandCenter/UNCommandCenter.test.tsx` | 19 |
| `NavigationHarness` | Function | `src/components/modules/UNCommandCenter/UNCommandCenter.test.tsx` | 22 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Chat | 1 calls |
| Layout | 1 calls |

## How to Explore

1. `gitnexus_context({name: "getChapterById"})` — see callers and callees
2. `gitnexus_query({query: "uncommandcenter"})` — find related execution flows
3. Read key files listed above for implementation details
