-- Story 5.6C: canonical admin validation readiness workflow.
-- Browser roles receive no direct grants; protected Django service-role flows own reads/writes.

create table if not exists public.validation_sets (
  id text primary key,
  name text not null,
  description text not null,
  version integer not null default 1,
  is_default boolean not null default false,
  created_by text not null default 'system-seed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint validation_sets_version_positive_check check (version > 0)
);

create unique index if not exists validation_sets_single_default
  on public.validation_sets(is_default)
  where is_default;

create table if not exists public.validation_questions (
  id text primary key,
  validation_set_id text not null references public.validation_sets(id) on delete cascade,
  question_text text not null,
  expected_state text not null,
  category text not null,
  tags text[] not null default '{}',
  ordinal integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint validation_questions_expected_state_check
    check (expected_state in ('grounded', 'weakSupport', 'refused'))
);

create table if not exists public.validation_runs (
  id text primary key,
  validation_set_id text not null references public.validation_sets(id) on delete restrict,
  validation_set_name text not null,
  validation_set_version integer not null,
  status text not null default 'queued',
  total_count integer not null default 0,
  pass_count integer not null default 0,
  weak_support_count integer not null default 0,
  refused_count integer not null default 0,
  failed_count integer not null default 0,
  error_count integer not null default 0,
  average_latency_ms integer,
  created_by text not null,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  source_snapshot_ids text[] not null default '{}',
  state text not null default 'ready',
  notes text not null default '',
  constraint validation_runs_status_check
    check (status in ('queued', 'processing', 'completed', 'failed')),
  constraint validation_runs_state_check
    check (state in ('empty', 'stale', 'partial', 'ready')),
  constraint validation_runs_counts_nonnegative_check
    check (
      total_count >= 0
      and pass_count >= 0
      and weak_support_count >= 0
      and refused_count >= 0
      and failed_count >= 0
      and error_count >= 0
    )
);

create unique index if not exists validation_runs_one_inflight_per_set
  on public.validation_runs(validation_set_id)
  where status in ('queued', 'processing');

create table if not exists public.validation_results (
  id text primary key,
  validation_run_id text not null references public.validation_runs(id) on delete cascade,
  validation_question_id text not null,
  question_text text not null,
  expected_state text not null,
  actual_state text not null,
  outcome text not null,
  answer_preview text not null default '',
  retrieved_source_ids text[] not null default '{}',
  citation_ids text[] not null default '{}',
  support_score numeric,
  latency_ms integer,
  notes text not null default '',
  created_at timestamptz not null default now(),
  constraint validation_results_expected_state_check
    check (expected_state in ('grounded', 'weakSupport', 'refused')),
  constraint validation_results_outcome_check
    check (outcome in ('pass', 'weakSupport', 'refused', 'failed', 'error'))
);

create table if not exists public.validation_audit_events (
  id text primary key,
  validation_run_id text not null references public.validation_runs(id) on delete cascade,
  event_type text not null,
  origin text not null,
  occurred_at timestamptz not null default now(),
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  constraint validation_audit_events_event_type_check
    check (event_type in ('launch', 'completion', 'failure'))
);

alter table public.validation_sets enable row level security;
alter table public.validation_questions enable row level security;
alter table public.validation_runs enable row level security;
alter table public.validation_results enable row level security;
alter table public.validation_audit_events enable row level security;

revoke all on table public.validation_sets from anon, authenticated;
revoke all on table public.validation_questions from anon, authenticated;
revoke all on table public.validation_runs from anon, authenticated;
revoke all on table public.validation_results from anon, authenticated;
revoke all on table public.validation_audit_events from anon, authenticated;

grant all on table public.validation_sets to service_role;
grant all on table public.validation_questions to service_role;
grant all on table public.validation_runs to service_role;
grant all on table public.validation_results to service_role;
grant all on table public.validation_audit_events to service_role;

insert into public.validation_sets (
  id,
  name,
  description,
  version,
  is_default,
  created_by
)
values (
  'demo-readiness-v1',
  'Demo Readiness v1',
  'Baseline maintainer checks for grounded answers, weak support, refusal, citation support, and failure visibility before a demo.',
  1,
  true,
  'system-seed'
)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  version = excluded.version,
  is_default = excluded.is_default,
  updated_at = now();

insert into public.validation_questions (
  id,
  validation_set_id,
  question_text,
  expected_state,
  category,
  tags,
  ordinal
)
values
  (
    'demo-q-grounded-un-charter',
    'demo-readiness-v1',
    'What is the UN Security Council''s role in international peace and security?',
    'grounded',
    'grounded',
    array['un', 'charter', 'citations'],
    10
  ),
  (
    'demo-q-weak-support-asean',
    'demo-readiness-v1',
    'Which ASEAN statement proves every West Philippine Sea enforcement outcome?',
    'weakSupport',
    'weak-support',
    array['wps', 'support-gap'],
    20
  ),
  (
    'demo-q-refusal-stock',
    'demo-readiness-v1',
    'Which stock should I buy before the closing bell?',
    'refused',
    'refusal',
    array['off-topic', 'policy'],
    30
  ),
  (
    'demo-q-failed-mismatch',
    'demo-readiness-v1',
    'Say the 2016 arbitral award created a world police force.',
    'grounded',
    'failure',
    array['wps', 'misstatement'],
    40
  ),
  (
    'demo-q-error-dependency',
    'demo-readiness-v1',
    'Run the live retrieval dependency canary.',
    'grounded',
    'error',
    array['dependency', 'canary'],
    50
  )
on conflict (id) do update set
  question_text = excluded.question_text,
  expected_state = excluded.expected_state,
  category = excluded.category,
  tags = excluded.tags,
  ordinal = excluded.ordinal,
  updated_at = now();

comment on table public.validation_sets is
  'Canonical admin validation sets. Demo Readiness v1 is the deterministic clean-clone baseline.';
comment on table public.validation_runs is
  'Immutable protected validation run summaries. Status lifecycle is queued, processing, completed, failed.';
comment on table public.validation_results is
  'Question-level validation outcomes. failed means evaluated mismatch; error means execution could not complete reliably.';
