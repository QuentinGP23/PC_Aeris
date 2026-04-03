import { Link } from 'react-router-dom'
import { Button } from '../../common'
import './HeroBanner.scss'

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-banner__glow" />

      <div className="hero-banner__content">
        <div className="hero-banner__badge">
          <span className="hero-banner__badge-dot" />
          Compatibilité vérifiée en temps réel
        </div>

        <h1 className="hero-banner__title">
          Configure ton PC
          <br />
          <span className="hero-banner__title--gradient">composant par composant.</span>
        </h1>

        <p className="hero-banner__subtitle">
          25&nbsp;000+ pièces référencées. Zéro erreur de compatibilité.
          Trouve ta config idéale en quelques minutes.
        </p>

        <div className="hero-banner__actions">
          <Link to="/configurateur">
            <Button size="lg">Démarrer la config →</Button>
          </Link>
          <Link to="/signup">
            <Button size="lg" variant="ghost">Créer un compte</Button>
          </Link>
        </div>

        <div className="hero-banner__stats">
          <div className="hero-banner__stat"><strong>25k+</strong> composants</div>
          <div className="hero-banner__stat-sep" />
          <div className="hero-banner__stat"><strong>8</strong> catégories</div>
          <div className="hero-banner__stat-sep" />
          <div className="hero-banner__stat"><strong>100%</strong> gratuit</div>
        </div>
      </div>

      <div className="hero-banner__visual">
        <div className="hero-banner__card hero-banner__card--cpu">
          <span className="hero-banner__card-icon">🖥️</span>
          <div className="hero-banner__card-info">
            <span className="hero-banner__card-name">Intel Core i9-14900K</span>
            <span className="hero-banner__card-tag">Processeur · LGA1700</span>
          </div>
          <span className="hero-banner__card-check">✓</span>
        </div>
        <div className="hero-banner__card hero-banner__card--gpu">
          <span className="hero-banner__card-icon">🎮</span>
          <div className="hero-banner__card-info">
            <span className="hero-banner__card-name">RTX 4080 Super</span>
            <span className="hero-banner__card-tag">Carte graphique · 16 GB</span>
          </div>
          <span className="hero-banner__card-check">✓</span>
        </div>
        <div className="hero-banner__card hero-banner__card--ram">
          <span className="hero-banner__card-icon">💾</span>
          <div className="hero-banner__card-info">
            <span className="hero-banner__card-name">DDR5 32 GB 6000 MHz</span>
            <span className="hero-banner__card-tag">RAM · 2×16 GB</span>
          </div>
          <span className="hero-banner__card-check">✓</span>
        </div>
        <div className="hero-banner__compat">
          <span className="hero-banner__compat-dot" />
          Tous les composants sont compatibles
        </div>
      </div>
    </section>
  )
}
