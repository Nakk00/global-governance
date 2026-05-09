# Sprint Change Proposal - Chatbot Architecture Alignment

**Project:** Global-Governance  
**Date:** 2026-05-01  
**Workflow:** `bmad-correct-course`  
**Mode:** Batch (assumed to complete the workflow in one pass; can be revised)  
**Status:** Approved for planning-artifact implementation

## 1. Issue Summary

### Problem Statement

Story `5.3 Validate Chatbot Boundaries` completed successfully, but it confirmed that the current live chatbot implementation does not yet satisfy the fuller grounded-chat architecture already described in the project PRD, architecture, and the archived chatbot architecture spec.

The current implementation is a validated MVP shell with:

- a polished chat UI
- typed answered / weak-support / refused / cooldown states
- approved-source bundle governance
- ingestion preparation and deterministic storage contracts
- live validation of boundary behavior

However, the current live chat path is still heuristic and local in its core answer assembly. It does not yet deliver the full retrieval-backed chatbot behavior implied by the existing product direction.

### Trigger Context

The issue became clear after finishing Story `5.3` and reviewing the desired architecture in `archive/docs/planning-artifacts/global_governance_chatbot_architecture_spec.md`.

### Evidence

- `supabase/functions/_shared/chat-grounding.ts` retrieves citations by keyword matching against bundle metadata instead of vector retrieval over ingested chunks.
- `supabase/functions/_shared/chat-grounding.ts` returns a fixed answer template rather than generating from retrieved context.
- `supabase/functions/_shared/ingestion-pipeline.ts` currently creates deterministic placeholder embeddings rather than real provider embeddings.
- `supabase/functions/chat/index.ts` goes directly from protection checks to local answer assembly, without explicit topic-check orchestration, reranking, or safety screening.

### Issue Type

- Technical limitation discovered during implementation
- Requirements-to-backlog mismatch discovered during sprint execution

## 2. Impact Analysis

### Epic Impact

#### Current Epic Affected

Epic `5 Content Stewardship and Demo Reliability` is directly affected.

Epic 5 can still complete successfully, but not in its current order if the existing architecture spec remains in MVP scope. `5.4 Rehearse Demo Readiness` should not be the next implementation story if the chatbot is expected to demonstrate real retrieval, model-backed grounding, and explicit guard orchestration.

#### Future Epic Impact

Epic `6 Adaptive Presentation and Future Expansion` is indirectly affected.

The current `6.1 Switch Explanation Depth` story should remain post-MVP, but it should explicitly preserve compatibility with future chatbot answer-depth changes so the chat contract does not need a later redesign.

### Story Impact

#### Stories That Remain Valid

- `5.1 Manage Approved Source Bundles`
- `5.2 Prepare Sources for Ingestion`
- `5.3 Validate Chatbot Boundaries`

These stories remain valuable and should not be rolled back. They provide the governance, ingestion, and validation foundation the fuller chatbot stack will build on.

#### Stories Requiring Re-sequencing

- `5.4 Rehearse Demo Readiness`
- `5.5 Bootstrap the Working Environment`

These should move later in Epic 5 because the chatbot architecture gap should be closed before full demo rehearsal and final workflow handoff.

#### New Story Gaps Identified

Two missing implementation slices are needed:

1. A story for real retrieval-backed answer orchestration
2. A story for explicit topic guard, safety guard, and server-driven prompt/suggestion behavior

### Artifact Conflicts

#### PRD

The PRD is directionally correct, but it is too easy to interpret "grounded chatbot MVP" as satisfied by a bounded heuristic implementation. It needs more explicit wording that MVP chatbot completion means retrieval-backed answering over ingested sources, with topic and safety checks in the server path.

#### Epics

The epic backlog is the main artifact conflict. The architecture direction already exists, but the story plan does not fully cover it before demo-readiness work begins.

#### Architecture

The architecture document is mostly aligned already. It needs a clarification that the retrieval-backed chat pipeline is still an implementation gap and that heuristic bundle matching is only a temporary milestone, not architectural completion.

#### UX Design

The UX spec does not need major redesign. Minor clarification is enough:

- section-aware suggestions should come from the server contract
- future Student / Expert chat depth is an extension point, not an MVP dependency

### Technical Impact

