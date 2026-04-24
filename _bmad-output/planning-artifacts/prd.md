---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - archive/docs/planning-artifacts/global_governance_website_prd.md
  - archive/docs/planning-artifacts/global_governance_version_c_feature_pitch.md
  - archive/docs/planning-artifacts/global_governance_version_c_build_roadmap.md
  - archive/docs/planning-artifacts/global_governance_chatbot_architecture_spec.md
  - archive/docs/planning-artifacts/global_governance_coding_agent_guide.md
  - archive/docs/planning-artifacts/global_governance_animation_architecture_decision.md
workflowType: 'prd'
workflow: 'edit'
date: 2026-04-22
lastEdited: 2026-04-23
editHistory:
  - date: 2026-04-23
    changes: Motion remains the primary animation system; Lenis handles scroll feel; GSAP is limited to selective showcase scenes.
  - date: 2026-04-23
    changes: Validation fixes applied for measurability, scope clarity, edtech compliance detail, and tool-agnostic non-functional requirements.
briefCount: 0
researchCount: 0
brainstormingCount: 0
projectDocsCount: 0
userProvidedDocsCount: 6
classification:
  projectType: web_app
  domain: edtech
  complexity: medium
  projectContext: greenfield
technicalImplementationDifficulty: high
---

# Product Requirements Document - Global-Governance

**Author:** Nakko
**Date:** 2026-04-22

## Executive Summary

Global Governance Website is a greenfield educational web application for GNED-07: The Contemporary World. It teaches Global Governance through a premium single-page experience that combines academically grounded content, guided scrollytelling, interactive institutional exploration, and a grounded AI assistant. The primary users are students who need to understand and present the topic clearly, classmates who need a more accessible way to learn it, and evaluators who need to see academic rigor alongside strong execution.

The product solves a comprehension gap. Global Governance is often taught as an abstract system of institutions, principles, and legal concepts that students can describe but struggle to connect to real-world power, enforcement limits, and consequences. This product addresses that gap by making the system visible, interactive, and concrete through structured explanation, exploration of the United Nations, and a West Philippine Sea case study that shows how global governance works and where it breaks down. The intended result is a learning experience that improves understanding, presentation quality, and retention more effectively than a traditional report, slide deck, or static website.

### What Makes This Special

The product differentiates itself by combining premium presentation with academic credibility. It uses cinematic visual design, smooth narrative flow, interactive learning modules, adaptive content depth through Student and Expert modes, and a grounded chatbot that answers from approved sources rather than acting as a general-purpose assistant. The experience is designed to be visually memorable without sacrificing clarity, source discipline, or educational usefulness.

The core insight is that students understand complex global systems better when institutional roles, power relationships, and enforcement failures are presented as an explorable experience instead of disconnected text blocks. By turning Global Governance into a guided interactive documentary-style web experience, the product makes a dense topic easier to follow, easier to present, and more credible in an academic setting.

The interaction layer uses Motion as the primary animation system for React UI, Lenis for smooth scroll feel, and GSAP only for isolated showcase scenes that need more advanced choreography.

## Project Classification

This product is classified as a web application in the edtech domain. It is a greenfield project with medium domain complexity and high technical implementation difficulty relative to a typical educational site. The higher implementation difficulty comes from the combination of premium frontend interaction, selective 3D presentation, grounded AI-assisted exploration, retrieval-based chatbot behavior, and local development workflows for the chatbot pipeline.

The frontend interaction model is Motion-first, with Lenis handling scroll behavior and GSAP reserved for rare showcase scenes that cannot be expressed cleanly in Motion.

## Success Criteria

### User Success

Users should finish the experience with a clearer and more confident understanding of Global Governance than they would get from a traditional report, slide deck, or static website. A successful outcome means users can explain the idea of Global Governance in simple terms, identify the major actors involved, describe the role and limits of the United Nations, and connect those ideas to the West Philippine Sea case study as a concrete example of weak enforcement and power imbalance.

The user experience should also reduce confusion and improve presentation confidence. Students should be able to move through the site in a logical sequence without feeling lost, overwhelmed, or forced to interpret dense academic text without support. The grounded chatbot should extend that learning experience by helping users clarify concepts, ask follow-up questions, and explore the approved content more confidently.

User success is measured in rehearsal walkthroughs where representative student users can complete the learning flow, answer core topic checks, and use the chatbot for clarification without needing outside explanation to finish the session.

### Business Success

By demo and submission time, the product should clearly demonstrate both academic rigor and technical ambition. It should be strong enough that a professor or evaluator can recognize it as more than a standard school project, while still seeing that the interactivity serves learning rather than distracting from it.

