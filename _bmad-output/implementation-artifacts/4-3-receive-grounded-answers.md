# Story 4.3: Receive Grounded Answers

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want chatbot responses to be grounded in approved materials with visible source support,
so that I can trust the answer and verify it against the project content.

## Acceptance Criteria

1. Given I ask a question that is within the approved project scope, when the chatbot responds, then it answers from approved materials rather than open-ended speculation, stays aligned with the site's educational content, and uses the typed chat success contract rather than an ad hoc response shape.
2. Given the chatbot returns a factual answer, when I inspect the response, then I can see supporting source chips or citation details with stable source ids, readable metadata, and visible grounding cues that make the answer's approved-material basis obvious.
3. Given chatbot support is weak but still usable, when a response is returned, then the UI shows a visible weak-support state within the standard successful response contract, keeps the rest of the site usable, tells me what to do next, and does not present unsupported certainty.
4. Given I submit a question through the chat panel, when the request is in flight, then the panel shows a visible loading state quickly, keeps non-chat content interactive, and transitions cleanly into answered, weak-support, or user-safe error copy without leaving the surface in an ambiguous state.
5. Given I compare the chatbot answer to the learning flow, when I review both, then the response reinforces concepts encountered in the main experience through approved topic alignment and behaves like a helper for the site's curriculum, not a separate tool.
6. Given I need to inspect evidence behind a response, when I open source details from the answer, then I can see the relevant source support in one explicit disclosure model that stays inside the chat context, preserves chat scroll and focus behavior, and presents the evidence in a readable, inspectable format across 360 px, 768 px, 1024 px, and desktop widths.
7. Given a prompt cannot be strongly grounded even though it is in scope, when the chatbot cannot support a confident answer, then it returns the weak-support state instead of speculating, and if a minimal out-of-scope or protection placeholder is needed in the shared contract, that placeholder remains typed and clearly deferred to Story 4.4's full refusal/protection UX.

## Tasks / Subtasks

- [x] Define the grounded-answer contract and client-facing types under `src/types/chat.ts` and `src/lib/chat/` (AC: 1, 2, 3, 4, 6, 7)
  - [x] Model shared request/response schemas for grounded answers, loading, weak-support fallback, user-safe error copy, citation payloads, and source chips so the frontend and Edge Functions use one consistent contract.
  - [x] Add runtime validation before any response shape is committed to React state.
  - [x] Keep browser code limited to request formatting and response parsing; do not add privileged retrieval, direct database access, or service-role logic here.
  - [x] Keep any minimal deferred placeholder state for future refusal or protection handling typed and clearly separated from Story 4.4's full UX.

- [x] Extend the existing chat surface to render grounded answers and source details in `src/components/chat/` (AC: 1-7)
  - [x] Render answer body, source chips, citation metadata, loading state, and weak-support copy inside the existing `SourceAwareChat` shell from Story 4.2.
  - [x] Use one explicit source-inspection disclosure model for this story, either inline collapsible detail or one local sheet pattern, rather than leaving the answer evidence behavior open-ended.
  - [x] Keep source inspection inside the chat context so the learner can inspect evidence without leaving the current chapter or losing scroll position.
  - [x] Preserve the existing open/close behavior, prompt-selection behavior, keyboard access, focus return, and reduced-motion handling from Story 4.2.
  - [x] Add accessible labeling and keyboard behavior for answer-state announcements, source chips, and source-detail toggles.

- [x] Add server-side grounding and citation packaging under `supabase/functions/` (AC: 1-7)
  - [x] Implement the `chat` function as the orchestration boundary for approved-material answers in the documented route family.
  - [x] Keep topic checking, retrieval orchestration, response assembly, and citation packaging on the Edge Function side, using `chat-retrieve` and other shared helpers as needed to keep source support consistent.
  - [x] Use the standard `{ success, data, error }` envelope and typed success states for answered and weak-support responses.
  - [x] Ensure weak-support is returned when support is insufficient instead of allowing speculative grounded-answer copy.
  - [x] Keep privileged retrieval, model calls, service-role access, and source-bundle formatting out of browser code.

