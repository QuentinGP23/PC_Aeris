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

export interface OrderAdmin extends OrderSummary {
  user_id: string
  client_email: string | null
  client_name: string | null
  shipping: { fullName?: string; address?: string; zip?: string; city?: string; phone?: string } | null
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

  /** Envoie le devis PDF par email au client et aux admins (Edge Function). Best-effort. */
  async emailDevis(payload: { orderId: string; clientName: string; total: number; pdfBase64: string }): Promise<{ error: string | null }> {
    const { error } = await supabase.functions.invoke('send-devis', { body: payload })
    return { error: error ? error.message : null }
  },

  /** Commandes de l'utilisateur connecté (RLS : les siennes uniquement). */
  async list(): Promise<{ data: OrderSummary[]; error: string | null }> {
    const { data, error } = await supabase
      .from('orders')
      .select('id, items, total_eur, status, created_at')
      .order('created_at', { ascending: false })
    if (error) return { data: [], error: error.message }
    return { data: (data ?? []) as OrderSummary[], error: null }
  },

  /** Toutes les commandes (admin). */
  async adminList(): Promise<{ data: OrderAdmin[]; error: string | null }> {
    const { data, error } = await supabase.rpc('admin_list_orders')
    if (error) return { data: [], error: error.message }
    return { data: (data ?? []) as OrderAdmin[], error: null }
  },

  /** Change le statut d'une commande (admin). */
  async adminUpdateStatus(orderId: string, status: string): Promise<{ error: string | null }> {
    const { error } = await supabase.rpc('admin_update_order_status', { order_id: orderId, new_status: status })
    return { error: error?.message ?? null }
  },
}
