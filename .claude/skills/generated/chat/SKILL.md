---
name: chat
description: "Skill for the Chat area of global-governance-docuweb. 27 symbols across 5 files."
---

# Chat

27 symbols | 5 files | Cohesion: 85%

## When to Use

- Working with code in `src/`
- Understanding how parseGroundedChatEnvelope, resolveApprovedSourceId, getSourceAwareChatStarterPrompts work
- Modifying chat-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `src/lib/chat/grounded-answer.ts` | asRecord, requireString, optionalString, optionalSafePublicUrl, requirePositiveInteger (+9) |
| `src/components/chat/SourceAwareChat.tsx` | SourceAwareChat, chooseStarterPrompt, AssistantMessage, AssistantAvatar, GroundedAnswerSurface (+2) |
| `src/lib/chat/api-client.ts` | createAnonymousSessionId, getAnonymousSessionId, requestGroundedAnswer |
| `src/data/chat/source-aware-chat.ts` | getSourceAwareChatStarterPrompts, resolveStarterPromptState |
| `src/data/source-bundles/approved-source-bundle.ts` | resolveApprovedSourceId |

## Entry Points

Start here when exploring this area:

- **`parseGroundedChatEnvelope`** (Function) — `src/lib/chat/grounded-answer.ts:262`
- **`resolveApprovedSourceId`** (Function) — `src/data/source-bundles/approved-source-bundle.ts:375`
- **`getSourceAwareChatStarterPrompts`** (Function) — `src/data/chat/source-aware-chat.ts:169`
- **`resolveStarterPromptState`** (Function) — `src/data/chat/source-aware-chat.ts:182`
- **`SourceAwareChat`** (Function) — `src/components/chat/SourceAwareChat.tsx:51`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `parseGroundedChatEnvelope` | Function | `src/lib/chat/grounded-answer.ts` | 262 |
| `resolveApprovedSourceId` | Function | `src/data/source-bundles/approved-source-bundle.ts` | 375 |
| `getSourceAwareChatStarterPrompts` | Function | `src/data/chat/source-aware-chat.ts` | 169 |
| `resolveStarterPromptState` | Function | `src/data/chat/source-aware-chat.ts` | 182 |
| `SourceAwareChat` | Function | `src/components/chat/SourceAwareChat.tsx` | 51 |
| `chooseStarterPrompt` | Function | `src/components/chat/SourceAwareChat.tsx` | 229 |
| `createChatRequest` | Function | `src/lib/chat/grounded-answer.ts` | 246 |
| `toUserSafeChatError` | Function | `src/lib/chat/grounded-answer.ts` | 284 |
| `requestGroundedAnswer` | Function | `src/lib/chat/api-client.ts` | 51 |
| `closeChat` | Function | `src/components/chat/SourceAwareChat.tsx` | 148 |
| `handleShellKeyDown` | Function | `src/components/chat/SourceAwareChat.tsx` | 155 |
| `asRecord` | Function | `src/lib/chat/grounded-answer.ts` | 14 |
| `requireString` | Function | `src/lib/chat/grounded-answer.ts` | 22 |
| `optionalString` | Function | `src/lib/chat/grounded-answer.ts` | 30 |
| `optionalSafePublicUrl` | Function | `src/lib/chat/grounded-answer.ts` | 38 |
| `requirePositiveInteger` | Function | `src/lib/chat/grounded-answer.ts` | 81 |
| `parseCitation` | Function | `src/lib/chat/grounded-answer.ts` | 94 |
| `parseGrounding` | Function | `src/lib/chat/grounded-answer.ts` | 114 |
| `parseCitations` | Function | `src/lib/chat/grounded-answer.ts` | 131 |
| `parseSuggestedPrompts` | Function | `src/lib/chat/grounded-answer.ts` | 143 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `RequestGroundedAnswer → AsRecord` | cross_community | 5 |
| `RequestGroundedAnswer → RequireString` | cross_community | 5 |
| `RequestGroundedAnswer → ParseCitations` | cross_community | 4 |
| `BuildIngestionPayload → ResolveApprovedSourceId` | cross_community | 4 |
| `RenderSourceAwareChat → UseNavigation` | cross_community | 3 |
| `RenderSourceAwareChat → GetSourceAwareChatStarterPrompts` | cross_community | 3 |
| `RenderSourceAwareChat → ResolveStarterPromptState` | cross_community | 3 |
| `RenderSourceAwareChat → Cn` | cross_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Overview | 4 calls |
| Public-homepage-redesign | 2 calls |
| Layout | 1 calls |

## How to Explore

1. `gitnexus_context({name: "parseGroundedChatEnvelope"})` — see callers and callees
2. `gitnexus_query({query: "chat"})` — find related execution flows
3. Read key files listed above for implementation details
