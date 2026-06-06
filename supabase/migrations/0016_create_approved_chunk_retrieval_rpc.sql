-- Service-role vector retrieval over active, successfully ingested approved sources.

create or replace function public.retrieve_approved_chunks(
  query_embedding jsonb,
  requested_source_ids text[] default null,
  match_count integer default 12
)
returns table (
  "chunkId" text,
  "sourceId" text,
  content text,
  title text,
  "shortTitle" text,
  "sourceType" text,
  detail text,
  url text,
  active boolean,
  "sectionIds" text[],
  "vectorScore" double precision
)
language sql
stable
security definer
set search_path = public, extensions, pg_temp
as $$
  select
    chunk.id as "chunkId",
    chunk.source_id as "sourceId",
    chunk.content,
    document.title,
    coalesce(reference.citation_label, document.title) as "shortTitle",
    document.source_type as "sourceType",
    coalesce(
      reference.metadata ->> 'detail',
      document.metadata ->> 'citationDetail',
      'Supports the grounded explanation from an approved source.'
    ) as detail,
    reference.canonical_url as url,
    true as active,
    '{}'::text[] as "sectionIds",
    1 - (
      chunk.embedding <=> (query_embedding::text)::extensions.vector
    ) as "vectorScore"
  from public.chunks as chunk
  join public.documents as document
    on document.id = chunk.document_id
  join public.source_records as source
    on source.source_id = chunk.source_id
   and source.lifecycle_state = 'active'
  left join lateral (
    select
      source_reference.citation_label,
      source_reference.canonical_url,
      source_reference.metadata
    from public.reference_chunks as reference_link
    join public."references" as source_reference
      on source_reference.id = reference_link.reference_id
    where reference_link.chunk_id = chunk.id
    order by source_reference.id
    limit 1
  ) as reference on true
  where chunk.embedding is not null
    and (
      requested_source_ids is null
      or chunk.source_id = any(requested_source_ids)
    )
    and exists (
      select 1
      from public.source_ingest_jobs as ingest_job
      where ingest_job.source_id = chunk.source_id
        and ingest_job.document_id = chunk.document_id
        and ingest_job.status = 'succeeded'
    )
  order by chunk.embedding <=> (query_embedding::text)::extensions.vector
  limit greatest(1, least(match_count, 50));
$$;

revoke all on function public.retrieve_approved_chunks(jsonb, text[], integer)
  from public, anon, authenticated;
grant execute on function public.retrieve_approved_chunks(jsonb, text[], integer)
  to service_role;
