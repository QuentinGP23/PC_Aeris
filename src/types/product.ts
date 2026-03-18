export interface Product {
  id: string
  name: string
  manufacturer: string | null
  series: string | null
  release_year: number | null
  category: string
  image_url: string | null
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
  { value: 'cpu',        label: 'Processeur',   specsTable: 'cpu_specs',        icon: '🖥️' },
  { value: 'motherboard',label: 'Carte mère',   specsTable: 'motherboard_specs',icon: '🔌' },
  { value: 'ram',        label: 'RAM',           specsTable: 'ram_specs',        icon: '💾' },
  { value: 'gpu',        label: 'Carte graphique',specsTable: 'gpu_specs',       icon: '🎮' },
  { value: 'storage',    label: 'Stockage',      specsTable: 'storage_specs',    icon: '💿' },
  { value: 'psu',        label: 'Alimentation',  specsTable: 'psu_specs',        icon: '⚡' },
  { value: 'pc_case',    label: 'Boîtier',       specsTable: 'pc_case_specs',    icon: '📦' },
  { value: 'cpu_cooler', label: 'Ventirad',      specsTable: 'cpu_cooler_specs', icon: '❄️' },
]

// Key specs to display per category
export const KEY_SPECS: Record<CategoryKey, string[]> = {
  cpu:         ['socket', 'total_cores', 'threads', 'perf_boost_clock'],
  motherboard: ['socket', 'form_factor', 'memory_type', 'memory_slots'],
  ram:         ['memory_type', 'speed_mhz', 'modules', 'capacity_per_module_gb'],
  gpu:         ['vram_gb', 'memory_type', 'boost_clock_mhz', 'tdp_watts'],
  storage:     ['capacity_gb', 'type', 'interface', 'read_speed_mbps'],
  psu:         ['wattage', 'efficiency_rating', 'modular'],
  pc_case:     ['type', 'form_factor', 'side_panel'],
  cpu_cooler:  ['type', 'fan_rpm_max', 'noise_level_dba'],
}
