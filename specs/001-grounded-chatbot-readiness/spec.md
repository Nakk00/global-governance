# Feature Specification: Grounded Chatbot Readiness

**Feature Branch**: `[001-grounded-chatbot-readiness]`

**Created**: 2026-06-06

**Status**: Draft

**Input**: User description: "Create an MVP public grounded chatbot and maintainer readiness workflow for the Global Governance website, based on the planning artifacts in `archive/docs/planning-artifacts/plans-for-chatbot`."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ask Within Scope With Trust Cues (Priority: P1)

A learner asks a question about the current Global Governance lesson and receives a bounded response that is clearly grounded in approved materials, adapted to the selected learning depth, and explicit about whether support is strong, limited, refused, or temporarily restricted.

**Why this priority**: The public chatbot only has value if learners can trust its answers and understand what kind of answer they are receiving.

**Independent Test**: Can be fully tested by asking in-scope, off-topic, and low-support questions from the public learning flow and verifying that each response stays within scope, shows the right trust cues, and remains understandable without maintainer involvement.

**Acceptance Scenarios**:

1. **Given** a learner is viewing an approved lesson topic and asks an in-scope question, **When** the chatbot has sufficient support, **Then** it returns an answer adapted to the selected depth mode and visibly shows that the answer is supported by approved material.
2. **Given** a learner asks a question with only partial support in approved materials, **When** the chatbot responds, **Then** it returns a limited-support outcome that explains the constraint and avoids overclaiming.
3. **Given** a learner asks an off-topic or disallowed question, **When** the chatbot responds, **Then** it returns a refusal outcome that explains scope boundaries and redirects the learner toward relevant approved topics.
4. **Given** a learner asks a follow-up question in the same chat session, **When** the new response is returned, **Then** the previous questions, answers, citations, refusals, weak-support states, and cooldown states remain reviewable in the visible transcript.

---

### User Story 2 - Stay In The Lesson During Degraded Chat States (Priority: P2)

A learner remains able to continue the lesson when chat is unavailable, throttled, or unable to answer fully, using suggested questions, section-aware prompts, and fallback guidance that preserves the learning flow.

**Why this priority**: The learning experience must stay usable even when the chatbot is limited, slow, unavailable, or under protection controls.

**Independent Test**: Can be fully tested by simulating unavailable chat, cooldown, and weak-support conditions while a learner is inside a lesson section and verifying that the page still offers understandable next steps without breaking navigation.

**Acceptance Scenarios**:

1. **Given** a learner is in a specific lesson section, **When** they open chat before typing, **Then** they see suggested questions relevant to the current topic or approved core themes.
2. **Given** the chatbot is temporarily unavailable or fails to complete a request, **When** the learner is still on the lesson page, **Then** the interface provides fallback guidance or static approved support that allows the learner to continue without leaving the lesson.
3. **Given** a learner exceeds public-use protection limits, **When** the cooldown state is triggered, **Then** the interface shows a calm, understandable cooldown outcome instead of a raw failure and preserves access to the surrounding lesson content.
4. **Given** the learner opens the chat panel on a desktop or narrow viewport, **When** the panel is open and the learner types a multi-line question, **Then** the panel remains contained in the viewport, the launcher is not duplicated beneath it, and the composer grows or scrolls without creating blank unusable space.

---

### User Story 3 - Judge Readiness And Trust As A Maintainer (Priority: P3)

A maintainer opens the protected readiness workflow and can quickly determine whether chatbot grounding is trustworthy, which sources or validations need attention, and what next action should be taken before a demo or release.

**Why this priority**: The public chatbot becomes hard to trust or demonstrate if maintainers cannot quickly see readiness, blockers, and source-quality issues.

**Independent Test**: Can be fully tested by opening the protected maintainer workflow with a mix of healthy, warning, and failed source/validation states and verifying that a maintainer can identify issues and navigate to the affected records.

**Acceptance Scenarios**:

1. **Given** a maintainer opens the readiness workflow, **When** current source and validation data are available, **Then** they see an overall readiness summary, current blockers, recent checks, and recommended next actions.
2. **Given** a validation run identifies a source or grounding problem, **When** the maintainer inspects the result, **Then** they can see the status, reason, affected source, and an actionable next step.
3. **Given** a maintainer needs to understand what changed, **When** they view the audit area, **Then** they can review recent source, validation, and chatbot-trust-related events with clear filtering and timestamps.

