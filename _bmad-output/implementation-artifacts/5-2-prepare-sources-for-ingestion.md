# Story 5.2: Prepare Sources for Ingestion

Status: done

## Story

As a maintainer,
I want to ingest approved documents into the chatbot retrieval pipeline,
so that the assistant can answer from structured, searchable materials.

## Acceptance Criteria

1. Given approved source documents are prepared, when I run ingestion, then each input is normalized into retrievable `documents`, `chunks`, and `references` records with stable identifiers, metadata, canonical `sourceId` mapping, and storage locations, and the approved-source separation from the site copy is preserved.
2. Given I ingest the same approved document twice without changes, when I compare outputs, then the document ids, chunk ids, chunk ordering, metadata, checksums, and citation records are identical, and the embeddings are generated through the same pinned embedding configuration so unchanged input remains deterministic.
3. Given a supported file type in the validation set, when ingestion runs, then each approved `pdf` and normalized `md` input is processed successfully into the retrieval store with documents, chunks, embeddings, and citation data in the intended storage layer.
4. Given an unsupported or malformed input, when ingestion runs, then the workflow rejects it clearly before any partial write or silent fallback, and the failure leaves no persisted document, chunk, reference, or storage side effects for that input.
5. Given I inspect the stored source files and retrievable records, when I trace the path end to end, then raw inputs remain outside the public frontend asset path, raw PDFs are stored only in a private `project-source-pdfs` bucket, optional processed exports stay in a private `processed-exports` bucket when used, and all privileged writes remain server-side or maintainer-only.

## Tasks / Subtasks

- [x] Define the ingestion data model and storage migrations (AC: 1, 2, 3, 5)
  - [x] Create the documents, chunks, references, and any needed join-table schema in `supabase/migrations/`.
  - [x] Add primary keys, foreign keys, uniqueness constraints, and delete/update behavior that prevent duplicate or orphaned retrieval records on re-ingest.
  - [x] Enable `vector`/pgvector, RLS, and private storage access rules in migrations instead of the dashboard.
  - [x] Persist stable document ids, stable chunk ids, canonical `sourceId` values, source file paths, checksums, chunk order, and processing metadata so unchanged input stays deterministic.
  - [x] Define the citation/reference contract explicitly enough that downstream chat and evidence consumers can trace a citation back to the canonical source and supporting chunk set.
- [x] Implement the ingestion entry points and shared helpers (AC: 1, 2, 3, 4)
  - [x] Add `supabase/functions/ingest-content/index.ts` for normalized text or markdown inputs.
  - [x] Add `supabase/functions/ingest-pdf/index.ts` for PDF extraction, normalization, and record creation.
  - [x] Keep validation, chunking, metadata shaping, embedding generation, alias-to-canonical `sourceId` resolution, and storage writes in `supabase/functions/_shared/`.
  - [x] Keep writes transactional or equivalently idempotent so a rejected or failed ingestion cannot leave partial persistence behind.
- [x] Add maintainer workflow wiring for local prep (AC: 1, 3, 5)
  - [x] Create `scripts/chatbot/prepare-ingestion.ts` for preparing the approved source set from a clean clone.
  - [x] Create or update `scripts/chatbot/validate-chatbot-set.ts` so supported-file validation and ingestion-boundary checks can run locally from the same maintainer workflow.
  - [x] Add the minimum `package.json` script(s) needed to run ingestion locally without manual code edits.
  - [x] Keep service credentials and storage access server-side only.
- [x] Add deterministic ingestion tests (AC: 2, 3, 4, 5)
  - [x] Cover unchanged-input determinism, supported file types, unsupported input rejection, duplicate-ingest idempotency, and private-source boundary behavior in `supabase/functions/tests/`.
  - [x] Keep assertions exact on document ids, chunk ids, chunk counts, ordering, checksums, and metadata. Avoid snapshot-only coverage for the ingestion contract.
  - [x] Prove the second unchanged ingest does not create duplicate rows or mismatched citation records.

