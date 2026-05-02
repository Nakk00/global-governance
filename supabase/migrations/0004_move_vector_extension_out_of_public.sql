create schema if not exists extensions;

alter extension vector set schema extensions;

alter function public.persist_ingestion_document(jsonb)
  set search_path = public, extensions, pg_temp;
