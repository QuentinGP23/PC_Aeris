import { create } from 'zustand'
import type { CategoryKey, Product } from '../types'

interface ConfigStore {
  config: Partial<Record<CategoryKey, Product>>
  selectComponent: (category: CategoryKey, product: Product) => void
  removeComponent: (category: CategoryKey) => void
  clearConfig: () => void
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: {},
  selectComponent: (category, product) =>
    set((state) => ({ config: { ...state.config, [category]: product } })),
  removeComponent: (category) =>
    set((state) => {
      const next = { ...state.config }
      delete next[category]
      return { config: next }
    }),
  clearConfig: () => set({ config: {} }),
}))