### Edge Cases

- How does the chatbot respond when the learner asks an in-scope question but no approved source support is available for a confident answer?
- How does the experience behave when section context is missing, stale, or contradictory with the learner's prompt?
- How does the public chat respond when repeated requests trigger throttling, cooldown, or anti-abuse escalation?
- How is the learning flow preserved when chat services are slow, unavailable, or return a non-user-friendly failure?
- How are unsafe, adversarial, or instruction-probing prompts handled without exposing internal behavior or widening scope?
- How does the maintainer workflow behave when readiness, validation, or audit data are partially unavailable?
- How does the feature behave with keyboard-only navigation, reduced motion, and visible focus?
- What fallback, empty, loading, or error state keeps the core learning flow usable?
- If chat or grounding is involved, how are refusal, weak-support, and cooldown states represented as typed successful responses?
- How does the learner review prior turns when they ask multiple questions during one page session?
- How does the chat launcher behave after the panel is open, especially at the bottom-right edge of the viewport?
- How does the composer behave when a learner types or scrolls a three-line or longer prompt?
- What happens when a suggested prompt cannot be answered from the currently scoped approved sources?
- How do section-scoped source filters stay aligned with approved evidence already used by the visible lesson chapter?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST answer public learner chat questions only within the approved Global Governance subject scope and approved learning materials.
- **FR-002**: The system MUST adapt learner-facing explanations to at least two depth modes. The canonical contract values are `student` for the simpler beginner-friendly mode and `expert` for the more detailed advanced mode.
- **FR-003**: The system MUST present every learner-facing chat outcome with a visible trust state that distinguishes grounded support, limited support, refusal, cooldown, and fallback behavior.
- **FR-004**: The system MUST show visible source support details whenever an answer is grounded in approved material.
- **FR-005**: The system MUST use the learner's current lesson section or topic as contextual guidance when that context is available.
- **FR-006**: The system MUST offer suggested learner questions that reflect the current lesson context or approved core topics.
- **FR-007**: The system MUST preserve lesson continuity when chat is unavailable, delayed, or unable to answer by presenting fallback guidance that lets the learner continue without leaving the lesson.
- **FR-008**: The system MUST return bounded refusal outcomes for off-topic requests and safe bounded outcomes for unsafe or abusive requests.
- **FR-009**: The public learner experience MUST submit chat requests through a controlled server-side workflow before any privileged retrieval, policy enforcement, or answer drafting occurs.
- **FR-010**: The system MUST prevent browser-exposed access to privileged source retrieval, approval workflows, secret-bearing operations, or unrestricted answer-generation controls.
- **FR-011**: The system MUST validate public chat request shape, reject malformed input, cap the JSON request body at 8 KiB, cap the normalized learner question at 2,000 characters, cap learner-visible answer text at 4,000 characters, cap visible citations at 6 items, and reject oversized input before expensive processing continues.
- **FR-012**: The system MUST enforce public-use protection behavior that includes throttling, abuse detection, and cooldown responses appropriate for anonymous or unauthenticated usage.
- **FR-013**: The transient protection state for rate limits, abuse counters, cooldown markers, or similar short-lived controls MUST remain separate from the authoritative record of approved sources, grounded content, and long-term references.
- **FR-014**: Any Redis caching used by the public chat workflow MUST be short-lived, Django-owned, TTL-bound, versioned, keyed without raw learner prompts, and prevented from becoming the source of truth for approved content, retrieval chunks, embeddings, citations, validation records, or broad final answers.
- **FR-015**: The system MUST prevent raw private source materials from being publicly downloadable unless an item is intentionally designated for public release.
- **FR-016**: The protected maintainer workflow MUST show an overall readiness view that summarizes health, blockers, recent validation or audit activity, and recommended next actions.
- **FR-017**: The protected maintainer workflow MUST show source status information with clear labels for healthy, outdated, missing, invalid, or review-needed materials.
- **FR-018**: The protected maintainer workflow MUST let maintainers inspect validation results, understand failure reasons, and navigate from an issue to the affected source or grounding area.
- **FR-019**: The protected maintainer workflow MUST expose an audit trail of source changes, validation runs, and trust-relevant administrative events with filtering by time and event type.
- **FR-020**: The protected maintainer workflow MUST use understandable loading, empty, retry, and error states that help maintainers decide what to do next.
- **FR-021**: The MVP scope MUST include the deliberate public-chat cutover from Supabase Edge Functions to Django, and MUST exclude learner accounts, LMS integration, open-domain assistant behavior, public maintainer access, broad grounded-answer caching, and any additional public-chat runtime migration beyond the Django cutover.
- **FR-022**: Every behavior-changing implementation slice MUST follow red-green-refactor, cover relevant happy, edge, error, and boundary cases at the fastest sufficient test layer, and achieve at least 80% coverage for new or materially changed executable code in every metric reported by the selected coverage tools.
- **FR-023**: Before the MVP can claim a strongly grounded learner answer, the system MUST process at least one approved material from `archive/docs/approved-sources/` or the protected upload workflow into private durable document, chunk, citation, and real embedding records; ingestion failure MUST remain visible, MUST block activation, and MUST NOT be reported as successful readiness. Real embeddings mean provider-produced vectors with recorded model identity and dimensions; deterministic or synthetic vectors are allowed only in tests or dry-run evidence and must never activate a source.
- **FR-024**: The public chat interface MUST preserve an append-only session-local transcript of learner questions and typed chat outcomes so learners can review prior answers, source support, weak-support guidance, refusals, cooldowns, and transport recovery states without leaving the lesson.
- **FR-025**: The open public chat panel MUST remain contained within the visible viewport, hide or transform the closed-state launcher while open, preserve keyboard/focus access, and keep the input composer stable when learner text spans multiple lines.
- **FR-026**: Suggested learner questions MUST be auditable against the approved source corpus; prompts that cannot be answered or bounded from approved materials MUST be reworded, removed, or backed by deliberately added approved course-relevant sources.
- **FR-027**: Section-scoped retrieval MUST align with the approved source evidence already used by that lesson section, and any intentionally narrower scope MUST be documented with a learner-safe fallback expectation.

