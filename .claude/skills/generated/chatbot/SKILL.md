---
name: chatbot
description: "Skill for the Chatbot area of global-governance-docuweb. 7 symbols across 2 files."
---

# Chatbot

7 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `scripts/`
- Understanding how normalizeSourceIds, sourceIdsMatch work
- Modifying chatbot-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `scripts/chatbot/validate-chatbot-boundaries.ts` | postJson, requireSuccess, validateBoundaryCase, validateProtectionCase, main |
| `tests/support/chat-boundary-cases.ts` | normalizeSourceIds, sourceIdsMatch |

## Entry Points

Start here when exploring this area:

- **`normalizeSourceIds`** (Function) — `tests/support/chat-boundary-cases.ts:140`
- **`sourceIdsMatch`** (Function) — `tests/support/chat-boundary-cases.ts:146`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `normalizeSourceIds` | Function | `tests/support/chat-boundary-cases.ts` | 140 |
| `sourceIdsMatch` | Function | `tests/support/chat-boundary-cases.ts` | 146 |
| `postJson` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 49 |
| `requireSuccess` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 73 |
| `validateBoundaryCase` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 82 |
| `validateProtectionCase` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 159 |
| `main` | Function | `scripts/chatbot/validate-chatbot-boundaries.ts` | 208 |

## How to Explore

1. `gitnexus_context({name: "normalizeSourceIds"})` — see callers and callees
2. `gitnexus_query({query: "chatbot"})` — find related execution flows
3. Read key files listed above for implementation details
