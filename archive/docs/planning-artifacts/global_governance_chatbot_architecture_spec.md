# Global Governance Chatbot Architecture Spec

## Purpose
This document defines the architecture for the chatbot feature of the Global Governance Website.

The chatbot is a **grounded academic copilot**, not a general-purpose AI assistant.

It should answer questions about:
- Global Governance
- the United Nations
- key global actors
- globalization and governance
- the West Philippine Sea / South China Sea dispute
- approved project references

## Core Decision
Use a **Level 2 backend foundation with selected Level 3 UX features**.

### Backend foundation
- approved-source grounding
- PDF ingestion
- chunking
- embeddings
- reranking
- topic guard
- safety guard

### UX layer
- polished chat interface
- suggested prompts
- source-aware answers
- optional Student / Expert answer depth

## Five Model Roles

### 1. Generation Model
Generates the final user-facing answer.

### 2. Embedding Model
Creates vectors for source chunks and user queries.

### 3. Rerank Model
Improves the relevance ordering of retrieved chunks.

### 4. Topic Guard Model
Detects whether a user message is within project scope.

### 5. Safety Guard Model
Screens final output for unsafe or inappropriate content.

## Recommended Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Motion

### Backend / Data
- Supabase Storage
- Supabase Postgres
- pgvector
- API proxy / backend routes

## Supabase Role

### Supabase Storage
Store:
- raw PDFs
- references
- optional processed text exports

### Supabase Postgres + pgvector
Store:
- document metadata
- text chunks
- embeddings
- optional chat logs

## Approved Data Sources
The chatbot should answer only from:
- final website content
- extracted PDF content
- refined summaries
- case-study notes
- approved references

## Ingestion Pipeline
1. upload PDF to Supabase Storage
2. extract text
3. clean / normalize text
4. chunk content
5. attach metadata
6. generate embeddings
7. store chunks and vectors in Postgres

## Retrieval Flow
1. user submits question
2. topic guard checks scope
3. embed user query
4. vector search retrieves candidate chunks
5. rerank candidates
6. select best context
7. generation model drafts answer
8. safety guard checks answer
9. response returns to UI with source info

## Recommended Response Rules
The chatbot should:
- stay grounded
- be concise by default
- avoid guessing
- admit uncertainty when support is weak
- not fabricate sources
- remain academic but understandable

## Student / Expert Mode
If implemented site-wide, the chatbot should support:
- **Student mode**: simpler, shorter explanations
- **Expert mode**: more detailed, more nuanced explanations

## UI Recommendations
- floating assistant button or side panel
- message history
- suggested prompts
- source chips or source drawer
- clear loading state
- integrated visual styling

## Suggested Prompts
- What is Global Governance in simple terms?
- What does the UN Security Council do?
- Why is the West Philippine Sea dispute important?
- Explain the UN organs briefly
- What are the limits of global governance?

## Performance Strategy
- never read raw PDFs during live chat requests
- retrieve from pre-processed chunks instead
- keep retrieved context small
- add reranking carefully
- optimize for fast enough demo responses
- stream answers if available

## Safety and Topic Control
### Topic Guard
If off-topic:
- politely explain scope
- suggest relevant prompts

### Safety Guard
If unsafe:
- return a neutral safe fallback
- ask for a project-related rephrase if appropriate

## Minimal Table Suggestions

### `documents`
- id
- source_name
- source_type
- storage_path
- created_at

### `chunks`
- id
- document_id
- chunk_text
- section_label
- page_reference
- topic_label
- embedding
- created_at

### `references`
- id
- title
- source_type
- citation_label
- url_or_note

### optional `chat_logs`
- id
- session_id
- user_message
- final_response
- mode
- created_at

## API Route Suggestions
- `POST /api/chat`
- `POST /api/chat/retrieve`
- `POST /api/chat/topic-check`
- `POST /api/ingest/pdf`
- `POST /api/ingest/content`
- `GET /api/chat/suggestions`

## Definition of Done
The chatbot feature is complete when:
- approved sources are ingested
- retrieval works
- answers are grounded
- topic guard works
- safety guard works
- chatbot UI is integrated into the site
- response quality is demo-ready

## Final Recommendation
Build the chatbot as a **grounded project copilot** using:
- Supabase Storage for source files
- Supabase Postgres + pgvector for retrieval
- five model roles for generation, embedding, rerank, topic control, and safety

This gives the best balance of:
- speed
- grounding
- safety
- maintainability
- showcase value
