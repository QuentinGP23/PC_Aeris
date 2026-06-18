import type { Product } from '../../../types'
import { getNewPrice, getUsedPrice, formatEur } from '../../../utils/pricing'
import './PriceBlock.scss'

interface PriceBlockProps {
  product: Pick<Product, 'category' | 'release_year' | 'price_min_eur' | 'price_max_eur' | 'price_avg_eur' | 'price_updated_at'>
  /** Version compacte pour les cartes du configurateur. */
  compact?: boolean
}

/**
 * Affiche le prix Neuf (réel, scrapé) et le prix Occasion (estimé par décote),
 * chacun avec sa fourchette min–max et sa moyenne (style place de marché).
 */
export function PriceBlock({ product, compact = false }: PriceBlockProps) {
  const neuf = getNewPrice(product)
  const occasion = getUsedPrice(product)

  if (!neuf) {
    return <div className="price-block price-block--empty">Prix non disponible</div>
  }

  return (
    <div className={`price-block ${compact ? 'price-block--compact' : ''}`}>
      <div className="price-tier price-tier--new">
        <div className="price-tier__top">
          <span className="price-tier__label">Neuf</span>
          <span className="price-tier__avg">{formatEur(neuf.avg)}</span>
        </div>
        {!compact && neuf.min !== neuf.max && (
          <div className="price-tier__range">{formatEur(neuf.min)} – {formatEur(neuf.max)}</div>
        )}
      </div>

      {occasion && (
        <div className="price-tier price-tier--used">
          <div className="price-tier__top">
            <span className="price-tier__label">
              Occasion <span className="price-tier__est" title="Estimation par décote, non issue d'un marché réel">estimée</span>
            </span>
            <span className="price-tier__avg">{formatEur(occasion.avg)}</span>
          </div>
          {!compact && (
            <div className="price-tier__range">{formatEur(occasion.min)} – {formatEur(occasion.max)}</div>
          )}
        </div>
      )}

      {!compact && product.price_updated_at && (
        <div className="price-block__upd">Prix neuf mis à jour le {new Date(product.price_updated_at).toLocaleDateString('fr-FR')}</div>
      )}
    </div>
  )
}
