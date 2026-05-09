---
name: support
description: "Skill for the Support area of global-governance-docuweb. 3 symbols across 2 files."
---

# Support

3 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `tests/`
- Understanding how createNavigationContextValue, renderWithNavigation work
- Modifying support-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `tests/support/render-with-navigation.tsx` | createNavigationContextValue, renderWithNavigation |
| `src/components/chat/SourceAwareChat.test.tsx` | openChat |

## Entry Points

Start here when exploring this area:

- **`createNavigationContextValue`** (Function) — `tests/support/render-with-navigation.tsx:12`
- **`renderWithNavigation`** (Function) — `tests/support/render-with-navigation.tsx:24`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `createNavigationContextValue` | Function | `tests/support/render-with-navigation.tsx` | 12 |
| `renderWithNavigation` | Function | `tests/support/render-with-navigation.tsx` | 24 |
| `openChat` | Function | `src/components/chat/SourceAwareChat.test.tsx` | 30 |

## How to Explore

1. `gitnexus_context({name: "createNavigationContextValue"})` — see callers and callees
2. `gitnexus_query({query: "support"})` — find related execution flows
3. Read key files listed above for implementation details
