# Coding Agent Guide
## Global Governance Website

## 1. Purpose
This document is the implementation companion to the PRD. It tells the coding agent how to build the project in a practical, execution-focused way.

This is a **single-page premium educational website** for **GNED-07: The Contemporary World** on the topic of **Global Governance**.

The build should prioritize:
- premium visual quality
- modern interactivity
- strong readability
- smooth performance
- maintainable React architecture

---

## 2. Final Tech Stack
Use exactly this stack unless a strong reason emerges to simplify:

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

### Recommended Supporting Packages
- clsx
- tailwind-merge
- @react-three/drei
- lucide-react only if needed by shadcn/ui defaults

---

## 3. Build Philosophy
The website should feel like a **high-end editorial / interactive documentary experience**.

However:
- text must remain readable
- layout must remain structured
- effects must feel intentional
- performance must remain acceptable
- 3D must be selective, not everywhere

### Core Rule
Use premium motion and interaction to support storytelling, not to distract from it.

---

## 4. App Type
Build as a **single-page application** with section-based scrolling and anchor navigation.

Do **not** introduce:
- backend
- authentication
- database
- CMS
- Redux or global complexity unless absolutely needed
- React Router unless a later requirement forces multi-page structure

---

## 5. Recommended Project Structure

```text
src/
├── assets/
│   ├── images/
│   ├── icons/
│   └── textures/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── Footer.tsx
│   │   └── ScrollProgressIndicator.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── IntroSection.tsx
│   │   ├── MeaningImportanceSection.tsx
│   │   ├── GlobalActorsSection.tsx
│   │   ├── IOHistorySection.tsx
│   │   ├── UNOverviewSection.tsx
│   │   ├── UNPrinciplesSection.tsx
│   │   ├── UNOrgansSection.tsx
│   │   ├── UNRoleSection.tsx
│   │   ├── GlobalizationSection.tsx
│   │   ├── ChallengesSection.tsx
│   │   ├── CaseStudySection.tsx
│   │   ├── ConclusionSection.tsx
│   │   └── ReferencesSection.tsx
│   ├── scene/
│   │   ├── HeroScene3D.tsx
│   │   ├── Globe.tsx
│   │   └── SceneLights.tsx
│   └── ui/
│       ├── AnimatedSection.tsx
│       ├── SectionHeading.tsx
│       ├── GlowCard.tsx
│       ├── Timeline.tsx
│       ├── ActorCard.tsx
│       ├── OrganTabs.tsx
│       └── BackToTopButton.tsx
├── data/
│   ├── navigation.ts
│   └── content.ts
├── hooks/
│   ├── useActiveSection.ts
│   ├── useReducedMotionSafe.ts
│   └── useLenisScroll.ts
├── lib/
│   ├── cn.ts
│   └── motion.ts
├── styles/
│   └── globals.css
├── types/
│   └── content.ts
├── App.tsx
└── main.tsx
```

---

## 6. Section Build Order
Implement in this order:

### Phase 1: Foundation
1. App shell
2. Tailwind setup
3. global styles
4. typography system
5. navigation system
6. section anchor system

### Phase 2: Core Layout
1. Navbar
2. MobileMenu
3. Footer
4. main page structure
5. section spacing and responsive containers

### Phase 3: Content Sections
1. HeroSection
2. IntroSection
3. MeaningImportanceSection
4. GlobalActorsSection
5. IOHistorySection
6. UNOverviewSection
7. UNPrinciplesSection
8. UNOrgansSection
9. UNRoleSection
10. GlobalizationSection
11. ChallengesSection
12. CaseStudySection
13. ConclusionSection
14. ReferencesSection

### Phase 4: Interactivity
1. active nav highlighting
2. cards and hover states
3. tabs and accordions
4. timeline interactions
5. back-to-top button
6. scroll progress indicator

### Phase 5: Motion
1. section reveal system
2. staggered entrance
3. hover motion
4. content-state transitions
5. hero animations

### Phase 6: Lenis
1. integrate smooth scroll
2. test anchor navigation
3. adjust section offsets and scroll feel

### Phase 7: React Three Fiber
1. implement one selective hero scene
2. add performance checks
3. ensure graceful fallback behavior

### Phase 8: Polish
1. responsive refinement
2. accessibility check
3. performance cleanup
4. animation cleanup
5. final visual tuning

---

## 7. Motion Strategy

## Use Motion for:
- section enter animations
- staggered headings and cards
- hover states
- tab/panel transitions
- timeline reveal
- scroll-based emphasis
- CTA and nav polish

## Do not use Motion for:
- every small element by default
- excessive perpetual animations
- decorative motion that competes with text
- overcomplicated physics unless clearly valuable

