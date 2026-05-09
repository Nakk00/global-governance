# Story 4.4: Handle Refusal and Protection States

Status: done

## Story

As a learner,
I want the chatbot to refuse off-topic prompts and show protection states clearly,
so that I understand when the assistant cannot help and can continue learning safely.

## Acceptance Criteria

1. Given I ask an off-topic question, when the chatbot evaluates it before retrieval or answer generation, then it returns a `200` success envelope with a typed `refused` state instead of answering outside the approved scope, and the message stays calm, academically framed, citation-free, and offers a clear rephrase or return-to-course next step.
2. Given the chatbot is under temporary protection or cooldown, when I submit another prompt, then the response shows a visible cooldown or protection state in the chat surface, explains that the assistant is temporarily limited, keeps the rest of the learning experience usable, and appears within 2 seconds of submission.
3. Given the chatbot cannot provide strong support even though the question is on-topic, when it responds, then it preserves the weak-support path from Story 4.3 instead of converting the answer into unsupported certainty, and it keeps refusal or protection behavior separate from the weak-support path.
4. Given the protection layer is triggered repeatedly, when the public-chat threshold is reached, then the server enforces no more than 10 submissions per 60-second window per anonymous session and a 60-second cooldown after 3 consecutive abuse-triggering prompts, and the client does not collapse the outcome into a generic transport failure.
5. Given the browser receives a refusal or cooldown envelope, when the chat client parses it, then the state survives runtime validation and reaches React as a typed successful outcome rather than the generic grounded-chat unavailable error, while malformed protection payloads still fall back to the existing user-safe unavailable error.
6. Given I use keyboard only, reduced motion, or assistive technology, when refusal or cooldown appears, then the message, retry or rephrase action, and close controls remain reachable with visible focus states, the panel does not trap focus, and the state is announced clearly and remains readable at 360 px, 480 px, 768 px, 1024 px, and 1280 px plus without horizontal scrolling.
7. Given I review the refusal or cooldown explanation, when I read it, then it makes the chatbot's bounded academic role obvious, avoids punitive or confusing language, preserves the learner's ability to continue the main flow, and includes an obvious retry or rephrase affordance.
8. Given multiple decision branches could apply to the same prompt, when the server evaluates the request, then protection and cooldown rules take precedence over weak-support or answered states, and off-topic refusal takes precedence over grounded-answer generation while remaining distinct from generic transport errors.

## Tasks / Subtasks

- [x] Finalize the refusal and cooldown state contract in `src/types/chat.ts` and `src/lib/chat/grounded-answer.ts` (AC: 1, 2, 4, 6)
  - [x] Replace the temporary `deferredProtection` bridge so the shared union expresses explicit `refused` and cooldown or protection outcomes with stable discriminants and required fields.
  - [x] Define the success-envelope contract for typed protection states, including whether cooldown remains a `200` success envelope or uses `429` with a parseable typed body, and keep the browser contract consistent with that decision.
  - [x] Extend runtime parsing so typed refusal or protection envelopes survive validation before React state commits, while malformed protection payloads still degrade to the existing user-safe unavailable error.
  - [x] Keep weak-support and answered paths from Story 4.3 unchanged.
- [x] Extend server orchestration and protection enforcement in `supabase/functions/chat/index.ts` and shared helpers under `supabase/functions/_shared/` (AC: 1-4, 7)
  - [x] Short-circuit off-topic prompts before expensive retrieval or generation work using an explicit topic-boundary rule that still permits legitimate course, chapter-navigation, and source-inspection prompts.
  - [x] Apply server-side public-chat protection rules, including no more than 10 submissions per 60-second window per anonymous session plus a 60-second cooldown after 3 consecutive abuse-triggering prompts, without moving privileged logic into browser code.
  - [x] Define how anonymous session identity is derived for protection purposes and where abuse counters reset so the behavior is testable and consistent in local development.
  - [x] Return calm, typed refusal or cooldown responses inside the standard chat envelope with stable codes and user-safe guidance, and keep citations out of refusal or cooldown states unless a deliberate course-link affordance is specified.
