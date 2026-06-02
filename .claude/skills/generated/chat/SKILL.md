---
name: chat
description: "Skill for the Chat area of global-governance-docuweb. 25 symbols across 6 files."
---

# Chat

25 symbols | 6 files | Cohesion: 86%

## When to Use

- Working with code in `src/`
- Understanding how parseGroundedChatEnvelope, getSourceAwareChatStarterPrompts, resolveStarterPromptState work
- Modifying chat-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/lib/chat/grounded-answer.ts` | asRecord, requireString, optionalString, requirePositiveInteger, parseCitation (+7) |
| `src/components/chat/SourceAwareChat.tsx` | SourceAwareChat, chooseStarterPrompt, GroundedAnswerSurface, closeChat, handleShellKeyDown |
| `src/lib/chat/api-client.ts` | createAnonymousSessionId, getAnonymousSessionId, requestGroundedAnswer |
| `src/data/chat/source-aware-chat.ts` | getSourceAwareChatStarterPrompts, resolveStarterPromptState |
| `tests/support/render-with-navigation.tsx` | createNavigationContextValue, renderWithNavigation |
| `src/components/chat/SourceAwareChat.test.tsx` | openChat |

## Entry Points

Start here when exploring this area:

- **`parseGroundedChatEnvelope`** (Function) — `src/lib/chat/grounded-answer.ts:187`
- **`getSourceAwareChatStarterPrompts`** (Function) — `src/data/chat/source-aware-chat.ts:169`
- **`resolveStarterPromptState`** (Function) — `src/data/chat/source-aware-chat.ts:182`
- **`createNavigationContextValue`** (Function) — `tests/support/render-with-navigation.tsx:12`
- **`renderWithNavigation`** (Function) — `tests/support/render-with-navigation.tsx:24`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `parseGroundedChatEnvelope` | Function | `src/lib/chat/grounded-answer.ts` | 187 |
| `getSourceAwareChatStarterPrompts` | Function | `src/data/chat/source-aware-chat.ts` | 169 |
| `resolveStarterPromptState` | Function | `src/data/chat/source-aware-chat.ts` | 182 |
| `createNavigationContextValue` | Function | `tests/support/render-with-navigation.tsx` | 12 |
| `renderWithNavigation` | Function | `tests/support/render-with-navigation.tsx` | 24 |
| `SourceAwareChat` | Function | `src/components/chat/SourceAwareChat.tsx` | 41 |
| `chooseStarterPrompt` | Function | `src/components/chat/SourceAwareChat.tsx` | 155 |
| `createChatRequest` | Function | `src/lib/chat/grounded-answer.ts` | 171 |
| `toUserSafeChatError` | Function | `src/lib/chat/grounded-answer.ts` | 209 |
| `requestGroundedAnswer` | Function | `src/lib/chat/api-client.ts` | 53 |
| `closeChat` | Function | `src/components/chat/SourceAwareChat.tsx` | 76 |
| `handleShellKeyDown` | Function | `src/components/chat/SourceAwareChat.tsx` | 83 |
| `asRecord` | Function | `src/lib/chat/grounded-answer.ts` | 14 |
| `requireString` | Function | `src/lib/chat/grounded-answer.ts` | 22 |
| `optionalString` | Function | `src/lib/chat/grounded-answer.ts` | 30 |
| `requirePositiveInteger` | Function | `src/lib/chat/grounded-answer.ts` | 38 |
| `parseCitation` | Function | `src/lib/chat/grounded-answer.ts` | 51 |
| `parseGrounding` | Function | `src/lib/chat/grounded-answer.ts` | 71 |
| `parseCitations` | Function | `src/lib/chat/grounded-answer.ts` | 88 |
| `parseSuccessData` | Function | `src/lib/chat/grounded-answer.ts` | 96 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `RequestGroundedAnswer → AsRecord` | cross_community | 5 |
| `RequestGroundedAnswer → RequireString` | cross_community | 5 |
| `RequestGroundedAnswer → ParseCitations` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Overview | 2 calls |
| Public-homepage-redesign | 2 calls |
| Source-bundles | 1 calls |
| Layout | 1 calls |

## How to Explore

1. `gitnexus_context({name: "parseGroundedChatEnvelope"})` — see callers and callees
2. `gitnexus_query({query: "chat"})` — find related execution flows
3. Read key files listed above for implementation details
