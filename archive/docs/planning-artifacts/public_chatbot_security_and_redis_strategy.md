# Public Chatbot Security and Redis Strategy
## Global Governance Website

## Purpose
This document defines the recommended security, abuse prevention, and Redis usage strategy for the **public chatbot** in the Global Governance Website project.

Because the chatbot will be public-facing, it should be designed with the assumption that:
- people may spam it
- automated bots may hit the endpoint
- some users may try to exploit cost-heavy model calls
- some users may send off-topic, adversarial, or inappropriate prompts
- public access increases the importance of latency, resilience, and cost control

This document explains how to reduce that risk while keeping the chatbot useful and fast.

---

## 1. Core Security Decision

### Final Security Direction
Use a **server-controlled, retrieval-based chatbot architecture** with:
- private source storage
- backend-only model access
- rate limiting
- abuse counters
- topic guard
- safety guard
- optional challenge verification
- selective Redis usage for protection and short-lived operational state

### Summary Rule
**Do not expose model API keys, privileged database access, or raw source access directly to the browser.**

---

## 2. Main Security Goals

### Primary Goals
- protect the chatbot from abuse
- reduce unnecessary model spending
- prevent direct exposure of source materials
- keep the chatbot on-topic
- reduce unsafe or inappropriate responses
- maintain stable enough performance for demo and public use

### Secondary Goals
- improve repeat-request speed
- protect against spam bursts
- make behavior easier to monitor and control
- create a scalable security foundation if the site gets more traffic than expected

---

## 3. Threat Model

The public chatbot should assume the following risks:

### 3.1 Cost Abuse
A user or bot repeatedly sends many requests to increase model usage and cost.

### 3.2 Spam / Flooding
An attacker or script sends large amounts of requests in a short time window.

### 3.3 Prompt Abuse
A user attempts to:
- bypass topic restrictions
- provoke unsafe content
- manipulate system behavior
- extract hidden instructions

### 3.4 Source Abuse
A user attempts to:
- access raw PDFs directly
- scrape references
- enumerate private file paths
- bypass content restrictions

### 3.5 Latency Degradation
Repeated expensive requests slow down the bot for legitimate users.

### 3.6 Infrastructure Misuse
An attacker attempts to misuse:
- public endpoints
- Supabase resources
- model endpoints
- backend APIs

---

## 4. Security Architecture Overview

### Recommended High-Level Architecture

```text
Browser
  ->
Frontend Chat UI
  ->
Backend API / Edge Function
  ->
Security Layer
  - rate limit
  - abuse checks
  - optional challenge verification
  - topic guard
  ->
Retrieval Layer
  - Supabase Postgres + pgvector
  - rerank
  ->
Generation Layer
  - model call
  ->
Safety Guard
  ->
Response
```

### Key Rule
The browser should never directly call:
- generation model APIs
- embedding model APIs
- rerank model APIs
- topic guard APIs
- safety guard APIs
- service-role Supabase access

Everything should pass through a controlled backend layer.

---

## 5. Supabase Security Strategy

### 5.1 Storage Strategy
Use **Supabase Storage**, but keep source documents in a **private bucket**.

### Why
The chatbot source PDFs should not be freely downloadable by anyone with a public URL unless that is a deliberate project choice.

### Recommended Buckets
- `project-source-pdfs` -> **private**
- `public-assets` -> **public** if needed for images/screenshots/mockups
- `processed-exports` -> **private** if used

### Rule
The chatbot should retrieve knowledge from processed chunks stored in the database, not by reading raw PDFs during live chat requests.

---

### 5.2 Postgres + pgvector
Use Supabase Postgres + pgvector for:
- chunk metadata
- text chunks
- embeddings
- references
- optional chat logs

### Security Rule
Apply strong access rules to exposed data tables.

If public users should not directly query chunk tables, retrieval should happen through the backend only.

---

### 5.3 Service Role Safety
Never expose privileged Supabase credentials in the frontend.

### Specifically
Do not put:
- service role keys
- unrestricted secrets
- model API keys

inside browser code.

All privileged operations must remain server-side.

---

## 6. Public Chatbot Endpoint Security

### 6.1 Backend-Only Chat Route
The chatbot should run through a controlled route such as:

- `POST /api/chat`

This route should:
1. validate the request
2. apply abuse protections
3. apply topic checks
4. retrieve content
5. generate answer
6. apply safety checks
7. return final output

---

### 6.2 Input Validation
Before processing the request:
- validate request shape
- set max prompt length
- reject empty or malformed payloads
- set safe limits on metadata fields
- normalize or trim content where appropriate

### Recommended Limits
- reasonable max input length
- no arbitrary huge payloads
- strict accepted body schema

---

### 6.3 Topic Restriction
Use the topic guard before expensive generation.

### Benefits
- reduces unnecessary cost
- keeps the chatbot aligned with the project
- prevents the assistant from becoming a generic public AI endpoint

### Off-topic Response Style
Keep responses short and redirect toward relevant questions.

Example:
> I can help with questions about Global Governance, the UN, global actors, and the West Philippine Sea case study. Try asking about one of those topics.

---

### 6.4 Safety Restriction
Use the safety guard before returning the final answer.

### Benefits
- reduces unsafe or inappropriate output
- makes public demo use safer
- prevents obviously harmful or off-tone responses

---

## 7. Why Redis Should Be Added

### Final Recommendation
**Yes, Redis should be introduced in the MVP, but only as a protection layer.**

Redis is not required for the chatbot to function, but it is highly useful for:
- rate limiting
- abuse detection
- burst protection
- short-lived session state

### Summary Role
**Supabase is the system of record. Redis is the protection layer plus short-lived operational state.**

---

## 8. How Redis Helps

### 8.1 Rate Limiting
Redis is ideal for tracking request counts over time windows.

#### Rate Limit Targets
You can rate limit by:
- IP address
- session ID
- user ID (if auth exists later)
- route
- operation type

#### Example Policies
- `/api/chat`: 10 requests per minute per IP
- stricter limit for anonymous users
- softer limit for trusted demo mode if needed

#### Benefit
This is the first and most important defense against bot abuse and cost spikes.

---

### 8.2 Abuse Counters
Redis can track repeated suspicious behavior such as:
- repeated blocked prompts
- repeated off-topic attempts
- rapid bursts
- repeated challenge failures

#### What to do with these counters
- temporary cooldown
- escalating delay
- temporary block
- deny-listing logic if needed

---

### 8.3 Limited Support-Endpoint Caching
Redis can be used for narrow, low-risk caching such as:
- prompt suggestions
- deduplication markers
- short-lived support endpoint responses that do not weaken source trust

#### Important Rule
Do **not** broadly cache grounded chatbot answers in the MVP.

#### Why
For this project, citation integrity and answer trust matter more than cache hit rate.

---

### 8.4 Retrieval Caching
Retrieval caching should be treated as a **post-MVP optimization**, not a default MVP behavior.

If introduced later, it should only be added when the team can preserve:
- citation integrity
- source/version consistency
- clear invalidation rules

---

### 8.5 Burst Protection
Redis helps absorb short traffic spikes by:
- limiting repeated requests
- applying cooldown windows

This is especially useful for:
- classroom demos
- many groupmates testing at once
- accidental refresh loops
- public traffic bursts

---

### 8.6 Temporary Session State
Redis can hold short-lived operational state such as:
- session identifiers
- recent prompts
- deduplication markers
- temporary flags

### Important Note
Redis should not replace your long-term source of truth for documents or embeddings.
It should also not become the default answer layer for grounded academic responses in the MVP.

---

## 9. What Redis Should Not Replace

Do **not** use Redis as the main store for:
- raw PDFs
- chunk database
- embeddings database
- permanent references
- long-term structured content

Those belong in Supabase.

### Correct Split
- **Supabase Storage** -> raw files
- **Supabase Postgres + pgvector** -> chunks, metadata, vectors
- **Redis** -> rate limits, abuse counters, cooldown state, limited short-lived operational state

---

## 10. Recommended Redis Use Cases for This Project

For the MVP, prioritize these three first:

### 10.1 Global Rate Limits
Protect the `/api/chat` route from spam and excessive use.

### 10.2 Progressive Penalties
Escalate if a client repeatedly exceeds limits or sends suspicious requests.

