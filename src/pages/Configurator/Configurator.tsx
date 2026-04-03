import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../config'
import { useConfigStore } from '../../store'
import { CATEGORIES } from '../../types'
import { KEY_SPECS, SPEC_LABELS, SPEC_UNITS } from '../../constants'
import type { Product, CategoryKey } from '../../types'
import { getCompatibleProductIds } from '../../utils'
import { Button } from '../../components/common'
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

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(0)
  }

  const handlePage = (newPage: number) => {
    setPage(newPage)
  }

  const selectedCount = Object.keys(config).length
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="configurator">
      {/* Sidebar */}
      <aside className="configurator__sidebar">
        <div className="configurator__sidebar-header">
          <h2>Ma configuration</h2>
          <span className="configurator__sidebar-count">{selectedCount}/8</span>
        </div>

        <ul className="configurator__summary">
          {CATEGORIES.map((cat) => {
            const selected = config[cat.value]
            return (
              <li
                key={cat.value}
                className={[
                  'configurator__summary-item',
                  selected ? 'configurator__summary-item--filled' : '',
                  activeCategory === cat.value ? 'configurator__summary-item--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleCategoryChange(cat.value)}
              >
                <span className="configurator__summary-icon">{cat.icon}</span>
                <div className="configurator__summary-info">
                  <span className="configurator__summary-label">{cat.label}</span>
                  {selected ? (
                    <span className="configurator__summary-name">{selected.name}</span>
                  ) : (
                    <span className="configurator__summary-empty">Non sélectionné</span>
                  )}
                </div>
                {selected && (
                  <button
                    className="configurator__summary-remove"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeComponent(cat.value)
                    }}
                    title="Retirer"
                  >
                    ✕
                  </button>
                )}
              </li>
            )
          })}
        </ul>

        {selectedCount > 0 && (
          <div className="configurator__sidebar-actions">
            <Button variant="outline" size="sm" fullWidth onClick={clearConfig}>
              Réinitialiser
            </Button>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="configurator__main">
        <div className="configurator__main-header">
          <h1>Configurateur PC</h1>
        </div>

        {/* Category tabs */}
        <div className="configurator__tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={[
                'configurator__tab',
                activeCategory === cat.value ? 'configurator__tab--active' : '',
                config[cat.value] ? 'configurator__tab--done' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleCategoryChange(cat.value)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {config[cat.value] && <span className="configurator__tab-check">✓</span>}
            </button>
          ))}
        </div>

        {/* Compatibility badge */}
        {compatInfo.active && (
          <div className={`configurator__compat-badge ${compatInfo.empty ? 'configurator__compat-badge--empty' : ''}`}>
            {compatInfo.empty ? (
              <>⚠️ Aucun composant compatible avec {compatInfo.reason}</>
            ) : (
              <>✓ Filtré pour compatibilité · {compatInfo.reason}</>
            )}
          </div>
        )}

        {/* Search */}
        {!compatInfo.empty && (
          <div className="configurator__search">
            <input
              type="text"
              placeholder={`Rechercher un ${CATEGORIES.find((c) => c.value === activeCategory)?.label.toLowerCase()}...`}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="configurator__search-input"
            />
            {totalCount > 0 && (
              <span className="configurator__search-count">{totalCount} résultats</span>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="configurator__loading">Chargement...</div>
        ) : compatInfo.empty ? null : products.length === 0 ? (
          <div className="configurator__empty">Aucun résultat.</div>
        ) : (
          <div className="configurator__grid">
            {products.map((product) => {
              const isSelected = config[activeCategory]?.id === product.id
              const keySpecs = KEY_SPECS[activeCategory] ?? []

              return (
                <div
                  key={product.id}
                  className={[
                    'configurator__card',
                    isSelected ? 'configurator__card--selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {product.image_url && (
                    <div className="configurator__card-image">
                      <img src={product.image_url} alt={product.name} />
                    </div>
                  )}
                  <div className="configurator__card-body">
                    <h3 className="configurator__card-name">{product.name}</h3>
                    <p className="configurator__card-meta">
                      {[product.manufacturer, product.series, product.release_year]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>

                    {product.specs && (
                      <ul className="configurator__card-specs">
                        {keySpecs
                          .filter(
                            (key) =>
                              product.specs![key] !== null && product.specs![key] !== undefined
                          )
                          .map((key) => (
                            <li key={key}>
                              <span className="configurator__card-spec-key">
                                {SPEC_LABELS[key] ?? key.replace(/_/g, ' ')}
                              </span>
                              <span className="configurator__card-spec-val">
                                {renderSpecValue(product.specs![key], SPEC_UNITS[key])}
                              </span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>

                  <div className="configurator__card-footer">
                    {product.price_min_eur !== null && product.price_max_eur !== null && (
                      <div className="configurator__card-price">
                        <span className="configurator__card-price-range">
                          {Math.round(product.price_min_eur)}€ – {Math.round(product.price_max_eur)}€
                        </span>
                        {product.price_avg_eur !== null && (
                          <span className="configurator__card-price-avg">
                            moy. {Math.round(product.price_avg_eur)}€
                          </span>
                        )}
                      </div>
                    )}
                    <div className="configurator__card-actions">
                      {isSelected ? (
                        <Button
                          variant="success"
                          size="sm"
                          fullWidth
                          onClick={() => removeComponent(activeCategory)}
                        >
                          ✓ Sélectionné
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          onClick={() => selectComponent(activeCategory, product)}
                        >
                          Sélectionner
                        </Button>
                      )}
                      <Link to={`/produit/${product.id}`} className="configurator__card-detail-link">
                        Voir la fiche →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !compatInfo.empty && (
          <div className="configurator__pagination">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => handlePage(page - 1)}
            >
              ← Précédent
            </Button>
            <span className="configurator__pagination-info">
              Page {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => handlePage(page + 1)}
            >
              Suivant →
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Configurator
