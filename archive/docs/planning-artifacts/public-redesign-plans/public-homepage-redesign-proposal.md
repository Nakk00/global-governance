# Public Homepage Redesign Proposal

Status: Approval-ready draft
Last updated: 2026-05-26
Scope: Public main page redesign for the learner-facing SPA homepage
Owner: Codex + user working document

## Deadline Scope Update - Four-Page Final Version

Decision date: 2026-06-01

Because the project is close to deadline, the public learning experience should now target four polished chapters instead of the original six-chapter ambition.

Final chapter structure:

1. Hero Narrative Frame
2. Global Governance Overview
3. The System Under Pressure
4. West Philippine Sea Case File

Merge decisions:

- The original UN Command Center and Governance Limits chapters are merged into Chapter 3, `The System Under Pressure`.
- The original Conclusion and References chapter is folded into the end of Chapter 4, after the West Philippine Sea case study and source inspection.
- The separate Governance Limits and Conclusion navbar stops should be removed from the production navigation.

Implementation priority:

- Preserve the completed Hero and Global Governance Overview work.
- Implement the reduced navigation and narrative order first.
- Make Chapter 3 explain institutions and limits together.
- Make Chapter 4 case-study-first, then close with the final thesis and references.

## Executive Summary

This proposal recommends a foundational redesign of the learner-facing homepage inside the existing SPA.

The target experience is:

- a full-screen chapter-based public homepage
- a visual-first learning model with roughly 60 percent design and visuals and 40 percent text
- immersive chapter identities with internal sub-navigation for dense content
- a premium, museum-like interaction model rather than a long editorial scroll

The technical implication is significant:

- the public homepage composition is expected to be rebuilt
- the current scroll-anchor navigation model is expected to be replaced with chapter-state navigation
- several flagship public chapters are expected to become highly custom implementations
- testing, accessibility, performance, and reduced-motion handling must be designed into the new foundation from the start

Recommended first implementation milestone:

- a new homepage shell foundation
- redesigned Hero
- redesigned Global Governance Overview

Recommendation:

- treat this as a bold but staged public-homepage refactor
- proceed next into wireframes and visual mockups
- begin implementation only after that design package is stable enough to support the new shell architecture

## Purpose

This file is the living source of truth for the public homepage redesign discussion.

It exists to preserve:

- confirmed design direction
- proposal preparation decisions
- chapter-by-chapter restructure intent
- approval criteria and rollout expectations
- future additions such as wireframes, asset lists, and implementation sequencing

## Confirmed Direction

The public homepage should move away from a long editorial vertical page and become a chapter-based immersive experience.

Core direction confirmed in discussion:

- every main navbar item should feel like its own full-screen section
- the experience should feel more visual than text-heavy
- the target balance is roughly 60 percent design and visuals, 40 percent text content
- if a chapter has too much material for one screen, it should use internal sideways or subpage navigation instead of reverting to a long scroll
- the experience should feel more like an interactive learning museum than a plain article

## Current Architectural Baseline

This proposal assumes the current public homepage is still composed through:

- `src/App.tsx`
- `src/components/layout/AppShell.tsx`
- `src/contexts/NavigationContext.tsx`
- `src/data/navigation.ts`
- `src/data/sections/core-narrative.ts`

Current public chapters:

1. Hero Narrative Frame
2. Global Governance Overview
3. UN Command Center
4. Governance Limits and Enforcement
5. West Philippine Sea Dossier
6. Conclusion and References

## Top-Level Decision Snapshot

1. Overall homepage feel: `B` - Interactive learning museum
2. Main chapter movement: `B` - Left/right chapter navigation like slides
3. Navbar visibility: `B` - Minimal until hover or scroll, then expands
4. Content density per chapter: `C` - Flexible per chapter depending on weight
5. Visual style: `C` - Data-rich mixed storytelling with maps, diagrams, and visual cards
6. Global Governance Overview interaction: `B` - World-map or systems-map style section
7. UN Command Center emphasis: `B` - Interactive chamber or room metaphor
8. Governance Limits presentation: `B` - Split-screen ideal versus reality storytelling
9. West Philippine Sea Dossier format: `B` - Interactive map plus timeline
10. Conclusion and References feeling: `A` - Strong visual ending with light references
11. Source-aware chat behavior: `A` - Keep it floating across all chapters
12. Proposal depth right now: `C` - Brief plus chapter map plus visual direction plus wireframe-ready structure

## 1. One-Page Experience Brief

### Working Vision

Redesign the public homepage into a full-screen chapter experience that feels like an interactive learning museum for global governance. Instead of asking learners to read one long page, the site should guide them chapter by chapter through a more visual narrative built from maps, chambers, diagrams, comparisons, evidence views, and curated text blocks.

### Experience Goal

Make the homepage feel immersive, structured, and easier to remember by turning each major learning topic into a visually distinct chapter with its own full-screen identity.

### Product Intent

- increase immersion and perceived quality
- reduce the feeling of reading a long article
- make the learning flow easier to understand chapter by chapter
- create stronger visual anchors for each major concept
- preserve the SPA structure while making navigation feel more intentional and premium

### Interaction Model

- top-level movement should behave like left and right chapter navigation
- each navbar item maps to a full-screen chapter
- dense chapters can contain their own internal slides, panels, or subviews
- the navbar should stay visually minimal by default and become more explicit on hover, interaction, or scroll state
- source-aware chat remains available across the experience as a persistent utility

### Content and Design Ratio

The redesign should target approximately:

- 60 percent visuals, diagrams, layout, motion, and atmosphere
- 40 percent text, explanations, and educational copy

This does not mean less educational value. It means the educational value should be carried more by structure, visual storytelling, comparison, and interaction rather than by uninterrupted prose.

### Design Character

The homepage should feel:

- like an interactive learning museum
- data-rich rather than abstract
- visually guided rather than text-dumped
- structured and premium rather than generic
- thematic and distinct per chapter rather than one repeated layout pattern

### Non-Goals

This proposal does not currently assume:

- conversion to a multi-route site
- removal of the source-aware chat
- removal of academic grounding cues
- a return to a long article-first page structure

## 2. Chapter-by-Chapter Restructure Map

### Chapter 1: Hero Narrative Frame

Role in journey:
Opening screen that establishes the theme, tone, and reason to continue.

Target structure:

- one visually dominant full-screen landing chapter
- strong opening headline
- immediate sense of progression into the learning journey
- clear chapter-entry action toward the next section

Design emphasis:

- cinematic first impression
- high-quality atmosphere
- strong motion or depth cues if tasteful
- minimal but powerful text

Content direction:

- keep the thesis sharp and short
- prioritize emotional and thematic framing over explanation density

### Chapter 2: Global Governance Overview

Role in journey:
Teach the learner the system-level idea before they enter the institutional and geopolitical chapters.

Target structure:

- full-screen chapter with a world-map or systems-map style interaction
- flexible internal subpages or panels if needed
- should explain actors, norms, institutions, and power in a more visual way

Preferred interaction:

- map-based or systems-based visual exploration
- chapter can split into multiple internal panels if concept load is too high

Design emphasis:

- systems thinking
- global scope
- visual relationships between states, rules, institutions, and cooperation

Content direction:

- less paragraph-heavy explanation
- more visual framing of how the global system works

### Chapter 3: UN Command Center

Role in journey:
Make the UN structure feel spatial, memorable, and explorable.

Target structure:

- full-screen chapter
- interactive chamber or room metaphor
- likely multiple internal subviews for different UN bodies or institutional roles

Preferred interaction:

- room-like exploration
- body selection
- side-to-side movement between institutional spaces or panels

Design emphasis:

- strong architectural metaphor
- clear contrast between different UN bodies
- memorable navigation between functions and responsibilities

Content direction:

- focus on visual explanation of what each body does
- reduce reliance on dense comparative text blocks

### Chapter 4: Governance Limits and Enforcement

Role in journey:
Show why global rules matter but also where their power stops.

Target structure:

- full-screen chapter
- split-screen ideal versus reality storytelling
- may include multiple internal slides if several enforcement tensions need to be shown

Preferred interaction:

- side-by-side comparisons
- visual tension between principle and practice
- controlled movement through a few strong examples

Design emphasis:

- contrast
- tension
- asymmetry between legal logic and political reality

Content direction:

- use visual comparisons instead of long explanation blocks
- make the central lesson quickly readable

