import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ordersService, type OrderSummary } from '../../services'
import { useAuth } from '../../context/useAuth'
import { useToast } from '../../store'
import { ASSEMBLY_PRICE, orderStatusMeta } from '../../constants'
import { CATEGORIES, type CategoryKey } from '../../types'
import { downloadDevis } from '../../utils/devis'
import './Orders.scss'

const eur = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
const catLabel = (c: CategoryKey) => CATEGORIES.find((x) => x.value === c)?.label ?? c

// Suivi de production (après acceptation du devis).
const TRACK: { value: string; label: string }[] = [
  { value: 'accepted', label: 'Devis accepté' },
  { value: 'assembling', label: 'En assemblage' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
]

function Orders() {
  const navigate = useNavigate()
  const toast = useToast()
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<OrderSummary[] | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

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

  const respond = async (o: OrderSummary, accept: boolean) => {
    setBusy(o.id)
    const { error } = await ordersService.respondQuote(o.id, accept)
    setBusy(null)
    if (error) return toast.error(error)
    setOrders((prev) => (prev ?? []).map((x) => (x.id === o.id ? { ...x, status: accept ? 'accepted' : 'refused' } : x)))
    toast.success(accept ? 'Devis accepté ! Nous lançons votre commande.' : 'Devis refusé.')
  }

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
            const isOpen = openId === o.id
            const isFinal = o.final_items != null
            const display = o.final_items ?? o.items
            const displayTotal = o.final_total ?? o.total_eur
            const trackIdx = TRACK.findIndex((s) => s.value === o.status)
            const showTrack = trackIdx >= 0
            return (
              <article key={o.id} className="oc">
                <div className="oc__hd">
                  <div>
                    <div className="oc__ref">Commande #{o.id.slice(0, 8).toUpperCase()}</div>
                    <div className="oc__date">{fmtDate(o.created_at)} · {o.items.reduce((a, i) => a + i.quantity, 0)} PC</div>
                  </div>
                  <div className="oc__right">
                    <span className="ostatus" style={{ color: m.color, borderColor: m.color, background: `${m.color}1a` }}>{m.label}</span>
                    <div className="oc__total">{eur(displayTotal)}</div>
                  </div>
                </div>

                {/* ── Écrans selon le parcours ── */}
                {o.status === 'pending' && (
                  <div className="oc__banner">
                    <span className="oc__banner-ico">⏳</span>
                    <div>Votre devis estimatif est bien reçu. Notre équipe vérifie le prix réel de chaque composant et le meilleur vendeur, puis vous enverra un <b>devis final à valider</b> ici même.</div>
                  </div>
                )}

                {o.status === 'quote_sent' && (
                  <div className="oc__quote">
                    <div className="oc__quote-hd">
                      <span className="oc__quote-ico">📩</span>
                      <div>
                        <b>Votre devis final est prêt</b>
                        <p>Prix réels confirmés par composant. Acceptez pour lancer l'assemblage, ou refusez si vous préférez ne pas donner suite.</p>
                      </div>
                      <div className="oc__quote-total">{eur(displayTotal)}</div>
                    </div>
                    <div className="oc__quote-act">
                      <button className="oc-btn oc-btn--ghost" disabled={busy === o.id} onClick={() => void respond(o, false)}>Refuser</button>
                      <button className="oc-btn oc-btn--ind" disabled={busy === o.id} onClick={() => void respond(o, true)}>{busy === o.id ? '…' : 'Accepter le devis'}</button>
                    </div>
                  </div>
                )}

                {o.status === 'refused' && (
                  <div className="oc__banner oc__banner--err"><span className="oc__banner-ico">✕</span><div>Vous avez refusé ce devis. Contactez-nous si vous changez d'avis ou configurez un nouveau PC.</div></div>
                )}

                {showTrack && (
                  <div className="oc__steps">
                    {TRACK.map((s, i) => (
                      <div key={s.value} className={`oc__step ${i <= trackIdx ? 'is-done' : ''}`}>
                        <span className="oc__dot" style={i <= trackIdx ? { background: m.color, borderColor: m.color } : {}} />
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
                      downloadDevis(display, { number: o.id.slice(0, 8).toUpperCase(), date: fmtDate(o.created_at) })
                      toast.success('Devis téléchargé')
                    }}
                  >
                    📄 Devis {isFinal ? 'final' : 'estimatif'}
                  </button>
                </div>

                {isOpen && (
                  <div className="oc__detail">
                    {display.map((it) => (
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
