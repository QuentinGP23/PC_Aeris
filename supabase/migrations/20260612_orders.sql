-- Commandes (tunnel V1). Stocke un snapshot du panier + l'adresse + le statut.
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  items       jsonb not null,                 -- snapshot des articles du panier
  total_eur   numeric not null check (total_eur >= 0),
  status      text not null default 'pending'
    check (status in ('pending','paid','assembling','shipped','delivered','cancelled')),
  shipping    jsonb,                           -- adresse de livraison
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- RLS : chaque user ne voit/crée que ses propres commandes.
alter table public.orders enable row level security;

drop policy if exists orders_select_own on public.orders;
create policy orders_select_own on public.orders for select using (auth.uid() = user_id);

drop policy if exists orders_insert_own on public.orders;
create policy orders_insert_own on public.orders for insert with check (auth.uid() = user_id);
