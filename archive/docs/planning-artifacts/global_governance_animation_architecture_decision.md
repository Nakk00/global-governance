# Animation Architecture Decision
## Global Governance Website

## Purpose
This document defines the animation architecture decision for the **Global Governance Website** project.

The project aims to be:
- premium
- cinematic
- highly interactive
- academically credible
- technically ambitious

Because of this, the team considered whether **Motion** should be replaced by **GSAP** in the most overengineered version of the site.

This document records the final decision.

---

## Final Decision

### Decision
**Do not replace Motion with GSAP as the main animation system.**

Instead, use:

- **Motion** as the primary animation engine for the React app
- **Lenis** as the smooth scroll layer
- **GSAP** as an optional specialist tool for one or two highly custom showcase scenes

### Final Recommended Animation Stack
- **Motion**
- **Lenis**
- **GSAP** (optional and selective)

### Summary Rule
**Motion stays the main system. GSAP is added only where Motion stops being elegant or efficient for a specific advanced sequence.**

---

## Why This Decision Was Made

## 1. The project is still React-first
The site is built with:
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Three Fiber

Most of the website consists of:
- sections
- cards
- panels
- tabs
- chatbot states
- mode switches
- content reveals
- storytelling transitions

This means the website is fundamentally a **React UI application**, not a pure animation experiment.

Because Motion is designed for React-first animation workflows, it remains the best core animation system for the majority of the site.

---

## 2. Motion is a better default for most of the website
Motion is the most natural fit for:
- section reveals
- staggered content entrances
- hover states
- UI transitions
- tab and accordion transitions
- chatbot open/close motion
- Student / Expert mode transitions
- timeline transitions
- section-based scrollytelling

It is the best default for repeated interactive UI patterns across the site.

---

## 3. Lenis solves a different problem
Lenis is not a replacement for Motion or GSAP.

Its role is to:
- improve scroll feel
- create smoother section-to-section movement
- support a more premium SPA experience

Lenis should remain part of the stack regardless of whether GSAP is added.

---

## 4. GSAP is powerful, but should not own the whole codebase by default
GSAP is excellent for:
- timeline-heavy cinematic sequences
- advanced scroll choreography
- pinned scenes
- SVG and path animation
- complex one-off visual sequences

However, if GSAP is used as the main animation system across the entire project, it introduces:
- more complexity
- more overlap with Motion
- two different animation mental models if Motion remains
- a higher maintenance burden
- a greater chance of inconsistent animation patterns

For this specific project, using GSAP everywhere would be harder to justify than using it surgically.

---

# Role of Each Tool

## Motion
### Primary Role
Main animation system for the React interface.

### Use Motion for
- section reveal animations
- content stagger
- hover motion
- card transitions
- tabs and accordions
- chatbot panel transitions
- Student / Expert mode transitions
- case study transitions
- most UI-level storytelling motion

### Why
Motion is the cleanest fit for repeated, component-based, React-native animations.

---

## Lenis
### Primary Role
Smooth scroll and premium motion feel for the whole page.

### Use Lenis for
- smooth SPA scrolling
- premium scroll feel
- smoother section transitions
- immersive movement flow

### Why
Lenis improves the feel of the website without replacing the animation system.

---

## GSAP
### Primary Role
Optional specialist tool for high-complexity custom scenes.

### Use GSAP for
- one cinematic hero intro
- one pinned storytelling scene
- one highly choreographed sequence
- advanced SVG/path/map animation
- one-off effects that are too awkward in Motion

### Why
GSAP is best used as a targeted power tool, not as the default for every interaction.

---

# Recommended Architecture

## Default Architecture
Use:
- Motion for most component and section animation
- Lenis for scroll experience

This should cover:
- almost all of the website’s normal animation needs
- premium UI flow
- academic storytelling transitions
- interactive component states

---

## Overengineered Architecture
If the project goes for the most ambitious version, then use:

- Motion for 80–90% of the site
- Lenis for smooth scrolling
- GSAP for 1–2 special cinematic scenes only

### Example Division
#### Motion
- navbar entrance
- hero text reveal
- section reveal animations
- cards
- tabs
- dossier transitions
- chatbot transitions

#### Lenis
- page scroll smoothing
- narrative flow improvement

#### GSAP
- premium intro sequence
- pinned “how the system works” scene
- advanced map / line / SVG reveal
- showcase-only transition

---

# What Should Not Happen

## Do not do this
- replace Motion with GSAP everywhere just to be “more advanced”
- animate every section using a different system
- mix Motion and GSAP randomly across similar UI patterns
- use GSAP for ordinary cards, buttons, and repeated component states unless necessary
- let GSAP take over the codebase without a clear reason

## Why not
That would make the project:
- harder to maintain
- harder to debug
- more inconsistent
- more likely to become visually noisy

---

# Decision Matrix

| Tool | Main Job | Recommended Usage Level | Notes |
|---|---|---|---|
| Motion | Main React animation engine | Heavy use | Core animation system |
| Lenis | Smooth scroll layer | Heavy use | Supports premium SPA feel |
| GSAP | Specialist advanced sequence tool | Light/selective use | Use only for showcase scenes |

---

# Recommended Usage Rules

## Rule 1
Use **Motion first** for any animation need.

## Rule 2
Use **Lenis** for the page scroll experience, not for UI state transitions.

## Rule 3
Only introduce **GSAP** if a specific animation sequence clearly needs:
- stronger timeline choreography
- advanced pinning
- advanced SVG/path control
- more cinematic sequencing than Motion provides cleanly

## Rule 4
If GSAP is added, isolate it to clearly defined feature modules.

## Rule 5
Do not allow overlapping ownership of the same interaction pattern.

Example:
- if tabs use Motion, keep tabs on Motion
- do not rebuild the same tabs in GSAP later

---

# Best Places to Use GSAP If Added

If GSAP is introduced, the best candidate sections are:

## 1. Hero Intro Sequence
A highly cinematic first-load or scroll-linked intro.

## 2. “How Global Governance Works” Showcase
A pinned or sequenced explainer scene showing relationships between actors and institutions.

## 3. West Philippine Sea Visual Sequence
A highly choreographed legal/political tension reveal using lines, maps, or layered scene transitions.

## 4. Simulator Visual Layer
If the simulator gets an advanced visual decision-flow or map sequence.

These are the kinds of areas where GSAP could add real value.

---

# Best Places to Keep Motion

Motion should remain the default in:

- navbar
- mobile menu
- section wrappers
- cards
- tabs
- accordions
- chatbot UI
- Student / Expert mode
- references drawer
- hover interactions
- most case-study content transitions

These parts benefit more from a React-native animation system than from GSAP-level choreography.

---

# Performance Considerations

## Motion
Good default for React UI because it keeps the animation logic close to the component structure.

## Lenis
Should be tuned carefully so the scroll feels premium but not floaty or hard to control.

## GSAP
If added:
- scope it carefully
- do not apply it across the whole site
- use it only where the visual payoff is high
- avoid turning the whole site into a motion experiment

### Main performance rule
**Overengineer only the moments that matter.**

---

# Final Recommendation

## Final Answer
If the project becomes the **most overengineered version**, **Motion should not be replaced by GSAP wholesale**.

Instead:

### Keep
- Motion
- Lenis

### Optionally Add
- GSAP

### Final Animation Architecture
- **Motion = primary**
- **Lenis = scroll**
- **GSAP = optional specialist**

This is the best balance of:
- maintainability
- React compatibility
- premium UX
- cinematic ambition
- development sanity

---

# Final One-Line Decision
**Do not replace Motion with GSAP. Add GSAP only for special showcase scenes if needed.**
