import { Link } from 'react-router-dom'
import { Button } from '../components/common'
import { Container } from '../components/layout'
import { HeroBanner } from '../components/ui'
import { CATEGORIES } from '../types'
import './Home.scss'

const STEPS = [
  {
    number: '01',
    title: 'Choisis tes composants',
    description: 'Parcours notre catalogue de plus de 25 000 composants et sélectionne ceux qui correspondent à tes besoins et ton budget.',
  },
  {
    number: '02',
    title: 'La compatibilité est vérifiée',
    description: 'Notre moteur de compatibilité vérifie en temps réel que tous tes composants fonctionnent ensemble : socket, RAM, boîtier, ventirad…',
  },
  {
    number: '03',
    title: 'Ta config est prête',
    description: 'Exporte ou sauvegarde ta configuration. Commande les pièces ou fais-la assembler par nos experts.',
  },
]

const STATS = [
  { value: '25 000+', label: 'Composants référencés' },
  { value: '8',       label: 'Catégories de pièces' },
  { value: '100%',    label: 'Compatibilité vérifiée' },
  { value: '0€',      label: 'Accès gratuit' },
]

const CATEGORY_COLORS: Record<string, string> = {
  cpu:        '#3b82f6',
  gpu:        '#ef4444',
  ram:        '#22c55e',
  motherboard:'#6366f1',
  storage:    '#f59e0b',
  psu:        '#ec4899',
  pc_case:    '#14b8a6',
  cpu_cooler: '#8b5cf6',
}

function Home() {
  return (
    <div className="home">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <HeroBanner />

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <section className="home__section home__section--light">
        <Container>
          <div className="home__section-header">
            <h2 className="home__section-title">Tous les composants</h2>
            <p className="home__section-subtitle">
              De la carte mère au ventirad, configure chaque pièce de ton PC à la carte.
            </p>
          </div>
          <div className="home__categories">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                to={`/configurateur`}
                className="home__category-card"
                style={{ '--cat-color': CATEGORY_COLORS[cat.value] } as React.CSSProperties}
              >
                <span className="home__category-icon">{cat.icon}</span>
                <span className="home__category-label">{cat.label}</span>
                <span className="home__category-arrow">→</span>
              </Link>
            ))}
          </div>
          <div className="home__categories-cta">
            <Link to="/configurateur">
              <Button size="lg">Démarrer ma configuration</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="home__section home__section--dark">
        <Container>
          <div className="home__section-header home__section-header--light">
            <h2 className="home__section-title home__section-title--light">Comment ça marche ?</h2>
            <p className="home__section-subtitle home__section-subtitle--light">
              Configurer son PC n'a jamais été aussi simple.
            </p>
          </div>
          <div className="home__steps">
            {STEPS.map((step) => (
              <div key={step.number} className="home__step">
                <div className="home__step-number">{step.number}</div>
                <div className="home__step-content">
                  <h3 className="home__step-title">{step.title}</h3>
                  <p className="home__step-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="home__section home__section--primary">
        <Container>
          <div className="home__stats">
            {STATS.map((s) => (
              <div key={s.label} className="home__stat">
                <span className="home__stat-value">{s.value}</span>
                <span className="home__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="home__section home__section--light">
        <Container>
          <div className="home__cta">
            <h2 className="home__cta-title">Prêt à construire ton PC ?</h2>
            <p className="home__cta-text">
              Rejoins des milliers d'utilisateurs qui ont déjà configuré leur machine idéale sur PC Aeris.
            </p>
            <div className="home__cta-actions">
              <Link to="/configurateur">
                <Button size="lg">Configurer mon PC</Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline">Créer un compte</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default Home
