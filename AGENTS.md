## Stack Baseline

- This repo is a React + TypeScript single-page app built with Vite. Do not assume Next.js, App Router, or server components.
- Keep the frontend SPA-first and anchor-navigation oriented unless the architecture is explicitly updated.
- Use `pnpm` for project commands.
- Keep shadcn/ui primitives in `src/components/ui` and feature composites in feature-owned folders.
- Keep browser-facing code in `src/` and privileged retrieval, ingestion, citation packaging, and service-role logic in `supabase/functions/`.

## Project Structure Rules

- Organize frontend code by feature boundary first under `src/components/`: `layout`, `sections`, `modules`, `chat`, `references`, `ui`.
- Keep source content definitions in `src/data`, shared helpers in `src/lib`, hooks in `src/hooks`, contexts in `src/contexts`, and shared types in `src/types`.
- Store migrations only in `supabase/migrations`.
- Store Edge Functions only under `supabase/functions/<function-name>/index.ts`.
- Store shared server-only function helpers under `supabase/functions/_shared`.
- Keep static assets under `public/` and isolate heavy media or 3D assets so they can be lazy-loaded.
- Store checked-in Playwright E2E specs under `tests/e2e`.
- Store shared Playwright fixtures, mocks, and support utilities under `tests/playwright`.
- Create `tests/playwright` the first time shared Playwright support code is needed; do not scatter those helpers across feature folders.

## Verification