### Chapter 5: West Philippine Sea Dossier

Role in journey:
Turn the theory into a grounded regional case study.

Target structure:

- full-screen chapter
- interactive map plus timeline
- likely several internal views for chronology, legal claims, and evidence

Preferred interaction:

- geographic context
- event progression
- evidence-aware story movement

Design emphasis:

- investigation feel
- spatial understanding
- chronological clarity
- evidence visibility

Content direction:

- keep the case study rich, but organize it through map and timeline first
- let text support the visual case flow rather than lead it

### Chapter 6: Conclusion and References

Role in journey:
Deliver a strong visual ending and leave the learner with the core lesson.

Target structure:

- full-screen closing chapter
- recap-focused ending
- light references rather than a heavy source dump on the main surface

Preferred interaction:

- strong ending screen
- concise recap
- references can be lighter, expandable, or secondary to the final message

Design emphasis:

- closure
- synthesis
- confidence

Content direction:

- end with impact
- keep the references available without making the final chapter feel administrative

## 3. Content Audit

### Content Audit Questionnaire Answers

1. Current homepage text overall: `C` - Rewrite almost everything around the new visual experience
2. Hero text amount: `B` - A short intro plus one supporting paragraph
3. Global Governance Overview priority: `B` - Show the system visually first, then explain key parts
4. Global Governance Overview additions: `B` - More map or system visuals showing relationships
5. UN Command Center treatment: `A` - Keep the core body explanations, but make them more visual
6. UN Command Center additions: `B` - More visual or room-based storytelling and interaction
7. Governance Limits copy treatment: `B` - Keep the ideas, but rebuild them around comparisons
8. Governance Limits additions: `C` - More visual diagrams of rule versus power versus enforcement
9. West Philippine Sea Dossier treatment: `A` - Keep the case, but make it more visual and navigable
10. West Philippine Sea Dossier additions: `B` - Better event-by-event timeline depth
11. Conclusion reference visibility: `C` - Keep references fairly visible because they are important to trust
12. Biggest new content focus across chapters: `C` - More interactive educational elements like sliders, hotspots, and comparisons
13. First thing to cut when design needs space: `A` - Long explanatory paragraphs
14. Ideal learner takeaway per chapter: `C` - One big idea, one memorable visual, and one interactive takeaway

### Audit Summary

The redesign should not treat the existing homepage copy as the primary structure to preserve. The current content should be substantially rewritten so it fits a visual-first chapter experience instead of a long-scroll editorial format.

The content strategy is not "remove learning depth." It is "re-express learning depth through interaction, layout, diagrams, visual sequencing, and sharper writing."

High-level audit direction:

- rewrite most long-form text for the new experience model
- preserve the strongest ideas, not the current paragraph structure
- cut long explanatory paragraphs first when space gets tight
- favor visual explanation before text explanation
- make each chapter land one big idea, one memorable visual, and one interactive takeaway

### Cross-Chapter Content Rules

- text should support the interaction instead of competing with it
- paragraphs should become shorter, sharper, and easier to scan
- visuals should do real explanatory work, not just decoration
- interactions should teach, not just animate
- references and trust cues should remain present, especially near the end of the journey
- dense material should be chunked into internal chapter views rather than stacked vertically

### Chapter 1 Audit: Hero Narrative Frame

Current direction:

- rewrite the current hero around the new immersive experience
- keep only a short intro plus one supporting paragraph

What should stay conceptually:

- the core thematic entry into global governance
- the sense that the learner is starting a guided journey

What should change:

- reduce any heavy exposition
- turn the hero into a cleaner emotional and conceptual setup
- make the visual identity do more of the persuasive work

Net result:

- a shorter, sharper opening with stronger atmosphere and less explanation density

### Chapter 2 Audit: Global Governance Overview

Current direction:

- rewrite the section substantially
- show the system visually first, then explain key parts
- add more map-based or systems-based visuals

What should stay conceptually:

- the core idea that global governance is a system of actors, rules, institutions, and cooperation

What should change:

- move away from explanation-heavy blocks
- make the learner see the system before reading about it
- reorganize content around relationships and structures instead of prose sequence

What new material is needed:

- stronger system maps
- clearer visual relationships between actors and institutions
- short text blocks attached to visual anchors

Net result:

- this chapter becomes the visual concept map of the whole experience

### Chapter 3 Audit: UN Command Center

Current direction:

- keep the core explanations of major UN bodies
- redesign them into a more visual and room-based experience
- add stronger chamber or space-based storytelling

What should stay conceptually:

- the existing educational explanation of what major UN bodies do
- the distinction between bodies, roles, and institutional limitations

What should change:

- reduce the feeling of a static comparison tool
- make the space feel more explorable and spatial
- let visuals and movement improve retention

What new material is needed:

- stronger environment metaphor
- clearer spatial entry points into each body
- interactions that feel like entering rooms or institutional stations

Net result:

- the chapter keeps its educational core but becomes much more immersive and memorable

### Chapter 4 Audit: Governance Limits and Enforcement

Current direction:

- keep the current ideas
- rebuild them around comparisons
- add more diagrams showing the relationship between rules, power, and enforcement

What should stay conceptually:

- the core lesson that international rules matter but do not enforce themselves automatically

What should change:

- move away from purely explanatory copy
- foreground comparison structure
- show the tension between ideal design and political reality more explicitly

What new material is needed:

- split-screen visual logic
- diagrams of rule versus power versus enforcement
- fewer words, stronger contrast

Net result:

- this chapter becomes the clearest "friction" chapter in the experience, built around tension and comparison

### Chapter 5 Audit: West Philippine Sea Dossier

Current direction:

- keep the case study itself
- make it more visual and easier to navigate
- deepen the event-by-event timeline

What should stay conceptually:

- the West Philippine Sea case as the flagship applied example
- the connection between law, dispute, geography, and geopolitical limits

What should change:

- reduce the sense of reading a long case writeup
- organize the learner through map context and timeline movement
- improve pacing through clearer event segmentation

What new material is needed:

- stronger timeline depth
- better event-to-event transitions
- clearer chronology framing within the chapter navigation

Net result:

- the case remains central, but the learner experiences it as a navigable investigation rather than a dense reading block

### Chapter 6 Audit: Conclusion and References

Current direction:

- keep the ending visually strong
- preserve reference visibility because trust still matters

What should stay conceptually:

- the final synthesis
- the academic grounding and source credibility of the experience

What should change:

- avoid a purely administrative or bibliography-heavy ending
- keep the emotional and conceptual close strong
- integrate references in a way that supports trust without collapsing the visual finish

What new material is needed:

- a stronger closing visual statement
- a clearer recap surface
- references that remain visible but visually subordinate to the closing lesson

Net result:

- the ending stays credible and grounded while still feeling like a real finale

### Content Addition Priorities

Across the redesigned homepage, the biggest new additions should be:

1. interactive educational elements such as hotspots, comparisons, sliders, and guided subviews
2. visuals that explain relationships, not just decorate the page
3. sharper chapter-level takeaways tied to clear interaction outcomes

### Content Reduction Priorities

When the design needs room, cut in this order:

1. long explanatory paragraphs
2. prose that repeats ideas already shown visually
3. any supporting text that does not improve the main takeaway, visual memory, or interaction value

## 4. Visual Direction Pack

### Visual Direction Questionnaire Answers

1. Overall visual mood: `C` - Bold, immersive, and high-impact
2. Visual base: `C` - A mix of immersive backgrounds and data-rich interface layers
3. Chapter-to-chapter contrast: `C` - Strong, each chapter should feel like entering a different world
4. Color direction: `C` - Chapter-based palettes with distinct accent colors per section
5. Typography feeling: `C` - Expressive and cinematic but still readable
6. Visual priority: `A` - Beauty and atmosphere
7. Map and diagram style: `C` - Rich, layered, and presentation-worthy
8. Motion and transitions: `C` - Strong and immersive, as long as reduced-motion is respected
9. Hero look: `C` - A layered immersive scene with motion, depth, and visual cues
10. Global Governance Overview look: `C` - An explorable museum wall of systems, links, and actors
11. UN Command Center look: `C` - A futuristic control room with explorable spaces
12. Governance Limits look: `C` - A dramatic visual argument between ideals and reality
13. West Philippine Sea Dossier look: `C` - An investigation room with maps, timeline, and layered evidence
14. Conclusion and References look: `C` - Memorable and cinematic, but still trustworthy
15. Imagery priority: `C` - A blend of symbolic imagery plus educational graphics
16. Premium versus academic: `A` - More premium than academic
17. First custom-image use: `A` - Background mood images