The project is successful if it stands out visually, communicates the topic clearly, and feels complete and polished in a live presentation setting. It should make classmates understand the subject more easily, give the presenter a stronger platform for explanation, and show evidence of strong research organization, design judgment, and implementation discipline.

Business success is measured in evaluator-style reviews and scripted demo rehearsals where the product completes the full presentation flow, contains no obviously unfinished core sections, and is judged stronger than a conventional report or slide deck for clarity and execution.

### Technical Success

The application should remain stable, readable, and performant despite ambitious interaction design. Core technical success means the single-page experience is responsive, navigation is reliable, motion supports comprehension rather than harming it, and selective 3D use does not degrade usability.

The chatbot must meet a stricter baseline than a typical demo feature. It should answer only from approved project materials, stay on topic, avoid unsupported claims, and respond quickly enough to support live presentation flow. It should also expose source-aware behavior clearly enough that users and evaluators can understand that answers are grounded rather than improvised.

Technical success is measured against the performance, reliability, accessibility, and grounding NFRs in this PRD on the reference demo device.

### Measurable Outcomes

- All core educational sections shall be complete and reachable through the main navigation in scripted walkthrough testing.
- The main learning flow shall complete without broken navigation, missing sections, or blocked interactions during the reference demo walkthrough.
- The reference demo device shall meet NFR1-NFR5 and NFR13-NFR21 during validation testing.
- The chatbot shall meet grounding and refusal expectations defined in NFR9 and NFR24 on the fixed validation question set.

## Product Scope

### MVP - Minimum Viable Product

The MVP should include the complete academic learning flow, a responsive single-page structure, a polished core visual system, scrollytelling, the UN Command Center, the West Philippine Sea Interactive Dossier, and a grounded chatbot integrated into the site. It should also include a strong hero section, even if the most advanced version of the Living Globe Hero is simplified in the initial release.

The MVP must prove the central concept: Global Governance can be taught more effectively through an interactive, academically grounded, premium web experience than through static presentation formats.

### Growth Features (Post-MVP)

Post-MVP growth should strengthen the premium experience rather than redefine the product. This includes the full Living Globe Hero implementation, Student / Expert Mode, richer motion polish, more refined chatbot UX, and additional presentation details that deepen clarity and memorability without changing the core educational flow.

Any future motion polish should keep Motion as the default animation engine and keep GSAP limited to isolated showcase sequences only.

These features should make the product more distinctive and adaptive while building on an already complete educational foundation.

### Out of Scope

The current PRD does not include:
- a general-purpose open-domain assistant
- a full CMS or multi-user publishing platform
- LMS integration, classroom analytics, or account systems unless project scope changes
- multiple heavy 3D scenes or showcase animation sequences beyond the selectively approved moments
- the Global Governance Simulator as an MVP commitment

### Vision (Future)

The future vision includes the Global Governance Simulator as the project's signature stretch feature. This would turn the product from an interactive educational presentation into a more applied learning environment where users can explore governance responses, institutional limits, and actor interactions through a scenario-driven system.

This feature should remain future-facing unless the core site, core interactivity, and grounded chatbot experience are already polished and stable.

## User Journeys

### Journey 1 — Student Presenter Success Path

A student presenter opens the site because they need to understand Global Governance well enough to explain it clearly in class. They begin with only a partial grasp of the topic and mostly think of it as a difficult academic requirement rather than a living system. The opening hero and scrollytelling structure immediately signal that this is not a static report. Instead of being confronted by dense blocks of text, the student is guided through a sequence that explains what Global Governance is, why it matters, who the major actors are, and how the United Nations fits into the system.

As the student moves deeper into the experience, the UN Command Center becomes the turning point. It gives them a clearer mental model of what each UN organ does, what power it has, and where its limits begin. The West Philippine Sea Interactive Dossier then converts theory into something concrete. The student can see the gap between international law, institutional response, and real-world enforcement. The key success moment comes when the student realizes they can now explain the system in their own words instead of repeating memorized definitions. At the end of the journey, the student uses the grounded chatbot to clarify remaining questions, confirm understanding against approved content, and leave with stronger confidence for presentation.

This journey reveals requirements for a clear content sequence, strong section navigation, interactive institutional explanation, a compelling case-study module, comprehension reinforcement, and a grounded chatbot that supports follow-up learning without drifting off-topic.

### Journey 2 — Classmate Learner Exploration Path

