create table if not exists public.mcp_usage_daily (
  route text not null,
  usage_date date not null,
  count integer not null default 0 check (count >= 0),
  updated_at timestamptz not null default now(),
  primary key (route, usage_date)
);

-- route별 하루 호출 횟수를 원자적으로 +1 하고, 그 결과가 p_limit 이하인지
-- 같이 돌려준다. insert ... on conflict ... returning 한 문장이라 동시
-- 요청이 몰려도 카운트가 누락되거나 두 번 세지 않는다.
create or replace function public.increment_mcp_usage(p_route text, p_limit integer)
returns table (count integer, allowed boolean)
language plpgsql security definer set search_path = public
as $$
declare current_count integer;
begin
  insert into mcp_usage_daily (route, usage_date, count)
  values (p_route, current_date, 1)
  on conflict (route, usage_date) do update
    set count = mcp_usage_daily.count + 1, updated_at = now()
  returning mcp_usage_daily.count into current_count;

  return query select current_count, current_count <= p_limit;
end;
$$;

alter table public.mcp_usage_daily enable row level security;

revoke all on function public.increment_mcp_usage(text, integer) from public, anon, authenticated;
grant execute on function public.increment_mcp_usage(text, integer) to service_role;
