create table if not exists public.source_validation_runs (
  id uuid primary key default gen_random_uuid(),
  source_id text not null,
  event_type text not null default 'validation',
  origin text not null,
  occurred_at timestamptz not null default now(),
  outcome_status text not null check (outcome_status in ('succeeded', 'warning', 'failed', 'queued')),
  summary text not null,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.source_audit_events (
  id uuid primary key default gen_random_uuid(),
  source_id text not null,
  event_type text not null,
  actor_id text,
  origin text not null,
  occurred_at timestamptz not null default now(),
  outcome_status text not null check (outcome_status in ('succeeded', 'warning', 'failed', 'queued')),
  summary text not null,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists source_validation_runs_source_occurred_at_idx
  on public.source_validation_runs (source_id, occurred_at desc);

create index if not exists source_audit_events_source_occurred_at_idx
  on public.source_audit_events (source_id, occurred_at desc);

alter table public.source_validation_runs enable row level security;
alter table public.source_audit_events enable row level security;

create policy "source_validation_runs_deny_browser_reads"
  on public.source_validation_runs
  for select
  to anon, authenticated
  using (false);

create policy "source_audit_events_deny_browser_reads"
  on public.source_audit_events
  for select
  to anon, authenticated
  using (false);
