# Architecture Research

## Major Components

1. **Narrative SPA shell**
   - Public learner flow, hash navigation, progress/orientation, section rendering
2. **Depth-aware content model**
   - Shared content structure for Student / Expert copy variants, recaps, and module summaries
3. **Flagship learning modules**
   - UN Command Center and West Philippine Sea dossier
4. **Grounded chat surface**
   - Learner-facing chat UI and session context wiring in `src/`
5. **Supabase Edge chat runtime**
   - Active public chat request handling, grounding, refusal, cooldown, and protection behavior
6. **Reference and source-support layer**
   - Approved source bundles, citation surfaces, and evidence drawers
7. **Private maintainer frontend**
   - Readiness overview, source stewardship, validation, inspection, and audit UX
8. **Protected Django API boundary**
   - Maintainer auth verification and orchestration over protected data flows
9. **Verification and rehearsal layer**
   - Unit, function, backend, and browser checks that keep the product presentation-safe

## Data Flow

### Public Learning Flow

1. The SPA mounts the narrative shell and section navigation.
2. Static educational content is read from typed content modules.
3. Flagship modules enrich selected sections without changing the route model.
4. References and support drawers expose academic evidence alongside the flow.

### Depth-Mode Flow

1. User selects Student or Expert mode.
2. The SPA stores that preference in thin session state.
3. Narrative sections, recaps, and flagship modules request the matching content variant.
4. Chat requests include current section and selected depth so support remains consistent.

### Public Chat Flow

1. Browser chat UI builds a request with anonymous session information and current context.
2. Supabase Edge Function validates the request and applies protection rules.
3. Shared grounding helpers retrieve approved material and assemble the answer envelope.
4. The frontend renders answer, weak-support, refusal, cooldown, or fallback states.

### Maintainer Readiness Flow

1. Maintainer signs in through Supabase Auth and opens the private SPA surface.
2. The frontend calls Django `/api/admin/*` endpoints through the API client.
3. Django verifies identity, coordinates repository access, and returns typed DTOs.
4. Maintainers inspect readiness, sources, validation, and audit trails, then follow links to the affected records.

## Suggested Build Order

### First

- Introduce a depth-aware content contract and thin session state seam.
- Align the learner shell, flagship modules, and recap surfaces around that contract.

### Second

- Extend trust surfaces so references, chat states, and source evidence feel consistent and obvious to learners and evaluators.

### Third

- Break the private maintainer/readiness experience into more modular frontend slices while preserving the current Django API boundary.

### Fourth

- Profile, lazy-load, and harden the full release verification path once the new user-facing shape is in place.

## Brownfield Architecture Guidance

- Preserve the current runtime split unless a future phase explicitly promotes a public-chat cutover.
- Do not let Student / Expert mode become a global-store project; it should remain session-local and content-driven.
- Keep trust cues and fallback behavior near the user-visible surfaces that need them, but avoid duplicating business rules across runtimes when contract-sharing is possible.

---
*Written: 2026-05-06*
