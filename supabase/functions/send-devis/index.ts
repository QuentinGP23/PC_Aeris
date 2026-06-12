// Envoie le devis PDF par email au client (appelant) et à tous les comptes admin.
// Secrets requis : RESEND_API_KEY (clé Resend). Optionnel : DEVIS_SENDER.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ADMIN_EMAIL = 'admin@pcaeris.fr'
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

const eur = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const url = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const RESEND = Deno.env.get('RESEND_API_KEY')
    const SENDER = Deno.env.get('DEVIS_SENDER') ?? 'PC Aeris <onboarding@resend.dev>'
    const authHeader = req.headers.get('Authorization') ?? ''

    const { orderId, clientName, total, pdfBase64 } = await req.json()
    const ref = String(orderId ?? '').slice(0, 8).toUpperCase()

    // Email du client (l'appelant authentifié).
    const asUser = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } })
    const { data: u } = await asUser.auth.getUser()
    const clientEmail = u?.user?.email
    if (!clientEmail) return json({ error: 'Appelant non authentifié.' }, 401)

    // Emails des admins (rôle dans user_metadata / app_metadata).
    const admin = createClient(url, serviceKey)
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 })
    const adminEmails = (list?.users ?? [])
      .filter((x: { user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> }) =>
        x.user_metadata?.role === 'admin' || x.app_metadata?.role === 'admin')
      .map((x: { email?: string }) => x.email)
      .filter(Boolean) as string[]
    const bcc = Array.from(new Set([ADMIN_EMAIL, ...adminEmails])).filter((e) => e && e !== clientEmail)

    if (!RESEND) return json({ sent: false, reason: 'RESEND_API_KEY non configuré', recipients: { to: clientEmail, bcc } })

    const html = `
      <div style="font-family:Segoe UI,Arial,sans-serif;color:#1a1d29;max-width:560px">
        <div style="height:5px;background:#4f46e5"></div>
        <h2 style="margin:18px 0 4px">PC Aeris — Votre devis #${ref}</h2>
        <p style="color:#41465a;line-height:1.55">Bonjour ${clientName ?? ''},<br/>
        Merci pour votre commande. Vous trouverez en pièce jointe votre <b>devis détaillé</b> :
        chaque composant, le marchand où il est sourcé au meilleur prix, et l'offre de montage.</p>
        <p style="font-size:20px;font-weight:800;margin:18px 0">Total : ${eur(Number(total) || 0)}</p>
        <p style="color:#6b7185;font-size:12px;line-height:1.5">Les composants sont sourcés au meilleur prix du marché, sans marge de notre part : notre rémunération correspond à l'offre de montage choisie. Devis valable 7 jours.</p>
        <p style="color:#6b7185;font-size:12px">— L'équipe PC Aeris · pc-aeris.vercel.app</p>
      </div>`

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: SENDER,
        to: [clientEmail],
        bcc,
        subject: `Votre devis PC Aeris #${ref}`,
        html,
        attachments: pdfBase64 ? [{ filename: `devis-${ref}.pdf`, content: pdfBase64 }] : undefined,
      }),
    })
    const body = await r.json()
    if (!r.ok) return json({ sent: false, error: body }, 502)
    return json({ sent: true, recipients: { to: clientEmail, bcc } })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