- Supabase Edge Functions will need new orchestration logic for topic checking, retrieval, reranking, and safety filtering.
- Ingestion and retrieval contracts will need to move from placeholder embeddings to real provider-backed query and chunk embeddings.
- The current `chat` and `chat-retrieve` flow will need contract-preserving internal replacement so the frontend UI can stay stable.
- Validation suites must expand from boundary correctness to retrieval/generation orchestration correctness.

### Recommended Five-Model Baseline

The implementation baseline should explicitly adopt a five-model grounded-copilot stack sourced from NVIDIA Build's currently listed Llama-family offerings.

Recommended default stack:

- **Generation model:** `nvidia/llama-3_3-nemotron-super-49b-v1_5`
- **Embedding model:** `nvidia/llama-nemotron-embed-1b-v2`
- **Rerank model:** `nvidia/llama-nemotron-rerank-1b-v2`
- **Topic guard model:** `nvidia/llama-3_1-nemoguard-8b-topic-control`
- **Safety guard model:** `nvidia/llama-3_1-nemotron-safety-guard-8b-v3`

These model selections should be treated as the approved planning baseline for implementation, while remaining revisable if NVIDIA Build availability, latency, pricing, licensing, or deployment constraints materially change during execution.

## 3. Recommended Approach

### Selected Path

**Hybrid, led by Option 1: Direct Adjustment**

Use direct adjustment of the existing plan by adding and resequencing stories within Epic 5, plus targeted clarifications in PRD, architecture, and UX artifacts.

### Why This Is Recommended

- It preserves momentum from `5.1` to `5.3` instead of discarding validated work.
- It keeps the overall product direction intact; this is not a strategic pivot.
- It closes the gap in the narrowest useful way: backlog correction, not product restart.
- It keeps Student / Expert mode in post-MVP scope while making sure the chat contract stays extensible.

### Alternatives Considered

#### Option 2: Potential Rollback

**Not recommended**

Rolling back `5.1` to `5.3` would remove useful and already-correct foundation work. The issue is not that those stories were wrong; it is that they did not finish the full chatbot architecture.

Effort: High  
Risk: High

#### Option 3: PRD MVP Review

**Partially viable but not preferred**

This would reduce MVP scope by redefining the current heuristic chatbot as sufficient. That would simplify implementation, but it would weaken alignment with the architecture, the archived chatbot spec, and the retrieval-based direction already baked into the project documents.

Effort: Low to Medium  
Risk: Medium to High

### Effort, Risk, Timeline

- Effort: Medium
- Risk: Medium
- Timeline impact: Moderate backlog extension within Epic 5 before demo-readiness rehearsal

### Recommendation Summary

Do not rollback completed work.  
Do not redefine MVP downward unless schedule pressure becomes severe.  
Instead, add the missing chatbot implementation stories and resequence Epic 5.

## 4. Detailed Change Proposals

### A. Story Backlog Changes

#### Proposal A1 - Insert a retrieval-backed chat implementation story before demo rehearsal

**Artifact:** `epics.md`  
**Section:** Epic 5 story list

**OLD:**

```md
### Story 5.4: Rehearse Demo Readiness

As a maintainer,
I want to validate the full learning flow and interactive modules in a demo rehearsal,
So that I can present the site without broken core states.
```

**NEW:**

```md
### Story 5.4: Orchestrate Retrieval-Backed Grounded Answers

As a maintainer,
I want the live chatbot to retrieve approved chunks and assemble answers from that retrieved context,
So that grounded responses are based on the ingestion pipeline rather than heuristic bundle matching.

Acceptance Criteria:

Given I submit an on-topic course question
When the live chat path runs
Then it embeds the query, retrieves candidate chunks from the ingestion-backed retrieval store, and assembles citations from retrieved support
And it does not rely on keyword-only bundle matching for final grounding

Given retrieved support is strong
When answer assembly completes
Then the returned answer is grounded in the selected context and cites the canonical approved source ids backing that context
And the chat response preserves the existing typed success envelope

Given retrieved support is weak
When the retrieval set is insufficient
Then the system returns the existing weak-support state instead of fabricating certainty
And the fallback remains visible in the current UI

Given I compare chat with chat-retrieve for the same prompt and currentSectionId
When both endpoints run
Then the cited source ids align with the retrieval set used for that response
And retrieval parity remains testable through function and live validation coverage
```

