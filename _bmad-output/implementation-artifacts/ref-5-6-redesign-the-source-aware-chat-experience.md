# Story 5.6: Redesign the Source-Aware Chat Experience

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want the chatbot to feel like a premium course assistant with visible history and guided entry states,
so that I can ask follow-up questions confidently and use the chat naturally during the learning flow and demo.

## Acceptance Criteria

1. Given I open the source-aware chat before asking a question, when the panel appears, then I see a premium assistant intro state that follows the approved navy, gold, and teal direction, uses `archive/images/Chatbot_UI.png` as the visual reference target, and uses the provided `archive/images/Chatbot_BG.png` artwork as the atmospheric background asset source, while keeping the framing readable, source-aware, and academically bounded.
2. Given the runtime app should not depend on archive paths, when the final UI uses the provided background artwork, then the implementation promotes `archive/images/Chatbot_BG.png` into a browser-safe app asset location under `public/` or an equivalent frontend-safe path before wiring the final styles, and `archive/images/Chatbot_UI.png` remains the design reference rather than a shipped UI asset.
3. Given I ask multiple in-scope questions in one open session, when each response returns, then a visible message list preserves the order of learner questions and assistant responses inside the chat surface, and earlier responses remain inspectable until the chat is closed or the page session is refreshed.
4. Given a response includes citations or fallback states, when I inspect a message in the thread, then source chips, weak-support messaging, refusal states, cooldown states, and any retry guidance stay attached to the relevant assistant message, and the evidence and fallback UI remain keyboard accessible.
5. Given guided prompt suggestions are available, when the redesigned surface renders them, then it can present them as premium topic cards in the intro state and as compact follow-up suggestions later without introducing privileged logic to browser components, and selecting one helps the learner enter the conversation quickly.
6. Given the MVP chat contract remains retrieval-backed and section-aware, when the redesigned surface preserves prior exchanges, then transcript continuity stays session-local to the frontend instead of depending on hidden backend memory or cross-session persistence, and the existing typed response envelope remains unchanged.
7. Given I use the redesigned chat on mobile or with reduced motion enabled, when the premium surface loads, then it stays readable across the target breakpoints, introduces no horizontal scrolling, suppresses nonessential motion, preserves the current open or close focus behavior, and keeps the main learning flow usable outside the chat surface.
8. Given the redesign aims to match the supplied mockup closely, when the finished UI is reviewed, then the visual composition, topic-card entry state, background treatment, and premium assistant framing align as closely as practical with `archive/images/Chatbot_UI.png` while still following the project's accessibility, responsiveness, and typed-state guardrails.

## Tasks / Subtasks

- [ ] Rework the chat surface into an intro-plus-threaded conversation model under `src/components/chat/` (AC: 1, 3, 4, 6, 8)
  - [ ] Replace the single `answerState` presentation with a session-local message thread model that can render learner prompts and assistant responses in order without changing the backend request contract.
  - [ ] Keep thread continuity frontend-only for this story: no backend conversation id, no persisted history across refresh, and no hidden replay of previous turns into the live `chat` request unless a later contract explicitly adds it.
  - [ ] Preserve the current typed answer branches (`answered`, `weakSupport`, `refused`, `cooldown`) and keep each assistant message responsible for its own source chips and fallback UI.
  - [ ] Preserve open or close behavior from Story 4.2: no route changes, no scroll jumps, `Escape` close support, focus return to the trigger with `preventScroll`, and no keyboard trap regressions.
  - [ ] If the component becomes too large, split the view into feature-owned subcomponents under `src/components/chat/` rather than moving composites into `src/components/ui/`.

- [ ] Build the premium intro state, prompt-card composition, and visual treatment (AC: 1, 2, 5, 8)
  - [ ] Use `archive/images/Chatbot_UI.png` as the primary reference for layout and mood, targeting an implementation that is as close as practical without copying inaccessible or brittle details.
  - [ ] Promote `archive/images/Chatbot_BG.png` into a runtime-safe asset path under `public/` or an equivalent frontend-safe location before shipping the background treatment.
  - [ ] Apply the approved navy, gold, and teal palette, stronger editorial hierarchy, trust cues, and premium panel treatment instead of the current plain card styling.
  - [ ] Use the existing `lucide-react` dependency for topic-card and trust-cue iconography unless a later story introduces approved custom icons.
  - [ ] Keep the intro state useful before the first message: premium assistant framing, visible trust badges, guided topic cards, and clear composer guidance.
  - [ ] Keep the visual treatment atmospheric but readable; typography, contrast, and source affordances must remain more important than visual fidelity.

