// Webhook Stripe. Sur un paiement réussi (checkout.session.completed), passe la
// commande correspondante au statut 'paid'. C'est LA source de vérité du paiement
// (on ne se fie jamais à la redirection de retour côté navigateur).
//
// À DÉPLOYER SANS VÉRIF JWT (Stripe appelle sans token) :
//   supabase functions deploy stripe-webhook --no-verify-jwt
//
// Secrets requis : STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET.
// Injectés par Supabase : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
import Stripe from 'https://esm.sh/stripe@16.12.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', { httpClient: Stripe.createFetchHttpClient() })
const cryptoProvider = Stripe.createSubtleCryptoProvider()

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature')
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  const body = await req.text()
  if (!sig || !secret) return new Response('Configuration manquante', { status: 400 })

  let event: Stripe.Event
  try {
    // Variante async obligatoire en Deno (vérification de signature non bloquante).
    event = await stripe.webhooks.constructEventAsync(body, sig, secret, undefined, cryptoProvider)
  } catch (e) {
    return new Response(`Signature invalide : ${(e as Error).message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = (session.metadata?.orderId ?? session.client_reference_id) as string | undefined
    if (orderId) {
      const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
      // Idempotent : ne bascule que depuis 'accepted' (un 2e appel ne refait rien).
      await admin
        .from('orders')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', orderId)
        .eq('status', 'accepted')
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
})
