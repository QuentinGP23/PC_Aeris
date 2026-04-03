import { Container } from '../../layout'
import './HowItWorks.scss'

const STEPS = [
  {
    number: '01',
    title: 'Choisis tes composants',
    description: 'Parcours 25 000+ composants et filtre par catégorie, marque ou budget. Chaque pièce est documentée et à jour.',
  },
  {
    number: '02',
    title: 'Compatibilité automatique',
    description: 'Notre moteur vérifie en temps réel socket, type de RAM, dimensions boîtier et ventirad. Zéro mauvaise surprise.',
  },
  {
    number: '03',
    title: 'Config prête à commander',
    description: 'Exporte ou sauvegarde ta configuration. Toutes les pièces sont listées, il ne reste qu\'à passer commande.',
  },
]

function HowItWorks() {
  return (
    <section className="how-it-works">
      <Container>
        <div className="how-it-works__header">
          <span className="how-it-works__eyebrow">Simple comme bonjour</span>
          <h2 className="how-it-works__title">Comment ça marche ?</h2>
          <p className="how-it-works__subtitle">
            Trois étapes pour passer de zéro à une config complète et compatible.
          </p>
        </div>

        <div className="how-it-works__steps">
          {STEPS.map((step) => (
            <div key={step.number} className="how-it-works__step">
              <div className="how-it-works__step-number">
                <span>{step.number}</span>
              </div>
              <div className="how-it-works__step-content">
                <h3 className="how-it-works__step-title">{step.title}</h3>
                <p className="how-it-works__step-desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default HowItWorks