## Dev Notes

### Current State

- `src/data/source-bundles/approved-source-bundle.ts` is already the canonical approved-source registry and carries the Story 5.2 ingestion boundary note.
- `src/lib/chat/grounded-answer.ts` and `supabase/functions/_shared/chat-grounding.ts` still do bundle-backed keyword retrieval; they are not the ingestion pipeline.
- `supabase/migrations/` currently contains no real schema files, so the ingestion tables, RLS, and vector indexes still need to be introduced.
- `supabase/functions/ingest-content/`, `supabase/functions/ingest-pdf/`, and `scripts/chatbot/` do not exist yet.
- The repo's current approved source inputs are the staged markdown knowledge files in `archive/docs/approved-sources/raw/`.
- The current staged files are topic-scoped markdown source documents rather than browser-facing page copy, and ingestion must map them to canonical approved `sourceId` values instead of creating ad hoc source identities.

### Story Focus

- Build the preparation and persistence lane from approved source inputs to retrievable records.
- Keep ingestion server-side and maintainer-only.
- Preserve the canonical `sourceId` contract from Story 5.1.
- Resolve aliases or deprecated ids to canonical active `sourceId` values before persistence.
- Make reprocessing deterministic for unchanged input.
- Treat raw PDFs as private inputs; do not expose them in `public/` or browser code.

### Scope Boundaries

- No learner-facing UI changes.
- No public maintainer dashboard.
- No chat response, refusal, or protection behavior changes.
- No new retrieval ranking logic in the chat surface.
- No second source inventory or ad hoc source list. Use `activeApprovedSourceBundle` as the only approved-source registry.

### Architecture Guardrails

- Keep browser-facing code in `src/` and privileged ingestion or storage writes in `supabase/functions/` and maintainer scripts.
- Use versioned SQL migrations only in `supabase/migrations/`.
- Use `supabase/functions/_shared/` for shared ingestion helpers.
- Enable RLS on exposed tables and keep service keys server-side only.
- Prefer short-lived, idempotent Edge Function work. If a step becomes long-running, move it out of the request path.
- Private Storage buckets and authenticated downloads only for raw inputs and processed exports.
- Use `project-source-pdfs` as the private raw-input bucket and `processed-exports` as the private processed-output bucket if processed exports are written.
- Runtime schema validation is mandatory at ingestion boundaries.
- Do not use Redis as the source of truth for documents, chunks, embeddings, or citations.

### Existing Source Inputs

- `archive/docs/approved-sources/raw/topic-1-global-governance-basics-knowledge.md`
- `archive/docs/approved-sources/raw/topic-2-major-actors-global-governance-knowledge.md`
- `archive/docs/approved-sources/raw/topic-3-united-nations-purpose-structure-knowledge.md`
- `archive/docs/approved-sources/raw/topic-4-limits-criticisms-global-governance-knowledge.md`
- `archive/docs/approved-sources/raw/topic-5-international-law-dispute-resolution-knowledge.md`
- `archive/docs/approved-sources/raw/topic-6-west-philippine-sea-south-china-sea-case-knowledge.md`
- `archive/docs/approved-sources/raw/topic-7-enforcement-gap-ruling-vs-reality-knowledge.md`
- `archive/docs/approved-sources/raw/topic-8-asean-and-regional-governance-knowledge.md`

### Supported File Validation Set

- Supported inputs for this story are approved `pdf` source files and approved normalized `md` exports prepared from those sources.
- Unsupported inputs include any unapproved file type, malformed file, or content that cannot be mapped to a canonical approved `sourceId`.
- The validation workflow must exercise the currently staged approved markdown source files in `archive/docs/approved-sources/raw/`, and it should extend to approved PDFs when those are added to the source set.

### Determinism Contract

