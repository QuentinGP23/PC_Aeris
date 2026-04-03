import { Link } from 'react-router-dom'
import './legal.scss'

export default function LegalNotice() {
  return (
    <div className="legal-page">
      <div className="legal-page__inner">
        <Link to="/" className="legal-page__back">← Retour à l'accueil</Link>

        <div className="legal-page__header">
          <span className="legal-page__label">Légal</span>
          <h1 className="legal-page__title">Mentions légales</h1>
          <p className="legal-page__date">Dernière mise à jour : avril 2026</p>
        </div>

        <div className="legal-page__content">
          <section>
            <h2>Éditeur du site</h2>
            <p>
              <strong>PC Aeris</strong><br />
              Projet étudiant — Master 2<br />
              Contact : <a href="mailto:contact@pc-aeris.fr">contact@pc-aeris.fr</a>
            </p>
          </section>

          <section>
            <h2>Hébergement</h2>
            <p>
              Le site est hébergé par <strong>Vercel Inc.</strong><br />
              440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
            </p>
            <p>
              La base de données est gérée par <strong>Supabase</strong><br />
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a>
            </p>
          </section>

          <section>
            <h2>Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur le site PC Aeris (textes, images, logos,
              interface graphique) est protégé par le droit d'auteur. Toute reproduction,
              représentation ou diffusion sans autorisation expresse est interdite.
            </p>
          </section>

          <section>
            <h2>Limitation de responsabilité</h2>
            <p>
              PC Aeris met tout en œuvre pour assurer l'exactitude des informations publiées.
              Cependant, le site ne saurait être tenu responsable des erreurs ou omissions,
              ni des dommages résultant de l'utilisation des informations présentées.
            </p>
          </section>

          <section>
            <h2>Droit applicable</h2>
            <p>
              Le présent site est soumis au droit français. Tout litige relatif à son
              utilisation sera de la compétence exclusive des tribunaux français.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