### Key Entities *(include if feature involves data)*

- **Learner Chat Prompt**: A public learner question plus the active lesson context and selected explanation depth.
- **Chat Outcome**: The bounded learner-facing result of a prompt, including grounded answer, limited-support answer, refusal, cooldown, or fallback state.
- **Chat Transcript Entry**: A session-local learner or assistant turn preserved by the browser chat surface so earlier questions, typed outcomes, and citations remain reviewable during the current page session.
- **Source Support Record**: The approved material references or support summary associated with a grounded or limited-support chat outcome.
- **Suggested Prompt Readiness Result**: The audit classification for a suggested prompt, including answered, limited support, boundary/refusal, weak citation, cooldown, transport failure, or missing-source follow-up.
- **Section Source Scope**: The approved source identifiers Django may retrieve for a lesson section, expected to match the approved evidence used by that section unless a narrower policy is explicitly documented.
- **Protection Signal**: Short-lived public-use control data such as request counts, cooldown state, or abuse indicators that influence whether the chat may proceed.
- **Operational Cache Entry**: A short-lived Redis entry used by Django for protection, guard, query-helper, or retrieval-helper acceleration without storing canonical source content or broad final answers.
- **Source Record**: An approved learning material item tracked for readiness, validation, trust, and maintainer review.
- **Validation Result**: The outcome of a source or chatbot-trust check, including status, failure reason, affected area, and suggested next action.
- **Readiness Snapshot**: A maintainer-facing summary of current chatbot trust, source health, blockers, and recent checks.
- **Audit Event**: A recorded source, validation, or administrative action relevant to chatbot trust and release readiness.

### Constitution Alignment *(mandatory)*

