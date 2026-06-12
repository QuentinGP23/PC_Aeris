import { useEffect, useState } from 'react'
import { ordersService, type OrderAdmin } from '../../services'
import { useToast, type CartItem } from '../../store'
import { ORDER_STATUSES, FULFILLMENT_STATUSES, ASSEMBLY_PRICE, orderStatusMeta } from '../../constants'
import { CATEGORIES, type CategoryKey } from '../../types'
import './Orders.scss'

const eur = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
const catLabel = (c: CategoryKey) => CATEGORIES.find((x) => x.value === c)?.label ?? c
const lineKey = (itemId: string, cat: string) => `${itemId}|${cat}`

function StatusBadge({ status }: { status: string }) {
  const m = orderStatusMeta(status)
  return <span className="ostatus" style={{ color: m.color, borderColor: m.color, background: `${m.color}1a` }}>{m.label}</span>
}

type EditMap = Record<string, { merchant: string; price: string }>

function AdminOrders() {
  const toast = useToast()
  const [orders, setOrders] = useState<OrderAdmin[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [edit, setEdit] = useState<{ orderId: string; map: EditMap } | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    void ordersService.adminList().then(({ data, error }) => {
      if (cancelled) return
      if (error) setError(error)
      else setOrders(data)
    })
    return () => { cancelled = true }
  }, [])

  const patch = (id: string, fields: Partial<OrderAdmin>) =>
    setOrders((prev) => (prev ?? []).map((x) => (x.id === id ? { ...x, ...fields } : x)))

  const changeStatus = async (o: OrderAdmin, status: string) => {
    const { error } = await ordersService.adminUpdateStatus(o.id, status)
    if (error) return toast.error(error)
    patch(o.id, { status })
    toast.success('Statut mis à jour')
  }

  const startFinalize = (o: OrderAdmin) => {
    const map: EditMap = {}
    for (const it of o.items) for (const l of it.lines) map[lineKey(it.id, l.category)] = { merchant: l.merchant ?? '', price: l.price != null ? String(l.price) : '' }
    setEdit({ orderId: o.id, map })
    setOpenId(o.id)
  }

  const setField = (k: string, field: 'merchant' | 'price', v: string) =>
    setEdit((e) => (e ? { ...e, map: { ...e.map, [k]: { ...e.map[k], [field]: v } } } : e))

  const buildFinal = (o: OrderAdmin, map: EditMap): { items: CartItem[]; total: number } => {
    const items = o.items.map((it) => {
      const lines = it.lines.map((l) => {
        const e = map[lineKey(it.id, l.category)]
        const price = e && e.price !== '' ? Number(e.price) : null
        return { ...l, merchant: e?.merchant?.trim() || null, price: Number.isFinite(price as number) ? (price as number) : null }
      })
      const componentsPrice = lines.reduce((a, l) => a + (l.price ?? 0), 0)
      return { ...it, lines, componentsPrice }
    })
    const total = items.reduce((a, it) => a + (it.componentsPrice + ASSEMBLY_PRICE[it.assembly]) * it.quantity, 0)
    return { items, total }
  }

  const sendFinal = async (o: OrderAdmin) => {
    if (!edit || edit.orderId !== o.id) return
    const { items, total } = buildFinal(o, edit.map)
    setBusy(true)
    const { error } = await ordersService.finalize(o.id, items, total)
    if (error) { setBusy(false); return toast.error(error) }
    void ordersService.emailDevis({ orderId: o.id, clientName: o.client_name ?? '', total })
    setBusy(false)
    patch(o.id, { status: 'quote_sent', final_items: items, final_total: total })
    setEdit(null)
    toast.success('Devis final envoyé au client')
  }

  if (error) return <div className="adm-orders__state adm-orders__state--err">{error}</div>
  if (orders === null) return <div className="adm-orders__state">Chargement…</div>

  return (
    <div className="adm-orders">
      <div className="adm-orders__hd"><span>{orders.length} commande{orders.length > 1 ? 's' : ''}</span></div>
      {orders.length === 0 ? (
        <div className="adm-orders__state">Aucune commande pour l'instant.</div>
      ) : (
        <div className="adm-orders__table">
          <div className="otr otr--head"><span>Date</span><span>Client</span><span>Configurations</span><span className="num">Total</span><span>Statut</span><span></span></div>
          {orders.map((o) => {
            const count = o.items.reduce((a, i) => a + i.quantity, 0)
            const isOpen = openId === o.id
            const display = o.final_items ?? o.items
            const displayTotal = o.final_total ?? o.total_eur
            const editing = edit?.orderId === o.id
            return (
              <div key={o.id} className="ogroup">
                <div className="otr">
                  <span className="otr__date">{fmtDate(o.created_at)}<small>#{o.id.slice(0, 8).toUpperCase()}</small></span>
                  <span className="otr__client">{o.client_name ?? '—'}<small>{o.client_email}</small></span>
                  <span className="otr__items">{count} PC · {o.items.map((i) => i.name).join(', ')}</span>
                  <span className="otr__total num">{eur(displayTotal)}</span>
                  <span>
                    {FULFILLMENT_STATUSES.includes(o.status as never) ? (
                      <select className="osel" value={o.status} onChange={(e) => void changeStatus(o, e.target.value)}>
                        {ORDER_STATUSES.filter((s) => FULFILLMENT_STATUSES.includes(s.value)).map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    ) : (
                      <StatusBadge status={o.status} />
                    )}
                  </span>
                  <span><button className="otr__exp" onClick={() => setOpenId(isOpen ? null : o.id)}>{isOpen ? '▲' : '▾'}</button></span>
                </div>

                {isOpen && (
                  <div className="odetail">
                    {o.shipping && (
                      <div className="odetail__ship">Livraison : {o.shipping.fullName} — {o.shipping.address}, {o.shipping.zip} {o.shipping.city} · {o.shipping.phone}</div>
                    )}

                    {/* PENDING → formulaire de finalisation */}
                    {o.status === 'pending' && (
                      editing ? (
                        <div className="ofinal">
                          <div className="ofinal__intro">Renseigne le <b>vendeur</b> et le <b>prix réel</b> de chaque composant, puis envoie le devis final au client.</div>
                          {o.items.map((it) => (
                            <div key={it.id} className="oitem">
                              <div className="oitem__name">{it.name}{it.quantity > 1 ? ` × ${it.quantity}` : ''} <span>· montage {it.assembly} ({eur(ASSEMBLY_PRICE[it.assembly])})</span></div>
                              <table className="ofinal__t">
                                <thead><tr><th>Composant</th><th>Vendeur</th><th>Prix réel</th></tr></thead>
                                <tbody>
                                  {it.lines.map((l) => {
                                    const k = lineKey(it.id, l.category)
                                    const e = edit!.map[k] ?? { merchant: '', price: '' }
                                    return (
                                      <tr key={l.category}>
                                        <td><span className="ofinal__cat">{catLabel(l.category)}</span> {l.name}</td>
                                        <td><input value={e.merchant} placeholder="ex. LDLC" onChange={(ev) => setField(k, 'merchant', ev.target.value)} /></td>
                                        <td><input type="number" min="0" value={e.price} placeholder="0" onChange={(ev) => setField(k, 'price', ev.target.value)} /> €</td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ))}
                          <div className="ofinal__ft">
                            <div className="ofinal__total">Total devis : <b>{eur(buildFinal(o, edit!.map).total)}</b></div>
                            <div>
                              <button className="ob ob--ghost" onClick={() => setEdit(null)} disabled={busy}>Annuler</button>
                              <button className="ob ob--ind" onClick={() => void sendFinal(o)} disabled={busy}>{busy ? 'Envoi…' : 'Envoyer le devis final →'}</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="ofinal__cta">
                          <span>Commande à traiter : complète le devis avec les prix réels.</span>
                          <button className="ob ob--ind" onClick={() => startFinalize(o)}>Compléter le devis</button>
                        </div>
                      )
                    )}

                    {/* quote_sent → en attente client */}
                    {o.status === 'quote_sent' && <div className="odetail__note">Devis final envoyé — en attente de la réponse du client.</div>}
                    {o.status === 'refused' && <div className="odetail__note odetail__note--err">Devis refusé par le client.</div>}
                    {o.status === 'accepted' && <div className="odetail__note odetail__note--ok">Devis accepté par le client — à mettre en assemblage.</div>}

                    {/* Devis (final si dispo, sinon estimatif) */}
                    {o.status !== 'pending' && display.map((it) => (
                      <div key={it.id} className="oitem">
                        <div className="oitem__name">{it.name}{it.quantity > 1 ? ` × ${it.quantity}` : ''} <span>· montage {it.assembly}</span></div>
                        <table className="oitem__t"><tbody>
                          {it.lines.map((l) => (
                            <tr key={l.category}><td>{catLabel(l.category)}</td><td>{l.name}</td><td>{l.merchant ?? '—'}</td><td className="num">{l.price != null ? eur(l.price) : 'sur devis'}</td></tr>
                          ))}
                          <tr><td>Montage</td><td>Offre {it.assembly}</td><td>PC Aeris</td><td className="num">{eur(ASSEMBLY_PRICE[it.assembly])}</td></tr>
                        </tbody></table>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminOrders
