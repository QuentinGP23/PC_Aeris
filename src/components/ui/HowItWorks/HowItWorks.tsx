import { Container } from '../../layout'
import './HowItWorks.scss'

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

function HowItWorks() {
  return (
    <section className="how-it-works">
      <Container>
        <div className="how-it-works__header">
          <h2 className="how-it-works__title">Comment ça marche ?</h2>
          <p className="how-it-works__subtitle">Configurer son PC n'a jamais été aussi simple.</p>
        </div>

        <div className="how-it-works__steps">
          {STEPS.map((step) => (
            <div key={step.number} className="how-it-works__step">
              <div className="how-it-works__step-number">{step.number}</div>
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
