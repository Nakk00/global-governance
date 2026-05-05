# Story 5.6b: Inspect Retrieval Chunks and Citations

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a maintainer,
I want to inspect retrieval chunks and citations generated from approved source versions,
so that I can verify what the chatbot can retrieve and cite before demo.

## Acceptance Criteria

1. Given I inspect a source with one or more ingestion-backed document revisions, when I open the chunk view, then the inspector defaults to the latest successful document revision for that source and clearly shows the `documentId` and `version` anchor being inspected, and I can review chunk identifiers, ordering, page or heading context when available, token or size cues, embedding-backed status, active state, and text previews without direct database access.
2. Given I inspect citation support for a source, when I open the citation view, then I can review citation identifiers, canonical citation labels, document or version linkage, page or section context when available, linked chunk references, and active state, and I can tell what label the chatbot will show to learners from the same canonical display field the learner-facing chat uses.
3. Given chunk or citation records are missing, partial, stale, inactive, or not yet ingestion-ready, when I review the inspection surfaces, then the UI shows clear empty, partial-data, stale, inactive, or degraded-state messaging with the correct next-step guidance, and the maintainer can distinguish absence of support from a generic loading failure or auth outage.
4. Given I open a chunk or citation detail on desktop, tablet, or keyboard-only navigation, when the layout adapts, then the tables, previews, filters, and detail surfaces remain readable, focusable, and responsive without horizontal scrolling or motion dependence, and Drawer or Dialog dismissal preserves Escape handling and focus return to the triggering row.
5. Given a source has not been ingested successfully yet, when I inspect the source, then I still see a source-level explanation of what is missing and a safe next step such as ingest or re-ingest guidance rather than a blank inspection pane, and the guidance reflects the current lifecycle state such as `draft`, `approved`, `disabled`, or `archived`.
6. Given I drill into a chunk or citation row, when I open its detail surface, then I can inspect the focused metadata, linked records, and copyable text or label without losing the parent table state, and I can move between linked chunk and citation evidence without reloading the entire dashboard.

## Tasks / Subtasks

- [x] Extend stewardship read contracts for chunks and citations (AC: 1, 2, 3, 5, 6)
  - [x] Extend `backend/sources/dtos.py` with explicit chunk, citation, and inspection-state DTOs so the browser contract stays typed and stable.
  - [x] Extend `backend/sources/repository.py` and both repository implementations to query the existing `documents`, `chunks`, `references`, and `reference_chunks` tables.
  - [x] Add read-only routes under `backend/sources/urls.py` and `backend/sources/views.py` for `GET /api/admin/sources/{sourceId}/chunks`, `GET /api/admin/sources/{sourceId}/citations`, `GET /api/admin/chunks/{chunkId}`, and `GET /api/admin/citations/{citationId}`.
  - [x] Reuse the existing admin auth gate and safe-envelope helpers; return user-safe `401`, `403`, `404`, `5xx`, and empty-state payloads rather than raw errors, and keep chunk or citation reads aligned with the maintainer shell's signed-out, unauthorized, revoked-session, and retryable-outage states.
  - [x] Derive active, embedded, stale, and partial states from the existing ingestion records; use the latest successful `documents` row as the default version anchor and do not invent a parallel `source_versions` schema unless a missing field truly forces it.
  - [x] Define the DTO field contract explicitly: chunk list and detail include `id`, `documentId`, `sourceId`, `chunkIndex`, `tokenCount`, `contentPreview` or `content`, `embeddingPresent`, `activeState`, and page or heading metadata when available; citation list and detail include `id`, `documentId`, canonical `citationLabel`, learner-visible `displayLabel`, linked chunk ids, active state, and page or section metadata when available.
  - [x] Define one canonical state vocabulary for the browser contract: `empty`, `partial`, `stale`, `inactive`, `ready`, and `unavailable`, with stable rules for when the API returns an empty `200` payload, a safe `404`, or a retryable outage envelope.
  - [x] Surface incomplete context honestly when page, heading, or display-label data is unavailable instead of fabricating it, and keep label fallback precedence explicit so admin and learner views cannot drift.

