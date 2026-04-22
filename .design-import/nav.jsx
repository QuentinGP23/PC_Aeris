const { useContext } = React

function AerisNav({ config }) {
  const { page, navigate } = useContext(RouterCtx)
  const selectedCount = Object.keys(config || {}).length

  return (
    <nav className="nav">
      <div className="nav__inner">
        <div className="nav__logo" onClick={() => navigate('home')}>
          <div className="nav__logo-mark">⚡</div>
          PC Aeris
        </div>
        <div className="nav__links">
          {[['home','Accueil'],['configurator','Configurateur']].map(([p,l]) => (
            <button key={p} className={`nav__link ${page===p?'nav__link--active':''}`} onClick={() => navigate(p)}>{l}</button>
          ))}
        </div>
        <div className="nav__gap" />
        <div className="nav__actions">
          {selectedCount > 0 && (
            <div className="nav-config-badge" onClick={() => navigate('configurator')}>
              <div className="nav-config-badge__dot" />
              {selectedCount} composant{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
            </div>
          )}
          <button className="btn-ghost" onClick={() => navigate('signin')}>Connexion</button>
          <button className="btn-primary" onClick={() => navigate('signup')}>Créer un compte</button>
        </div>
      </div>
    </nav>
  )
}

function AerisFooter() {
  const { navigate } = useContext(RouterCtx)
  return (
    <footer className="footer">
      <div className="c">
        <div className="footer__inner">
          <div className="footer__logo">
            <span style={{width:20,height:20,background:'var(--ind)',borderRadius:6,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:11}}>⚡</span>
            PC Aeris
          </div>
          <div className="footer__links">
            {['Mentions légales','CGV','Confidentialité'].map(l => (
              <span key={l} className="footer__link">{l}</span>
            ))}
          </div>
          <div className="footer__copy">© 2026 PC Aeris. Tous droits réservés.</div>
        </div>
      </div>
    </footer>
  )
}

Object.assign(window, { AerisNav, AerisFooter })
