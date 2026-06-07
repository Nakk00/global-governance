# Source-Aware Chatbox QA Report

Date: 2026-06-07

## Context

This report captures the current public source-aware chatbox issues observed during local browser review. The goal is to confirm the problem list before implementation and preserve the intended fix direction for the next development pass.

Investigation sources used for this revision:

- Graphify merged and slice reports under `graphify-out-merged/`, `graphify-out/`, and `graphify-out-backend/`
- GitNexus process and symbol context for `SourceAwareChat`, `requestGroundedAnswer`, `getSourceAwareChatStarterPrompts`, and `answer_public_chat`
- Direct code review across the frontend chat surface, chat request contract, backend retrieval scope, and West Philippine Sea source bundle data

High-level architecture finding:

- The chat UX issues sit across three separate seams, not one:
  - frontend panel rendering and composer behavior in `src/components/chat/SourceAwareChat.tsx`
  - frontend static prompt definitions in `src/data/chat/source-aware-chat.ts`
  - backend section-scoped retrieval and approved source filtering in `backend/chatbot/services.py` and `backend/retrieval/services.py`
- The West Philippine Sea prompt failures appear to be caused less by model behavior and more by overly narrow backend section source scoping compared with the richer approved source set already present in the chapter data.

## 2026-06-07 Live Prompt Audit Update

The suggested-prompt answerability issue was re-tested against the live local Django endpoint after remediation:

- Command: `pnpm chatbot:audit-prompts -- --endpoint-mode live --endpoint http://127.0.0.1:8000/api/chat --fail-on-miss --json --output "$env:TEMP\grounded-chat-live-audit-final.json"`
- Result: 25 audited prompt rows, 0 non-answered rows, 0 non-strong grounding rows, and 0 rows without a matching approved citation.
- Covered sections: `hero-narrative-frame`, `global-governance-overview`, `un-command-center`, `governance-limits`, `west-philippine-sea-dossier`, and `conclusion-references`.

Implementation findings:

- Approved-source ingestion now activates `source_records` and records `succeeded` ingest jobs, which fixed the hidden retrieval eligibility gap for course-frame and West Philippine Sea sources.
- Retrieval now allows high-vector, term-overlapping approved chunks to rescue conservative rerank scores without promoting unrelated high-vector matches.
- The chat service now treats clearly course-scoped prompts as locally in scope, keeps source-inspection suggested prompts from being rejected by a flaky topic guard, and returns a cited approved-context answer if generation fails after strong retrieval.

## Reported Issues

### 1. Chatbox Exceeds the Page

The open chat panel can exceed the usable viewport, especially near the right and bottom edges. The panel should remain contained within the viewport, with a stable maximum height and internal scrolling for the transcript area.

Expected behavior:

- The open chatbox stays inside the visible page area.
- The panel uses internal scrolling instead of overflowing past the viewport.
- The bottom composer remains reachable at desktop and smaller viewport sizes.

Codebase finding:

- The open panel is rendered from `src/components/chat/SourceAwareChat.tsx` around the `isOpen` branch beginning near line 243.
- The transcript region already uses `flex-1 overflow-y-auto`, but the overall panel and launcher composition still create bottom-right crowding.
- The launcher remains rendered even while the panel is open, so the viewport is effectively carrying two stacked chat surfaces at once.

Likely fix direction:

- Keep a single active fixed-position chat surface at a time.
- Hide or unmount the launcher while open.
- Tighten panel `max-height` behavior and composer-safe spacing so the scrollable transcript owns overflow instead of the whole widget.

### 2. Chat Does Not Preserve Conversation History

The current chat interaction behaves like a single-response panel. When a learner asks a follow-up question, the prior question and answer are replaced or become unavailable for review.

Expected behavior:

- Each user question and assistant response remains visible in a conversation transcript.
- Follow-up questions append to the existing thread.
- Learners can review earlier answers, citations, refusals, weak-support responses, and cooldown messages in the same session.

Codebase finding:

- `src/components/chat/SourceAwareChat.tsx` currently stores only one `submittedQuestion` and one `answerState` state object near lines 60-63.
- The request client in `src/lib/chat/api-client.ts` sends only one `question` plus section/depth context.
- The request contract in `backend/chatbot/dtos.py` also models a single-turn request only.

Interpretation:

- The current behavior is not a rendering bug. The chat surface is architected as a single-turn answer panel.
- If the goal is only reviewable local history, the first fix can be frontend-only with an append-only transcript array.
- If follow-up questions should semantically use prior turns, then the request contract and backend chat service also need conversation history support.

Likely fix direction:

- Phase 1: add frontend transcript persistence for user and assistant turns, including typed success states such as refusal, weak support, and cooldown.
- Phase 2: decide whether to extend the backend request contract with prior turns so follow-up prompts can be interpreted conversationally instead of independently.

### 3. Suggested Prompts Are Not Reliably Source-Aligned

Some suggested prompts can trigger boundary, limited-support, or weak-support responses even though the UI presents them as recommended questions. This suggests the prompt set is not fully aligned with the approved source corpus.

Recommended direction:

- Treat suggested prompts as intended learner questions.
- Collect every suggested prompt from the frontend prompt data.
- Run each prompt against the live Django `/api/chat` endpoint.
- Classify each result as answered, limited support, boundary/refusal, weak citation, cooldown, or transport failure.
- Group failing prompts by missing knowledge area.
- Widen the approved source knowledge with course-relevant, approved materials that support those prompt intents.
- Re-run the same prompt audit until intended prompts are answerable with citations.

Guardrail:

- Do not widen sources randomly just to make the model answer more. Add only approved, course-relevant source materials that directly support the intended learning prompts.

Codebase finding:

- Suggested prompts are fully static in `src/data/chat/source-aware-chat.ts` via `getSourceAwareChatStarterPrompts(...)`.
- Prompt resolution in `resolveStarterPromptState(...)` validates prompt shape but not answerability.
- The West Philippine Sea dossier section currently scopes chat retrieval to only `gg-src-south-china-sea-award` in `backend/chatbot/services.py` line 40.
- That is materially narrower than the approved evidence already used by the chapter itself in:
  - `src/data/sections/west-philippine-sea-dossier.ts`
  - `src/data/source-bundles/approved-source-bundle.ts`
- The chapter data already references additional approved sources such as:
  - `gg-src-wps-enforcement-gap-comparison`
  - `gg-src-wps-political-reality-record`
  - `gg-src-philippines-arbitration-filing`
- Backend retrieval in `backend/retrieval/services.py` applies section source filtering before ranking, so narrow scoping can force a weak-support outcome even when the broader approved chapter evidence exists locally.

Interpretation:

- The user-proposed fix direction is sound, but the first widening target should be the mismatch between section-approved chapter evidence and backend chat section scoping.
- For the West Philippine Sea chapter in particular, the chat layer is currently stricter than the chapter's own approved evidence model.

Likely fix direction:

1. Export and audit every suggested prompt from `src/data/chat/source-aware-chat.ts`.
2. Run a prompt-readiness pass against the live `/api/chat` endpoint.
3. First widen section chat scoping to include approved sources already used by the relevant chapter.
4. Only after that, identify any truly missing approved materials and expand the corpus deliberately.
5. Optionally evolve prompt generation so prompts derive from section-approved evidence metadata instead of being purely hand-authored static chips.

### 4. Bottom-Right Ask-a-Question Launcher Stays Visible

The bottom-right "Ask a question" launcher remains visible after the chatbox opens. This creates a duplicated control beneath the open chat panel and adds visual clutter.

Expected behavior:

- The launcher hides, becomes inert, or transforms into the open chat state when the chatbox is open.
- Only one active chat entry point is visible at a time.
- The open panel controls remain clear and accessible.

Codebase finding:

- The bottom-right launcher button in `src/components/chat/SourceAwareChat.tsx` stays mounted even when `isOpen` is true.
- It only changes `tabIndex` while open and still renders the visible "Ask a question about this chapter" control near line 534.

