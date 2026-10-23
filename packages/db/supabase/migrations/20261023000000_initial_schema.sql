-- Phase 0 initial schema: profiles, roles, vehicles, documents, audit log.
-- Every table has RLS enabled. Personal data is kept to the minimum:
-- no CNP, no ID numbers, no criminal-record data (spec §2; needs a legal basis first).
-- Email and phone live only in auth.users, not duplicated here.

-- ─── Types ──────────────────────────────────────────────────────────────────

create type public.app_role as enum (
  'driver',
  'owner_individual',
  'owner_fleet',
  'owner_dealer',
  'partner',
  'accountant',
  'admin'
);

create type public.app_locale as enum ('ro', 'en');

create type public.document_subject as enum ('user', 'vehicle');

create type public.document_status as enum ('pending', 'approved', 'rejected');

-- ─── Helpers ────────────────────────────────────────────────────────────────

create function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Profiles (1:1 with auth.users) ─────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text check (char_length(full_name) <= 200),
  locale public.app_locale not null default 'ro',
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─── Roles (one account can hold several) ───────────────────────────────────

create table public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create index user_roles_role_idx on public.user_roles (role);

-- Roles a user may give themselves at onboarding. Partner, accountant and admin
-- need verification and are granted by an admin.
create function public.is_self_assignable_role(r public.app_role) returns boolean
language sql immutable as $$
  select r in ('driver', 'owner_individual', 'owner_fleet', 'owner_dealer');
$$;

-- security definer so RLS policies can call it without recursing into user_roles' own RLS.
create function public.has_role(r public.app_role) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.user_roles where user_id = auth.uid() and role = r
  );
$$;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select public.has_role('admin');
$$;

-- ─── Vehicles (minimal; extended in Phase 3) ────────────────────────────────

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  make text not null check (char_length(make) between 1 and 60),
  model text not null check (char_length(model) between 1 and 60),
  year smallint not null check (year between 1990 and 2100),
  city text check (char_length(city) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vehicles_owner_idx on public.vehicles (owner_id);

create trigger vehicles_updated_at before update on public.vehicles
  for each row execute function public.set_updated_at();

-- ─── Documents (metadata only; files in the private "documents" bucket) ─────

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  subject public.document_subject not null default 'user',
  vehicle_id uuid references public.vehicles (id) on delete cascade,
  kind text not null check (char_length(kind) between 1 and 60),
  -- Path inside the "documents" bucket; always starts with "<owner_id>/".
  storage_path text not null unique,
  expires_on date,
  status public.document_status not null default 'pending',
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint documents_vehicle_subject check ((subject = 'vehicle') = (vehicle_id is not null)),
  constraint documents_path_owner check (storage_path like owner_id::text || '/%')
);

create index documents_owner_idx on public.documents (owner_id);
create index documents_vehicle_idx on public.documents (vehicle_id);

create trigger documents_updated_at before update on public.documents
  for each row execute function public.set_updated_at();

-- ─── Audit log (append-only) ────────────────────────────────────────────────

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null check (char_length(action) between 1 and 100),
  entity text not null check (char_length(entity) between 1 and 60),
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_log_entity_idx on public.audit_log (entity, entity_id);
create index audit_log_actor_idx on public.audit_log (actor_id);

-- The only way to write an audit entry. The actor is always the caller.
create function public.log_audit(
  p_action text,
  p_entity text,
  p_entity_id text default null,
  p_metadata jsonb default '{}'::jsonb
) returns void
language sql security definer set search_path = '' as $$
  insert into public.audit_log (actor_id, action, entity, entity_id, metadata)
  values (auth.uid(), p_action, p_entity, p_entity_id, coalesce(p_metadata, '{}'::jsonb));
$$;

-- Role changes are sensitive: logged automatically.
create function public.audit_user_roles() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    perform public.log_audit('role.granted', 'user', new.user_id::text, jsonb_build_object('role', new.role));
    return new;
  end if;
  perform public.log_audit('role.revoked', 'user', old.user_id::text, jsonb_build_object('role', old.role));
  return old;
end;
$$;

create trigger user_roles_audit after insert or delete on public.user_roles
  for each row execute function public.audit_user_roles();

-- Document review decisions are logged too.
create function public.audit_document_status() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status is distinct from old.status then
    perform public.log_audit('document.' || new.status::text, 'document', new.id::text,
      jsonb_build_object('from', old.status, 'to', new.status));
  end if;
  return new;
end;
$$;

create trigger documents_status_audit after update of status on public.documents
  for each row execute function public.audit_document_status();

-- ─── New users get a profile ────────────────────────────────────────────────

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, locale)
  values (
    new.id,
    case when new.raw_user_meta_data ->> 'locale' = 'en' then 'en'::public.app_locale else 'ro'::public.app_locale end
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Row Level Security ─────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.vehicles enable row level security;
alter table public.documents enable row level security;
alter table public.audit_log enable row level security;

-- profiles: you see and edit your own; admins see all. Rows are created by the trigger.
create policy profiles_select on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- user_roles: you see your own; you may add/remove only self-assignable roles; admins manage all.
create policy user_roles_select on public.user_roles for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy user_roles_insert_self on public.user_roles for insert to authenticated
  with check (user_id = (select auth.uid()) and public.is_self_assignable_role(role));
create policy user_roles_delete_self on public.user_roles for delete to authenticated
  using (user_id = (select auth.uid()) and public.is_self_assignable_role(role));
create policy user_roles_admin_all on public.user_roles for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- vehicles: owners manage their own; admins see all. (Public listings come in Phase 1/3.)
create policy vehicles_select on public.vehicles for select to authenticated
  using (owner_id = (select auth.uid()) or (select public.is_admin()));
create policy vehicles_insert on public.vehicles for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy vehicles_update on public.vehicles for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy vehicles_delete on public.vehicles for delete to authenticated
  using (owner_id = (select auth.uid()));

-- documents: owners add, see and delete their own (always as pending); only admins review.
create policy documents_select on public.documents for select to authenticated
  using (owner_id = (select auth.uid()) or (select public.is_admin()));
create policy documents_insert on public.documents for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and status = 'pending'
    and reviewed_by is null
    and (vehicle_id is null or exists (
      select 1 from public.vehicles v where v.id = vehicle_id and v.owner_id = (select auth.uid())
    ))
  );
create policy documents_delete on public.documents for delete to authenticated
  using (owner_id = (select auth.uid()));
create policy documents_admin_update on public.documents for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- audit_log: admins read; nobody writes directly (only log_audit / triggers); never updated.
create policy audit_log_admin_select on public.audit_log for select to authenticated
  using ((select public.is_admin()));

-- ─── Privileges ─────────────────────────────────────────────────────────────

revoke all on public.audit_log from anon, authenticated;
grant select on public.audit_log to authenticated;
revoke all on all tables in schema public from anon;
revoke execute on function public.log_audit(text, text, text, jsonb) from public, anon;
grant execute on function public.log_audit(text, text, text, jsonb) to authenticated;

-- ─── Storage: private, per-user documents bucket ────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png']);

create policy documents_bucket_own on storage.objects for all to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy documents_bucket_admin_read on storage.objects for select to authenticated
  using (bucket_id = 'documents' and (select public.is_admin()));
