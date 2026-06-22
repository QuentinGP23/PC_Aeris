-- Paiement en ligne (Stripe Checkout).
-- Le passage à 'paid' est fait par le webhook Stripe (service role) après
-- un paiement réussi sur une commande au statut 'accepted'.
alter table public.orders add column if not exists stripe_session_id text;
alter table public.orders add column if not exists paid_at timestamptz;