A classmate visits the site without needing to present, but wants a faster and more understandable way to learn the topic than reading a conventional paper. They may arrive with low motivation or little prior interest. Their first challenge is deciding whether the site is worth engaging with. The polished visual presentation and guided structure help create curiosity instead of resistance.

As they scroll, they do not necessarily consume every section in order. They move between highlights, focus on visually interesting modules, and use the site to build a practical understanding of the topic. They may spend more time in the case-study section because it connects abstract governance concepts to conflict, law, and power in a way that feels real. If the experience starts to feel dense, the product helps them recover through readable structure, guided pacing, optional simplified explanations, and chatbot-supported clarification. The key success moment is when the learner realizes they can follow the logic of the topic without outside help and can connect the ideas back to a real-world case.

This journey reveals requirements for accessibility of explanation, flexible but coherent navigation, strong visual hierarchy, overload recovery through pacing and simplification, optional adaptive depth, and chatbot support that helps users recover from confusion without making the experience dependent on prior knowledge.

### Journey 3 — Professor or Evaluator Review Path

A professor or evaluator enters the site with a different mindset. They are less concerned with novelty by itself and more concerned with whether the experience is academically credible, well-structured, and meaningful. Their opening question is whether the project is simply visually impressive or whether the design choices genuinely improve understanding.

As they review the site, they look for evidence of research quality, clarity of explanation, disciplined scope, source visibility, and polished execution. They pay close attention to the logic of the learning flow, the treatment of the United Nations, the handling of the West Philippine Sea case, and the credibility of the chatbot. The decisive moment comes when they see that the interactivity is not ornamental. The experience supports comprehension, references are handled transparently, the case study demonstrates applied understanding, and the chatbot behaves like a grounded academic assistant rather than a generic AI toy.

At the end of the journey, the evaluator should conclude that the project combines strong research, thoughtful instructional design, disciplined source use, and ambitious technical execution in a way that is appropriate for academic presentation.

This journey reveals requirements for academic clarity, visible source discipline, reliable chatbot grounding, coherent narrative structure, polished visual execution, and complete demo readiness with no obviously unfinished areas.

### Journey 4 — Project Maintainer or Admin Readiness Path

A project maintainer prepares the site for demo, review, or future iteration. Their goal is not general learning but confidence that the product is stable, accurate, and controllable. They need to manage approved source material, verify chatbot behavior, check that content and interactions are working correctly, and ensure the system is ready for a live presentation environment.

Their work begins before the demo: reviewing content, confirming that approved materials are available to the chatbot pipeline, and validating that the local development environment for the chatbot pipeline is functioning as expected. They test the chatbot with likely questions, confirm that off-topic or unsupported prompts are handled safely, verify that source-aware behavior is working, and make sure the must-have interactive sections are loading and behaving reliably. They also check for broken content flow, missing assets, navigation issues, and performance problems that could damage confidence during a live presentation.

The journey succeeds when the maintainer can trust the site as a dependable presentation asset rather than a fragile prototype, with clear confidence that both the educational flow and the chatbot experience will hold up under live use.

This journey reveals requirements for content maintainability, approved-source management, reliable local development workflows, chatbot testability, graceful fallback behavior, source validation, and presentation-readiness checks across the whole experience.

### Journey Requirements Summary

These journeys reveal five major capability areas.

First, the product needs a structured educational flow that supports both linear storytelling and selective exploration. Second, it needs flagship interactive modules that make institutions, governance limits, and case-study evidence easier to understand than static content would. Third, it needs adaptive comprehension support through readable content design, optional depth variation, comprehension reinforcement, and a grounded chatbot for clarification. Fourth, it needs evaluator-facing credibility through complete sections, disciplined sourcing, coherent explanations, visible references, and polished execution. Fifth, it needs maintainer-facing reliability through controllable content inputs, stable local workflows, chatbot validation, source-aware behavior, and demo-readiness checks.

## Domain-Specific Requirements

### Compliance & Regulatory

This product should be designed with educational privacy and accessibility expectations in mind, even if it does not operate as a formal institutional student-record system. The MVP should minimize collection of personal data, avoid dependence on student accounts unless they become necessary later, and avoid storing unnecessary user-identifiable information in the chatbot or analytics flow.

Accessibility should be treated as a core educational requirement rather than an optional enhancement. The site should support readable typography, clear semantic structure, keyboard-friendly interaction where practical, sufficient color contrast, and motion restraint so the experience remains usable for learners with different needs. A practical target is WCAG 2.1 AA-aligned design for the final experience.

Because the product is educational and topic-sensitive, it should maintain strong academic content discipline. Explanations, references, and chatbot behavior should stay within approved material boundaries and avoid unsupported claims, fabricated sourcing, or misleading simplifications that would weaken academic credibility.

