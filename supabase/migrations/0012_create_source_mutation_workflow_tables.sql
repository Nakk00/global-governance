-- Story 5.6a: protected source mutation workflow persistence.
-- Browser roles receive no direct grants; Django service-role operations own writes.

create table if not exists public.source_records (
  source_id text primary key,
  title text not null,
  source_type text not null,
  provenance text not null,
  summary text not null,
  usage_scope text[] not null default '{}',
  aliases text[] not null default '{}',
  lifecycle_state text not null default 'draft',
  storage_bucket text,
  storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint source_records_lifecycle_state_check
    check (lifecycle_state in ('draft', 'approved', 'active', 'disabled', 'archived')),
  constraint source_records_no_empty_usage_scope_check
    check (array_length(usage_scope, 1) is not null),
  constraint source_records_private_storage_bucket_check
    check (
      storage_bucket is null
      or storage_bucket in ('project-source-pdfs', 'processed-exports')
    )
);

create table if not exists public.source_ingest_jobs (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references public.source_records(source_id) on delete restrict,
  status text not null default 'queued',
  requested_by text,
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  summary text not null,
  error_code text,
  constraint source_ingest_jobs_status_check
    check (status in ('queued', 'succeeded', 'warning', 'failed'))
);

create unique index if not exists source_ingest_jobs_one_queued_per_source
  on public.source_ingest_jobs(source_id)
  where status = 'queued';

alter table public.source_records enable row level security;
alter table public.source_ingest_jobs enable row level security;

revoke all on table public.source_records from anon, authenticated;
revoke all on table public.source_ingest_jobs from anon, authenticated;

grant all on table public.source_records to service_role;
grant all on table public.source_ingest_jobs to service_role;

comment on table public.source_records is
  'Protected stewardship source records. Lifecycle transitions: draft -> approved|archived, approved -> active|disabled|archived, active -> disabled|archived, disabled -> active|archived, archived is terminal.';
comment on column public.source_records.lifecycle_state is
  'draft is inactive; approved is reviewed but not retrieval eligible; active is retrieval eligible after successful ingest; disabled and archived are not retrieval eligible.';
