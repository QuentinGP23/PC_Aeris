import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CategoryKey, Product } from '../types'
import { cascadeInvalidations } from '../utils/selection-order'

export { useToast, useToastStore } from './toastStore'
export type { ToastVariant, Toast } from './toastStore'
export { useCartStore, itemUnitPrice, itemTotal, cartCount, cartTotal } from './cartStore'
export type { CartItem, CartLine } from './cartStore'

interface ConfigStore {
  config: Partial<Record<CategoryKey, Product>>
  /** Dernière cascade d'invalidation (catégories retirées automatiquement). */
  lastInvalidated: CategoryKey[]
  /** Id de la config chargée depuis Supabase (null si config locale non sauvegardée). */
  loadedConfigId: string | null
  loadedConfigName: string | null
  selectComponent: (category: CategoryKey, product: Product) => void
  removeComponent: (category: CategoryKey) => void
  loadConfig: (id: string, name: string, products: Partial<Record<CategoryKey, Product>>) => void
  setLoadedConfigName: (name: string) => void
  clearInvalidated: () => void
  clearConfig: () => void
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: {},
      lastInvalidated: [],
      loadedConfigId: null,
      loadedConfigName: null,
      selectComponent: (category, product) =>
        set((state) => {
          const next: Partial<Record<CategoryKey, Product>> = { ...state.config, [category]: product }
          const invalidated = cascadeInvalidations(category, next)
          for (const cat of invalidated) delete next[cat]
          return { config: next, lastInvalidated: invalidated }
        }),
      removeComponent: (category) =>
        set((state) => {
          const next = { ...state.config }
          delete next[category]
          const invalidated = cascadeInvalidations(category, next)
          for (const cat of invalidated) delete next[cat]
          return { config: next, lastInvalidated: invalidated }
        }),
      loadConfig: (id, name, products) =>
        set({ config: products, lastInvalidated: [], loadedConfigId: id, loadedConfigName: name }),
      setLoadedConfigName: (name) => set({ loadedConfigName: name }),
      clearInvalidated: () => set({ lastInvalidated: [] }),
      clearConfig: () => set({ config: {}, lastInvalidated: [], loadedConfigId: null, loadedConfigName: null }),
    }),
    {
      name: 'pc-aeris-config',
      partialize: (state) => ({
        config: state.config,
        loadedConfigId: state.loadedConfigId,
        loadedConfigName: state.loadedConfigName,
      }),
    },
  ),
)
