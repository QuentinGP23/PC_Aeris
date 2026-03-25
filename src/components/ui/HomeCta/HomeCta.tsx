import { Link } from 'react-router-dom'
import { Button } from '../../common'
import { Container } from '../../layout'
import './HomeCta.scss'

function HomeCta() {
  return (
    <section className="home-cta">
      <Container>
        <div className="home-cta__inner">
          <h2 className="home-cta__title">Prêt à construire ton PC ?</h2>
          <p className="home-cta__text">
            Rejoins des milliers d'utilisateurs qui ont déjà configuré leur machine idéale sur PC Aeris.
          </p>
          <div className="home-cta__actions">
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
  )
}

export default HomeCta
