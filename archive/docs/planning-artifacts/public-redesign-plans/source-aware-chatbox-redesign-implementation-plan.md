# Source-Aware Chatbox Redesign Plan

## Goal

Redesign the learner-facing chatbox overlay into a premium, modern, source-aware panel while preserving the existing grounded chat contract, section-aware prompt behavior, keyboard/accessibility behavior, and the current Supabase chat boundary.

This is a redesign-only plan. It should improve clarity, hierarchy, and polish without changing the backend answer contract or introducing a new app-level navigation model.

## Mockup Reference

- Primary visual reference: [source-aware-chatbox-redesign-mockup-01.png](../generated-mockups/public-homepage-redesign/source-aware-chatbox-redesign-mockup-01.png).
- Expected repo-root path: `archive/docs/planning-artifacts/generated-mockups/public-homepage-redesign/source-aware-chatbox-redesign-mockup-01.png`.
- Keep the chatbox mockup alongside the other public-homepage mockups so a fresh context window can find the source asset in the same archive family.
- If the image is renamed later, keep the directory reference intact and update the filename in this plan rather than moving the asset out of the mockup archive.

## Codebase Findings

- `src/components/chat/SourceAwareChat.tsx` is the global overlay entry point rendered by `AppShell`.
- `SourceAwareChat` already owns the important behavior we must keep:
  - open and close state
  - escape-key close
  - focus restoration to the trigger
  - reduced-motion support
  - section-aware starter prompts
  - submit wiring to `requestGroundedAnswer`
  - loading, weak-support, refusal, cooldown, answered, and error states
  - expandable source citations inside `GroundedAnswerSurface`
- `src/data/chat/source-aware-chat.ts` already supplies section-aware prompt sets plus a fallback prompt state.
- `src/components/layout/IdleScrollCue.tsx` checks for `[data-source-aware-chat-panel]`, so the open-panel root must keep that marker unless the layout logic is updated in tandem.
- `src/components/layout/AppShell.tsx` mounts the chat overlay globally inside the navigation shell, which means the redesign should stay localized to the chat feature.
- `src/components/ui/` currently contains only `button`, `collapsible`, and `table`, so the redesign should prefer existing primitives plus Tailwind utilities unless a small new primitive clearly improves reuse or accessibility.
- Current tests already cover open/close behavior, focus return, section context, prompt selection, answered source expansion, weak support, refusal, cooldown, and live chat coverage.
- GitNexus impact analysis marks `SourceAwareChat` as low risk and shows the direct callers as `AppShell`, `SourceAwareChat.test.tsx`, and `App.tsx`, which supports a contained redesign with limited blast radius.

## Design Intent

- Keep the panel anchored as a right-side overlay on desktop.
- Make the shell feel premium, calm, and academic with a dark navy / charcoal base.
- Use restrained blue and gold accents rather than neon or high-contrast futurism.
- Build a clear hierarchy:
  - header
  - helper text
  - trust/status row
  - transcript area
  - prompt chips
  - composer
  - source support / citation area
- Keep the panel visually consistent with the current site without redesigning the page behind it.
- Make the interface feel like a real product conversation surface, not a decorative mockup.

## Implementation Strategy

### 1. Keep the behavior in `SourceAwareChat` and split the presentation

The first pass should preserve all state and request logic in `SourceAwareChat` and move only presentation concerns into small local pieces.

Recommended presentational pieces:

- panel shell
- header and status row
- transcript stack
- prompt chip row
- composer and send action
- source citation strip
- state cards for weak support, refusal, cooldown, and error

This keeps the component honest:

- state stays in one place
- the live chat request still uses the existing client
- the layout becomes easier to reason about and test
- the component becomes much less monolithic without changing the runtime boundary

### 2. Reframe the panel as a transcript-first experience

The current UI is a form plus a response surface. The redesign should feel more like a conversation without inventing a fake long-term chat history.

Recommended transcript approach:

- Seed the transcript with one short assistant greeting bubble when the panel opens.
- Keep the greeting concrete and source-aware, for example:
  - "I can help explain institutions, norms, and collective action using approved course material."
- Render the user's submitted question as a distinct bubble in the transcript.
- Render the assistant response as the live reply block directly below it.
- Keep the transcript shallow and scrollable.
- Do not fabricate multiple hidden turns just to fill space.

This gives the panel the polished "sample conversation" feeling the mockup asked for, while staying truthful to the actual product behavior.

### 3. Rebuild the visual hierarchy around a premium dark academic card

The open panel should read like a carefully composed product surface.

Header:

- assistant name, for example `Governance Guide`
- live status chip such as `Source-aware` or `Source-aware - Online`
- close control in the top-right corner
- optional minimize control only if it stays discoverable and does not create a second hidden state

Helper copy:

- short explanation that the assistant is bounded to approved course sources
- keep it concise and legible

Trust line:

- add a compact trust badge or note, such as `Grounded in approved course sources`
- make the badge subtle, not loud
- keep the badge descriptive, not promotional

Prompt chips:

- render `sourceAwareChatStarterPrompts` as compact, premium chip buttons
- keep the prompts section-aware
- preserve keyboard focus and click behavior
- make the chips feel like quick actions, not noisy tags

Composer:

- use a stronger textarea treatment with clearer borders, padding, and placeholder color
- keep Enter-to-submit and Shift+Enter multiline behavior
- keep the send button visually distinct and easy to hit
- preserve the loading spinner / asking state

Source support:

- keep answered responses source-aware with citation chips
- make the citation summary feel more premium and more obviously trustworthy
- keep expandable source details accessible and readable
- keep weak-support, refusal, cooldown, and error cards readable and consistent with the new shell

### 4. Preserve the existing state machine, but present it more cleanly

The redesign should not change the meaning of the current response states.

Keep the state semantics intact:

- `answered`
- `weakSupport`
- `refused`
- `cooldown`
- `error`

Presentational goals for each state:

- `answered` should feel like a polished reply with source support directly visible.
- `weakSupport` should feel cautious and informative, not broken.
- `refused` should feel clear and boundary-aware, with a strong rephrase action.
- `cooldown` should feel calm and explicit about retry timing.
- `error` should remain visible and actionable without collapsing the shell.

The current `GroundedAnswerSurface` logic already knows how to render these states. The redesign should mostly reframe the surfaces rather than invent a new trust model.

### 5. Keep accessibility and responsive behavior first-class

The new panel should remain easy to use with a keyboard and remain readable on different viewport sizes.

Accessibility guardrails:

- keep `Escape` to close
- keep focus restoration to the dock trigger
- keep `aria-controls`, `aria-expanded`, and the region label
- keep the input labeling explicit
- preserve reduced-motion behavior
- keep citation expansion buttons real buttons
- keep tap targets comfortable

Responsive guardrails:

- on desktop, keep the panel docked to the right with a clear max width
- on smaller screens, collapse into a bottom-sheet-like overlay if needed
- keep the shell inside the viewport
- avoid horizontal overflow
- preserve the current page flow behind the overlay

The chatbox should feel like an overlay, not a blocking modal.

### 6. Keep the scope tightly bounded

Do not let the redesign drift into a broader architecture change.

Out of scope:

- no React Router introduction
- no global store introduction
- no backend contract rewrite
- no public chat boundary migration
- no redesign of the surrounding landing page
- no visual effects that are hard to reproduce in Tailwind

If a new primitive is needed, prefer a minimal local addition under `src/components/ui/` rather than a broader UI library shift.

## Suggested File Plan

### Likely touch points

- `src/components/chat/SourceAwareChat.tsx`
- `src/components/chat/SourceAwareChat.test.tsx`
- `src/data/chat/source-aware-chat.ts` only if prompt copy or fallback copy needs a visual refresh
- `tests/e2e/chat-boundary-validation.spec.ts`
- `tests/e2e/chat-live.spec.ts` only if selectors or labels change in a way that affects the live path
- `src/components/layout/IdleScrollCue.tsx` only if the open-panel marker changes, which should be avoided

### Possible helper extraction

If the component starts to feel too large after the redesign, split presentation into small feature-owned helpers under `src/components/chat/`, for example:

