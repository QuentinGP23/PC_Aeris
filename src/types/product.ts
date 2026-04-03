export interface Product {
  id: string
  name: string
  manufacturer: string | null
  series: string | null
  variant: string | null
  release_year: number | null
  category: string
  image_url: string | null
  description: string | null
  price_min_eur: number | null
  price_max_eur: number | null
  price_avg_eur: number | null
  price_updated_at: string | null
  retailer_url: string | null
  benchmark_score: number | null
  specs: Record<string, unknown> | null
}

export type CategoryKey =
  | 'cpu'
  | 'gpu'
  | 'ram'
  | 'motherboard'
  | 'storage'
  | 'psu'
  | 'pc_case'
  | 'cpu_cooler'

export interface Category {
  value: CategoryKey
  label: string
  specsTable: string
  icon: string
}

export const CATEGORIES: Category[] = [
  { value: 'cpu',         label: 'Processeur',      specsTable: 'cpu_specs',         icon: '🖥️' },
  { value: 'motherboard', label: 'Carte mère',       specsTable: 'motherboard_specs', icon: '🔌' },
  { value: 'ram',         label: 'RAM',              specsTable: 'ram_specs',         icon: '💾' },
  { value: 'gpu',         label: 'Carte graphique',  specsTable: 'gpu_specs',         icon: '🎮' },
  { value: 'storage',     label: 'Stockage',         specsTable: 'storage_specs',     icon: '💿' },
  { value: 'psu',         label: 'Alimentation',     specsTable: 'psu_specs',         icon: '⚡' },
  { value: 'pc_case',     label: 'Boîtier',          specsTable: 'pc_case_specs',     icon: '📦' },
  { value: 'cpu_cooler',  label: 'Ventirad',         specsTable: 'cpu_cooler_specs',  icon: '❄️' },
]

// Key specs displayed on product cards — aligned with actual DB column names
