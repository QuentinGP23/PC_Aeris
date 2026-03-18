import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../../config'
import { useConfigStore } from '../../store'
import { CATEGORIES, KEY_SPECS } from '../../types'
import type { Product, CategoryKey } from '../../types'
import { getCompatibleProductIds } from '../../utils'
import { Button } from '../../components/common'
import './Configurator.scss'

const PAGE_SIZE = 24

function renderSpecValue(val: unknown): string {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'boolean') return val ? 'Oui' : 'Non'
  if (Array.isArray(val)) return val.join(', ') || '—'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

function formatSpecKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
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

  // Track previous config to detect changes that affect compatibility
  const prevConfigRef = useRef(config)

  const fetchProducts = useCallback(
    async (cat: CategoryKey, pg: number, srch: string, currentConfig: typeof config) => {
      setLoading(true)

      const categoryDef = CATEGORIES.find((c) => c.value === cat)!
      const from = pg * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      // Resolve compatibility filters
      const compat = await getCompatibleProductIds(cat, currentConfig)

      if (compat.filtered && compat.productIds.length === 0) {
        setProducts([])
        setTotalCount(0)
        setCompatInfo({ active: true, reason: compat.reason, empty: true })
        setLoading(false)
        return
      }

      setCompatInfo(compat.filtered ? { active: true, reason: compat.reason } : { active: false })

      let query = supabase
        .from('products')
        .select('id, name, manufacturer, series, release_year, category, image_url', { count: 'exact' })
        .eq('category', cat)
        .order('name')
        .range(from, to)

      if (srch.trim()) {
        query = query.ilike('name', `%${srch.trim()}%`)
      }

      if (compat.filtered) {
        query = query.in('id', compat.productIds)
      }

      const { data: productsData, error, count } = await query

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

        if (specsData) {
          for (const s of specsData) {
            const row = s as Record<string, unknown>
            specsMap.set(row.product_id as string, row)
          }
        }
      }

      setProducts(
        productsData.map((p) => ({
          ...p,
          specs: specsMap.get(p.id) || null,
        }))
      )
      setLoading(false)
    },
    []
  )

  // Fetch on category change
  useEffect(() => {
    setSearch('')
    setPage(0)
    fetchProducts(activeCategory, 0, '', config)
  }, [activeCategory, fetchProducts])  // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch when a compatibility-relevant component changes
  useEffect(() => {
    const prev = prevConfigRef.current
    const changed =
      prev['cpu'] !== config['cpu'] ||
      prev['motherboard'] !== config['motherboard']

    if (changed) {
      prevConfigRef.current = config
      setPage(0)
      fetchProducts(activeCategory, 0, search, config)
    }
  }, [config, activeCategory, search, fetchProducts])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(0)
    fetchProducts(activeCategory, 0, value, config)
  }

  const handlePage = (newPage: number) => {
    setPage(newPage)
    fetchProducts(activeCategory, newPage, search, config)
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
                onClick={() => setActiveCategory(cat.value)}
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
              onClick={() => setActiveCategory(cat.value)}
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
                                {formatSpecKey(key)}
                              </span>
                              <span className="configurator__card-spec-val">
                                {renderSpecValue(product.specs![key])}
                              </span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>

                  <div className="configurator__card-footer">
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