- Stable `documents.id` values must derive from canonical `sourceId` plus deterministic source revision data such as checksum or approved version metadata.
- Stable `chunks.id` values must derive from the owning document identity plus deterministic chunk-order data.
- The embedding path must pin one embedding configuration for the story implementation so unchanged input does not drift because of an implicit model change.
- Repeating an unchanged ingest must preserve row identity and must not create duplicate `documents`, `chunks`, or `references` rows.

### Files Likely to Create or Update

- `supabase/migrations/0001_create_documents.sql`
- `supabase/migrations/0002_create_chunks.sql`
- `supabase/migrations/0003_create_references.sql`
- `supabase/migrations/0004_enable_rls.sql`
- `supabase/migrations/0005_indexes_and_search.sql`
- `supabase/functions/ingest-content/index.ts`
- `supabase/functions/ingest-pdf/index.ts`
- `supabase/functions/_shared/ingestion-*.ts`
- `supabase/functions/tests/ingest-content.test.ts`
- `supabase/functions/tests/ingest-pdf.test.ts`
- `scripts/chatbot/prepare-ingestion.ts`
- `scripts/chatbot/validate-chatbot-set.ts`
- `package.json` if new maintainer scripts are added
- `supabase/functions/_shared/env.ts` if the workflow needs centralized secret access

### Testing Standards Summary

