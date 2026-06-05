import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { prebuiltsService, type PrebuiltConfig, type PrebuiltUsage, type PrebuiltTier } from '../../services'
import { useConfigStore, useToast } from '../../store'
import './Questionnaire.scss'

type Level = 'eco' | 'equilibre' | 'perf'

const USAGES: { value: PrebuiltUsage; icon: string; label: string; desc: string }[] = [
  { value: 'gaming', icon: '🎮', label: 'Jouer', desc: 'Jeux récents, fluidité, hautes performances' },
  { value: 'creation', icon: '🎬', label: 'Créer', desc: 'Montage vidéo, 3D, rendu, photo' },
  { value: 'streaming', icon: '📡', label: 'Streamer / Polyvalent', desc: 'Jouer et streamer, machine à tout faire' },
  { value: 'bureautique', icon: '💼', label: 'Bureautique / Études', desc: 'Navigation, bureautique, travail léger' },
]
const LEVELS: { value: Level; label: string; desc: string }[] = [
  { value: 'eco', label: 'Budget maîtrisé', desc: 'Le meilleur rapport qualité-prix' },
  { value: 'equilibre', label: 'Équilibré', desc: 'Le bon compromis perf / prix' },
  { value: 'perf', label: 'Performance', desc: "Le maximum, prêt pour l'avenir" },
]

// Préférence de gamme selon le niveau choisi.
const TIER_ORDER: Record<Level, PrebuiltTier[]> = {
  eco: ['entree', 'milieu', 'haut'],
  equilibre: ['milieu', 'haut', 'entree'],
  perf: ['haut', 'milieu', 'entree'],
}

function Questionnaire() {
  const navigate = useNavigate()
  const toast = useToast()
  const loadConfig = useConfigStore((s) => s.loadConfig)

  const [configs, setConfigs] = useState<PrebuiltConfig[]>([])
  const [step, setStep] = useState(0)
  const [usage, setUsage] = useState<PrebuiltUsage | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    void prebuiltsService.list().then(({ data }) => setConfigs(data))
  }, [])

  const match: PrebuiltConfig | null = (() => {
    if (!usage || !level) return null
    const forUsage = configs.filter((c) => c.usage === usage)
    if (!forUsage.length) return null
    for (const t of TIER_ORDER[level]) {
      const m = forUsage.find((c) => c.tier === t)
      if (m) return m
    }
    return forUsage[0]
  })()

  const handleLoad = async () => {
    if (!match) return
    setLoading(true)
    const h = await prebuiltsService.hydrate(match)
    setLoading(false)
    loadConfig(h.id, h.name, h.products)
    toast.success(`"${match.name}" chargée`)
    navigate('/configurateur')
  }

  return (
    <div className="quiz">
      <div className="quiz__steps">
        {['Usage', 'Niveau', 'Résultat'].map((s, i) => (
          <span key={s} className={`quiz__step ${i === step ? 'is-on' : ''} ${i < step ? 'is-done' : ''}`}>{i + 1}. {s}</span>
        ))}
      </div>

      {step === 0 && (
        <section className="quiz__panel">
          <h1 className="quiz__q">Pour quoi vas-tu utiliser ton PC ?</h1>
          <div className="quiz__opts">
            {USAGES.map((u) => (
              <button
                key={u.value}
                className={`quiz__opt ${usage === u.value ? 'is-sel' : ''}`}
                onClick={() => { setUsage(u.value); setStep(1) }}
              >
                <span className="quiz__opt-ic">{u.icon}</span>
                <span className="quiz__opt-l">{u.label}</span>
                <span className="quiz__opt-d">{u.desc}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="quiz__panel">
          <h1 className="quiz__q">Quel niveau de performance vises-tu ?</h1>
          <div className="quiz__opts quiz__opts--3">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                className={`quiz__opt ${level === l.value ? 'is-sel' : ''}`}
                onClick={() => { setLevel(l.value); setStep(2) }}
              >
                <span className="quiz__opt-l">{l.label}</span>
                <span className="quiz__opt-d">{l.desc}</span>
              </button>
            ))}
          </div>
          <button className="quiz__back" onClick={() => setStep(0)}>← Retour</button>
        </section>
      )}

      {step === 2 && (
        <section className="quiz__panel">
          <h1 className="quiz__q">Voici la config faite pour toi.</h1>
          {match ? (
            <div className="quiz__result">
              <h2 className="quiz__result-name">{match.name}</h2>
              <p className="quiz__result-sum">{match.summary}</p>
              {match.est_budget_min != null && (
                <div className="quiz__result-budget">{match.est_budget_min}–{match.est_budget_max} € <span>budget estimé</span></div>
              )}
              <div className="quiz__result-actions">
                <button className="quiz__cta" disabled={loading} onClick={() => void handleLoad()}>
                  {loading ? 'Chargement…' : 'Charger & personnaliser →'}
                </button>
                <button className="quiz__ghost" onClick={() => navigate('/configs-pretes')}>Voir toutes les configs</button>
              </div>
            </div>
          ) : (
            <p className="quiz__none">Aucune config ne correspond pour l'instant. <button className="quiz__back" onClick={() => navigate('/configs-pretes')}>Voir le catalogue</button></p>
          )}
          <button className="quiz__back" onClick={() => setStep(1)}>← Changer de niveau</button>
        </section>
      )}
    </div>
  )
}

export default Questionnaire