- **Runtime Boundary**: The feature preserves the existing public SPA for learner-facing chat, keeps protected maintainer workflows within the protected administrative surface, and moves public chatbot orchestration, Redis-backed protection, retrieval policy, model routing, and citation packaging into Django. Supabase remains the private storage and Postgres/pgvector data layer for approved materials, chunks, embeddings, citations, and source metadata.
- **Ownership Boundary**: Learner chat presentation and maintainer workflow presentation remain owned by their respective frontend feature areas; protected stewardship and readiness decisions remain owned by the protected admin domain; public grounding, scope control, Redis protection state, NVIDIA model orchestration, and retrieval-policy orchestration are owned by the Django backend; any shared contract is limited to stable envelopes for chat outcomes and readiness data.
- **Privileged Logic Boundary**: Approved-source retrieval, private material access, security controls, abuse protection signals, secret-bearing operations, and citation packaging remain outside browser-facing code.
- **Boundary Contracts and States**: Public chat requests, chat outcomes, source statuses, readiness summaries, and validation results are treated as explicit contracts. Refusal, weak-support, cooldown, fallback, loading, and partial-data conditions are modeled as deliberate user-understandable states rather than raw transport failures.
- **Accessible Resilience**: The learner and maintainer experiences preserve keyboard access, visible focus, reduced-motion behavior, responsive layouts, and usable fallback, empty, loading, and error states. The lesson remains usable when chat is limited or unavailable.
- **Cohesion and Styling**: Public chat and maintainer readiness remain separate feature-owned workflows with feature-owned visual behavior. Any shared abstraction must be justified by stable cross-workflow contracts rather than convenience alone.
- **Verification Intent**: The fastest intended proof combines focused frontend state coverage for chat and maintainer UI behavior, request-boundary coverage for public chat and readiness contracts, and a small browser-level validation pass for critical learner and maintainer flows.
- **TDD and Coverage Intent**: Each user story begins with focused failing tests for its observable contracts and degraded states before implementation. Frontend Vitest/MSW and backend pytest carry the behavior matrices; Playwright and the live-chat canary prove only critical browser and real-endpoint journeys. Coverage is measured over new or materially changed executable files and must meet at least 80% for every reported metric.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance review, at least 18 of the 20 in-scope learner prompts recorded in the feature acceptance set return either a grounded answer or a clearly labeled limited-support answer in a single response cycle.
- **SC-002**: All 12 prompts in the degraded and off-topic acceptance set return a bounded learner-understandable outcome instead of an unclassified failure state.
- **SC-003**: In maintainer testing against the feature acceptance fixture set, a maintainer can determine overall readiness status, current blockers, and recommended next actions within 2 minutes of opening the protected readiness workflow.
- **SC-004**: In acceptance review, at least 9 of the 10 sampled validation findings in the feature acceptance set can be traced from the maintainer workflow to the affected source or grounding area in one navigation flow.
- **SC-005**: During degraded-chat validation, learners can continue the current lesson and access at least one relevant fallback action or suggested question without leaving the lesson page.
- **SC-006**: In trust-cue review, at least 9 of the 10 scripted learner-state examples in the feature acceptance set can be correctly identified as grounded, limited-support, refused, or in cooldown by reading the visible chat state cues alone.
- **SC-007**: Automated coverage reports show at least 80% coverage for every reported metric across the feature's new or materially changed executable code, with no skipped or disabled test used to satisfy an acceptance or coverage gate without a documented removal condition.
- **SC-008**: Before grounded-chat acceptance review, 100% of files selected from the canonical approved-source manifest either produce traceable private storage, document, chunk, citation, and non-synthetic vector records or produce an explicit failed ingest result; at least one successfully processed source is approved and active.
- **SC-009**: In chatbox QA review, a three-turn learner session preserves all prior questions and typed outcomes in the visible transcript while the latest answer is added.
- **SC-010**: In desktop and narrow viewport browser checks, the open chat panel stays within the viewport, the closed-state launcher is not visible beneath the open panel, and a three-line or longer composer input does not create large blank space.
- **SC-011**: Before release, 100% of suggested prompt catalog entries are classified by the prompt-readiness audit, and every kept prompt is either answerable from approved materials or intentionally bounded with learner-safe limited-support guidance.

## Assumptions

- Approved learning materials, references, and source stewardship practices already exist or are being curated in current project workflows.
- Learners select or inherit their explanation depth within the current session rather than through a personal account system.
- The current lesson section or topic can be made available to the chat workflow for context when the learner is inside a supported learning surface.
- Maintainer access remains protected and continues to use the project's private administrative access patterns rather than becoming a public workflow.
- Public-use protection behavior is designed for anonymous or unauthenticated learners and does not depend on account creation.
- Short-lived protection state is used only for operational control signals and not as the source of truth for approved materials, grounded references, or long-term content.
- Redis caching, where used, is an implementation acceleration for Django-owned runtime decisions and remains invisible to anonymous browser clients except through normal typed chat outcomes.
- The MVP remains within the current multi-runtime architecture and does not add a new router, global store, public admin surface, or any public-chat runtime cutover beyond the explicit move to Django.