- Default project checks are `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
- Default backend Python checks are `pnpm backend:lint`, `pnpm backend:typecheck`, `pnpm backend:security`, `pnpm backend:test`, and `pnpm backend:check`.
- When formatting-sensitive TypeScript or TSX changes land, also run `pnpm format`.
- When formatting-sensitive Python changes land, also run `pnpm backend:format`.
- Do not assume `pnpm format` covers Markdown, JSON, YAML, CSS, or other non-TS assets unless the script is expanded to include them.
- Do not assume `pnpm backend:format` covers frontend files or non-Python assets.
- For scaffold or infrastructure changes, also verify the app boots locally with `pnpm dev` when the task calls for runtime confirmation.
- Use `pnpm test:unit` for frontend Vitest coverage under `src/`.
- Use `pnpm test:functions` for Supabase Edge Function Vitest coverage under `supabase/functions/tests`.
- Use `pnpm backend:lint` for Python Ruff linting under `backend/`.
- Use `pnpm backend:typecheck` for Python MyPy type checking under `backend/`.
- Use `pnpm backend:security` for Python dependency vulnerability scanning against `backend/requirements.txt`.
- Use `pnpm backend:test` for Django and backend pytest coverage under `backend/tests`.
- Use `pnpm backend:check` for Django framework and configuration validation.
- The repo-managed Vitest scope is frontend unit and component tests under `src/**/*.test.ts` and `src/**/*.test.tsx`; checked-in Playwright specs under `tests/e2e` must stay excluded from plain `pnpm exec vitest run`.
- Keep frontend unit and component tests co-located as `*.test.ts` or `*.test.tsx`.
- Keep Supabase Edge Function tests under `supabase/functions/tests`.
- Keep Django backend tests under `backend/tests`.
- Do not invent Next.js-specific verification steps for this repo.
- Use `pnpm test:e2e` as the default fast Playwright suite; it excludes live chat backend checks and keeps chat requests mocked where the spec intends UI-only coverage.
- Use `pnpm test:chat:live` when work touches the `/functions/v1/chat` endpoint, the `supabase/functions/chat` Edge Function, grounding rules, section scoping, chat request wiring, or local Supabase integration. This workflow expects a real local chat backend, typically started with `pnpm supabase:dev`.
- Use `pnpm test:e2e:all` only when you intentionally want both the mocked Playwright suite and the tagged live chat coverage in one run.
- Use `pnpm test:e2e:mocked` when you intentionally want the full mocked Playwright suite without live chat coverage.
- Use `pnpm test:e2e:journey` for the slower mocked browser flows tagged `@journey`.
- Use `pnpm test:e2e:layout` for optional mocked browser coverage tagged `@layout`, including responsive, focus, and containment sweeps.
- Keep Playwright intent tags explicit: use `@smoke` for the default fast lane, `@journey` for slower mocked multi-step flows, `@layout` for optional browser-only layout or accessibility sweeps, and `@chat-live` for real local chat backend coverage.
- When a page-level Playwright file grows broad, split specs by intent instead of collecting everything in one mega-spec. Keep default-lane smoke checks in a dedicated `@smoke` file and move slower journey or layout coverage into separate tagged files.

### Test Layer Strategy

- Prefer the fastest test layer that can prove the behavior with confidence.
- Use `pnpm test:unit` for frontend rendering logic, local state transitions, parser or adapter behavior, session-local UI behavior, and accessibility semantics that do not require a full browser workflow.
- Use `pnpm test:functions` for Supabase Edge Function request validation, response envelopes, grounding rules, refusal, weak-support, and cooldown contracts, retrieval parity, and public-chat protection logic.
- Use `pnpm backend:test` for Django route guards, admin auth, permission checks, request validation, and backend response envelopes for maintainer workflows.
- Use `pnpm test:e2e` for a small mocked browser journey layer. Do not use default Playwright coverage as the primary layer for business-rule matrices, contract validation, or repeated breakpoint sweeps when faster layers can cover the same behavior.
- Use `pnpm test:chat:live` for a minimal live-chat canary layer that proves real endpoint wiring and a small number of critical user-visible states.
- If slower mocked browser coverage is still needed for layout, responsive, or broader accessibility sweeps, tag it separately and keep it out of the default `pnpm test:e2e` lane.
- When a Playwright test grows into rule matrices, repeated viewport loops, or deep state validation, move that coverage into Vitest or pytest and keep only the browser-confidence portion in E2E.
- Keep `tests/playwright` helpers browser-specific. Shared non-browser test fixtures or case tables should live under a neutral top-level `tests/` support area.

### Verification Selection

- For narrow frontend logic or UI-state changes, start with `pnpm test:unit`.
- For Supabase Function or chat-contract changes, start with `pnpm test:functions` and add `pnpm test:chat:live` only when the real `/functions/v1/chat` path or local integration is affected.
- For Django-only maintainer or backend changes, start with `pnpm backend:test` and add the other backend Python checks when the change touches auth, configuration, or shared backend utilities.
- For browser journey, navigation, or mocked chat-surface changes, use `pnpm test:e2e`.
- Reserve `pnpm test:e2e:all` for intentional full browser validation, release rehearsal, or work that spans both mocked and live browser coverage.

### Unit and Component Testing

- Vitest is the repo-managed baseline for frontend unit and component testing in this project.
- Plain `pnpm exec vitest run` should be safe for this repo and must not attempt to execute Playwright specs from `tests/e2e`.
- When a story explicitly requires checked-in unit or component tests, use the repo-managed Vitest baseline and keep tests co-located as `*.test.ts` or `*.test.tsx`.
- Use unit or component tests for isolated behavior, rendering logic, state handling, data shaping, and boundary conditions that do not require a full browser workflow.
- Do not default every story to unit-test generation; add checked-in unit or component tests when the story scope, acceptance criteria, changed logic, or regression risk clearly justify them.
- If shared unit-test helpers or setup utilities are needed, keep them in a dedicated top-level testing support area under `tests/`.

## UI and Product Guardrails

- Preserve reduced-motion behavior, keyboard access, and visible fallback states across interactive sections.
- Keep the core learning flow usable even when chat, premium visuals, or showcase scenes fail.
- Do not add React Router, a global store, or a public maintainer dashboard in the MVP unless the architecture is explicitly updated.
- Keep chat presentation components free of privileged retrieval or data-mutation logic.
- Treat off-topic refusal, weak-support, and cooldown states as typed successful responses, not transport failures.

## Git Workflow

- Use branch names that describe the story or intent, not temporary worktree state.
- Preferred story branch pattern: `codex/story-<epic>-<story>-<short-slug>`.
- For story implementation, continuation, review fixes, and push handoff, the agent must work on the corresponding story branch for that story and must not reuse a different story branch just because it is already checked out.
- If the current branch does not match the story being worked on, the agent must create or switch to the correct story branch before committing, pushing, or opening a pull request.
- Preferred non-story branch pattern: `codex/<type>/<short-slug>`.

## Push Handoff

- On every successful `git push`, the agent must include a `PR Summary` in the final user-facing response.
- Treat the `PR Summary` as required even when no pull request has been opened yet.
- Keep the `PR Summary` short and practical: what changed, why it changed, and any key verification or follow-up notes the reviewer should know.
- On every successful `git push`, if `gh` is available and authenticated for the repository remote, the agent must use `gh` to create a pull request for the current branch unless an open pull request already exists for that branch.
- When the agent creates a pull request with `gh`, it must include the prepared title and body at creation time rather than relying on GitHub to infer or autofill them.
- If an open pull request for the current branch already exists, the agent must use `gh` to retrieve it instead of creating a duplicate.
- On every successful `git push`, when a pull request exists or is created, the agent must include the pull request link in the final user-facing response.
- On every successful `git push`, the agent must also include a paste-ready pull request description when a PR has not already been created through a tool that fills the PR body.
- Do not assume GitHub's compare page will auto-populate the PR description from the chat response. Unless the repo has a PR template or the agent opened the PR with a tool that set the body, provide the user with ready-to-paste PR body text in the final response.
- When creating a pull request with `gh` from PowerShell, do not pass multiline PR bodies as a single quoted string with escaped `\n` sequences.
- Prefer `gh pr create --body-file <path>` or a PowerShell here-string so GitHub receives real newlines and renders the markdown correctly.
- After creating a pull request, the agent must verify the rendered PR body. If the formatting is broken, the agent must fix the PR body before reporting completion to the user.
- If `gh` is unavailable, unauthenticated, lacks repo permission, or pull request creation fails for any reason, the agent must say so clearly in the final response and still provide the `PR Summary` plus a paste-ready PR title and description.

### Playwright Browser Install Policy

- Playwright is the repo-managed baseline for checked-in end-to-end automation in this project.
- Do **not** run `pnpm exec playwright install chromium` by default.
- First verify browser availability with:
  - `pnpm exec playwright install --dry-run` (check existing install location), or
  - a real launch check (for example `require("playwright").chromium.launch(...)`).
- Only install Chromium when those checks show it is missing or not launchable.

### Playwright CLI Workflow

- If `playwright-cli` is available in the local environment, use it as the primary interactive browser verification tool before authoring or refreshing checked-in E2E scripts.
- Prefer a named session per task, for example `playwright-cli -s=attendance ...`, so repeated commands target the same browser session.
- When an agent needs to understand the current UI structure, prefer `playwright-cli snapshot` because it captures the page state and interactive element refs in an agent-friendly form.
- When an agent needs to understand the actual visual appearance of the UI, use `playwright-cli screenshot` to capture the rendered page or a specific element.
- When both structure and appearance matter, use both in the same named session: take a `snapshot` first for navigation and targeting, then take a `screenshot` for visual review.
- Typical visual inspection flow:
  - `playwright-cli -s=ui-check open http://localhost:5173`
  - `playwright-cli -s=ui-check snapshot --filename=ui-check.yaml`
  - `playwright-cli -s=ui-check screenshot --filename=ui-check.png`
