<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Memory.md First-Read Rule

- Before any implementation, debugging, test-fix, or refactor work, the agent **must** read `MEMORY.md`.
- If `MEMORY.md` is missing or unreadable, the agent must say so before proceeding.

## Installed Next.js Skills

The following local Next.js skills are installed under `.agents/skills/` and should be used deliberately as part of this repo workflow:

- `next-best-practices` is the default background guidance for routine Next.js work in this repo. Use it to reinforce current framework conventions around App Router structure, React Server Component boundaries, async APIs, route handlers, metadata, hydration, and Suspense behavior.
- `next-upgrade` is task-specific guidance for intentional Next.js version migration work. Do not treat it as an always-on workflow rule for normal feature delivery.
- `next-cache-components` is task-specific guidance for adopting or modifying Next.js 16 Cache Components / PPR behavior. Use it only when a story or task explicitly touches those patterns.
- `next-browser` remains an installed secondary inspection skill for Next.js-specific browser debugging when the dev server is running. Prefer `playwright-cli` first for general interactive browser verification in this repo.

When these skills conflict with repo-specific instructions, architecture constraints, verification requirements, or GitNexus safety rules in this file, follow this `AGENTS.md` file first and treat the generic skill as supporting guidance.

### Quick Use Guide For Attendance Monitor

Use `next-best-practices` when:

- adding or editing App Router pages, layouts, loading states, error boundaries, and route handlers
- touching server/client boundaries in admin, teacher, or student surfaces
- changing data fetching, mutations, metadata, redirects, or hydration-sensitive UI
- reviewing code for framework correctness before or during implementation

Use `next-browser` when:

- the local Next.js dev server is already running, `playwright-cli` has already narrowed the problem, and you need deeper Next.js-specific inspection
- validating rendered route behavior, loading states, runtime overlays, or hydration mismatches that appear App Router-specific
- checking what a page actually renders after interactive repro work in `playwright-cli` has already established the failing path

Use `next-cache-components` when:

- a task explicitly introduces or modifies `cacheComponents`, `'use cache'`, `cacheLife()`, `cacheTag()`, `updateTag()`, or PPR behavior
- replacing older caching approaches with Next.js 16 cache-component patterns

Use `next-upgrade` when:

- planning or executing a Next.js version upgrade
- applying codemods or resolving framework deprecations after a version bump

Do not reach for the advanced Next.js skills first when:

- the task is primarily about domain logic, Supabase policy changes, attendance business rules, or student-record workflows
- the main need is repo-specific architecture context, where GitNexus skills and local planning artifacts should lead
- the issue is best verified through checked-in Playwright or Vitest coverage rather than framework guidance alone

## Branch Naming

- Use branch names that describe the story or intent, not the current worktree state.
- Preferred pattern for story work: `codex/story-<epic>-<story>-<short-slug>`.
- Preferred pattern for non-story work: `codex/<type>/<short-slug>`, such as `codex/chore/vitest-stack` or `codex/fix/auth-redirect`.
- Avoid vague or session-based names like `local-edits`, `temp`, `final`, or machine-specific wording.

## Push Handoff

- On every successful `git push`, the agent must include a `PR Summary` in the final user-facing response.
- Treat the `PR Summary` as required even when no pull request has been opened yet.
- Keep the `PR Summary` short and practical: what changed, why it changed, and any key verification or follow-up notes the reviewer should know.
- On every successful `git push`, the agent must also include a paste-ready pull request description when a PR has not already been created through a tool that fills the PR body.
- Do not assume GitHub's compare page will auto-populate the PR description from the chat response. Unless the repo has a PR template or the agent opened the PR with a tool that set the body, provide the user with ready-to-paste PR body text in the final response.

## Testing and Verification

Use Playwright-scripted E2E checks as the default verification path for browser flows in this repo.

- For E2E coverage, default to Playwright scripts in `tests/e2e/` as the first choice.
- For unit coverage, use the formal Vitest stack (`pnpm test:unit`) for checked-in unit test scripts and keep those tests close to the module they validate.
- Use `playwright-cli` as the primary interactive browser debugging tool for local flow exploration, fast repro work, and browser-story verification before checked-in E2E authoring.
- For Next.js-specific runtime or UI debugging, use Next DevTools MCP first to inspect project metadata, routes, errors, logs, and active browser sessions; use `playwright-cli` next for interactive repro, then reach for `next-browser` when the issue appears specifically tied to rendered Next.js route behavior or hydration.
- Do not use browser-tool inspection as a replacement for code-level verification. Still run the required project checks such as `pnpm lint`, `pnpm typecheck`, `pnpm check:env`, and `pnpm build` when the story or task calls for them.

