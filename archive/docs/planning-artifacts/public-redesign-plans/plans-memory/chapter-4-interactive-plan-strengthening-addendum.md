# Chapter 4 Interactive Plan Strengthening Addendum

Date: 2026-06-05

Source plan:

- `archive/docs/planning-artifacts/public-redesign-plans/chapter-4-interactive-features-implementation-plan.md`

## Purpose

This addendum captures the evidence-backed refinements from the `planning-with-files`, Graphify, and GitNexus pass. Use it as the execution checklist before implementing the Chapter 4 interactive case-file work.

## Fresh Evidence Summary

Graphify:

- `graphify-out-merged/GRAPH_REPORT.md` and `graphify-out/GRAPH_REPORT.md` both match current `HEAD` `d67eef437672c7b195e75bf4ac13d663913f458f`.
- A merged graph query for Chapter 4 WPS interactions returned `WpsDossier`, `WpsDossier.test.tsx`, `App.tsx`, `AppShell`, `ChapterTransitionBlock`, `HeroNarrativeFrame`, `SourceAwareChat.test.tsx`, and `renderWithNavigation`.
- Graphify still surfaces historical `WpsEvidenceSurface` nodes, but source search confirms there is no current `src/components/modules/WpsDossier/WpsEvidenceSurface.tsx` file.

GitNexus:

- GitNexus was refreshed with `gitnexus analyze --force --embeddings --skills`.
- Fresh index: 3,469 nodes, 6,868 edges, 148 clusters, 291 flows.
- `WpsDossier` impact is LOW: one impacted test file, no affected indexed processes.
- `getSourceAwareChatStarterPrompts` impact is LOW: one impacted test file, no affected indexed processes.
- `SourceAwareChat` impact is HIGH: direct callers include `AppShell` and chat tests; affected process includes `AppShell`.
- `resolveKnownSectionId` impact is HIGH: affected processes include `navigateToAdjacentChapter`, `AppShell`, and `NavigationProvider`.

Source inspection:

- `WpsDossier` accepts `shell` in the prop type but currently destructures only `{ content }`.
- Current local state is only `selectedEventId` and `selectedEvidenceId`.
- map labels are visual spans inside an `aria-hidden` map frame.
- `WpsDossier.test.tsx` currently asserts the matrix has no extra comparison controls.
- raw source IDs are already absent from visible copy, though references use `data-source-ids` internally.

## Strengthened Execution Rules

- Keep first-pass implementation local to `WpsDossier`, `west-philippine-sea-dossier.ts`, WPS CSS in `src/index.css`, and WPS-specific tests.
- Treat edits to `SourceAwareChat`, `AppShell`, `NavigationContext`, or `resolveKnownSectionId` as separate gated work with renewed impact analysis and broader verification.
- Do not revive `WpsEvidenceSurface`; build the new evidence inspector inside current `WpsDossier`.
- Use the mockup component and mockup data as design references only, not runtime sources of truth.
- Keep `sourceIds` as internal link keys and render public labels from `wpsCaseFileReferences` or a source-label helper.
- Replace the existing "no extra comparison controls" unit test when expandable `Ruling vs Reality` rows land.

## Phase Refinements

Phase 1:

- Start by changing `export function WpsDossier({ content }: WpsDossierProps)` to consume `shell`.
- Render `shell.controls` as true mode controls and use their text as the source of public labels.
- Add tests that prove the active mode updates both `aria-pressed` and at least one downstream panel.

Phase 2:

- Preserve the decorative map frame as `aria-hidden`, but move interactive places into a separate accessible hotspot layer.
- Add a mobile fallback list if absolute-positioned hotspots cannot guarantee 44px touch targets.
- Use test attributes for state and layout, but keep assertions focused on user-visible labels and accessibility states.

Phase 3:

- Add a small source-label resolver before building the tray so raw `gg-src-*` strings cannot leak into visible copy.
- Treat `View source excerpts` as a local affordance or reference jump unless backend retrieval is explicitly added later.
- Test hidden raw source IDs through visible text queries, not by forbidding internal data attributes.

Phase 4:

- Expand `WpsCaseFileRulingRealityRow` with explanation, citation label, source IDs, and relationships before changing JSX.
- Replace the current static-matrix test with disclosure tests for `aria-expanded`, one-open-row behavior, citation chip visibility, and evidence sync.
- Avoid radio roles unless the component becomes a true radio-group interaction.

Phase 5:

- Keep the global chat dock as the first-pass chat implementation.
- Verify Chapter 4 prompt selection through existing `activeSectionId` behavior.
- Defer local chat trigger APIs until after local WPS interactions pass.

Phase 6:

- Make reduced-motion behavior a CSS and test concern, not just a visual polish item.
- Hide decorative sync lines on narrow layouts if they threaten readability or overflow.
- Keep the mobile order: title, mode controls, timeline, map, evidence tray, comparison drawer, final thesis, references, trust guide.

## Recommended Verification Gates

- `pnpm test:unit`
- `pnpm exec playwright test tests/e2e/public-homepage-four-chapter-chapter4.smoke.spec.ts --reporter=line`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

Add only when touched:

- `pnpm exec playwright test tests/e2e/source-aware-chatbox.smoke.spec.ts --reporter=line` if chat behavior changes.
- `pnpm exec playwright test tests/e2e/home-smoke.spec.ts --reporter=line` if shared shell or navigation behavior changes.
- `pnpm test:chat:live` if real `/functions/v1/chat` wiring changes.

## Reviewer Checklist

- `shell.controls` are visible, accessible, and wired to local state.
- timeline, hotspot, evidence, and comparison states update without derived state being stored redundantly.
- source labels are public-facing; raw `gg-src-*` IDs do not appear in visible UI.
- map hotspot buttons have accessible names, visible focus, and touch-safe targets.
- comparison disclosure controls have `aria-expanded` and one-open-row behavior.
- `SourceAwareChat`, `AppShell`, `NavigationContext`, and `resolveKnownSectionId` remain untouched in the first pass.
- Chapter 4 smoke coverage remains focused and does not drift into a broad homepage regression suite.