### Content Guidelines

Educational content updates and chatbot-approved materials should pass a documented review check before release. Each update should verify source support, neutral academic tone, consistency with the approved Global Governance narrative, and consistency with the established West Philippine Sea case-study facts.

### Curriculum Alignment

The MVP should maintain explicit alignment to GNED-07 presentation needs by covering four curriculum anchors:
- definition and purpose of Global Governance
- major actors and institutions involved
- the role and limits of the United Nations
- the West Philippine Sea case as an enforcement-gap example

Content review and demo rehearsal should confirm that each anchor appears in the learning flow, interactive modules, and references set.

### Technical Constraints

The product should favor privacy-minimizing interaction patterns. If no account system is required, the MVP should avoid introducing one. If chat logs or prompt histories are retained during development, they should be limited, intentional, and easy to inspect or clear.

The chatbot introduces additional edtech-specific constraints. It must remain topic-bounded, readable, and appropriate for student learning. It should not behave like a general-purpose assistant, should not invent academic support, and should provide source-aware responses that reinforce trust and instructional value.

Accessibility and readability are also technical constraints on the frontend implementation. Motion, selective 3D, and interactive modules must not block comprehension, overload learners, or create avoidable usability barriers on common student devices.

### Integration Requirements

The MVP should support an approved-source content pipeline that allows project materials to be prepared, ingested, and retrieved consistently for chatbot use. Approved-source storage, local development, and retrieval workflows should support this academic-source management without requiring production-scale system complexity.

If future integrations are considered, they should remain secondary to the core educational experience. LMS integration, classroom analytics, or user-account features should not be treated as MVP requirements unless the project scope changes significantly.

### Risk Mitigations

The biggest domain-specific risks are academic inaccuracy, inaccessible presentation, and loss of trust in the chatbot. These should be mitigated by approved-source discipline, visible references, strong content review, bounded chatbot behavior, and accessibility-conscious design decisions.

Another risk is building an experience that looks premium but teaches poorly. This should be mitigated by prioritizing clarity, structure, comprehension reinforcement, and real-world grounding over spectacle. The project should also avoid unnecessary personal-data collection so the educational experience remains low-friction and lower-risk.

## Innovation & Novel Patterns

### Detected Innovation Areas

The product's most meaningful innovation is not a new technology by itself, but a new interaction model for learning a dense academic topic. Instead of presenting Global Governance as a static report or slide-based explanation, the product combines scrollytelling, interactive institutional exploration, a real-world dossier, adaptive content depth, and a grounded chatbot into one coherent educational experience. The innovation is in the integration: the site is designed to make an abstract political system easier to understand through structured interaction rather than passive reading.

A second innovation area is the role of the chatbot. In many student projects, AI appears as a generic novelty feature. In this product, the chatbot is designed as a bounded academic copilot that answers only from approved material, reinforces source trust, and supports the educational flow rather than replacing it. That makes the chatbot part of the instructional design, not just an add-on.

A third innovation area is adaptive educational depth inside a premium presentation format. The Student / Expert mode concept allows the same system to support quick comprehension and deeper academic explanation without forcing one audience model on every visitor. For this project context, that is a strong differentiator.

### Market Context & Competitive Landscape

Within the project's intended context, the main alternatives are traditional reports, slide decks, static educational websites, and generic AI chat experiences. Relative to those formats, this product is differentiated by combining academic structure, interactive explanation, premium visual execution, and grounded AI-assisted clarification in one experience.

This should not be framed as a claim that no comparable digital experiences exist anywhere. A stronger and more defensible framing is that, for a class-grade Global Governance project, the product introduces a notably more immersive and instructionally integrated format than the conventional alternatives students and evaluators typically expect.

### Validation Approach

The innovative aspects should be validated through comprehension, credibility, and demo-readiness rather than novelty alone. Validation should test whether users understand key ideas more clearly after using the experience, whether evaluators perceive the interactivity as academically useful rather than decorative, and whether the chatbot increases trust and clarity rather than introducing uncertainty.

Practical validation should include walkthrough testing with likely student users, evaluator-style review of source credibility and explanation quality, and live demo checks of chatbot grounding, response usefulness, and performance stability. The innovation is successful only if it improves understanding and presentation confidence, not if it merely looks ambitious.

### Risk Mitigation

The main innovation risk is innovation theater: building a product that feels unusually ambitious but does not actually improve learning. This risk should be mitigated by prioritizing clarity, structured explanation, visible references, and bounded chatbot behavior over spectacle.

