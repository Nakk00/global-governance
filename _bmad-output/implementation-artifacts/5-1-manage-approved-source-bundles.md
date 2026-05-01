# Story 5.1: Manage Approved Source Bundles

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a maintainer,
I want to define and version the approved source bundle,
so that the chatbot, references, and case evidence stay aligned to one controlled and reviewable set of approved materials.

## Acceptance Criteria

1. Given I prepare an approved source set, when I inspect the bundle manifest, then I can see a single versioned approved-source snapshot with a stable bundle id, explicit bundle version, immutable source ids, source types, titles, usage scope, and typed presentation/chat/evidence metadata adapters, and it reads as a reviewable contract rather than an ad hoc list.
2. Given I update an approved source entry, when I diff the bundle, then I can see exactly what changed in bundle membership, metadata, usage scope, deprecation state, aliases, or version before later ingestion or answer generation uses it, and the change is explicit enough to review in git without a dashboard.
3. Given I add, remove, or deprecate a source, when I inspect the active bundle, then unsupported materials are excluded from the approved set, deprecated materials have an explicit lifecycle rule, removed materials fail loudly or resolve through an approved alias path, and the version change is visible instead of silently changing the knowledge base.
4. Given the conclusion references, chat citations, and dossier evidence all point to approved materials, when I inspect the bundle-backed ids, then they resolve to the same canonical source inventory and shared schema contract instead of drifting into separate ad hoc lists.
5. Given I refine approved materials, when I update the bundle, then I can do so without redesigning the site structure or exposing a public maintainer UI, and the bundle remains repo-managed.
6. Given I hand this bundle to the next ingestion story, when I inspect the manifest, then the presentation-facing and ingestion-ready boundaries, version bump rules, deterministic ordering, and server-consumption path are clear enough that later source preparation can reuse the same approved inventory without reinterpreting the contract.

## Tasks / Subtasks

- [x] Create the canonical approved-source bundle manifest (AC: 1, 3, 4, 6)
  - [x] Add a new bundle file under `src/data/source-bundles/` that exports the active approved-source snapshot, stable bundle id, explicit bundle version, normalized source inventory, and deterministic ordering.
  - [x] Record the current approved materials in one place, including the chapter references, chat grounding sources, and dossier evidence sources that are currently duplicated across feature files.
  - [x] Define the canonical bundle shape explicitly: one shared source record plus typed adapters for conclusion references, chat citations, and dossier evidence so consumers do not recreate hand-maintained variants.
  - [x] Make the presentation-facing vs ingestion-ready boundary explicit in the manifest so Story 5.2 can consume it without guessing.
  - [x] Document id immutability, deprecation handling, alias behavior, and version bump rules in or beside the manifest so future changes are reviewable and deterministic.
  - [x] Keep the bundle reviewable in plain git diff form with stable key and array ordering; no dashboard or runtime editor.

- [x] Align the current source consumers to the bundle contract within this story's approved runtime scope (AC: 1, 2, 4)
  - [x] Update `src/data/sections/conclusion-content.ts` so the visible references stay aligned with the canonical approved-source inventory.
  - [x] Update `src/data/sections/west-philippine-sea-dossier.ts` so evidence ids and metadata stay aligned with the same approved inventory.
  - [x] Update `src/lib/chat/grounded-answer.ts` and `supabase/functions/_shared/chat-grounding.ts` so chat citations resolve from the same canonical source ids instead of a second hand-maintained list.
  - [x] Update both direct retrieval callers, `supabase/functions/chat/index.ts` and `supabase/functions/chat-retrieve/index.ts`, if the retrieval contract or source mirror changes.
  - [x] If a server-side mirror is needed, keep it in `supabase/functions/_shared` and define one explicit consumption path for it: import, generated artifact, or thin derived helper from the canonical bundle, rather than creating a second source list by hand.
  - [x] Preserve the current learner-facing copy, fallback states, and section flow while refactoring the source inventory.

