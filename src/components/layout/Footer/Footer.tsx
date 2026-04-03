import { Link } from 'react-router-dom'
import { ComputerTower } from '@phosphor-icons/react'
import './Footer.scss'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <ComputerTower size={24} weight="fill" />
            <span>PC Aeris</span>
          </Link>
          <p className="footer__tagline">Le PC sur-mesure, enfin accessible à tous.</p>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <h4 className="footer__col-title">Navigation</h4>
            <Link to="/" className="footer__link">Accueil</Link>
            <Link to="/configurateur" className="footer__link">Configurateur</Link>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Compte</h4>
            <Link to="/signin" className="footer__link">Connexion</Link>
            <Link to="/signup" className="footer__link">Créer un compte</Link>
          </div>
          <div className="footer__col">
            <h4 className="footer__col-title">Légal</h4>
            <Link to="/cgv" className="footer__link">CGV</Link>
            <Link to="/confidentialite" className="footer__link">Politique de confidentialité</Link>
            <Link to="/mentions-legales" className="footer__link">Mentions légales</Link>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} PC Aeris. Tous droits réservés.</p>
      </div>
    </footer>
  )
}
export default Footer
