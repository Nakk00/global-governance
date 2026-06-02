# Public Homepage Four-Page Deadline Implementation Plan

Status: Draft for user confirmation
Created: 2026-06-01
Scope: Plan-first reduction of the public homepage from six chapters to four
Implementation status: Not started

## Decision Summary

The production public homepage should be reduced to four polished chapters for the deadline:

1. Hero Narrative Frame
2. Global Governance Overview
3. The System Under Pressure
4. West Philippine Sea Case File

The goal is to finish a coherent project rather than spread time across six uneven chapters.

## Confirmed User Decisions

- Use the four-page structure.
- Name Chapter 3 `The System Under Pressure`.
- Make the final page case-study-first.
- Remove the old standalone Chapter 5 and Chapter 6 navbar stops from the visible production navigation.

## Page Roles

### Chapter 1: Hero Narrative Frame

Purpose:
- Open the learning experience.
- Establish the thesis: global governance is not world government.
- Invite the learner into the system-level explanation.

Implementation posture:
- Keep the already implemented production work.
- Do not redesign unless later review finds a deadline-blocking issue.

### Chapter 2: Global Governance Overview

Purpose:
- Explain the system: actors, institutions, norms, cooperation, power, and shared problems.
- Act as the conceptual map for the rest of the project.

Implementation posture:
- Keep the already implemented Chapter 2 work.
- Use the existing mockup-aligned chapter as the visual baseline for the remaining pages.

### Chapter 3: The System Under Pressure

Purpose:
- Merge the old UN Command Center and Governance Limits chapters.
- Teach both institutional coordination and enforcement limits in one focused chapter.

Core content:
- UN as a shared address for global politics.
- Major UN bodies as institutional rooms.
- Rules and institutions as useful but constrained tools.
- Enforcement limits: consent, vetoes, leverage, political will, and state interest.

Recommended layout:
- Full-page chapter with a dark-blue institutional command-room tone.
- Left side: institution explorer or UN body selector.
- Center: pressure diagram showing `Rules -> Institutions -> State Choices -> Outcomes`.
- Right side: limits panel explaining veto, consent, and uneven enforcement.
- Bottom/recap: "Institutions organize cooperation, but politics decides how far rules travel."

Implementation strategy:
- Reuse existing `UNCommandCenter` interaction as the base.
- Fold selected Governance Limits copy into the same chapter.
- Rename visible navigation and recap language.
- Redirect old `#governance-limits` deep links to this chapter only after user approval.

### Chapter 4: West Philippine Sea Case File

Purpose:
- Serve as the case-study-first final page.
- Apply the full concept to a concrete dispute.
- Close with the project thesis and source/reference trust cues.

Core content:
- Case timeline.
- Legal ruling versus political reality.
- Evidence/source inspection.
- Final takeaway: global governance is imperfect, contested, and still useful.

Recommended layout:
- Full-page case-file board with map/timeline energy.
- Top: case title and thesis.
- Middle: timeline plus evidence cards.
- Side: ruling versus reality comparison.
- Bottom: final thesis and compact references.

Implementation strategy:
- Reuse existing `WpsDossier` interaction as the base.
- Fold the current conclusion/reference content into the bottom of the WPS page.
- Remove the visible standalone `Conclusion and References` chapter from navigation only after user approval.
- Redirect old `#conclusion-references` deep links to the WPS case file only after user approval.

## Implementation Phases

### Phase 0: Confirmation Package

Status: Current step

Deliverables:
- Four-page implementation plan.
- Asset resource brief.
- First mockup image for user approval.

Exit criteria:
- User confirms the page structure, visual direction, and Chapter 3/4 merge approach.

### Phase 1: Planning Doc Alignment

Deliverables:
- Update the public homepage proposal to make the four-page scope the active deadline plan.
- Update the implementation checklist to track only four final chapters.
- Preserve old six-chapter notes as historical context, not production target.

Exit criteria:
- Planning files clearly say the deadline target is four pages.

### Phase 2: Navigation Reduction

Deliverables:
- Change production navigation from six visible chapters to four.
- Keep legacy hash redirects for old chapter IDs.
- Ensure progress displays `01 / 04`, `02 / 04`, etc.
- Keep chat available across all four chapters.

Exit criteria:
- Top navbar and mobile menu expose only four chapter stops.

### Phase 3: Chapter 3 Merge

Deliverables:
- Rename visible Chapter 3 to `The System Under Pressure`.
- Rework the existing UN chapter content to include enforcement-limit lessons.
- Remove the need for a separate Governance Limits page.

Exit criteria:
- Chapter 3 teaches institutions and limits as one coherent page.

### Phase 4: Chapter 4 Finale Merge

Deliverables:
- Rename visible final page to `West Philippine Sea Case File`.
- Keep the case study first.
- Add final thesis and compact source/reference inspection at the end of the page.
- Remove the need for a standalone Conclusion chapter.

Exit criteria:
- Chapter 4 works as both applied case and final close.

### Phase 5: Verification

Recommended checks:
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- Targeted browser/manual checks for navbar, hash routing, and chapter alignment

Note:
- Do not run the default long E2E script unless the user explicitly approves it.

## Risks

- The merged Chapter 3 may feel too broad if it tries to preserve every old detail.
- The final WPS page may become too dense if references are shown too heavily.
- Existing tests may still expect six chapters and will need targeted updates.
- Legacy hash behavior must be handled carefully so old links do not break.

## Recommended Approval Questions

Before implementation, confirm:

1. Does the Chapter 3 mockup direction feel right for `The System Under Pressure`?
2. Should Chapter 3 lean more UN-command-center or more limits/enforcement?
3. Should Chapter 4 visually feel more like an investigation board, maritime map, or courtroom dossier?
4. Are compact references at the bottom of Chapter 4 enough, or should references have an expandable drawer?
