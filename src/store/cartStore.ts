import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CategoryKey, Product } from '../types'
import { ASSEMBLY_PRICE, type AssemblyTier } from '../constants'
import { getNewPrice, getUsedPrice, type PriceCondition } from '../utils/pricing'

/** Marchand déduit du domaine de l'URL marchande. */
export function merchantFromUrl(url: string | null): string | null {
  if (!url) return null
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    const known: Record<string, string> = {
      'ldlc.com': 'LDLC',
      'topachat.com': 'TopAchat',
      'amazon.fr': 'Amazon',
      'cdiscount.com': 'Cdiscount',
      'materiel.net': 'Materiel.net',
    }
    if (known[host]) return known[host]
    const base = host.split('.')[0]
    return base.charAt(0).toUpperCase() + base.slice(1)
  } catch {
    return null
  }
}

/** Une ligne = un composant figé au moment de l'ajout (snapshot prix neuf + occasion). */
export interface CartLine {
  category: CategoryKey
  productId: string
  name: string
  /** Condition choisie pour cette ligne (neuf par défaut). */
  condition: PriceCondition
  /** Prix moyen neuf (réel) — null si inconnu. */
  priceNew: number | null
  /** Prix moyen occasion (estimé par décote) — null si inconnu. */
  priceUsed: number | null
  /** Prix effectif retenu selon la condition (sert au panier ET à la commande). */
  price: number | null
  merchant: string | null
  url: string | null
}

/** Prix effectif d'une ligne selon sa condition. */
export const lineEffectivePrice = (l: Pick<CartLine, 'condition' | 'priceNew' | 'priceUsed'>): number | null =>
  l.condition === 'occasion' ? l.priceUsed : l.priceNew

const sumComponents = (lines: CartLine[]): number => lines.reduce((acc, l) => acc + (l.price ?? 0), 0)

/** Un article du panier = un PC configuré + une offre de montage + quantité. */
export interface CartItem {
  id: string
  name: string
  lines: CartLine[]
  componentsPrice: number
  assembly: AssemblyTier
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addConfig: (name: string, config: Partial<Record<CategoryKey, Product>>) => void
  removeItem: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  setAssembly: (id: string, assembly: AssemblyTier) => void
  setLineCondition: (itemId: string, productId: string, condition: PriceCondition) => void
  clear: () => void
}

function genId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `c_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addConfig: (name, config) =>
        set((state) => {
          const lines: CartLine[] = (Object.entries(config) as [CategoryKey, Product][])
            .filter(([, p]) => p)
            .map(([category, p]) => {
              const priceNew = getNewPrice(p)?.avg ?? null
              const priceUsed = getUsedPrice(p)?.avg ?? null
              return {
                category,
                productId: p.id,
                name: p.name,
                condition: 'neuf' as PriceCondition,
                priceNew,
                priceUsed,
                price: priceNew,
                merchant: merchantFromUrl(p.retailer_url),
                url: p.retailer_url,
              }
            })
          if (lines.length === 0) return state
          const item: CartItem = { id: genId(), name, lines, componentsPrice: sumComponents(lines), assembly: 'confort', quantity: 1 }
          return { items: [...state.items, item] }
        }),

      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      setQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(10, quantity)) } : i)),
        })),

      setAssembly: (id, assembly) =>
        set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, assembly } : i)) })),

      setLineCondition: (itemId, productId, condition) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id !== itemId) return i
            const lines = i.lines.map((l) =>
              l.productId === productId ? { ...l, condition, price: lineEffectivePrice({ ...l, condition }) } : l,
            )
            return { ...i, lines, componentsPrice: sumComponents(lines) }
          }),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: 'pc-aeris-cart-v2' },
  ),
)

// ── Helpers de calcul ──────────────────────────────────────────────────────────

export const itemUnitPrice = (item: CartItem): number => item.componentsPrice + ASSEMBLY_PRICE[item.assembly]
export const itemTotal = (item: CartItem): number => itemUnitPrice(item) * item.quantity
export const cartCount = (items: CartItem[]): number => items.reduce((acc, i) => acc + i.quantity, 0)
export const cartTotal = (items: CartItem[]): number => items.reduce((acc, i) => acc + itemTotal(i), 0)