### Visual Direction Summary

The redesign should be visually ambitious. It should not feel like a modest academic layout refresh. It should feel like a premium, immersive, chapter-based learning experience where atmosphere, visual identity, and chapter contrast are major parts of how the learning journey is remembered.

The strongest design principle from these answers is:

- make the experience beautiful enough to feel premium
- keep it structured enough to remain educational
- let each chapter feel like its own world

### Core Visual Principles

1. Bold over safe
The experience should avoid generic dashboard or default editorial styling. It should feel intentional, crafted, and visually confident.

2. Immersive plus informative
The interface should combine atmospheric backgrounds with meaningful instructional layers such as diagrams, cards, timelines, and explorable surfaces.

3. Distinct chapter identities
Each main chapter should feel like entering a new environment, not just a recolored version of the same section template.

4. Premium first impression
The public learning surface should feel polished, memorable, and presentation-worthy before the learner reads deeply into the text.

5. Visual storytelling does real work
Graphics, diagrams, map layers, scene composition, and motion should explain concepts, not merely decorate them.

### Overall Aesthetic Direction

The homepage should aim for:

- bold immersive presentation
- layered scenes with depth
- data-rich overlays and educational surfaces
- cinematic transitions between chapters
- a premium visual feel that still supports learning

This is not a minimalist design direction. It is a high-impact storytelling direction with educational structure underneath.

### Color Direction

The proposal should use chapter-based palettes rather than a single uniform accent system.

Target direction:

- each chapter gets its own dominant accent identity
- the experience still shares a common foundation so it feels like one product
- color changes should reinforce chapter memory and emotional tone

Working color behavior:

- Hero: atmospheric and high-drama opening palette
- Global Governance Overview: global systems palette with strategic, networked energy
- UN Command Center: institutional but futuristic control-room palette
- Governance Limits and Enforcement: tension palette that supports contrast and friction
- West Philippine Sea Dossier: maritime-investigation palette with geographic and evidentiary cues
- Conclusion and References: strong cinematic close with credible, grounded finishing tones

### Typography Direction

Typography should feel expressive, cinematic, and premium while staying readable enough for educational content.

Working direction:

- headings should feel distinctive and chapter-worthy
- supporting text should remain readable and controlled
- typography should contribute to mood, not just hierarchy
- the system should avoid flat default web-app typography energy

Typography intent by layer:

- display text: cinematic and memorable
- section headings: strong, elegant, and thematic
- body text: readable, calm, and supportive
- labels and metadata: clean enough for diagrams, evidence surfaces, and navigation

### Imagery Direction

The proposal should rely on a blended visual approach:

- symbolic or atmospheric imagery for mood and immersion
- educational graphics for actual explanation
- chapter-specific visual motifs to strengthen recall

The design should not rely on only one visual mode. It needs both:

- emotional scene-setting
- clear educational visualization

### Diagram and Map Direction

Maps and diagrams should be rich, layered, and presentation-worthy.

This means:

- not overly abstract
- not dry textbook graphics
- not simplistic one-note UI charts

Instead, they should feel:

- explorable
- layered
- polished enough to anchor a full-screen chapter
- integrated into the visual world of the section

### Motion Direction

Motion should be strong and immersive where appropriate, but must remain respectful of reduced-motion preferences.

Working motion direction:

- chapter transitions should feel meaningful
- internal chapter movement should feel smooth and spatial
- scene depth, panel shifts, and visual reveals are welcome
- motion should support orientation, not distract from it

Guardrail:

- every major motion treatment must have a reduced-motion equivalent that keeps the experience usable and coherent

### Chapter Visual Personalities

#### Chapter 1: Hero Narrative Frame

Target feel:

- layered immersive opening scene
- strong sense of depth and motion
- premium first impression
- visual cues that invite the learner into the journey

Visual role:

- establish ambition
- make the experience feel unlike a standard homepage

#### Chapter 2: Global Governance Overview

Target feel:

- an explorable museum wall of systems, links, and actors
- a visually dense but readable strategic world surface
- a chapter that teaches through visible relationships

Visual role:

- make the system legible at a glance
- help the learner understand connected structures before reading details

#### Chapter 3: UN Command Center

Target feel:

- a futuristic institutional control room
- explorable spaces or chambers
- polished, spatial, and memorable

Visual role:

- make UN bodies feel like places with roles, not just labels in a comparison table

#### Chapter 4: Governance Limits and Enforcement

Target feel:

- a dramatic visual argument between ideals and reality
- visible contrast, imbalance, and friction
- high-tension composition

Visual role:

- make the learner feel the gap between what global governance aspires to do and what power actually allows

#### Chapter 5: West Philippine Sea Dossier

Target feel:

- investigation room energy
- layered maps, timeline, evidence, and geopolitical context
- a navigable case-study environment

Visual role:

- turn the case into a memorable evidence-driven chapter rather than a static narrative block

#### Chapter 6: Conclusion and References

Target feel:

- cinematic closing mood
- trustworthy and grounded, not ornamental
- a finale rather than a leftover references page

Visual role:

- land the final lesson with impact
- preserve source credibility without losing visual strength

### Premium Versus Academic Balance

The design should lean more premium than academic, but it must not become empty spectacle.

This means:

- first impression should feel premium
- interaction and visuals should be striking
- educational clarity still has to be preserved underneath the beauty

The target is not "formal academic portal."
The target is "premium public learning experience."

### Custom Image Generation Direction

If custom images are generated for this proposal, they should first support:

1. background mood images
2. atmospheric chapter identity
3. layered scene-setting behind educational surfaces

Later image-generation tracks can expand into:

- chapter concept visuals
- symbolic supporting imagery
- visual atmosphere layers that reinforce diagrams, maps, and panels

## 5. Section Wireframe Set

### Wireframe Questionnaire Answers

1. Desktop framing: `B` - Full-bleed cinematic sections with layered panels inside
2. Desktop top-level chapter movement: `C` - Navbar, arrows, and controlled swipe or scroll cues
3. Mobile chapter navigation: `C` - A mobile-specific simplified version of the same concept
4. Dense chapter internal navigation: `C` - A mix of arrows, tabs, and labeled progress depending on the chapter
5. Visible content per chapter screen: `A` - One main idea only
6. Hero layout: `B` - Headline centered over immersive visual
7. Global Governance Overview layout: `A` - Main visual in center with supporting panels around it
8. UN Command Center layout: `B` - Room or chamber view with entry points into each body
9. Governance Limits layout: `C` - Split-screen base with slideable comparisons
10. West Philippine Sea Dossier layout: `B` - Timeline first, map second
11. Conclusion and References layout: `B` - Closing visual plus visible key references below
12. Active navbar behavior: `C` - Shape-shifting navigation that becomes part of the chapter stage
13. SectionProgressRail future: `C` - Replace it with a more integrated chapter progress system
14. Floating chat behavior: `A` - Stay small and docked until opened
15. Wireframe density now: `C` - Structure, interaction zones, and content priority regions
16. What to define in each wireframe: `C` - Desktop, mobile, and internal chapter states
17. Chapters to prioritize first: `A` - Hero and Overview

### Wireframe Strategy Summary

The wireframe set should move beyond simple page skeletons. At this stage, the proposal should define:

- the stage composition of each chapter
- the major interaction zones
- the content-priority regions
- the internal navigation behavior for dense sections
- desktop, mobile, and internal-state variants where relevant

The strongest structural rule from these answers is:

- each screen should land one main idea at a time
- each chapter should feel full-bleed and cinematic
- dense information should be revealed through controlled internal navigation rather than crowded all-at-once layouts

### Global Wireframe Rules

1. Full-bleed chapter stages
Each top-level chapter should occupy a cinematic full-screen stage on desktop, with layered surfaces placed inside that scene.

2. One main idea per screen
A chapter screen should usually communicate one main idea only. Supporting content can exist, but it should not compete with the primary teaching point.

3. Controlled chapter movement
Top-level navigation should be supported by:

- navbar interaction
- left or right directional controls
- subtle swipe or scroll cues where helpful

