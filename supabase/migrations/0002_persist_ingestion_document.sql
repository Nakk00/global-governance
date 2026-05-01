create or replace function public.persist_ingestion_document(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  document_payload jsonb := payload -> 'document';
  chunk_payload jsonb;
  reference_payload jsonb;
  chunk_id text;
begin
  if document_payload is null then
    raise exception 'Missing document payload';
  end if;

  insert into public.documents (
    id,
    source_id,
    source_type,
    title,
    source_path,
    storage_bucket,
    storage_path,
    file_type,
    checksum,
    version,
    embedding_config,
    metadata,
    updated_at
  )
  values (
    document_payload ->> 'id',
    document_payload ->> 'sourceId',
    document_payload ->> 'sourceType',
    document_payload ->> 'title',
    document_payload ->> 'sourcePath',
    nullif(document_payload ->> 'storageBucket', ''),
    nullif(document_payload ->> 'storagePath', ''),
    document_payload ->> 'fileType',
    document_payload ->> 'checksum',
    document_payload ->> 'version',
    document_payload -> 'embeddingConfig',
    document_payload -> 'metadata',
    now()
  )
  on conflict (id) do update set
    source_id = excluded.source_id,
    source_type = excluded.source_type,
    title = excluded.title,
    source_path = excluded.source_path,
    storage_bucket = excluded.storage_bucket,
    storage_path = excluded.storage_path,
    file_type = excluded.file_type,
    checksum = excluded.checksum,
    version = excluded.version,
    embedding_config = excluded.embedding_config,
    metadata = excluded.metadata,
    updated_at = now();

  delete from public.reference_chunks
  where reference_id in (
    select id from public."references"
    where document_id = document_payload ->> 'id'
  );
  delete from public."references"
  where document_id = document_payload ->> 'id';
  delete from public.chunks
  where document_id = document_payload ->> 'id';

  for chunk_payload in
    select value from jsonb_array_elements(payload -> 'chunks')
  loop
    insert into public.chunks (
      id,
      document_id,
      source_id,
      chunk_index,
      content,
      content_checksum,
      token_count,
      embedding,
      metadata,
      updated_at
    )
    values (
      chunk_payload ->> 'id',
      chunk_payload ->> 'documentId',
      chunk_payload ->> 'sourceId',
      (chunk_payload ->> 'chunkIndex')::integer,
      chunk_payload ->> 'content',
      chunk_payload ->> 'contentChecksum',
      (chunk_payload ->> 'tokenCount')::integer,
      (chunk_payload -> 'embedding')::text::vector,
      chunk_payload -> 'metadata',
      now()
    );
  end loop;

  for reference_payload in
    select value from jsonb_array_elements(payload -> 'references')
  loop
    insert into public."references" (
      id,
      document_id,
      source_id,
      citation_label,
      source_title,
      canonical_url,
      metadata,
      updated_at
    )
    values (
      reference_payload ->> 'id',
      reference_payload ->> 'documentId',
      reference_payload ->> 'sourceId',
      reference_payload ->> 'citationLabel',
      reference_payload ->> 'sourceTitle',
      nullif(reference_payload ->> 'canonicalUrl', ''),
      reference_payload -> 'metadata',
      now()
    );

    for chunk_id in
      select jsonb_array_elements_text(reference_payload -> 'chunkIds')
    loop
      insert into public.reference_chunks (reference_id, chunk_id)
      values (reference_payload ->> 'id', chunk_id);
    end loop;
  end loop;

  return jsonb_build_object(
    'documentId', document_payload ->> 'id',
    'chunkCount', jsonb_array_length(payload -> 'chunks'),
    'referenceCount', jsonb_array_length(payload -> 'references')
  );
end;
$$;

revoke all on function public.persist_ingestion_document(jsonb) from anon;
revoke all on function public.persist_ingestion_document(jsonb) from authenticated;
