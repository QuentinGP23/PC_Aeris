import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ordersService, type OrderSummary } from '../../services'
import { useAuth } from '../../context/useAuth'
import { useToast } from '../../store'
import { ORDER_STATUSES, ASSEMBLY_PRICE, orderStatusMeta } from '../../constants'
import { CATEGORIES, type CategoryKey } from '../../types'
import { downloadDevis } from '../../utils/devis'
import './Orders.scss'

const eur = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
const catLabel = (c: CategoryKey) => CATEGORIES.find((x) => x.value === c)?.label ?? c

// Étapes de suivi (hors annulée) pour la barre de progression.
const STEPS = ORDER_STATUSES.filter((s) => s.value !== 'cancelled')

function Orders() {
  const navigate = useNavigate()
  const toast = useToast()
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<OrderSummary[] | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    void ordersService.list().then(({ data, error }) => {
      if (cancelled) return
      if (error) toast.error(error)
      setOrders(data)
    })
    return () => { cancelled = true }
  }, [isAuthenticated, toast])

  if (!isAuthenticated) {
    return (
      <div className="myo myo--center">
        <p>Connectez-vous pour voir vos commandes.</p>
        <Link className="myo-btn" to="/signin">Se connecter</Link>
      </div>
    )
  }
  if (orders === null) return <div className="myo myo--center">Chargement…</div>

  return (
    <div className="myo">
      <h1 className="myo__title">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="myo myo--center">
          <p>Vous n'avez pas encore de commande.</p>
          <button className="myo-btn" onClick={() => navigate('/configurateur')}>Configurer un PC</button>
        </div>
      ) : (
        <div className="myo__list">
          {orders.map((o) => {
            const m = orderStatusMeta(o.status)
            const stepIdx = STEPS.findIndex((s) => s.value === o.status)
            const cancelled = o.status === 'cancelled'
            const isOpen = openId === o.id
            return (
              <article key={o.id} className="oc">
                <div className="oc__hd">
                  <div>
                    <div className="oc__ref">Commande #{o.id.slice(0, 8).toUpperCase()}</div>
                    <div className="oc__date">{fmtDate(o.created_at)} · {o.items.reduce((a, i) => a + i.quantity, 0)} PC</div>
                  </div>
                  <div className="oc__right">
                    <span className="ostatus" style={{ color: m.color, borderColor: m.color, background: `${m.color}1a` }}>{m.label}</span>
                    <div className="oc__total">{eur(o.total_eur)}</div>
                  </div>
                </div>

                {!cancelled && (
                  <div className="oc__steps">
                    {STEPS.map((s, i) => (
                      <div key={s.value} className={`oc__step ${i <= stepIdx ? 'is-done' : ''}`}>
                        <span className="oc__dot" style={i <= stepIdx ? { background: s.color, borderColor: s.color } : {}} />
                        <span className="oc__step-l">{s.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="oc__ft">
                  <button className="oc__link" onClick={() => setOpenId(isOpen ? null : o.id)}>{isOpen ? 'Masquer le détail' : 'Voir le détail'}</button>
                  <button
                    className="oc__link"
                    onClick={() => {
                      downloadDevis(o.items, { number: o.id.slice(0, 8).toUpperCase(), date: fmtDate(o.created_at) })
                      toast.success('Devis téléchargé')
                    }}
                  >
                    📄 Devis
                  </button>
                </div>

                {isOpen && (
                  <div className="oc__detail">
                    {o.items.map((it) => (
                      <div key={it.id} className="oc__item">
                        <div className="oc__item-name">{it.name}{it.quantity > 1 ? ` × ${it.quantity}` : ''} <span>· montage {it.assembly}</span></div>
                        <table className="oc__t">
                          <tbody>
                            {it.lines.map((l) => (
                              <tr key={l.category}><td>{catLabel(l.category)}</td><td>{l.name}</td><td>{l.merchant ?? '—'}</td><td className="num">{l.price != null ? eur(l.price) : 'sur devis'}</td></tr>
                            ))}
                            <tr><td>Montage</td><td>Offre {it.assembly}</td><td>PC Aeris</td><td className="num">{eur(ASSEMBLY_PRICE[it.assembly])}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Orders