- [x] Add bundle guardrail tests (AC: 1-4, 6)
  - [x] Add a co-located unit test for the bundle manifest that asserts version presence, stable ids, deterministic ordering, source counts, deprecation or alias rules, and scope coverage.
  - [x] Extend `src/data/sections/conclusion-content.test.ts`, `src/data/sections/west-philippine-sea-dossier.test.ts`, and `src/lib/chat/grounded-answer.test.ts` so they fail if the approved-source inventory drifts.
  - [x] Extend `supabase/functions/tests/chat.test.ts` when the server-side source inventory, retrieval contract, or chat retrieval callers change; this coverage is required if a mirror or caller behavior is touched.
  - [x] Prefer explicit assertions on ids, counts, and bundle version over snapshot tests.

- [x] Document the maintainer review path (AC: 2, 5, 6)
  - [x] Add concise notes in the bundle file or a named companion doc that explain how to inspect the bundle diff before future ingestion or answer changes.
  - [x] State clearly that the bundle is repo-managed and reviewable, not a public maintainer dashboard.
  - [x] Keep the note short enough that it can be reviewed in the same diff as the source inventory itself, and place it where future maintainers can find it without scanning unrelated story files.

## Dev Notes

### Current State

- Approved source metadata is duplicated across multiple files instead of living in one canonical bundle contract.
- `src/data/sections/conclusion-content.ts` currently owns three approved reference entries with `gg-src-*` ids.
- `src/lib/chat/grounded-answer.ts` and `supabase/functions/_shared/chat-grounding.ts` currently own a separate approved-source inventory for chat with `gg-src-*` ids and their own section scoping rules.
- `src/data/sections/west-philippine-sea-dossier.ts` owns a separate evidence registry with `wps-src-*` ids for timeline and comparison support.
- `supabase/functions/chat/index.ts` and `supabase/functions/chat-retrieve/index.ts` both call `retrieveApprovedSources`, so source inventory changes affect more than one Edge Function path.
- The current consumer surfaces do not share one metadata shape: conclusion references, chat citations, and dossier evidence each need different fields, so the canonical bundle must define a shared core record plus typed adapters instead of pretending one raw object will fit every consumer.
- There is no canonical bundle manifest or version field yet, and there are no ingestion functions yet, so this story should stop at the approved-source contract and review path.

### Source Inventory Today

- Conclusion references: `gg-src-un-charter-institutions`, `gg-src-south-china-sea-award`, `gg-src-sustainable-development-report`
- Chat grounding sources: `gg-src-un-charter-institutions`, `gg-src-global-governance-course-frame`, `gg-src-wps-arbitral-ruling`
- WPS evidence ids: `wps-src-2012-scarborough`, `wps-src-2013-arbitration-filing`, `wps-src-2016-tribunal-award`, `wps-src-post-2016-compliance`, `wps-src-comparison-enforcement-gap`, `wps-src-comparison-political-reality`

### Scope Boundaries

- Keep this story on source governance and bundle contract only.
- Runtime consumer alignment is in scope only where it is necessary to prove the bundle contract works end to end for the existing approved-source consumers already in the repo.
- Do not implement ingestion, vector search, reranking, or a public maintainer UI here.
- Do not change learner-facing navigation, section order, or chat copy unless it is needed to keep the source inventory aligned.
- Do not move browser-only content into privileged code or expose service-role behavior to the browser.
- Keep the core experience usable even if later source preparation is incomplete; this story is about control and reviewability, not new user-facing surfaces.
- If a server-side mirror becomes necessary, keep it in `supabase/functions/_shared` and derive it from the canonical bundle through one explicit contract path instead of hand-maintaining a second inventory.

### Architecture Guardrails

