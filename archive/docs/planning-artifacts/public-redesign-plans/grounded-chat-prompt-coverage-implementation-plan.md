# Grounded Chat Prompt Coverage Implementation Plan

Date: 2026-06-07
Status: Proposed implementation plan
Owner surface: Public source-aware chat
Primary goal: Every visible suggested prompt for Chapters 1-4 returns a grounded answer, with exactly 5 suggested prompts shown per chapter.

## Objective

Bring the public source-aware chat to a stricter contract:

- Each visible chapter prompt chip must be intentionally supported by approved sources.
- Each visible chapter prompt chip must resolve to a grounded `answered` outcome, not `weakSupport`, `refused`, or `fallback`.
- Each primary chapter context must expose exactly 5 suggested prompts.
- The implementation must remain constitution-compliant: browser-owned presentation in `src/`, Django-owned privileged retrieval in `backend/`, typed degraded states preserved, and verification driven by red-green-refactor plus changed-scope coverage.

This plan treats the current `200 332` vs `200 799` backend log sizes as a useful debugging signal, not as the business rule. The durable rule is outcome type plus citation quality, not response byte count.

## Scope

In scope:

- Chapter prompt inventory for the public chat surface
- Approved-source coverage expansion using already-approved source identities first
- Backend section-to-source scoping for grounded retrieval
- Frontend prompt catalog changes so each chapter shows 5 prompts
- Prompt audit automation and release gates proving every visible prompt is grounded

Out of scope:

- Free-form expansion of the chatbot into open-domain knowledge
- Moving retrieval or secrets into the frontend
- Replacing typed `weakSupport`, `refused`, `cooldown`, or `fallback` contracts
- Multi-turn semantic memory beyond the already implemented session-local transcript

## Constitution Check

### I. Multi-Runtime Architecture Boundaries

Pass.

- Prompt presentation stays in `src/components/chat` and `src/data/chat`.
- Privileged retrieval, section scoping, and source filtering stay in Django under `backend/chatbot` and `backend/retrieval`.
- Approved source identity and adapter metadata stay repo-managed under `src/data/source-bundles`.

### II. Runtime-Appropriate Modularization

Pass.

- Frontend changes remain feature-owned inside the chat feature.
- Backend changes remain domain-owned inside `chatbot` and `retrieval`.
- The plan avoids introducing a new global shared layer unless the source-scope derivation logic earns a dedicated helper through multiple real consumers.

### III. Accessible, Resilient Learning Experience

Pass.

- The learner still receives typed bounded states when they ask unsupported free-form questions.
- The stricter rule applies to visible suggested prompts only.
- The existing transcript, reduced-motion, keyboard, and fallback behavior remain part of verification.

### IV. Typed Boundary Contracts and Deliberate States

Pass.

- Prompt success will be validated via typed response envelopes, citation matches, and source support.
- Byte-size observations from server logs are diagnostic only and must not replace typed contract assertions.

### V. Cohesive, Intention-Revealing Code

Pass.

- Prompt definitions, approved-source mappings, and retrieval scope each keep one understandable owner.
- The plan prefers deriving chapter chat scope from the approved source bundle over duplicating large hand-maintained mappings in multiple places.

### VI. Test-Driven Verification and Delivery Safety

Pass.

- Every workstream below starts with red tests or audit failure.
- Verification uses the smallest confident layer first: Vitest for prompt inventory and UI behavior, pytest for retrieval scope and outcome rules, Playwright for browser confidence, and the live prompt audit for final release proof.

## Architecture Evidence

### Graphify findings

- Merged graph `Community 33` groups `getSourceAwareChatStarterPrompts`, `chooseStarterPrompt`, and `handleSubmit`, confirming the prompt rail is centrally owned by `src/components/chat/SourceAwareChat.tsx` and `src/data/chat/source-aware-chat.ts`.
- `Community 18` groups `requestGroundedAnswer` and the grounded-answer parsing helpers, confirming the browser request contract is already a stable seam for prompt auditing.
- `Community 32` groups `RetrievalService` and its tests, showing strong/weak support is determined inside `backend/retrieval/services.py`.
- `Community 2` and `Community 6` connect the approved source manifest, bundle adapters, and dossier evidence helpers, which makes the approved source bundle the strongest long-term authority for chapter chat scope.

### GitNexus findings

- `SourceAwareChat` has HIGH upstream risk because it feeds `AppShell` and shared render helpers. Plan changes should keep the frontend prompt work localized and heavily tested.
- `answer_public_chat` is called by `backend/chatbot/views.py:public_chat`, so backend grounding changes naturally funnel through a single public runtime entrypoint.
- `requestGroundedAnswer` already funnels browser calls through `createChatRequest` and `parseGroundedChatEnvelope`, which is the right place to preserve the typed contract while we change source coverage.
- `RetrievalService` is the backend seam that decides whether an answer is `strong` or `weak`, based on section scoping and retrieval/rerank thresholds.