- `pnpm test:functions` for ingestion function logic, determinism, and rejection cases.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` for the TypeScript surface.
- If the story adds a maintainer script, exercise it through the local Supabase workflow (`pnpm supabase:start` and `pnpm supabase:functions`) to confirm schema and function paths line up.
- Validate the same approved input twice and compare record ids, chunk counts, ordering, and metadata.
- Validate the same approved input twice and confirm no duplicate documents, chunks, or references are created.
- Validate unsupported input types fail cleanly without partial writes.
- Validate private-source access stays server-side, raw PDFs map to the private `project-source-pdfs` bucket, processed exports stay private if present, and no raw source path leaks into browser assets.

### Previous Story Intelligence

- Story 5.1 established the canonical approved-source bundle, stable source ids, aliases, and the server mirror path.
- Story 5.1 review patched a canonical-id drift in an E2E assertion; keep those ids stable in any ingestion records or fixtures.
- Story 5.1 explicitly reserved file preparation, chunking, embeddings, and storage records for Story 5.2.
- The previous implementation pattern was story-sized feature plus tests plus shared helper updates plus a sprint-status bump in one change set.
- Continue using `supabase/functions/_shared` for shared server helpers and `supabase/functions/tests` for Edge Function coverage.

### Git Intelligence Summary

- Recent commits show the repo lands feature slices as story-specific commits with tests in the same change.
- Story 4.3 and 4.4 added shared server helpers plus `supabase/functions/tests` coverage before closing the story.
- Story 5.1 added a canonical bundle, aligned consumers, and kept reviewable, stable ids.
- Keep this story equally bounded and avoid cross-epic sprawl.

### Latest Tech Notes

- Supabase Edge Functions are Deno-based TypeScript handlers. Use `supabase functions serve` for local parity and keep reusable utilities in `supabase/functions/_shared`. [Source: https://supabase.com/docs/guides/functions]
- Private Storage buckets are controlled by RLS; downloads require authenticated access or signed URLs, and service keys bypass RLS, so they must stay server-side. [Source: https://supabase.com/docs/guides/storage/buckets/fundamentals, https://supabase.com/docs/guides/storage/security/access-control, https://supabase.com/docs/guides/storage/serving/downloads]
- RLS must be enabled on exposed tables, and service-role access should not reach the browser. [Source: https://supabase.com/docs/guides/database/postgres/row-level-security]
- `pgvector` uses the `vector` extension. If the team uses Supabase AI for embeddings inside Edge Functions, current docs show `gte-small` with `mean_pool: true` and `normalize: true` for text embeddings. [Source: https://supabase.com/docs/guides/database/extensions/pgvector, https://supabase.com/docs/guides/functions/ai-models]

### Project Structure Notes

- `supabase/functions/` is the right home for ingestion entry points and server-only helpers.
- `supabase/migrations/` is the right home for the first durable documents/chunks/reference schema and policy changes.
- `scripts/chatbot/` is a new top-level maintainer workspace if a local prep helper is added; do not tuck it into `src/`.
- Keep `src/` presentation-only. If a shared type is needed by both browser and server code, place it deliberately rather than duplicating the same shape.
- Archive PDFs and text exports stay out of `public/`; they are source inputs, not frontend assets.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md`, Epic 5: Story 5.2, Story 5.3, NFR23, NFR24]
- [Source: `_bmad-output/planning-artifacts/prd.md`, FR35-FR41, NFR12, NFR22-NFR24]
- [Source: `_bmad-output/planning-artifacts/architecture.md`, Data Architecture, Architectural Boundaries, File Organization Patterns]
- [Source: `_bmad-output/planning-artifacts/ux-design-specification.md`, Source-Aware Chat Panel, Reference Evidence Drawer, Feedback Patterns]
- [Source: `_bmad-output/project-context.md`, runtime schema validation, server-side ingestion, private storage, source separation]
- [Source: `_bmad-output/implementation-artifacts/5-1-manage-approved-source-bundles.md`, Story 5.1 handoff and ingestion boundary notes]
- [Source: src/data/source-bundles/approved-source-bundle.ts, canonical bundle and ingestion boundary]
- [Source: supabase/functions/_shared/chat-grounding.ts, current server-side retrieval boundary]
- [Source: supabase/functions/chat/index.ts, current protected chat entry point]
- [Source: archive/docs/approved-sources/raw/topic-1-global-governance-basics-knowledge.md, staged approved markdown source input]
- [Source: archive/docs/approved-sources/raw/topic-2-major-actors-global-governance-knowledge.md, staged approved markdown source input]
- [Source: archive/docs/approved-sources/raw/topic-3-united-nations-purpose-structure-knowledge.md, staged approved markdown source input]
- [Source: archive/docs/approved-sources/raw/topic-4-limits-criticisms-global-governance-knowledge.md, staged approved markdown source input]
- [Source: archive/docs/approved-sources/raw/topic-5-international-law-dispute-resolution-knowledge.md, staged approved markdown source input]
- [Source: archive/docs/approved-sources/raw/topic-6-west-philippine-sea-south-china-sea-case-knowledge.md, staged approved markdown source input]
- [Source: archive/docs/approved-sources/raw/topic-7-enforcement-gap-ruling-vs-reality-knowledge.md, staged approved markdown source input]
- [Source: archive/docs/approved-sources/raw/topic-8-asean-and-regional-governance-knowledge.md, staged approved markdown source input]
- [Source: archive/docs/planning-artifacts/global_governance_chatbot_architecture_spec.md, PDF ingestion, chunking, embeddings, and retrieval flow]
- [Source: archive/docs/planning-artifacts/public_chatbot_security_and_redis_strategy.md, private storage and server-only protection strategy]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Resolved the create-story workflow customization fallback with the local resolver.
- Loaded project context, sprint tracking, epic/PRD/architecture/UX docs, Story 5.1, the Story 5.1 review note, current source bundle code, current chat retrieval helpers, and the archived source corpus.
- Confirmed the first backlog story in `sprint-status.yaml` is `5-2-prepare-sources-for-ingestion`.
- Verified that the repo currently has no ingestion functions, no real migration files, and no `scripts/` workspace yet.
- Reviewed official Supabase docs for Edge Functions, Storage bucket access, Storage RLS, Postgres RLS, and pgvector/AI embeddings.
- Switched to `codex/story-5-2-prepare-sources-for-ingestion` for story implementation.
- Ran GitNexus impact analysis for `resolveApprovedSourceId` and `getApprovedSource`; both existing symbols reported HIGH upstream risk, so their behavior was left unchanged and only consumed by new ingestion helpers.
- Added function tests first; initial red run failed on missing ingestion helper module before implementation.
- Verified local maintainer scripts against the 8 staged approved markdown sources.
- Ran GitNexus change detection after implementation; reported low risk and no affected execution flows for indexed symbols.
- Started the local Supabase workflow; Supabase was already running, and `pnpm exec supabase migration up --local` applied the new ingestion migrations successfully.

