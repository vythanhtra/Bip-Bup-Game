-- ADR-001: anonymous gameplay events. Insert-only for the anon key; the Owner reads with SQL.
create table if not exists public.events (
  id bigserial primary key,
  at timestamptz not null default now(),
  sid text, d text, ev text not null, lang text, v text, portal text,
  secs integer, g integer, ms integer, x text
);
create index if not exists events_at_idx on public.events (at desc);
create index if not exists events_ev_idx on public.events (ev, at desc);
alter table public.events enable row level security;
drop policy if exists events_anon_insert on public.events;
create policy events_anon_insert on public.events for insert to anon with check (
  char_length(coalesce(ev, '')) <= 32 and char_length(coalesce(x, '')) <= 120 and char_length(coalesce(sid, '')) <= 16 and char_length(coalesce(d, '')) <= 16
);
revoke select, update, delete on public.events from anon;