- The bundle should be versioned and reviewable in git, not hidden behind dashboard state.
- Repo-managed content defines what is approved; Supabase Storage and Postgres are for later ingestion and retrieval, not for browser-side editing.
- Follow the browser/server split from the architecture: browser code formats and renders, while Edge Functions own privileged orchestration.
- Source ids are contract identifiers once published in the approved bundle; changing them requires an explicit alias or migration path rather than silent replacement.
- Version changes must be deterministic and reviewable: membership, metadata, scope, alias, and deprecation changes all need an explicit bump rule recorded in the contract notes.
- Private Supabase Storage buckets use RLS-backed access control by default, and service keys must stay server-side.
- If future bundle access needs server helpers, reuse `supabase/functions/_shared` instead of creating cross-function dependencies.

### Testing Standards Summary

- Add a co-located unit test for the bundle manifest so the active source set, version, id stability, deterministic ordering, and lifecycle rules are checked in one place.
- Extend the existing conclusion, dossier, and chat contract tests so they fail if the bundle-backed source inventory drifts.
- Keep tests exact on ids, version, and counts; avoid snapshots for the bundle contract.
- If a server-side mirror is added or the retrieval callers change, add or extend the Edge Function tests to cover the mirrored source inventory path and both retrieval entry points.

### Latest Tech Notes

- Supabase Edge Functions are TypeScript/Deno functions and the docs recommend keeping reusable helpers in `supabase/functions/_shared` while using the Supabase CLI for local parity.
- Supabase Storage buckets are public or private; private buckets use RLS-backed access control, and signed URLs are the supported way to share private files for a limited time.
- RLS must be enabled on exposed schemas, and Supabase service keys should never be exposed to the browser.

### Project Structure Notes