- [x] Add regression coverage for grounded answers and source inspection (AC: 1-7)
  - [x] Extend co-located Vitest coverage for response shaping, client parsing, citation normalization, and weak-support fallback.
  - [x] Add `supabase/functions/tests` coverage for grounding behavior, citation packaging, approved-source resolution, and the non-speculative weak-support path.
  - [x] Extend `tests/e2e/home.spec.ts` for loading state, grounded answers, visible source support, source-detail disclosure, keyboard access, focus behavior, reduced motion, and responsive containment at 360 px, 768 px, 1024 px, and desktop widths.
  - [x] Use role-based locators and media emulation instead of brittle selectors or sleeps.

### Review Findings

- [x] [Review][Patch] Defined the unsupported-but-in-scope path so insufficient grounding must return weak support rather than speculative answer copy.
- [x] [Review][Patch] Tightened the shared client/server contract by requiring one typed schema across `src/types/chat.ts`, `src/lib/chat/`, and the Edge Function response envelope.
- [x] [Review][Patch] Added an explicit loading-state acceptance criterion so the submission path is no longer undefined between idle and answered states.
- [x] [Review][Patch] Chose one explicit source-inspection disclosure model for the story instead of leaving answer evidence behavior spatially ambiguous.
- [x] [Review][Patch] Added accessibility expectations for answer-state announcements, source chips, and source-detail toggles so citation UI cannot be visual-only.
- [x] [Review][Patch] Pinned answer and evidence behavior to the standard breakpoints so responsive containment is testable rather than subjective.
- [x] [Review][Patch] Replaced the vague curriculum-alignment wording with approved-topic alignment so AC5 can be implemented and reviewed against a concrete boundary.
- [x] [Review][Patch] Added explicit citation-integrity and approved-source resolution coverage instead of assuming UI rendering tests are enough.
- [x] [Review][Patch] Clarified that server orchestration includes topic checking, retrieval, response assembly, and citation packaging inside the documented chat route family.
- [x] [Review][Patch] Tightened the weak-support requirement so it remains a typed success path with clear next-step guidance instead of a vague fallback bucket.
- [x] [Review][Patch] Added `supabase/functions/tests` expectations so the trust-critical grounding path is verified where it runs, not only in the frontend shell.
- [x] [Review][Patch] Keyword overlap is treated as enough grounding, so weak support never fires for many unsupported in-scope prompts [supabase/functions/_shared/chat-grounding.ts:91-148; supabase/functions/chat/index.ts:53-57]
- [x] [Review][Patch] Active chapter context is never forwarded into the chat request, so answers cannot align to the current learning flow [src/components/chat/SourceAwareChat.tsx:27-35; src/components/chat/SourceAwareChat.tsx:76-96; src/types/chat.ts:17-21]
- [x] [Review][Patch] Malformed POST bodies are not handled as structured request errors in the chat edge routes [supabase/functions/chat/index.ts:35-73; supabase/functions/chat-retrieve/index.ts:34-48]
- [x] [Review][Patch] The client-side fallback chat endpoint is dead when `VITE_CHAT_FUNCTION_URL` is missing or blank [src/lib/chat/api-client.ts:9-20]

## Dev Notes

### Current State

- Story 4.2 established the shell-level `SourceAwareChat` entry point, prompt suggestions, and focus-safe open/close behavior, but the panel still does not render grounded answers, source chips, or source details.
- `src/data/chat/source-aware-chat.ts` currently provides starter prompt data and a calm fallback for malformed prompt sets only.
- `AppShell` already mounts the chat experience globally, so this story should extend the existing panel instead of adding a second entry point or a new route.
- `NarrativeSection` and `WpsEvidenceSurface` already show local disclosure patterns for source support; use them as behavior references, not as a reason to create a separate references page for chat evidence.
- There is no `src/lib/chat/` or `src/types/chat.ts` boundary yet, and `supabase/functions/` only has `_shared` plus `tests`, so the grounding pipeline will introduce the first chat orchestration files on the server side.

### Scope Boundaries

