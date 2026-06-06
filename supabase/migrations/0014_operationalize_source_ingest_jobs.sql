-- Operational approved-source ingestion lifecycle and provider evidence.

alter table public.source_ingest_jobs
  add column if not exists started_at timestamptz,
  add column if not exists document_id text references public.documents(id) on delete set null,
  add column if not exists chunk_count integer,
  add column if not exists reference_count integer,
  add column if not exists embedding_model text,
  add column if not exists embedding_dimensions integer;

alter table public.source_ingest_jobs
  drop constraint if exists source_ingest_jobs_status_check;

alter table public.source_ingest_jobs
  add constraint source_ingest_jobs_status_check
    check (status in ('queued', 'processing', 'succeeded', 'warning', 'failed')),
  add constraint source_ingest_jobs_chunk_count_check
    check (chunk_count is null or chunk_count >= 0),
  add constraint source_ingest_jobs_reference_count_check
    check (reference_count is null or reference_count >= 0),
  add constraint source_ingest_jobs_embedding_dimensions_check
    check (embedding_dimensions is null or embedding_dimensions > 0);

drop index if exists public.source_ingest_jobs_one_queued_per_source;

create unique index if not exists source_ingest_jobs_one_active_per_source
  on public.source_ingest_jobs(source_id)
  where status in ('queued', 'processing');
