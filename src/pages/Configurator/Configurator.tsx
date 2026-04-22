import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../config'
import { useConfigStore } from '../../store'
import { CATEGORIES } from '../../types'
import { KEY_SPECS, SPEC_LABELS, SPEC_UNITS } from '../../constants'
import type { Product, CategoryKey } from '../../types'
import { getCompatibleProductIds } from '../../utils'
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

function Configurator() {
  const { config, selectComponent, removeComponent, clearConfig } = useConfigStore()

  const [activeCategory, setActiveCategory] = useState<CategoryKey>('cpu')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [compatInfo, setCompatInfo] = useState<{ active: boolean; reason?: string; empty?: boolean }>({ active: false })

  const cpuId = config['cpu']?.id
  const motherboardId = config['motherboard']?.id

  useEffect(() => {
    let cancelled = false
    const categoryDef = CATEGORIES.find((c) => c.value === activeCategory)!
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    async function run() {
      const compat = await getCompatibleProductIds(activeCategory, config)
      if (cancelled) return

      if (compat.filtered && compat.productIds.length === 0) {
        setProducts([])
        setTotalCount(0)
        setCompatInfo({ active: true, reason: compat.reason, empty: true })
        setLoading(false)
        return
      }

      setCompatInfo(compat.filtered ? { active: true, reason: compat.reason } : { active: false })
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

      if (compat.filtered) {
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
          }))
        )
        setLoading(false)
      }
    }

    void run()
    return () => { cancelled = true }
  }, [activeCategory, page, search, cpuId, motherboardId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCategoryChange = (cat: CategoryKey) => {
    setActiveCategory(cat)
    setSearch('')
    setPage(0)
  }

  const selectedCount = Object.keys(config).length
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const progressPct = Math.round((selectedCount / CATEGORIES.length) * 100)

  const totalAvg = Object.values(config).reduce((acc, p) => acc + (p?.price_avg_eur ?? 0), 0)

  const activeCatDef = CATEGORIES.find(c => c.value === activeCategory)!

  return (
    <div className="config-wrap">
      <aside className="config-side">
        <div className="config-side__hd">
          <div className="config-side__title">Ma configuration</div>
          <div className="config-prog">
            <div className="config-prog__bar">
              <div className="config-prog__fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="config-prog__label">{selectedCount}/{CATEGORIES.length}</span>
          </div>
        </div>

        <div className="config-items">
          {CATEGORIES.map((cat, idx) => {
            const selected = config[cat.value]
            const isActive = activeCategory === cat.value
            return (
              <button
                key={cat.value}
                type="button"
                className={`config-item ${isActive ? 'config-item--act' : ''}`}
                onClick={() => handleCategoryChange(cat.value)}
              >
                <span className="config-item__n">{String(idx + 1).padStart(2, '0')}</span>
                <span className="config-item__ico">{cat.icon}</span>
                <div className="config-item__info">
                  <div className="config-item__lbl">{cat.label}</div>
                  {selected ? (
                    <div className="config-item__name">{selected.name}</div>
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
            <button type="button" className="config-side__reset" onClick={clearConfig}>
              Réinitialiser
            </button>
          )}
        </div>
      </aside>

      <main className="config-main">
        <div className="config-main__hd">
          <h1 className="config-main__h1">Configurateur PC</h1>
          <p className="config-main__sub">
            Explorez {CATEGORIES.length} catégories, ajoutez des composants compatibles, obtenez une config complète.
          </p>
        </div>

        <div className="config-tabs">
          {CATEGORIES.map((cat) => {
            const done = Boolean(config[cat.value])
            const act = activeCategory === cat.value
            return (
              <button
                key={cat.value}
                type="button"
                className={`config-tab ${act ? 'config-tab--act' : ''}`}
                onClick={() => handleCategoryChange(cat.value)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {done && <span className="config-tab__ck">✓</span>}
              </button>
            )
          })}
        </div>

        {compatInfo.active && (
          <div className={`compat-info ${compatInfo.empty ? 'compat-info--empty' : ''}`}>
            {compatInfo.empty
              ? <>⚠️ Aucun composant compatible avec {compatInfo.reason}</>
              : <>✓ Filtré pour compatibilité · {compatInfo.reason}</>}
          </div>
        )}

        {!compatInfo.empty && (
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
        ) : compatInfo.empty ? null : products.length === 0 ? (
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
                        onClick={() => selectComponent(activeCategory, product)}
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

        {totalPages > 1 && !compatInfo.empty && (
          <div className="pagination">
            <button
              type="button"
              className="btn btn--ghost2"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
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
              onClick={() => setPage(p => p + 1)}
            >
              Suivant →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Configurator
