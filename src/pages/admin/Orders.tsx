import { useEffect, useState } from 'react'
import { ordersService, type OrderAdmin } from '../../services'
import { useToast } from '../../store'
import { ORDER_STATUSES, ASSEMBLY_PRICE, orderStatusMeta } from '../../constants'
import { CATEGORIES, type CategoryKey } from '../../types'
import './Orders.scss'

const eur = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
const catLabel = (c: CategoryKey) => CATEGORIES.find((x) => x.value === c)?.label ?? c

function StatusBadge({ status }: { status: string }) {
  const m = orderStatusMeta(status)
  return <span className="ostatus" style={{ color: m.color, borderColor: m.color, background: `${m.color}1a` }}>{m.label}</span>
}

function AdminOrders() {
  const toast = useToast()
  const [orders, setOrders] = useState<OrderAdmin[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void ordersService.adminList().then(({ data, error }) => {
      if (cancelled) return
      if (error) setError(error)
      else setOrders(data)
    })
    return () => { cancelled = true }
  }, [])

  const changeStatus = async (o: OrderAdmin, status: string) => {
    const { error } = await ordersService.adminUpdateStatus(o.id, status)
    if (error) { toast.error(error); return }
    setOrders((prev) => (prev ?? []).map((x) => (x.id === o.id ? { ...x, status } : x)))
    toast.success('Statut mis à jour')
  }

  if (error) return <div className="adm-orders__state adm-orders__state--err">{error}</div>
  if (orders === null) return <div className="adm-orders__state">Chargement…</div>

  return (
    <div className="adm-orders">
      <div className="adm-orders__hd">
        <span>{orders.length} commande{orders.length > 1 ? 's' : ''}</span>
      </div>

      {orders.length === 0 ? (
        <div className="adm-orders__state">Aucune commande pour l'instant.</div>
      ) : (
        <div className="adm-orders__table">
          <div className="otr otr--head">
            <span>Date</span><span>Client</span><span>Configurations</span><span className="num">Total</span><span>Statut</span><span></span>
          </div>
          {orders.map((o) => {
            const count = o.items.reduce((a, i) => a + i.quantity, 0)
            const isOpen = openId === o.id
            return (
              <div key={o.id} className="ogroup">
                <div className="otr">
                  <span className="otr__date">{fmtDate(o.created_at)}<small>#{o.id.slice(0, 8).toUpperCase()}</small></span>
                  <span className="otr__client">{o.client_name ?? '—'}<small>{o.client_email}</small></span>
                  <span className="otr__items">{count} PC · {o.items.map((i) => i.name).join(', ')}</span>
                  <span className="otr__total num">{eur(o.total_eur)}</span>
                  <span>
                    <select className="osel" value={o.status} onChange={(e) => void changeStatus(o, e.target.value)}>
                      {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </span>
                  <span><button className="otr__exp" onClick={() => setOpenId(isOpen ? null : o.id)}>{isOpen ? '▲' : '▾'}</button></span>
                </div>
                {isOpen && (
                  <div className="odetail">
                    <div className="odetail__ship">
                      <StatusBadge status={o.status} />
                      {o.shipping && <span>Livraison : {o.shipping.fullName} — {o.shipping.address}, {o.shipping.zip} {o.shipping.city} · {o.shipping.phone}</span>}
                    </div>
                    {o.items.map((it) => (
                      <div key={it.id} className="oitem">
                        <div className="oitem__name">{it.name}{it.quantity > 1 ? ` × ${it.quantity}` : ''} <span>· montage {it.assembly}</span></div>
                        <table className="oitem__t">
                          <tbody>
                            {it.lines.map((l) => (
                              <tr key={l.category}>
                                <td>{catLabel(l.category)}</td><td>{l.name}</td>
                                <td>{l.merchant ?? '—'}</td>
                                <td className="num">{l.price != null ? eur(l.price) : 'sur devis'}</td>
                              </tr>
                            ))}
                            <tr><td>Montage</td><td>Offre {it.assembly}</td><td>PC Aeris</td><td className="num">{eur(ASSEMBLY_PRICE[it.assembly])}</td></tr>
                          </tbody>
                        </table>
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
