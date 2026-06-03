# Chapter 2 Chathead and Chatbar Motion Implementation Plan

Last updated: 2026-06-03

## Request

Fix the Chapter 2 source-aware chat trigger so it no longer sits above the "Why it matters" panel, matches the bottom-right placement used on the other chapters, and behaves like a compact idle chathead that expands into the full chatbar on hover and keyboard focus.

The implementation should use Motion / motion.dev for the animation while preserving accessibility, reduced-motion behavior, and the existing source-aware chat flow.

## Codebase Inspection Summary

### Relevant runtime files

- `src/components/chat/SourceAwareChat.tsx`
  - Renders the source-aware chat panel and the closed trigger.
  - The closed trigger is currently a `Button` with `data-source-aware-chat-trigger=""` and `className="source-chat-dock"`.
  - The trigger contains three visual parts:
    - `.source-chat-dock-icon`
    - `.source-chat-dock-copy`
    - `.source-chat-dock-arrow`
  - The component already tracks `isOpen`, restores focus to the trigger on close, and keeps the trigger hidden from tab order while the panel is open.

- `src/index.css`
  - Defines the shared chat dock placement and visual styling.
  - Current base trigger width is `min(22rem, calc(100vw - 2rem))`.
  - Current mobile override uses `min(20rem, calc(100vw - 2rem))`.
  - Current Chapter 2-specific desktop rule moves the trigger upward:

    ```css
    body:has(a[href="#global-governance-overview"][aria-current="location"])
      [data-source-aware-chat-trigger] {
      transform: translateY(clamp(-7.5rem, -10.5svh, -6rem));
    }
    ```

  - A short-height desktop override moves it even farther upward:

    ```css
    body:has(a[href="#global-governance-overview"][aria-current="location"])
      [data-source-aware-chat-trigger] {
      transform: translateY(clamp(-12rem, -23svh, -10.8rem));
    }
    ```

- `src/components/layout/AppShell.tsx`
  - Renders `<SourceAwareChat />` globally after the main content and idle scroll cue.
  - Because the chat trigger is global, any shared behavior change should be checked across all chapters, not only Chapter 2.

- `src/components/layout/IdleScrollCue.tsx`
  - Uses `[data-source-aware-chat-panel]` to avoid appearing while chat is open.
  - The recent Chapter 2 CSS hides `.idle-scroll-cue` while Chapter 2 is active on desktop.

### Existing Motion setup

- `motion@12.38.0` is already installed.
- The app already imports Motion from `motion/react` in `src/components/modules/MaintainerDashboard/MaintainerLogin.tsx`.
- Existing Motion usage includes `motion`, `AnimatePresence`, and `useReducedMotion`, so the chat trigger can follow the same import style.

### Existing tests and verification surfaces

- `src/components/chat/SourceAwareChat.test.tsx`
  - Covers opening, closing on Escape, focus restoration, starter prompt behavior, and answer rendering.

- `tests/e2e/home-smoke.spec.ts`
  - Covers opening the source-aware chat from the global shell without disrupting the learning flow.

- `tests/e2e/home-layout.spec.ts`
  - Covers source-aware chat containment on mobile and reduced motion.
  - Already checks touch target size, viewport containment, focus visibility, and panel reduced-motion behavior.

### Graphify context

- `graphify-out-merged/GRAPH_REPORT.md` and `graphify-out/GRAPH_REPORT.md` were checked for orientation.
- Both reports are stale because they were built from commit `7323c4aa`, while the current HEAD is `6ad1866`.
- Useful Graphify communities:
  - Chat community: `SourceAwareChat`, starter prompts, chat handlers.
  - Navigation/layout community: `NavigationProvider`, active chapter/section tracking.
  - Layout-test community: viewport containment and visible focus helpers.
- Treat Graphify as broad architecture context only until refreshed.

### GitNexus context

GitNexus is also slightly stale, reporting the index as one commit behind HEAD. It is still useful for blast-radius orientation.

GitNexus impact for `SourceAwareChat`:

- Risk: LOW
- Direct upstream dependents:
  - `src/components/layout/AppShell.tsx`
  - `src/components/chat/SourceAwareChat.test.tsx`
- Affected process:
  - `AppShell`
- Affected modules:
  - `Sections`
  - `Layout`

GitNexus impact for `GlobalGovernanceOverviewChapter`:

- Risk: LOW
- Direct upstream dependents:
  - `src/App.tsx`
  - `src/components/sections/GlobalGovernanceOverviewChapter.test.tsx`
- Affected processes: none reported
- Expected note: the preferred fix should not require changing this component unless visual verification proves the Chapter 2 layout itself needs another small reserved-space adjustment.

## Implementation Plan

### 1. Return Chapter 2 chat placement to the shared bottom-right position

Remove the Chapter 2-specific upward transforms from `src/index.css`:

- Remove the desktop transform under:

  ```css
  @media (min-width: 72.01rem) {
    body:has(a[href="#global-governance-overview"][aria-current="location"])
      [data-source-aware-chat-trigger] {
      transform: ...;
    }
  }
  ```

- Remove the short-height override transform under:

  ```css
  @media (min-width: 72.01rem) and (max-height: 50rem) {
    body:has(a[href="#global-governance-overview"][aria-current="location"])
      [data-source-aware-chat-trigger] {
      transform: ...;
    }
  }
  ```

Keep the Chapter 2 `.idle-scroll-cue` hide rule unless verification shows it is no longer needed. It helps prevent the idle cue from competing with Chapter 2 bottom controls.

Recommended result:

- The chat trigger stays in the same fixed bottom-right shell as the other pages.
- The compact idle state reduces obstruction instead of moving the trigger into the content area.

### 2. Convert the closed trigger to a Motion-powered chathead/chatbar

Update `src/components/chat/SourceAwareChat.tsx`:

- Import Motion from `motion/react`:

  ```ts
  import { motion, useReducedMotion } from "motion/react"
  ```

- Add local hover/focus state, for example:

  ```ts
  const [isDockExpanded, setIsDockExpanded] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  ```

- Use pointer and focus handlers on the trigger:

  - `onPointerEnter` expands the dock.
  - `onPointerLeave` collapses the dock.
  - `onFocus` or `onFocusCapture` expands the dock.
  - `onBlurCapture` collapses only when focus leaves the trigger.

- Preserve the existing click behavior:

  ```ts
  onClick={() => setIsOpen((current) => !current)}
  ```

- Preserve existing accessibility:
  - Keep `aria-label="Open source-aware chat"`.
  - Keep `aria-controls`.
  - Keep `aria-expanded`.
  - Keep focus restoration after Escape/close.

Recommended implementation shape:

- Use Motion wrappers around the visible content, not around the entire `Button` primitive if the polymorphic ref/type interaction gets noisy.
- Preferred low-risk route:
  - Keep the existing `Button` as the semantic trigger.
  - Add Motion to inner spans with `motion.span`.
  - Use inline CSS custom properties or `data-expanded` on the button for the width/layout state.

Alternative if type compatibility is clean:

- Replace the trigger with `motion(Button)` or a `Button asChild` pattern around `motion.button`.
- Only use this if it does not disturb the shadcn button styling, ref typing, or tests.

### 3. Idle compact visual state

Target idle visual:

- Circular button matching the attached compact chathead reference.
- Shows only the message icon.
- Keeps a 44px minimum touch target.
- Does not show the text copy or arrow until expanded.

Recommended CSS base state:

- Set `[data-source-aware-chat-trigger]` to compact dimensions when closed:
  - Width/height around `3.5rem`.
  - Border radius `999px`.
  - Padding small enough to center the icon.
  - Overflow hidden.
  - `justify-self: end` / right-origin behavior so expansion grows leftward from the bottom-right corner.

- Hide or visually collapse:
  - `.source-chat-dock-copy`
  - `.source-chat-dock-arrow`

Use `aria-label` as the accessible name, so the hidden visual copy does not harm screen reader access.

### 4. Expanded hover/focus visual state

Target expanded visual:

- Same full chatbar shape as the current trigger.
- Expands smoothly from the circular chathead into the full pill/card.
- Text and arrow fade/slide in after the width starts expanding.
- Collapses smoothly when hover/focus leaves, unless the chat panel opens.

Recommended expanded dimensions:

- Desktop: `min(22rem, calc(100vw - 2rem))`
- Smaller viewports: preserve existing responsive cap of `min(20rem, calc(100vw - 2rem))`

Recommended state marker:

```tsx
data-expanded={isDockExpanded ? "true" : "false"}
```

Then CSS can define stable layout for:

```css
[data-source-aware-chat-trigger][data-expanded="false"] { ... }
[data-source-aware-chat-trigger][data-expanded="true"] { ... }
```

### 5. Motion animation approach

Use Motion for the reveal polish:

- Animate the trigger container:
  - `width`
  - `borderRadius`
  - subtle `scale`
  - `boxShadow` if needed

- Animate copy and arrow:
  - `opacity`
  - `x`
  - optional `filter: blur(...)` for a soft reveal

- Use a spring-like transition for normal motion:

  ```ts
  const dockTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 420, damping: 34, mass: 0.7 }
  ```

- Use reduced-motion variants:
  - No spring.
  - No slide/scale/blur.
  - Instant or very short opacity change.

Recommended interaction rule:

- Hover/focus expansion should be visual only.
- Click still opens the chat panel.
- On click, it is acceptable for the dock to expand briefly before the panel appears, but it should not delay opening the chat.

### 6. Touch and mobile behavior

Hover does not exist reliably on touch devices, so avoid relying on hover for mobile usability.

Recommended behavior:

- Desktop/fine pointer:
  - Idle compact chathead.
  - Hover/focus expands to full chatbar.

- Touch/coarse pointer:
  - Keep the compact chathead as the primary idle state if the user wants a consistent chathead.
  - Do not require a pre-hover reveal before opening.
  - A tap should open the chat immediately because the accessible label already describes the action.

Risk to check:

- If the compact-only mobile trigger feels too cryptic, keep mobile at the current full-width trigger and apply compact idle only at `sm`/desktop breakpoints.
- The recommended first implementation is compact on desktop and at least `44px` compact on touch, then verify visually.

### 7. Files expected to change

Primary implementation files:

- `src/components/chat/SourceAwareChat.tsx`
  - Add Motion import and reduced-motion handling.
  - Track expanded visual state.
  - Add Motion variants/props to trigger contents.
  - Preserve click, focus, and close behavior.

- `src/index.css`
  - Remove Chapter 2-specific chat trigger upward transforms.
  - Add compact/expanded dock layout rules.
  - Keep stable dimensions and overflow containment.
  - Keep reduced-motion compatibility for CSS transitions that remain.

Likely test files:

- `src/components/chat/SourceAwareChat.test.tsx`
  - Add or update tests to confirm focus expansion state if represented by `data-expanded`.
  - Confirm Escape close still restores focus.

- `tests/e2e/home-layout.spec.ts`
  - Add browser-level checks if the behavior is easy to assert:
    - Chapter 2 trigger is contained bottom-right.
    - Trigger expands on hover/focus on desktop.
    - Reduced motion avoids transition duration where applicable.

Optional test/support files:

- `tests/playwright/home-page-helpers.ts`
  - Only if a reusable helper is needed for dock containment or hover expansion checks.

Plan artifact:

- `archive/docs/planning-artifacts/public-redesign-plans/chapter-2-chathead-chatbar-motion-implementation-plan.md`

## Risks and Layout Edge Cases

- **Global component blast radius:** `SourceAwareChat` is rendered by `AppShell`, so changes affect every chapter.
- **Chapter 2 bottom density:** the trigger must not cover the "Next Chapter" card, the legend, or the lens controls in common desktop heights.
- **Expansion overlap:** expansion grows leftward from the bottom-right corner; it may temporarily overlap nearby content on hover. This is acceptable only if the idle state remains unobtrusive and the expanded state does not block core controls unexpectedly.
- **Keyboard access:** focus should expand the dock, and pressing Enter/Space should still open the chat. Focus restoration after Escape must remain unchanged.
- **Reduced motion:** Motion variants must use `useReducedMotion` so spring, slide, scale, and blur are disabled or minimized.
- **Touch behavior:** tapping the compact chathead must open the chat directly; mobile users should not need hover.
- **Button semantics:** replacing the shadcn `Button` with a Motion element could create type/styling friction. Prefer keeping the `Button` semantic wrapper unless a clean `motion(Button)` implementation is verified.
- **E2E selector stability:** existing tests locate the trigger by accessible name `"Open source-aware chat"`. That accessible name should not change.
- **GitNexus/Graphify freshness:** both code intelligence sources are slightly stale after the latest local commit, so implementation decisions must be verified against source and tests.

## Verification Plan

Run fast code checks:

```powershell
pnpm exec vitest run src/components/chat/SourceAwareChat.test.tsx
pnpm exec vitest run src/components/sections/GlobalGovernanceOverviewChapter.test.tsx
pnpm typecheck
pnpm lint
```

Run build if the current unrelated maintainer-dashboard build errors are resolved or if the branch state allows it:

```powershell
pnpm build
```

If build still fails from unrelated existing maintainer-dashboard errors, document the failure and cite the first relevant errors.

Run browser visual checks with the local dev server:

```powershell
pnpm dev
```

Then verify with Playwright CLI:

- `/#global-governance-overview`
  - Desktop `1920x1080`
  - Desktop short height `1366x768`
  - Tablet-ish `1024x820`
  - Mobile `390x844`

- `/#un-command-center`
  - Confirm the same bottom-right placement and behavior works on another chapter.

Visual assertions:

- Idle state is compact and circular.
- Hover expands to the full chatbar.
- Keyboard focus expands to the full chatbar.
- Leaving hover/focus collapses back to compact.
- Click opens the chat panel immediately.
- Escape closes the panel and restores focus to the trigger.
- Chapter 2 side panel, legend, next card, and lens controls remain usable.
- No horizontal overflow.
- Reduced-motion mode removes or minimizes spring/slide effects.

Recommended Playwright test lane after implementation:

```powershell
pnpm test:e2e:layout
```

Use the full smoke lane if the layout tests are updated or if the chat opening flow changes:

```powershell
pnpm test:e2e
```

Before committing implementation work:

```powershell
gitnexus detect_changes --scope staged
```

or use the GitNexus MCP `detect_changes` tool for the staged scope.

## Recommended Execution Order

1. Remove Chapter 2-specific chat trigger upward transforms from `src/index.css`.
2. Add Motion import and reduced-motion handling in `SourceAwareChat`.
3. Add visual expansion state driven by hover/focus.
4. Convert trigger copy/arrow reveal to Motion variants.
5. Add compact/expanded CSS layout rules.
6. Run unit tests for `SourceAwareChat`.
7. Run typecheck and lint.
8. Verify Chapter 2 and Chapter 3 visually across desktop, short desktop, and mobile.
9. Add or update E2E layout coverage only if the behavior can be asserted cleanly without brittle animation timing.
