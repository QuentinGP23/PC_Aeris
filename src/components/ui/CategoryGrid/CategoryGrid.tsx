import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../../types'
import { Container } from '../../layout'
import './CategoryGrid.scss'

const CATEGORY_META: Record<string, { color: string; bg: string; featured?: boolean }> = {
  cpu:         { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  featured: true },
  gpu:         { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   featured: true },
  motherboard: { color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  ram:         { color: '#22c55e', bg: 'rgba(34,197,94,0.08)'  },
  storage:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  psu:         { color: '#ec4899', bg: 'rgba(236,72,153,0.08)' },
  pc_case:     { color: '#14b8a6', bg: 'rgba(20,184,166,0.08)', featured: true },
  cpu_cooler:  { color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', featured: true },
}

function CategoryGrid() {
  return (
    <section className="category-grid">
      <Container>
        <div className="category-grid__header">
          <p className="category-grid__eyebrow">Catalogue complet</p>
          <h2 className="category-grid__title">
            Chaque composant,<br />
            <span className="category-grid__title--gradient">à ta portée.</span>
          </h2>
          <p className="category-grid__subtitle">
            De la carte mère au ventirad — tous les composants pour assembler ton PC.
          </p>
        </div>

        <div className="category-grid__bento">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat.value]
            return (
              <Link
                key={cat.value}
                to="/configurateur"
                className={`category-grid__card${meta.featured ? ' category-grid__card--featured' : ''}`}
                style={{
                  '--cat-color': meta.color,
                  '--cat-bg': meta.bg,
                } as React.CSSProperties}
              >
                <div className="category-grid__card-glow" />
                <span className="category-grid__icon">{cat.icon}</span>
                <div className="category-grid__card-body">
                  <span className="category-grid__label">{cat.label}</span>
                  {meta.featured && (
                    <span className="category-grid__arrow">Explorer →</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default CategoryGrid
