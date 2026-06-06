# Retrieval Boundary

Django owns public-chat retrieval orchestration, policy decisions, model-role calls, citation packaging, and Redis-backed protection state.

Supabase remains the durable private data owner for approved source objects, source metadata, extracted documents, chunks, citation/reference records, vector rows, validation evidence, and activation state. Django retrieval code reads and writes those durable records through server-side repository adapters with service-role credentials; browser code must never receive service-role keys, private storage paths, raw source content, unrestricted retrieval controls, or model routing details.

Redis is outside the knowledge path. It may hold short-lived Django operational state such as rate windows, abuse counters, cooldown markers, guard decisions, and query-helper cache entries, all with explicit TTLs and versioned keys. Redis must not become the canonical store for documents, chunks, embeddings, citations, validation records, source activation, or final grounded answers.

The approved-source staging directory under `archive/docs/approved-sources/` is a maintainer intake area, not the live retrieval store. Strong public `answered` outcomes may use only active sources backed by completed durable ingestion evidence, including recorded provider embedding model identity and vector dimensions.
