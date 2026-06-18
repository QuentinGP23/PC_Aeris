import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../config'
import { useConfigStore, useToast, useCartStore } from '../../store'
import { useAuth } from '../../context/useAuth'
import { CATEGORIES } from '../../types'
import { KEY_SPECS, SPEC_LABELS, SPEC_UNITS } from '../../constants'
import type { Product, CategoryKey } from '../../types'
import { buildCompatibilityFilter, missingPrereqs, nextPendingCategory, SELECTION_ORDER } from '../../utils'
import { savedConfigsService } from '../../services'
import SavedConfigsModal from './components/SavedConfigsModal'
import SaveConfigModal from './components/SaveConfigModal'
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
  const addToCart = useCartStore((s) => s.addConfig)

  const [savedModalOpen, setSavedModalOpen] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [activeCategory, setActiveCategory] = useState<CategoryKey>('cpu')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'name' | 'bench' | 'price'>('name')
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
      const compat = buildCompatibilityFilter(activeCategory, config)
      setCompatInfo(compat ? { active: true, reason: compat.reason } : { active: false })
      setLoading(true)

      // On joint la table des specs en inner pour pouvoir filtrer côté SQL
      // (nécessaire dès qu'on a un filtre, sinon on plantait sur des URLs
      // de >100KB en passant 3000+ UUIDs dans `.in('id', [...])`).
      // Sans filtre, on joint quand même (left) pour récupérer les specs.
      const specsTable = compat?.specsTable ?? categoryDef.specsTable
      const specsRel = compat ? `${specsTable}!inner(*)` : `${specsTable}(*)`
      const baseSelect = 'id, name, manufacturer, series, variant, release_year, category, image_url, description, price_min_eur, price_max_eur, price_avg_eur, price_updated_at, retailer_url, benchmark_score'

      // Tri : benchmark (desc) seulement là où il a un sens (CPU/GPU), prix (asc),
      // sinon nom. Les nuls passent en fin pour ne pas polluer le haut de liste.
      const benchCat = activeCategory === 'cpu' || activeCategory === 'gpu'
      const applyOrder = <T extends { order: (...a: never[]) => T }>(q: T): T => {
        if (sort === 'bench' && benchCat)
          return (q.order as (c: string, o: object) => T)('benchmark_score', { ascending: false, nullsFirst: false })
        if (sort === 'price')
          return (q.order as (c: string, o: object) => T)('price_avg_eur', { ascending: true, nullsFirst: false })
        return (q.order as (c: string) => T)('name')
      }

      let query = applyOrder(
        supabase
          .from('products')
          .select(`${baseSelect}, ${specsRel}`, { count: 'exact' })
          .eq('category', activeCategory),
      ).range(from, to)

      if (search.trim()) {
        query = query.ilike('name', `%${search.trim()}%`)
      }

      // Application des opérations de filtre sur la table embarquée.
      // PostgREST autorise le préfixe `table.column` côté Supabase JS pour
      // les filtres directs ; pour `.or()` on passe `referencedTable`.
      if (compat) {
        for (const op of compat.ops) {
          if (op.kind === 'eq') {
            query = query.eq(`${specsTable}.${op.column}`, op.value)
          } else if (op.kind === 'contains') {
            query = query.contains(`${specsTable}.${op.column}`, op.value)
          } else if (op.kind === 'gte') {
            query = query.gte(`${specsTable}.${op.column}`, op.value)
          } else if (op.kind === 'or') {
            query = query.or(op.condition, { referencedTable: specsTable })
          }
        }
      }

      type ProductRow = Product & { [key: string]: unknown }
      const { data: productsData, error, count } = (await query) as {
        data: ProductRow[] | null
        error: unknown
        count: number | null
      }

      if (cancelled) return

      // Fallback : si on a un filtre actif et que le résultat est vide, on
      // refait la requête sans le filtre pour ne pas laisser l'utilisateur
      // bloqué (données incomplètes côté base, format inattendu, etc.).
      if (compat && (error || !productsData || productsData.length === 0)) {
        const fallbackRel = `${specsTable}(*)`
        let fallbackQuery = applyOrder(
          supabase
            .from('products')
            .select(`${baseSelect}, ${fallbackRel}`, { count: 'exact' })
            .eq('category', activeCategory),
        ).range(from, to)
        if (search.trim()) {
          fallbackQuery = fallbackQuery.ilike('name', `%${search.trim()}%`)
        }
        const { data: fbData, count: fbCount } = (await fallbackQuery) as {
          data: ProductRow[] | null
          count: number | null
        }
        if (cancelled) return
        setCompatInfo({ active: true, reason: compat.reason, fallback: true })
        setTotalCount(fbCount ?? 0)
        setProducts(extractProducts(fbData, specsTable))
        setLoading(false)
        return
      }

      if (error || !productsData) {
        setProducts([])
        setLoading(false)
        return
      }

      setTotalCount(count ?? 0)
      setProducts(extractProducts(productsData, specsTable))
      setLoading(false)
    }

    function extractProducts(rows: Array<Record<string, unknown>> | null, specsTable: string): Product[] {
      if (!rows) return []
      return rows.map((row) => {
        const specsValue = row[specsTable]
        let specs: Record<string, unknown> | null = null
        if (Array.isArray(specsValue) && specsValue.length > 0) {
          specs = specsValue[0] as Record<string, unknown>
        } else if (specsValue && typeof specsValue === 'object') {
          specs = specsValue as Record<string, unknown>
        }
        // Retire la clé jointe et fusionne les specs dans le produit final.
        const { [specsTable]: _omit, ...rest } = row
        void _omit
        return { ...(rest as unknown as Product), specs }
      })
    }

    void run()
    return () => { cancelled = true }
  }, [activeCategory, page, search, sort, cpuId, motherboardId, pcCaseId, gpuId, locked]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const defaultSaveName = loadedConfigName ?? `Config du ${new Date().toLocaleDateString('fr-FR')}`

  const handleSave = async (name: string) => {
    if (saving) return
    setSaving(true)
    const components: Partial<Record<CategoryKey, string>> = {}
    for (const [cat, prod] of Object.entries(config) as [CategoryKey, Product][]) {
      components[cat] = prod.id
    }
    const { data, error } = await savedConfigsService.create(name, components)
    setSaving(false)
    if (error || !data) {
      toast.error(error ?? 'Erreur de sauvegarde')
      return
    }
    setLoadedConfigName(name)
    setSaveModalOpen(false)
    toast.success(`"${name}" sauvegardée`)
  }

  const handleAddToCart = () => {
    const name = loadedConfigName ?? `Config du ${new Date().toLocaleDateString('fr-FR')}`
    addToCart(name, config)
    toast.success('Configuration ajoutée au panier')
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
          {selectedCount > 0 && (
            <button type="button" className="config-side__cart" onClick={handleAddToCart}>
              🛒 Ajouter au panier
            </button>
          )}
          {isAuthenticated && (
            <div className="config-side__cta">
              <button
                type="button"
                className="config-side__save"
                onClick={() => setSaveModalOpen(true)}
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

      <SaveConfigModal
        isOpen={saveModalOpen}
        defaultName={defaultSaveName}
        saving={saving}
        onClose={() => setSaveModalOpen(false)}
        onSubmit={(name) => void handleSave(name)}
      />

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

            <div className="config-sort">
              <span className="config-sort__lbl">Trier par</span>
              <button
                type="button"
                className={`config-sort__b ${sort === 'name' ? 'is-on' : ''}`}
                onClick={() => { setSort('name'); setPage(0) }}
              >
                Nom
              </button>
              {(activeCategory === 'cpu' || activeCategory === 'gpu') && (
                <button
                  type="button"
                  className={`config-sort__b ${sort === 'bench' ? 'is-on' : ''}`}
                  onClick={() => { setSort('bench'); setPage(0) }}
                >
                  Performance ↓
                </button>
              )}
              <button
                type="button"
                className={`config-sort__b ${sort === 'price' ? 'is-on' : ''}`}
                onClick={() => { setSort('price'); setPage(0) }}
              >
                Prix ↑
              </button>
            </div>

            {loading ? (
              <div className="st-load">Chargement...</div>
            ) : products.length === 0 ? (
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

            {totalPages > 1 && (
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
