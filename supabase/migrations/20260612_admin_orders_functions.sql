-- Fonctions admin pour la gestion des commandes (SECURITY DEFINER, contrôle du rôle).

create or replace function public.admin_list_orders()
returns table(
  id uuid, user_id uuid, client_email text, client_name text,
  items jsonb, total_eur numeric, status text, shipping jsonb, created_at timestamptz
)
language plpgsql security definer set search_path to ''
as $$
begin
  if coalesce((select u.raw_user_meta_data ->> 'role' from auth.users u where u.id = auth.uid()), 'user') <> 'admin' then
    raise exception 'Accès refusé : rôle admin requis';
  end if;
  return query
  select o.id, o.user_id, u.email::text, (o.shipping ->> 'fullName')::text,
         o.items, o.total_eur, o.status, o.shipping, o.created_at
  from public.orders o
  left join auth.users u on u.id = o.user_id
  order by o.created_at desc;
end;
$$;

create or replace function public.admin_update_order_status(order_id uuid, new_status text)
returns void
language plpgsql security definer set search_path to ''
as $$
begin
  if coalesce((select raw_user_meta_data ->> 'role' from auth.users where id = auth.uid()), 'user') <> 'admin' then
    raise exception 'Accès refusé : rôle admin requis';
  end if;
  if new_status not in ('pending','paid','assembling','shipped','delivered','cancelled') then
    raise exception 'Statut invalide';
  end if;
  update public.orders set status = new_status where id = order_id;
  if not found then raise exception 'Commande introuvable'; end if;
end;
$$;