- Ground answers from approved materials with visible citations and source support.
- Keep weak-support explicit, calm, and honest.
- Include loading-state behavior and typed weak-support behavior in this story because they are part of the grounded-answer contract.
- Preserve the Story 4.2 chat shell contract: no route change, no focus loss, no prompt-selection regressions, and no horizontal overflow.
- Keep answer evidence inspection inside the chat context; do not open a separate page or global maintainer surface.
- Do not implement the full off-topic refusal or protection-state UX in this story unless a minimal typed state is needed in the shared response contract. Story 4.4 owns the explicit refusal/protection surface.
- Do not move privileged retrieval, service-role access, or citation assembly into browser code.
- Do not introduce a router or global store.

### Architecture Guardrails

- Keep browser-facing code in `src/` and privileged retrieval or model orchestration in `supabase/functions/`.
- Use runtime schema validation at chat request, response, and citation boundaries.
- Standardize responses on the `{ success, data, error }` envelope and typed success states for non-fatal outcomes.
- Keep the chat request/response schema shared in practice across the client parsing layer and the server envelope shape so local exceptions do not drift.
- Keep the front-end chat surface presentation-only: request formatting and response parsing belong in `src/lib/chat/`, but raw retrieval does not.
- Keep non-chat content interactive while chat is loading or showing fallback states.
- Use one explicit local disclosure pattern for source inspection before inventing a broader modal system.
- Preserve keyboard access, visible focus, answer-state announcements, and reduced-motion behavior across answer, citation, and source-detail states.

### Testing Standards Summary

- Add co-located Vitest coverage for response-shape helpers, client parsing, citation packaging, weak-support fallback, and any data normalization used by the chat surface.
- Add `supabase/functions/tests` coverage for grounding behavior, citation resolution, approved-source integrity, and the non-speculative weak-support path.
- Extend `tests/e2e/home.spec.ts` for loading state, grounded answer rendering, visible citation/source support, weak-support fallback, source-detail disclosure, keyboard access, focus return, reduced motion, and responsive containment.
- Use `getByRole()` and `page.emulateMedia()` instead of brittle selectors or sleeps.
- Keep the existing open/close and prompt-selection coverage from Story 4.2 intact.

### Latest Tech Notes

- React 19.2 is the current official release line; keep this story in standard function components and hooks.
- Vite 8 is the current stable line in the official docs, but the repository intentionally remains on `vite@^7.3.1`.
- Playwright docs still recommend role-based locators and media emulation for accessible, motion-aware coverage.
- If the chat surface needs a mobile overlay for source inspection, shadcn/ui `Sheet` is the canonical primitive to follow; otherwise keep the evidence view inline with `Collapsible`.
- Supabase Edge Functions remain the correct boundary for chat orchestration, approved-source retrieval, and citation packaging.
- Temporary model direction for implementation: start Story 4.3 with `meta/llama-3.3-70b-instruct` as the initial answer-generation model while the grounded-answer pipeline is being proven out.
- Cost and latency follow-up: as the story progresses and the broader multi-model stack becomes real, re-evaluate the generator against `nvidia/llama-3.1-nemotron-nano-8b-v1` as the likely lower-latency default once topic guard, safety, reranking, and embedding stages are in place.
- Keep model-provider configuration and API keys in server-only environment variables such as local `.env.local` and Supabase/Vercel secret stores, never in browser-facing `src/` code or checked-in files.

### Project Structure Notes

