create extension if not exists vector;

create table if not exists public.documents (
  id text primary key,
  source_id text not null,
  source_type text not null,
  title text not null,
  source_path text not null,
  storage_bucket text,
  storage_path text,
  file_type text not null check (file_type in ('md', 'pdf')),
  checksum text not null,
  version text not null,
  embedding_config jsonb not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint documents_private_source_path
    check (source_path !~ '^public/'),
  constraint documents_private_storage_bucket
    check (
      storage_bucket is null
      or storage_bucket in ('project-source-pdfs', 'processed-exports')
    ),
  constraint documents_source_revision_unique
    unique (source_id, checksum, version)
);

create table if not exists public.chunks (
  id text primary key,
  document_id text not null references public.documents(id) on delete cascade,
  source_id text not null,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null,
  content_checksum text not null,
  token_count integer not null check (token_count > 0),
  embedding vector(384),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chunks_document_order_unique unique (document_id, chunk_index),
  constraint chunks_document_checksum_unique unique (document_id, content_checksum)
);

create table if not exists public."references" (
  id text primary key,
  document_id text not null references public.documents(id) on delete cascade,
  source_id text not null,
  citation_label text not null,
  source_title text not null,
  canonical_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint references_document_source_unique
    unique (document_id, source_id, citation_label)
);

create table if not exists public.reference_chunks (
  reference_id text not null references public."references"(id) on delete cascade,
  chunk_id text not null references public.chunks(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reference_id, chunk_id)
);

create index if not exists documents_source_id_idx
  on public.documents (source_id);

create index if not exists chunks_document_order_idx
  on public.chunks (document_id, chunk_index);

create index if not exists chunks_embedding_idx
  on public.chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 32)
  where embedding is not null;

create index if not exists references_source_id_idx
  on public."references" (source_id);

alter table public.documents enable row level security;
alter table public.chunks enable row level security;
alter table public."references" enable row level security;
alter table public.reference_chunks enable row level security;

insert into storage.buckets (id, name, public)
values
  ('project-source-pdfs', 'project-source-pdfs', false),
  ('processed-exports', 'processed-exports', false)
on conflict (id) do update
set public = excluded.public;