- [ ] Keep prompt suggestions and composer behavior decoupled from privileged logic (AC: 5, 6)
  - [ ] Preserve the section-aware prompt shaping already provided by `src/data/chat/source-aware-chat.ts` as the local fallback path.
  - [ ] Design the prompt-card surface so Story 5.5 server-driven suggestions can plug into the same UI without a second redesign pass.
  - [ ] Do not move retrieval, topic guard, safety guard, citation formatting, or protection logic into the browser.
  - [ ] Keep `src/lib/chat/api-client.ts` focused on single-turn request formatting plus response parsing unless a tiny adapter is needed for thread rendering.

- [ ] Extend styling and responsive behavior without regressing the core journey (AC: 1, 2, 7, 8)
  - [ ] Add any new chat-specific tokens, overlays, or utility classes in `src/index.css`, keeping the broader editorial system coherent with the new panel.
  - [ ] Preserve the current desktop floating panel and mobile bottom-sheet behavior unless a shared `Sheet` primitive is clearly cleaner; if so, keep it shadcn-aligned.
  - [ ] Use Motion deliberately for meaningful entry, thread, and card transitions, but disable or reduce those effects when reduced motion is enabled.
  - [ ] Keep no-horizontal-scroll guarantees at 360 px, 768 px, 1024 px, and desktop widths, including long citations, chips, and topic-card labels.

- [ ] Refresh regression coverage around the new thread model and premium shell (AC: 1-8)
  - [ ] Extend `tests/e2e/home.spec.ts` to cover the intro state, prompt-card rendering, threaded history ordering, per-message fallback states, focus behavior, reduced motion, and responsive containment.
  - [ ] Update `tests/e2e/chat-live.spec.ts` so the live chat path still verifies section-aware requests, answered states, refusal, cooldown, and citation visibility inside the new threaded layout.
  - [ ] Add co-located unit or component tests only where new message-mapping helpers, prompt-card adapters, or thread-state utilities justify checked-in coverage.
  - [ ] Prefer `getByRole()`, labels, and state assertions over brittle selectors or visual-only snapshots.

## Dev Notes

### Current State

- `src/components/chat/SourceAwareChat.tsx` currently renders one floating trigger plus one open panel, but only supports a single `answerState` instead of a persistent thread.
- The current chat surface already preserves route and scroll position, supports `Escape` close, focuses the textarea with `preventScroll`, and keeps the trigger out of the tab order while the panel is open.
- `GroundedAnswerSurface` already knows how to render `answered`, `weakSupport`, `refused`, and `cooldown`, including source chips and expandable details, but only for one response at a time.
- `src/data/chat/source-aware-chat.ts` already supplies fixed and section-aware starter prompts that can become the first version of the premium topic-card system.
- `src/lib/chat/api-client.ts` still sends one question plus `currentSectionId` and an anonymous session id; it does not send prior messages or any conversation token.
- `src/types/chat.ts` defines the stable response envelope and the grounded-response union; any new thread model should compose around those types, not replace them.
- `src/index.css` already contains editorial and orbital tokens that can be extended toward the approved navy, gold, and teal chat direction instead of starting a parallel design system.
- `tests/e2e/home.spec.ts` and `tests/e2e/chat-live.spec.ts` already cover open or close behavior, prompt selection, loading, weak support, refusal, cooldown, citation chips, and no-horizontal-scroll expectations. The redesign should extend those checks instead of creating a disconnected browser suite.

### Story Focus

- Turn the source-aware chat from a single-answer surface into a premium intro-plus-thread UI.
- Match `archive/images/Chatbot_UI.png` as closely as practical while preserving the app's accessibility and reliability rules.
- Use `archive/images/Chatbot_BG.png` as the approved atmospheric background artwork source, but ship it from a runtime-safe frontend asset path.
- Keep transcript continuity session-local and presentation-only; this story does not add backend conversational memory.
- Preserve the typed chat states, source visibility, and protection-state clarity already established in Stories 4.2 through 5.4.
- Keep the redesign ready for Story 5.5 suggestion wiring without making this story depend on privileged browser logic.

### Dependency Notes

- Story 5.4 establishes the retrieval-backed answer path that this redesign must continue to consume without contract changes.
- Story 5.5 owns explicit topic guard, safety guard, and server-driven suggestions. This redesign should assume those contracts may land before or alongside implementation, but it must keep a local prompt fallback path so the UI is not blocked if the suggestion endpoint is not yet merged.
- Story 4.2 remains the behavioral baseline for shell mounting, focus return, reduced motion, and responsive containment.
- Story 4.4 remains the behavioral baseline for refusal, weak-support, and cooldown presentation.

