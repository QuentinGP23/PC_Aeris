import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/common'
import { Container } from '../../components/layout'
import './NotFound.scss'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found">
      <Container size="sm">
        <div className="not-found__inner">
          <div className="not-found__code">
            <span className="not-found__digit">4</span>
            <span className="not-found__zero">
              <span className="not-found__zero-ring" />
            </span>
            <span className="not-found__digit">4</span>
          </div>

          <h1 className="not-found__title">Page introuvable</h1>
          <p className="not-found__text">
            Cette page n'existe pas ou a été déplacée.<br />
            Vérifie l'URL ou retourne à l'accueil.
          </p>

          <div className="not-found__actions">
            <Button size="lg" onClick={() => navigate(-1)} variant="outline">
              ← Retour
            </Button>
            <Link to="/">
              <Button size="lg">Accueil</Button>
            </Link>
            <Link to="/configurateur">
              <Button size="lg" variant="ghost">Configurateur</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default NotFound