## Motion pattern guidance
### Section reveal
- fade + slight translate
- keep transitions clean and consistent

### Card hover
- subtle lift
- scale or shadow shift
- premium but restrained

### Heading animation
- stagger lines or words only in important sections
- do not animate every paragraph heavily

### Content transitions
- tabs, accordions, and panel changes should feel smooth and deliberate

---

## 8. Lenis Strategy
Use Lenis to improve the scroll feel of the whole site.

### Requirements
- smooth but not floaty
- anchor navigation should remain accurate
- must not break accessibility or usability
- mobile behavior should be tested carefully

### Avoid
- stacking multiple scroll systems
- fighting native scroll for simple interactions
- overly slow or theatrical scroll settings

---

## 9. React Three Fiber Strategy
Use React Three Fiber in **one focused place only**, preferably the hero section.

### Recommended R3F use cases
- rotating globe
- abstract world grid
- floating point network
- subtle ambient particle field
- global connection visual

### Avoid
- multiple heavy 3D scenes across the site
- full-screen 3D in many sections
- complex simulations
- anything that blocks core content rendering

### Performance rules
- keep geometry simple
- keep material count low
- avoid unnecessarily large textures
- test on ordinary laptops
- provide graceful degradation if needed

---

## 10. shadcn/ui Strategy
Use shadcn/ui for accessible interaction patterns.

### Recommended components
- Tabs
- Accordion
- Dialog
- Sheet
- Tooltip
- Button
- Card
- Separator

### Best use cases in this project
- UN organs tabs
- FAQ or concept breakdown accordions
- references details
- mobile menu sheet
- optional modal detail views

---

## 11. Content Architecture
Centralize as much static content as possible in `data/content.ts`.

### Suggested data groups
- navigation links
- hero copy
- section headings
- global actors
- UN principles
- UN organs
- UN roles
- challenge highlights
- case study timeline
- references

This makes the build cleaner and easier to revise.

---

## 12. Design System Guidance

### Color direction
- background: deep navy / dark blue
- text: off-white / neutral light
- accent: gold, amber, teal, or cyan glow
- cards: layered glass/dark-panel style if appropriate

### Typography
- strong large headings
- clean readable body
- consistent line length
- avoid overly compressed text blocks

### Spacing
- use large section spacing
- allow breathing room
- use visual rhythm between dense and light sections

### Visual identity
Aim for:
- premium editorial
- world affairs / diplomacy aesthetic
- cinematic but structured
- polished interactive museum exhibit feel

---

## 13. Recommended “Wow” Moments
Limit the highest-intensity moments to a few key areas.

### Priority wow sections
1. Hero section
2. UN Organs section
3. West Philippine Sea case study section

These should receive the most visual and interaction attention.

Other sections should be strong and polished, but not equally intense.

---

## 14. Performance Guardrails
The coding agent should actively protect performance.

### Rules
- lazy-load heavy visual code if needed
- keep R3F isolated
- avoid many simultaneous animations on initial load
- reduce expensive blur/shadow overuse
- optimize image sizes
- prefer CSS effects when possible over heavy JS
- test mobile behavior early

### Accessibility and usability
- maintain readable contrast
- preserve keyboard navigation where practical
- avoid excessive motion density
- respect reduced motion if implemented

---

## 15. Implementation Constraints
The site must remain:
- understandable by a professor
- readable during live presentation
- stable during demo
- visually impressive but not chaotic

The build must not drift into:
- random UI experiments
- overdesigned unreadable sections
- too many competing effect systems
- visual clutter

---

## 16. Suggested Initial Package Install Plan

```bash
npm create vite@latest global-governance-website -- --template react-ts
cd global-governance-website
npm install
npm install motion @studio-freight/lenis react-icons clsx tailwind-merge
npm install three @react-three/fiber @react-three/drei
npm install class-variance-authority
npm install -D tailwindcss postcss autoprefixer eslint prettier
```

Then add shadcn/ui according to its setup flow for the Vite + React project.

Note: package names may be adjusted by the implementer based on current package guidance, but the architectural intent should stay the same.

---

## 17. Definition of Done
The project is done when:

- all required sections are implemented
- the website is responsive
- navigation works smoothly
- animations are polished and coherent
- one focused React Three Fiber visual is working well
- interactive components are useful and stable
- content is integrated cleanly
- the site feels premium without becoming confusing
- the project is ready for demo or submission

---

## 18. Final Instruction to the Coding Agent
Build this project like a **premium interactive academic showcase**, not like a generic landing page and not like an experimental VFX demo.

The best result is:
- elegant
- immersive
- content-led
- technically polished
- visually memorable
