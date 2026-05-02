revoke all on table
  public.documents,
  public.chunks,
  public."references",
  public.reference_chunks
from public, anon, authenticated;

grant select, insert, update, delete on table
  public.documents,
  public.chunks,
  public."references",
  public.reference_chunks
to service_role;
