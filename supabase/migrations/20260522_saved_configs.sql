-- Sprint 5 — US-041 à US-044 : sauvegarde des configurations utilisateur.
-- Stocke uniquement les product_id (les détails sont re-fetchés au chargement).

create table if not exists public.saved_configs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null check (char_length(trim(name)) between 1 and 80),
  components  jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists saved_configs_user_id_idx on public.saved_configs(user_id);
create index if not exists saved_configs_updated_at_idx on public.saved_configs(updated_at desc);

-- Trigger pour maintenir updated_at automatiquement.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists saved_configs_set_updated_at on public.saved_configs;
create trigger saved_configs_set_updated_at
  before update on public.saved_configs
  for each row execute function public.touch_updated_at();

-- RLS : chaque user ne voit/modifie que ses propres configs.
alter table public.saved_configs enable row level security;

drop policy if exists saved_configs_select_own on public.saved_configs;
create policy saved_configs_select_own
  on public.saved_configs for select
  using (auth.uid() = user_id);

drop policy if exists saved_configs_insert_own on public.saved_configs;
create policy saved_configs_insert_own
  on public.saved_configs for insert
  with check (auth.uid() = user_id);

drop policy if exists saved_configs_update_own on public.saved_configs;
create policy saved_configs_update_own
  on public.saved_configs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists saved_configs_delete_own on public.saved_configs;
create policy saved_configs_delete_own
  on public.saved_configs for delete
  using (auth.uid() = user_id);