### Browser Story E2E Sequencing

- For stories that change browser behavior, do not lock in the final checked-in Playwright script at the very start of implementation.
- First stabilize the implemented flow, route behavior, copy, and selectors; then verify the rendered behavior interactively with Next DevTools MCP and `playwright-cli`. Use `next-browser` only when deeper Next.js-specific inspection is still needed after that.
- After the flow is stable, create or update the checked-in Playwright coverage in `tests/e2e/` by explicitly using the `bmad-qa-generate-e2e-tests` skill. Do not hand-roll the final browser-story E2E in a normal implementation pass when that skill applies.
- Do not mark a browser-facing story ready for review until the relevant checked-in E2E coverage passes.
- If the E2E fails around hydration, draft preservation, or reload timing, apply the lessons in `MEMORY.md` before changing business logic. Treat test hardening as the first debugging path unless evidence clearly points to an app regression.

### Story E2E Mode Standard (2.7+)

- For browser-facing stories, use a two-mode E2E workflow by default:
  - fast mode for local implementation loops (no forced clean-reset precondition)
  - strict mode as the review/merge gate (requires clean-reset precondition)
- The strict gate should run after a clean local state reset. Prefer `pnpm supabase:reset:safe` over ad-hoc manual restart loops when local Supabase is flaky.
- New browser story E2E scripts should follow the same command shape used in Story 2.7:
  - `test:e2e:<story>` for the base script
  - `test:e2e:<story>:fast` for local rapid reruns
  - `test:e2e:<story>:strict` for final clean-state validation
- In a fresh context window, agents should treat this section plus `MEMORY.md` as the source of truth for E2E execution mode unless a story explicitly documents a justified exception.

### Playwright Browser Install Policy

- Do **not** run `npx playwright install chromium` by default.
- First verify browser availability with:
  - `npx playwright install --dry-run` (check existing install location), or
  - a real launch check (for example `require("playwright").chromium.launch(...)`).
- Only install Chromium when those checks show it is missing or not launchable.

### Playwright CLI Workflow

- Use `playwright-cli` as the primary interactive browser verification tool before authoring or refreshing checked-in E2E scripts.
- Prefer a named session per task, for example `playwright-cli -s=attendance ...`, so repeated commands target the same browser session.
- Use `state-save` and `state-load` only for local debugging workflows. Do not commit local browser state artifacts.
- Local workflow reference for agent use lives at `.claude/skills/playwright-cli/SKILL.md` with supporting docs under `.claude/skills/playwright-cli/references/`.

## UI Debugging Tools

### playwright-cli

Use `playwright-cli` when:

- reproducing a browser bug quickly before writing or updating a checked-in test
- capturing element refs via `snapshot` to understand the current page structure
- stepping through auth, navigation, or form flows interactively in a persistent browser session
- collecting local screenshots, console output, network activity, or browser state while debugging

Preferred interactive workflow:

1. Start the app with `pnpm dev`.
2. Open a named browser session, for example `playwright-cli -s=attendance open http://localhost:3000 --headed`.
3. Use commands such as `snapshot`, `click`, `fill`, `goto`, `console`, `network`, and `screenshot` as needed.
4. Translate any stable, repeatable finding into a checked-in Playwright script when it should become regression coverage.

### next-browser

The `next-browser` skill and CLI are installed for this project and should be used deliberately during Next.js UI work.

Use `next-browser` when:

- the Next.js dev server is running, `playwright-cli` has already reproduced the issue, and you need deeper rendered-UI inspection
- validating route behavior, loading states, error overlays, or hydration/runtime issues that still look Next.js-specific after `playwright-cli` repro
- checking accessibility-oriented UI output such as snapshots, focusable structure, and page content after navigation when the interactive repro path is already known
- debugging frontend work for auth flows, role routing, dashboards, and other App Router pages when the issue appears to be specifically tied to Next.js rendering rather than generic browser automation