- Likely new: `src/data/source-bundles/approved-source-bundle.ts`
- Likely new: `src/data/source-bundles/approved-source-bundle.test.ts`
- Likely new: `src/types/approved-source-bundle.ts` or another explicitly shared contract file if the bundle schema needs reuse across browser and server code.
- Likely update: `src/data/sections/conclusion-content.ts`
- Likely update: `src/data/sections/west-philippine-sea-dossier.ts`
- Likely update: `src/lib/chat/grounded-answer.ts`
- Likely update: `supabase/functions/_shared/chat-grounding.ts`
- Likely update: `supabase/functions/chat/index.ts`
- Likely update: `supabase/functions/chat-retrieve/index.ts`
- Likely update: `supabase/functions/tests/chat.test.ts`
- If the server mirror needs a thin helper, keep it in `supabase/functions/_shared` and derive it from the same canonical bundle.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 5: Content Stewardship and Demo Reliability, Story 5.1: Manage Approved Source Bundles]
- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 5: Story 5.2 and Story 5.3 for ingestion and boundary validation sequencing]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR35-FR40, FR42, NFR12, NFR16, NFR22, NFR24]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, Source Credibility and Academic Trust, Data Architecture, API & Communication Patterns, Architectural Boundaries, File Organization Patterns]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, Source-Aware Chat Panel, Reference Evidence Drawer, Feedback Patterns, Accessibility Strategy]
- [Source: `_bmad-output/project-context.md`, source discipline, server-side retrieval, maintainer-only workflows, and browser/server split]
- [Source: `_bmad-output/implementation-artifacts/epic-4-retro-2026-05-01.md`, Epic 5 preview and readiness focus]
- [Source: `src/data/sections/conclusion-content.ts`, current visible reference inventory]
- [Source: `src/data/sections/west-philippine-sea-dossier.ts`, current WPS evidence registry]
- [Source: `src/lib/chat/grounded-answer.ts`, current chat-approved source inventory]
- [Source: `supabase/functions/_shared/chat-grounding.ts`, current server-approved source inventory]
- [Source: `supabase/functions/chat/index.ts`, current grounded chat caller]
- [Source: `supabase/functions/chat-retrieve/index.ts`, current approved-source retrieval caller]
- [Source: `supabase/functions/tests/chat.test.ts`, current retrieval and protection coverage]
- [Source: https://supabase.com/docs/guides/functions, Edge Functions overview]
- [Source: https://supabase.com/docs/guides/getting-started/ai-prompts/edge-functions, shared helper guidance for Edge Functions]
- [Source: https://supabase.com/docs/guides/storage/buckets/fundamentals, bucket access model overview]
- [Source: https://supabase.com/docs/guides/storage/security/access-control, storage object RLS policies]
- [Source: https://supabase.com/docs/guides/database/postgres/row-level-security, RLS and service-key boundary guidance]
- [Source: https://supabase.com/docs/guides/storage/serving/downloads, signed URL guidance for private files]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-05-01: Resolved the create-story customization fallback manually because `python3` was unavailable in this environment.
- 2026-05-01: Loaded project context, sprint tracking, Epic 4 retro, PRD, architecture, UX, current source-related data files, current chat helpers, current dossier evidence, and the official Supabase docs for Edge Functions, Storage, access control, RLS, and signed URLs.
- 2026-05-01: GitNexus impact analysis on `retrieveApprovedSources` returned LOW risk with two direct callers: `supabase/functions/chat/index.ts` and `supabase/functions/chat-retrieve/index.ts`.
- 2026-05-01: The current repo duplicates approved-source metadata across visible references, chat grounding, and dossier evidence, so Story 5.1 should lock a canonical bundle before ingestion work starts.
- 2026-05-01: GitNexus impact analysis before implementation returned LOW risk for `conclusionContent`, `wpsEvidenceRegistry`, `retrieveApprovedSources`, `assembleGroundedChatResponse`, and `parseCitation`.
- 2026-05-01: Implemented the active approved-source bundle, aligned conclusion, dossier, frontend citation parsing, and server chat grounding to the canonical ids, then ran `pnpm test:unit`, `pnpm test:functions`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
- 2026-05-01: `gitnexus_detect_changes(scope: all)` reported medium risk because the worktree contains unrelated pre-existing changes; the Story 5.1 changed symbols were limited to source bundle consumers and chat citation parsing.

### Completion Notes List

- Ready for implementation.
- The approved-source bundle should be the first canonical reviewable contract before any ingestion or validation story expands the source set.
- Review follow-up patched on 2026-05-01: clarified canonical bundle shape, version and lifecycle rules, retrieval-caller scope, deterministic diff expectations, and server-consumption guidance before implementation starts.
- Implemented `global-governance-approved-sources` version `2026.05.01` as the canonical repo-managed source bundle with active source records, aliases for legacy WPS/chat ids, lifecycle rules, typed adapters, and explicit presentation vs ingestion boundaries.
- Refactored conclusion references, WPS dossier evidence, frontend chat citation parsing, and server chat retrieval helpers to resolve through the same canonical approved-source ids without changing learner-facing copy or section flow.
- Added guardrail coverage for bundle identity, ordering, scope coverage, alias behavior, consumer drift, and the server-side bundle mirror.
- Verification passed: `pnpm test:unit`, `pnpm test:functions`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`.

### File List

- _bmad-output/implementation-artifacts/5-1-manage-approved-source-bundles.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src/data/source-bundles/approved-source-bundle.ts
- src/data/source-bundles/approved-source-bundle.test.ts
- src/data/sections/conclusion-content.ts
- src/data/sections/conclusion-content.test.ts
- src/data/sections/west-philippine-sea-dossier.ts
- src/data/sections/west-philippine-sea-dossier.test.ts
- src/lib/chat/grounded-answer.ts
- src/lib/chat/grounded-answer.test.ts
- supabase/functions/_shared/approved-source-bundle.ts
- supabase/functions/_shared/chat-grounding.ts
- supabase/functions/tests/chat.test.ts

### Change Log

- 2026-05-01: Added canonical approved-source bundle and aligned current source consumers to it.
- 2026-05-01: Added frontend and Edge Function guardrail tests for bundle drift, alias resolution, and server mirror consumption.
- 2026-05-01: Marked Story 5.1 ready for review after full verification passed.

### Review Findings

- [x] [Review][Patch] Update WPS E2E assertions to canonical ids [tests/e2e/home.spec.ts:1388]

## Story Completion Status

- review
- Ultimate context engine analysis completed - comprehensive developer guide created
