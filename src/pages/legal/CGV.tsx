import { Link } from 'react-router-dom'
import './legal.scss'

export default function CGV() {
  return (
    <div className="legal-page">
      <div className="legal-page__inner">
        <Link to="/" className="legal-page__back">← Retour à l'accueil</Link>

        <div className="legal-page__header">
          <span className="legal-page__label">Légal</span>
          <h1 className="legal-page__title">Conditions Générales de Vente</h1>
          <p className="legal-page__date">Dernière mise à jour : avril 2026</p>
        </div>

        <div className="legal-page__content">
          <section>
            <h2>1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation du service
              PC Aeris, plateforme de configuration de PC sur mesure accessible à l'adresse
              pc-aeris.fr. En utilisant ce service, vous acceptez les présentes conditions.
            </p>
          </section>

          <section>
            <h2>2. Description du service</h2>
            <p>
              PC Aeris est un outil de configuration et de vérification de compatibilité de
              composants informatiques. Le service est fourni à titre indicatif et ne constitue
              pas une offre de vente directe de matériel informatique.
            </p>
            <p>
              PC Aeris ne vend pas de composants. Les références tarifaires et les disponibilités
              affichées sont données à titre indicatif et peuvent varier.
            </p>
          </section>

          <section>
            <h2>3. Accès au service</h2>
            <p>
              L'accès à la plateforme est gratuit. La création d'un compte permet de sauvegarder
              et partager ses configurations. PC Aeris se réserve le droit de suspendre l'accès
              à tout compte en cas de non-respect des présentes conditions.
            </p>
          </section>

          <section>
            <h2>4. Responsabilité</h2>
            <p>
              PC Aeris s'efforce de fournir des informations de compatibilité exactes mais ne
              saurait être tenu responsable d'erreurs ou d'omissions dans les données affichées.
              Il appartient à l'utilisateur de vérifier la compatibilité finale des composants
              auprès du revendeur.
            </p>
          </section>

          <section>
            <h2>5. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu du site (textes, logos, interface) est la propriété exclusive
              de PC Aeris. Toute reproduction sans autorisation préalable est interdite.
            </p>
          </section>

          <section>
            <h2>6. Droit applicable</h2>
            <p>
              Les présentes CGV sont soumises au droit français. Tout litige sera soumis à la
              compétence des tribunaux français.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
