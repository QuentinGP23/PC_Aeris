-- Carnet d'adresses de livraison (plusieurs adresses par utilisateur, à la Amazon).
-- L'adresse n'est plus saisie à l'inscription ni à chaque commande : elle est
-- gérée depuis le profil, puis choisie au moment du panier.
create table if not exists public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  label       text,                              -- ex. « Maison », « Bureau »
  full_name   text not null,
  address     text not null,
  zip         text not null,
  city        text not null,
  phone       text not null,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on public.addresses(user_id);

-- Une seule adresse par défaut par utilisateur.
create unique index if not exists addresses_one_default_idx
  on public.addresses(user_id) where is_default;

-- RLS : chaque user ne gère que ses propres adresses.
alter table public.addresses enable row level security;

drop policy if exists addresses_select_own on public.addresses;
create policy addresses_select_own on public.addresses for select using (auth.uid() = user_id);

drop policy if exists addresses_insert_own on public.addresses;
create policy addresses_insert_own on public.addresses for insert with check (auth.uid() = user_id);

drop policy if exists addresses_update_own on public.addresses;
create policy addresses_update_own on public.addresses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists addresses_delete_own on public.addresses;
create policy addresses_delete_own on public.addresses for delete using (auth.uid() = user_id);
