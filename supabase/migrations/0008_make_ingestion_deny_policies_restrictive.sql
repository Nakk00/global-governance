drop policy if exists "No browser role access to documents"
on public.documents;

drop policy if exists "No browser role access to chunks"
on public.chunks;

drop policy if exists "No browser role access to references"
on public."references";

drop policy if exists "No browser role access to reference chunks"
on public.reference_chunks;

create policy "No browser role access to documents"
on public.documents
as restrictive
for all
to anon, authenticated
using (false)
with check (false);

create policy "No browser role access to chunks"
on public.chunks
as restrictive
for all
to anon, authenticated
using (false)
with check (false);

create policy "No browser role access to references"
on public."references"
as restrictive
for all
to anon, authenticated
using (false)
with check (false);

create policy "No browser role access to reference chunks"
on public.reference_chunks
as restrictive
for all
to anon, authenticated
using (false)
with check (false);
