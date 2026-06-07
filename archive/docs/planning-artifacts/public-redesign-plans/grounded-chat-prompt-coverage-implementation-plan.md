# Grounded Chat Suggested Prompt Source-Knowledge Remediation Plan

Date: 2026-06-07
Status: Scoped to the reported suggested-prompt answerability issue
Owner surface: Public source-aware chat
Primary goal: Every visible suggested prompt returns a live grounded `answered` response from `/api/chat`.
Current visible audit inventory: 25 suggested prompts from `getSourceAwareChatStarterPromptAuditEntries()` as of 2026-06-07.

## Reported Issue

Some suggested prompts still produce non-grounded learner-facing response cards even though they are shown as recommended questions.

Observed failing cards:

- `Limited support in approved materials`
- `Course boundary reached`
- `Grounded answer unavailable`

Observed Django log signals:

- `POST /api/chat` with response size around `200 332` maps to the limited-support card.
- `POST /api/chat` with response size around `200 295` maps to the boundary-refusal card.
- `POST /api/chat` with response size around `200 364` maps to the grounded-unavailable fallback card.

The HTTP `200` status and response byte size are only diagnostics. A suggested prompt passes only when the typed response is `answered`, the grounding support is `strong`, and the answer includes at least one matching approved citation.

## Scope

In scope:

- Collect every visible suggested prompt from `src/data/chat/source-aware-chat.ts`; do not limit the gate to primary chapters only.
- Run every suggested prompt against the live Django `/api/chat` endpoint.
- Record each failing prompt by section ID, prompt ID, label, prompt text, expected source IDs, response state, support level, returned citation source IDs, visible card, endpoint mode, and notes.
- Convert each failing prompt into a precise course claim that the chatbot needs to support.
- Compare the prompt's expected source IDs against source bundle metadata, `archive/docs/approved-sources/manifest.json`, backend section scope, and active retrieval chunks.
- Update or add approved raw source knowledge files under `archive/docs/approved-sources/raw`.
- Ensure updated raw source knowledge is represented in the manifest, source metadata, citation adapters, ingestion or retrieval fixtures, active retrieval chunks, and backend section scope.
- Re-run the same live prompt audit until every suggested prompt returns a grounded answer.

Out of scope for this plan:

- Any chatbox issue unrelated to suggested prompts returning grounded answers.
- Open-domain chatbot expansion.
- Adding broad or unrelated material just to make the model answer more often.

## Tool-Assisted Findings

Graphify and GitNexus both point to a cross-layer remediation, not a single-file content edit.

Graphify findings:

- The relevant graph communities span prompt data, prompt audit tooling, public chat outcomes, approved-source ingestion, source bundle helpers, retrieval, and Django chat orchestration.
- The backend graph highlights `PublicChatRuntime`, `GroundedChatService`, and `RetrievalService` as central chat nodes, so the plan must separate guard, retrieval, and generation fallback failures.
- The ingestion community is separate from the chat outcome community, so raw source edits must be explicitly carried through manifest entries, ingestion, retrievable chunks, and citations.

GitNexus findings:

- `scripts/chatbot/audit-suggested-prompts.ts` is the audit entrypoint and gets its inventory from `getSourceAwareChatStarterPromptAuditEntries()`.
- `src/lib/chat/prompt-audit.ts` currently has a strict miss helper named `hasStrictPrimaryPromptAuditMiss`, which only fails primary-chapter misses. That does not satisfy this plan because the target is every visible suggested prompt.
- `src/data/chat/source-aware-chat.test.ts` still asserts a 20-prompt primary-chapter release gate. That older gate is insufficient because the visible audit inventory currently contains 25 prompts, including supporting-section prompts that can still be shown to learners.
- `src/lib/chat/prompt-audit.ts` currently maps typed `fallback` responses to `transportFailure` or `missingSource`. That loses the exact learner-visible `Grounded answer unavailable` branch, so the audit schema must preserve fallback as its own classification and raw response state.
- `GroundedChatService._answer()` maps the three observed cards to different branches:
  - `Course boundary reached` is a topic or safety guard refusal before retrieval.
  - `Limited support in approved materials` is returned when `RetrievalService.retrieve()` does not reach strong support.
  - `Grounded answer unavailable` is a safe fallback after orchestration cannot complete a grounded answer.
