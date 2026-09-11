create table if not exists public.education_live_state (
  id text primary key,
  complete_count integer not null default 0 check (complete_count >= 0),
  round integer not null default 0 check (round >= 0),
  timer_ends_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.education_completions (
  session_id text not null references public.education_live_state(id) on delete cascade,
  round integer not null,
  student_id text not null,
  completed_at timestamptz not null default now(),
  primary key (session_id, round, student_id)
);

create table if not exists public.education_html_slots (
  session_id text not null references public.education_live_state(id) on delete cascade,
  slot smallint not null check (slot in (1, 2)),
  code text not null default '',
  in_use boolean not null default false,
  owner_id text,
  lock_expires_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (session_id, slot)
);

create table if not exists public.education_uploads (
  id uuid primary key,
  session_id text not null references public.education_live_state(id) on delete cascade,
  student_id text not null,
  storage_path text not null unique,
  mime_type text not null,
  size_bytes integer not null,
  created_at timestamptz not null default now()
);

insert into public.education_live_state (id) values ('default') on conflict do nothing;
insert into public.education_html_slots (session_id, slot)
values ('default', 1), ('default', 2)
on conflict do nothing;

create or replace function public.increment_complete_count(p_session_id text, p_student_id text)
returns table (complete_count integer, round integer)
language plpgsql security definer set search_path = public
as $$
declare current_round integer;
begin
  select s.round into current_round from education_live_state s where s.id = p_session_id for update;
  if current_round is null then raise exception 'session not found'; end if;

  insert into education_completions(session_id, round, student_id)
  values (p_session_id, current_round, p_student_id)
  on conflict do nothing;

  if found then
    update education_live_state s
      set complete_count = s.complete_count + 1, updated_at = now()
      where s.id = p_session_id;
  end if;

  return query select s.complete_count, s.round from education_live_state s where s.id = p_session_id;
end;
$$;

create or replace function public.reset_complete_count(p_session_id text)
returns table (complete_count integer, round integer)
language plpgsql security definer set search_path = public
as $$
begin
  update education_live_state s
    set complete_count = 0, round = s.round + 1, updated_at = now()
    where s.id = p_session_id;
  return query select s.complete_count, s.round from education_live_state s where s.id = p_session_id;
end;
$$;

create or replace function public.update_html_slot(
  p_session_id text,
  p_slot smallint,
  p_owner_id text,
  p_code text default null,
  p_in_use boolean default null,
  p_force_release boolean default false
)
returns setof public.education_html_slots
language plpgsql security definer set search_path = public
as $$
declare current_slot education_html_slots%rowtype;
begin
  select * into current_slot from education_html_slots
    where session_id = p_session_id and slot = p_slot for update;

  if p_force_release then
    update education_html_slots set in_use = false, owner_id = null,
      lock_expires_at = null, updated_at = now()
      where session_id = p_session_id and slot = p_slot;
  elsif p_in_use is true then
    if current_slot.in_use and current_slot.owner_id is distinct from p_owner_id
       and current_slot.lock_expires_at > now() then
      raise exception '다른 참가자가 사용 중입니다.';
    end if;
    update education_html_slots set in_use = true, owner_id = p_owner_id,
      lock_expires_at = now() + interval '10 minutes', updated_at = now()
      where session_id = p_session_id and slot = p_slot;
  elsif p_in_use is false then
    if current_slot.owner_id is distinct from p_owner_id then raise exception '슬롯 소유자가 아닙니다.'; end if;
    update education_html_slots set in_use = false, owner_id = null,
      lock_expires_at = null, updated_at = now()
      where session_id = p_session_id and slot = p_slot;
  elsif p_code is not null then
    if current_slot.in_use and current_slot.owner_id is distinct from p_owner_id
       and current_slot.lock_expires_at > now() then
      raise exception '다른 참가자가 사용 중입니다.';
    end if;
    update education_html_slots set code = p_code,
      lock_expires_at = case when owner_id = p_owner_id then now() + interval '10 minutes' else lock_expires_at end,
      updated_at = now()
      where session_id = p_session_id and slot = p_slot;
  end if;

  return query select * from education_html_slots
    where session_id = p_session_id and slot = p_slot;
end;
$$;

alter table public.education_live_state enable row level security;
alter table public.education_html_slots enable row level security;
alter table public.education_completions enable row level security;
alter table public.education_uploads enable row level security;

grant select on public.education_live_state to anon, authenticated;
grant select on public.education_html_slots to anon, authenticated;
create policy "public live state read" on public.education_live_state for select to anon using (true);
create policy "public html slots read" on public.education_html_slots for select to anon using (true);
create policy "authenticated live state read" on public.education_live_state for select to authenticated using (true);
create policy "authenticated html slots read" on public.education_html_slots for select to authenticated using (true);

alter publication supabase_realtime add table public.education_live_state;
alter publication supabase_realtime add table public.education_html_slots;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('education-captures', 'education-captures', false, 5242880,
  array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

revoke all on function public.increment_complete_count(text, text) from public, anon, authenticated;
revoke all on function public.reset_complete_count(text) from public, anon, authenticated;
revoke all on function public.update_html_slot(text, smallint, text, text, boolean, boolean) from public, anon, authenticated;
grant execute on function public.increment_complete_count(text, text) to service_role;
grant execute on function public.reset_complete_count(text) to service_role;
grant execute on function public.update_html_slot(text, smallint, text, text, boolean, boolean) to service_role;
