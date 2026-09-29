-- ════════════════════════════════════════════════════════════════════════
-- Correction d'une élévation de privilèges critique
-- ════════════════════════════════════════════════════════════════════════
--
-- PROBLÈME
-- Toutes les autorisations (8 politiques RLS « Admin write access » et 5
-- fonctions SECURITY DEFINER) lisaient le rôle dans
-- auth.users.raw_user_meta_data, c'est-à-dire user_metadata — un champ que
-- l'utilisateur modifie lui-même via supabase.auth.updateUser({ data: … }).
--
--   await supabase.auth.updateUser({ data: { role: 'admin' } })
--
-- suffisait à n'importe quel compte inscrit pour obtenir : la liste
-- nominative de tous les utilisateurs (email, nom, téléphone), la
-- suppression de comptes, la fixation du montant final des devis et
-- l'écriture sur les 25 423 produits.
--
-- CORRECTION
-- Le rôle passe dans raw_app_meta_data (app_metadata), écrivable uniquement
-- par la clé service_role, jamais par le client. Une fonction unique
-- public.is_admin() devient la seule source d'autorité.
--
-- Cette migration corrige également :
--   • 19 politiques ré-évaluant auth.uid() à chaque ligne  → (select auth.uid())
--   • 45 avertissements « multiple permissive policies »   → FOR ALL découpé
--     en INSERT/UPDATE/DELETE, la lecture publique n'étant plus doublée
--   • search_path mutable sur touch_updated_at
--   • EXECUTE des fonctions admin_* ouvert au rôle anon
--
-- IDEMPOTENTE — réexécutable sans effet de bord.
-- ════════════════════════════════════════════════════════════════════════

begin;

-- ─── 1. Déplacement des rôles existants vers app_metadata ───────────────

update auth.users
set raw_app_meta_data =
      coalesce(raw_app_meta_data, '{}'::jsonb)
      || jsonb_build_object('role', coalesce(raw_user_meta_data ->> 'role', 'user'))
where coalesce(raw_app_meta_data ->> 'role', '')
      is distinct from coalesce(raw_user_meta_data ->> 'role', 'user');

-- Le rôle est retiré de user_metadata : plus aucune source d'autorité
-- modifiable par l'utilisateur ne subsiste.
-- (on évite l'opérateur jsonb `?`, interprété comme placeholder par certains
-- drivers SQL)
update auth.users
set raw_user_meta_data = raw_user_meta_data - 'role'
where raw_user_meta_data ->> 'role' is not null;


-- ─── 2. Source d'autorité unique ────────────────────────────────────────
--
-- Lecture directe de la table (et non de auth.jwt()) : le changement de rôle
-- prend effet immédiatement, sans attendre le rafraîchissement du jeton.
-- STABLE + appel en (select public.is_admin()) dans les politiques => une
-- seule évaluation par requête, pas une par ligne.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select u.raw_app_meta_data ->> 'role' from auth.users u where u.id = auth.uid()),
    'user'
  ) = 'admin';
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;


-- ─── 3. Politiques d'écriture admin (catalogue) ─────────────────────────
--
-- L'ancienne politique était en FOR ALL : elle s'appliquait donc aussi au
-- SELECT et doublait « Public read access » sur chaque lecture du catalogue.
-- Elle est remplacée par trois politiques d'écriture, réservées au rôle
-- authenticated. La lecture publique reste inchangée.

do $do$
declare
  t text;
  tables text[] := array[
    'products', 'cpu_specs', 'gpu_specs', 'ram_specs',
    'motherboard_specs', 'storage_specs', 'psu_specs', 'cpu_cooler_specs'
  ];