- `RetrievalService.retrieve()` only returns strong support when active `gg-src-*` candidates are inside the current section scope and pass rerank thresholds.
- `load_approved_source_manifest()` and `prepare_ingestion()` show that raw approved files become active only through manifest entries, revisions, chunking, embeddings, and ingestion persistence.
- GitNexus did not expose `/api/chat` through route-map or shape-check route nodes, but it did resolve `backend/chatbot/views.py::public_chat`. Use `public_chat` symbol context and backend contract tests as the route verification source of truth for this remediation.

Known suspect to verify first:

- `src/data/chat/source-aware-chat.ts` expects WPS source IDs including `gg-src-post-award-compliance-record` and `gg-src-scarborough-standoff-record`.
- `backend/chatbot/section-source-projection.json` scopes those same IDs to `west-philippine-sea-dossier`.
- `archive/docs/approved-sources/manifest.json` currently does not show manifest entries for `gg-src-post-award-compliance-record` or `gg-src-scarborough-standoff-record`.
- If the live audit failures involve prompts mapped to those IDs, the likely fix is to add or split approved raw material plus manifest entries, then ingest them, rather than merely changing prompt wording.

## Remediation Requirements

The implementation must close these gaps before source-knowledge changes are considered verified:

- Replace the primary-only strict audit helper with an all-visible-prompt miss helper. `--fail-on-miss` must exit nonzero for any row whose classification is not `answered`, regardless of `isPrimaryChapter`.
- Update prompt-audit tests so a supporting-section weak-support, refusal, cooldown, fallback, transport failure, weak citation, or missing-source row fails the strict gate.
- Update source-aware prompt tests so they assert the full visible audit inventory, not only the 20 primary chapter prompts.
- Add prompt ID and label to both Markdown and JSON audit output.
- Add raw `responseState`, `supportLevel`, returned citation source IDs, and visible card or outcome label to audit rows.
- Add an explicit `fallback` audit classification for typed `state=fallback`, instead of collapsing fallback into `transportFailure`.
- Add a machine-readable audit artifact target for the full live run and preserve failing rows in the QA report or linked JSON.
- Add a fast parity check that every expected prompt source ID exists in the approved-source manifest, source bundle metadata, backend section scope when section-specific, and ingestion fixtures where applicable.
- Add a fast parity check that every backend section source ID expected by visible prompts has a manifest entry before live retrieval is trusted.
- Include `/api/chat` contract verification through `backend/tests/test_public_chat_contract.py`; route-map output is not sufficient for this repository because GitNexus does not currently expose `/api/chat` as a route node.
- Include changed-scope coverage commands whenever executable code changes, satisfying the repo constitution's 80% coverage gate for every reported metric.

## Source-Knowledge Meaning

For this plan, widening source knowledge means updating the approved raw source material in:

`archive/docs/approved-sources/raw`

Current raw topic files:

- `topic-1-global-governance-basics-knowledge.md`
- `topic-2-major-actors-global-governance-knowledge.md`
- `topic-3-united-nations-purpose-structure-knowledge.md`
- `topic-4-limits-criticisms-global-governance-knowledge.md`
- `topic-5-international-law-dispute-resolution-knowledge.md`
- `topic-6-west-philippine-sea-south-china-sea-case-knowledge.md`
- `topic-7-enforcement-gap-ruling-vs-reality-knowledge.md`
- `topic-8-asean-and-regional-governance-knowledge.md`

Raw source updates are not complete by themselves. The updated knowledge must also become retrievable and citeable through the backend chat path:

- Add or update the raw approved file.
- Add or update the corresponding `archive/docs/approved-sources/manifest.json` entry and revision.
- Ensure the source ID exists in source bundle citation metadata when it is expected by a visible prompt.
- Ensure the source ID is included in the correct backend section scope.
- Run approved-source ingestion so the live retrieval store has active chunks.
- Verify `/api/chat` returns the source as a matching citation for the relevant suggested prompt.

## Failure-Specific Fix Paths

`Limited support in approved materials`:

- Treat this first as a retrieval/source-coverage failure.
- Check whether the expected source IDs have manifest entries, active chunks, and section scope.
- If the right source exists but does not retrieve, update the raw source wording so the relevant course claim appears clearly in a compact chunk.
- If the right source ID has no manifest entry, add or split approved raw material and ingest it.
- Only consider retrieval threshold or ranking changes after proving that source IDs, chunks, and prompt language are aligned.

