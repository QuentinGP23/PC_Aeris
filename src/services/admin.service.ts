import { supabase } from '../config'
import type { CategoryKey } from '../types'

export interface AdminUser {
  id: string
  email: string
  pseudo: string | null
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  role: string
  created_at: string
}

export interface AdminProduct {
  id: string
  name: string
  category: CategoryKey
  manufacturer: string | null
  series: string | null
  variant: string | null
  release_year: number | null
  image_url: string | null
  price_min_eur: number | null
  price_max_eur: number | null
  price_avg_eur: number | null
  created_at: string
}

export interface CreateProductInput {
  name: string
  category: CategoryKey
  manufacturer?: string | null
  series?: string | null
  variant?: string | null
  release_year?: number | null
  image_url?: string | null
  price_min_eur?: number | null
  price_max_eur?: number | null
  price_avg_eur?: number | null
}

export interface UpdateProductInput {
  name?: string
  manufacturer?: string | null
  series?: string | null
  variant?: string | null
  release_year?: number | null
  image_url?: string | null
  price_min_eur?: number | null
  price_max_eur?: number | null
  price_avg_eur?: number | null
}

export interface DashboardStats {
  totalProducts: number
  productsByCategory: Record<string, number>
  totalUsers: number
  withImage: number
  withPrice: number
}

const PAGE_SIZE = 50

export const adminService = {
  // ── Users ────────────────────────────────────────────────────────────────

  async listUsers(): Promise<{ users: AdminUser[]; error: string | null }> {
    const { data, error } = await supabase.rpc('admin_list_users')
    if (error) return { users: [], error: error.message }
    return { users: data || [], error: null }
  },

  async updateUser(
    userId: string,
    updates: { pseudo?: string; first_name?: string; last_name?: string; phone_number?: string; role?: string },
  ): Promise<{ error: string | null }> {
    const { error } = await supabase.rpc('admin_update_user', {
      target_user_id: userId,
      new_metadata: updates,
    })
    return { error: error?.message || null }
  },

  async deleteUser(userId: string): Promise<{ error: string | null }> {
    const { error } = await supabase.rpc('admin_delete_user', { target_user_id: userId })
    return { error: error?.message || null }
  },

  // ── Products ─────────────────────────────────────────────────────────────

  async listProducts(
    category: CategoryKey | 'all',
    page: number,
    search: string,
    sortBy: string = 'name',
    sortDir: 'asc' | 'desc' = 'asc',
  ): Promise<{ products: AdminProduct[]; total: number; error: string | null }> {
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('products')
      .select('id, name, category, manufacturer, series, variant, release_year, image_url, price_min_eur, price_max_eur, price_avg_eur, created_at', { count: 'exact' })
      .order(sortBy, { ascending: sortDir === 'asc', nullsFirst: false })
      .range(from, to)

    if (category !== 'all') query = query.eq('category', category)
    if (search.trim()) query = query.ilike('name', `%${search.trim()}%`)

    const { data, error, count } = await query
    if (error) return { products: [], total: 0, error: error.message }
    return { products: (data as AdminProduct[]) || [], total: count ?? 0, error: null }
  },

  async createProduct(
    input: CreateProductInput,
  ): Promise<{ product: AdminProduct | null; error: string | null }> {
    const { data, error } = await supabase
      .from('products')
      .insert(input)
      .select('id, name, category, manufacturer, series, variant, release_year, image_url, price_min_eur, price_max_eur, price_avg_eur, created_at')
      .single()
    if (error) return { product: null, error: error.message }
    return { product: data as AdminProduct, error: null }
  },

  async updateProduct(
    id: string,
    updates: UpdateProductInput,
  ): Promise<{ error: string | null }> {
    const { error } = await supabase.from('products').update(updates).eq('id', id)
    return { error: error?.message || null }
  },

  async deleteProduct(id: string): Promise<{ error: string | null }> {
    const { error } = await supabase.from('products').delete().eq('id', id)
    return { error: error?.message || null }
  },

  async getProductSpecs(
    productId: string,
    specsTable: string,
  ): Promise<{ specs: Record<string, unknown> | null; error: string | null }> {
    const { data, error } = await supabase
      .from(specsTable)
      .select('*')
      .eq('product_id', productId)
      .single()
    if (error) return { specs: null, error: error.message }
    return { specs: data as Record<string, unknown>, error: null }
  },

  async updateProductSpecs(
    productId: string,
    specsTable: string,
    updates: Record<string, unknown>,
  ): Promise<{ error: string | null }> {
    const { error } = await supabase
      .from(specsTable)
      .update(updates)
      .eq('product_id', productId)
    return { error: error?.message || null }
  },

  async createProductSpecs(
    productId: string,
    specsTable: string,
    specs: Record<string, unknown>,
  ): Promise<{ error: string | null }> {
    const { error } = await supabase
      .from(specsTable)
      .insert({ product_id: productId, ...specs })
    return { error: error?.message || null }
  },

  // ── Dashboard stats ───────────────────────────────────────────────────────

  async getDashboardStats(): Promise<{ stats: DashboardStats | null; error: string | null }> {
    const CATS: CategoryKey[] = ['cpu', 'gpu', 'ram', 'motherboard', 'storage', 'psu', 'pc_case', 'cpu_cooler']

    const [totalRes, withImageRes, withPriceRes, usersRes, ...catRess] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).not('image_url', 'is', null),
      supabase.from('products').select('*', { count: 'exact', head: true }).not('price_avg_eur', 'is', null),
      supabase.rpc('admin_list_users'),
      ...CATS.map((cat) =>
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('category', cat),
      ),
    ])

    if (totalRes.error) return { stats: null, error: totalRes.error.message }

    const byCategory: Record<string, number> = {}
    CATS.forEach((cat, i) => { byCategory[cat] = catRess[i].count ?? 0 })

    return {
      stats: {
        totalProducts: totalRes.count ?? 0,
        productsByCategory: byCategory,
        totalUsers: (usersRes.data ?? []).length,
        withImage: withImageRes.count ?? 0,
        withPrice: withPriceRes.count ?? 0,
      },
      error: null,
    }
  },
}