**Rationale:** This story closes the largest gap between the current implementation and the intended grounded-chat architecture.

#### Proposal A2 - Insert explicit topic and safety orchestration before demo rehearsal

**Artifact:** `epics.md`  
**Section:** Epic 5 story list

**OLD:**

```md
### Story 5.5: Bootstrap the Working Environment

As a maintainer,
I want a documented clean-clone setup for the project foundation and chatbot workflow,
So that I can start from scratch and reach a working local environment quickly.
```

**NEW:**

```md
### Story 5.5: Add Topic Guard, Safety Guard, and Guided Chat Suggestions

As a maintainer,
I want the live chat stack to apply explicit topic and safety controls with server-driven prompt guidance,
So that the assistant stays bounded before retrieval and safe before final response delivery.

Acceptance Criteria:

Given I submit an off-topic prompt
When the chat request is evaluated
Then an explicit topic-guard step determines the prompt is outside approved scope
And the response returns the existing typed refusal contract without entering full grounded-answer generation

Given a retrieved answer draft contains unsafe or inappropriate content
When the safety guard runs
Then the user receives a neutral safe fallback or safe reformulation
And no unsafe content is returned as the final answer

Given the chat panel needs suggested prompts
When the suggestions endpoint is called
Then it returns approved, section-aware prompt suggestions from a server contract
And the frontend consumes them without introducing privileged logic into browser components

Given validation suites run
When function, runner, and live browser checks execute
Then off-topic handling, safety fallback, and suggestion behavior are covered alongside the existing boundary states
And the flow remains within the chatbot latency and fallback expectations already defined for MVP use
```

**Rationale:** This story aligns the live stack with the architecture's explicit guardrail model and the server-owned prompt strategy.

#### Proposal A3 - Resequence the remaining Epic 5 stories

**Artifact:** `epics.md` and `sprint-status.yaml` after approval  
**Section:** Epic 5 story ordering

**OLD:**

```md
5-4-rehearse-demo-readiness
5-5-bootstrap-the-working-environment
```

**NEW:**

```md
5-4-orchestrate-retrieval-backed-grounded-answers
5-5-add-topic-guard-safety-guard-and-guided-chat-suggestions
5-6-rehearse-demo-readiness
5-7-bootstrap-the-working-environment
```

**Rationale:** Demo rehearsal and final workflow bootstrap should happen after the live chatbot architecture matches the intended MVP path.

#### Proposal A4 - Clarify future depth-mode impact in Epic 6

**Artifact:** `epics.md`  
**Section:** Story `6.1 Switch Explanation Depth`

**OLD:**

```md
Given explanation depth features are enabled
When I switch between simplified and expanded content
Then the affected sections update to reflect the chosen depth
And the meaning of the content stays consistent across modes
```

**NEW:**

```md
Given explanation depth features are enabled
When I switch between simplified and expanded content
Then the affected sections, and any depth-aware chatbot answer formatting introduced later, update to reflect the chosen depth
And the meaning, grounding, and citation behavior stay consistent across modes
```

**Rationale:** This keeps Student / Expert depth as post-MVP while preventing a future chat-contract mismatch.

### B. PRD Modifications

#### Proposal B1 - Clarify what "grounded chatbot MVP" means

**Artifact:** `prd.md`  
**Section:** MVP Feature Set / Grounded chatbot scope

**OLD:**

```md
- grounded chatbot that answers only from approved sources
```

**NEW:**

```md
- grounded chatbot that answers only from approved sources through server-side retrieval over ingested approved materials, with explicit topic-bounded and safety-aware response handling
```

**Rationale:** This removes ambiguity between a heuristic bundle-based helper and the intended retrieval-backed MVP implementation.

#### Proposal B1b - Name the default five-model implementation baseline

**Artifact:** `prd.md`  
**Section:** Chatbot Product Requirement or Backend / Data / AI stack

**OLD:**

```md
- Generation model
- Embedding model
- Rerank model
- Topic guard model
- Safety guard model
```

**NEW:**

```md
- Generation model: `nvidia/llama-3_3-nemotron-super-49b-v1_5`
- Embedding model: `nvidia/llama-nemotron-embed-1b-v2`
- Rerank model: `nvidia/llama-nemotron-rerank-1b-v2`
- Topic guard model: `nvidia/llama-3_1-nemoguard-8b-topic-control`
- Safety guard model: `nvidia/llama-3_1-nemotron-safety-guard-8b-v3`
```