- [x] Update the chat surface in `src/components/chat/SourceAwareChat.tsx` and `src/lib/chat/api-client.ts` (AC: 1-7)
  - [x] Render explicit refusal and cooldown copy in the existing chat shell with a clearly labeled retry or rephrase affordance.
  - [x] Keep non-chat sections interactive while the chat is limited.
  - [x] Preserve the Story 4.2 and Story 4.3 focus, reduced-motion, and open/close behavior.
  - [x] Accept typed protection responses without collapsing them into the generic unavailable error, and announce refusal or cooldown changes through the existing accessible status surface.
- [x] Add regression coverage across frontend, Edge Functions, and live chat flows (AC: 1-7)
  - [x] Extend `src/lib/chat/grounded-answer.test.ts` and `src/lib/chat/api-client.test.ts` for refusal and cooldown parsing, precedence handling, and safe fallback behavior for malformed protection payloads.
  - [x] Extend `supabase/functions/tests/chat.test.ts` for off-topic refusal, threshold enforcement at 10 requests per 60 seconds, 60-second cooldown after 3 consecutive abuse-triggering prompts, and reset behavior.
  - [x] Extend `tests/e2e/home.spec.ts` and `tests/e2e/chat-live.spec.ts` for calm refusal copy, cooldown messaging, keyboard access, screen-reader announcement coverage where practical, reduced motion, responsive containment, and non-chat flow continuity across 360 px, 480 px, 768 px, 1024 px, and 1280 px layouts.

### Review Findings

- [x] [Review][Patch] Protection counters live only in process memory and never evict old sessions [supabase/functions/_shared/chat-protection.ts:50]
- [x] [Review][Patch] Anonymous session identity is client-controlled and unstable across storage-blocked browsers [src/lib/chat/api-client.ts:26]
- [x] [Review][Patch] Topic gating uses brittle substring matching that can misclassify off-topic prompts [supabase/functions/_shared/chat-protection.ts:27]

## Dev Notes

### Current State

- Story 4.3 already wires grounded answers, source chips, weak-support, and user-safe error copy through `SourceAwareChat`, `src/lib/chat/grounded-answer.ts`, `src/lib/chat/api-client.ts`, and `supabase/functions/chat/index.ts`.
- `src/types/chat.ts` and `src/components/chat/SourceAwareChat.tsx` already include a temporary `deferredProtection` bridge, but the backend does not yet emit explicit refusal or cooldown behavior.
- `supabase/functions/chat/index.ts` currently handles `OPTIONS`, `POST`, invalid JSON, empty question, and generic grounding failure. It does not yet enforce or surface the public-chat protection rules from Epic 4 and Epic 5.
- `supabase/functions/_shared/chat-grounding.ts` currently scopes approved sources and weak-support logic only. The protection layer still needs a dedicated server-side decision path.
- `src/lib/chat/api-client.ts` currently treats any non-OK or parse failure as the generic user-safe unavailable error, so it will need to accept typed protection responses if the server emits them.
- `tests/e2e/chat-live.spec.ts` currently asserts the answered path for the hero prompt, which is a good template for the new live refusal and protection cases.
- Browser code must stay presentation-only; the protection rules, rate limiting, abuse counters, and cooldown tracking belong in Edge Functions or server-side helpers.
- The current chat types and parser distinguish `answered`, `weakSupport`, and `deferredProtection`, so Story 4.4 must make the final refusal and cooldown discriminants explicit before implementation starts.

### Scope Boundaries

- Keep the story focused on explicit refusal and protection states, not broader retrieval, citation, or source-inspection work. Story 4.3 already owns grounded answers and source support.
- Keep weak-support behavior intact. If the prompt is still on-topic but not confidently grounded, stay on the Story 4.3 path rather than converting it into refusal.
- Define precedence clearly: protection or cooldown checks win over weak-support or answered states, and off-topic refusal wins before grounded-answer generation.
- Do not add a router, global store, or public maintainer dashboard.
- Do not move Redis, topic checking, or protection enforcement into `src/`.
- Keep the main learning flow usable even while chat is refused, limited, or cooling down.
- Keep refusals calm, academic, and clearly bounded to the approved course material.

