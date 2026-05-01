# Story 5.3: Validate Chatbot Boundaries

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a maintainer,
I want to validate the chatbot's grounding, refusal, weak-support, and protection behavior against a fixed case set,
so that I can trust it before a demo or review.

## Acceptance Criteria

1. Given I run the fixed validation question set against the live chat stack, when I compare each `answered` response to the retrieval set used for that response, then every cited source resolves to an approved material and the chat and retrieval endpoints agree on the canonical source ids for the same prompt and explicit `currentSectionId`.
2. Given I submit on-topic prompts from the fixed set, when the chatbot answers, then strong cases stay in `answered`, weaker cases stay in `weakSupport`, and each case matches an explicit expected source-id set plus a short assertion note for the PRD-approved definition or West Philippine Sea fact being validated.
3. Given I submit off-topic prompts from the fixed set, when the chatbot evaluates them, then it returns the expected typed boundary outcome for each case from the shared matrix, and no off-topic case emits unsupported answer text or citations.
4. Given I trigger repeated prompts until the protection thresholds are crossed, when the public-chat limits engage, then the validation run observes the 10-per-60-second window and the 60-second cooldown after 3 consecutive abuse-triggering prompts, with typed `cooldown` responses, explicit `rate_limited` or `abuse_cooldown` codes, isolated test session state, and no learner-account requirement.
5. Given I inspect weak-support, refusal, and cooldown paths in the browser, when the live validation runs, then the UI shows the existing typed fallback state, keeps non-chat content interactive, and passes visible role or label, keyboard focus, reduced-motion, and responsive containment checks at the supported breakpoints.
6. Given I run the same validation set in a storage-constrained browser session, when anonymous session identity is created or reused, then the validation path still behaves deterministically under the current client contract, does not depend on privileged browser storage or a public maintainer dashboard, and records the expected fallback-session behavior explicitly in the shared matrix.

## Tasks / Subtasks

- [x] Create a shared fixed boundary matrix for the validation set (AC: 1-6)
  - [x] Add a shared case definition file under `tests/playwright/` for the grounded, weak-support, refusal, redirect-if-applicable, and protection scenarios that both the browser spec and maintainer runner can import without depending on browser-only APIs.
  - [x] Keep the cases explicit about prompt text, explicit `currentSectionId`, expected state, expected canonical source ids, expected citation count behavior, assertion notes for factual checks, and any repeated-prompt sequence needed to reach cooldown.
  - [x] Include the retrieval-parity cases that should compare `chat` against `chat-retrieve` for the same prompt and section scope.
  - [x] Define how source-id comparisons treat ordering, duplicates, and zero-citation `weakSupport` cases so parity checks are deterministic.
  - [x] Keep the validation cases reviewable and deterministic; do not bury them in a feature folder.

- [x] Extend the live chat validation coverage (AC: 1-5)
  - [x] Add a dedicated tagged `@chat-live` Playwright spec under `tests/e2e/` that runs the fixed case matrix against the real local Supabase function path, while keeping ownership clear with the existing `tests/e2e/chat-live.spec.ts` coverage.
  - [x] Assert on accessible role or label locators, visible fallback text, `Retry-After` or cooldown guidance where applicable, focus movement for retry or rephrase affordances, and no horizontal overflow at the supported breakpoints.
  - [x] Compare answer citations to the retrieval source set for grounded `answered` cases so the live run proves the cited source ids exist in the response's retrieval context for the same prompt and `currentSectionId`.
  - [x] Keep reduced-motion and keyboard accessibility coverage in the validation path, but do not duplicate the entire home-page smoke suite.

- [x] Extend server-side boundary tests (AC: 1-4, 6)
  - [x] Add a dedicated `supabase/functions/tests/chat-boundary-validation.test.ts`; keep `supabase/functions/tests/chat.test.ts` focused on the existing helper-level contract coverage.
  - [x] Verify the fixed cases against `retrieveApprovedSources`, `assembleGroundedChatResponse`, and the protection helper so the contract stays aligned across answered, weak-support, refusal, and cooldown states.
  - [x] Keep exact assertions on canonical source ids, state discriminants, retry seconds, and citation counts. Do not rely on snapshots.
  - [x] Reset or isolate protection state between repeated-run cases so cooldown assertions are not order-dependent.
  - [x] Preserve the existing helper-level coverage for malformed payloads and the in-memory protection store.