### Implementation Plan

- Introduce versioned Supabase migrations for retrieval documents, chunks, references, reference-chunk links, pgvector, RLS, private storage buckets, and an atomic `persist_ingestion_document` RPC.
- Build shared ingestion helpers that validate inputs, resolve aliases to canonical approved `sourceId` values, normalize content, chunk deterministically, pin embedding metadata, and produce stable ids/checksums.
- Expose maintainer-only Edge Function entry points for markdown/text and PDF ingestion, with server-side service-role persistence.
- Add local scripts for validating and preparing the approved source set without placing source materials in `public/`.

### Completion Notes List

- Story created for Epic 5.2 with a bounded ingestion-prep scope.
- Canonical approved-source ids from Story 5.1 are treated as the only source inventory.
- Ingestion is intentionally separate from chat response logic, refusal logic, and UI work.
- Added the retrieval schema, RLS, private bucket setup, vector column/index, deterministic constraints, and transactional persistence RPC.
- Added shared ingestion helpers for validation, canonical source resolution, deterministic ids/checksums, chunk ordering, citation/reference packaging, PDF text extraction, and an in-memory idempotency test store.
- Added `ingest-content` and `ingest-pdf` Edge Functions that reject bad inputs before persistence and persist through the service-role RPC only.
- Added local `chatbot:validate-set` and `chatbot:prepare-ingestion` scripts for the approved source corpus.
- Added deterministic function tests covering unchanged-input determinism, alias resolution, supported file handling, unsupported rejection, duplicate-ingest idempotency, and private-source boundaries.
- Verification passed: `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, `pnpm test:functions`, `pnpm build`, `pnpm format`, `pnpm chatbot:validate-set`, and `pnpm exec supabase migration up --local`.

### File List

- `_bmad-output/implementation-artifacts/5-2-prepare-sources-for-ingestion.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `eslint.config.js`
- `package.json`
- `scripts/chatbot/approved-source-set.ts`
- `scripts/chatbot/prepare-ingestion.ts`
- `scripts/chatbot/validate-chatbot-set.ts`
- `supabase/functions/_shared/ingestion-persistence.ts`
- `supabase/functions/_shared/ingestion-pipeline.ts`
- `supabase/functions/_shared/ingestion-types.ts`
- `supabase/functions/ingest-content/index.ts`
- `supabase/functions/ingest-pdf/index.ts`
- `supabase/functions/tests/ingestion.test.ts`
- `supabase/migrations/0001_create_ingestion_documents.sql`
- `supabase/migrations/0002_persist_ingestion_document.sql`

### Change Log

- 2026-05-01: Implemented Story 5.2 ingestion preparation pipeline and moved story to review.

## Story Completion Status

- done
- Review patches applied and verification passed.

### Review Findings

- [x] [Review][Patch] Embeddings are declared but never persisted [supabase/migrations/0002_persist_ingestion_document.sql:74]
- [x] [Review][Patch] Malformed ingestion payloads are coerced instead of schema-validated [supabase/functions/ingest-content/index.ts:38-42]
- [x] [Review][Patch] Approved source paths are not restricted to the approved corpus [supabase/functions/_shared/ingestion-pipeline.ts:40-41]
- [x] [Review][Patch] `ingest-content` still accepts PDFs instead of forcing the PDF lane [supabase/functions/ingest-content/index.ts:41]
- [x] [Review][Patch] PDF ingestion never uploads raw files to the private bucket [supabase/functions/ingest-pdf/index.ts:49-55]