4. Internal navigation for dense chapters
When a chapter needs more than one teaching moment, it should use a chapter-specific internal navigation pattern such as:

- arrows
- tabs
- labeled progress
- subview selectors

5. Mobile is adapted, not just compressed
The mobile version should preserve the chapter-based concept, but simplify movement and layout density to stay usable on smaller screens.

6. Chat stays docked by default
The source-aware chat should remain available, but it should stay small and docked until the learner intentionally opens it.

### Desktop Wireframe Direction

Desktop should feel like a guided exhibition space.

Working desktop structure:

- full-bleed background scene
- one dominant teaching stage in focus
- layered information panels only where they strengthen the main idea
- top-level navigation integrated into the stage rather than feeling like a separate app bar

Desktop movement should support:

- chapter-level forward and backward movement
- clear awareness of where the learner is in the experience
- optional internal movement inside dense chapters

### Mobile Wireframe Direction

Mobile should not attempt to preserve every desktop layer.

Instead, it should:

- preserve the chapter identity
- simplify the number of simultaneously visible surfaces
- reduce layout competition
- keep navigation more direct and readable

Mobile should feel like a simplified adaptation of the same concept, not a totally different product.

### Navigation Wireframe Direction

#### Top-Level Navigation

The navbar should evolve into a more stage-aware navigation system.

Target direction:

- shape-shifting behavior
- more integrated with the chapter scene
- chapter labels become clearer when activated
- navigation feels like part of the immersive shell, not a static utility bar

#### Progress System

The current `SectionProgressRail` concept should not be carried over directly.

Instead, it should be replaced with:

- a more integrated chapter progress system
- progress cues that belong to the chapter experience
- lighter but more elegant orientation support

#### Chat Placement

The floating chat should:

- remain small and docked by default
- avoid fighting the chapter stage visually
- open intentionally rather than constantly demanding attention

### Wireframe Detail Level for Proposal

At this proposal stage, each chapter wireframe should define:

- overall structure
- major interaction zones
- content-priority regions
- internal states if the chapter has multiple subviews
- desktop behavior
- mobile behavior

This is enough detail to guide design and implementation planning without pretending final UI polish has already been solved.

### Chapter Wireframe Directions

#### Chapter 1: Hero Narrative Frame

Priority level:
Highest early-detail priority

Desktop layout:

- headline centered over immersive visual field
- minimal supporting copy
- a clear chapter-entry action
- atmospheric scene takes most of the stage

Mobile layout:

- preserve the centered dramatic entry
- reduce visual clutter
- keep the CTA obvious

Internal states:

- likely minimal
- may include subtle motion or cue states rather than multiple content states

Content priority regions:

1. headline
2. supporting paragraph
3. continue action
4. immersive visual field

#### Chapter 2: Global Governance Overview

Priority level:
Highest early-detail priority

Desktop layout:

- central main visual as the teaching anchor
- supporting panels arranged around the main visual
- the visual should lead; panels should explain selected relationships

Mobile layout:

- central teaching idea preserved
- supporting panels reduced into a cleaner sequence or selectable views

Internal states:

- likely multiple states for actor relationships, system views, or guided explainer states

Content priority regions:

1. central systems visual
2. supporting explainer panels
3. navigation between subviews
4. small contextual labels or cues

#### Chapter 3: UN Command Center

Desktop layout:

- chamber or room view as the main frame
- entry points into major UN bodies
- body detail appears after selection rather than all at once

Mobile layout:

- simplified room metaphor
- clearer tap targets
- detail surfaces more linear and readable

Internal states:

- multiple institution-entry states
- focused detail state per body

Content priority regions:

1. spatial room metaphor
2. selectable institutional entry points
3. selected-body detail surface
4. chapter progress cues

#### Chapter 4: Governance Limits and Enforcement

Desktop layout:

- split-screen base
- slideable comparisons between ideal structure and real-world limits
- strong visual contrast is the main teaching device

Mobile layout:

- comparison becomes more sequential
- contrast remains visible without overcrowding the viewport

Internal states:

- multiple comparison states
- examples can rotate or slide through one by one

Content priority regions:

1. ideal side
2. reality side
3. comparison controls
4. sharp takeaway statement

#### Chapter 5: West Philippine Sea Dossier

Desktop layout:

- timeline-first structure
- map remains important but secondary to the chronological teaching flow
- evidence detail changes with the currently selected event

Mobile layout:

- timeline stays primary
- map and evidence surfaces become more focused and less simultaneous

Internal states:

- event-by-event progression
- evidence detail state
- map-context state as needed

Content priority regions:

1. timeline
2. selected-event explanation
3. evidence detail
4. supporting map context

#### Chapter 6: Conclusion and References

Desktop layout:

- strong closing visual
- final recap message clearly foregrounded
- visible key references below or beneath the closing surface

Mobile layout:

- protect the sense of finale
- keep references readable but secondary

Internal states:

- likely light
- references may expand or reveal more detail without changing the closing thesis

Content priority regions:

1. closing message
2. strong visual ending surface
3. visible key references
4. optional follow-through cues

### Wireframe Production Order

The first chapters that deserve the most wireframe attention are:

1. Hero Narrative Frame
2. Global Governance Overview

These two chapters should establish:

- the immersive visual language
- the top-level navigation behavior
- the one-main-idea-per-screen rule
- the relationship between background scene and educational surface

After those are stable, the remaining chapters can extend the system in more specialized ways.

## 6. Asset Plan

### Asset Plan Questionnaire Answers

1. First assets to prioritize: `A` - Background mood assets
2. Hero lead asset: `C` - A symbolic visual world with subtle motion layers
3. Global Governance Overview lead asset: `C` - A hybrid of global map and systems relationships
4. UN Command Center lead asset: `A` - Chamber or room concept art
5. Governance Limits lead asset: `C` - A set of dramatic comparison panels plus explanatory diagrams
6. West Philippine Sea Dossier lead asset: `C` - A combined investigation kit: map, timeline, evidence visuals
7. Conclusion and References lead asset: `C` - A cinematic ending visual with subtle source-support design elements
8. Asset customization level: `A` - Mostly assembled from reusable design elements
9. Generated-image style: `C` - Atmospheric concept-art style with educational overlays
10. Diagram polish level: `C` - They should already feel presentation-ready in concept
11. Mobile-specific asset preparation: `C` - Plan desktop and mobile variants intentionally from the start
12. Most academically credibility-sensitive asset category: `C` - Evidence and source-support visuals
13. First chapters for asset attention: `A` - Hero and Overview
14. Motion-linked asset planning: `C` - Explicit asset layering for motion should be planned now
15. Reference-material pack: `A` - Visual inspiration only
16. Background images should avoid: `B` - Looking too busy
17. Proposal asset-plan detail: `C` - Category lists, chapter-by-chapter needs, and production priority order

### Asset Strategy Summary

The first asset wave should focus on atmosphere. Background mood assets should establish the premium, immersive identity of the redesign before more specialized diagrams and interaction graphics are layered in.

At the same time, the proposal should not treat assets as pure decoration. The plan needs to distinguish between:

- mood assets that create chapter identity
- educational assets that explain ideas
- credibility assets that support trust and evidence

### Core Asset Principles

1. Atmosphere first
The first visual assets should help each chapter feel distinct, premium, and immersive.

2. Do not over-busy the screen
Generated backgrounds and chapter scenes should avoid becoming visually noisy or competing with the educational surfaces.

3. Layer for motion from the start
Asset planning should assume foreground, midground, and background separation where useful so motion and depth can be added later without rebuilding everything.

4. Reusable foundations, custom composition
The asset system can be assembled from reusable design parts, but the resulting chapter compositions should still feel intentional and chapter-specific.

5. Trust-sensitive visuals need more discipline
Evidence and source-support visuals need to feel credible, legible, and academically grounded rather than purely dramatic.

### Asset Categories

The proposal should plan assets in these categories:

1. Background mood assets
2. Chapter scene layers
3. Maps and geographic surfaces
4. Diagrams and systems graphics
5. Institutional or chapter-specific visual markers
6. Evidence and source-support surfaces
7. Motion-ready overlay layers
8. Mobile-adapted variants

### Chapter-by-Chapter Asset Needs

#### Chapter 1: Hero Narrative Frame

Primary asset need:

- symbolic visual world with subtle motion layers

Supporting asset types:

- cinematic background mood image
- layered atmosphere elements
- restrained graphic overlays that reinforce the theme

Asset role:

- create a strong first impression
- signal that this is a premium guided experience
- support the centered headline without crowding it

Guardrail:

- keep the scene dramatic but not too busy

#### Chapter 2: Global Governance Overview

Primary asset need:

- a hybrid of global map and systems relationships

Supporting asset types:

- global map base
- relational overlays between actors and institutions
- educational surface cards or callouts

Asset role:

- make the system visible before it is explained in text
- support interaction through hotspots, relationships, and guided focus states

Guardrail:

- the visual complexity should feel rich, but still readable

#### Chapter 3: UN Command Center

Primary asset need:

- chamber or room concept art

Supporting asset types:

- spatial environment background
- entry-point markers for major UN bodies
- optional institutional visual symbols

Asset role:

- make the UN feel explorable and place-based
- support the room or chamber metaphor visually before detailed reading begins

Guardrail:

- keep the room concept clear enough that users understand where to interact

#### Chapter 4: Governance Limits and Enforcement

Primary asset need:

- dramatic comparison panels plus explanatory diagrams

Supporting asset types:

- split-screen visual compositions
- rule versus power versus enforcement diagrams
- contrast-driven textures or visual framing elements

Asset role:

- turn abstract tension into a visible argument
- support internal comparison states without relying on long explanation blocks

Guardrail:

- contrast should feel sharp, but the teaching logic must stay understandable

#### Chapter 5: West Philippine Sea Dossier

Primary asset need:

- combined investigation kit of map, timeline, and evidence visuals

Supporting asset types:

- regional map assets
- event timeline assets
- evidence-card or dossier surfaces
- contextual geographic overlays

Asset role:

- support the case-study chapter as an investigation environment
- keep chronology, geography, and evidence all legible within the same chapter system

Guardrail:

- this chapter must stay visually rich without becoming cluttered

#### Chapter 6: Conclusion and References

Primary asset need:

- cinematic ending visual with subtle source-support design elements

Supporting asset types:

- closing background mood image
- recap-support visual framing
- restrained trust or reference-support elements

Asset role:

- deliver a memorable ending
- preserve credibility without turning the final screen into a dry bibliography

Guardrail:

- references should feel visible and trustworthy, but not dominate the closing experience

### Diagram Direction

Diagrams in the proposal should already feel presentation-ready in concept.

This means they should not be treated as rough placeholders only. Even when not fully produced, they should communicate:

- composition intent
- information hierarchy
- interaction role
- visual tone

Key diagram families to plan:

1. systems and actor relationship diagrams
2. rule versus power versus enforcement diagrams
3. timeline and chronology graphics
4. evidence-support and trust-oriented surfaces

### Generated Image Direction

Generated images should mainly follow an atmospheric concept-art style with educational overlays.

This means:

- mood and identity come first
- the image should leave space for interface and learning layers
- backgrounds should feel relevant to the chapter, not generically pretty
- they should avoid becoming too visually busy

### Motion-Linked Asset Planning

Motion-aware planning should be explicit now rather than deferred.

For each major chapter scene, the asset plan should consider:

- background layer
- midground scene layer
- foreground teaching surface
- optional motion or cue overlays

This will make later cinematic transitions, depth effects, and controlled reveals easier to implement.

### Mobile Asset Planning

Desktop and mobile variants should be planned intentionally from the start.

This does not require fully separate art for every chapter, but it does require:

- knowing what can crop safely
- knowing what must simplify
- knowing which surfaces need alternate composition on smaller screens

### Credibility-Sensitive Assets

The asset category that most needs academic discipline is evidence and source-support visuals.

These assets should prioritize:

- legibility
- trustworthy tone
- clear connection to references or evidence
- minimal visual ambiguity

They should not feel theatrical in a way that weakens credibility.

### Production Priority Order

The first asset-production attention should go to:

1. Hero Narrative Frame
2. Global Governance Overview

These first two chapters should establish:

- the mood-asset standard
- the chapter-scene layering system
- the balance between atmosphere and educational overlays
- the mobile adaptation approach

After that, the next likely asset-heavy chapter is:

3. West Philippine Sea Dossier

### Proposal-Stage Asset Deliverables

At this stage, the proposal should define:

- asset categories
- chapter-by-chapter asset needs
- production priority order
- motion-layering assumptions
- mobile-variant expectations

This is enough to guide later image generation, design production, and implementation planning.

## 7. Interaction Spec

### Interaction Questionnaire Answers

1. Homepage entry feeling: `C` - A strong cinematic opening beat before the learner starts
2. Chapter transition feeling: `C` - Strong and theatrical, but still controlled
3. Top-level chapter movement trigger: `A` - Explicit button or arrow clicks
4. Internal chapter transitions: `C` - Spatial slide or reveal feeling with clear orientation
5. How much motion should teach content: `B` - Some, where it clarifies structure
6. Desktop hover behavior: `C` - Rich feedback like glow, depth, motion, or preview states
7. Selected hotspot or panel behavior: `B` - Show the content and update nearby cues
8. Orientation cue visibility: `C` - Strong enough that users always know where they are
9. Chapter progress behavior: `C` - Interactive progress system that also helps navigation
10. Internal chapter progress: `A` - None unless needed
11. Navbar behavior while exploring: `C` - Morph and adapt to the current chapter state
12. Reduced-motion behavior: `C` - Keep the same structure and meaning, but swap to calmer equivalents
13. Interaction feedback preference: `C` - Rich and premium as long as it stays usable
14. Mobile swipe behavior: `C` - Make swipe feel native where it helps, but never mandatory
15. Dense learning interaction priority: `C` - A balance of immersion and clarity
16. End-of-chapter behavior: `C` - A strong end-of-chapter moment with takeaway and forward motion
17. Museum-like interaction inspiration: `C` - Strongly inspired by immersive museum installations
18. Fast user movement handling: `C` - Allow freedom, but use subtle pacing and state management to prevent disorientation

### Interaction Strategy Summary

The redesigned homepage should feel directed, immersive, and premium, but not confusing. The interaction model should create the feeling of moving through a curated exhibit rather than scrolling through a normal site.

The key interaction principle from these answers is:

- top-level movement should feel deliberate
- internal movement should feel spatial
- orientation should always stay clear

### Core Interaction Principles

1. Deliberate top-level movement
Top-level chapter changes should happen primarily through explicit actions such as arrows, buttons, or clearly intentional controls rather than passive long-scroll behavior.

2. Spatial internal movement
Inside dense chapters, movement should feel like the learner is entering the next panel, room, state, or reveal rather than seeing a flat content swap.

3. Strong orientation at all times
Users should always understand:

- which chapter they are in
- where they are within that chapter
- what the next move is

4. Premium feedback, controlled behavior
Hover, focus, selection, and state changes should feel rich and crafted, but they should never create noise or ambiguity.

5. Motion should teach, not distract
Motion is welcome where it clarifies structure, hierarchy, state change, or progression. It should not exist purely for spectacle.

### Entry Experience

The homepage should open with a cinematic opening beat before normal exploration begins.

This does not need to be a long intro. It can be a short settling sequence that:

- establishes the mood
- frames the stage
- makes the homepage feel intentionally entered rather than instantly dumped on screen

Working goal:

- create a memorable first impression without delaying the learner unnecessarily

### Top-Level Chapter Navigation

Top-level chapter movement should primarily rely on explicit controls.

Preferred movement methods:

- chapter arrows
- intentional chapter buttons
- navbar chapter selection

Supporting cues can still exist, but the experience should not depend on uncontrolled vertical scrolling as the main navigation model.

### Chapter Transition Behavior

Chapter transitions should feel strong and theatrical, but still controlled.

That means:

- movement between chapters should feel meaningful
- transitions should reinforce that the learner is entering a new world
- the system should avoid chaotic or overly long transition patterns

Working transition character:

- cinematic
- guided
- chapter-defining

### Internal Chapter Navigation

For dense sections, internal movement should feel spatial and clearly oriented.

Recommended patterns:

- slide or reveal transitions
- step-based scene changes
- panel shifts with persistent context anchors

Internal changes should avoid the feeling of random replacement. The learner should feel that the chapter still has continuity while the current teaching state advances.

### Hover and Interaction Feedback

Desktop interaction feedback should feel rich and premium.

Preferred feedback behaviors:

- glow or illumination
- depth or elevation changes
- gentle preview states
- motion cues on interactive regions

These should help learners recognize what can be explored without overwhelming the scene.

### Selected State Behavior

When a hotspot, panel, or subview is selected, the chosen content should appear and nearby cues should update with it.

This means selection can influence:

- labels
- surrounding markers
- detail surfaces
- local emphasis states

But selection does not always need to fully rebuild the entire scene.

### Orientation System

Orientation cues should be strong enough that the learner never loses track of position.

The interaction design should clearly communicate:

- current chapter
- available next move
- whether the learner is inside a subview or not
- how to return or move forward

The experience can be immersive without becoming ambiguous.

### Chapter Progress System

The chapter progress system should be interactive, not passive.

It should help learners:

- see where they are in the full journey
- move to other chapters intentionally
- understand that the homepage is a guided multi-stage experience

This replaces the old feeling of a side rail with a more integrated system that belongs to the redesigned stage.

### Internal Progress Rules

Internal sub-progress should not be forced into every chapter.

Rule:

- only introduce visible internal progress when the chapter truly needs multiple structured states

This keeps simple chapters elegant and keeps dense chapters understandable.

### Navbar Behavior

The navbar should morph and adapt to chapter state.

This means it can:

- shift emphasis as chapters change
- expand or contract contextually
- visually integrate into the current stage
- act as a navigation instrument rather than a static header

It should feel like part of the experience, not a bar sitting above it.

### Reduced-Motion Behavior

Reduced-motion mode should preserve the same structure, meaning, and navigation model while swapping to calmer equivalents.

This means reduced motion should still retain:

- chapter separation
- state change clarity
- orientation cues
- guided progression

The experience should not collapse into a completely different information architecture when motion is reduced.

### Mobile Interaction Behavior

Mobile should support swipe naturally where it helps, but swipe must never be the only way to navigate.

Required mobile behavior:

- clear tap-based controls
- native-feeling swipe opportunities where appropriate
- preserved chapter identity
- reduced simultaneous complexity

The mobile experience should still feel premium, but interaction density should be controlled carefully.

### Dense Learning Moments

When a chapter contains a lot of educational depth, the interaction should balance immersion and clarity.

This means:

- use visual transitions to maintain engagement
- keep the number of simultaneous decisions low
- reveal content progressively
- preserve a strong teaching takeaway per step

### End-of-Chapter Behavior

Each chapter should end with a strong moment that provides:

- a takeaway
- a sense of closure
- a clear forward motion into the next chapter

The chapter ending should feel more intentional than a simple "next" button.

### Museum-Like Interaction Inspiration

The interaction model should strongly draw from immersive museum installations.

Desired qualities:

- guided discovery
- spatial exploration
- visible progress through a curated narrative
- memorable transitions between themed zones

The homepage should feel like an exhibit sequence, not a standard educational article.

### Fast-Movement Handling

Users should be allowed to move freely, but the system should use subtle pacing and state management to prevent disorientation.

This can include:

- preserving chapter anchors during rapid transitions
- keeping progress and current-state cues visible
- avoiding abrupt loss of context
- ensuring the interface always communicates what just changed

The goal is not to slow users down forcibly. The goal is to protect orientation while still allowing confident movement.

### Interaction Deliverables for Proposal Stage

At this proposal stage, the interaction spec should define:

- entry behavior
- top-level chapter movement
- internal chapter movement
- hover, focus, and selected-state patterns
- orientation and progress behavior
- mobile interaction rules
- reduced-motion equivalents
- end-of-chapter behavior

This gives the redesign a behavior contract early, before implementation details begin.

## 8. Technical Impact Note

### Technical Impact Questionnaire Answers

1. Technical depth expectation: `C` - Full homepage architecture rethink within the SPA
2. `App.tsx` homepage composition: `C` - Rebuild the public homepage composition around the new chapter model
3. Current navigation model: `C` - Replace it with a new chapter-state navigation system
4. `NavigationContext` and hash behavior: `C` - Expect a major redesign of navigation state and progression logic
5. Current `Navbar`: `C` - Rebuild it as a new adaptive chapter-navigation component
6. Current `SectionProgressRail` idea: `C` - Remove or replace it with a new integrated progress system
7. Generic `NarrativeSection` pattern: `C` - Expect most chapters to move away from that generic section template
8. Chapter customization level: `C` - Highly custom chapter implementations
9. Data-driven section content model: `C` - Rethink it so it can drive chapter states, visuals, and internal navigation
10. Floating chat integration impact: `A` - Very little
11. Test impact expectation: `C` - Significant rework of homepage test coverage and interaction cases
12. Most technically tricky area: `C` - Rich interactive chapter state plus motion behavior
13. Current URLs and hashes: `C` - We can redesign them if needed
14. Accessibility constraints: `C` - Treat them as first-class architecture constraints from the start
15. Performance concerns: `C` - Treat performance and lazy-loading as part of the redesign architecture
16. Playwright chapter and content tests: `C` - Redesign the homepage E2E strategy around chapter navigation and internal states
17. First technical area to analyze after proposal: `C` - Visual implementation and animation feasibility
18. Implementation posture after approval: `C` - Bold refactor with a new public homepage foundation

### Technical Impact Summary

This proposal should be treated as a foundational redesign of the public homepage, not as a surface-level UI refresh.

The technical direction implied by these answers is:

- rebuild the public homepage around a new chapter-state model
- replace major parts of the current public navigation architecture
- move away from the generic long-scroll narrative section system
- accept that test coverage, motion behavior, and responsive behavior will need substantial redesign

This is a high-change proposal inside the existing SPA, not a low-risk visual polish pass.

### Overall Risk Profile

Risk level for the public homepage redesign:

- high implementation impact
- high UI-system change
- high testing fallout
- moderate integration risk with existing chat and content systems

Why the risk is high:

- the current public flow is built around section anchors and scroll-aware state
- the redesign wants explicit chapter states, internal subviews, cinematic transitions, and adaptive navigation
- those goals change both page composition and the behavior contract beneath it

### Expected Architecture Shifts

The redesign likely requires changes in these layers:

1. top-level public homepage composition
2. public navigation and progress state
3. chapter content data model
4. chapter component architecture
5. motion and scene-layering implementation
6. homepage testing strategy

### App Composition Impact

The current public homepage composition in `src/App.tsx` should be expected to change substantially.

Likely change direction:

- replace the current long-flow section composition
- introduce a new top-level chapter staging model
- separate top-level chapter transitions from internal chapter state transitions
- support more custom per-chapter rendering instead of one mostly shared section pipeline

Working implication:

- the public homepage may still live in the SPA entry, but it should no longer be treated as a simple sequence of vertically arranged sections

### Navigation Architecture Impact

The existing public navigation model should be treated as a likely replacement target rather than a stable base.

Why:

- the current model is tied to hash-based anchors and scroll-position reconciliation
- the redesign expects deliberate chapter transitions, internal subviews, and a progress-aware immersive shell
- those expectations are better served by explicit chapter state than by adapting the old scroll-first logic indefinitely

Likely architectural shift:

- move from anchor-dominant navigation to chapter-state navigation
- maintain explicit awareness of current chapter and optional internal substate
- allow forward/back chapter transitions as first-class interactions

### NavigationContext Impact

`NavigationContext` should be expected to undergo major redesign if this proposal moves into implementation.

Likely responsibilities in the new model:

- current top-level chapter state
- optional internal chapter state
- transition orchestration
- integrated progress behavior
- compatibility decisions for hashes or deep links

Important note:

- this is likely one of the biggest architectural seams in the redesign

### Navbar Impact

The current `Navbar` should be expected to become a new adaptive chapter-navigation component rather than a simple visual refresh.

Likely changes:

- adaptive shape or mode changes
- chapter-aware state presentation
- integration with progress behavior
- support for explicit chapter movement controls

This should be treated as a behavioral redesign, not only a styling update.

### Progress System Impact

The current `SectionProgressRail` concept should be considered replaceable.

Expected direction:

- remove the old side-rail mental model
- introduce a new integrated progress system that belongs to the immersive chapter shell
- allow progress to function as both orientation and navigation support

### NarrativeSection Impact

The current generic `NarrativeSection` pattern should be expected to shrink in importance or disappear for most flagship chapters.

Why:

- the redesign wants highly custom chapter implementations
- one shared vertical narrative template is unlikely to carry the new layout, motion, and interaction needs well