- [x] Extend the maintainer API and dashboard inspector surface (AC: 1, 2, 3, 4, 5, 6)
  - [x] Add `fetchSourceChunks`, `fetchSourceCitations`, `fetchChunkDetail`, and `fetchCitationDetail` helpers in `src/lib/maintainer/api.ts`, keeping the same safe envelope parsing and 401/403 session clearing already used by the existing read helpers.
  - [x] Extend `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` so the selected source can switch between overview, chunks, citations, and history without breaking the existing mutation flow from Story 5.6a.
  - [x] Use `Table` for chunk/citation lists, `Tabs` or an equivalent segmented switch for view changes, and `Drawer` on narrow screens plus `Dialog` on wider screens for record detail, with a compact-column mode on narrow widths so the table never requires horizontal scrolling.
  - [x] Keep chunk/citation inspection lazy-loaded and read-only; do not pull validation-run work into this story, and guard late async responses so a slow chunk or citation request cannot paint stale data into a newly selected source.
  - [x] Add filters, stable ordering, and row-limiting or pagination expectations for chunk and citation tables so large sources remain inspectable.
  - [x] Add empty, partial, stale, inactive, and retry states that explain whether support is missing, inactive, not yet ingested, or simply unavailable.
  - [x] Add copy affordances and linked-record navigation in the detail surface so maintainers can copy chunk text or citation labels and move between linked chunk and citation evidence without losing context.
  - [x] Preserve the current source-selection and mutation state machine so the new inspection UI feels additive, not like a second dashboard.

- [x] Add regression coverage (AC: 1, 2, 3, 4, 5, 6)
  - [x] Add backend tests in `backend/tests/test_admin_stewardship.py` for chunk/citation happy paths, missing or empty data, multi-version default selection, auth failures, and safe 404/503 envelopes.
  - [x] Extend `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` for tab switching, row selection, detail overlays, copy actions, linked-record navigation, async stale-response guards, and accessible fallback states.
  - [x] Extend `tests/e2e/maintainer.spec.ts` with a source-selection flow that opens chunk and citation inspection, preserves the private boundary, and verifies narrow-screen containment without horizontal scroll.
  - [x] Keep shared browser helpers under `tests/playwright/` only if a reusable maintainer fixture becomes necessary.

- [x] Keep scope tight
  - [x] Do not add validation-run UI, validation-result history, or any new source mutation path.
  - [x] Do not add React Router or public navigation links.
  - [x] Do not expose privileged retrieval, citation packaging, or storage access directly from browser code.

## Dev Notes

### Current State

- `src/App.tsx` already branches `/maintainer` to `MaintainerDashboard`; the private route is isolated from the learner SPA.
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx` already owns the admin gate, source selection, source detail, mutation state, and operational records.
- `src/lib/maintainer/api.ts` already handles safe envelope parsing, unreadable-response fallback, and session clearing on `401`/`403`.
- `backend/sources/views.py` and `backend/sources/urls.py` currently expose dashboard, detail, ingestion, validation, audit, and mutation routes only; chunk/citation inspection routes do not exist yet.
- `backend/sources/repository.py` currently builds the stewardship projection from `source_records`, `source_ingest_jobs`, `source_audit_events`, and `source_validation_runs`.
- The ingestion schema already exists in `supabase/migrations/0001_create_ingestion_documents.sql` and `supabase/migrations/0002_persist_ingestion_document.sql` as `documents`, `chunks`, `references`, and `reference_chunks`.
- There is no dedicated `source_versions` table in the current repo; use the existing document/version record as the version anchor and surface missing fields honestly.
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx` and `tests/e2e/maintainer.spec.ts` already cover the gate and mutation basics and are the natural expansion points for inspection coverage.

### Story Focus

- Build read-only chunk and citation inspection for the existing private dashboard.
- Keep the admin gate and the Story 5.6a mutation surface unchanged.
- Show what the chatbot can retrieve and cite before demo, using the actual ingestion-backed retrieval records.
- Keep inspection lazy-loaded so the dashboard stays responsive.

### Scope Boundaries

- No validation runner or validation history expansion.
- No chunk editing, citation editing, or delete/disable actions.
- No learner-facing route changes, no public navbar links, and no React Router.
- No direct browser writes to Supabase Storage or database tables.
- No general CMS, analytics portal, or simulator controls.
- No replacement of the existing maintainer auth boundary.

