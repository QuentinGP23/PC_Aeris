import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.scss'

type TermRow = { k?: string; v?: string; style?: 'ok' | 'dim' | 'ind' }

const TERM_ROWS: TermRow[] = [
  { k: 'STATUS', v: 'ONLINE', style: 'ok' },
  { k: 'BUILD', v: 'v2.6.1 — Avril 2026', style: 'dim' },
  {},
  { k: 'CPU', v: 'AMD Ryzen 9 7950X' },
  { k: 'GPU', v: 'NVIDIA RTX 4090 24G' },
  { k: 'RAM', v: '32 GB DDR5-6400 CL32' },
  { k: 'STORAGE', v: '2 TB PCIe 4.0 NVMe' },
  { k: 'PSU', v: '1 000W 80+ Gold' },
  {},
  { k: 'COMPAT', v: '✓ ALL SYSTEMS GO', style: 'ok' },
  { k: 'PRIX', v: '~2 850 €', style: 'ind' },
]

function Terminal() {
  const [visible, setVisible] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setVisible(i)
      if (i >= TERM_ROWS.length) {
        clearInterval(id)
        setDone(true)
      }
    }, 220)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="terminal rv">
      <div className="terminal__bar">
        <span className="t-dot" style={{ background: '#FF5F56' }} />
        <span className="t-dot" style={{ background: '#FFBD2E' }} />
        <span className="t-dot" style={{ background: '#27C93F' }} />
        <span className="terminal__label">system.config</span>
      </div>
      <div className="terminal__body">
        {TERM_ROWS.map((row, i) => {
          if (!row.k) {
            return (
              <div
                key={`sep-${i}`}
                className="t-sep"
                style={{ opacity: i < visible ? 1 : 0, transition: 'opacity 0.3s' }}
              />
            )
          }
          const cls =
            row.style === 'ok' ? 't-v--ok' :
            row.style === 'ind' ? 't-v--ind' :
            row.style === 'dim' ? 't-v--dim' : ''
          return (
            <div
              key={`row-${i}`}
              className={`t-row ${i < visible ? 'in' : ''}`}
              style={{ transitionDelay: `${i * 0.03}s` }}
            >
              <span className="t-k">{row.k}</span>
              <span className={`t-v ${cls}`}>{row.v}</span>
            </div>
          )
        })}
        {done && <span className="t-cursor" />}
      </div>
    </div>
  )
}