A second risk is that the chatbot weakens trust if it feels generic, slow, or insufficiently grounded. This should be mitigated by approved-source discipline, topic restriction, source-aware responses, and fallback behavior when support is weak.

A third risk is that adaptive depth and premium interaction increase complexity without enough payoff. If necessary, the fallback should be to preserve the strongest educational core: scrollytelling, the UN Command Center, the West Philippine Sea dossier, and a reliable grounded chatbot, while simplifying secondary premium layers that do not clearly improve understanding.

## Web Application Specific Requirements

### Project-Type Overview

The product is a single-page educational web application designed for modern desktop and mobile browsers. Its structure depends on continuous navigation, guided scrollytelling, interactive learning modules, and integrated chatbot access inside one coherent browser experience rather than a multi-page content model.

Because the project is presentation-driven and interaction-heavy, the web application architecture should prioritize smooth in-session flow, responsive design, stable client-side interaction, and consistent behavior across common classroom and demo devices.

### Technical Architecture Considerations

The application should be implemented as an SPA with clear section-based navigation and strong client-side state handling for interactive modules such as the UN Command Center, Student / Expert mode, and the grounded chatbot interface. The architecture should support progressive enhancement of premium interaction without making the entire experience dependent on heavy rendering at all times.

### Animation Architecture

The animation stack should use Motion for component-level UI animation, Lenis for scroll feel, and GSAP only for isolated cinematic sequences that need advanced pinning, choreography, or SVG and path control. Repeated patterns such as cards, tabs, accordions, chatbot states, and section reveals should stay on Motion so the codebase keeps one default interaction model. GSAP scenes should be rare, explicit, and lazy-loaded when possible so they do not delay the opening experience or compete with the core narrative flow.

Reduced-motion support must always preserve reading order and completion paths. If an animated treatment conflicts with readability or usability, the simpler version wins.

The frontend should target current versions of major modern browsers, especially Chrome, Edge, Firefox, and Safari. Mobile responsiveness is required, but the primary quality bar should reflect the classroom and live-demo reality that many evaluators will experience the product on laptops first and phones second.

SEO should remain a secondary concern. The product should include basic metadata and page semantics, but search optimization should not distort the product structure or force trade-offs against the intended interactive learning flow.

### Browser Matrix

The application should support modern versions of Chrome, Edge, Firefox, and Safari on desktop, plus modern mobile browser equivalents where feasible. The product should be tested on common laptop resolutions and phone-sized layouts to ensure that navigation, reading flow, and interaction modules remain usable in both contexts.

### Responsive Design

The layout should adapt cleanly across desktop and mobile breakpoints without losing narrative clarity or making dense sections difficult to use. Navigation, section spacing, chatbot placement, and interactive modules should remain understandable and usable across screen sizes. Mobile responsiveness is necessary, but desktop-quality presentation remains especially important because the product will likely be demonstrated in classroom or evaluator-facing settings.

### Performance Targets

The experience should remain smooth and readable on ordinary student laptops and common mobile devices, with particular emphasis on initial load stability, section transition smoothness, and interaction responsiveness in the core learning flow. Premium motion and selective 3D should be limited to moments that materially improve comprehension or first impression, and they must degrade gracefully if they threaten usability or demo stability.

The chatbot must provide responsive perceived interaction through acceptable response times, visible loading feedback, and safe fallback behavior when retrieval or generation is delayed. Heavy below-the-fold experiences should be lazy-loaded where appropriate, and the site should avoid loading patterns that make the opening experience feel heavy or unstable.

Any GSAP showcase scene should be isolated or lazy-loaded so it does not inflate the initial load path.

### SEO Strategy

The product should include basic metadata, document titles, semantic headings, and structured content hierarchy, but advanced SEO strategy is not an MVP concern. Since the primary success context is academic use and live presentation rather than search acquisition, SEO should support clarity and document quality rather than become a product driver.

### Accessibility Level

The target accessibility level should align practically with WCAG 2.1 AA principles. This includes semantic page structure, readable typography, sufficient contrast, keyboard-friendly interaction where practical, visible focus treatment, and motion restraint for users who may be sensitive to animation-heavy experiences.

Accessibility should be treated as part of the educational quality of the product, not as a separate compliance checkbox. If an interaction, motion pattern, or visual treatment reduces comprehension or usability, the accessible and readable option should take priority. Any premium animation layer, including optional GSAP scenes, must preserve keyboard access and reduced-motion behavior.

### Implementation Considerations

