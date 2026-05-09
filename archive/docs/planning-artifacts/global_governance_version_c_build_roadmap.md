# Global Governance Website — Version C Build Roadmap

## Purpose
This roadmap translates the **Version C Feature Pitch** into an implementation sequence.

The goal is to help the team build the project in a realistic order while protecting:
- performance
- clarity
- academic quality
- development momentum

This roadmap assumes the final stack is:

- React
- Vite
- TypeScript
- Tailwind CSS
- Motion
- Lenis
- shadcn/ui
- react-icons
- React Three Fiber
- ESLint
- Prettier

---

# Build Strategy

## Core Principle
Build the site in **layers**, not all at once.

### Layer 1
Get the structure and content working.

### Layer 2
Add premium UI and interaction.

### Layer 3
Add standout showcase features.

### Layer 4
Polish, optimize, and refine.

This prevents the project from becoming visually ambitious but structurally incomplete.

---

# Roadmap Summary

## Phase 0 — Alignment and Planning
Goal: finalize direction before coding

### Tasks
- confirm final website sections
- confirm final tech stack
- confirm single-page architecture
- confirm visual direction
- confirm Version C priorities
- confirm which features are:
  - required
  - recommended
  - stretch goals

### Deliverables
- final PRD v2
- coding agent guide
- Version C feature pitch
- build roadmap

### Success Criteria
- no confusion about project direction
- team agrees on priorities
- development order is clear

---

## Phase 1 — Project Foundation
Goal: set up a stable codebase

### Tasks
- initialize Vite + React + TypeScript app
- install Tailwind CSS
- install Motion
- install Lenis
- install shadcn/ui
- install react-icons
- install React Three Fiber and @react-three/drei
- set up ESLint
- set up Prettier
- create base folder structure
- configure path aliases if desired
- prepare global styles

### Suggested Folder Structure
```text
src/
├── assets/
├── components/
│   ├── layout/
│   ├── sections/
│   ├── scene/
│   └── ui/
├── data/
├── hooks/
├── lib/
├── styles/
├── types/
├── App.tsx
└── main.tsx
```

### Deliverables
- clean working starter project
- linting and formatting ready
- base structure created

### Success Criteria
- project runs locally
- no dependency/config issues
- styling system is ready

---

## Phase 2 — Content Skeleton and Navigation
Goal: make the site navigable before making it flashy

### Tasks
- create global page layout
- create section wrappers
- create fixed navbar
- create mobile menu
- define navigation links
- define section IDs
- implement anchor-based navigation
- add basic footer
- add placeholder content blocks for all major sections

### Sections to stub
1. Hero
2. Introduction
3. Meaning and Importance
4. Key Global Actors
5. Rise of International Organizations
6. The United Nations
7. Core Principles of the UN
8. Major UN Organs
9. Role of the UN in Global Politics
10. Globalization and Global Governance
11. Challenges and Criticisms
12. West Philippine Sea Case Study
13. Conclusion
14. References

### Deliverables
- full single-page skeleton
- working navigation
- complete section placeholders

### Success Criteria
- all sections exist
- scrolling works
- mobile nav works
- page flow already makes sense without special effects

---

## Phase 3 — Final Content Integration
Goal: get the academic content in place early

### Tasks
- prepare final text content
- store content in structured `data/content.ts`
- map content into components
- add headings, summaries, and key takeaways
- keep paragraphs web-friendly
- insert references section
- prepare two depth versions if Student / Expert Mode will be implemented later

### Recommended Content Data Groups
- hero copy
- global governance definitions
- key actors
- international organization history
- UN overview
- UN principles
- UN organs
- UN roles
- globalization points
- criticisms and challenges
- case study timeline
- references

### Deliverables
- site contains real content
- content feels complete even before advanced visuals

### Success Criteria
- the site is already academically usable
- the topic reads clearly from top to bottom
- all essential content is present

---

## Phase 4 — Premium Design System
Goal: establish the visual identity before advanced motion

### Tasks
- finalize color palette
- define typography scale
- define section spacing system
- create reusable UI wrappers
- create card styles
- create heading styles
- create button styles
- define glow, border, and panel treatments
- create light/dark tonal transitions between major story sections

### Suggested Reusable UI Components
- SectionHeading
- GlowCard
- InfoCard
- StatCard
- TimelineCard
- Chip / Tag
- CTAButton
- Divider
- SectionContainer

