-- Élargit products.benchmark_score (smallint → integer).
-- Les scores PassMark du haut de gamme dépassent la borne smallint (32767)
-- (ex. Threadripper > 100 000).
alter table public.products alter column benchmark_score type integer;
