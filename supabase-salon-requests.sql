alter table public.users add column if not exists phone varchar;

create table if not exists public.salon_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  owner_name varchar not null,
  owner_email varchar not null,
  owner_phone varchar not null,
  salon_name varchar not null,
  slug_requested varchar not null,
  city varchar,
  notes text,
  status varchar not null default 'pending',
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

alter table public.salon_requests enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update on public.salon_requests to authenticated;

drop policy if exists "Users can read own salon requests" on public.salon_requests;
drop policy if exists "Users can insert own salon requests" on public.salon_requests;

create policy "Users can read own salon requests"
on public.salon_requests
for select
using (auth.uid() = user_id);

create policy "Users can insert own salon requests"
on public.salon_requests
for insert
with check (auth.uid() = user_id);

create index if not exists idx_salon_requests_user_id on public.salon_requests(user_id);
create index if not exists idx_salon_requests_status on public.salon_requests(status);
