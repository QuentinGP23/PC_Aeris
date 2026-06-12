-- Workflow de validation du devis :
--   pending → (admin renseigne vendeur + prix réels) → quote_sent
--           → (client) accepted / refused
--           → (admin) assembling / shipped / delivered / cancelled
-- Ajoute le devis final (final_items + final_total) et les RPC associées.

-- 1. Colonnes du devis final.
alter table public.orders add column if not exists final_items jsonb;
alter table public.orders add column if not exists final_total numeric;

-- 2. Statuts autorisés.
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('pending','quote_sent','accepted','refused','paid','assembling','shipped','delivered','cancelled'));

-- 3. Admin : enregistre le devis final et passe la commande en « quote_sent ».
create or replace function public.admin_finalize_order(order_id uuid, p_final_items jsonb, p_final_total numeric)
returns void
language plpgsql security definer set search_path to ''
as $$
begin
  if coalesce((select raw_user_meta_data ->> 'role' from auth.users where id = auth.uid()), 'user') <> 'admin' then
    raise exception 'Accès refusé : rôle admin requis';
  end if;
  update public.orders
     set final_items = p_final_items, final_total = p_final_total, status = 'quote_sent'
   where id = order_id;
  if not found then raise exception 'Commande introuvable'; end if;
end;
$$;

-- 4. Client : accepte ou refuse le devis final (uniquement sur ses commandes en « quote_sent »).
create or replace function public.respond_quote(order_id uuid, accept boolean)
returns void
language plpgsql security definer set search_path to ''
as $$
begin
  update public.orders
     set status = case when accept then 'accepted' else 'refused' end
   where id = order_id and user_id = auth.uid() and status = 'quote_sent';
  if not found then raise exception 'Devis introuvable ou déjà traité'; end if;
end;
$$;

-- 5. Statuts gérés par l'admin (mise à jour du suivi).
create or replace function public.admin_update_order_status(order_id uuid, new_status text)
returns void
language plpgsql security definer set search_path to ''
as $$
begin
  if coalesce((select raw_user_meta_data ->> 'role' from auth.users where id = auth.uid()), 'user') <> 'admin' then
    raise exception 'Accès refusé : rôle admin requis';
  end if;
  if new_status not in ('pending','quote_sent','accepted','refused','paid','assembling','shipped','delivered','cancelled') then
    raise exception 'Statut invalide';
  end if;
  update public.orders set status = new_status where id = order_id;
  if not found then raise exception 'Commande introuvable'; end if;
end;
$$;

-- 6. Liste admin : on renvoie aussi le devis final.
drop function if exists public.admin_list_orders();
create function public.admin_list_orders()
returns table(
  id uuid, user_id uuid, client_email text, client_name text,
  items jsonb, total_eur numeric, status text, shipping jsonb, created_at timestamptz,
  final_items jsonb, final_total numeric
)
language plpgsql security definer set search_path to ''
as $$
begin
  if coalesce((select u.raw_user_meta_data ->> 'role' from auth.users u where u.id = auth.uid()), 'user') <> 'admin' then
    raise exception 'Accès refusé : rôle admin requis';
  end if;
  return query
  select o.id, o.user_id, u.email::text, (o.shipping ->> 'fullName')::text,
         o.items, o.total_eur, o.status, o.shipping, o.created_at,
         o.final_items, o.final_total
  from public.orders o
  left join auth.users u on u.id = o.user_id
  order by o.created_at desc;
end;
$$;
