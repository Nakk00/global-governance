---
name: chat
description: "Skill for the Chat area of global-governance-docuweb. 21 symbols across 4 files."
---

# Chat

21 symbols | 4 files | Cohesion: 90%

## When to Use

- Working with code in `src/`
- Understanding how parseGroundedChatEnvelope, createChatRequest, toUserSafeChatError work
- Modifying chat-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/lib/chat/grounded-answer.ts` | asRecord, requireString, optionalString, requirePositiveInteger, parseCitation (+7) |
| `src/components/chat/SourceAwareChat.tsx` | SourceAwareChat, chooseStarterPrompt, closeChat, handleShellKeyDown |
| `src/lib/chat/api-client.ts` | createAnonymousSessionId, getAnonymousSessionId, requestGroundedAnswer |
| `src/data/chat/source-aware-chat.ts` | getSourceAwareChatStarterPrompts, resolveStarterPromptState |

## Entry Points

Start here when exploring this area:

- **`parseGroundedChatEnvelope`** (Function) — `src/lib/chat/grounded-answer.ts:187`
- **`createChatRequest`** (Function) — `src/lib/chat/grounded-answer.ts:171`
- **`toUserSafeChatError`** (Function) — `src/lib/chat/grounded-answer.ts:209`
- **`requestGroundedAnswer`** (Function) — `src/lib/chat/api-client.ts:53`
- **`getSourceAwareChatStarterPrompts`** (Function) — `src/data/chat/source-aware-chat.ts:186`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `parseGroundedChatEnvelope` | Function | `src/lib/chat/grounded-answer.ts` | 187 |
| `createChatRequest` | Function | `src/lib/chat/grounded-answer.ts` | 171 |
| `toUserSafeChatError` | Function | `src/lib/chat/grounded-answer.ts` | 209 |
| `requestGroundedAnswer` | Function | `src/lib/chat/api-client.ts` | 53 |
| `getSourceAwareChatStarterPrompts` | Function | `src/data/chat/source-aware-chat.ts` | 186 |
| `resolveStarterPromptState` | Function | `src/data/chat/source-aware-chat.ts` | 199 |
| `SourceAwareChat` | Function | `src/components/chat/SourceAwareChat.tsx` | 40 |
| `chooseStarterPrompt` | Function | `src/components/chat/SourceAwareChat.tsx` | 154 |
| `closeChat` | Function | `src/components/chat/SourceAwareChat.tsx` | 75 |
| `handleShellKeyDown` | Function | `src/components/chat/SourceAwareChat.tsx` | 82 |
| `asRecord` | Function | `src/lib/chat/grounded-answer.ts` | 14 |
| `requireString` | Function | `src/lib/chat/grounded-answer.ts` | 22 |
| `optionalString` | Function | `src/lib/chat/grounded-answer.ts` | 30 |
| `requirePositiveInteger` | Function | `src/lib/chat/grounded-answer.ts` | 38 |
| `parseCitation` | Function | `src/lib/chat/grounded-answer.ts` | 51 |
| `parseGrounding` | Function | `src/lib/chat/grounded-answer.ts` | 71 |
| `parseCitations` | Function | `src/lib/chat/grounded-answer.ts` | 88 |
| `parseSuccessData` | Function | `src/lib/chat/grounded-answer.ts` | 96 |
| `parseError` | Function | `src/lib/chat/grounded-answer.ts` | 162 |
| `createAnonymousSessionId` | Function | `src/lib/chat/api-client.ts` | 18 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `RequestGroundedAnswer → AsRecord` | cross_community | 5 |
| `RequestGroundedAnswer → RequireString` | cross_community | 5 |
| `RequestGroundedAnswer → ParseCitations` | cross_community | 4 |
| `RequestGroundedAnswer → CreateAnonymousSessionId` | intra_community | 3 |
| `ParseCitation → RequireString` | intra_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Source-bundles | 1 calls |
| Layout | 1 calls |
| Ui | 1 calls |

## How to Explore

1. `gitnexus_context({name: "parseGroundedChatEnvelope"})` — see callers and callees
2. `gitnexus_query({query: "chat"})` — find related execution flows
3. Read key files listed above for implementation details
