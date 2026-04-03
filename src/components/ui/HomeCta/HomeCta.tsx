import { Link } from 'react-router-dom'
import { Button } from '../../common'
import { Container } from '../../layout'
import './HomeCta.scss'

function HomeCta() {
  return (
    <section className="home-cta">
      <Container>
        <div className="home-cta__inner">
          <span className="home-cta__eyebrow">Gratuit · Sans inscription</span>
          <h2 className="home-cta__title">
            Prêt à assembler<br />
            <span>ton PC idéal ?</span>
          </h2>
          <p className="home-cta__text">
            Rejoins des milliers d'utilisateurs qui ont déjà configuré leur machine sur PC Aeris.
            Aucune carte bancaire requise.
          </p>
          <div className="home-cta__actions">
            <Link to="/configurateur">
              <Button size="lg">Configurer mon PC →</Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline">Créer un compte</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default HomeCta
