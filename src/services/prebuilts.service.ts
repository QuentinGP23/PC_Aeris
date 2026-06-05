import { supabase } from '../config'
import type { CategoryKey } from '../types'
import { savedConfigsService } from './savedConfigs.service'

export type PrebuiltUsage = 'gaming' | 'creation' | 'bureautique' | 'streaming'
export type PrebuiltTier = 'entree' | 'milieu' | 'haut'

export interface PrebuiltConfig {
  id: string
  slug: string
  name: string
  usage: PrebuiltUsage
  tier: PrebuiltTier
  summary: string | null
  components: Partial<Record<CategoryKey, string>>
  est_budget_min: number | null
  est_budget_max: number | null
}

export const prebuiltsService = {
  async list(): Promise<{ data: PrebuiltConfig[]; error: string | null }> {
    const { data, error } = await supabase
      .from('prebuilt_configs')
      .select('id, slug, name, usage, tier, summary, components, est_budget_min, est_budget_max')
      .order('sort_order', { ascending: true })
    if (error) return { data: [], error: error.message }
    return { data: (data ?? []) as PrebuiltConfig[], error: null }
  },

  /** Re-fetch les produits de la config (réutilise la logique des configs sauvegardées). */
  hydrate(pc: PrebuiltConfig) {
    return savedConfigsService.hydrate({
      id: pc.id,
      name: pc.name,
      components: pc.components,
      created_at: '',
      updated_at: '',
    })
  },
}
