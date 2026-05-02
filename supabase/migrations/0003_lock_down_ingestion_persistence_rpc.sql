revoke all on function public.persist_ingestion_document(jsonb) from public;
revoke all on function public.persist_ingestion_document(jsonb) from anon;
revoke all on function public.persist_ingestion_document(jsonb) from authenticated;

grant execute on function public.persist_ingestion_document(jsonb) to service_role;

alter function public.persist_ingestion_document(jsonb)
  set search_path = public, pg_temp;
