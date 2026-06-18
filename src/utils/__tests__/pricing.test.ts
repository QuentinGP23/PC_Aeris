import { describe, it, expect } from 'vitest'
import { getNewPrice, getUsedPrice, deriveUsed, priceByCondition } from '../pricing'
import type { Product } from '../../types'

function makeProduct(over: Partial<Product> = {}): Product {
  return {
    id: 'p1', name: 'Test', manufacturer: null, series: null, variant: null,
    release_year: 2025, category: 'gpu', image_url: null, description: null,
    price_min_eur: 600, price_max_eur: 800, price_avg_eur: 700,
    price_updated_at: null, retailer_url: null, benchmark_score: null, specs: null,
    ...over,
  }
}

describe('getNewPrice', () => {
  it('renvoie null si aucun prix', () => {
    expect(getNewPrice(makeProduct({ price_min_eur: null, price_max_eur: null, price_avg_eur: null }))).toBeNull()
  })
  it('utilise min/max/avg tels quels', () => {
    expect(getNewPrice(makeProduct())).toEqual({ min: 600, max: 800, avg: 700 })
  })
  it('comble min/max manquants avec la moyenne', () => {
    expect(getNewPrice(makeProduct({ price_min_eur: null, price_max_eur: null, price_avg_eur: 500 })))
      .toEqual({ min: 500, max: 500, avg: 500 })
  })
})

describe('deriveUsed', () => {
  it('occasion < neuf pour un composant récent', () => {
    const u = deriveUsed('gpu', 2025, 700)
    expect(u.avg).toBeLessThan(700)
    expect(u.avg).toBeGreaterThan(400) // GPU récent garde une bonne valeur
  })
  it('respecte min < avg < max', () => {
    const u = deriveUsed('cpu', 2024, 500)
    expect(u.min).toBeLessThan(u.avg)
    expect(u.avg).toBeLessThan(u.max)
  })
  it('décote davantage un composant ancien', () => {
    const recent = deriveUsed('gpu', 2025, 700).avg
    const old = deriveUsed('gpu', 2018, 700).avg
    expect(old).toBeLessThan(recent)
  })
  it('plancher : ne descend pas sous 25% du neuf', () => {
    const u = deriveUsed('pc_case', 2005, 100)
    expect(u.avg).toBeGreaterThanOrEqual(25)
  })
})

describe('getUsedPrice / priceByCondition', () => {
  it('occasion estimée < neuf', () => {
    const p = makeProduct()
    expect(getUsedPrice(p)!.avg).toBeLessThan(getNewPrice(p)!.avg)
  })
  it('priceByCondition route vers le bon prix', () => {
    const p = makeProduct()
    expect(priceByCondition(p, 'neuf')).toEqual(getNewPrice(p))
    expect(priceByCondition(p, 'occasion')).toEqual(getUsedPrice(p))
  })
  it('null si pas de prix neuf', () => {
    const p = makeProduct({ price_min_eur: null, price_max_eur: null, price_avg_eur: null })
    expect(getUsedPrice(p)).toBeNull()
  })
})
