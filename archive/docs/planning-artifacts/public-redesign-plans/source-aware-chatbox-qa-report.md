# Source-Aware Chatbox QA Report

Date: 2026-06-07

## Context

This report captures the current public source-aware chatbox issues observed during local browser review. The goal is to confirm the problem list before implementation and preserve the intended fix direction for the next development pass.

## Reported Issues

### 1. Chatbox Exceeds the Page

The open chat panel can exceed the usable viewport, especially near the right and bottom edges. The panel should remain contained within the viewport, with a stable maximum height and internal scrolling for the transcript area.

Expected behavior:

- The open chatbox stays inside the visible page area.
- The panel uses internal scrolling instead of overflowing past the viewport.
- The bottom composer remains reachable at desktop and smaller viewport sizes.

### 2. Chat Does Not Preserve Conversation History

The current chat interaction behaves like a single-response panel. When a learner asks a follow-up question, the prior question and answer are replaced or become unavailable for review.

Expected behavior:

- Each user question and assistant response remains visible in a conversation transcript.
- Follow-up questions append to the existing thread.
- Learners can review earlier answers, citations, refusals, weak-support responses, and cooldown messages in the same session.

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

### 4. Bottom-Right Ask-a-Question Launcher Stays Visible

The bottom-right "Ask a question" launcher remains visible after the chatbox opens. This creates a duplicated control beneath the open chat panel and adds visual clutter.

Expected behavior:

- The launcher hides, becomes inert, or transforms into the open chat state when the chatbox is open.
- Only one active chat entry point is visible at a time.
- The open panel controls remain clear and accessible.

### 5. Input Composer Creates Large Blank Space

When the chat input reaches roughly three lines and is scrolled upward, the composer can create a large blank area. This appears related to textarea auto-sizing or composer layout behavior.

Expected behavior:

- The input has a stable minimum and maximum height.
- After the maximum height is reached, the textarea scrolls internally.
- The send button and composer footer remain aligned.
- No large blank space appears when editing or scrolling multi-line text.

## Suggested Fix Order

1. Stabilize chat panel sizing, viewport containment, and launcher visibility.
2. Fix the composer textarea sizing and blank-space behavior.
3. Preserve the chat transcript as append-only session history.
4. Build the suggested-prompt readiness audit.
5. Expand approved source coverage based on audit results.
6. Re-run the prompt audit and keep only answerable, cited prompts in the UI.

## Verification Targets

- Browser layout check for desktop and narrow viewports.
- Component coverage for launcher visibility, transcript preservation, and composer height behavior.
- Backend or integration coverage for multi-turn request state if follow-up context is introduced server-side.
- Live chat prompt audit covering every suggested prompt.
- Regression evidence that source-aligned prompts return answerable or appropriately bounded cited responses.
