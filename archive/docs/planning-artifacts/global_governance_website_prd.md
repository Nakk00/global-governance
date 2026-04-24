# Product Requirements Document (PRD) v3

## Project Title
**Global Governance Website**

## Project Summary
A premium single-page educational website for **GNED-07: The Contemporary World** focused on **Global Governance**. The site combines:
- scrollytelling
- premium motion and interaction
- selective 3D visuals
- grounded academic content
- a project-specific AI chatbot

## Core Direction
The product remains a **single-page application (SPA)** with:
- React
- Vite
- TypeScript
- Tailwind CSS
- Motion
- Lenis
- shadcn/ui
- react-icons
- React Three Fiber
- Supabase
- ESLint
- Prettier

## Product Vision
Create a visually premium, academically credible, and highly interactive website that explains Global Governance clearly while also providing a grounded AI assistant for question-and-answer exploration.

## Goals
- Present Global Governance in a modern, engaging format
- Use animation and interactivity to improve understanding
- Keep content accurate, readable, and well-structured
- Add a grounded chatbot that answers only from approved project materials
- Maintain good performance despite the ambitious feature set

## Scope

### In Scope
- single-page educational website
- responsive design
- premium hero section
- section-based storytelling
- interactive UN section
- case-study dossier section
- references section
- grounded chatbot assistant
- Supabase-based document storage and retrieval
- retrieval-based AI answering
- topic guard and safety guard

### Out of Scope
- general-purpose open-domain assistant
- full CMS
- social/chat between users
- backend complexity beyond the agreed chatbot pipeline
- multiple heavy 3D scenes across the site

## Final Tech Stack

### Frontend
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

### Backend / Data / AI
- Supabase Storage
- Supabase Postgres
- pgvector
- Generation model
- Embedding model
- Rerank model
- Topic guard model
- Safety guard model

## Main Features
1. cinematic hero section
2. scrollytelling site flow
3. UN Command Center
4. West Philippine Sea interactive dossier
5. Student / Expert mode
6. grounded chatbot assistant

## Chatbot Product Requirement
The chatbot must:
- answer only from approved project content
- use retrieval before generation
- stay on topic
- apply a safety layer
- present readable, grounded answers
- optionally align with Student / Expert mode

## Functional Requirements
- responsive section-based SPA
- smooth scroll navigation
- premium motion system
- selective 3D hero or visual section
- interactive content modules
- chatbot entry point and panel
- retrieval-based chatbot backend
- source-aware chatbot responses
- topic restriction for off-topic questions
- safety guard before final output

## Non-Functional Requirements
- good readability
- performance-conscious motion
- limited 3D scope
- maintainable code structure
- integrated chatbot UI
- grounded chatbot behavior
- acceptable latency for demo use

## Suggested Project Structure
```text
src/
├── components/
│   ├── layout/
│   ├── sections/
│   ├── scene/
│   ├── chatbot/
│   └── ui/
├── data/
├── hooks/
├── lib/
├── styles/
├── types/
└── App.tsx

backend/
├── api/
├── chatbot/
├── ingestion/
└── prompts/
```

## Milestones
1. finalize content and design direction
2. build SPA structure and premium UI
3. implement motion and selective 3D
4. build chatbot ingestion and retrieval
5. integrate chatbot UI
6. optimize performance and polish for demo

## Risks
- too much animation hurting readability
- too much 3D hurting performance
- chatbot hallucination
- slow chatbot response time
- scope creep

## Risk Mitigation
- keep 3D limited to one main section
- use retrieval-based grounding
- use topic and safety guards
- keep prompt context tight
- build advanced features in layers

## Final Recommendation
This project should be developed as a **premium SPA with a grounded academic chatbot**.

The final product should demonstrate:
1. strong understanding of Global Governance
2. strong frontend design and interaction skill
3. practical retrieval-based AI integration