Likely fix direction:

- Conditionally unmount the launcher while open, or render it through a shared stateful shell that transitions from launcher mode into panel mode.
- Add component and browser assertions that the launcher is not visible once the panel is open.

### 5. Input Composer Creates Large Blank Space

When the chat input reaches roughly three lines and is scrolled upward, the composer can create a large blank area. This appears related to textarea auto-sizing or composer layout behavior.

Expected behavior:

- The input has a stable minimum and maximum height.
- After the maximum height is reached, the textarea scrolls internally.
- The send button and composer footer remain aligned.
- No large blank space appears when editing or scrolling multi-line text.

Codebase finding:

- The composer textarea in `src/components/chat/SourceAwareChat.tsx` is currently a plain `textarea` with `rows={1}`, `min-h-12`, and `max-h-28`.
- There is no explicit autosize logic, no managed `scrollHeight` sync, and no separate composer layout state guarding multiline growth.
- Existing tests cover shift-enter multiline entry, but not multiline height cap, scroll behavior, or blank-space regression.

Likely fix direction:

- Move the composer to a stable layout with a bounded textarea region and explicit autosize or explicit fixed-height scrolling behavior.
- Keep the send button vertically anchored independent of textarea content growth.
- Add a targeted regression test for the multiline scroll case.

## Suggested Fix Order

1. Stabilize the shell: chat panel containment, open-state layout, and launcher visibility.
2. Fix the composer layout and multiline input behavior.
3. Replace the single-turn panel state with an append-only transcript model.
4. Run the suggested-prompt readiness audit against the current live endpoint.
5. Expand backend section source scoping to match approved chapter evidence already present in the repo.
6. Identify any still-missing approved sources and widen the corpus deliberately.
7. Re-run the prompt audit and keep only answerable, cited prompts in the UI.

## Proposed Implementation Shape

### Frontend

- Refactor `SourceAwareChat` into clearer sub-surfaces:
  - shell and open/close container
  - transcript list
  - composer
  - launcher
- Introduce a transcript entry type instead of the current single `submittedQuestion` plus `answerState` model.
- Preserve typed response cards for answered, weak-support, refusal, cooldown, and transport-error states so the transcript remains trustworthy.
- Keep the launcher out of the DOM while the panel is open.

### Backend

- Extend `SECTION_SOURCE_IDS` for sections whose approved evidence set is broader than the current chat scope.
- Start with `west-philippine-sea-dossier`, since the current scoping appears narrower than the evidence already represented in the chapter data.
- If conversational follow-up support is desired beyond visual history, extend the request DTO and service contract to carry prior turns safely.

### Content and Prompting

- Treat `src/data/chat/source-aware-chat.ts` as a prompt catalog that must be validated, not assumed correct.
- Add a repeatable prompt audit workflow so future prompt changes can be checked against live source coverage before release.
- Consider deriving prompt families from section evidence metadata to reduce drift between UI prompts and backend-approved source scope.

## Verification Targets

- Browser layout check for desktop and narrow viewports, including bottom-edge containment while open.
- Component coverage for:
  - launcher hidden while open
  - transcript preservation across multiple submits
  - multiline composer height cap and no blank-space regression
- Backend retrieval coverage proving section chat scoping includes the intended approved source IDs.
- Backend or integration coverage for multi-turn request state if follow-up context is introduced server-side.
- Live chat prompt audit covering every suggested prompt in the catalog.
- Regression evidence that source-aligned prompts return answerable or appropriately bounded cited responses.

## Implementation Notes for the Next Pass

- The most actionable mismatch discovered in this investigation is the West Philippine Sea section source scope. The chapter already contains richer approved evidence than the chat retrieval layer currently allows.
- The conversation-history issue should be treated as a product capability gap, not just a missing visual list.
- The launcher and composer problems are relatively self-contained frontend fixes and are the safest starting point before touching request contracts.