begin
  foreach t in array tables loop
    execute format('drop policy if exists %I on public.%I', 'Admin write access', t);
    execute format('drop policy if exists admin_insert on public.%I', t);
    execute format('drop policy if exists admin_update on public.%I', t);
    execute format('drop policy if exists admin_delete on public.%I', t);

    execute format(
      'create policy admin_insert on public.%I for insert to authenticated
         with check ((select public.is_admin()))', t);

    execute format(
      'create policy admin_update on public.%I for update to authenticated
         using ((select public.is_admin())) with check ((select public.is_admin()))', t);

    execute format(
      'create policy admin_delete on public.%I for delete to authenticated
         using ((select public.is_admin()))', t);
  end loop;
end
$do$;


-- ─── 4. Politiques utilisateur : auth.uid() évalué une seule fois ───────

drop policy if exists saved_configs_select_own on public.saved_configs;
drop policy if exists saved_configs_insert_own on public.saved_configs;
drop policy if exists saved_configs_update_own on public.saved_configs;
drop policy if exists saved_configs_delete_own on public.saved_configs;

create policy saved_configs_select_own on public.saved_configs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy saved_configs_insert_own on public.saved_configs
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy saved_configs_update_own on public.saved_configs
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy saved_configs_delete_own on public.saved_configs
  for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists addresses_select_own on public.addresses;
drop policy if exists addresses_insert_own on public.addresses;
drop policy if exists addresses_update_own on public.addresses;
drop policy if exists addresses_delete_own on public.addresses;

create policy addresses_select_own on public.addresses
  for select to authenticated using ((select auth.uid()) = user_id);
create policy addresses_insert_own on public.addresses
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy addresses_update_own on public.addresses
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy addresses_delete_own on public.addresses
  for delete to authenticated using ((select auth.uid()) = user_id);

-- orders reste volontairement sans politique UPDATE/DELETE : toute
-- modification passe par une fonction contrôlée (fail-closed).
drop policy if exists orders_select_own on public.orders;
drop policy if exists orders_insert_own on public.orders;

create policy orders_select_own on public.orders
  for select to authenticated using ((select auth.uid()) = user_id);
create policy orders_insert_own on public.orders
  for insert to authenticated with check ((select auth.uid()) = user_id);


-- ─── 5. Fonctions admin : contrôle délégué à is_admin() ─────────────────

create or replace function public.admin_list_users()
returns table (
  id uuid, email text, pseudo text, first_name text, last_name text,
  phone_number text, role text, created_at timestamptz
)
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès refusé : rôle admin requis';
  end if;

  return query
  select u.id,
         u.email::text,
         (u.raw_user_meta_data ->> 'pseudo')::text,
         (u.raw_user_meta_data ->> 'first_name')::text,
         (u.raw_user_meta_data ->> 'last_name')::text,
         (u.raw_user_meta_data ->> 'phone_number')::text,
         coalesce(u.raw_app_meta_data ->> 'role', 'user')::text,
         u.created_at
  from auth.users u
  order by u.created_at desc;
end;
$$;

-- Le rôle est routé vers app_metadata, le reste vers user_metadata : le
-- client ne peut donc jamais écrire de rôle, même via cette fonction.
create or replace function public.admin_update_user(target_user_id uuid, new_metadata jsonb)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_role text := new_metadata ->> 'role';
begin
  if not public.is_admin() then
    raise exception 'Accès refusé : rôle admin requis';
  end if;

  if v_role is not null and v_role not in ('user', 'admin') then
    raise exception 'Rôle invalide : %', v_role;
  end if;

  update auth.users
  set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
                           || (new_metadata - 'role'),
      raw_app_meta_data  = case
                             when v_role is null then raw_app_meta_data
                             else coalesce(raw_app_meta_data, '{}'::jsonb)
                                  || jsonb_build_object('role', v_role)
                           end,
      updated_at = now()
  where id = target_user_id;

  if not found then
    raise exception 'Utilisateur introuvable : %', target_user_id;
  end if;
end;
$$;

create or replace function public.admin_delete_user(target_user_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès refusé : rôle admin requis';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'Un administrateur ne peut pas supprimer son propre compte';
  end if;

  delete from auth.users where id = target_user_id;

  if not found then
    raise exception 'Utilisateur introuvable : %', target_user_id;
  end if;
end;
$$;

create or replace function public.admin_list_orders()
returns table (
  id uuid, user_id uuid, client_email text, client_name text, items jsonb,
  total_eur numeric, status text, shipping jsonb, created_at timestamptz,
  final_items jsonb, final_total numeric
)
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
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

create or replace function public.admin_update_order_status(order_id uuid, new_status text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès refusé : rôle admin requis';
  end if;

  if new_status not in ('pending','quote_sent','accepted','refused','paid',
                        'assembling','shipped','delivered','cancelled') then
    raise exception 'Statut invalide';
  end if;

  update public.orders set status = new_status where id = order_id;

  if not found then
    raise exception 'Commande introuvable';
  end if;
end;
$$;

create or replace function public.admin_finalize_order(
  order_id uuid, p_final_items jsonb, p_final_total numeric
)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès refusé : rôle admin requis';
  end if;

  update public.orders
  set final_items = p_final_items,
      final_total = p_final_total,
      status = 'quote_sent',
      updated_at = now()
  where id = order_id;

  if not found then
    raise exception 'Commande introuvable';
  end if;
end;
$$;


-- ─── 6. Durcissement des droits d'exécution ─────────────────────────────
--
-- Les fonctions admin_* ne sont jamais appelées sans session : anon n'a
-- aucune raison de pouvoir les invoquer. Défense en profondeur — le contrôle
-- interne is_admin() reste la protection principale.

revoke all on function public.admin_list_users()                              from public, anon;
revoke all on function public.admin_update_user(uuid, jsonb)                  from public, anon;
revoke all on function public.admin_delete_user(uuid)                         from public, anon;
revoke all on function public.admin_list_orders()                             from public, anon;
revoke all on function public.admin_update_order_status(uuid, text)           from public, anon;
revoke all on function public.admin_finalize_order(uuid, jsonb, numeric)      from public, anon;
revoke all on function public.respond_quote(uuid, boolean)                    from public, anon;

grant execute on function public.admin_list_users()                           to authenticated;
grant execute on function public.admin_update_user(uuid, jsonb)               to authenticated;
grant execute on function public.admin_delete_user(uuid)                      to authenticated;
grant execute on function public.admin_list_orders()                          to authenticated;
grant execute on function public.admin_update_order_status(uuid, text)        to authenticated;
grant execute on function public.admin_finalize_order(uuid, jsonb, numeric)   to authenticated;
grant execute on function public.respond_quote(uuid, boolean)                 to authenticated;

-- get_email_by_pseudo reste accessible à anon : la connexion par pseudo s'en
-- sert avant toute authentification. search_path figé.
-- NOTE : cette fonction permet d'associer un pseudo à un email. Prévoir un
-- rate limiting (Edge Function) avant l'ouverture au public.
create or replace function public.get_email_by_pseudo(p_pseudo text)
returns text
language sql stable security definer set search_path = ''
as $$
  select u.email::text
  from auth.users u
  where u.raw_user_meta_data ->> 'pseudo' = p_pseudo
  limit 1;
$$;


-- ─── 7. search_path figé sur le trigger ─────────────────────────────────

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

commit;