Practical implication:

- some shared primitives may survive
- the dominant pattern will likely shift from "generic section template" to "custom chapter stage"

### Chapter Component Impact

`Hero`, `Overview`, `UN`, `Governance Limits`, `WPS`, and `Conclusion` should all be expected to become highly custom chapter implementations.

This means the implementation likely moves toward:

- custom scene layout per chapter
- chapter-specific interaction logic
- chapter-specific asset layering
- internal state management only where needed

### Content Model Impact

The existing data-driven content model should likely be rethought so it can support:

- chapter states
- internal subviews
- visual asset references
- richer interaction metadata
- motion-aware structure

This does not automatically require abandoning all content data files, but it does suggest that the current model will be too thin if left unchanged.

### Chat Integration Impact

The floating chat appears to be one of the less disruptive areas technically.

Current expectation:

- keep its role mostly stable
- avoid turning it into a core chapter-state driver
- ensure layout coexistence remains clean inside the new stage model

This is still worth checking during implementation, but it is not currently expected to be the main architecture risk.

### Accessibility Impact

Accessibility should be treated as a first-class architecture constraint from the start.

This redesign will need to preserve:

- keyboard reachability
- visible focus states
- reduced-motion equivalents
- clear orientation
- readable content layers
- non-confusing progress and navigation cues

Because the redesign is interaction-heavy, accessibility cannot be postponed to the end without likely causing rework.

### Performance Impact

Performance and lazy-loading should be designed in from the beginning.

Why this matters:

- the redesign wants heavy backgrounds, layered scenes, and stronger motion treatment
- naive implementation would increase rendering cost, asset weight, and interaction complexity

Expected technical planning needs:

- asset loading strategy
- lazy-loading or staged loading for heavy chapter visuals
- careful motion implementation
- mobile-specific simplification paths

### Testing Impact

Homepage test coverage should be expected to undergo significant redesign.

Likely testing implications:

- update or replace current homepage Playwright assumptions
- cover explicit chapter transitions
- cover internal chapter states
- cover orientation and progress behavior
- cover reduced-motion behavior in the new model
- cover mobile variants more intentionally

This should be treated as a new E2E strategy for the public homepage rather than a simple selector refresh.

### Most Technically Tricky Area

The riskiest technical zone is likely:

- rich interactive chapter state plus motion behavior

This is where several concerns overlap:

- state complexity
- motion orchestration
- responsiveness
- accessibility
- performance
- testing

This area should be analyzed early before implementation begins.

### URL and Hash Strategy

The redesign does not need to preserve current URLs and hashes at all costs.

This means:

- current hash behavior can be reconsidered
- chapter deep-linking can be redesigned if needed
- implementation should choose the model that best fits the new experience rather than forcing old anchors to survive

This is a deliberate flexibility choice, but it should still be documented carefully during implementation planning.

### First Technical Analysis After Proposal

The first technical investigation after proposal approval should focus on:

- visual implementation feasibility
- animation and motion architecture
- stage-layer composition strategy

Reason:

- the experience depends heavily on whether the cinematic chapter model can be built cleanly, responsively, and accessibly in the current stack

### Recommended Implementation Posture

Implementation should be approached as a bold refactor with a new public homepage foundation.

That does not mean reckless implementation. It means:

- do not pretend the old architecture can absorb this redesign with minor patching
- choose a cleaner foundation for the new chapter model
- design architecture, performance, motion, accessibility, and testing together rather than sequentially

### Proposal-Stage Technical Deliverables

At this stage, the technical impact note should clearly communicate:

- which public-facing structures are likely to be rebuilt
- where architecture risk is concentrated
- which old patterns are likely to be retired
- how accessibility and performance must remain architectural concerns
- how testing strategy will likely change

This makes the proposal honest about scope before implementation work begins.

## 9. Acceptance Criteria for Approval

### Acceptance Questionnaire Answers

1. Most important for approval: `C` - Clear visual direction, clear structure and scope, plus technical honesty
2. Homepage structure must be true: `C` - Each navbar item maps to one main chapter and each chapter is full-screen and visually distinct
3. Content must be true: `B` - The proposal clearly commits to visual-first learning
4. Interaction must be true: `C` - Top-level and internal navigation are clearly defined, and the proposal explains orientation, progress, and transitions
5. Visuals must be true: `C` - Each chapter has a distinct visual identity and the system feels premium and immersive
6. Technical scope must be true: `C` - The proposal is honest that this is a major refactor and identifies the risky architectural areas
7. Accessibility must be true: `B` - Accessibility is treated as an architectural constraint
8. Performance must be true: `C` - Heavy visuals and motion are acknowledged as risks, and lazy-loading or staged loading are part of the plan
9. Testing must be true: `C` - The proposal acknowledges major homepage test updates and defines that E2E strategy will need redesign
10. Chat must be true: `A` - Chat stays available across chapters
11. Mobile must be true: `B` - Mobile is planned intentionally, not as an afterthought
12. Assets must be true: `C` - The proposal identifies asset needs per chapter and sets a production priority order
13. Implementation readiness must be true: `C` - The proposal is detailed enough to guide wireframes and architecture planning
14. Failed proposal condition: `A` - If it looks exciting but stays vague, it is not ready
15. What should still come next before approval: `B` - Acceptance criteria plus rollout plan

### Approval Standard Summary

This proposal should only be considered approval-ready if it is simultaneously:

- visually clear
- structurally clear
- technically honest

It cannot pass on style alone. It also cannot pass on technical seriousness alone. It must show a coherent new experience and explain what it will cost to build responsibly.

### Required Approval Conditions

For this proposal to be considered strong enough for approval, all of the following should be true:

1. Chapter structure is explicit

- each navbar item clearly maps to one major chapter
- each chapter is treated as a full-screen destination
- each chapter feels visually distinct from the others

2. Visual-first learning direction is unmistakable

- the proposal clearly commits to a visual-first learning experience
- the redesign direction is not mistaken for a simple content restyle
- the 60/40 design-to-text balance remains visible in the plan

3. Interaction model is clearly defined

- top-level chapter movement is defined
- internal chapter movement is defined
- orientation, progress, and transition behavior are explained

4. Visual system is strong enough to guide execution

- each chapter has a distinct visual identity
- the visual language feels premium and immersive
- the chapter worlds feel intentional rather than decorative

5. Technical scope is honest

- the proposal clearly states that this is a major public-homepage refactor
- the riskiest architectural seams are identified
- the likely replacement areas are named instead of hidden

6. Accessibility is architectural, not optional

- accessibility is treated as a first-class design and implementation constraint
- reduced-motion, orientation clarity, and keyboard reachability remain protected in the proposed system

7. Performance is planned into the redesign

- heavy visuals and motion are explicitly recognized as risks
- staged loading, lazy-loading, or equivalent performance planning is part of the redesign direction

8. Testing impact is acknowledged up front

- the proposal is explicit that homepage test coverage will need major updates
- the browser interaction strategy is expected to change alongside the architecture

9. Chat remains available

- the source-aware chat remains part of the public learning experience
- the redesign does not accidentally remove or marginalize it out of scope

10. Mobile is planned intentionally

- mobile is treated as part of the experience architecture
- the chapter model is adapted for mobile on purpose rather than compressed at the end

11. Asset needs are concrete

- each chapter has defined asset needs
- the proposal includes a production-priority order
- the asset strategy supports both mood and educational clarity

12. The proposal is implementation-useful

- it is detailed enough to guide wireframes
- it is detailed enough to guide architecture planning
- it can act as a real handoff into design or engineering work

### Failure Conditions

At this stage, the proposal should be considered not ready if:

- it looks exciting but remains vague
- it sounds cinematic but does not define structure
- it looks visually ambitious but avoids technical consequences
- it gestures at immersion without defining behavior, assets, or architecture

The clearest failure mode is not lack of creativity. The clearest failure mode is attractive vagueness.

### Current Proposal Readiness Intent

This section sets the standard that the proposal should satisfy before it is treated as approved for implementation planning.

The target is:

- strong concept clarity
- strong execution clarity
- honest technical scope

### Next Items Needed Before Sign-Off

The acceptance criteria and rollout plan that were identified as missing during the questionnaire phase are now included in this document.

The remaining practical next steps are:

1. wireframes and visual mockups
2. optional feasibility spike for animation and scene-layer architecture
3. implementation planning once the design package is stable

## 10. Rollout Plan

### Rollout Questionnaire Answers

1. Overall rollout shape: `C` - A major new homepage foundation first, then chapter rollout on top
2. First step after proposal approval: `A` - Visual mockups first
3. Current homepage during build: `A` - Replace it directly as work progresses
4. First implementation phase focus: `A` - New navigation and progress shell only
5. First chapters to ship in the new system: `A` - Hero and Overview
6. Later chapter rollout approach: `A` - One chapter at a time
7. Main goal of Phase 1: `C` - Prove both design quality and technical foundation together
8. Asset production ramp-up: `A` - After wireframes are stable
9. Motion and animation timing: `A` - After static layouts are stable
10. Testing phase strategy: `C` - Define the new testing strategy early, then implement coverage phase by phase
11. Accessibility phase strategy: `C` - Build it into every phase from the start
12. Performance phase strategy: `C` - Treat performance budgets and lazy-loading as part of every phase
13. First real milestone: `B` - A working shell plus redesigned Hero and Overview
14. Fallback planning level: `C` - Strong rollback or fallback thinking in case the new foundation gets too risky
15. Before full implementation starts: `B` - Finalize proposal plus wireframes

### Rollout Strategy Summary

The redesign should roll out by establishing a new homepage foundation first, then migrating chapters onto that foundation progressively.

This is not a one-shot "replace everything at once" plan. It is a staged rebuild where:

- the new public shell comes first
- Hero and Overview become the first proof chapters
- later chapters migrate one by one
- testing, accessibility, and performance are carried through every phase

### Rollout Principles

1. Foundation before breadth
Do not try to redesign every chapter before the new navigation, progress, and chapter-stage shell are proven.

2. Visual direction must be seen early
The first post-proposal output should be visual mockups so the experience can be judged concretely before deeper implementation cost is paid.

3. Progressive chapter migration
After the new shell exists, chapters should move into it one at a time instead of waiting for a single massive final release.

4. Continuous quality constraints
Testing, accessibility, and performance should advance with each phase rather than being deferred to the end.

5. Keep fallback options alive
Because this is a bold refactor, the rollout should preserve explicit fallback thinking in case the new foundation proves harder than expected.

### Pre-Implementation Gate

Before full implementation begins, the proposal work should complete:

1. final proposal
2. wireframes

This is the minimum planning threshold before code implementation should begin.

Visual mockups should be the first major artifact immediately after proposal approval.

### Phase 0: Proposal Closeout And Visual Mockups

Goal:

- finalize the proposal package
- turn the approved direction into concrete visual mockups

Outputs:

- completed proposal artifact
- chapter-level mockups, especially for Hero and Overview
- clearer visual language for shell, chapter stage, and progress behavior

Why this phase matters:

- it reduces ambiguity before architecture and implementation work deepen
- it lets the team validate whether the proposed tone and structure actually work visually

### Phase 1: New Homepage Shell Foundation

Goal:

- build the new navigation and progress shell that can support the chapter-based experience

Primary focus:

- new top-level chapter shell
- new progress behavior
- new navigation behavior
- new stage framing for full-screen chapters

What this phase should prove:

- the redesigned shell can support the intended experience
- the new navigation model is viable
- the new foundation is technically workable inside the current SPA

Quality expectations during Phase 1:

- accessibility considerations are active from the start
- performance assumptions are reviewed early
- testing strategy for the new shell is defined early

### Phase 2: First Proof Chapters - Hero And Overview

Goal:

- implement the first two redesigned chapters on top of the new shell

Primary focus:

- redesigned Hero Narrative Frame
- redesigned Global Governance Overview
- first real integration of visual direction, content model, and interaction patterns

Why these chapters first:

- they establish the emotional and structural tone of the whole redesign
- they validate the relationship between scene assets, educational overlays, and chapter movement

First real milestone:

- a working new homepage shell plus redesigned Hero and Overview

This milestone should be considered the first serious proof that the redesign is viable.

### Phase 3 And Beyond: Progressive Chapter Migration

After the first milestone, remaining chapters should move one at a time.

Recommended progression shape:

1. UN Command Center
2. Governance Limits and Enforcement
3. West Philippine Sea Dossier
4. Conclusion and References

Why one chapter at a time:

- it limits change risk
- it makes testing and validation more targeted
- it allows the system to improve based on lessons from each migrated chapter

### Asset Production Timing

Asset production should ramp up after wireframes are stable.

This helps avoid:

- generating expensive assets too early
- locking in visuals before structure is settled
- producing chapter art that later clashes with layout reality

Practical implication:

- concept direction can exist early
- production-grade asset effort should follow stable wireframe decisions

### Motion And Animation Timing

Motion work should come after static layouts are stable.

Why:

- the redesign depends on strong motion, but motion should reinforce proven structure
- building motion too early can create rework if layout or state logic changes

Recommended posture:

- note motion intent early
- implement motion after chapter structure is stable enough to support it cleanly

### Testing Rollout

Testing strategy should be defined early and then implemented phase by phase.

Expected testing cadence:

- define new homepage test strategy during early foundation work
- add shell coverage when the new shell lands
- add chapter coverage as each redesigned chapter lands
- refine reduced-motion, mobile, and progress-state coverage progressively

This avoids a late testing scramble.

### Accessibility Rollout

Accessibility should be built into every phase from the start.

This means each phase should consider:

- keyboard reachability
- focus visibility
- reduced-motion equivalents
- readable layout behavior
- orientation clarity

Because the redesign is interaction-heavy, postponing accessibility would create structural rework.

### Performance Rollout

Performance should be treated as part of every phase.

Each phase should consider:

- asset weight
- scene complexity
- lazy-loading opportunities
- mobile cost
- motion cost

The redesign should not assume performance tuning can be postponed until the end.

### Fallback And Rollback Planning

This rollout should include strong fallback thinking.

Because the redesign is bold, the implementation plan should be able to answer:

- what happens if the new shell becomes too complex
- what happens if chapter-state navigation becomes too fragile
- what happens if performance costs become too high

Fallback mindset:

- keep implementation checkpoints visible
- preserve the ability to simplify chapter behavior if needed
- avoid locking into irreversible complexity too early

### Recommended Delivery Shape

Recommended delivery order:

1. Proposal finalization
2. Wireframes and visual mockups
3. New homepage shell foundation
4. Hero
5. Overview
6. UN Command Center
7. Governance Limits and Enforcement
8. West Philippine Sea Dossier
9. Conclusion and References

This sequence keeps the rollout aligned with both risk control and visible progress.

### Proposal-Stage Rollout Deliverables

At this stage, the rollout plan should clearly communicate:

- the staged implementation shape
- the first milestone
- the chapter migration order
- when assets and motion work ramp up
- how testing, accessibility, and performance are carried through
- how fallback thinking is preserved

This gives the proposal a credible path from concept to implementation.

## Cross-Chapter Experience Rules

- each main chapter should feel visually distinct
- each chapter should read as a full-screen destination, not just a tall section
- internal sub-navigation is allowed when content is too dense for one screen
- chapter changes should feel intentional and guided
- mobile behavior must remain usable and clear even if the desktop version is more cinematic
- the source-aware chat must remain compatible with the new chapter model

## Optional Next Artifacts

If the proposal moves forward, the most useful follow-on artifacts are:

1. chapter wireframes and visual mockups, starting with Hero and Overview
   Current companion artifact: `archive/docs/planning-artifacts/public-homepage-hero-overview-wireframes.md`
   Visual brief: `archive/docs/planning-artifacts/public-homepage-hero-overview-visual-brief.md`
   Mockup assembly brief: `archive/docs/planning-artifacts/public-homepage-hero-overview-mockup-assembly-brief.md`
2. a lightweight feasibility spike for chapter-state animation, stage layering, and responsive motion behavior
3. a production-ready implementation plan broken into shell work and chapter migrations
   Implementation checklist: `archive/docs/planning-artifacts/public-homepage-implementation-checklist.md`
4. a targeted homepage risk register covering accessibility, performance, and interaction complexity
5. asset-generation briefs or prompts for the first visual exploration pass

## Working Notes

- user wants this file to be continuously updated as discussion and preparation continue
- this file should remain the live working artifact for the public homepage redesign proposal unless the user asks to split it into separate documents