The implementation should preserve a strong separation between static academic content, interactive presentation logic, and chatbot-specific behavior. Core educational content should remain maintainable and structured, while premium visual features should be layered in carefully so they can be simplified if performance, usability, or development time become constraints.

The web-app implementation should also support local development workflows for the chatbot and retrieval pipeline, while keeping the main presentation experience robust even when advanced backend-adjacent features are still being refined.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-solving + experience MVP

The MVP should prove one clear claim: a premium, academically grounded web experience can teach Global Governance more effectively than a static report, slide deck, or conventional educational website. This means the MVP cannot be reduced to plain content delivery alone, because the structured interactive experience is part of the product value. At the same time, the MVP should avoid overcommitting to every ambitious concept in the full vision.

The scoping philosophy should be lean but impressive. The MVP must deliver the strongest educational value and the clearest showcase moments while deferring features that increase complexity without being necessary to prove the core concept. The MVP should optimize for proof of educational value, not maximum feature breadth.

**Resource Requirements:** A practical MVP requires frontend implementation strength, content/research discipline, and chatbot pipeline support. In team terms, the ideal delivery model is one frontend-focused builder, one content/research owner, and one technical contributor who can support the grounded chatbot and local workflow. If built by a smaller team or a single primary builder, scope discipline becomes critical and the premium layer should remain selectively implemented.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Student presenter success path
- Classmate learner exploration path
- Professor or evaluator review path
- Basic maintainer or demo-readiness workflow

**Must-Have Capabilities:**
- complete academic learning flow from introduction through conclusion
- section-based scrollytelling structure
- strong hero section that establishes premium quality, even if the most advanced globe implementation is simplified initially
- interactive UN Command Center
- West Philippine Sea Interactive Dossier
- grounded chatbot that answers only from approved sources
- Public chatbot protection for rate limiting, abuse counters, and short-lived cooldown state
- clear references and source visibility
- responsive layout across desktop and mobile
- accessibility-conscious design and readable presentation
- stable performance on ordinary student hardware
- demo-ready reliability for core navigation, content flow, and chatbot interaction

The MVP should be considered successful only if it already feels like a complete educational product rather than a partial prototype with disconnected showcase pieces. The chatbot MVP should remain narrow and trustworthy: limited approved-source coverage, topic-bounded behavior, readable answers, fast-enough perceived responsiveness, safe fallback handling, and public-chat protection suitable for anonymous classroom or demo use. The MVP includes a shared protection layer for anonymous usage with rate limiting, abuse counters, and short-lived cooldowns. Broad grounded-answer caching remains out of scope for the MVP because citation integrity matters more than cache hit rate. The hero should establish quality and identity, but advanced visual sophistication should never delay or weaken the core learning modules.

### Post-MVP Features

**Phase 2 (Post-MVP):**
- full Living Globe Hero implementation
- Student / Expert Mode
- richer chatbot user experience, including stronger prompt guidance and more polished source interaction
- expanded motion polish and premium visual refinement
- stronger presentation transitions and secondary interaction enhancements

**Phase 3 (Expansion):**
- Global Governance Simulator
- more advanced scenario-based applied learning interactions
- expanded case-study depth or additional governance scenarios
- optional broader platform features if the project later evolves beyond a presentation-centered educational site

### Risk Mitigation Strategy

**Technical Risks:**  
The biggest technical risks are performance instability, overengineered frontend behavior, and chatbot grounding quality. These should be mitigated by limiting premium rendering to moments that matter, keeping selective 3D scoped tightly, using lazy loading for heavier experiences, and treating chatbot trustworthiness as more important than novelty.

**Market Risks:**  
The main product risk is that the site appears visually ambitious but does not sufficiently improve understanding. The MVP addresses this by making the educational core non-negotiable: the learning flow, UN module, case-study module, and grounded chatbot must all contribute directly to comprehension and presentation confidence.

**Resource Risks:**  
The main resource risk is trying to build the full Version C vision at once. This should be mitigated by enforcing a phased roadmap, protecting the must-have educational core, and treating advanced premium layers and the simulator as features that can be reduced, simplified, or deferred without invalidating the product. If delivery risk rises, the first cuts should come from premium visual layers and nonessential chatbot refinements rather than from the core learning flow or chatbot trust model.

## Functional Requirements

### Learning Experience & Content Delivery

