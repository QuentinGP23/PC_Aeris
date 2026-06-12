import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore, cartTotal, cartCount, useToast } from '../../store'
import { useAuth } from '../../context/useAuth'
import { ordersService, addressesService, type ShippingAddress, type Address, type AddressInput } from '../../services'
import { AddressFields, emptyAddress, validateAddress } from '../../components/common'
import { downloadDevis, devisBase64 } from '../../utils/devis'
import './Checkout.scss'

const eur = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`

function Checkout() {
  const navigate = useNavigate()
  const toast = useToast()
  const { isAuthenticated } = useAuth()
  const { items, clear } = useCartStore()

  const [addresses, setAddresses] = useState<Address[] | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AddressInput>(emptyAddress)
  const [formErr, setFormErr] = useState<string | null>(null)
  const [savingAddr, setSavingAddr] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const total = cartTotal(items)

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    void addressesService.list().then(({ data }) => {
      if (cancelled) return
      setAddresses(data)
      if (data.length > 0) setSelectedId((cur) => cur ?? data[0].id)
      else setShowForm(true)
    })
    return () => { cancelled = true }
  }, [isAuthenticated])

  const saveAddress = async () => {
    const v = validateAddress(form)
    if (v) { setFormErr(v); return }
    setSavingAddr(true)
    const { data, error } = await addressesService.create(form)
    setSavingAddr(false)
    if (error || !data) { setFormErr(error ?? 'Erreur lors de l\'enregistrement.'); return }
    const { data: fresh } = await addressesService.list()
    setAddresses(fresh)
    setSelectedId(data.id)
    setShowForm(false)
    setForm(emptyAddress)
    setFormErr(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const selected = addresses?.find((a) => a.id === selectedId)
    if (!selected) { toast.error('Choisissez une adresse de livraison.'); return }
    setSubmitting(true)
    const ship: ShippingAddress = {
      fullName: selected.fullName, address: selected.address, zip: selected.zip, city: selected.city, phone: selected.phone,
    }
    const { id, error } = await ordersService.create(items, total, ship)
    if (error || !id) {
      setSubmitting(false)
      toast.error(error ?? 'Erreur lors de la commande')
      return
    }
    const info = { number: id.slice(0, 8).toUpperCase(), date: new Date().toLocaleDateString('fr-FR'), client: selected.fullName }
    try { downloadDevis(items, info) } catch { /* ignore */ }
    void ordersService.emailDevis({ orderId: id, clientName: selected.fullName, total, pdfBase64: devisBase64(items, info) })
    setSubmitting(false)
    clear()
    setOrderId(id)
  }

  // ── Confirmation ──
  if (orderId) {
    return (
      <div className="ck ck--center">
        <div className="ck__done">
          <div className="ck__done-ico">✓</div>
          <h1>Demande enregistrée&nbsp;!</h1>
          <p>Merci&nbsp;! Votre demande <b>#{orderId.slice(0, 8).toUpperCase()}</b> a bien été reçue. Vous allez recevoir un premier devis estimatif par email.</p>
          <p className="ck__done-sub">Notre équipe vérifie ensuite le prix réel de chaque composant et le meilleur vendeur, puis vous renvoie un <b>devis final</b> à <b>accepter ou refuser</b> depuis « Mes commandes ».</p>
          <div className="ck__done-actions">
            <button className="ck-btn ck-btn--ind" onClick={() => navigate('/configurateur')}>Configurer un autre PC</button>
            <button className="ck-btn ck-btn--ghost" onClick={() => navigate('/')}>Retour à l'accueil</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Panier vide ──
  if (items.length === 0) {
    return (
      <div className="ck ck--center">
        <div className="ck__empty">
          <p>Votre panier est vide.</p>
          <button className="ck-btn ck-btn--ind" onClick={() => navigate('/configurateur')}>Configurer un PC</button>
        </div>
      </div>
    )
  }

  // ── Non connecté ──
  if (!isAuthenticated) {
    return (
      <div className="ck ck--center">
        <div className="ck__empty">
          <p>Connectez-vous pour finaliser votre commande.</p>
          <div className="ck__done-actions">
            <Link className="ck-btn ck-btn--ind" to="/signin">Se connecter</Link>
            <Link className="ck-btn ck-btn--ghost" to="/signup">Créer un compte</Link>
          </div>
        </div>
      </div>
    )
  }

  const hasAddresses = (addresses?.length ?? 0) > 0

  return (
    <div className="ck">
      <h1 className="ck__title">Finaliser la commande</h1>

      <form className="ck__grid" onSubmit={handleSubmit}>
        <div className="ck__main">
          <section className="ck__card">
            <div className="ck__card-hd">
              <h2>Adresse de livraison</h2>
              {hasAddresses && !showForm && (
                <button type="button" className="ck__addnew" onClick={() => { setForm(emptyAddress); setFormErr(null); setShowForm(true) }}>
                  + Ajouter une adresse
                </button>
              )}
            </div>

            {addresses === null ? (
              <p className="ck__muted">Chargement de vos adresses…</p>
            ) : (
              <>
                {hasAddresses && !showForm && (
                  <div className="ck__addr-list">
                    {addresses.map((a) => (
                      <label key={a.id} className={`ck__addr ${selectedId === a.id ? 'is-selected' : ''}`}>
                        <input type="radio" name="addr" checked={selectedId === a.id} onChange={() => setSelectedId(a.id)} />
                        <span className="ck__addr-body">
                          <span className="ck__addr-top">
                            <b>{a.label || 'Adresse'}</b>
                            {a.isDefault && <span className="ck__addr-badge">Par défaut</span>}
                          </span>
                          <span className="ck__addr-name">{a.fullName}</span>
                          <span className="ck__addr-lines">{a.address}, {a.zip} {a.city}</span>
                          <span className="ck__addr-phone">{a.phone}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {(showForm || !hasAddresses) && (
                  <div className="ck__form">
                    {!hasAddresses && <p className="ck__muted">Vous n'avez pas encore d'adresse enregistrée. Ajoutez-en une — elle sera disponible pour vos prochaines commandes.</p>}
                    {formErr && <p className="ck__err">{formErr}</p>}
                    <AddressFields value={form} onChange={setForm} />
                    <div className="ck__form-actions">
                      {hasAddresses && <button type="button" className="ck-btn ck-btn--ghost" onClick={() => { setShowForm(false); setFormErr(null) }}>Annuler</button>}
                      <button type="button" className="ck-btn ck-btn--ind" onClick={() => { void saveAddress() }} disabled={savingAddr}>
                        {savingAddr ? 'Enregistrement…' : 'Enregistrer cette adresse'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          <section className="ck__card">
            <h2>Comment ça marche</h2>
            <div className="ck__pay">
              <span className="ck__pay-ico">📝</span>
              <div>
                <b>Devis, pas de paiement maintenant</b>
                <p>Les prix affichés sont <b>estimatifs</b>. Après validation, notre équipe confirme le prix réel de chaque composant et le meilleur vendeur, puis vous renvoie un <b>devis final</b>. Vous l'acceptez (ou non) avant tout paiement.</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="ck__sum">
          <h3>Votre commande</h3>
          <div className="ck__items">
            {items.map((i) => (
              <div className="ck__line" key={i.id}>
                <span>{i.quantity} × {i.name}</span>
                <span>{eur((i.componentsPrice + ({ essentiel: 79, confort: 129, premium: 199 } as const)[i.assembly]) * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="ck__row ck__row--total"><span>Total ({cartCount(items)} PC)</span><span>{eur(total)}</span></div>
          <button type="submit" className="ck-btn ck-btn--ind ck-btn--full" disabled={submitting || !selectedId}>
            {submitting ? 'Envoi…' : 'Demander mon devis'}
          </button>
          {!selectedId && hasAddresses && <p className="ck__hint">Sélectionnez une adresse de livraison.</p>}
          <button type="button" className="ck-btn ck-btn--ghost ck-btn--full" onClick={() => navigate('/panier')}>Retour au panier</button>
        </aside>
      </form>
    </div>
  )
}

export default Checkout
