import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { prebuiltsService, type PrebuiltConfig, type PrebuiltUsage } from '../../services'
import { useConfigStore, useToast } from '../../store'
import './PrebuiltConfigs.scss'

const USAGE_LABEL: Record<PrebuiltUsage, string> = {
  gaming: 'Gaming',
  creation: 'Création',
  bureautique: 'Bureautique',
  streaming: 'Streaming',
}
const USAGE_ICON: Record<PrebuiltUsage, string> = {
  gaming: '🎮',
  creation: '🎬',
  bureautique: '💼',
  streaming: '📡',
}
const TIER_LABEL = { entree: "Entrée de gamme", milieu: 'Milieu de gamme', haut: 'Haut de gamme' }

function PrebuiltConfigs() {
  const navigate = useNavigate()
  const toast = useToast()
  const loadConfig = useConfigStore((s) => s.loadConfig)

  const [configs, setConfigs] = useState<PrebuiltConfig[] | null>(null)
  const [filter, setFilter] = useState<PrebuiltUsage | 'all'>('all')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void prebuiltsService.list().then(({ data, error }) => {
      if (cancelled) return
      if (error) toast.error(error)
      else setConfigs(data)
    })
    return () => { cancelled = true }
  }, [toast])

  const shown = useMemo(
    () => (configs ?? []).filter((c) => filter === 'all' || c.usage === filter),
    [configs, filter],
  )

  const handleLoad = async (pc: PrebuiltConfig) => {
    setLoadingId(pc.id)
    const h = await prebuiltsService.hydrate(pc)
    setLoadingId(null)
    loadConfig(h.id, h.name, h.products)
    toast.success(`"${pc.name}" chargée — à toi de l'ajuster`)
    navigate('/configurateur')
  }

  return (
    <div className="prebuilts">
      <header className="prebuilts__hd">
        <h1 className="prebuilts__title">Configs prêtes à l'emploi</h1>
        <p className="prebuilts__sub">
          Des PC complets, optimisés et <strong>garantis compatibles</strong>. Choisis-en un, charge-le, ajuste-le.
          Pas sûr de ton besoin ? <button className="prebuilts__link" onClick={() => navigate('/questionnaire')}>Réponds au questionnaire</button>.
        </p>
      </header>

      <div className="prebuilts__filters">
        <button className={`prebuilts__chip ${filter === 'all' ? 'is-on' : ''}`} onClick={() => setFilter('all')}>Tous</button>
        {(Object.keys(USAGE_LABEL) as PrebuiltUsage[]).map((u) => (
          <button key={u} className={`prebuilts__chip ${filter === u ? 'is-on' : ''}`} onClick={() => setFilter(u)}>
            {USAGE_ICON[u]} {USAGE_LABEL[u]}
          </button>
        ))}
      </div>

      {configs === null ? (
        <div className="prebuilts__state">Chargement…</div>
      ) : shown.length === 0 ? (
        <div className="prebuilts__state">Aucune config pour ce filtre.</div>
      ) : (
        <div className="prebuilts__grid">
          {shown.map((pc) => (
            <article key={pc.id} className="pb-card">
              <div className="pb-card__top">
                <span className="pb-card__usage">{USAGE_ICON[pc.usage]} {USAGE_LABEL[pc.usage]}</span>
                <span className="pb-card__tier">{TIER_LABEL[pc.tier]}</span>
              </div>
              <h2 className="pb-card__name">{pc.name}</h2>
              <p className="pb-card__summary">{pc.summary}</p>
              <div className="pb-card__budget">
                {pc.est_budget_min != null && pc.est_budget_max != null ? (
                  <><span className="pb-card__budget-v">{pc.est_budget_min}–{pc.est_budget_max} €</span><span className="pb-card__budget-l">budget estimé</span></>
                ) : (
                  <span className="pb-card__budget-l">sur devis</span>
                )}
              </div>
              <button
                type="button"
                className="pb-card__cta"
                disabled={loadingId === pc.id}
                onClick={() => void handleLoad(pc)}
              >
                {loadingId === pc.id ? 'Chargement…' : 'Charger dans le configurateur →'}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default PrebuiltConfigs
