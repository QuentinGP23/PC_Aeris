-- Configs pré-faites (parcours "pressés" + résultat du questionnaire).
-- Stocke des product_id par catégorie ; détails re-fetchés au chargement.
create table if not exists public.prebuilt_configs (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  usage           text not null check (usage in ('gaming','creation','bureautique','streaming')),
  tier            text not null check (tier in ('entree','milieu','haut')),
  summary         text,
  components       jsonb not null default '{}'::jsonb,
  est_budget_min  integer,
  est_budget_max  integer,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists prebuilt_configs_usage_idx on public.prebuilt_configs(usage);

drop trigger if exists prebuilt_configs_set_updated_at on public.prebuilt_configs;
create trigger prebuilt_configs_set_updated_at
  before update on public.prebuilt_configs
  for each row execute function public.touch_updated_at();

-- Lecture publique (catalogue), écriture réservée au service role (seed/admin).
alter table public.prebuilt_configs enable row level security;
drop policy if exists prebuilt_configs_public_read on public.prebuilt_configs;
create policy prebuilt_configs_public_read
  on public.prebuilt_configs for select
  using (true);
