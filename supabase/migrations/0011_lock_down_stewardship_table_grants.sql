revoke all on table public.source_validation_runs from anon, authenticated;
revoke all on table public.source_audit_events from anon, authenticated;

grant all on table public.source_validation_runs to service_role;
grant all on table public.source_audit_events to service_role;