### Deliverables
- visual consistency across sections
- site already feels premium without deep animation

### Success Criteria
- every section feels part of one system
- design looks polished even in static screenshots

---

## Phase 5 — Core Motion System
Goal: add coherent motion across the site

### Tasks
- create reusable animated section wrapper
- add reveal-on-scroll behavior
- add staggered heading and card animations
- add hover animations for cards
- add nav entrance behavior
- add smooth section transitions
- add back-to-top button behavior
- add scroll progress indicator if desired

### Motion Rules
- use consistent easing and duration families
- avoid making every element animate differently
- prioritize section-level motion over micro-chaos
- use subtle hover motion, not dramatic motion, for repeated cards

### Deliverables
- unified motion language
- site starts feeling cinematic

### Success Criteria
- motion improves clarity
- animation feels deliberate, not noisy
- no major performance issues on normal laptops

---

## Phase 6 — Lenis Scroll Experience
Goal: make the site feel smoother and more immersive

### Tasks
- integrate Lenis
- ensure smooth anchor navigation
- tune scroll intensity and feel
- test desktop and mobile behavior
- verify section offsets with fixed navbar
- ensure it does not fight important interactions

### Deliverables
- fluid scroll experience
- premium page flow

### Success Criteria
- the site feels smoother without becoming floaty
- content remains easy to control and read

---

## Phase 7 — Living Globe Hero
Goal: create the first major “wow” moment

### Tasks
- design hero layout
- create hero title and subtitle
- build CTA placement
- implement React Three Fiber hero scene
- create simple, elegant globe concept
- add subtle ambient movement
- add floating governance labels if appropriate
- add hero text motion

### Recommended Constraints
- keep hero scene optimized
- avoid overcomplicated shaders unless necessary
- no giant textures unless optimized
- make sure text remains dominant and readable

### Deliverables
- premium hero section
- selective 3D experience working

### Success Criteria
- hero feels memorable
- 3D supports the message
- first impression is strong
- performance remains acceptable

---

## Phase 8 — UN Command Center
Goal: turn the UN section into a flagship interactive module

### Tasks
- choose UI model:
  - tabs
  - cards
  - animated panels
  - hybrid tabs + details
- add one block per major UN organ
- create icons and labels
- add “role / power / limitation” presentation
- animate organ switching
- add panel transitions

### Suggested Features
- organ icon
- short summary
- power level / scope label
- limitations label
- optional “why it matters” note

### Deliverables
- interactive UN institution explorer

### Success Criteria
- section feels more useful than plain text
- viewers understand differences between organs quickly
- interaction is smooth and readable

---

## Phase 9 — West Philippine Sea Interactive Dossier
Goal: create the strongest real-world storytelling section

### Tasks
- design dossier layout
- create case study overview
- build timeline interface
- add event cards for:
  - 2012 Scarborough Shoal incident
  - 2013 arbitration filing
  - 2016 ruling
  - post-ruling enforcement limitations
- create “Ruling vs Reality” comparison
- add motion transitions between timeline states
- optionally add simple map-inspired styling

### Deliverables
- investigative-style case study section
- one of the strongest academic showcases in the site

### Success Criteria
- user clearly understands the legal and political tension
- the section feels serious, modern, and engaging
- content relevance is obvious

---

## Phase 10 — Student / Expert Mode
Goal: make the site adaptable and smarter

### Tasks
- define mode state
- define which sections change under each mode
- prepare simplified and expanded content variations
- add mode toggle UI
- animate transitions between versions
- ensure layout remains stable when content expands

### Suggested Approach
Use one global state provider or top-level state that switches content depth.

### Good Sections for Mode Differences
- Introduction
- UN Roles
- Challenges
- Case Study
- Conclusion

### Deliverables
- dual-depth reading mode
- more flexible academic experience

### Success Criteria
- switching modes is clear and smooth
- student mode improves accessibility
- expert mode adds intellectual depth without breaking design

---

## Phase 11 — Global Governance Simulator
Goal: create the stretch feature and signature interaction

### Tasks
- define 1 scenario only for initial version
- choose one scenario:
  - maritime dispute
  - climate emergency
  - refugee crisis
  - pandemic
- design step flow
- create actor selection or guided pathway
- show which institutions are involved
- show strengths and limits of the system
- provide final summary panel