### Scope Boundaries

- No backend contract expansion for persisted history, cross-session memory, or multi-turn retrieval context.
- No learner accounts, router changes, global store introduction, or maintainer dashboard work.
- No privileged retrieval, topic checks, safety filtering, or source mutation in browser code.
- No replacement of the existing typed response envelope.
- No requirement to ship the archive reference image itself in the user-facing bundle.
- No visual redesign of the broader site outside the chat surface, except for narrowly scoped shared tokens or utility classes needed to support the new chat UI.

### Architecture Guardrails

- Keep browser-facing chat presentation in `src/components/chat/`, helpers in `src/lib/chat/`, prompt content in `src/data/chat/`, and shared primitives in `src/components/ui/`.
- If a mobile overlay primitive is needed, prefer the existing shadcn-aligned `Sheet` pattern rather than inventing a bespoke modal framework.
- Keep state local to the chat feature unless a thin existing context is already the cleanest way to preserve shell-level open state.
- Keep non-chat content interactive if the chat is loading, weakly supported, refused, cooled down, or visually unavailable.
- Preserve semantic labels, visible thread order, and keyboard-safe citation toggles inside the new transcript.
- Treat the supplied background asset as progressive enhancement; the panel must remain readable if the image fails to load.

### Testing Standards Summary

- Extend `tests/e2e/home.spec.ts` for:
  - premium intro state visibility
  - topic-card selection
  - thread ordering for multiple questions
  - message-scoped source chips and fallback states
  - focus return and scroll preservation
  - reduced-motion behavior
  - responsive containment and no horizontal overflow
- Extend `tests/e2e/chat-live.spec.ts` for:
  - live answered state inside the threaded layout
  - live refusal and cooldown rendering attached to the correct turn
  - unchanged section-aware request payloads
- Add unit or component coverage only where extracted thread or prompt helpers make isolated testing worthwhile.
- Keep assertions role-based and state-based; do not rely on screenshot snapshots to prove the redesign.

### Previous Story Intelligence

- Story 5.4 deliberately protects the browser contract while moving grounding to retrieval-backed chat. This redesign must preserve that contract and should not demand new response shapes.
- Story 4.2 already identified and fixed the tricky parts of this surface: focus return without scroll jumps, `Escape` close, no route changes, prompt-group accessibility, and responsive containment. Do not reintroduce those bugs while restyling the panel.
- Story 4.4 established calm, typed fallback states instead of error-like chat failures. The threaded design must keep that same tone, just attached per assistant message.
- The current implementation trend is small, well-bounded story slices with test updates in the same change set and no cross-layer sprawl.

### Git Intelligence Summary

- `29285e5 feat: validate chatbot boundaries` reinforced live and fixed validation around typed chat behavior instead of loose manual QA.
- `497a477 prepare ingestion pipeline and sync repo artifacts` shows recent work prefers bounded changes with supporting tests and scripts in the same pass.
- `6298282 feat: manage approved source bundles` confirms the repo favors explicit source discipline and reviewable artifacts over ad hoc wiring.
- `91797ff feat: finalize story 4.4 protection states` confirms trust features land as typed success states plus tests, not as one-off UI branches.
- `752e7b6 Implement grounded source-aware chat` is the baseline shell that this redesign should extend rather than replace wholesale.

### Latest Tech Notes

