const AUTH_CARDS = [
  { icon: '⚡', name: 'Ryzen 9 7950X', cat: 'Processeur' },
  { icon: '🎮', name: 'RTX 4090 24 GB', cat: 'Carte graphique' },
  { icon: '🖥️', name: 'Lian Li O11 Dynamic', cat: 'Boîtier' },
]

export function AuthVisual() {
  return (
    <div className="auth-vis">
      <div className="auth-vis__glow" />
      <div className="auth-vis__inner">
        <div className="auth-vis__big">PC Aeris</div>
        <p className="auth-vis__sub">
          Configure ton PC idéal,<br />composant par composant.
        </p>
        <div className="auth-vis__cards">
          {AUTH_CARDS.map(c => (
            <div key={c.name} className="auth-vis__card">
              <div className="auth-vis__card-ico">{c.icon}</div>
              <div>
                <div className="auth-vis__card-name">{c.name}</div>
                <div className="auth-vis__card-cat">{c.cat}</div>
              </div>
              <div className="auth-vis__card-check">✓</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
