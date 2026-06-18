import type { CategoryKey, Product } from '../types'

/** Fourchette de prix : bas, haut, moyen (style place de marché). */
export interface PricePoint {
  min: number
  max: number
  avg: number
}

export type PriceCondition = 'neuf' | 'occasion'

const CURRENT_YEAR = 2026

/**
 * Ratio occasion/neuf de référence pour un composant récent (~1 an), par
 * catégorie. La revente dépend beaucoup du type de pièce : un GPU/CPU garde
 * mieux sa valeur qu'un boîtier ou un ventirad.
 */
const USED_BASE_RATIO: Record<CategoryKey, number> = {
  gpu: 0.72,
  cpu: 0.74,
  ram: 0.62,
  storage: 0.58,
  motherboard: 0.62,
  psu: 0.65,
  pc_case: 0.55,
  cpu_cooler: 0.58,
}

// Décote annuelle supplémentaire appliquée au-delà de la 1re année (composée).
const YEARLY_DECAY = 0.9
const MIN_RATIO = 0.25
const MAX_RATIO = 0.92

/** Prix neuf (depuis les colonnes scrapées). `null` si aucun prix connu. */
export function getNewPrice(p: Pick<Product, 'price_min_eur' | 'price_max_eur' | 'price_avg_eur'>): PricePoint | null {
  const { price_min_eur: lo, price_max_eur: hi, price_avg_eur: mid } = p
  if (lo == null && hi == null && mid == null) return null
  const avg = mid ?? lo ?? hi!
  return {
    min: lo ?? avg,
    max: hi ?? avg,
    avg,
  }
}

/**
 * Estime le prix d'occasion à partir du prix neuf, par décote selon la
 * catégorie et l'âge du composant. Renvoie une fourchette min/max/moyen.
 * C'est une **estimation** (à présenter comme telle), pas un prix de marché réel.
 */
export function deriveUsed(category: CategoryKey | string, releaseYear: number | null, newAvg: number): PricePoint {
  const base = USED_BASE_RATIO[category as CategoryKey] ?? 0.62
  const age = releaseYear ? Math.max(0, CURRENT_YEAR - releaseYear) : 1
  const ageFactor = Math.pow(YEARLY_DECAY, Math.max(0, age - 1))
  const ratio = Math.min(MAX_RATIO, Math.max(MIN_RATIO, base * ageFactor))
  const avg = Math.round(newAvg * ratio)
  return {
    min: Math.round(avg * 0.85),
    max: Math.round(avg * 1.12),
    avg,
  }
}

/** Prix d'occasion estimé pour un produit. `null` si aucun prix neuf connu. */
export function getUsedPrice(p: Pick<Product, 'category' | 'release_year' | 'price_min_eur' | 'price_max_eur' | 'price_avg_eur'>): PricePoint | null {
  const nw = getNewPrice(p)
  if (!nw) return null
  return deriveUsed(p.category, p.release_year, nw.avg)
}

/** Prix selon la condition choisie. */
export function priceByCondition(
  p: Pick<Product, 'category' | 'release_year' | 'price_min_eur' | 'price_max_eur' | 'price_avg_eur'>,
  condition: PriceCondition,
): PricePoint | null {
  return condition === 'neuf' ? getNewPrice(p) : getUsedPrice(p)
}

/** Formatage EUR court, arrondi à l'euro. */
export function formatEur(n: number): string {
  return `${Math.round(n).toLocaleString('fr-FR')} €`
}
