import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../config'
import { useConfigStore, useToast } from '../../store'
import { useAuth } from '../../context/useAuth'
import { CATEGORIES } from '../../types'
import { KEY_SPECS, SPEC_LABELS, SPEC_UNITS } from '../../constants'
import type { Product, CategoryKey } from '../../types'
import { getCompatibleProductIds, missingPrereqs, nextPendingCategory, SELECTION_ORDER } from '../../utils'
import { savedConfigsService } from '../../services'
import SavedConfigsModal from './components/SavedConfigsModal'
import './Configurator.scss'

const PAGE_SIZE = 24

function renderSpecValue(val: unknown, unit?: string): string {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'boolean') return val ? 'Oui' : 'Non'
  if (Array.isArray(val)) return val.join(', ') || '—'
  if (typeof val === 'object') return JSON.stringify(val)
  const str = String(val)
  return unit ? `${str} ${unit}` : str
}

function categoryLabel(cat: CategoryKey): string {
  return CATEGORIES.find((c) => c.value === cat)?.label ?? cat
}

function Configurator() {
  const {
    config,
    lastInvalidated,
    loadedConfigName,
    selectComponent,
    removeComponent,
    setLoadedConfigName,
    clearInvalidated,
    clearConfig,
  } = useConfigStore()
  const toast = useToast()
  const { isAuthenticated } = useAuth()

  const [savedModalOpen, setSavedModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [activeCategory, setActiveCategory] = useState<CategoryKey>('cpu')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [compatInfo, setCompatInfo] = useState<{ active: boolean; reason?: string; empty?: boolean; fallback?: boolean }>({ active: false })

  const cpuId = config['cpu']?.id
  const motherboardId = config['motherboard']?.id
  const pcCaseId = config['pc_case']?.id
  const gpuId = config['gpu']?.id

  const missingForActive = useMemo(
    () => missingPrereqs(activeCategory, config),
    [activeCategory, config],
  )
  const locked = missingForActive.length > 0

  useEffect(() => {
    if (lastInvalidated.length === 0) return
    const labels = lastInvalidated.map(categoryLabel).join(', ')
    toast.warning(`Sélections incompatibles retirées : ${labels}`)
    clearInvalidated()
  }, [lastInvalidated, toast, clearInvalidated])

  useEffect(() => {
    if (locked) return

    let cancelled = false
    const categoryDef = CATEGORIES.find((c) => c.value === activeCategory)!
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    async function run() {
      const compat = await getCompatibleProductIds(activeCategory, config)
      if (cancelled) return

      // Si le filtre de compat retourne 0 produit alors qu'on a un filtre actif,
      // c'est probablement que les données en base sont incomplètes ou que les
      // règles sont trop strictes. On bascule en mode "fallback" : on affiche
      // TOUT le catalogue de la catégorie avec un message d'avertissement,
      // plutôt que de laisser l'utilisateur bloqué sur une liste vide.
      const fallback = compat.filtered && compat.productIds.length === 0
      if (fallback) {
        setCompatInfo({ active: true, reason: compat.reason, fallback: true })
      } else {
        setCompatInfo(compat.filtered ? { active: true, reason: compat.reason } : { active: false })
      }

      setLoading(true)

      let query = supabase
        .from('products')
        .select('id, name, manufacturer, series, variant, release_year, category, image_url, description, price_min_eur, price_max_eur, price_avg_eur, price_updated_at, retailer_url, benchmark_score', { count: 'exact' })
        .eq('category', activeCategory)
        .order('name')
        .range(from, to)

      if (search.trim()) {
        query = query.ilike('name', `%${search.trim()}%`)
      }

      // On n'applique le filtre par IDs que si on a réellement des IDs.
      // En fallback (0 IDs alors que filtered=true), on laisse passer tout.
      if (compat.filtered && compat.productIds.length > 0) {
        query = query.in('id', compat.productIds)
      }

      const { data: productsData, error, count } = await query
      if (cancelled) return

      if (error || !productsData) {
        setProducts([])
        setLoading(false)
        return
      }

      setTotalCount(count ?? 0)

      const productIds = productsData.map((p) => p.id)
      const specsMap = new Map<string, Record<string, unknown>>()

      if (productIds.length > 0) {
        const { data: specsData } = await supabase
          .from(categoryDef.specsTable)
          .select('*')
          .in('product_id', productIds)

        if (specsData && !cancelled) {
          for (const s of specsData) {
            const row = s as Record<string, unknown>
            specsMap.set(row.product_id as string, row)
          }
        }
      }

      if (!cancelled) {
        setProducts(
          productsData.map((p) => ({
            ...p,
            specs: specsMap.get(p.id) || null,
          })),
        )
        setLoading(false)
      }
    }

    void run()
    return () => { cancelled = true }
  }, [activeCategory, page, search, cpuId, motherboardId, pcCaseId, gpuId, locked]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCategoryChange = (cat: CategoryKey) => {
    const missing = missingPrereqs(cat, config)
    if (missing.length > 0) {
      const first = missing[0]
      toast.info(`Sélectionne d'abord ${categoryLabel(first)}`)
      setActiveCategory(first)
      setSearch('')
      setPage(0)
      return
    }
    setActiveCategory(cat)
    setSearch('')
    setPage(0)
  }

  const handleSelect = (cat: CategoryKey, product: Product) => {
    selectComponent(cat, product)
    const next = nextPendingCategory({ ...config, [cat]: product })
    if (next && next !== cat) {
      setActiveCategory(next)
      setSearch('')
      setPage(0)
    }
  }

  const selectedCount = Object.keys(config).length
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const progressPct = Math.round((selectedCount / CATEGORIES.length) * 100)
  const isComplete = selectedCount === CATEGORIES.length

  const totalAvg = Object.values(config).reduce((acc, p) => acc + (p?.price_avg_eur ?? 0), 0)

  const handleSave = async () => {
    if (saving) return
    const defaultName = loadedConfigName ?? `Config du ${new Date().toLocaleDateString('fr-FR')}`
    const name = window.prompt('Nom de la configuration :', defaultName)
    if (!name) return
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('Le nom ne peut pas être vide')
      return
    }
    setSaving(true)
    const components: Partial<Record<CategoryKey, string>> = {}
    for (const [cat, prod] of Object.entries(config) as [CategoryKey, Product][]) {
      components[cat] = prod.id
    }
    const { data, error } = await savedConfigsService.create(trimmed, components)
    setSaving(false)
    if (error || !data) {
      toast.error(error ?? 'Erreur de sauvegarde')
      return
    }
    setLoadedConfigName(trimmed)
    toast.success(`"${trimmed}" sauvegardée`)
  }

  const activeCatDef = CATEGORIES.find((c) => c.value === activeCategory)!

  const orderedCategories = SELECTION_ORDER.map((key) => CATEGORIES.find((c) => c.value === key)!).filter(Boolean)

  return (
    <div className="config-wrap">
      <aside className="config-side">
        <div className="config-side__hd">
          <div className="config-side__title">
            {loadedConfigName ?? 'Ma configuration'}
          </div>
          <div className="config-prog">
            <div className="config-prog__bar">
              <div className="config-prog__fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="config-prog__label">{selectedCount}/{CATEGORIES.length}</span>
          </div>
          {isComplete && (
            <div className="config-prog__complete">✓ Configuration complète</div>
          )}
        </div>

        <div className="config-items">
          {orderedCategories.map((cat, idx) => {
            const selected = config[cat.value]
            const isActive = activeCategory === cat.value
            const catLocked = missingPrereqs(cat.value, config).length > 0
            return (
              <button
                key={cat.value}
                type="button"
                className={`config-item ${isActive ? 'config-item--act' : ''} ${catLocked ? 'config-item--locked' : ''}`}
                onClick={() => handleCategoryChange(cat.value)}
                aria-disabled={catLocked}
                title={catLocked ? `Sélectionne d'abord ${categoryLabel(missingPrereqs(cat.value, config)[0])}` : undefined}
              >
                <span className="config-item__n">{String(idx + 1).padStart(2, '0')}</span>
                <span className="config-item__ico">{catLocked ? '🔒' : cat.icon}</span>
                <div className="config-item__info">
                  <div className="config-item__lbl">{cat.label}</div>
                  {selected ? (
                    <div className="config-item__name">{selected.name}</div>
                  ) : catLocked ? (
                    <div className="config-item__empty">Verrouillé</div>
                  ) : (
                    <div className="config-item__empty">Non sélectionné</div>
                  )}
                </div>
                {selected && (
                  <span
                    role="button"
                    tabIndex={0}
                    className="config-item__rm"
                    aria-label="Retirer"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeComponent(cat.value)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation()
                        removeComponent(cat.value)
                      }
                    }}
                  >
                    ✕
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="config-side__ft">
          <div className="config-side__total-l">Budget estimé (moy.)</div>
          <div className="config-side__total-v">
            {totalAvg > 0 ? `${Math.round(totalAvg).toLocaleString('fr-FR')} €` : '—'}
          </div>
          {isAuthenticated && (
            <div className="config-side__cta">
              <button
                type="button"
                className="config-side__save"
                onClick={() => void handleSave()}
                disabled={saving || selectedCount === 0}
              >
                {saving ? 'Sauvegarde…' : '💾 Sauvegarder'}
              </button>
              <button
                type="button"
                className="config-side__load"
                onClick={() => setSavedModalOpen(true)}
              >
                Mes configs
              </button>
            </div>
          )}
          {!isAuthenticated && selectedCount > 0 && (
            <div className="config-side__login-hint">
              <Link to="/connexion">Connecte-toi</Link> pour sauvegarder ta configuration.
            </div>
          )}
          {selectedCount > 0 && (
            <button type="button" className="config-side__reset" onClick={clearConfig}>
              Réinitialiser
            </button>
          )}
        </div>
      </aside>

      <SavedConfigsModal isOpen={savedModalOpen} onClose={() => setSavedModalOpen(false)} />

      <main className="config-main">
        <div className="config-main__hd">
          <h1 className="config-main__h1">Configurateur PC</h1>
          <p className="config-main__sub">
            Sélectionne les composants dans l'ordre indiqué. La compatibilité est vérifiée à chaque étape.
          </p>
        </div>

        <div className="config-tabs">
          {orderedCategories.map((cat) => {
            const done = Boolean(config[cat.value])
            const act = activeCategory === cat.value
            const catLocked = missingPrereqs(cat.value, config).length > 0
            return (
              <button
                key={cat.value}
                type="button"
                className={`config-tab ${act ? 'config-tab--act' : ''} ${catLocked ? 'config-tab--locked' : ''}`}
                onClick={() => handleCategoryChange(cat.value)}
                aria-disabled={catLocked}
                title={catLocked ? `Sélectionne d'abord ${categoryLabel(missingPrereqs(cat.value, config)[0])}` : undefined}
              >
                <span>{catLocked ? '🔒' : cat.icon}</span>
                <span>{cat.label}</span>
                {done && <span className="config-tab__ck">✓</span>}
              </button>
            )
          })}
        </div>

        {locked ? (
          <div className="compat-info compat-info--locked">
            🔒 Sélectionne d'abord {missingForActive.map(categoryLabel).join(', ')} pour débloquer {activeCatDef.label.toLowerCase()}
          </div>
        ) : (
          <>
            {compatInfo.active && (
              <div className={`compat-info ${compatInfo.fallback ? 'compat-info--empty' : ''}`}>
                {compatInfo.fallback
                  ? <>⚠️ Aucun produit ne passe le filtre {compatInfo.reason} — affichage du catalogue complet. Vérifie manuellement la compatibilité.</>
                  : <>✓ Filtré pour compatibilité · {compatInfo.reason}</>}
              </div>
            )}

            {!false && (
              <div className="config-search">
                <span className="config-search__ico">⌕</span>
                <input
                  type="text"
                  className="config-search__in"
                  placeholder={`Rechercher un ${activeCatDef.label.toLowerCase()}...`}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0) }}
                />
                {totalCount > 0 && (
                  <span className="config-search__cnt">{totalCount} résultats</span>
                )}
              </div>
            )}

            {loading ? (
              <div className="st-load">Chargement...</div>
            ) : false ? null : products.length === 0 ? (
              <div className="st-empty">Aucun résultat.</div>
            ) : (
              <div className="prod-grid">
                {products.map((product, idx) => {
                  const isSelected = config[activeCategory]?.id === product.id
                  const keySpecs = KEY_SPECS[activeCategory] ?? []

                  return (
                    <div
                      key={product.id}
                      className={`prod-card ${isSelected ? 'prod-card--sel' : ''}`}
                    >
                      <div className="prod-card__img">
                        <span className="prod-card__idx">#{String(page * PAGE_SIZE + idx + 1).padStart(3, '0')}</span>
                        {isSelected && <span className="prod-card__sel-tag">Sélectionné</span>}
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} />
                        ) : (
                          <span>{activeCatDef.icon}</span>
                        )}
                      </div>

                      <div className="prod-card__body">
                        <div className="prod-card__name">{product.name}</div>
                        <div className="prod-card__meta">
                          {[product.manufacturer, product.series, product.release_year].filter(Boolean).join(' · ')}
                        </div>

                        {product.specs && keySpecs.length > 0 && (
                          <div className="prod-card__specs">
                            {keySpecs
                              .filter((key) => product.specs![key] !== null && product.specs![key] !== undefined)
                              .slice(0, 3)
                              .map((key) => (
                                <div key={key} className="prod-card__spec">
                                  <span className="prod-card__sk">{SPEC_LABELS[key] ?? key.replace(/_/g, ' ')}</span>
                                  <span className="prod-card__sv">
                                    {renderSpecValue(product.specs![key], SPEC_UNITS[key])}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}

                        {product.benchmark_score !== null && (
                          <div className="prod-card__bench">
                            <span className="prod-card__bench-l">Bench</span>
                            <span className="prod-card__bench-v">{product.benchmark_score}</span>
                          </div>
                        )}
                      </div>

                      <div className="prod-card__ft">
                        <div className="prod-card__price">
                          {product.price_avg_eur !== null ? (
                            <>
                              <div className="prod-card__pr">~ {Math.round(product.price_avg_eur)} €</div>
                              {product.price_min_eur !== null && product.price_max_eur !== null && (
                                <div className="prod-card__pa">
                                  {Math.round(product.price_min_eur)}€ – {Math.round(product.price_max_eur)}€
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="prod-card__pa">Prix non disponible</div>
                          )}
                        </div>

                        {isSelected ? (
                          <button
                            type="button"
                            className="btn btn--ok btn--full"
                            onClick={() => removeComponent(activeCategory)}
                          >
                            ✓ Sélectionné
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn--ind btn--full"
                            onClick={() => handleSelect(activeCategory, product)}
                          >
                            Sélectionner
                          </button>
                        )}

                        <Link to={`/produit/${product.id}`} className="prod-detail-link">
                          Voir la fiche →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {totalPages > 1 && !false && (
              <div className="pagination">
                <button
                  type="button"
                  className="btn btn--ghost2"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Précédent
                </button>
                <span className="pagination__info">
                  Page {page + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn--ghost2"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Configurator