### 10.3 Cooldown and Short-Lived Operational State
Track short-lived protection state such as cooldown flags or deduplication markers.

These uses give the highest MVP value with the least risk to trust and citation quality.

### Post-MVP Candidate Only
- retrieval cache
- broader answer caching only if citation integrity can still be guaranteed

---

## 11. Optional Challenge / Verification Layer

If the chatbot is fully public, consider adding a lightweight challenge layer such as:
- CAPTCHA
- Turnstile
- challenge only after suspicious behavior
- challenge only after rate-limit threshold

### Best Practice
Do not challenge every request immediately if it hurts UX.

Instead:
- start with rate limiting
- challenge suspicious traffic
- escalate when abuse patterns appear

---

## 12. API Security Rules

### Rule 1
All model calls must happen server-side.

### Rule 2
All privileged Supabase access must happen server-side.

### Rule 3
The public chat route must have:
- validation
- rate limiting
- abuse checks
- topic restriction
- safety checks

### Rule 4
Input size must be limited.

### Rule 5
Response size should be capped to reduce abuse and cost.

### Rule 6
Expensive operations like re-ingestion or embedding generation must not be public.

---

## 13. Monitoring and Logging

The public chatbot should log enough information to detect issues, without over-collecting sensitive data.

### Good Things to Log
- request timestamps
- route usage counts
- rate-limit hits
- blocked requests
- topic guard rejects
- safety guard rejects
- cache hits/misses
- average response times
- error rates

### Why
This helps detect:
- abuse spikes
- latency problems
- retrieval problems
- prompt abuse trends

---

## 14. Suggested Security Flow for Each Chat Request

### Step 1
Receive request at backend route

### Step 2
Validate request body and input length

### Step 3
Apply Redis-based rate limit

### Step 4
Check abuse counters / cooldowns

### Step 5
Optionally require challenge if suspicious

### Step 6
Run topic guard

### Step 7
If in scope, retrieve chunks from Supabase

### Step 8
Optionally rerank retrieved chunks

### Step 9
Generate answer using selected context

### Step 10
Run safety guard on drafted answer

### Step 11
Store lightweight analytics / cache result if appropriate

### Step 12
Return final response to frontend

---

## 15. Minimal Redis Strategy

If the team wants a lightweight first implementation, use Redis only for:
- per-IP rate limiting
- temporary cooldown flags
- short-lived operational markers

This already provides meaningful protection.

---

## 16. Stronger Redis Strategy

If the team wants a more complete implementation, use Redis for:
- per-IP rate limits
- per-session rate limits
- abuse counters
- dynamic cooldown windows
- temporary session state
- deny-list or suspicious client tracking

If the team later wants retrieval caching or broader answer caching, that should be treated as a separate post-MVP architecture decision.

---

## 17. Recommended Security Priority Order

### Priority 1 — Must Have
- backend-only model access
- private source PDF bucket
- no service-role keys in browser
- request validation
- rate limiting
- topic guard
- safety guard

### Priority 2 — Strongly Recommended
- Redis-based abuse counters
- logging and monitoring
- calm cooldown UX in the chat panel

### Priority 3 — Nice to Have
- challenge / CAPTCHA escalation
- deny-list support
- retrieval cache with safe invalidation
- advanced anomaly heuristics

---

## 18. Definition of Done

The public chatbot security layer is complete when:
- raw source PDFs are stored privately
- model keys are not exposed in the frontend
- public chat access runs through a backend route
- rate limiting is active
- Redis is used for protection and short-lived operational state
- topic guard rejects off-topic prompts
- safety guard filters unsafe outputs
- abuse patterns can be observed through logs
- the chatbot remains usable for normal visitors

---

## 19. Final Recommendation

For this public chatbot, the best practical strategy is:

### Keep Supabase as:
- file storage
- document source of truth
- chunk/embedding database

### Add Redis as:
- rate limiting layer
- abuse protection layer
- temporary operational state layer

### Security Philosophy
Protect:
- cost
- performance
- source access
- public behavior quality

### Final One-Line Recommendation
**Use private Supabase storage + backend-only model access + Redis-based rate limiting and abuse protection as the core MVP protection strategy for the public chatbot.**
