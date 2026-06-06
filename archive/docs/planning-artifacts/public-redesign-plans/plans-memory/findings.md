# Findings & Decisions

## Requirements
- Use the `planning-with-files` skill for the Chapter 4 interactive implementation plan.
- Initialize the active plan at `archive/docs/planning-artifacts/public-redesign-plans/chapter-4-interactive-features-implementation-plan.md`.
- Keep the planning work grounded in the existing Chapter 4 plan rather than replacing it with a new document.
- Maintain persistent working-memory files in `archive/docs/planning-artifacts/public-redesign-plans/plans-memory`.

## Research Findings
- The target implementation plan is already substantial and contains current Graphify and GitNexus evidence, risk gates, and a phase-by-phase delivery strategy.
- The existing `plans-memory` files were previously oriented around a completed "plan strengthening" session rather than a fresh execution kickoff.
- Current source inspection confirms `WpsDossier` is the local runtime owner for the Chapter 4 case-file UI.
- Current source inspection confirms `WpsDossier` still stores only `selectedEventId` and `selectedEvidenceId`, so the implementation can introduce the richer local interaction model planned in the document.
- Current source inspection confirms map labels are still decorative spans inside an `aria-hidden` map frame, so map hotspot work should replace that public interaction layer while preserving decorative geometry.
- Current source inspection confirms existing WPS tests still expect no extra comparison controls, so those tests must be intentionally rewritten when expandable `Ruling vs Reality` rows are implemented.
- The strongest preserved implementation baseline is still local-first:
  - prefer `WpsDossier`, WPS section data, WPS CSS, and WPS-specific tests for the first pass
  - avoid `SourceAwareChat`, `AppShell`, `resolveKnownSectionId`, and global navigation changes unless a later gate explicitly expands scope
- The implementation plan already documents the most important shared-surface risks:
  - `SourceAwareChat` is high risk
  - `resolveKnownSectionId` is high risk
  - chat and redirect behavior should remain stable in the first pass
- The plan already names the intended verification strategy:
  - targeted unit coverage first
  - Chapter 4-specific Playwright smoke coverage second
  - broader Playwright suites only if shared shell behavior changes
- Implemented local WPS verification passed with focused Vitest coverage for `WpsDossier` and WPS section data.
- Implemented browser verification passed with the Chapter 4 Playwright smoke using the repo's dev-server Playwright config.
- Default build-gated Playwright could not run because `pnpm build` is currently blocked by unrelated MaintainerDashboard missing modules/exports.
- Full `pnpm test:unit` is currently blocked by unrelated MaintainerDashboard test/import drift, while the WPS-focused unit files pass.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Preserve the existing Chapter 4 plan as the main implementation contract | It already carries the freshest scope, sequencing, and risk evidence. |
| Reinitialize the companion files around execution readiness instead of plan strengthening | The user asked to initialize the plan, so the working-memory files should point forward to implementation. |
| Keep prior graph and code-intelligence evidence as baseline constraints, not as work to repeat immediately | Repeating the same research during initialization would add noise without improving kickoff quality. |
| Frame the next step as choosing the safest first runtime slice | The initialization should make the next implementation move obvious and low risk. |
| Implement the local WPS phases together before touching shared chat or navigation | The first four phases share the same local state model and can be verified with WPS-specific tests without crossing the high-risk shared surfaces. |
| Keep chat integration as existing global-dock behavior | The implemented plan did not touch `SourceAwareChat`, `AppShell`, `NavigationContext`, or `resolveKnownSectionId`. |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Existing planning files reflected a prior completed strengthening workflow | Re-scoped them to the new initialization goal while keeping the implementation plan and addendum available as reference evidence. |
| Full default verification is blocked outside Chapter 4 | Documented the MaintainerDashboard failures and relied on focused WPS unit/browser checks plus lint/typecheck for this implementation pass. |

## Resources
- `archive/docs/planning-artifacts/public-redesign-plans/chapter-4-interactive-features-implementation-plan.md`
- `archive/docs/planning-artifacts/public-redesign-plans/plans-memory/task_plan.md`
- `archive/docs/planning-artifacts/public-redesign-plans/plans-memory/findings.md`
- `archive/docs/planning-artifacts/public-redesign-plans/plans-memory/progress.md`
- `archive/docs/planning-artifacts/public-redesign-plans/plans-memory/chapter-4-interactive-plan-strengthening-addendum.md`
- `.codex/skills/planning-with-files/SKILL.md`

## Visual/Browser Findings
- Chapter 4 Playwright smoke passed against `http://127.0.0.1:5173` using `tests/playwright/vite-dev.config.ts`.
- Browser coverage verified mode controls, timeline sync, hotspot focus/click, evidence tray updates, comparison drawer switching, redirect protection, mobile nav, focus visibility, touch targets, and no horizontal overflow.
- Default checked-in Playwright config remains blocked by unrelated `pnpm build` failures in MaintainerDashboard.
