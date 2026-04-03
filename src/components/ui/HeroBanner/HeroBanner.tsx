import { Link } from 'react-router-dom'
import { Button } from '../../common'
import { Container } from '../../layout'
import { useConfigStore } from '../../../store'
import { CATEGORIES } from '../../../types'
import './HeroBanner.scss'

const CARD_MODIFIERS = ['cpu', 'gpu', 'ram'] as const

export default function HeroBanner() {
  const config = useConfigStore((s) => s.config)
  const configEntries = Object.entries(config) as [string, { name: string; category: string }][]
  const hasConfig = configEntries.length > 0
  const visibleItems = configEntries.slice(0, 3)

  return (
    <section className="hero-banner">
      <div className="hero-banner__glow" />

      <Container size="xl" className="hero-banner__inner">
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
            <Button size="lg">{hasConfig ? 'Continuer ma config →' : 'Démarrer la config →'}</Button>
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
        {hasConfig ? (
          <>
            {visibleItems.map(([catKey, product], i) => {
              const category = CATEGORIES.find((c) => c.value === catKey)
              return (
                <div
                  key={catKey}
                  className={`hero-banner__card hero-banner__card--${CARD_MODIFIERS[i]}`}
                >
                  <span className="hero-banner__card-icon">{category?.icon ?? '🔧'}</span>
                  <div className="hero-banner__card-info">
                    <span className="hero-banner__card-name">{product.name}</span>
                    <span className="hero-banner__card-tag">{category?.label ?? catKey}</span>
                  </div>
                  <span className="hero-banner__card-check">✓</span>
                </div>
              )
            })}
            <div className="hero-banner__compat">
              <span className="hero-banner__compat-dot" />
              {configEntries.length === 1
                ? '1 composant sélectionné'
                : `${configEntries.length} composants sélectionnés`}
            </div>
          </>
        ) : (
          <div className="hero-banner__empty">
            <span className="hero-banner__empty-icon">⚙️</span>
            <p className="hero-banner__empty-text">Ta configuration apparaîtra ici</p>
            <Link to="/configurateur" className="hero-banner__empty-link">
              Commencer →
            </Link>
          </div>
        )}
      </div>
      </Container>
    </section>
  )
}