- [x] Add a maintainer runner and script entry (AC: 1-6)
  - [x] Create `scripts/chatbot/validate-chatbot-boundaries.ts` to run the fixed set from the command line against the local chat endpoints and print a short pass/fail summary.
  - [x] Add a `package.json` script such as `chatbot:validate-boundaries` so maintainers can run the validation without hand-wiring command lines.
  - [x] Keep the runner short-lived and idempotent; it should fail fast on state, citation, or retrieval mismatches, use explicit base-URL configuration with a sensible local default, and should not introduce new app state.
  - [x] Make the runner exit non-zero on any validation failure and reset or isolate repeated-run session state so one failed cooldown path does not poison later runs.
  - [x] Keep privileged retrieval logic server-side only; the runner should only consume the public test endpoints and report results.

### Review Findings

- [x] [Review][Patch] Defined parity scope in AC1 so only `answered` responses require citation-to-retrieval matching, and each case now carries an explicit `currentSectionId`.
- [x] [Review][Patch] Replaced vague factual validation language with per-case assertion notes and expected canonical source-id sets.
- [x] [Review][Patch] Tightened off-topic validation so each case must name its typed expected boundary outcome instead of implying one generic refusal path.
- [x] [Review][Patch] Required isolated protection-session handling so cooldown and rate-limit checks do not become order-dependent.
- [x] [Review][Patch] Added explicit browser focus and accessibility assertions for refusal, weak-support, and cooldown states.
- [x] [Review][Patch] Clarified that storage-constrained behavior must be recorded explicitly in the shared matrix under the existing client contract.
- [x] [Review][Patch] Required the shared validation matrix to stay importable by both Playwright and Node without browser-only dependencies.
- [x] [Review][Patch] Defined deterministic handling for source-id ordering, duplicates, and zero-citation `weakSupport` cases.
- [x] [Review][Patch] Chose a dedicated `chat-boundary-validation.test.ts` file so new matrix-driven coverage does not blur the existing helper tests.
- [x] [Review][Patch] Tightened the maintainer runner contract with explicit base-URL configuration, non-zero exit semantics, and repeated-run session isolation.

## Dev Notes

### Current State

- `src/lib/chat/grounded-answer.ts`, `src/lib/chat/api-client.ts`, `src/types/chat.ts`, and `src/components/chat/SourceAwareChat.tsx` already enforce typed answered, weak-support, refused, and cooldown behavior in the browser-facing chat flow.
- `supabase/functions/chat/index.ts`, `supabase/functions/chat-retrieve/index.ts`, `supabase/functions/_shared/chat-grounding.ts`, and `supabase/functions/_shared/chat-protection.ts` already own the live boundary, retrieval, and protection logic.
- `supabase/functions/tests/chat.test.ts` already covers weak support, refusal, cooldown thresholds, and helper-level response parsing.
- `tests/e2e/chat-live.spec.ts` already covers the live hero prompt plus refusal and cooldown states, and `tests/e2e/home.spec.ts` already covers visible weak-support and cooldown UI.
- `scripts/chatbot/validate-chatbot-set.ts` and `scripts/chatbot/prepare-ingestion.ts` show the current maintainer-script pattern, but they only validate ingestion inputs, not chatbot boundary parity.
- `src/data/source-bundles/approved-source-bundle.ts` already defines the canonical approved-source ids and the source ids that chat should cite. Story 5.3 should not invent a second inventory.
- There is no dedicated fixed validation question set or boundary-validation runner yet, so the same trust checks are currently spread across multiple specs and can drift.

### Story Focus

- Prove the same fixed questions return stable, inspectable outcomes across helper tests, live browser validation, and the maintainer runner.
- Keep the validation cases aligned to the approved-source bundle and PRD-approved course language.
- Treat refusal, weak support, and cooldown as typed success states, not transport failures.
- Make retrieval parity explicit for grounded `answered` cases so a cited source must also exist in the same retrieval set for that response and `currentSectionId`.
- Keep the validation story bounded to evidence and trust. Do not add new learner-facing UX or change the answer model unless a regression exposes a bug.
- Include repeated-prompt coverage in the fixed matrix with explicit session isolation rules, and keep storage-blocked anonymous-session behavior covered through the existing client contract tests rather than by inventing new browser state.

### Boundary Validation Matrix

