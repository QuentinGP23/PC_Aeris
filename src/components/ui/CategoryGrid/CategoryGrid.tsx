import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../../types'
import { Button } from '../../common'
import { Container } from '../../layout'
import './CategoryGrid.scss'

const CATEGORY_COLORS: Record<string, string> = {
  cpu:         '#3b82f6',
  gpu:         '#ef4444',
  ram:         '#22c55e',
  motherboard: '#6366f1',
  storage:     '#f59e0b',
  psu:         '#ec4899',
  pc_case:     '#14b8a6',
  cpu_cooler:  '#8b5cf6',
}

function CategoryGrid() {
  return (
    <section className="category-grid">
      <Container>
        <div className="category-grid__header">
          <h2 className="category-grid__title">Tous les composants</h2>
          <p className="category-grid__subtitle">
            De la carte mère au ventirad, configure chaque pièce de ton PC à la carte.
          </p>
        </div>

        <div className="category-grid__grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              to="/configurateur"
              className="category-grid__card"
              style={{ '--cat-color': CATEGORY_COLORS[cat.value] } as React.CSSProperties}
            >
              <span className="category-grid__icon">{cat.icon}</span>
              <span className="category-grid__label">{cat.label}</span>
              <span className="category-grid__arrow">→</span>
            </Link>
          ))}
        </div>

        <div className="category-grid__cta">
          <Link to="/configurateur">
            <Button size="lg">Démarrer ma configuration</Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}

export default CategoryGrid