- React's official docs are on the 19.2 line, and this repo already depends on `react@^19.2.4` and `react-dom@^19.2.4`, so the redesign should stay in standard function components and hook-based local state. [Source: https://react.dev/versions, `package.json`]
- The repo already uses `motion@^12.38.0`; Motion's `AnimatePresence` requires stable unique keys for direct children and supports `initial={false}` when we want to avoid first-render enter animations on already-present content. That is a good fit for message threads and reduced-motion-aware panel transitions. [Source: https://motion.dev/docs/react-animate-presence, `package.json`]
- shadcn/ui's Sheet component extends Dialog to display content that complements the main screen and is installed with `pnpm dlx shadcn@latest add sheet`, which makes it the safest shared primitive if the mobile bottom-sheet implementation is refactored. [Source: https://ui.shadcn.com/docs/components/radix/sheet]
- Playwright still recommends locator APIs such as `getByRole()` as the central retryable testing primitive, so the refreshed browser coverage should keep leaning on roles, labels, and accessible names. [Source: https://playwright.dev/docs/locators]
- The repository intentionally remains on `vite@^7.3.1`, so do not introduce Vite-8-specific assumptions just because official docs now document the Vite 8 generation. [Source: `package.json`]

### Project Structure Notes

- Likely update: `src/components/chat/SourceAwareChat.tsx`
- Likely new or split files under `src/components/chat/` for thread items, intro cards, or source support surfaces if the main component becomes too large
- Likely update: `src/data/chat/source-aware-chat.ts`
- Likely update: `src/types/chat.ts`
- Possible small update: `src/lib/chat/api-client.ts`
- Likely update: `src/index.css`
- Likely update: `tests/e2e/home.spec.ts`
- Likely update: `tests/e2e/chat-live.spec.ts`
- Possible new runtime asset path under `public/` for the promoted background image
- Reference-only assets that must be named in implementation notes:
  - `archive/images/Chatbot_UI.png`
  - `archive/images/Chatbot_BG.png`

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 5: Story 5.6: Redesign the Source-Aware Chat Experience]
- [Source: `_bmad-output/planning-artifacts/prd.md`, MVP scope, FR23-FR34, FR42-FR45, NFR5, NFR13-NFR21, NFR24-NFR25]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, Frontend Architecture, Architectural Boundaries, API & Communication Patterns, Integration Points]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, Source-Aware Chat Panel, Feedback Patterns, Form Patterns, Navigation Patterns, Responsive Design & Accessibility]
- [Source: `_bmad-output/project-context.md`, framework rules, chat presentation boundaries, typed async state discipline, accessibility guardrails]
- [Source: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-05-01-chatbot-ui-redesign.md`, chatbot redesign direction and sequencing]
- [Source: `_bmad-output/implementation-artifacts/4-2-open-the-source-aware-chat.md`, shell behavior, accessibility, reduced motion, and responsive constraints]
- [Source: `_bmad-output/implementation-artifacts/4-4-handle-refusal-and-protection-states.md`, typed fallback and protection-state expectations]
- [Source: `_bmad-output/implementation-artifacts/5-4-orchestrate-retrieval-backed-grounded-answers.md`, retrieval-backed contract stability]
- [Source: `src/components/chat/SourceAwareChat.tsx`, current shell, single-answer model, and source support rendering]
- [Source: `src/data/chat/source-aware-chat.ts`, current starter prompt catalog and section-aware prompt shaping]
- [Source: `src/lib/chat/api-client.ts`, current single-turn request contract and anonymous session handling]
- [Source: `src/types/chat.ts`, current grounded response union and async-state envelope]
- [Source: `src/index.css`, current editorial tokens and reusable surface styles]
- [Source: `tests/e2e/home.spec.ts`, current mocked chat coverage and responsive/accessibility expectations]
- [Source: `tests/e2e/chat-live.spec.ts`, current live chat coverage]
- [Source: `archive/images/Chatbot_UI.png`, approved reference composition target]
- [Source: `archive/images/Chatbot_BG.png`, approved atmospheric background artwork source]
- [Source: https://react.dev/versions, React documentation version line]
- [Source: https://motion.dev/docs/react-animate-presence, Motion `AnimatePresence` guidance]
- [Source: https://ui.shadcn.com/docs/components/radix/sheet, shadcn Sheet guidance]
- [Source: https://playwright.dev/docs/locators, Playwright locator guidance]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-05-01: Resolved the create-story workflow and targeted Story 5.6 directly so the new chatbot redesign story can carry the course-correction details forward.
- 2026-05-01: Loaded sprint tracking, Epic 5, PRD, architecture, UX spec, project-context rules, Story 4.2, Story 5.4, current chat implementation files, and current browser tests.
- 2026-05-01: Confirmed the current chat UI is single-answer only and that the redesign needs a frontend-only thread model rather than a backend conversation contract change.
- 2026-05-01: Confirmed the approved visual inputs are `archive/images/Chatbot_UI.png` as the reference target and `archive/images/Chatbot_BG.png` as the atmospheric background artwork source.
- 2026-05-01: Confirmed official current guidance for React 19.2, Motion `AnimatePresence`, shadcn Sheet, and Playwright role-first locator usage.
- 2026-05-01: No code was changed in this step; this file is the implementation guide for the redesign story.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story 5.6 is ready for dev with explicit visual reference and asset-path guidance for the chatbot redesign.
- The redesign must preserve typed chat states, shell behavior, accessibility, and session-local-only thread continuity.
- The background artwork source is approved, but it must be promoted from `archive/images/` into a runtime-safe frontend asset path during implementation.

### File List

- `_bmad-output/implementation-artifacts/5-6-redesign-the-source-aware-chat-experience.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Story Completion Status

- ready-for-dev