- Likely update: `src/components/chat/SourceAwareChat.tsx`
- Likely new: `src/components/chat/` answer and source-detail subcomponents
- Likely new: `src/lib/chat/api-client.ts`
- Likely new: `src/types/chat.ts`
- Likely new: `supabase/functions/chat/index.ts`
- Likely new: `supabase/functions/chat-retrieve/index.ts`
- Likely new: `supabase/functions/chat-topic-check/index.ts` or reuse of the documented topic-check boundary if it already exists by implementation time
- Likely new: `supabase/functions/_shared/response-envelope.ts`
- Likely new: `supabase/functions/_shared/citation-format.ts`
- Likely new: `supabase/functions/tests/chat.test.ts`
- Likely update: `src/data/chat/source-aware-chat.test.ts`
- Likely update: `tests/e2e/home.spec.ts`
- Keep any reusable source-inspection primitive inside the chat feature boundary unless a second consumer appears in the same change.
- Do not create `src/components/references/` for chatbot evidence as a shortcut; Story 4.1 already owns the conclusion references surface.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 4, Story 4.3: Receive Grounded Answers]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR23-FR34, NFR5, NFR15, NFR16, NFR24, NFR25]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, grounded chatbot pipeline, response envelope, citation boundaries, chat feature structure, Supabase Edge Functions boundaries]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, Source-Aware Chat Panel, source chips, citation metadata, fallback states, responsive and accessibility guidance]
- [Source: `_bmad-output/project-context.md`, SPA-first structure, feature boundaries, typed async states, and no privileged retrieval in browser code]
- [Source: `src/components/chat/SourceAwareChat.tsx`, current shell-level chat presentation from Story 4.2]
- [Source: `src/data/chat/source-aware-chat.ts`, starter prompts and fallback state handling]
- [Source: `src/components/sections/NarrativeSection.tsx`, inline disclosure and focus-return pattern]
- [Source: `src/components/modules/WpsDossier/WpsEvidenceSurface.tsx`, evidence disclosure pattern]
- [Source: `tests/e2e/home.spec.ts`, current role-based, responsive, and reduced-motion test patterns]
- [Source: https://react.dev/blog/2025/10/01/react-19-2, React 19.2 release notes]
- [Source: https://vite.dev/blog/announcing-vite8, Vite 8 release notes]
- [Source: https://playwright.dev/docs/locators, role-based locator guidance]
- [Source: https://playwright.dev/docs/emulation, media emulation guidance]
- [Source: https://ui.shadcn.com/docs/components/sheet, sheet primitive guidance if a mobile source-inspection overlay is needed]

## Story Completion Status

- done
- Story context engine analysis completed - comprehensive developer guide created

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-04-28: Resolved create-story customization fallback after `python3` was unavailable locally.
- 2026-04-28: Loaded project context, sprint tracking, Epic 4, PRD, architecture, UX, and previous stories 4.1 / 4.2.
- 2026-04-28: Confirmed the current chat shell is presentation-only and that grounded answers still need to be implemented behind the chat boundary.
- 2026-04-28: Verified latest official docs for React, Vite, Playwright, shadcn/ui, and Supabase Edge Functions.
- 2026-04-28: Validated the drafted story against the create-story checklist.
- 2026-04-28: Implemented the grounded chat contract, runtime parser, source disclosure UI, Edge Function grounding helpers, and regression coverage.
- 2026-04-28: Verified with `pnpm lint`, `pnpm typecheck`, `pnpm exec vitest run`, Supabase helper Vitest config, `pnpm build`, and full `tests/e2e/home.spec.ts`.

### Completion Notes List

- Story 4.3 is scoped to grounded answers, visible source support, weak-support fallback, and evidence inspection without losing chat context.
- The story keeps privileged retrieval and citation assembly server-side and preserves the Story 4.2 chat shell contract.
- The story intentionally leaves explicit off-topic refusal and protection-state UX to Story 4.4.
- Added a typed client/server chat envelope with runtime validation for answered, weak-support, deferred-protection, and user-safe error states.
- Extended `SourceAwareChat` to show loading, grounded answers, source chips, inline source details, weak-support copy, and safe error copy without leaving the chat context.
- Added Supabase Edge Function boundaries for `chat` and `chat-retrieve` with shared approved-source retrieval and citation packaging helpers.
- Added frontend, Edge-helper, and E2E regression coverage for grounded answers, weak support, source inspection, focus, reduced motion, and responsive containment.

### File List

- `_bmad-output/implementation-artifacts/4-3-receive-grounded-answers.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `eslint.config.js`
- `src/components/chat/SourceAwareChat.tsx`
- `src/lib/chat/api-client.ts`
- `src/lib/chat/grounded-answer.test.ts`
- `src/lib/chat/grounded-answer.ts`
- `src/types/chat.ts`
- `supabase/functions/_shared/chat-grounding.ts`
- `supabase/functions/chat-retrieve/index.ts`
- `supabase/functions/chat/index.ts`
- `supabase/functions/tests/chat.test.ts`
- `supabase/functions/vitest.config.ts`
- `tests/e2e/home.spec.ts`

### Change Log

- 2026-04-28: Implemented grounded-answer contract, chat UI rendering, Supabase grounding helpers/functions, and regression coverage for Story 4.3.