- `SourceAwareChatHeader.tsx`
- `SourceAwareChatTranscript.tsx`
- `SourceAwareChatComposer.tsx`
- `SourceAwareChatPromptChips.tsx`
- `SourceAwareChatResponse.tsx`

Only extract helpers that reduce complexity. Do not split the file just for the sake of splitting it.

## Work Breakdown

### Step 1: Audit the current shell and lock behavior

Confirm the redesign keeps these behaviors unchanged:

- open / close semantics
- escape-to-close
- focus restoration
- section-aware starter prompts
- request submission
- answer state handling
- citation expansion
- the panel marker used by `IdleScrollCue`

Deliverable:

- a clear mapping of what is behavior and what is presentation

### Step 2: Recompose the open panel into a premium layout

Build the new shell with:

- header
- helper text
- source-aware trust badge
- transcript area
- prompt chips
- composer
- source support area

Deliverable:

- a polished right-side overlay that reads like a production conversation panel

### Step 3: Add transcript polish without inventing fake product logic

Implement the conversation area so it can show:

- one seeded assistant greeting
- the user's current question
- the live assistant response
- loading and error states inline

Deliverable:

- a transcript-first layout that still maps directly to the current single-turn grounding flow

### Step 4: Restyle the trust and citation surfaces

Make source visibility more elegant and readable:

- compact citation chips
- stronger source preview styling
- clearer distinction between weak support and grounded answers
- consistent card treatment for refusal and cooldown

Deliverable:

- a source-aware answer area that looks premium without obscuring the trust semantics

### Step 5: Tighten accessibility and responsive behavior

Verify the redesign against:

- keyboard navigation
- focus return
- reduced motion
- viewport containment
- small-screen layout behavior

Deliverable:

- no regressions in basic usability or containment

### Step 6: Update tests to match the new presentation

Expand the component and browser tests so they assert the new layout while preserving the current chat semantics.

Deliverable:

- tests that prove the redesign is still the same chatbox behaviorally, just better presented

## Test Plan

### Unit tests

Update `src/components/chat/SourceAwareChat.test.tsx` to cover:

- panel open and close behavior
- focus return to the trigger
- header / status / helper text rendering
- prompt chip presentation and selection
- the transcript seed and live turn rendering
- answered response source chips
- weak-support, refusal, cooldown, and error cards
- citation expansion and source details

### Browser tests

Add or update a narrow Playwright spec for the overlay layout. The browser test should verify:

- the panel appears on the right side of the page
- the new header and trust line are visible
- prompt chips are usable
- the panel remains inside the viewport at the target desktop width
- the close control and escape key still work

If the browser test is mostly about responsive geometry and containment, tag it `@layout`.
If a fast open/close path is still useful, keep one narrow `@smoke` check as well.

### Live chat tests

Do not expand `tests/e2e/chat-live.spec.ts` unless the redesign changes the live chat labels or selectors in a way that affects the live path.

### Commands to run

- `pnpm exec vitest run src/components/chat/SourceAwareChat.test.tsx`
- `pnpm test:e2e`
- `pnpm test:e2e:layout` if a layout-focused Playwright spec is added
- `pnpm test:chat:live` only if the live chat boundary or request wiring changes

## Risks and Guardrails

- If the `data-source-aware-chat-panel` marker is removed, `IdleScrollCue` will stop detecting the open chat panel correctly.
- If the transcript gets too tall, the panel will feel heavy. Keep the transcript shallow and scrollable.
- If the glass effect becomes too strong, contrast will suffer. Keep the blur soft and the typography crisp.
- If prompt chips become decorative instead of functional, keyboard users will feel the regression immediately. Keep them as real controls.
- If minimize is added, make sure it does not create a confusing second hidden state.
- The redesign should not make the overlay feel modal or block the rest of the site.

## Definition of Done

- The chatbox reads like a premium right-side overlay that matches the dark academic site.
- The user can still open it, close it, choose prompts, submit questions, inspect sources, and recover from weak-support, refusal, and cooldown states exactly as before.
- The page shell, idle cue, and live chat behavior remain intact.
- The implementation stays realistic for React, Tailwind CSS, and shadcn-style primitives.
