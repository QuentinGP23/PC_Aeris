import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../config'
import { useConfigStore } from '../../store'
import { CATEGORIES } from '../../types'
import { SPEC_LABELS, SPEC_UNITS } from '../../constants'
import type { Product, CategoryKey } from '../../types'
import { Button } from '../../components/common'
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
    return (
      <div className="product-detail product-detail--loading">
        Chargement...
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="product-detail product-detail--not-found">
        <p>Produit introuvable.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Retour</Button>
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
    <div className="product-detail">
      <div className="product-detail__breadcrumb">
        <Link to="/configurateur">Configurateur</Link>
        <span>/</span>
        <span>{categoryDef?.icon} {categoryDef?.label}</span>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail__layout">
        {/* Left column */}
        <div className="product-detail__left">
          <div className="product-detail__image-wrap">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="product-detail__image" />
            ) : (
              <div className="product-detail__image-placeholder">
                <span>{categoryDef?.icon ?? '📦'}</span>
              </div>
            )}
          </div>

          {/* Price block */}
          <div className="product-detail__price-block">
            {hasPrice ? (
              <>
                <p className="product-detail__price-label">Prix occasion estimé</p>
                <p className="product-detail__price-range">
                  {formatPrice(product.price_min_eur!)}
                  <span className="product-detail__price-sep">–</span>
                  {formatPrice(product.price_max_eur!)}
                </p>
                {product.price_avg_eur !== null && (
                  <p className="product-detail__price-avg">
                    Moy. {formatPrice(product.price_avg_eur)}
                  </p>
                )}
                {product.price_updated_at && (
                  <p className="product-detail__price-date">
                    Mis à jour le {new Date(product.price_updated_at).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </>
            ) : (
              <p className="product-detail__price-unavailable">Prix non disponible</p>
            )}
          </div>

          {/* Actions */}
          <div className="product-detail__actions">
            {isSelected ? (
              <Button variant="success" fullWidth onClick={() => removeComponent(categoryKey)}>
                ✓ Dans ma configuration — Retirer
              </Button>
            ) : (
              <Button variant="primary" fullWidth onClick={() => selectComponent(categoryKey, product)}>
                Ajouter à ma configuration
              </Button>
            )}
            {product.retailer_url && (
              <a href={product.retailer_url} target="_blank" rel="noopener noreferrer" className="product-detail__retailer-link">
                Voir chez le revendeur →
              </a>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="product-detail__right">
          <div className="product-detail__header">
            <span className="product-detail__category-badge">
              {categoryDef?.icon} {categoryDef?.label}
            </span>
            <h1 className="product-detail__name">{product.name}</h1>
            <p className="product-detail__meta">
              {[product.manufacturer, product.series, product.variant, product.release_year]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {product.benchmark_score !== null && (
              <div className="product-detail__benchmark">
                <span className="product-detail__benchmark-label">Score benchmark</span>
                <span className="product-detail__benchmark-value">{product.benchmark_score}</span>
              </div>
            )}
          </div>

          {product.description && (
            <div className="product-detail__description">
              <h2>Description</h2>
              <p>{product.description}</p>
            </div>
          )}

          {specEntries.length > 0 && (
            <div className="product-detail__specs">
              <h2>Caractéristiques techniques</h2>
              <table className="product-detail__specs-table">
                <tbody>
                  {specEntries.map(([key, val]) => {
                    const label = SPEC_LABELS[key] ?? key.replace(/_/g, ' ')
                    const unit = SPEC_UNITS[key]
                    return (
                      <tr key={key}>
                        <td className="product-detail__spec-key">{label}</td>
                        <td className="product-detail__spec-val">{formatSpecValue(val, unit)}</td>
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
  )
}

export default ProductDetail