### Architecture Guardrails

- Use the shared `{ success, data, error }` envelope and typed success outcomes for refusal and protection states.
- Keep browser-facing code in `src/` and privileged retrieval or protection logic in `supabase/functions/`.
- Treat off-topic refusal and cooldown as user-visible chat states, not generic transport errors.
- Keep Redis server-side only; the browser should never touch rate-limit or abuse counters.
- Preserve reduced motion, keyboard reachability, visible focus, and no-horizontal-scroll behavior on every state branch.
- Keep chat presentation components free of direct data mutation or service-role access.
- If a new shared helper is needed, add it under `supabase/functions/_shared` rather than creating a parallel ad hoc path.
- Align implementation with the architecture guidance that `refused` is a first-class async state and that rate limiting may use `429`, but do not let that transport status bypass the typed browser-visible protection experience.

### Testing Standards Summary

- Keep frontend unit tests co-located.
- Extend existing contract tests for parsing and client behavior.
- Add or extend Edge Function tests for refusal, cooldown, and threshold behavior.
- Extend `tests/e2e/home.spec.ts` for visible refusal or cooldown UI, keyboard access, reduced motion, and responsive containment.
- Extend `tests/e2e/chat-live.spec.ts` to verify the live backend returns typed protection states and the client renders them without breaking the rest of the page.
- Prefer `getByRole()` and media emulation over brittle selectors or sleeps.
- Use the existing chat-live workflow (`pnpm test:chat:live`) when verifying the real local Supabase function path.
- Include explicit threshold and timing assertions where practical so the story verifies the 10-per-60-second window, 3-strike abuse cooldown, 60-second cooldown duration, and visible fallback timing target.

### Latest Tech Notes

- React 19.2 is the current official release line; keep the story in standard function components and hooks, and keep any new chat branches compatible with `useId`, `useEffect`, and other current hook patterns.
- Vite 8 is the current stable line in the official docs, while this repo continues to follow the existing Vite-based SPA scaffold.
- Playwright's recommended locators are role-based and resilient, and its emulation docs cover viewport, touch, and reduced-motion checks that match this story's state coverage.
- Supabase Edge Functions are the correct server boundary for refusal and protection orchestration, with browser code limited to rendering and request/response handling.

### Project Structure Notes