function Hero() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="hero">
      <div className="hero__grid" />
      <div className="hero__vignette" />
      <div className="hero__glow" />
      <div className="hero__glow2" />
      <div className="c hero__wrap">
        <div className="hero__inner">
          <div className="hero__left">
            <div className={`hero__tag rv ${ready ? 'in' : ''}`}>
              <span className="hero__tag-dot" />
              Compatibilité temps réel
            </div>

            <h1 className="hero__h1">
              <span className="hero__h1-line clip-wrap">
                <span className={`hero__h1-word clip-in ${ready ? 'go' : ''}`}>CONFIGURE</span>
              </span>
              <span className="hero__h1-line clip-wrap">
                <span
                  className={`hero__h1-word hero__h1-word--stroke clip-in ${ready ? 'go' : ''}`}
                  style={{ transitionDelay: '0.12s' }}
                >
                  TON PC.
                </span>
              </span>
              <span className="hero__h1-line clip-wrap" style={{ marginTop: 8 }}>
                <span
                  className={`hero__h1-word hero__h1-word--sm clip-in ${ready ? 'go' : ''}`}
                  style={{ transitionDelay: '0.24s' }}
                >
                  COMPOSANT PAR COMPOSANT.
                </span>
              </span>
            </h1>

            <p className={`hero__sub rv rv-d4 ${ready ? 'in' : ''}`}>
              25 000+ pièces référencées. Zéro erreur de compatibilité.
              Trouve ta configuration idéale en quelques minutes.
            </p>

            <div className={`hero__cta-row rv rv-d5 ${ready ? 'in' : ''}`}>
              <Link to="/configurateur" className="hero__cta" data-hover>
                Démarrer la config
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                  <path d="M3 7.5h9M9 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link to="/configurateur" className="hero__secondary">
                ↓ VOIR LES COMPOSANTS
              </Link>
            </div>

            <div className={`hero__stats-row rv rv-d6 ${ready ? 'in' : ''}`}>
              {[['25 000+', 'Composants'], ['8', 'Catégories'], ['100%', 'Gratuit']].map(([n, l]) => (
                <div key={l} className="hero__stat">
                  <span className="hero__stat-n">{n}</span>
                  <span className="hero__stat-l">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <Terminal />
        </div>
      </div>
    </section>
  )
}

const TICKS: [string, string][] = [
  ['25 000+', 'composants référencés'],
  ['8', 'catégories'],
  ['100%', 'gratuit'],
  ['142k', 'configs créées'],
  ['48', 'marques partenaires'],
  ['3 200', 'mises à jour / semaine'],
  ['AM5', 'socket supporté'],
  ['DDR5', 'mémoire supportée'],
  ['PCIe 5.0', 'standard'],
]

function Ticker() {
  const all = [...TICKS, ...TICKS]
  return (
    <div className="ticker">
      <div className="ticker__track">
        {all.map(([v, l], i) => (
          <span key={`${v}-${i}`} className="ticker__item">
            <span className="ticker__v">{v}</span>
            {l}
            <span className="ticker__sep" />
          </span>
        ))}
      </div>
    </div>
  )
}

const STATS = [
  { n: '25 000+', l: 'Composants', bg: '25K' },
  { n: '142 000', l: 'Configs créées', bg: '142K' },
  { n: '48', l: 'Marques partenaires', bg: '48' },
  { n: '< 2 ms', l: 'Vérification compat', bg: '2ms' },
]

function Stats() {
  return (
    <section className="s s--sm">
      <div className="c">
        <div className="chmark rv">
          <span className="chmark__n">01 / CHIFFRES</span>
          <span className="chmark__line" />
        </div>
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={s.l} className={`stats-cell rv rv-d${i + 1}`}>
              <div className="stats-cell__bg">{s.bg}</div>
              <div className="stats-cell__n">{s.n}</div>
              <div className="stats-cell__l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

type BentoCat = {
  value: string
  label: string
  icon: string
  color: string
  bg: string
  count: string
  cls: string
  n: string
}

const BENTO: BentoCat[] = [
  { value: 'cpu', label: 'Processeur', icon: '⚡', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', count: '2 400+', cls: 'bento__cell--a1', n: '01' },
  { value: 'gpu', label: 'Carte graphique', icon: '🎮', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', count: '1 800+', cls: 'bento__cell--a2', n: '02' },
  { value: 'pc_case', label: 'Boîtier', icon: '🖥️', color: '#14B8A6', bg: 'rgba(20,184,166,0.12)', count: '2 800+', cls: 'bento__cell--a3', n: '03' },
  { value: 'motherboard', label: 'Carte mère', icon: '🔌', color: '#6366F1', bg: 'rgba(99,102,241,0.12)', count: '3 200+', cls: 'bento__cell--b1', n: '04' },
  { value: 'ram', label: 'Mémoire RAM', icon: '💾', color: '#22C55E', bg: 'rgba(34,197,94,0.12)', count: '5 600+', cls: 'bento__cell--b2', n: '05' },
  { value: 'storage', label: 'Stockage', icon: '💿', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', count: '4 100+', cls: 'bento__cell--b3', n: '06' },
  { value: 'psu', label: 'Alimentation', icon: '🔋', color: '#EC4899', bg: 'rgba(236,72,153,0.12)', count: '1 200+', cls: 'bento__cell--c1', n: '07' },
  { value: 'cpu_cooler', label: 'Ventirad', icon: '❄️', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', count: '3 500+', cls: 'bento__cell--c2', n: '08' },
]

function Bento() {
  return (
    <section className="s">
      <div className="c">
        <div className="chmark rv">
          <span className="chmark__n">02 / CATALOGUE</span>
          <span className="chmark__line" />
        </div>
        <div className="s__head">
          <div>
            <span className="s__eye rv rv-d1">Catalogue complet</span>
            <h2 className="s__h2 rv rv-d2">
              Chaque composant,<br />
              <mark>à ta portée.</mark>
            </h2>
          </div>
          <p className="s__p rv s__p--right">
            De la carte mère au ventirad — tous les composants pour assembler le PC de tes rêves.
          </p>
        </div>
        <div className="bento">
          {BENTO.map((cat, idx) => (
            <Link
              key={cat.value}
              to="/configurateur"
              className={`bento__cell ${cat.cls} rv rv-d${Math.min(idx + 1, 6)}`}
              style={{ ['--cat-color' as string]: cat.color, ['--cat-bg' as string]: cat.bg }}
              data-hover
            >
              <div className="bento__glow" />
              <span className="bento__num">{cat.n}</span>
              <span className="bento__big-num">{cat.n}</span>
              <div className="bento__icon">{cat.icon}</div>
              <div>
                <div className="bento__label">{cat.label}</div>
                <div className="bento__count">{cat.count} références</div>
              </div>
              <div className="bento__arrow">Explorer →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { n: '01', tag: 'EXPLORER', title: 'Choisis tes composants', desc: 'Parcours 25 000+ composants filtrés par catégorie, marque ou budget. Chaque pièce est documentée et à jour des dernières sorties.' },
  { n: '02', tag: 'VÉRIFIER', title: 'Compatibilité automatique', desc: 'Notre moteur vérifie en temps réel socket, type de RAM, dimensions boîtier et ventirad. Zéro mauvaise surprise à l\'assemblage.' },
  { n: '03', tag: 'COMMANDER', title: 'Config prête à commander', desc: 'Exporte ou sauvegarde ta configuration. Toutes les pièces sont listées avec les prix, il ne reste plus qu\'à passer commande.' },
]

function How() {
  return (
    <section className="s how">
      <div className="c">
        <div className="chmark rv">
          <span className="chmark__n">03 / PROCESSUS</span>
          <span className="chmark__line" />
        </div>
        <div className="s__head">
          <h2 className="s__h2 rv">Comment<br />ça marche ?</h2>
          <p className="s__p rv s__p--right">
            Trois étapes pour passer de zéro à une configuration complète et compatible.
          </p>
        </div>
        <div className="how__grid">
          {STEPS.map((step, i) => (
            <div key={step.n} className={`how__step rv rv-d${i + 1}`}>
              <span className="how__step-tag">{step.tag}</span>
              <div className="how__step-n">{step.n}</div>
              <div className="how__step-title">{step.title}</div>
              <div className="how__step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Cta() {
  return (
    <section className="cta-s">
      <div className="cta-s__glow" />
      <div className="c cta-s__wrap">
        <span className="cta-s__eyebrow rv">— PC AERIS —</span>
        <h2 className="cta-s__h2 rv rv-d1">
          Prêt à construire<br />
          <mark>ton PC idéal ?</mark>
        </h2>
        <p className="cta-s__p rv rv-d2">Gratuit. Sans inscription. En quelques minutes.</p>
        <Link to="/configurateur" className="cta-s__cta rv rv-d3" data-hover>
          Commencer maintenant
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
            <path d="M3 7.5h9M9 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Stats />
      <Bento />
      <How />
      <Cta />
    </>
  )
}

export default Home
