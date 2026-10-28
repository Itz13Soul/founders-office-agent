create table if not exists public.fo_extractions (
  email_id text primary key,
  commitments jsonb not null,
  model text not null,
  created_at timestamptz not null default now()
);
alter table public.fo_extractions enable row level security;
drop policy if exists "public read extractions" on public.fo_extractions;
create policy "public read extractions" on public.fo_extractions for select using (true);

create table if not exists public.fo_usage (
  day date primary key,
  count integer not null default 0
);
alter table public.fo_usage enable row level security;

create or replace function public.bump_fo_usage(cap integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
begin
  insert into public.fo_usage (day, count) values (current_date, 1)
  on conflict (day) do update set count = public.fo_usage.count + 1
  returning count into current_count;
  return current_count <= cap;
end;
$$;

revoke execute on function public.bump_fo_usage(integer) from public, anon, authenticated;
grant execute on function public.bump_fo_usage(integer) to service_role;
