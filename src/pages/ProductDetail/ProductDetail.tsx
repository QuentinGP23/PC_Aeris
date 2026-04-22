import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../config'
import { useConfigStore } from '../../store'
import { CATEGORIES } from '../../types'
import { SPEC_LABELS, SPEC_UNITS } from '../../constants'
import type { Product, CategoryKey } from '../../types'
import './ProductDetail.scss'

function formatSpecValue(val: unknown, unit?: string): string {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'boolean') return val ? 'Oui' : 'Non'
  if (Array.isArray(val)) return val.join(', ') || '—'
  const str = String(val)
  return unit ? `${str} ${unit}` : str
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { config, selectComponent, removeComponent } = useConfigStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return

    async function fetchProduct() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('id, name, manufacturer, series, variant, release_year, category, image_url, description, price_min_eur, price_max_eur, price_avg_eur, price_updated_at, retailer_url, benchmark_score')
        .eq('id', id)
        .single()

      if (error || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      const categoryDef = CATEGORIES.find((c) => c.value === data.category)
      let specs: Record<string, unknown> | null = null

      if (categoryDef) {
        const { data: specsData } = await supabase
          .from(categoryDef.specsTable)
          .select('*')
          .eq('product_id', id)
          .single()

        if (specsData) {
          specs = Object.fromEntries(
            Object.entries(specsData as Record<string, unknown>).filter(
              ([k]) => k !== 'product_id' && k !== 'id'
            )
          )
        }
      }

      setProduct({ ...data, specs })
      setLoading(false)
    }

    void fetchProduct()
  }, [id])

  if (loading) {
    return <div className="st-load">Chargement...</div>
  }

  if (notFound || !product) {
    return (
      <div className="c" style={{ padding: '80px 40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>Produit introuvable.</p>
        <button type="button" className="btn btn--ghost2" onClick={() => navigate(-1)}>← Retour</button>
      </div>
    )
  }

  const categoryDef = CATEGORIES.find((c) => c.value === product.category)
  const categoryKey = product.category as CategoryKey
  const isSelected = config[categoryKey]?.id === product.id

  const specEntries = product.specs
    ? Object.entries(product.specs).filter(([, v]) => v !== null && v !== undefined)
    : []

  const hasPrice = product.price_min_eur !== null && product.price_max_eur !== null

  return (
    <div className="pd-page">
      <div className="c">
        <div className="breadcrumb">
          <Link to="/configurateur" className="breadcrumb__it">Configurateur</Link>
          <span className="breadcrumb__sep">/</span>
          <span className="breadcrumb__it">{categoryDef?.label}</span>
          <span className="breadcrumb__sep">/</span>
          <span>{product.name}</span>
        </div>

        <div className="pd-grid">
          <div className="pd-left">
            <div className="pd-img">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} />
              ) : (
                <span>{categoryDef?.icon ?? '📦'}</span>
              )}
            </div>

            <div className="pd-price">
              <div className="pd-price__l">Prix occasion estimé</div>
              {hasPrice ? (
                <>
                  <div className="pd-price__r">
                    {product.price_avg_eur !== null
                      ? `~ ${formatPrice(product.price_avg_eur)}`
                      : formatPrice(product.price_min_eur!)}
                  </div>
                  <div className="pd-price__a">
                    {formatPrice(product.price_min_eur!)} – {formatPrice(product.price_max_eur!)}
                    {product.price_updated_at && (
                      <> · MAJ {new Date(product.price_updated_at).toLocaleDateString('fr-FR')}</>
                    )}
                  </div>
                </>
              ) : (
                <div className="pd-price__a">Prix non disponible</div>
              )}
            </div>

            <div className="pd-actions">
              {isSelected ? (
                <button
                  type="button"
                  className="btn btn--ok btn--full"
                  onClick={() => removeComponent(categoryKey)}
                >
                  ✓ Dans ma configuration — Retirer
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--ind btn--full"
                  onClick={() => selectComponent(categoryKey, product)}
                >
                  Ajouter à ma configuration
                </button>
              )}

              {product.retailer_url && (
                <a
                  href={product.retailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-retailer"
                >
                  Voir chez le revendeur →
                </a>
              )}
            </div>
          </div>

          <div className="pd-right">
            <span className="pd-badge">{categoryDef?.label}</span>
            <h1 className="pd-h1">{product.name}</h1>
            <div className="pd-meta">
              {[product.manufacturer, product.series, product.variant, product.release_year]
                .filter(Boolean).join(' · ')}
            </div>

            {product.benchmark_score !== null && (
              <div className="pd-bench">
                <span className="pd-bench__l">Score benchmark</span>
                <span className="pd-bench__v">{product.benchmark_score}</span>
              </div>
            )}

            {product.description && (
              <div className="pd-desc">
                <div className="pd-sec-title">Description</div>
                <p>{product.description}</p>
              </div>
            )}

            {specEntries.length > 0 && (
              <div className="pd-specs">
                <div className="pd-sec-title">Caractéristiques techniques</div>
                <table className="pd-specs-tbl">
                  <tbody>
                    {specEntries.map(([key, val]) => {
                      const label = SPEC_LABELS[key] ?? key.replace(/_/g, ' ')
                      const unit = SPEC_UNITS[key]
                      return (
                        <tr key={key}>
                          <td>{label}</td>
                          <td>{formatSpecValue(val, unit)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
