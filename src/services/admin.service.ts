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
  created_at: string
}

export interface DashboardStats {
  totalProducts: number
  productsByCategory: Record<string, number>
  totalUsers: number
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
  ): Promise<{ products: AdminProduct[]; total: number; error: string | null }> {
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('products')
      .select('id, name, category, manufacturer, series, variant, release_year, image_url, created_at', { count: 'exact' })
      .order('name')
      .range(from, to)

    if (category !== 'all') query = query.eq('category', category)
    if (search.trim()) query = query.ilike('name', `%${search.trim()}%`)

    const { data, error, count } = await query
    if (error) return { products: [], total: 0, error: error.message }
    return { products: (data as AdminProduct[]) || [], total: count ?? 0, error: null }
  },

  async updateProduct(
    id: string,
    updates: { name?: string; manufacturer?: string | null; series?: string | null; variant?: string | null; release_year?: number | null; image_url?: string | null },
  ): Promise<{ error: string | null }> {
    const { error } = await supabase.from('products').update(updates).eq('id', id)
    return { error: error?.message || null }
  },

  async deleteProduct(id: string): Promise<{ error: string | null }> {
    const { error } = await supabase.from('products').delete().eq('id', id)
    return { error: error?.message || null }
  },

  // ── Dashboard stats ───────────────────────────────────────────────────────

  async getDashboardStats(): Promise<{ stats: DashboardStats | null; error: string | null }> {
    const [productsRes, usersRes] = await Promise.all([
      supabase.from('products').select('category'),
      supabase.rpc('admin_list_users'),
    ])

    if (productsRes.error) return { stats: null, error: productsRes.error.message }

    const byCategory: Record<string, number> = {}
    for (const p of productsRes.data ?? []) {
      byCategory[p.category] = (byCategory[p.category] ?? 0) + 1
    }

    return {
      stats: {
        totalProducts: productsRes.data?.length ?? 0,
        productsByCategory: byCategory,
        totalUsers: (usersRes.data ?? []).length,
      },
      error: null,
    }
  },
}
