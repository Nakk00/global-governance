---
name: chat
description: "Skill for the Chat area of global-governance-docuweb. 24 symbols across 4 files."
---

# Chat

24 symbols | 4 files | Cohesion: 84%

## When to Use

- Working with code in `src/`
- Understanding how parseGroundedChatEnvelope, getSourceAwareChatStarterPrompts, resolveStarterPromptState work
- Modifying chat-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/lib/chat/grounded-answer.ts` | asRecord, requireString, optionalString, requirePositiveInteger, parseCitation (+7) |
| `src/components/chat/SourceAwareChat.tsx` | SourceAwareChat, chooseStarterPrompt, AssistantMessage, AssistantAvatar, GroundedAnswerSurface (+2) |
| `src/lib/chat/api-client.ts` | createAnonymousSessionId, getAnonymousSessionId, requestGroundedAnswer |
| `src/data/chat/source-aware-chat.ts` | getSourceAwareChatStarterPrompts, resolveStarterPromptState |

## Entry Points

Start here when exploring this area:

- **`parseGroundedChatEnvelope`** (Function) — `src/lib/chat/grounded-answer.ts:187`
- **`getSourceAwareChatStarterPrompts`** (Function) — `src/data/chat/source-aware-chat.ts:169`
- **`resolveStarterPromptState`** (Function) — `src/data/chat/source-aware-chat.ts:182`
- **`SourceAwareChat`** (Function) — `src/components/chat/SourceAwareChat.tsx:50`
- **`chooseStarterPrompt`** (Function) — `src/components/chat/SourceAwareChat.tsx:226`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `parseGroundedChatEnvelope` | Function | `src/lib/chat/grounded-answer.ts` | 187 |
| `getSourceAwareChatStarterPrompts` | Function | `src/data/chat/source-aware-chat.ts` | 169 |
| `resolveStarterPromptState` | Function | `src/data/chat/source-aware-chat.ts` | 182 |
| `SourceAwareChat` | Function | `src/components/chat/SourceAwareChat.tsx` | 50 |
| `chooseStarterPrompt` | Function | `src/components/chat/SourceAwareChat.tsx` | 226 |
| `createChatRequest` | Function | `src/lib/chat/grounded-answer.ts` | 171 |
| `toUserSafeChatError` | Function | `src/lib/chat/grounded-answer.ts` | 209 |
| `requestGroundedAnswer` | Function | `src/lib/chat/api-client.ts` | 53 |
| `closeChat` | Function | `src/components/chat/SourceAwareChat.tsx` | 146 |
| `handleShellKeyDown` | Function | `src/components/chat/SourceAwareChat.tsx` | 153 |
| `asRecord` | Function | `src/lib/chat/grounded-answer.ts` | 14 |
| `requireString` | Function | `src/lib/chat/grounded-answer.ts` | 22 |
| `optionalString` | Function | `src/lib/chat/grounded-answer.ts` | 30 |
| `requirePositiveInteger` | Function | `src/lib/chat/grounded-answer.ts` | 38 |
| `parseCitation` | Function | `src/lib/chat/grounded-answer.ts` | 51 |
| `parseGrounding` | Function | `src/lib/chat/grounded-answer.ts` | 71 |
| `parseCitations` | Function | `src/lib/chat/grounded-answer.ts` | 88 |
| `parseSuccessData` | Function | `src/lib/chat/grounded-answer.ts` | 96 |
| `parseError` | Function | `src/lib/chat/grounded-answer.ts` | 162 |
| `AssistantMessage` | Function | `src/components/chat/SourceAwareChat.tsx` | 520 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `RequestGroundedAnswer → AsRecord` | cross_community | 5 |
| `RequestGroundedAnswer → RequireString` | cross_community | 5 |
| `RequestGroundedAnswer → ParseCitations` | cross_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Overview | 4 calls |
| Public-homepage-redesign | 2 calls |
| Source-bundles | 1 calls |
| Layout | 1 calls |

## How to Explore

1. `gitnexus_context({name: "parseGroundedChatEnvelope"})` — see callers and callees
2. `gitnexus_query({query: "chat"})` — find related execution flows
3. Read key files listed above for implementation details