`Course boundary reached`:

- Treat this first as a topic-guard or prompt-wording failure.
- If the prompt is clearly about the course, adjust the guard examples or backend guard handling so visible course prompts are allowed.
- If the prompt overreaches the approved materials, narrow the visible prompt text.
- Do not assume a raw source update will fix this branch, because refusal happens before retrieval.

`Grounded answer unavailable`:

- Treat this as a post-orchestration fallback until proven otherwise.
- Capture whether the failure happens after strong retrieval, model generation, safety filtering, protection, or provider error handling.
- Preserve this outcome as `classification=fallback` in the prompt audit output.
- If fallback follows weak or missing retrieval, fix the same source/manifest/chunk path as limited support.
- If fallback follows strong retrieval, inspect generation and safety behavior instead of broadening raw sources blindly.

## Test-First Sequence

All executable-code changes in this remediation must follow red-green-refactor:

1. Add or update the focused test that proves the missing behavior.
2. Run that focused test and confirm it fails for the intended reason.
3. Implement the smallest code change that makes the focused test pass.
4. Refactor only while the focused suite stays green.
5. Run the selected verification commands and changed-scope coverage gates.

Required red tests before production edits:

- Prompt audit strictness: supporting-section misses must fail the release gate.
- Prompt audit schema: rows must include prompt ID, label, response state, support level, returned citation source IDs, visible card, and explicit fallback classification.
- Prompt inventory: the full visible audit inventory must be asserted, including the current 25 entries.
- Source parity: every prompt-expected source ID must exist in manifest, source metadata, backend section scope, and test fixtures.
- `/api/chat` contract: backend tests must still prove section and depth context reach orchestration, typed cooldown remains a successful outcome, and provider fallback stays bounded.

## Remediation Loop

1. Add the red tests listed in the Test-First Sequence section.
2. Update the prompt audit harness so `--fail-on-miss` fails any visible suggested prompt miss, not only primary-chapter misses.
3. Extend the audit row schema to preserve prompt ID, label, expected source IDs, raw response state, support level, returned citation source IDs, visible card, and explicit fallback classification.
4. Add prompt/source parity tests before changing the raw corpus.
5. Start the local live stack needed for `/api/chat`.
6. Export the full suggested-prompt inventory.
7. Run the prompt audit against `http://127.0.0.1:8000/api/chat`.
8. Save every prompt row to a machine-readable JSON artifact and every failing prompt row to the QA report or a linked JSON artifact.
9. For each failure, identify the exact course claim the prompt expects.
10. Search `archive/docs/approved-sources/raw` for supporting material.
11. Classify the root cause:
   - raw source exists but is not in `archive/docs/approved-sources/manifest.json`
   - raw source exists in the manifest but is not active or retrievable
   - raw source exists but backend section scope excludes it
   - raw source exists but does not clearly state the needed claim
   - raw source is missing and needs a new approved file or an update to an existing file
   - prompt wording is course-relevant but the topic guard rejects it
   - prompt wording overreaches the approved course materials
   - generation or safety fallback occurs after otherwise strong retrieval
12. Update the raw approved source knowledge when the claim gap is real.
13. Update manifest entries, source bundle metadata, citation adapters, ingestion or retrieval fixtures, active chunks, and backend section scope as needed.
14. Run approved-source ingestion after raw or manifest edits.
15. Re-run the same failing prompt before moving to the next miss.
16. Run the focused unit/backend tests and changed-scope coverage gates.
17. Repeat until the strict live audit has zero suggested-prompt misses.

## Expected Files

Primary source-knowledge files:

- `archive/docs/approved-sources/raw/*.md`
- `archive/docs/approved-sources/manifest.json`

Likely supporting files:

- `src/data/chat/source-aware-chat.ts`
- `src/data/chat/source-aware-chat.test.ts`
- `src/lib/chat/prompt-audit.ts`
- `src/lib/chat/prompt-audit.test.ts`
- `src/data/source-bundles/approved-source-bundle.ts`
- `src/data/source-bundles/approved-source-bundle.test.ts`
- `backend/chatbot/section-source-projection.json`
- `backend/chatbot/section_sources.py`
- `backend/chatbot/services.py`
- `backend/retrieval/services.py`
- `backend/ingestion/pipeline.py`
- `backend/ingestion/services.py`
- `backend/tests/test_chatbot_orchestration.py`
- `backend/tests/test_public_chat_contract.py`
- `backend/tests/test_approved_source_manifest.py`
- `backend/tests/test_ingestion_repository.py`
- `backend/tests/test_retrieval_service.py`
- `backend/tests/test_ingestion_pipeline.py`
- `backend/tests/test_ingestion_services.py`
- `backend/tests/fixtures/chatbot_sources.py`
- `scripts/chatbot/audit-suggested-prompts.ts`
- `archive/docs/planning-artifacts/public-redesign-plans/source-aware-chatbox-qa-report.md`
- `specs/001-grounded-chatbot-readiness/quickstart.md`

Only touch frontend component files if the failing prompt itself must be removed, renamed, or narrowed in the visible prompt catalog.

## Verification

Fast red-green gates before live testing:

- `pnpm exec vitest run src/lib/chat/prompt-audit.test.ts src/data/chat/source-aware-chat.test.ts src/data/source-bundles/approved-source-bundle.test.ts`
- `pnpm backend:test -- backend/tests/test_approved_source_manifest.py backend/tests/test_ingestion_pipeline.py backend/tests/test_ingestion_repository.py backend/tests/test_ingestion_services.py backend/tests/test_retrieval_service.py backend/tests/test_chatbot_orchestration.py backend/tests/test_public_chat_contract.py`

Audit schema gates:

- `pnpm chatbot:audit-prompts -- --endpoint-mode fixture --json`
- `pnpm chatbot:audit-prompts -- --endpoint-mode fixture --fail-on-miss`

The fixture mode may use deterministic local responses, but it must prove the CLI schema, all-visible-prompt fail behavior, fallback classification, prompt ID and label fields, response state, support level, returned citation source IDs, and visible card fields before the live endpoint is used as the release gate.

Source ingestion gate after raw or manifest edits:

- `pnpm backend:ingest:approved`

Live prompt gate:

- `pnpm redis:start`
- `pnpm backend:dev`
- `pnpm chatbot:audit-prompts -- --endpoint-mode live --endpoint http://127.0.0.1:8000/api/chat --fail-on-miss`
- `pnpm chatbot:audit-prompts -- --json --endpoint-mode live --endpoint http://127.0.0.1:8000/api/chat --fail-on-miss`
- `pnpm test:chat:live`

Changed-scope coverage gates when executable code changes:

- `pnpm test:coverage`
- `pnpm backend:test:coverage`

Standard repo checks only when implementation touches executable code:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm backend:lint`
- `pnpm backend:typecheck`
- `pnpm backend:security`
- `pnpm backend:check`

## Definition of Done

- Every visible suggested prompt has been tested against the live `/api/chat` endpoint.
- `--fail-on-miss` fails on any visible suggested prompt miss, not just a primary-chapter miss.
- The checked-in prompt inventory test asserts the full visible audit inventory, including supporting-section prompts.
- The prompt audit schema records prompt ID, label, expected source IDs, raw response state, support level, returned citation source IDs, visible card, endpoint mode, and notes.
- Typed fallback responses are classified as `fallback`, not hidden inside `transportFailure`.
- No suggested prompt returns `Limited support in approved materials`.
- No suggested prompt returns `Course boundary reached`.
- No suggested prompt returns `Grounded answer unavailable`.
- Every suggested prompt returns `state=answered`.
- Every suggested prompt returns `grounding.supportLevel=strong`.
- Every suggested prompt includes at least one matching approved citation.
- Every prompt-expected source ID is backed by source metadata, a manifest entry, active retrievable chunks, and the correct backend section scope.
- Every backend section source ID used by a visible prompt has a manifest entry.
- Every previously failing prompt has a recorded root cause and fix tied to approved source knowledge or a documented non-source branch.
- Updated raw source knowledge is active in retrieval and citeable by the backend chat response.
- The strict live prompt audit passes with `--fail-on-miss`.
- Changed-scope coverage reports meet at least 80% for every reported metric on new or materially changed executable code.
