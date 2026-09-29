-- ════════════════════════════════════════════════════════════════════════
-- Rattrapage : pc_case_specs oubliée dans 20260929_fix_admin_privilege_escalation
-- ════════════════════════════════════════════════════════════════════════
--
-- La migration précédente traitait 8 tables du catalogue. Il y en avait 9 :
-- pc_case_specs a été omise du tableau. Elle a donc conservé son ancienne
-- politique « Admin write access » (FOR ALL), qui lit le rôle dans
-- raw_user_meta_data — le champ modifiable par l'utilisateur.
--
-- Conséquences de cet oubli, jusqu'à l'application de ce fichier :
--   • l'élévation de privilèges reste exploitable sur cette table : un
--     utilisateur qui repose 'role' dans son user_metadata obtient
--     l'écriture sur les specs de boîtiers ;
--   • à l'inverse, le véritable administrateur ne peut plus y écrire, son
--     rôle ayant été déplacé vers app_metadata.
--
-- IDEMPOTENTE.
-- ════════════════════════════════════════════════════════════════════════

begin;

drop policy if exists "Admin write access" on public.pc_case_specs;
drop policy if exists admin_insert on public.pc_case_specs;
drop policy if exists admin_update on public.pc_case_specs;
drop policy if exists admin_delete on public.pc_case_specs;

create policy admin_insert on public.pc_case_specs
  for insert to authenticated
  with check ((select public.is_admin()));

create policy admin_update on public.pc_case_specs
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy admin_delete on public.pc_case_specs
  for delete to authenticated
  using ((select public.is_admin()));

commit;