- Likely update `src/components/chat/SourceAwareChat.tsx`
- Likely update `src/lib/chat/api-client.ts`
- Likely update `src/lib/chat/grounded-answer.ts`
- Likely update `src/types/chat.ts`
- Likely update `supabase/functions/chat/index.ts`
- Likely update `supabase/functions/_shared/chat-grounding.ts`
- Likely update `supabase/functions/tests/chat.test.ts`
- Likely update `tests/e2e/home.spec.ts`
- Likely update `tests/e2e/chat-live.spec.ts`
- The current `_shared` inventory only contains `chat-grounding.ts`, so any new protection helper should stay in that folder and not be invented inside `src/`.
- The existing `deferredProtection` render branch in `SourceAwareChat` is the temporary bridge to replace, not a final design.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 4, Story 4.4: Handle Refusal and Protection States]
- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 5, Story 5.3: Validate Chatbot Boundaries]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR23-FR29, FR37, NFR9, NFR10, NFR15, NFR24]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, API & Communication Patterns, Error Handling Patterns, Loading State Patterns, Source-Aware Chat Panel, Data Boundaries, Integration Points]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, Source-Aware Chat Panel, Protection feedback, Form patterns, Loading states]
- [Source: `_bmad-output/project-context.md`, typed async states, response envelope discipline, server-side protection layer, and no privileged retrieval in browser code]
- [Source: `src/components/chat/SourceAwareChat.tsx`, current chat shell with the temporary `deferredProtection` branch]
- [Source: `src/lib/chat/api-client.ts`, current chat request and response handling]
- [Source: `src/lib/chat/grounded-answer.ts`, current chat envelope parsing and placeholder protection state]
- [Source: `src/types/chat.ts`, current chat state union and `deferredProtection` placeholder]
- [Source: `supabase/functions/chat/index.ts`, current chat Edge Function boundary]
- [Source: `supabase/functions/_shared/chat-grounding.ts`, current approved-source retrieval and weak-support logic]
- [Source: `supabase/functions/tests/chat.test.ts`, current grounding tests]
- [Source: `tests/e2e/home.spec.ts`, current chat shell and page-level accessibility and reduced-motion patterns]
- [Source: `tests/e2e/chat-live.spec.ts`, current live chat envelope expectations]
- [Source: https://react.dev/blog/2025/10/01/react-19-2, React 19.2 release notes]
- [Source: https://react.dev/versions, React versions overview]
- [Source: https://vite.dev/blog/announcing-vite8, Vite 8 release notes]
- [Source: https://playwright.dev/docs/locators, role-based locator guidance]
- [Source: https://playwright.dev/docs/emulation, viewport, touch, and reduced-motion emulation guidance]
- [Source: https://supabase.com/docs/guides/functions, Edge Functions overview]

## Story Completion Status

- review
- Story context engine analysis completed - comprehensive developer guide created

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-04-30: Resolved create-story customization fallback after `python3` was unavailable locally.
- 2026-04-30: Loaded project context, sprint tracking, Epic 4, PRD, architecture, UX, the prior chat stories, live chat code, recent git history, and official docs for React, Vite, Playwright, and Supabase Edge Functions.
- 2026-04-30: Confirmed Story 4.4 should replace the temporary `deferredProtection` bridge with explicit refusal and cooldown behavior while preserving the grounded-answer flow from Story 4.3.
- 2026-04-30: Started dev-story implementation and updated sprint tracking to `in-progress`.
- 2026-04-30: GitNexus impact analysis returned LOW risk for `parseGroundedChatEnvelope`, `requestGroundedAnswer`, `SourceAwareChat`, `assembleGroundedChatResponse`, `retrieveApprovedSources`, and `createChatErrorEnvelope`.
- 2026-04-30: Added explicit `refused` and `cooldown` chat outcomes, server-side protection evaluation, typed client parsing for 429 cooldown envelopes, and refusal/cooldown UI states.
- 2026-04-30: Validation passed: `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:unit`, `pnpm test:functions`, `pnpm test:e2e`, and `pnpm test:chat:live`.
- 2026-04-30: GitNexus `detect_changes` reported medium risk with affected grounded-answer parsing/request processes; many reported changed files were pre-existing unrelated worktree changes.

### Completion Notes List

- Story 4.4 is scoped to off-topic refusal, calm cooldown or protection UX, and typed success handling for protection states.
- The story keeps chat presentation-only in the browser and leaves protection enforcement server-side.
- The story preserves Story 4.3 grounded-answer behavior, source chips, and weak-support handling.
- Replaced `deferredProtection` with explicit `refused` and `cooldown` success states, with malformed protection payloads still falling back to the existing safe unavailable error.
- Added server-side anonymous-session protection with a 10-submission/60-second window and 60-second cooldown after 3 consecutive boundary-triggering prompts.
- Added chat UI refusal and cooldown panels with reachable rephrase/retry actions that return focus to the question input.
- Added frontend contract/client tests, Edge Function helper tests, mocked Playwright coverage, and live Supabase chat coverage for refusal and cooldown.

### Change Log

- 2026-04-30: Implemented Story 4.4 refusal and protection states; status moved to review.

### File List

- `_bmad-output/implementation-artifacts/4-4-handle-refusal-and-protection-states.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/chat/SourceAwareChat.tsx`
- `src/lib/chat/api-client.test.ts`
- `src/lib/chat/api-client.ts`
- `src/lib/chat/grounded-answer.test.ts`
- `src/lib/chat/grounded-answer.ts`
- `src/types/chat.ts`
- `supabase/functions/_shared/chat-grounding.ts`
- `supabase/functions/_shared/chat-protection.ts`
- `supabase/functions/chat/index.ts`
- `supabase/functions/tests/chat.test.ts`
- `tests/e2e/chat-live.spec.ts`
- `tests/e2e/home.spec.ts`
