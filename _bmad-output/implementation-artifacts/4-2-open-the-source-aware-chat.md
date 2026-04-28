# Story 4.2: Open the Source-Aware Chat

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a learner,
I want to open the chatbot and see suggested prompts,
so that I can ask project questions from anywhere in the experience without guessing where to start.

## Acceptance Criteria

1. Given I am anywhere in the learning flow, when I open the chatbot, then one persistent source-aware chat surface appears from a stable shell-level trigger without changing route, resetting the chapter shell, or changing my scroll position, and I can close it and return focus to the trigger that opened it.
2. Given the chatbot opens, when I review the panel, then it clearly presents itself as a bounded academic assistant rather than a general-purpose chatbot through visible framing copy, and the prompt area is explicitly labeled, readable, and screen-reader accessible.
3. Given suggested prompts are available, when I inspect the quick-start options, then I see a fixed starter set of course-language prompts authored for this experience, I can choose one without auto-submitting it, and the suggestions reduce first-use friction.
4. Given I use keyboard only, when I open, use, and close the panel, then the trigger, prompt buttons, input, submit control, and close control are reachable with visible focus states, `Escape` closes the surface, focus returns to the opener, and the chat surface remains operable without a mouse.
5. Given I open the chatbot on mobile, when the panel adapts, then it uses one explicit smaller-screen layout model, remains readable at 360 px, 768 px, 1024 px, and desktop widths, introduces no horizontal scrolling, and does not obscure the rest of the site more than necessary to continue the learning flow afterward.
6. Given reduced motion is enabled, when I open or close the panel, then nonessential motion is suppressed, any open or close transition is removed or reduced to a calm static state, and the interaction remains readable and usable without animation cues.
7. Given the starter prompt data is missing, partial, malformed, or temporarily unavailable, when the panel opens, then the trigger and panel remain usable, the panel shows a calm fallback state that explains the gap, and the rest of the experience stays interactive.

## Tasks / Subtasks

- [x] Establish a shell-level chat entry point and persistent panel mount in `src/components/layout/AppShell.tsx` (AC: 1, 4, 5, 6)
  - [x] Choose one explicit interaction model for this story across breakpoints: a persistent shell trigger that opens the same chat surface, with a desktop panel and a mobile bottom-sheet style variant rather than an ad hoc mix of dock, modal, and inline behaviors.
  - [x] Keep the current anchor-navigation flow and scroll position intact when the panel opens and closes.
  - [x] Preserve a clear close path that returns focus to the trigger and supports `Escape` close behavior.
  - [x] Keep any state local or in a thin context instead of introducing a global store.
  - [x] Reuse the existing disclosure and focus-return patterns from `NarrativeSection` and `WpsEvidenceSurface` before inventing a new interaction model.

- [x] Add feature-owned chat UI and prompt data under the chat boundary (AC: 2, 3, 5, 7)
  - [x] Create the chat trigger, dock or panel, and starter prompt rendering under `src/components/chat/`.
  - [x] Add visible bounded-assistant framing copy, accessible labels, and prompt-button semantics so the surface reads as an academic support tool instead of a general chat box.
  - [x] Add prompt content in `src/data/` with a fixed starter set, explicit course-language wording, and a calm fallback path for missing, partial, or malformed starter data.
  - [x] Make prompt selection fill the input without auto-submitting so this story stays limited to opening the assistant and suggesting prompts.
  - [x] Keep this story limited to presentation-only source-aware framing and starter prompts; do not implement grounded answers, source chips, refusal, cooldown, loading states, or backend retrieval yet.
  - [x] If a shared overlay primitive is needed, keep it aligned with the shadcn/ui component library instead of building a bespoke modal system.

- [x] Add regression coverage for the open/close flow and starter prompts (AC: 1-7)
  - [x] Add co-located unit or component coverage for the prompt data, fixed starter set, and starter-state fallback rendering if a new data module is introduced.
  - [x] Extend `tests/e2e/home.spec.ts` to verify bounded-assistant framing copy, open or close behavior, prompt selection without auto-submit, keyboard access, `Escape` close, focus return, reduced motion, mobile layout, and no horizontal scrolling.
  - [x] Use `getByRole()` and media emulation rather than brittle selectors or sleeps.

### Review Findings

