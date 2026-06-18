import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CategoryKey, Product } from '../types'
import { ASSEMBLY_PRICE, type AssemblyTier } from '../constants'

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

/** Une ligne = un composant figé au moment de l'ajout (snapshot prix/marchand). */
export interface CartLine {
  category: CategoryKey
  productId: string
  name: string
  price: number | null
  merchant: string | null
  url: string | null
}

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
            .map(([category, p]) => ({
              category,
              productId: p.id,
              name: p.name,
              // « meilleur prix » de sourcing : on prend le prix bas, sinon la moyenne.
              price: p.price_min_eur ?? p.price_avg_eur ?? null,
              merchant: merchantFromUrl(p.retailer_url),
              url: p.retailer_url,
            }))
          if (lines.length === 0) return state
          const componentsPrice = lines.reduce((acc, l) => acc + (l.price ?? 0), 0)
          const item: CartItem = { id: genId(), name, lines, componentsPrice, assembly: 'confort', quantity: 1 }
          return { items: [...state.items, item] }
        }),

      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      setQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(10, quantity)) } : i)),
        })),

      setAssembly: (id, assembly) =>
        set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, assembly } : i)) })),

      clear: () => set({ items: [] }),
    }),
    { name: 'pc-aeris-cart' },
  ),
)

// ── Helpers de calcul ──────────────────────────────────────────────────────────

export const itemUnitPrice = (item: CartItem): number => item.componentsPrice + ASSEMBLY_PRICE[item.assembly]
export const itemTotal = (item: CartItem): number => itemUnitPrice(item) * item.quantity
export const cartCount = (items: CartItem[]): number => items.reduce((acc, i) => acc + i.quantity, 0)
export const cartTotal = (items: CartItem[]): number => items.reduce((acc, i) => acc + itemTotal(i), 0)