## Current Gaps

1. The frontend prompt catalog in `src/data/chat/source-aware-chat.ts` currently marks many visible prompts as `limitedSupport`, which means the UI already knows several recommended prompts are not reliably grounded.
2. Chapter prompt counts are inconsistent. Several chapter contexts expose 2-3 prompts instead of the desired fixed set of 5.
3. `backend/chatbot/services.py:SECTION_SOURCE_IDS` is narrower than the richer approved-source bundle in `src/data/source-bundles/approved-source-bundle.ts`, especially for chapter-specific support.
4. `src/data/source-bundles/approved-source-bundle.ts` already contains chapter-aware `chatCitations` adapters, but the backend section scope is still partially hand-maintained rather than derived from that source of truth.
5. The prompt audit script currently allows `limitedSupport` prompts to remain in the visible inventory. That is useful for diagnostics, but it is not strict enough for the new release goal.

## Implementation Strategy

### Workstream 1: Establish the new chapter prompt contract

Goal:

- Exactly 5 visible prompts for each primary chapter context:
  - `hero-narrative-frame`
  - `global-governance-overview`
  - `un-command-center`
  - `west-philippine-sea-dossier`

Tasks:

- Define 5 prompt intents per chapter that are narrow enough to be source-groundable.
- Keep prompt wording anchored to course language already present in approved materials.
- Maintain internal supporting contexts such as `governance-limits` and `conclusion-references`, but do not let them drift away from the chapter-level prompt contract.

Primary files:

- `src/data/chat/source-aware-chat.ts`
- `src/data/chat/source-aware-chat.test.ts`
- `src/components/chat/SourceAwareChat.tsx`
- `src/components/chat/SourceAwareChat.test.tsx`

TDD entry:

- Red test that each primary chapter returns exactly 5 prompts.
- Red test that no visible primary chapter prompt is tagged `limitedSupport` or `boundaryRefusal`.

### Workstream 2: Expand approved source coverage deliberately

Goal:

- Back each visible prompt with approved material rather than relying on the model to improvise.

Tasks:

- Audit current chapter prompt intents against the existing approved source bundle.
- Expand chapter chat coverage using already-approved sources first.
- Where a prompt intent still lacks support after scope alignment, add or refine approved source records and adapters deliberately rather than broadening prompt language vaguely.
- Prefer adding chapter-relevant sources to `chatCitations` and related adapters instead of scattering new source IDs directly into frontend prompt definitions.

Primary files:

- `src/data/source-bundles/approved-source-bundle.ts`
- `src/data/source-bundles/approved-source-bundle.test.ts`
- `backend/tests/fixtures/chatbot_sources.py`

Important rule:

- Do not widen sources randomly to force answers.
- Every added source or adapter must directly support a visible prompt family or chapter claim.

### Workstream 3: Derive backend section chat scope from approved source metadata

Goal:

- Stop frontend prompts and backend retrieval scope from drifting apart.

Tasks:

- Refactor backend section scope so it is derived from the approved source bundle's chapter chat mappings, or from a single server-safe projection of that mapping.
- Reduce the amount of duplicated hand-maintained chapter scope in `SECTION_SOURCE_IDS`.
- Preserve Django ownership of retrieval scoping and do not move privileged retrieval decisions into the frontend.
- Keep the derivation deterministic and testable.

Primary files:

- `backend/chatbot/services.py`
- `backend/retrieval/services.py`
- `backend/tests/test_chatbot_orchestration.py`
- `backend/tests/test_retrieval_service.py`

Design preference:

- Preferred: derive section source scope from bundle-backed chat citation adapters.
- Acceptable fallback: a narrow server-only mapping helper if direct derivation would couple browser metadata too tightly into backend runtime imports.

### Workstream 4: Tighten grounded-answer qualification for visible prompt audits

Goal:

- Treat visible prompt success as a release gate, not a soft suggestion.

Tasks:

- Update the prompt audit workflow so the primary release expectation is: every visible chapter prompt returns `answered` with at least one citation matching the expected approved source set.
- Keep non-`answered` classifications for diagnostics, but fail the release audit when any visible primary chapter prompt misses grounded-answer criteria.
- Preserve the distinction between:
  - source mismatch
  - weak support
  - fallback/transport failure
  - refusal/cooldown

Primary files:

- `scripts/chatbot/audit-suggested-prompts.ts`
- `specs/001-grounded-chatbot-readiness/quickstart.md`
- Optional archive QA follow-up notes if needed

Diagnostic note:

- Log size differences like `200 332` vs `200 799` can help local debugging, but the audit must assert typed outcomes and citation matches instead of byte thresholds.

### Workstream 5: Keep the chat UI aligned with the new stricter prompt contract

Goal:

- The prompt rail should only surface prompts that are known-good for the active chapter.

Tasks:

- Update the prompt rail rendering to assume a stable 5-item inventory for each primary chapter.
- Preserve current submit behavior, transcript behavior, and prompt-click flow.
- Ensure any auxiliary contexts still degrade safely if a user navigates into them.

Primary files:

- `src/components/chat/SourceAwareChat.tsx`
- `src/components/chat/SourceAwareChat.test.tsx`

## Verification Plan

### Frontend

- `pnpm exec vitest run src/data/chat/source-aware-chat.test.ts src/components/chat/SourceAwareChat.test.tsx`
- Verify:
  - 5 prompts per primary chapter
  - prompt click still submits immediately
  - no visible primary chapter prompt is marked as intentionally `limitedSupport`
  - transcript and shell behavior remain intact

### Backend

- `backend\.venv\Scripts\python.exe -m pytest -c backend\pyproject.toml backend\tests\test_chatbot_orchestration.py backend\tests\test_retrieval_service.py -q`
- Verify:
  - section scope includes the expected approved sources for each chapter
  - strong support is reachable for each visible prompt family
  - citation packaging stays stable and safe

### Bundle and source metadata

- `pnpm exec vitest run src/data/source-bundles/approved-source-bundle.test.ts`
- Verify:
  - chapter chat adapters cover every prompt-backed source
  - no chapter prompt depends on an unmapped or inactive source

### Browser confidence

- `pnpm test:e2e:layout`
- Optional targeted mocked Playwright spec if needed for prompt-rail density or label wrapping
- Verify:
  - 5 prompts remain usable and readable in the open chat shell
  - prompt clicks still produce responses without breaking containment

### Live release gate

- `pnpm chatbot:audit-prompts -- --endpoint-mode live --endpoint http://127.0.0.1:8000/api/chat --fail-on-miss`
- Release expectation:
  - every visible primary chapter prompt resolves to `followUpAction=keep`
  - every visible primary chapter prompt resolves to `classification=answered`
  - each answered prompt includes at least one matching approved citation

### Standard repo checks

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm backend:lint`
- `pnpm backend:typecheck`

Do not use `pnpm test:e2e` as the default lane for this slice unless the scope broadens and specifically requires it.

## TDD Sequence

1. Write failing frontend tests for fixed 5-prompt chapter inventories and stricter readiness expectations.
2. Write failing backend tests for chapter source scope derivation and prompt-support coverage.
3. Write failing source-bundle tests for missing chapter chat mappings.
4. Update source metadata and backend scope derivation with the smallest changes needed to make prompt support real.
5. Update the frontend prompt catalog to surface only the newly grounded 5-prompt sets.
6. Run the live prompt audit and use any misses to drive the next smallest source or prompt adjustment.
7. Refactor only after the focused suites and live audit are green.

## File Touch Map

Expected primary edits:

- `src/data/chat/source-aware-chat.ts`
- `src/data/chat/source-aware-chat.test.ts`
- `src/components/chat/SourceAwareChat.tsx`
- `src/components/chat/SourceAwareChat.test.tsx`
- `src/data/source-bundles/approved-source-bundle.ts`
- `src/data/source-bundles/approved-source-bundle.test.ts`
- `backend/chatbot/services.py`
- `backend/retrieval/services.py`
- `backend/tests/test_chatbot_orchestration.py`
- `backend/tests/test_retrieval_service.py`
- `backend/tests/fixtures/chatbot_sources.py`
- `scripts/chatbot/audit-suggested-prompts.ts`
- `specs/001-grounded-chatbot-readiness/quickstart.md`

Potential helper extraction only if earned by multiple consumers:

- server-only section source projection helper under `backend/chatbot/`

## Risks and Mitigations

- Risk: A prompt can still be semantically in scope but fail strong-support thresholds.
  - Mitigation: tune prompt wording first, widen approved source coverage second, and only then revisit retrieval thresholds if the source support is genuinely present but the ranking gate is too strict.

- Risk: Duplicating source scope in both frontend and backend will recreate drift.
  - Mitigation: prefer bundle-driven derivation or a single projection source of truth.

- Risk: Forcing 5 prompts per chapter could lead to filler prompts.
  - Mitigation: only ship prompts that pass the live grounded audit; if a chapter cannot support 5 prompts yet, the plan requires adding approved support before shipping the extra chips.

- Risk: Expanding source coverage could blur trust boundaries.
  - Mitigation: keep all new source activation deliberate, approved, and server-owned.

## Definition of Done

- Chapters 1-4 each show exactly 5 suggested prompts in the source-aware chat.
- Every visible primary chapter prompt returns an `answered` outcome against the live Django chat endpoint.
- Every visible primary chapter prompt returns at least one matching approved citation.
- Approved source coverage for those prompts is expressed through maintained bundle metadata and backend retrieval scope, not ad hoc frontend-only assumptions.
- Frontend, backend, and live prompt audit verification all pass under the constitution's red-green-refactor and changed-scope verification rules.