### Strong Recommendation
Use **one polished scenario**, not several shallow ones.

### Suggested First Scenario
**Maritime Dispute / West Philippine Sea-linked conflict**

This keeps the simulator tightly connected to your site’s strongest case study.

### Deliverables
- interactive governance learning module
- signature stretch feature

### Success Criteria
- simulator is understandable
- it teaches something meaningful
- it feels integrated into the site rather than bolted on

---

## Phase 12 — Performance Optimization
Goal: protect the site from the cost of ambition

### Tasks
- lazy-load below-the-fold heavy sections
- isolate React Three Fiber to the hero or one section
- reduce unnecessary re-renders
- test animation density
- optimize images and textures
- reduce shadow/blur overuse
- check bundle size
- test on common student laptop conditions
- simplify anything that feels expensive but not impactful

### Priority Targets
- hero load
- scroll smoothness
- section animation cost
- case study interaction responsiveness
- simulator responsiveness

### Deliverables
- smoother experience
- fewer performance surprises during demo

### Success Criteria
- site remains responsive
- motion feels smooth
- 3D does not dominate the performance budget

---

## Phase 13 — Final Polish and Demo Prep
Goal: make the project presentation-ready

### Tasks
- fix spacing inconsistencies
- tighten typography
- refine transitions
- verify references
- check grammar and spelling
- ensure all sections feel complete
- verify mobile behavior
- test browser compatibility
- prepare screenshots or backup demo plan
- optionally create loading states for premium feel

### Deliverables
- final polished website
- demo-ready build

### Success Criteria
- no visibly unfinished parts
- no broken navigation
- no weak placeholder text
- site feels confident and complete

---

# Priority Model

## Priority Tier 1 — Must Build First
These form the real product:
- project foundation
- content skeleton
- navigation
- content integration
- premium design system

## Priority Tier 2 — High-Value Premium
These create the premium feel:
- motion system
- Lenis
- Living Globe Hero
- UN Command Center
- West Philippine Sea Dossier

## Priority Tier 3 — Smart Overengineering
These make it feel more unique:
- Student / Expert Mode

## Priority Tier 4 — Stretch Goal
Build only if time remains:
- Global Governance Simulator

---

# Recommended Development Order

## Sprint 1
- Phase 1
- Phase 2
- Phase 3

## Sprint 2
- Phase 4
- Phase 5
- Phase 6

## Sprint 3
- Phase 7
- Phase 8
- Phase 9

## Sprint 4
- Phase 10
- Phase 12
- Phase 13

## Sprint 5 (Optional / Stretch)
- Phase 11

---

# Feature Lock Advice

## Lock Early
These should be locked as soon as possible:
- section list
- color direction
- core narrative flow
- case study structure
- UN Command Center approach
- hero concept

## Do Not Constantly Rebuild
Avoid repeatedly redesigning:
- navbar
- section spacing
- typography system
- core card style
- main animation style

Repeatedly changing foundations will slow the project more than any technical issue.

---

# Risk Management

## Risk: Too Much Complexity Too Early
### Fix
Do not begin with the simulator or heavy 3D. Build the academic site first.

## Risk: Flashy but Empty
### Fix
Get real content integrated before adding too many showcase effects.

## Risk: Performance Drops
### Fix
Keep React Three Fiber selective and optimize below-the-fold sections.

## Risk: Feature Creep
### Fix
Treat the simulator as optional until the rest of the site is strong.

## Risk: Inconsistent UX
### Fix
Use one design system and one motion language across the whole project.

---

# Best Practical Version C Plan

If you want the smartest realistic build, do this:

## Guaranteed Build
- premium storytelling layout
- smooth navigation
- polished design system
- section motion
- Lenis
- Living Globe Hero
- UN Command Center
- West Philippine Sea Interactive Dossier

## Strong Bonus
- Student / Expert Mode

## Stretch Goal
- Global Governance Simulator

This gives you the highest chance of shipping something impressive and complete.

---

# Final Recommendation
Build **Version C in controlled layers**.

The mistake would be trying to build all advanced features at the same time.

The winning strategy is:

1. finish the academic experience
2. make it premium
3. make key sections unforgettable
4. add the overengineered simulator only if the rest is already strong

If done in this order, the final project can feel:
- premium
- cinematic
- academically strong
- highly interactive
- unique without becoming unstable
