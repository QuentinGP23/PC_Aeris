import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CategoryKey, Product } from '../types'
import { cascadeInvalidations } from '../utils/selection-order'

export { useToast, useToastStore } from './toastStore'
export type { ToastVariant, Toast } from './toastStore'

interface ConfigStore {
  config: Partial<Record<CategoryKey, Product>>
  /** Dernière cascade d'invalidation (catégories retirées automatiquement). */
  lastInvalidated: CategoryKey[]
  selectComponent: (category: CategoryKey, product: Product) => void
  removeComponent: (category: CategoryKey) => void
  clearInvalidated: () => void
  clearConfig: () => void
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: {},
      lastInvalidated: [],
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
      clearInvalidated: () => set({ lastInvalidated: [] }),
      clearConfig: () => set({ config: {}, lastInvalidated: [] }),
    }),
    {
      name: 'pc-aeris-config',
      partialize: (state) => ({ config: state.config }),
    },
  ),
)