**Additional note to insert near that list:**

```md
These are the approved default models for implementation planning and may be revised only if testing exposes material availability, latency, pricing, licensing, or deployment issues.
```

**Rationale:** This makes the planning artifacts implementation-ready rather than leaving model choice ambiguous.

#### Proposal B2 - Clarify post-MVP versus MVP chatbot depth

**Artifact:** `prd.md`  
**Section:** Post-MVP Features

**OLD:**

```md
- Student / Expert Mode
- richer chatbot user experience, including stronger prompt guidance and more polished source interaction
```

**NEW:**

```md
- Student / Expert Mode, including future answer-depth alignment for the chatbot when that feature is introduced
- richer chatbot user experience, including stronger prompt guidance and more polished source interaction beyond the MVP retrieval and guardrail baseline
```

**Rationale:** This keeps retrieval/guardrails in MVP while preserving answer-depth as a later enhancement.

### C. Architecture Modifications

#### Proposal C1 - Clarify that heuristic grounding is not architectural completion

**Artifact:** `architecture.md`  
**Section:** Implementation Sequence or Gap Analysis

**OLD:**

```md
6. implement Edge Function chat surface and retrieval pipeline
7. connect source-aware citations to the frontend
8. add validation, smoke tests, and demo-readiness checks
```

**NEW:**

```md
6. implement retrieval-backed Edge Function chat orchestration over ingested chunks, including provider-backed embeddings and citation packaging
7. implement explicit topic guard, reranking, safety filtering, and suggestion endpoints behind the same server boundary
8. connect source-aware citations and suggestions to the frontend without changing the typed UI contract
9. add validation, smoke tests, and demo-readiness checks after the live retrieval path is in place
```

**Rationale:** This makes the intended implementation sequence explicit and avoids treating the current heuristic chat as final architecture compliance.

#### Proposal C2 - Add an explicit model-provider baseline to architecture

**Artifact:** `architecture.md`  
**Section:** API & Communication Patterns, Data Architecture, or a new "Model Orchestration Baseline" subsection

**OLD:**

```md
- External model providers are called only from Edge Functions, never from the browser.
```

**NEW:**

```md
- External model providers are called only from Edge Functions, never from the browser.
- The default MVP model baseline uses NVIDIA Build-hosted Llama-family models:
  - generation: `nvidia/llama-3_3-nemotron-super-49b-v1_5`
  - embeddings: `nvidia/llama-nemotron-embed-1b-v2`
  - rerank: `nvidia/llama-nemotron-rerank-1b-v2`
  - topic guard: `nvidia/llama-3_1-nemoguard-8b-topic-control`
  - safety guard: `nvidia/llama-3_1-nemotron-safety-guard-8b-v3`
- These model choices are the planning baseline and can be revised only if implementation testing identifies material service constraints.
```

**Rationale:** This locks the architectural intent to a concrete implementation target without putting provider decisions into browser code or UI contracts.

### D. UX Design Modifications

#### Proposal D1 - Clarify server-driven suggestions and future depth-aware chat

**Artifact:** `ux-design-specification.md`  
**Section:** Source-Aware Chat Panel

**OLD:**

```md
Anatomy: Entry button or dock, chat panel, prompt suggestions, message list, answer body, source chips or source drawer, fallback messaging.
```

**NEW:**

```md
Anatomy: Entry button or dock, chat panel, server-driven prompt suggestions, message list, grounded answer body, source chips or source drawer, and fallback messaging.
```

**Additional insertion near variants or interaction behavior:**

```md
Future Student / Expert answer-depth behavior should layer onto this surface only after the core grounded retrieval path is complete, and it must preserve source visibility and typed fallback states.
```

**Rationale:** The UX stays materially the same, but the ownership boundary and future depth-mode expectations become clearer.

### E. Sprint Proposal Baseline Note

#### Proposal E1 - Record the exact five-model stack in the change proposal itself

**Artifact:** `sprint-change-proposal-2026-05-01.md`  
**Section:** Impact Analysis or Recommended Approach

**Insertion:**

