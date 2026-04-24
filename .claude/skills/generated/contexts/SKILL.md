---
name: contexts
description: "Skill for the Contexts area of Global-Governance. 7 symbols across 1 files."
---

# Contexts

7 symbols | 1 files | Cohesion: 83%

## When to Use

- Working with code in `src/`
- Understanding how ThemeProvider, handleStorageChange, handleKeyDown work
- Modifying contexts-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/contexts/theme-provider.tsx` | isTheme, disableTransitionsTemporarily, ThemeProvider, handleStorageChange, getSystemTheme (+2) |

## Entry Points

Start here when exploring this area:

- **`ThemeProvider`** (Function) — `src/contexts/theme-provider.tsx:79`
- **`handleStorageChange`** (Function) — `src/contexts/theme-provider.tsx:182`
- **`handleKeyDown`** (Function) — `src/contexts/theme-provider.tsx:142`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `ThemeProvider` | Function | `src/contexts/theme-provider.tsx` | 79 |
| `handleStorageChange` | Function | `src/contexts/theme-provider.tsx` | 182 |
| `handleKeyDown` | Function | `src/contexts/theme-provider.tsx` | 142 |
| `isTheme` | Function | `src/contexts/theme-provider.tsx` | 25 |
| `disableTransitionsTemporarily` | Function | `src/contexts/theme-provider.tsx` | 41 |
| `getSystemTheme` | Function | `src/contexts/theme-provider.tsx` | 33 |
| `isEditableTarget` | Function | `src/contexts/theme-provider.tsx` | 60 |

## How to Explore

1. `gitnexus_context({name: "ThemeProvider"})` — see callers and callees
2. `gitnexus_query({query: "contexts"})` — find related execution flows
3. Read key files listed above for implementation details
