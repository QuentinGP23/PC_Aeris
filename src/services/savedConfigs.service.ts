import { supabase } from '../config'
import type { CategoryKey, Product } from '../types'

export interface SavedConfig {
  id: string
  name: string
  components: Partial<Record<CategoryKey, string>>
  created_at: string
  updated_at: string
}

export interface SavedConfigWithProducts extends SavedConfig {
  products: Partial<Record<CategoryKey, Product>>
  missing: CategoryKey[]
}

export const savedConfigsService = {
  async list(): Promise<{ data: SavedConfig[]; error: string | null }> {
    const { data, error } = await supabase
      .from('saved_configs')
      .select('id, name, components, created_at, updated_at')
      .order('updated_at', { ascending: false })

    if (error) return { data: [], error: error.message }
    return { data: (data ?? []) as SavedConfig[], error: null }
  },

  async create(
    name: string,
    components: Partial<Record<CategoryKey, string>>,
  ): Promise<{ data: SavedConfig | null; error: string | null }> {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) return { data: null, error: 'Utilisateur non connecté' }

    const { data, error } = await supabase
      .from('saved_configs')
      .insert({ user_id: userId, name: name.trim(), components })
      .select('id, name, components, created_at, updated_at')
      .single()

    if (error) return { data: null, error: error.message }
    return { data: data as SavedConfig, error: null }
  },

  async rename(id: string, name: string): Promise<{ error: string | null }> {
    const { error } = await supabase
      .from('saved_configs')
      .update({ name: name.trim() })
      .eq('id', id)
    return { error: error?.message ?? null }
  },

  async delete(id: string): Promise<{ error: string | null }> {
    const { error } = await supabase.from('saved_configs').delete().eq('id', id)
    return { error: error?.message ?? null }
  },

  /**
   * Recharge une config : re-fetch chaque produit par son id, distingue les manquants
   * (produit supprimé ou inaccessible) des présents.
   */
  async hydrate(config: SavedConfig): Promise<SavedConfigWithProducts> {
    const ids = Object.values(config.components).filter(Boolean) as string[]
    if (ids.length === 0) {
      return { ...config, products: {}, missing: [] }
    }

    const { data, error } = await supabase
      .from('products')
      .select(
        'id, name, manufacturer, series, variant, release_year, category, image_url, description, price_min_eur, price_max_eur, price_avg_eur, price_updated_at, retailer_url, benchmark_score',
      )
      .in('id', ids)

    const byId = new Map<string, Product>()
    if (!error && data) {
      for (const p of data) {
        byId.set(p.id, { ...(p as Product), specs: null })
      }
    }

    const products: Partial<Record<CategoryKey, Product>> = {}
    const missing: CategoryKey[] = []
    for (const [cat, pid] of Object.entries(config.components) as [CategoryKey, string][]) {
      if (!pid) continue
      const prod = byId.get(pid)
      if (prod) products[cat] = prod
      else missing.push(cat)
    }

    return { ...config, products, missing }
  },
}
