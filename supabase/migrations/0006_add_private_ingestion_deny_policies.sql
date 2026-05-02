create policy "No browser role access to documents"
on public.documents
for all
to public
using (false)
with check (false);

create policy "No browser role access to chunks"
on public.chunks
for all
to public
using (false)
with check (false);

create policy "No browser role access to references"
on public."references"
for all
to public
using (false)
with check (false);

create policy "No browser role access to reference chunks"
on public.reference_chunks
for all
to public
using (false)
with check (false);
