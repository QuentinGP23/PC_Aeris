import { Link } from 'react-router-dom'
import './legal.scss'

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-page__inner">
        <Link to="/" className="legal-page__back">← Retour à l'accueil</Link>

        <div className="legal-page__header">
          <span className="legal-page__label">Légal</span>
          <h1 className="legal-page__title">Politique de confidentialité</h1>
          <p className="legal-page__date">Dernière mise à jour : avril 2026</p>
        </div>

        <div className="legal-page__content">
          <section>
            <h2>1. Responsable du traitement</h2>
            <p>
              PC Aeris est responsable du traitement des données personnelles collectées via
              la plateforme. Pour toute question relative à vos données, contactez-nous à
              l'adresse : <a href="mailto:contact@pc-aeris.fr">contact@pc-aeris.fr</a>.
            </p>
          </section>

          <section>
            <h2>2. Données collectées</h2>
            <p>Nous collectons les données suivantes lors de la création d'un compte :</p>
            <ul>
              <li>Adresse email</li>
              <li>Pseudo</li>
              <li>Prénom et nom (optionnels)</li>
              <li>Numéro de téléphone (optionnel)</li>
            </ul>
            <p>
              Des données de navigation (pages visitées, configurations créées) peuvent être
              collectées à des fins d'amélioration du service.
            </p>
          </section>

          <section>
            <h2>3. Finalités du traitement</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Gérer votre compte et authentification</li>
              <li>Sauvegarder et retrouver vos configurations</li>
              <li>Améliorer le service</li>
              <li>Vous contacter en cas de besoin</li>
            </ul>
          </section>

          <section>
            <h2>4. Conservation des données</h2>
            <p>
              Vos données sont conservées tant que votre compte est actif. En cas de suppression
              de votre compte, vos données sont effacées dans un délai de 30 jours.
            </p>
          </section>

          <section>
            <h2>5. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification,
              d'effacement et de portabilité de vos données. Pour exercer ces droits, écrivez
              à <a href="mailto:contact@pc-aeris.fr">contact@pc-aeris.fr</a>.
            </p>
          </section>

          <section>
            <h2>6. Hébergement</h2>
            <p>
              Les données sont hébergées via Supabase (infrastructure cloud sécurisée). Aucune
              donnée n'est revendue à des tiers.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