- Element-level inspection is allowed when only part of the interface matters, for example `playwright-cli -s=ui-check screenshot e5` after capturing a snapshot and identifying the relevant ref.
- Use `state-save` and `state-load` only for local debugging workflows. Do not commit local browser state artifacts.
- Local workflow reference for agent use lives at `.claude/skills/playwright-cli/SKILL.md` with supporting docs under `.claude/skills/playwright-cli/references/`.

### Story E2E Automation

- When a story explicitly requires checked-in E2E automation, use the `bmad-qa-generate-e2e-tests` skill so test generation follows the BMAD QA procedure.
- Use the repo-managed Playwright baseline for those generated E2E tests.
- Save generated Playwright specs under `tests/e2e` and any shared Playwright support code under `tests/playwright`.
- Align generated E2E tests with the project context coverage expectations for accessibility, reduced motion, responsive behavior, and chat fallback, refusal, weak-support, or cooldown states when applicable.
- Keep source-aware chat coverage split intentionally:
  - `pnpm test:e2e` covers mocked UI behavior and interaction states.
  - `pnpm test:chat:live` covers the real local Supabase chat path without mocking the `/functions/v1/chat` endpoint.
- Do not generate checked-in E2E scripts for every story by default; use them when the story scope, acceptance criteria, or verification needs clearly call for end-to-end coverage.

> GitNexus refresh note: if you need to reanalyze or refresh the GitNexus-managed section below, strictly use `gitnexus analyze --force --embeddings --skills` and ignore `npx gitnexus analyze`.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **global-governance-docuweb** (4854 symbols, 5808 relationships, 57 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/global-governance-docuweb/context` | Codebase overview, check index freshness |
| `gitnexus://repo/global-governance-docuweb/clusters` | All functional areas |
| `gitnexus://repo/global-governance-docuweb/processes` | All execution flows |
| `gitnexus://repo/global-governance-docuweb/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