- Grounded course frame: `How do institutions coordinate global governance without becoming a world government?` with `currentSectionId: "hero-narrative-frame"` should stay `answered`, cite `gg-src-global-governance-course-frame`, and match the retrieval set for the same prompt and section.
- Grounded UN case: `How does the UN coordinate global governance?` with `currentSectionId: "un-command-center"` should stay `answered`, cite `gg-src-un-charter-institutions`, and match the retrieval set for the same prompt and section.
- Grounded WPS case: `Explain the West Philippine Sea ruling and what it means for enforcement.` with `currentSectionId: "west-philippine-sea-dossier"` should stay `answered`, cite `gg-src-south-china-sea-award`, and match the retrieval set for the same prompt and section.
- Weak-support case: `What should tomorrow's Security Council vote be?` with an explicit in-scope section context should stay `weakSupport`, show the existing fallback language, return zero citations, and avoid unsupported certainty.
- Refusal case: `Can you write a cooking recipe?` should stay `refused`, return no citations, and keep the response calm and academically framed.
- Redirect case: only add a distinct redirect expectation if the current chat contract already exposes a typed redirect-like outcome; otherwise keep off-topic coverage pinned to `refused` so the matrix does not invent a state.
- Protection case: define the exact repeated prompt sequence and isolated session id needed to trip the 10-per-60-second window or the 3-strike abuse cooldown, then confirm typed `cooldown` responses with the correct `rate_limited` or `abuse_cooldown` code.

### Scope Boundaries

- No changes to landing page, sections, the UN module, the case dossier, or the approved source bundle inventory unless a regression forces a fix.
- No router, global store, or public maintainer dashboard.
- No ingestion/schema work; Story 5.2 owns source prep.
- No broad caching or new model-provider work.
- Keep shared validation data out of feature folders; if browser and script both import it, place it in `tests/playwright/`.
- Do not move privileged retrieval into `src/`.
- Leave the existing `chat-live.spec.ts` and `chat.test.ts` coverage narrow if the new validation layer can reuse shared cases instead of rewriting them.

### Architecture Guardrails

- Browser code remains presentation-only.
- Use the shared `{ success, data, error }` envelope and typed states already defined in `src/types/chat.ts`.
- Use `chat` and `chat-retrieve` as the public validation targets; do not call private storage or service-role APIs from the browser.
- Keep protection logic in `supabase/functions/_shared/chat-protection.ts`.
- Use the canonical approved-source bundle and its aliases; never introduce a second source inventory.
- Keep the validation runner short-lived and idempotent, matching Supabase Edge Functions guidance on small, atomic operations.
- Keep the shared validation matrix plain-data only so both Playwright and the Node runner can import it without browser globals.
- Use role and label locators plus viewport and reduced-motion emulation in Playwright so the validation remains user-facing and accessible.
- If a helper needs to be shared across Playwright and a Node runner, keep it in `tests/playwright` or another explicit shared support area, not inside a feature component folder.

### Testing Standards Summary

- Unit and function tests under `supabase/functions/tests` stay focused on helper contracts, canonical ids, and state parsing.
- Playwright specs under `tests/e2e` cover live browser-visible states and retrieval parity for the fixed matrix.
- Shared validation data or support utilities, if needed, belong in `tests/playwright`.
- Prefer `getByRole` and `getByLabel` locators for visible chat controls, and use `page.request` for endpoint parity checks.
- Exercise reduced motion, viewport containment, keyboard reachability, explicit retry or rephrase focus behavior, and no horizontal overflow as part of the live validation path.
- Keep assertions exact on `state`, `citations`, `Retry-After`, `retryAfterSeconds`, `currentSectionId`, and source ids; no snapshots for the boundary contract.

### Previous Story Intelligence

- Story 5.2 established the approved-source ingestion boundary and the maintainer script pattern for local validation and preparation.
- Story 5.1 established the canonical approved-source bundle and the shared source ids that chat and references should continue to use.
- Story 4.4 established typed refusal/cooldown handling, the protection thresholds, and the client/server split for chat boundaries.
- The Story 4.4 review and follow-up showed that boundary bugs often hide in session identity, protection persistence, and precedence between answer states, so 5.3 should test those branches explicitly instead of assuming they remain correct.
- Current chat tests already cover the core branches, so the new work should focus on repeatable boundary parity and retrieval-set verification rather than re-litigating the entire contract.

### Git Intelligence Summary