Preferred debugging workflow:

1. Start the app with `pnpm dev`.
2. Reproduce and narrow the issue first with `playwright-cli`.
3. Open the target page with `next-browser open http://localhost:3000/...` or the active local dev URL when deeper Next.js-specific inspection is still needed.
4. Use commands such as `snapshot`, `tree`, `errors`, `routes`, `click`, `fill`, `goto`, and `perf` as needed.
5. Use `screenshot` after meaningful UI changes or navigation checkpoints when the skill supports it.

## ui-ux-pro-max

The `ui-ux-pro-max` Codex skill is installed for this project and may be used during intentional UI/UX work.

Use `ui-ux-pro-max` when:

- exploring visual direction for public-facing pages, dashboards, or role-specific shells
- generating a design system or page-specific UI guidance before implementing a meaningful frontend change
- improving clarity, hierarchy, spacing, typography, color usage, or interaction polish in existing screens

Do not use `ui-ux-pro-max` to:

- override story scope, placeholder ownership, or modular monolith boundaries
- replace product, auth, authorization, or business-rule decisions with visual speculation
- turn intentionally thin starter pages into fully realized experiences unless the owning story or the user explicitly asks for that

Preferred workflow:

1. Start with the project requirements, current story scope, and existing route ownership.
2. When doing UI work, check `design-system/trackpasok/MASTER.md` and any relevant file under `design-system/trackpasok/pages/` before using `ui-ux-pro-max`. Treat those local design-system files as project authority.
3. If additional UI direction is needed, generate design guidance with the installed skill before editing code.
4. Apply the resulting guidance in a way that preserves existing architecture, accessibility, and server-first patterns.
5. Verify the rendered result with checked-in Playwright coverage when appropriate, and use `playwright-cli` or `next-browser` for interactive debugging as needed.
6. Run the relevant project checks such as `pnpm lint`, `pnpm typecheck`, `pnpm check:env`, and `pnpm build` when the task calls for them.

When using `ui-ux-pro-max` in this repo, prefer outcomes that feel professional, clear, and school-appropriate over flashy marketing aesthetics. Keep admin, teacher, and student surfaces distinct, and avoid over-designing placeholder routes.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **Attendance-Monitor** (1106 symbols, 2999 relationships, 82 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/Attendance-Monitor/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/Attendance-Monitor/context` | Codebase overview, check index freshness |
| `gitnexus://repo/Attendance-Monitor/clusters` | All functional areas |
| `gitnexus://repo/Attendance-Monitor/processes` | All execution flows |
| `gitnexus://repo/Attendance-Monitor/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |
| Work in the Services area (176 symbols) | `.claude/skills/generated/services/SKILL.md` |
| Work in the Components area (75 symbols) | `.claude/skills/generated/components/SKILL.md` |
| Work in the Queries area (70 symbols) | `.claude/skills/generated/queries/SKILL.md` |
| Work in the Admin area (53 symbols) | `.claude/skills/generated/admin/SKILL.md` |
| Work in the Policies area (20 symbols) | `.claude/skills/generated/policies/SKILL.md` |
| Work in the Dev area (9 symbols) | `.claude/skills/generated/dev/SKILL.md` |
| Work in the (public) area (9 symbols) | `.claude/skills/generated/public/SKILL.md` |
| Work in the Scripts area (8 symbols) | `.claude/skills/generated/scripts/SKILL.md` |
| Work in the Supabase area (8 symbols) | `.claude/skills/generated/supabase/SKILL.md` |
| Work in the Teachers area (6 symbols) | `.claude/skills/generated/teachers/SKILL.md` |
| Work in the Subjects area (6 symbols) | `.claude/skills/generated/subjects/SKILL.md` |
| Work in the Students area (6 symbols) | `.claude/skills/generated/students/SKILL.md` |
| Work in the Sections area (6 symbols) | `.claude/skills/generated/sections/SKILL.md` |
| Work in the Schedules area (6 symbols) | `.claude/skills/generated/schedules/SKILL.md` |
| Work in the Class-assignments area (6 symbols) | `.claude/skills/generated/class-assignments/SKILL.md` |
| Work in the Cluster_10 area (4 symbols) | `.claude/skills/generated/cluster-10/SKILL.md` |

<!-- gitnexus:end -->