### Architecture Guardrails

- Browser-facing code in `src/` only consumes JSON DTOs and parses safe envelopes.
- Privileged reads stay in Django under the `api/admin/` namespace.
- Keep the chunk/citation viewer inside the existing `/maintainer` SPA branch.
- Use the latest successful `documents` row for the selected source as the default inspection anchor, and expose its `documentId` and `version` explicitly in the admin contract.
- Derive active state from the current source lifecycle and latest successful ingest unless a persisted field already exists.
- Derive embedding status from the retrieved chunk row; do not fake it when the embedding is absent.
- Keep citation labels canonical: the inspector should expose both the stored citation label and the learner-visible display label when they differ, with explicit fallback precedence.
- Show partial-data markers for missing page, heading, or display-label context instead of fabricating values.
- Use `Table` for tabular inspection, `Tabs` for view switching, and `Drawer`/`Dialog` for detail surfaces, matching the project's shadcn/ui pattern.
- Preserve reduced-motion behavior, keyboard focus return, and no-horizontal-scroll behavior at 360 px, 768 px, and desktop widths.

### Implementation Contract

#### Version Anchor

- Default chunk and citation inspection to the latest successful ingestion-backed `documents` row for the selected source.
- Expose the active inspection anchor explicitly as `documentId` plus `version`.
- If multiple successful document revisions exist, allow the UI contract to show which revision is being inspected before any future revision-picker work is added.

#### DTO Field Matrix

- Chunk list rows: `id`, `documentId`, `sourceId`, `chunkIndex`, `tokenCount`, `contentPreview`, `embeddingPresent`, `activeState`, optional `pageNumber`, optional `heading`, optional `metadata`.
- Chunk detail: chunk list fields plus full `content`, linked citation ids, copyable text, and stable created or updated timestamps if already available.
- Citation list rows: `id`, `documentId`, `sourceId`, canonical `citationLabel`, learner-visible `displayLabel`, linked chunk ids, `activeState`, optional `pageNumber`, optional `sectionHeading`, optional `metadata`.
- Citation detail: citation list fields plus source title, source path or provenance context when already available, copyable label, and linked chunk summaries.

#### State Rules

- Return a safe empty `200` payload when the selected source exists but the latest successful document revision has no chunk or citation records.
- Return a safe `404` when the source, chunk, or citation id does not exist in the protected stewardship view.
- Return `partial` when the record exists but page, heading, display-label, or embedding context is missing.
- Return `stale` when the source lifecycle or ingest status indicates the inspected evidence no longer reflects the latest approved active state.
- Return `inactive` when the source exists but is not currently retrieval-eligible because of lifecycle state such as `draft`, `disabled`, or `archived`.
- Return `unavailable` only for retryable backend or auth-gate outages, not for ordinary absence of retrieval support.

### Testing Standards Summary

- Backend: chunk/citation success, empty, missing, multi-version default selection, stale or inactive states, auth failures, and safe 404/503 envelopes.
- Frontend unit: chunk/citation lists, row selection, detail overlays, copy and linked-record actions, empty or degraded states, keyboard focus, reduced motion, and stale-response guards for lazy-loaded tabs.
- E2E: direct `/maintainer` load, source selection, chunk/citation inspection, narrow-screen containment, and public boundary still hidden.
- Keep assertions role-based and state-based; avoid screenshot-only checks for this story.

### Implementation Sequence

1. Define DTOs and backend read endpoints.
2. Add API helpers and lazy-load chunk/citation fetches from the dashboard.
3. Add the chunk/citation list, filters, row limits or pagination, and detail surfaces inside the existing maintainer feature boundary.
4. Add unit and backend regression tests.
5. Extend Playwright coverage for the private maintainer inspection flow.

### Previous Story Intelligence

- Story 5.6a introduced the writable stewardship slice and intentionally kept chunk/citation inspection and validation-run evidence out of scope.
- The current dashboard mutation UI already uses the same source selection and detail state machine that 5.6b should extend rather than replace.
- `MaintainerApiError` parsing and the 401/403 session-clearing behavior are already in place and should be reused.
- The prior no-backfill guidance still applies: if the current ingestion data are empty or incomplete, show that clearly instead of inventing history.