- FR1: Learners can move through a complete Global Governance learning experience from introduction through conclusion within a single web session.
- FR2: Learners can access structured explanations of Global Governance, its major actors, and its significance in contemporary world affairs.
- FR3: Learners can access structured explanations of the United Nations, its purpose, and its institutional role in global governance.
- FR4: Learners can access explanations of the limits, criticisms, and enforcement challenges of global governance.
- FR5: Learners can access a real-world case study centered on the West Philippine Sea as an applied example of global governance in practice.
- FR6: Learners can access concluding insights and references that connect the educational experience back to the project's core thesis.
- FR7: Learners can consume the educational content without requiring account creation or personal profile setup.

### Navigation & Guided Exploration

- FR8: Learners can navigate the product as a continuous section-based experience.
- FR9: Learners can move directly to major sections of the experience through visible navigation controls.
- FR10: Learners can understand where they are in the learning flow and what major content areas remain.
- FR11: Learners can explore the content in both guided sequential order and selective self-directed order.
- FR12: Learners can recover orientation after jumping between sections or modules.

### Interactive Learning Modules

- FR13: Learners can explore the major organs of the United Nations through an interactive module that distinguishes their functions, powers, and limits.
- FR14: Learners can compare institutional roles and limitations within the United Nations without relying on long-form static text alone.
- FR15: Learners can explore the West Philippine Sea case through an interactive dossier or timeline-based experience.
- FR16: Learners can examine the relationship between legal rulings, geopolitical realities, and weak enforcement within the case study.
- FR17: Learners can use interactive elements that reinforce understanding of the topic rather than merely decorate the experience.

### Comprehension Support & Adaptive Depth

- FR18: Learners can access layered content that separates summary explanation from supporting detail.
- FR19: Learners can access section recaps, visible hierarchy, and next-step cues that help them re-enter the main learning flow after reviewing a section or module.
- FR20: Learners can access simplified and expanded explanation depth through adaptive depth features when those features are enabled.
- FR21: Learners can reinforce understanding through synthesis, recap, or clarification moments within the experience.
- FR22: Learners can engage with a hero or opening experience that establishes context, identity, and tone for the topic.

### Grounded Chatbot Assistance

- FR23: Learners can ask project-related questions through an integrated chatbot experience.
- FR24: The chatbot can answer using approved project materials as its response basis.
- FR25: The chatbot can refuse, redirect, or safely handle questions that fall outside the approved project scope.
- FR26: The chatbot can provide on-page text answers with supporting source information or a visible fallback state when support is weak, delayed, or temporarily limited by public-chat protection rules.
- FR27: Learners can use the chatbot to clarify concepts encountered in the main learning flow.
- FR28: The chatbot can communicate when support is weak or insufficient instead of presenting unsupported certainty.
- FR29: Learners can recognize that chatbot responses are grounded in project-approved material rather than generic open-ended generation.

### Source Credibility & Academic Trust

- FR30: Learners can access visible references or source information that support the academic content of the experience.
- FR31: Learners can inspect source support connected to educational content and chatbot responses.
- FR32: Evaluators can inspect evidence that the project's explanatory content is grounded in approved and disciplined source material.
- FR33: Evaluators can distinguish the chatbot's bounded academic role from that of a general-purpose assistant.
- FR34: The product can preserve alignment between its educational content, approved references, and chatbot-supported answers.

### Maintainer & Content Stewardship

- FR35: Maintainers can define and manage the set of approved materials used to support the chatbot experience.
- FR36: Maintainers can prepare project content and source materials for use in the chatbot support flow.
- FR37: Maintainers can validate that the chatbot behaves within topic boundaries and that public-chat protection rules behave correctly before demo or review use.
- FR38: Maintainers can verify that major interactive sections, content flows, and educational modules are functioning before presentation.
- FR39: Maintainers can validate demo readiness across the learning flow, interactive modules, and chatbot reliability before live use.
- FR40: Maintainers can update or refine educational content without redesigning the full product structure.
- FR41: Maintainers can support local development and validation workflows for the chatbot-related experience.

### Presentation Quality & Future Expansion

- FR42: The product can support a classroom-demo walkthrough that presents the core learning flow, flagship modules, references, and chatbot interaction with no placeholder content in core sections and no broken UI states during the scripted demo.
- FR43: The product can add enhanced presentation features beyond the MVP while preserving successful completion of the core learning flow in scripted walkthrough testing.
- FR44: The product can support a Student / Expert mode that changes explanation depth when that feature is introduced.
- FR45: The product can support richer chatbot guidance and educational assistance in post-MVP phases.
- FR46: The product can support a future scenario-based simulator that allows learners to explore global governance through applied interactive decision or exploration flows.

## Non-Functional Requirements

### Performance

