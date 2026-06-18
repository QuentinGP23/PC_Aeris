// Envoie le devis par email au client + à tous les admins (Resend).
// Lit la commande côté serveur (orderId) → robuste, testable, et utilisable par un webhook.
// Secrets : RESEND_API_KEY. Optionnel : DEVIS_SENDER.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ADMIN_EMAIL = 'admin@pcaeris.fr'
const ASSEMBLY_PRICE: Record<string, number> = { essentiel: 79, confort: 129, premium: 199 }
const ASSEMBLY_NAME: Record<string, string> = { essentiel: 'Essentiel', confort: 'Confort', premium: 'Premium' }
const CAT: Record<string, string> = {
  cpu: 'Processeur', gpu: 'Carte graphique', ram: 'RAM', motherboard: 'Carte mère',
  storage: 'Stockage', psu: 'Alimentation', pc_case: 'Boîtier', cpu_cooler: 'Ventirad',
}
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } })
const eur = (n: number) => `${Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`

interface Line { category: string; name: string; price: number | null; merchant: string | null }
interface Item { name: string; lines: Line[]; componentsPrice: number; assembly: string; quantity: number }

function buildHtml(items: Item[], total: number, ref: string, client?: string): string {
  const cell = 'padding:6px 9px;border-bottom:1px solid #eceef4'
  const blocks = items.map((it) => {
    const rows = it.lines.map((l) =>
      `<tr><td style="${cell};color:#6b7185;font-size:11px">${CAT[l.category] ?? l.category}</td>` +
      `<td style="${cell}">${l.name}</td><td style="${cell}">${l.merchant ?? '—'}</td>` +
      `<td style="${cell};text-align:right;font-weight:600">${l.price != null ? eur(l.price) : 'sur devis'}</td></tr>`).join('')
    const montage =
      `<tr><td style="${cell};color:#6b7185">Montage</td><td style="${cell}">Offre ${ASSEMBLY_NAME[it.assembly] ?? it.assembly}</td>` +
      `<td style="${cell}">PC Aeris</td><td style="${cell};text-align:right;font-weight:600">${eur(ASSEMBLY_PRICE[it.assembly] ?? 0)}</td></tr>`
    const sub = (it.componentsPrice + (ASSEMBLY_PRICE[it.assembly] ?? 0)) * it.quantity
    return `<h3 style="margin:18px 0 6px;font-size:14px">${it.name}${it.quantity > 1 ? ` (× ${it.quantity})` : ''}</h3>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="background:#4f46e5;color:#fff;font-size:9.5px">
          <th style="padding:7px 9px;text-align:left">POSTE</th><th style="padding:7px 9px;text-align:left">COMPOSANT</th>
          <th style="padding:7px 9px;text-align:left">ACHETÉ CHEZ</th><th style="padding:7px 9px;text-align:right">PRIX</th>
        </tr></thead><tbody>${rows}${montage}</tbody></table>
      <p style="text-align:right;margin:6px 0 0;font-weight:700;font-size:12px">Sous-total : ${eur(sub)}</p>`
  }).join('')
  return `<div style="font-family:Segoe UI,Arial,sans-serif;color:#1a1d29;max-width:660px">
    <div style="height:6px;background:#4f46e5"></div>
    <h2 style="margin:16px 0 2px">PC Aeris — Devis #${ref}</h2>
    <p style="color:#6b7185;font-size:12px;margin:0">Le PC sur-mesure, enfin accessible à tous.</p>
    ${client ? `<p style="font-size:12px;margin:10px 0 0">Client : <b>${client}</b></p>` : ''}
    ${blocks}
    <table style="width:100%;border-collapse:collapse;margin-top:16px;background:#eef0fe;border-radius:8px">
      <tr><td style="padding:13px 16px;font-weight:700">TOTAL À PAYER</td>
      <td style="padding:13px 16px;text-align:right;color:#4f46e5;font-weight:800;font-size:18px">${eur(total)}</td></tr>
    </table>
    <p style="color:#6b7185;font-size:11px;line-height:1.55;margin-top:14px">Les composants sont sourcés au meilleur prix du marché, sans marge de notre part : notre rémunération correspond à l'offre de montage choisie. Devis valable 7 jours.</p>
    <p style="color:#6b7185;font-size:11px">— L'équipe PC Aeris · pc-aeris.vercel.app</p>
  </div>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const url = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const RESEND = Deno.env.get('RESEND_API_KEY')
    const SENDER = Deno.env.get('DEVIS_SENDER') ?? 'PC Aeris <onboarding@resend.dev>'

    const payload = await req.json()
    // Supporte l'appel direct {orderId} et le webhook DB {record:{id}}.
    const orderId: string = payload.orderId ?? payload.record?.id
    const pdfBase64: string | undefined = payload.pdfBase64
    if (!orderId) return json({ error: 'orderId manquant' }, 400)

    const admin = createClient(url, serviceKey)
    const { data: order, error: oErr } = await admin
      .from('orders').select('id, user_id, items, total_eur, shipping, final_items, final_total').eq('id', orderId).single()
    if (oErr || !order) return json({ error: 'Commande introuvable' }, 404)

    // Devis final (prix réels validés par l'admin) s'il existe, sinon devis estimatif.
    const isFinal = order.final_items != null
    const devisItems = (isFinal ? order.final_items : order.items) ?? []
    const devisTotal = Number(isFinal ? order.final_total : order.total_eur)

    const { data: cu } = await admin.auth.admin.getUserById(order.user_id)
    const clientEmail = cu?.user?.email
    if (!clientEmail) return json({ error: 'Email client introuvable' }, 404)

    const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 })
    const adminEmails = (list?.users ?? [])
      .filter((x: { user_metadata?: Record<string, unknown>; app_metadata?: Record<string, unknown> }) =>
        x.user_metadata?.role === 'admin' || x.app_metadata?.role === 'admin')
      .map((x: { email?: string }) => x.email).filter(Boolean) as string[]
    const bcc = Array.from(new Set([ADMIN_EMAIL, ...adminEmails])).filter((e) => e && e !== clientEmail)

    // Mode démo (Resend sans domaine vérifié) : si DEVIS_TEST_TO est défini, tous
    // les devis partent vers cette unique adresse autorisée (pas de bcc).
    // Mode démo Resend (sans domaine vérifié). En prod, l'adresse de démo est
    // injectée via le secret DEVIS_TEST_TO ; non versionnée dans le code public.
    const demoTo = Deno.env.get('DEVIS_TEST_TO')
    const to = demoTo ? [demoTo] : [clientEmail]
    const bccList = demoTo ? [] : bcc

    const ref = String(orderId).slice(0, 8).toUpperCase()
    const client = (order.shipping as { fullName?: string } | null)?.fullName
    const html = buildHtml(devisItems as Item[], devisTotal, ref, client)

    if (!RESEND) return json({ sent: false, reason: 'RESEND_API_KEY non configuré', recipients: { to: clientEmail, bcc } })

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: SENDER,
        to,
        bcc: bccList.length ? bccList : undefined,
        subject: `Votre devis ${isFinal ? 'final ' : ''}PC Aeris #${ref}${isFinal ? ' — à valider' : ''}`,
        html,
        attachments: pdfBase64 ? [{ filename: `devis-${ref}.pdf`, content: pdfBase64 }] : undefined,
      }),
    })
    const body = await r.json()
    if (!r.ok) return json({ sent: false, status: r.status, error: body }, 502)
    return json({ sent: true, id: body?.id, recipients: { to: clientEmail, bcc } })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
