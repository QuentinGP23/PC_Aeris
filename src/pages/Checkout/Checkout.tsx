import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore, cartTotal, cartCount, useToast } from '../../store'
import { useAuth } from '../../context/useAuth'
import { ordersService, type ShippingAddress } from '../../services'
import { downloadDevis, devisBase64 } from '../../utils/devis'
import './Checkout.scss'

const eur = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`
const empty: ShippingAddress = { fullName: '', address: '', zip: '', city: '', phone: '' }

function Checkout() {
  const navigate = useNavigate()
  const toast = useToast()
  const { isAuthenticated } = useAuth()
  const { items, clear } = useCartStore()

  const [ship, setShip] = useState<ShippingAddress>(empty)
  const [submitting, setSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const total = cartTotal(items)
  const set = (k: keyof ShippingAddress) => (e: ChangeEvent<HTMLInputElement>) =>
    setShip((s) => ({ ...s, [k]: e.target.value }))

  const valid =
    ship.fullName.trim() && ship.address.trim() && /^\d{5}$/.test(ship.zip.trim()) && ship.city.trim() && ship.phone.trim().length >= 8

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!valid) {
      toast.error('Merci de compléter correctement tous les champs (code postal à 5 chiffres).')
      return
    }
    setSubmitting(true)
    const { id, error } = await ordersService.create(items, total, ship)
    if (error || !id) {
      setSubmitting(false)
      toast.error(error ?? 'Erreur lors de la commande')
      return
    }
    // Devis : téléchargement immédiat pour le client + envoi par email (client + admins).
    const info = { number: id.slice(0, 8).toUpperCase(), date: new Date().toLocaleDateString('fr-FR'), client: ship.fullName }
    try { downloadDevis(items, info) } catch { /* ignore */ }
    void ordersService.emailDevis({ orderId: id, clientName: ship.fullName, total, pdfBase64: devisBase64(items, info) })
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

  return (
    <div className="ck">
      <h1 className="ck__title">Finaliser la commande</h1>

      <form className="ck__grid" onSubmit={handleSubmit}>
        <div className="ck__main">
          <section className="ck__card">
            <h2>Adresse de livraison</h2>
            <div className="ck__fields">
              <label className="ck__field ck__field--full">
                <span>Nom complet</span>
                <input value={ship.fullName} onChange={set('fullName')} placeholder="Jean Dupont" />
              </label>
              <label className="ck__field ck__field--full">
                <span>Adresse</span>
                <input value={ship.address} onChange={set('address')} placeholder="12 rue des Lilas" />
              </label>
              <label className="ck__field">
                <span>Code postal</span>
                <input value={ship.zip} onChange={set('zip')} placeholder="75011" inputMode="numeric" maxLength={5} />
              </label>
              <label className="ck__field">
                <span>Ville</span>
                <input value={ship.city} onChange={set('city')} placeholder="Paris" />
              </label>
              <label className="ck__field ck__field--full">
                <span>Téléphone</span>
                <input value={ship.phone} onChange={set('phone')} placeholder="06 12 34 56 78" inputMode="tel" />
              </label>
            </div>
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
          <button type="submit" className="ck-btn ck-btn--ind ck-btn--full" disabled={submitting}>
            {submitting ? 'Envoi…' : 'Demander mon devis'}
          </button>
          <button type="button" className="ck-btn ck-btn--ghost ck-btn--full" onClick={() => navigate('/panier')}>Retour au panier</button>
        </aside>
      </form>
    </div>
  )
}

export default Checkout