### Git Intelligence Summary

- Recent commits `12b9cf0` (`feat: showcase maintainer login motion`) and `cae523f` (`feat: ship admin stewardship and test hardening`) show the private maintainer boundary is actively evolving inside `src/components/modules/MaintainerDashboard`, `src/lib/maintainer/api.ts`, `tests/e2e/maintainer.spec.ts`, and the Django stewardship tests.
- Earlier commits `797d1f6` and `5435731` reinforce the repo pattern of explicit backend auth and staged backend foundations before feature expansion.
- The current worktree is already carrying private maintainer motion and stewardship hardening work, so keep this story additive and scoped to inspection only.

### Latest Tech Notes

- shadcn/ui docs currently cover `Table`, `Tabs`, `Drawer`, and `Dialog`; use `Drawer` for mobile detail and `Dialog` for desktop detail.
- Keep the story aligned with the existing maintainer auth gate and function-component dashboard patterns already established in the repo.

### Project Structure Notes

- `backend/sources/dtos.py`: add explicit chunk, citation, and inspection-state DTOs.
- `backend/sources/repository.py`: join `documents`, `chunks`, `references`, and `reference_chunks`; define version-anchor, state, and label fallback rules.
- `backend/sources/views.py` and `backend/sources/urls.py`: expose protected chunk and citation read endpoints with safe envelopes.
- `src/lib/maintainer/api.ts`: add chunk and citation fetch helpers plus typed state parsing.
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`: add tabs, filtered tables, linked detail overlays, copy actions, and stale-response guards.
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx`, `backend/tests/test_admin_stewardship.py`, and `tests/e2e/maintainer.spec.ts`: extend coverage for version anchoring, state handling, copy actions, and responsive containment.
- Likely no migration unless a missing field or index proves impossible to derive from the existing ingestion tables.

### Review Findings

- [x] [Review][Patch] Pinned the inspection contract to the latest successful `documents` revision and required visible `documentId` plus `version` anchoring so multi-version sources cannot silently resolve to the wrong retrieval snapshot.
- [x] [Review][Patch] Added an explicit DTO field matrix for chunk and citation list and detail views so the backend contract cannot drift into identifier-only rows.
- [x] [Review][Patch] Added one canonical state vocabulary for `empty`, `partial`, `stale`, `inactive`, `ready`, and `unavailable`, with safe-envelope rules for `200`, `404`, and retryable outage cases.
- [x] [Review][Patch] Required canonical citation-label and learner-visible display-label handling so admin inspection matches what the chatbot actually shows.
- [x] [Review][Patch] Added copy actions, linked-record navigation, and focus-return rules for chunk and citation detail overlays.
- [x] [Review][Patch] Added async stale-response guards and narrow-width column-collapse expectations so lazy-loaded inspection views remain correct and responsive under fast source switching.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Story 5.6B and Story 5.6A boundary notes]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR35-FR41, NFR7, NFR12, NFR16, NFR22, and NFR24]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, API & Communication Patterns, Data Architecture, File Organization Patterns, and Testing Rules]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, Responsive Design & Accessibility, Navigation Patterns, and overlay/table patterns]
- [Source: `archive/docs/planning-artifacts/global-governance-admin-side-proposal.md`, sections 8.4-8.7, 9.4, 10.3-10.5, 16, 18, 20, 21, and 23]
- [Source: `_bmad-output/project-context.md`, private maintainer boundary, backend-only privileged logic, SPA-first routing rule, and file organization guidance]
- [Source: `backend/sources/repository.py`, `backend/sources/views.py`, `backend/sources/urls.py`, and `backend/sources/dtos.py`, current stewardship read model]
- [Source: `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`, `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx`, and `src/lib/maintainer/api.ts`, current private dashboard and API helper baseline]
- [Source: `tests/e2e/maintainer.spec.ts` and `backend/tests/test_admin_stewardship.py`, current boundary and stewardship coverage]
- [Source: `supabase/migrations/0001_create_ingestion_documents.sql` and `0002_persist_ingestion_document.sql`, current ingestion documents/chunks/references schema]
- [Source: `supabase/functions/_shared/ingestion-types.ts` and `supabase/functions/_shared/ingestion-pipeline.ts`, current chunk/reference generation contract]
- [Source: https://react.dev/versions, React 19.2 version guidance]
- [Source: https://ui.shadcn.com/docs/components/table, https://ui.shadcn.com/docs/components/tabs, https://ui.shadcn.com/docs/components/base/drawer, and https://ui.shadcn.com/docs/components/dialog, shadcn/ui inspection and overlay primitives]
- [Source: https://supabase.com/docs/guides/auth/passwords and https://supabase.com/docs/client/auth-onauthstatechange, Supabase auth guidance]
- [Source: https://docs.djangoproject.com/en/5.2/topics/http/file-uploads/ and https://docs.djangoproject.com/en/5.2/ref/files/uploads/, Django file-upload and chunked-read guidance]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Resolved the repo-local `bmad-create-story` workflow customization and loaded the project context facts.
- Read sprint tracking, Epic 5, the PRD, architecture, UX spec, project context, Story 5.6, Story 5.6a, the current maintainer dashboard implementation, the stewardship repository, the ingestion schema, and the archived admin-side proposal.
- Sampled the current maintainer test coverage and the recent commit history to keep the story aligned with the current dashboard direction.
- Verified that the current repo already has ingestion-backed `documents`, `chunks`, `references`, and `reference_chunks` tables, so chunk/citation inspection should reuse that model rather than inventing a parallel one.
- No code was changed while writing this story file; this is the implementation guide for Story 5.6b.
- Implemented read-only chunk/citation DTOs, repository contracts, Django routes, and safe-envelope responses for source-level and record-detail inspection.
- Added lazy maintainer dashboard inspection tabs, responsive compact tables, adaptive detail overlays, copy actions, linked chunk/citation navigation, and stale-response guards.
- Added backend, component, and Playwright regression coverage for version anchoring, empty/inactive guidance, linked evidence, copy/detail flows, private-boundary behavior, and narrow-screen containment.
- Ran GitNexus impact checks before modifying repository, view, dashboard, API helper, and boundary-test symbols; direct story blast radius was LOW. `gitnexus detect_changes(scope=all)` reported CRITICAL because the worktree contains pre-existing unrelated AGENTS/generated-skill/archive/image changes outside this story scope.

### Completion Notes List

- Story 5.6b is ready for dev as a read-only chunk and citation inspection slice inside the private maintainer dashboard.
- The inspection surfaces should stay lazy-loaded, keyboard accessible, and responsive, with honest partial-data states when the ingestion metadata are incomplete.
- The current ingestion schema is the source of truth for retrieval evidence; do not add a parallel source-version model unless a missing field forces it.
- Chunk and citation inspection must stay private, read-only, and separate from the validation runner.
- Story 5.6b implementation is complete and closed.
- Maintainers can inspect latest successful document-version anchors, chunk rows/details, citation rows/details, learner-visible labels, linked evidence, and copyable text/labels without direct database access.
- Source lifecycle and missing-ingestion states now produce explicit empty, inactive, stale, partial, ready, or unavailable inspection guidance instead of a blank pane.
- A public-boundary backend test now reads only frontend text/source files so image assets under `src/` do not break the admin-route leakage guard.

### File List

- `_bmad-output/implementation-artifacts/5-6b-inspect-retrieval-chunks-and-citations.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `backend/sources/dtos.py`
- `backend/sources/repository.py`
- `backend/sources/views.py`
- `backend/sources/urls.py`
- `backend/tests/test_admin_auth.py`
- `backend/tests/test_admin_stewardship.py`
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.tsx`
- `src/components/modules/MaintainerDashboard/MaintainerDashboard.test.tsx`
- `src/components/ui/table.tsx`
- `src/lib/maintainer/api.ts`
- `tests/e2e/maintainer.spec.ts`

### Change Log

- 2026-05-05: Created Story 5.6b inspection context from the current stewardship dashboard, ingestion schema, archived admin-side proposal, and recent maintainer work.
- 2026-05-05: Implemented read-only retrieval chunk and citation inspection across Django contracts, maintainer dashboard UI, API helpers, and regression coverage.

## Story Completion Status

done
