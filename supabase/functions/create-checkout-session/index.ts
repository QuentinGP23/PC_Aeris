// Crée une session Stripe Checkout pour régler le devis final d'une commande.
// L'appelant doit être authentifié et propriétaire de la commande (RLS), et la
// commande doit être au statut 'accepted'. On encaisse final_total (prix réel
// confirmé par l'admin), pas l'estimation initiale.
// Secrets requis : STRIPE_SECRET_KEY. Injectés par Supabase : SUPABASE_URL,
// SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.
import Stripe from 'https://esm.sh/stripe@16.12.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const ANON = Deno.env.get('SUPABASE_ANON_KEY')!
    const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const STRIPE_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    if (!STRIPE_KEY) return json({ error: 'Stripe non configuré' }, 500)

    const authHeader = req.headers.get('Authorization') ?? ''
    if (!authHeader) return json({ error: 'Non authentifié' }, 401)

    const { orderId, returnUrl } = await req.json()
    if (!orderId) return json({ error: 'orderId manquant' }, 400)

    // Client scopé à l'utilisateur (RLS) : il ne peut lire que SA commande.
    const userClient = createClient(SUPABASE_URL, ANON, { global: { headers: { Authorization: authHeader } } })
    const { data: order, error } = await userClient
      .from('orders')
      .select('id, status, final_total, total_eur')
      .eq('id', orderId)
      .single()
    if (error || !order) return json({ error: 'Commande introuvable' }, 404)
    if (order.status !== 'accepted') return json({ error: "Cette commande n'est pas prête au paiement." }, 409)

    const amount = Math.round(Number(order.final_total ?? order.total_eur) * 100)
    if (!(amount > 0)) return json({ error: 'Montant invalide' }, 400)

    const base =
      typeof returnUrl === 'string' && returnUrl.startsWith('http') ? returnUrl : `${new URL(req.url).origin}/commandes`

    const stripe = new Stripe(STRIPE_KEY, { httpClient: Stripe.createFetchHttpClient(), apiVersion: '2024-06-20' })
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: amount,
            product_data: { name: `Commande PC Aeris #${String(orderId).slice(0, 8).toUpperCase()}` },
          },
        },
      ],
      metadata: { orderId },
      client_reference_id: orderId,
      success_url: `${base}?paid=1`,
      cancel_url: base,
    })

    // Mémorise l'id de session (service role, bypass RLS) pour traçabilité.
    const admin = createClient(SUPABASE_URL, SERVICE)
    await admin.from('orders').update({ stripe_session_id: session.id }).eq('id', orderId)

    return json({ url: session.url })
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
