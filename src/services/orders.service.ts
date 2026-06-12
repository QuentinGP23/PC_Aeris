import { supabase } from '../config'
import type { CartItem } from '../store'

export interface ShippingAddress {
  fullName: string
  address: string
  zip: string
  city: string
  phone: string
}

export interface OrderSummary {
  id: string
  items: CartItem[]
  total_eur: number
  status: string
  created_at: string
}

export const ordersService = {
  /** Crée une commande (paiement simulé : statut « paid »). */
  async create(
    items: CartItem[],
    total: number,
    shipping: ShippingAddress,
  ): Promise<{ id: string | null; error: string | null }> {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) return { id: null, error: 'Vous devez être connecté pour commander.' }

    const { data, error } = await supabase
      .from('orders')
      .insert({ user_id: userId, items, total_eur: total, shipping, status: 'paid' })
      .select('id')
      .single()

    if (error) return { id: null, error: error.message }
    return { id: data.id as string, error: null }
  },

  async list(): Promise<{ data: OrderSummary[]; error: string | null }> {
    const { data, error } = await supabase
      .from('orders')
      .select('id, items, total_eur, status, created_at')
      .order('created_at', { ascending: false })
    if (error) return { data: [], error: error.message }
    return { data: (data ?? []) as OrderSummary[], error: null }
  },
}