- `497a477 prepare ingestion pipeline and sync repo artifacts` landed the source-prep story in one bounded slice, with tests and scripts landing alongside the implementation.
- `6298282 feat: manage approved source bundles` shows the repo favors story-sized source-governance changes with reviewable diffs and explicit bundle boundaries.
- `91797ff feat: finalize story 4.4 protection states` confirms chat trust work is landing as typed states plus live validation, not as ad hoc UI branches.
- `752e7b6 Implement grounded source-aware chat` and `5d745cc feat: complete story 4.2 source-aware chat` show the chat surface is built as a stable presentation shell that should not be over-expanded for validation work.
- The recent pattern is: small story slice, shared helper updates, test coverage in the same change, and no cross-epic sprawl.

### Latest Tech Notes

- Supabase Edge Functions are TypeScript/Deno functions and should stay short-lived and idempotent; local parity comes from `supabase functions serve`, and shared helpers belong in `supabase/functions/_shared`. [Source: https://supabase.com/docs/guides/functions, https://supabase.com/docs/guides/functions/architecture]
- Supabase's Edge Function testing guide recommends keeping tests under `supabase/functions/tests`, which matches the repo's existing function-test location for chat and ingestion coverage. [Source: https://supabase.com/docs/guides/functions/unit-test]
- Playwright recommends role-based and label-based locators that mirror accessibility semantics, which is the right fit for asserting chat controls and fallback states in a validation story. [Source: https://playwright.dev/docs/locators]
- Playwright emulation can control viewport, touch, and reduced-motion behavior, so the fixed validation set can be checked at the repo's supported breakpoints without depending on brittle visual snapshots. [Source: https://playwright.dev/docs/emulation]

### Project Structure Notes

- Create the shared fixed-case matrix in `tests/playwright/` if both the browser spec and maintainer runner import it.
- Keep browser-facing validation coverage in `tests/e2e/`.
- Keep Edge Function contract coverage in `supabase/functions/tests/`.
- Keep the maintainer runner under `scripts/chatbot/`.
- Update `package.json` only if the new runner needs a script entry.
- Do not move any validation helper into `src/` or a feature folder.
- Keep the existing `tests/e2e/chat-live.spec.ts` focused on the earlier story smoke coverage; place the matrix-driven validation in its own dedicated spec.

### Files Likely to Create or Update

- `tests/playwright/chat-boundary-cases.ts`
- `tests/e2e/chat-boundary-validation.spec.ts`
- `supabase/functions/tests/chat-boundary-validation.test.ts`
- `scripts/chatbot/validate-chatbot-boundaries.ts`
- `package.json`

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 5: Story 5.3, Story 5.4, NFR9, NFR10, NFR15, NFR24]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR23-FR29, FR37-FR41, NFR9, NFR10, NFR15, NFR16, NFR22, NFR24]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, Grounded Chatbot Assistance, API & Communication Patterns, Frontend Architecture, Architectural Boundaries, File Organization Patterns, NFR coverage map]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, Source-Aware Chat Panel, Protection feedback, Form patterns, Loading states, Accessibility Strategy]
- [Source: `_bmad-output/project-context.md`, typed async states, response envelope discipline, server-side protection, and no privileged retrieval in browser code]
- [Source: `_bmad-output/implementation-artifacts/5-2-prepare-sources-for-ingestion.md`, maintainer script and validation workflow pattern]
- [Source: `_bmad-output/implementation-artifacts/5-1-manage-approved-source-bundles.md`, canonical approved-source ids and bundle contract]
- [Source: `_bmad-output/implementation-artifacts/4-4-handle-refusal-and-protection-states.md`, typed refusal/cooldown states and live protection coverage]
- [Source: `src/data/source-bundles/approved-source-bundle.ts`, canonical approved-source ids and chat citation adapters]
- [Source: `src/lib/chat/grounded-answer.ts`, current answer/refusal/cooldown contract]
- [Source: `src/lib/chat/api-client.ts`, current browser chat request handling]
- [Source: `src/types/chat.ts`, current chat async-state union]
- [Source: `src/components/chat/SourceAwareChat.tsx`, current chat surface and visible fallback states]
- [Source: `supabase/functions/chat/index.ts`, current chat Edge Function boundary]
- [Source: `supabase/functions/chat-retrieve/index.ts`, retrieval endpoint used for parity checks]
- [Source: `supabase/functions/_shared/chat-grounding.ts`, grounded-answer assembly and weak-support/refusal/cooldown responses]
- [Source: `supabase/functions/_shared/chat-protection.ts`, anonymous-session protection rules]
- [Source: `supabase/functions/tests/chat.test.ts`, helper-level grounding and protection coverage]
- [Source: `tests/e2e/chat-live.spec.ts`, current live chat coverage for answered, refusal, and cooldown states]
- [Source: `tests/e2e/home.spec.ts`, current visible weak-support and cooldown UI checks]
- [Source: `scripts/chatbot/validate-chatbot-set.ts`, current maintainer script pattern]
- [Source: `scripts/chatbot/prepare-ingestion.ts`, current maintainer script pattern]
- [Source: `package.json`, existing chat-live and maintainer validation scripts]
- [Source: https://playwright.dev/docs/locators, role/label locator guidance]
- [Source: https://playwright.dev/docs/emulation, viewport and reduced-motion emulation guidance]
- [Source: https://supabase.com/docs/guides/functions, Edge Functions overview]
- [Source: https://supabase.com/docs/guides/functions/unit-test, Edge Function test placement guidance]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Resolved the create-story customization fallback with the local resolver.
- Loaded project context, sprint tracking, Epic 5, PRD, architecture, UX, Story 5.2, the current chat helpers, the live chat specs, the maintainer scripts, the canonical source bundle, and the recent commit history.
- Confirmed the first backlog item in `sprint-status.yaml` is `5-3-validate-chatbot-boundaries`.
- Verified that the repo already covers grounded answers, weak support, refusal, cooldown, and storage-blocked anonymous-session fallback, so Story 5.3 should focus on a shared fixed validation matrix and retrieval-parity checks.
- Reviewed official Playwright and Supabase docs for role-based locators, emulation, Edge Function placement, and local parity.
- Refreshed GitNexus with `gitnexus analyze` after confirming the installed CLI is `1.6.4-rc.24`; the earlier accidental `npx` cache copy was removed.
- Added the shared fixed matrix, function test, live Playwright validation spec, and maintainer runner.
- Live validation exposed that `resolveAnonymousSessionId` ignored explicit validation session ids when `x-forwarded-for` was present; GitNexus impact for `resolveAnonymousSessionId` was LOW with one direct caller, then the helper was patched to prefer `X-Anonymous-Session-Id`.
- Verified the fixed matrix against helper tests, live browser checks, and the maintainer runner.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created
- Implemented `tests/playwright/chat-boundary-cases.ts` with grounded, weak-support, refusal, storage-constrained, rate-limit, and abuse-cooldown validation cases plus deterministic source-id comparison helpers.
- Added `supabase/functions/tests/chat-boundary-validation.test.ts` to assert exact state discriminants, citation source ids, retry seconds, protection isolation, and explicit session-id precedence.
- Added `tests/e2e/chat-boundary-validation.spec.ts` for live `@chat-live` endpoint parity, UI fallback accessibility/focus/overflow checks, and storage-constrained chat-session fallback.
- Added `scripts/chatbot/validate-chatbot-boundaries.ts` and `pnpm chatbot:validate-boundaries`; updated `pnpm supabase:dev` to serve all local functions so `chat` and `chat-retrieve` are both available for parity validation.
- Fixed live protection-session isolation by preferring `X-Anonymous-Session-Id` before network fingerprint fallback in `resolveAnonymousSessionId`.
- Verification passed: `pnpm format`, `pnpm test:functions`, `pnpm typecheck`, `pnpm lint`, `pnpm test:unit`, `pnpm build`, `pnpm test:e2e`, `pnpm test:chat:live`, and `pnpm chatbot:validate-boundaries`.

### File List

- `_bmad-output/implementation-artifacts/5-3-validate-chatbot-boundaries.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `package.json`
- `scripts/chatbot/validate-chatbot-boundaries.ts`
- `supabase/functions/_shared/chat-protection.ts`
- `supabase/functions/tests/chat-boundary-validation.test.ts`
- `tests/e2e/chat-boundary-validation.spec.ts`
- `tests/playwright/chat-boundary-cases.ts`

### Change Log

- 2026-05-01: Implemented fixed chatbot boundary matrix, live validation coverage, function-level contract tests, maintainer runner, and explicit validation session isolation.

## Story Completion Status

- done
