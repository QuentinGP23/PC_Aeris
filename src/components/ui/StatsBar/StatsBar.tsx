import { Container } from '../../layout'
import './StatsBar.scss'

const STATS = [
  { value: '25 000+', label: 'Composants référencés' },
  { value: '8',       label: 'Catégories de pièces' },
  { value: '100%',    label: 'Compatibilité vérifiée' },
  { value: '0€',      label: 'Accès gratuit' },
]

function StatsBar() {
  return (
    <section className="stats-bar">
      <Container>
        <div className="stats-bar__grid">
          {STATS.map((s) => (
            <div key={s.label} className="stats-bar__stat">
              <span className="stats-bar__value">{s.value}</span>
              <span className="stats-bar__label">{s.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default StatsBar