- NFR1: The product shall render the initial learning experience in a usable state within 3 seconds on the reference demo device, measured from navigation start to first interactive paint in a cold-load test under normal broadband conditions.
- NFR2: Core navigation actions, section transitions, and primary interactive learning modules shall respond within 1 second at the 95th percentile on target devices, measured from user input to visible response in scripted interaction tests.
- NFR3: UI animation, scroll-enhanced motion, and optional showcase scenes shall preserve readability and interaction usability, measured by a reference-device test in which core text remains unobstructed and the heaviest animated section maintains at least 30 FPS with no blocked controls.
- NFR4: Below-the-fold experiences shall not delay the initial interactive state, and any deferred media or scenes shall load after first render of the above-the-fold content, verified by network waterfall and viewport-entry checks.
- NFR5: The chatbot shall show a loading state within 0.5 seconds of submission and return a usable answer or fallback within 8 seconds at the 95th percentile under normal demo conditions.

### Security

The MVP public chatbot is intentionally treated as a public endpoint rather than a private classroom-only tool. It therefore includes a shared protection layer for anonymous usage, with rate limiting, abuse counters, and short-lived cooldown state while keeping grounded answer generation and citation integrity as the higher priority over broad answer caching.

- NFR6: The product shall not require user account creation, shall not store names, emails, or student IDs in persistent logs, and shall retain any development chat logs only in anonymized or session-scoped form that maintainers can delete.
- NFR7: Approved source materials, chatbot-related content assets, and supporting data stores shall be writable only by designated maintainers, and unauthorized write attempts shall be denied in access-control tests.
- NFR8: All data exchanged between the client, backend, and data services shall use encrypted transport, with HTTPS and TLS 1.2 or higher and no plain-HTTP requests in security checks.
- NFR9: In a validation set of off-topic prompts, the chatbot shall refuse or redirect 100% of requests; in grounded-answer tests, factual claims shall map to approved source material before being presented as authoritative.
- NFR10: The public chatbot shall allow no more than 10 submissions per 60-second window per anonymous session and shall enforce a 60-second cooldown after 3 consecutive abuse-triggering prompts, without requiring learner accounts.
- NFR11: Environment variables and service credentials shall be kept outside source-controlled application code, with secret-scan validation returning zero high-confidence secrets in the repository.
- NFR12: Approved source bundles shall be versioned, and any change to approved materials shall be detectable in a pre-release content diff before new answers are generated from them.

### Reliability

- NFR13: The product shall complete a scripted demo walkthrough covering core navigation, learning modules, references, and chatbot interaction without restart or manual repair in a single session.
- NFR14: If a non-core premium element is disabled or fails, the core educational flow shall still allow completion of the main learning journey in smoke testing.
- NFR15: If chatbot support is weak, delayed, unavailable, or temporarily rate-limited, the UI shall display a visible fallback or cooldown status within 2 seconds and keep all non-chat content interactive.
- NFR16: In content consistency checks, all visible references and chatbot citations shall resolve to approved materials, and sampled answers shall not contradict the PRD's approved definitions or case facts.

### Accessibility

- NFR17: The final experience shall pass an accessibility audit with zero critical issues, a contrast ratio of at least 4.5:1 for body text, and no blocked keyboard-only paths in the main learning flow.
- NFR18: The main learning flow shall use semantic heading structure, body text of at least 16 px, and visual contrast that meets WCAG AA in static contrast checks.
- NFR19: All major navigation and interactive controls shall be reachable and operable with keyboard only, with visible focus states present on every interactive element in the main flow, verified by a keyboard-only walkthrough and focus-state audit at 360 px, 768 px, and desktop breakpoints.
- NFR20: When reduced-motion is enabled, the page shall suppress nonessential looping motion, parallax effects, and optional showcase scenes; in normal mode, the heaviest animated section shall maintain at least 30 FPS on the reference device.
- NFR21: At 360 px, 768 px, and desktop breakpoints, the main learning flow shall require no horizontal scrolling, preserve readable text, and keep all core sections accessible in responsive smoke tests.

### Integration

- NFR22: A maintainer shall be able to set up the chatbot-related local workflow from a clean clone by following the documented steps successfully on the reference workstation within 30 minutes, including source bundle preparation and protection configuration, with no manual code changes required.
- NFR23: An approved source document processed twice with unchanged input shall produce the same retrievable chunk set and metadata, and ingestion shall succeed for all supported file types in the validation set.
- NFR24: In a fixed validation question set, 100% of factual chatbot answers shall cite approved materials, and every cited source shall exist in the retrieval set used for that response.
- NFR25: With any nonessential integration disabled, the user shall still be able to access all core sections and complete the main learning flow in a smoke test without page restart or manual recovery.