```md
Approved default five-model stack for planning:

- Generation: `nvidia/llama-3_3-nemotron-super-49b-v1_5`
- Embedding: `nvidia/llama-nemotron-embed-1b-v2`
- Rerank: `nvidia/llama-nemotron-rerank-1b-v2`
- Topic Guard: `nvidia/llama-3_1-nemoguard-8b-topic-control`
- Safety Guard: `nvidia/llama-3_1-nemotron-safety-guard-8b-v3`

These are the implementation-planning defaults, not an immutable forever lock.
```

**Rationale:** This keeps the proposal self-contained so later artifact updates have an explicit source decision to trace back to.

## 5. Implementation Handoff

### Scope Classification

**Moderate**

This change does not require a product restart or a new vision. It does require backlog reorganization, story insertion, and coordinated implementation planning before further Epic 5 execution.

### Recommended Handoff

- **Product Owner / Developer**

### Responsibilities

#### Product Owner / Planning Responsibility

- approve the Sprint Change Proposal
- update `epics.md` with the inserted and resequenced stories
- update `sprint-status.yaml` after approval so the next backlog item becomes the new chatbot implementation story

#### Developer Responsibility

- implement the newly approved retrieval-backed and guardrail stories in sequence
- preserve the existing UI contract and boundary-validation surface where possible
- extend tests and maintainer workflows to cover the new orchestration path
- use the approved NVIDIA Build five-model baseline unless implementation testing justifies a documented change

### Success Criteria for Implementation

- live chat uses retrieval over ingested chunks instead of keyword-only bundle matching
- answer assembly is grounded in retrieved context and preserves canonical source ids
- explicit topic guard and safety guard exist in the server flow
- demo rehearsal happens only after the new chatbot path is validated
- Student / Expert mode remains post-MVP, but the chat contract does not block it later

## 6. Checklist Execution Log

### Section 1 - Understand the Trigger and Context

- `1.1` `[x] Done` Trigger story identified as `5.3 Validate Chatbot Boundaries`
- `1.2` `[x] Done` Core problem defined as implementation gap plus backlog mismatch
- `1.3` `[x] Done` Evidence documented from current chat and ingestion code

### Section 2 - Epic Impact Assessment

- `2.1` `[!] Action-needed` Epic 5 must be resequenced before completion
- `2.2` `[x] Done` Existing epic should be modified, not replaced
- `2.3` `[x] Done` Remaining epics reviewed for impact
- `2.4` `[x] Done` No future epic invalidated; new stories required
- `2.5` `[x] Done` Priority change identified

### Section 3 - Artifact Conflict and Impact Analysis

- `3.1` `[!] Action-needed` PRD wording should be tightened
- `3.2` `[!] Action-needed` Architecture sequence should be clarified
- `3.3` `[x] Done` UX impact is minor and bounded
- `3.4` `[!] Action-needed` Secondary planning artifacts require follow-up after approval

### Section 4 - Path Forward Evaluation

- `4.1` `[x] Viable` Direct adjustment is the best path
- `4.2` `[x] Not viable` Rollback is unnecessary and costly
- `4.3` `[x] Partially viable but not preferred` PRD MVP reduction is available only if schedule pressure becomes severe
- `4.4` `[x] Done` Recommended path selected as Hybrid led by direct adjustment

### Section 5 - Sprint Change Proposal Components

- `5.1` `[x] Done` Issue summary created
- `5.2` `[x] Done` Epic and artifact impact documented
- `5.3` `[x] Done` Recommended path documented
- `5.4` `[x] Done` MVP impact and high-level action plan documented
- `5.5` `[x] Done` Handoff plan documented

### Section 6 - Final Review and Handoff

- `6.1` `[x] Done` Checklist reviewed for completeness
- `6.2` `[x] Done` Proposal reviewed for internal consistency
- `6.3` `[x] Done` Explicit user approval received on 2026-05-01
- `6.4` `[x] Done` `sprint-status.yaml` updated to reflect the approved story resequencing
- `6.5` `[x] Done` Final handoff confirmed to Product Owner / Developer workflow

## 7. Approval Gate

Approved on 2026-05-01.

Implementation of the approved planning changes proceeds through:

- updated planning artifacts
- updated `sprint-status.yaml`
- Product Owner / Developer handoff for story creation and implementation sequencing
