-- RLS and integrity tests. Run with: pnpm --filter @u-drive/db test:db
begin;
create extension if not exists pgtap with schema extensions;

select plan(30);

-- ─── Fixtures (as superuser) ────────────────────────────────────────────────
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'a@test.local', '{"locale":"en"}'),
  ('00000000-0000-0000-0000-00000000000b', 'b@test.local', '{}'),
  ('00000000-0000-0000-0000-0000000000ad', 'admin@test.local', '{}');
insert into public.user_roles (user_id, role) values ('00000000-0000-0000-0000-0000000000ad', 'admin');

create function pg_temp.as_user(uid uuid) returns void language sql as $$
  select set_config('role', 'authenticated', true),
         set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
$$;
create function pg_temp.as_superuser() returns void language sql as $$
  select set_config('role', 'postgres', true), set_config('request.jwt.claims', '', true);
$$;

-- ─── Structure ──────────────────────────────────────────────────────────────
select is(
  (select count(*)::int from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity),
  0, 'every public table has RLS enabled');

select is((select locale::text from public.profiles where id = '00000000-0000-0000-0000-00000000000a'),
  'en', 'signup creates a profile with the locale from metadata');
select is((select locale::text from public.profiles where id = '00000000-0000-0000-0000-00000000000b'),
  'ro', 'locale defaults to ro');

-- ─── Profiles ───────────────────────────────────────────────────────────────
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
select is((select count(*)::int from public.profiles), 1, 'a user sees only their own profile');
update public.profiles set full_name = 'Hacked' where id = '00000000-0000-0000-0000-00000000000b';
select pg_temp.as_superuser();
select is((select full_name from public.profiles where id = '00000000-0000-0000-0000-00000000000b'),
  null, 'a user cannot edit another profile');

select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
select lives_ok($$ update public.profiles set full_name = 'Ana' where id = auth.uid() $$,
  'a user can edit their own profile');

-- ─── Roles ──────────────────────────────────────────────────────────────────
select lives_ok($$ insert into public.user_roles (user_id, role) values (auth.uid(), 'driver') $$,
  'a user can give themselves the driver role');
select lives_ok($$ insert into public.user_roles (user_id, role) values (auth.uid(), 'owner_dealer') $$,
  'a user can give themselves an owner role');
select throws_ok($$ insert into public.user_roles (user_id, role) values (auth.uid(), 'admin') $$,
  '42501', null, 'a user cannot make themselves admin');
select throws_ok($$ insert into public.user_roles (user_id, role) values (auth.uid(), 'accountant') $$,
  '42501', null, 'a user cannot make themselves accountant');
select throws_ok($$ insert into public.user_roles (user_id, role) values ('00000000-0000-0000-0000-00000000000b', 'driver') $$,
  '42501', null, 'a user cannot give roles to someone else');
select is((select count(*)::int from public.user_roles), 2, 'a user sees only their own roles');
select is(public.has_role('driver'), true, 'has_role sees the caller''s role');
select is(public.is_admin(), false, 'is_admin is false for normal users');

-- ─── Audit log ──────────────────────────────────────────────────────────────
select is((select count(*)::int from public.audit_log), 0, 'a normal user cannot read the audit log');
select throws_ok($$ insert into public.audit_log (action, entity) values ('fake', 'x') $$,
  '42501', null, 'nobody can insert into audit_log directly');

select pg_temp.as_user('00000000-0000-0000-0000-0000000000ad');
select is((select count(*)::int from public.audit_log
  where action = 'role.granted' and actor_id = '00000000-0000-0000-0000-00000000000a'),
  2, 'role grants are audited with the acting user');
select throws_ok($$ delete from public.audit_log $$, '42501', null, 'the audit log cannot be deleted, even by admins');

-- ─── Vehicles ───────────────────────────────────────────────────────────────
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
insert into public.vehicles (id, owner_id, make, model, year)
  values ('00000000-0000-0000-0000-0000000000c1', auth.uid(), 'Toyota', 'Corolla', 2022);
select throws_ok($$ insert into public.vehicles (owner_id, make, model, year)
  values ('00000000-0000-0000-0000-00000000000b', 'Dacia', 'Logan', 2021) $$,
  '42501', null, 'a user cannot create a vehicle for someone else');

select pg_temp.as_user('00000000-0000-0000-0000-00000000000b');
select is((select count(*)::int from public.vehicles), 0, 'other users cannot see a vehicle');
update public.vehicles set model = 'Hacked' where id = '00000000-0000-0000-0000-0000000000c1';
select pg_temp.as_user('00000000-0000-0000-0000-0000000000ad');
select is((select model from public.vehicles where id = '00000000-0000-0000-0000-0000000000c1'),
  'Corolla', 'other users cannot edit a vehicle; admins can see it');

-- ─── Documents ──────────────────────────────────────────────────────────────
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
select lives_ok($$ insert into public.documents (id, owner_id, kind, storage_path)
  values ('00000000-0000-0000-0000-0000000000d1', auth.uid(), 'driving_licence',
          '00000000-0000-0000-0000-00000000000a/licence.pdf') $$,
  'a user can add their own document');
select throws_ok($$ insert into public.documents (owner_id, kind, storage_path, status)
  values (auth.uid(), 'id_card', '00000000-0000-0000-0000-00000000000a/id.pdf', 'approved') $$,
  '42501', null, 'a user cannot add a pre-approved document');
select throws_ok($$ insert into public.documents (owner_id, kind, storage_path)
  values (auth.uid(), 'id_card', 'someone-else/id.pdf') $$,
  '23514', null, 'storage path must start with the owner id');
select throws_ok($$ insert into public.documents (owner_id, subject, kind, storage_path)
  values (auth.uid(), 'vehicle', 'itp', '00000000-0000-0000-0000-00000000000a/itp.pdf') $$,
  '23514', null, 'vehicle documents need a vehicle');

update public.documents set status = 'approved' where id = '00000000-0000-0000-0000-0000000000d1';
select is((select status::text from public.documents where id = '00000000-0000-0000-0000-0000000000d1'),
  'pending', 'owners cannot approve their own documents');

select pg_temp.as_user('00000000-0000-0000-0000-00000000000b');
select is((select count(*)::int from public.documents), 0, 'other users cannot see a document');

select pg_temp.as_user('00000000-0000-0000-0000-0000000000ad');
select lives_ok($$ update public.documents set status = 'approved' where id = '00000000-0000-0000-0000-0000000000d1' $$,
  'admins can review documents');
select is((select count(*)::int from public.audit_log where action = 'document.approved'), 1,
  'document reviews are audited');

-- ─── Anonymous ──────────────────────────────────────────────────────────────
select pg_temp.as_superuser();
set local role anon;
select throws_ok($$ select * from public.profiles $$, '42501', null, 'anonymous visitors cannot read profiles');

select * from finish();
rollback;
