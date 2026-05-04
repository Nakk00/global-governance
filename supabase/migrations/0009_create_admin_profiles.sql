create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  supabase_user_id uuid not null,
  email text not null,
  display_name text,
  role text not null,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_profiles_supabase_user_id_unique unique (supabase_user_id),
  constraint admin_profiles_role_check check (role in ('owner', 'admin', 'viewer')),
  constraint admin_profiles_email_check check (position('@' in email) > 1)
);

alter table public.admin_profiles enable row level security;

revoke all on table public.admin_profiles from anon, authenticated;
grant all on table public.admin_profiles to service_role;

drop policy if exists "admin_profiles_no_browser_select" on public.admin_profiles;
create policy "admin_profiles_no_browser_select"
on public.admin_profiles
as restrictive
for select
to anon, authenticated
using (false);

drop policy if exists "admin_profiles_no_browser_insert" on public.admin_profiles;
create policy "admin_profiles_no_browser_insert"
on public.admin_profiles
as restrictive
for insert
to anon, authenticated
with check (false);

drop policy if exists "admin_profiles_no_browser_update" on public.admin_profiles;
create policy "admin_profiles_no_browser_update"
on public.admin_profiles
as restrictive
for update
to anon, authenticated
using (false)
with check (false);

drop policy if exists "admin_profiles_no_browser_delete" on public.admin_profiles;
create policy "admin_profiles_no_browser_delete"
on public.admin_profiles
as restrictive
for delete
to anon, authenticated
using (false);
