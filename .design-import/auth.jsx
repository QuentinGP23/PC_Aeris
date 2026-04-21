const { useState, useContext } = React

const AUTH_CARDS = [
  { icon:'⚡', name:'Ryzen 9 7950X', cat:'Processeur' },
  { icon:'🎮', name:'RTX 4090 24 GB', cat:'Carte graphique' },
  { icon:'🖥️', name:'Lian Li O11 Dynamic', cat:'Boîtier' },
]

function AuthVisual() {
  return (
    <div className="auth-vis">
      <div className="auth-vis__glow" />
      <div className="auth-vis__inner">
        <div className="auth-vis__big">PC Aeris</div>
        <p className="auth-vis__sub">Configure ton PC idéal,<br />composant par composant.</p>
        <div className="auth-vis__cards">
          {AUTH_CARDS.map(c => (
            <div key={c.name} className="auth-vis__card">
              <div style={{width:36,height:36,borderRadius:9,background:'var(--surface-3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>
                {c.icon}
              </div>
              <div>
                <div style={{fontFamily:'var(--fh)',fontSize:13,fontWeight:600,color:'var(--text)'}}>{c.name}</div>
                <div style={{fontSize:11,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:2}}>{c.cat}</div>
              </div>
              <div style={{marginLeft:'auto',width:20,height:20,borderRadius:'50%',background:'rgba(16,185,129,0.12)',border:'1px solid rgba(16,185,129,0.28)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'var(--ok)',flexShrink:0}}>✓</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AerisSignIn() {
  const { navigate } = useContext(RouterCtx)
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = k => e => { setForm(p => ({ ...p, [k]: e.target.value })); setError(null) }

  const handleSubmit = async () => {
    if (!form.identifier || !form.password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    navigate('home')
  }

  return (
    <div className="auth-page">
      <AuthVisual />
      <div className="auth-form-side">
        <div className="auth-form">
          <h1 className="auth-form__h1">Connexion</h1>
          <p className="auth-form__sub">Bienvenue de retour. Connecte-toi pour accéder à tes configs.</p>
          {error && <div className="auth-err">{error}</div>}
          <div className="fg">
            <label className="fg__l">Email ou pseudo</label>
            <input className="fg__in" type="text" placeholder="exemple@email.com" value={form.identifier} onChange={set('identifier')} />
          </div>
          <div className="fg">
            <label className="fg__l">Mot de passe</label>
            <input className="fg__in" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
          </div>
          <div className="form-row">
            <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--text-2)',cursor:'pointer'}}>
              <input type="checkbox" style={{accentColor:'var(--ind)'}} />
              Se souvenir de moi
            </label>
            <a>Mot de passe oublié ?</a>
          </div>
          <button className="btn btn--ind btn--full" style={{padding:'12px',fontSize:14,borderRadius:10}}
            onClick={handleSubmit} disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <div className="auth-switch">
            Pas encore de compte ? <a onClick={() => navigate('signup')}>Créer un compte</a>
          </div>
        </div>
      </div>
    </div>
  )
}

function AerisSignUp() {
  const { navigate } = useContext(RouterCtx)
  const [form, setForm] = useState({ pseudo: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = k => e => { setForm(p => ({ ...p, [k]: e.target.value })); setError(null) }

  const handleSubmit = async () => {
    if (!form.pseudo || !form.email || !form.password) { setError('Veuillez remplir tous les champs.'); return }
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    navigate('home')
  }

  return (
    <div className="auth-page">
      <AuthVisual />
      <div className="auth-form-side">
        <div className="auth-form">
          <h1 className="auth-form__h1">Créer un compte</h1>
          <p className="auth-form__sub">Rejoins la communauté et sauvegarde tes configurations.</p>
          {error && <div className="auth-err">{error}</div>}
          <div className="fg">
            <label className="fg__l">Pseudo</label>
            <input className="fg__in" type="text" placeholder="supergamer42" value={form.pseudo} onChange={set('pseudo')} />
          </div>
          <div className="fg">
            <label className="fg__l">Email</label>
            <input className="fg__in" type="email" placeholder="exemple@email.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="fg">
            <label className="fg__l">Mot de passe</label>
            <input className="fg__in" type="password" placeholder="8 caractères minimum" value={form.password} onChange={set('password')} />
          </div>
          <div className="fg">
            <label className="fg__l">Confirmer le mot de passe</label>
            <input className="fg__in" type="password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} />
          </div>
          <button className="btn btn--ind btn--full" style={{padding:'12px',fontSize:14,borderRadius:10,marginTop:4}}
            onClick={handleSubmit} disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
          <div className="auth-switch">
            Déjà un compte ? <a onClick={() => navigate('signin')}>Se connecter</a>
          </div>
        </div>
      </div>
    </div>
  )
}

Object.assign(window, { AerisSignIn, AerisSignUp })
