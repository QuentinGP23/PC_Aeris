import { useNavigate } from 'react-router-dom'
import { useCartStore, itemTotal, cartTotal, useToast } from '../../store'
import { CATEGORIES, type CategoryKey } from '../../types'
import { ASSEMBLY_OFFERS, ASSEMBLY_PRICE } from '../../constants'
import './Cart.scss'

const catLabel = (c: CategoryKey) => CATEGORIES.find((x) => x.value === c)?.label ?? c
const eur = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`

function Cart() {
  const navigate = useNavigate()
  const toast = useToast()
  const { items, removeItem, setQuantity, setAssembly, clear } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="cart">
        <h1 className="cart__title">Mon panier</h1>
        <div className="cart__empty">
          <div className="cart__empty-ico">🛒</div>
          <p>Votre panier est vide.</p>
          <div className="cart__empty-actions">
            <button className="btn btn--ind" onClick={() => navigate('/configurateur')}>Configurer un PC</button>
            <button className="btn btn--ghost2" onClick={() => navigate('/configs-pretes')}>Voir les configs prêtes</button>
          </div>
        </div>
      </div>
    )
  }

  const total = cartTotal(items)
  const componentsTotal = items.reduce((a, i) => a + i.componentsPrice * i.quantity, 0)
  const assemblyTotal = items.reduce((a, i) => a + ASSEMBLY_PRICE[i.assembly] * i.quantity, 0)

  return (
    <div className="cart">
      <div className="cart__hd">
        <h1 className="cart__title">Mon panier</h1>
        <button className="cart__clear" onClick={clear}>Vider le panier</button>
      </div>

      <div className="cart__grid">
        <div className="cart__list">
          {items.map((item) => {
            const filled = item.lines.length
            return (
              <article key={item.id} className="ci">
                <div className="ci__hd">
                  <div>
                    <h2 className="ci__name">{item.name}</h2>
                    <span className="ci__count">{filled}/{CATEGORIES.length} composants</span>
                  </div>
                  <button className="ci__rm" onClick={() => removeItem(item.id)} aria-label="Retirer">✕</button>
                </div>

                <ul className="ci__lines">
                  {item.lines.map((l) => (
                    <li key={l.category}>
                      <span className="ci__cat">{catLabel(l.category)}</span>
                      <span className="ci__pname">{l.name}</span>
                      <span className="ci__price">{l.price != null ? eur(l.price) : '—'}</span>
                    </li>
                  ))}
                </ul>

                <div className="ci__assembly">
                  <span className="ci__assembly-l">Offre de montage</span>
                  <div className="ci__offers">
                    {ASSEMBLY_OFFERS.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        className={`ci__offer ${item.assembly === o.id ? 'is-on' : ''}`}
                        onClick={() => setAssembly(item.id, o.id)}
                        title={o.desc}
                      >
                        <b>{o.name}</b>
                        <span>{o.price} €</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ci__ft">
                  <div className="ci__qty">
                    <button onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Diminuer">−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Augmenter">+</button>
                  </div>
                  <div className="ci__total">{eur(itemTotal(item))}</div>
                </div>
              </article>
            )
          })}
        </div>

        <aside className="cart__sum">
          <h3>Récapitulatif</h3>
          <div className="cart__row"><span>Composants</span><span>{eur(componentsTotal)}</span></div>
          <div className="cart__row"><span>Montage</span><span>{eur(assemblyTotal)}</span></div>
          <div className="cart__row cart__row--total"><span>Total</span><span>{eur(total)}</span></div>
          <p className="cart__note">Les composants sont facturés au meilleur prix du marché. Les prix manquants seront confirmés au sourcing.</p>
          <button className="btn btn--ind btn--full" onClick={() => navigate('/commande')}>Passer commande →</button>
          <button className="btn btn--ghost2 btn--full" onClick={() => { toast.info('Panier conservé'); navigate('/configurateur') }}>Continuer mes achats</button>
        </aside>
      </div>
    </div>
  )
}

export default Cart