- [x] [Review][Patch] Replaced the ambiguous "panel or dock" wording with one stable shell-triggered chat surface contract so implementation and testing target the same interaction model.
- [x] [Review][Patch] Made scroll-position preservation explicit so opening the chat cannot quietly shift the learner away from the current reading point.
- [x] [Review][Patch] Required visible bounded-assistant framing copy so the panel can be distinguished from a general-purpose chatbot in a reviewable way.
- [x] [Review][Patch] Added explicit accessibility expectations for labels, semantics, and operable controls instead of leaving the prompt area and buttons loosely described.
- [x] [Review][Patch] Clarified that starter prompts are a fixed course-language set authored for this experience rather than an undefined or potentially multilingual suggestion source.
- [x] [Review][Patch] Defined the starter-prompt interaction so selection fills the input without auto-submitting and keeps Story 4.2 scoped to panel opening plus prompt guidance.
- [x] [Review][Patch] Promoted `Escape` close and focus return into the acceptance criteria so the keyboard contract is deterministic and testable.
- [x] [Review][Patch] Replaced the vague mobile requirement with one explicit responsive layout expectation and a no-horizontal-scroll constraint at the standard breakpoints.
- [x] [Review][Patch] Tightened reduced-motion behavior so open or close transitions must reduce to a calm static state instead of relying on subjective judgment.
- [x] [Review][Patch] Expanded the fallback requirement to cover missing, partial, and malformed starter data while keeping the trigger and panel usable.
- [x] [Review][Patch] Resolved the scope mismatch by stating that source awareness in this story is presentation-only and does not include grounded answers, source chips, refusal, cooldown, loading, or retrieval behavior yet.
- [x] [Review][Patch] Extended the verification expectations to cover bounded-assistant framing copy and fallback rendering so AC2 and AC7 are no longer left to manual interpretation.
- [x] [Review][Patch] Give the starter prompts a real group name [src/components/chat/SourceAwareChat.tsx:121] — the starter buttons live inside a plain `div` with `aria-label="Suggested prompts"`, which does not expose a reliable named control group to screen readers; use a `fieldset`/`legend` or `role="group"` with `aria-labelledby` so AC2's prompt area is actually announced.
- [x] [Review][Patch] Keep the shell trigger out of the tab order while the sheet is open [src/components/chat/SourceAwareChat.tsx:162] — on narrow viewports the fixed trigger sits behind the bottom sheet and can still be reached by Tab, and the current E2E only clicks the trigger instead of tabbing through the open sheet; remove it from the tab order or otherwise guard focus while open and add a keyboard-path regression check.
- [x] [Review][Patch] Return focus without scrolling the reader away [src/components/chat/SourceAwareChat.tsx:45] — closing the panel always refocuses the opener on the next animation frame, which scrolls the page back toward the floating trigger; this breaks AC1's scroll-position guarantee. Use `focus({ preventScroll: true })` or restore the prior scroll position after focus.

## Dev Notes

### Current State

- `src/components/layout/AppShell.tsx` is the likely shell-level integration point for a persistent chat trigger or dock.
- The app remains SPA-first and anchor-navigation based, so chat should overlay the current learning flow instead of adding a route.
- `src/components/chat/` is currently empty, so this story establishes the chat feature boundary.
- `src/components/sections/NarrativeSection.tsx` and `src/components/modules/WpsDossier/WpsEvidenceSurface.tsx` already show local open/close behavior, `Escape` handling, and focus return patterns that are useful to mirror.
- `tests/e2e/home.spec.ts` already exercises accessibility, reduced motion, and responsive behavior, so extend it rather than starting a separate browser suite.

### Scope Boundaries

- Open the chatbot and show suggested prompts only.
- Treat source awareness in this story as presentation framing only: bounded academic positioning, starter prompts, and shell-level entry.
- Do not implement grounded answers, source chips, refusal, cooldown, loading states, or backend retrieval yet; those belong to Stories 4.3 and 4.4.
- Do not add a router, global store, maintainer dashboard, or browser-side privileged data access.
- Keep the current chapter and scroll position intact when the panel opens and closes.
- Keep chat presentation code free of ingestion or service-role logic.

### Architecture Guardrails

- Keep browser-facing code in `src/`.
- Keep feature-owned chat UI under `src/components/chat/` and shared primitives under `src/components/ui/`.
- Prefer local React state or a thin context over a global store.
- If an overlay primitive is needed, keep it shadcn-based and consistent with the existing component library instead of inventing a bespoke modal system.
- Preserve keyboard access, visible focus states, reduced-motion behavior, and 44 px touch targets.
- Keep mobile behavior from obscuring the main reading flow more than necessary.

### Testing Standards Summary

- Add co-located unit coverage for the starter prompt model, fixed starter set, or fallback state if a new data module is introduced.
- Extend `tests/e2e/home.spec.ts` for bounded-assistant framing, open or close behavior, prompt selection without auto-submit, keyboard access, `Escape` close, focus return, reduced motion, mobile layout, and no horizontal scrolling at 360 px, 768 px, 1024 px, and desktop widths.
- Prefer `getByRole()` and `page.emulateMedia()` over brittle selectors or sleeps.
- Keep the existing no-horizontal-scroll and keyboard-navigation expectations intact.

### Latest Tech Notes

- React 19.2 is the current official release line; stay in standard function components and hooks for this story.
- Vite 8 is the current stable line in the official docs, but the repository intentionally remains on `vite@^7.3.1`.
- Playwright docs continue to favor role-based locators and media emulation for accessible, motion-aware coverage.
- If a sheet or dialog primitive is needed, the current shadcn/ui docs provide the canonical pattern for desktop/mobile overlays.

### Project Structure Notes

- Likely update: `src/components/layout/AppShell.tsx`
- Likely new: `src/components/chat/SourceAwareChatDock.tsx`
- Likely new: `src/components/chat/SourceAwareChatPanel.tsx`
- Likely new: `src/data/chat/source-aware-chat.ts`
- Likely new: `src/data/chat/source-aware-chat.test.ts`
- Likely update: `tests/e2e/home.spec.ts`
- Possible new primitive: `src/components/ui/sheet.tsx` or `src/components/ui/dialog.tsx` if the overlay needs a shared base
- Keep any shared support code under the existing feature boundary instead of introducing a broad shared references layer prematurely.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 4 and Story 4.2: Open the Source-Aware Chat]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR23-FR34, NFR5, NFR15, NFR19, NFR20, NFR21, NFR24, NFR25]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, source boundaries, SPA-first flow, component organization, accessibility guardrails]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, Source-Aware Chat Panel, chat form patterns, overlay patterns, responsive design, accessibility]
- [Source: `_bmad-output/project-context.md`, project rules for SPA-first structure, source discipline, accessibility, and feature boundaries]
- [Source: `src/components/layout/AppShell.tsx`, likely shell-level integration point for the persistent chat trigger]
- [Source: `src/components/sections/NarrativeSection.tsx`, inline disclosure pattern, Escape handling, and focus return]
- [Source: `src/components/modules/WpsDossier/WpsEvidenceSurface.tsx`, additional open/close and focus management pattern]
- [Source: `tests/e2e/home.spec.ts`, existing role-based, reduced-motion, and responsive test patterns]
- [Source: `src/data/navigation.ts`, canonical anchor-navigation structure]
- [Source: `src/data/sections/core-narrative.ts`, chapter ordering and flow]
- [Source: https://react.dev/versions, official React version line]
- [Source: https://react.dev/blog/2025/10/01/react-19-2, React 19.2 release notes]
- [Source: https://vite.dev/blog/announcing-vite8, Vite 8 stable release notes]
- [Source: https://playwright.dev/docs/locators, role-based locator guidance]
- [Source: https://playwright.dev/docs/emulation, media and reduced-motion emulation guidance]
- [Source: https://ui.shadcn.com/docs/components/sheet, sheet primitive guidance if a bottom-sheet overlay is needed]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-04-28: GitNexus impact on `AppShell` returned LOW risk, 0 direct callers, 0 affected processes/modules.
- 2026-04-28: Red phase confirmed `src/data/chat/source-aware-chat.test.ts` failed before the prompt data module existed.
- 2026-04-28: Fixed E2E scroll assertion by using `preventScroll` when focusing the chat input and waiting for hash scroll idle in the test.

### Completion Notes List

- Added a shell-level `SourceAwareChat` mount in `AppShell` with local state, a stable persistent trigger, Escape close, focus return, desktop panel layout, and mobile bottom-sheet layout.
- Added feature-owned chat UI with bounded academic framing, labeled prompt input, fixed starter prompt buttons, no auto-submit behavior, and a calm fallback state for missing, partial, or malformed prompt data.
- Added unit coverage for starter prompt validation/fallbacks and E2E coverage for open/close, scroll and route preservation, prompt selection, keyboard behavior, reduced motion, responsive containment, and horizontal overflow.

### File List

- `src/components/layout/AppShell.tsx`
- `src/components/chat/SourceAwareChat.tsx`
- `src/data/chat/source-aware-chat.ts`
- `src/data/chat/source-aware-chat.test.ts`
- `tests/e2e/home.spec.ts`
- `_bmad-output/implementation-artifacts/4-2-open-the-source-aware-chat.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-04-28: Implemented Story 4.2 source-aware chat shell, starter prompt data/fallbacks, unit tests, and E2E coverage.
