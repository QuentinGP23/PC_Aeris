import { supabase } from '../config'

export interface Address {
  id: string
  label: string | null
  fullName: string
  address: string
  zip: string
  city: string
  phone: string
  isDefault: boolean
}

/** Champs saisis dans le formulaire d'adresse (sans id ni statut par défaut). */
export interface AddressInput {
  label?: string
  fullName: string
  address: string
  zip: string
  city: string
  phone: string
}

interface AddressRow {
  id: string
  label: string | null
  full_name: string
  address: string
  zip: string
  city: string
  phone: string
  is_default: boolean
}

const fromRow = (r: AddressRow): Address => ({
  id: r.id,
  label: r.label,
  fullName: r.full_name,
  address: r.address,
  zip: r.zip,
  city: r.city,
  phone: r.phone,
  isDefault: r.is_default,
})

const toRow = (input: AddressInput) => ({
  label: input.label?.trim() || null,
  full_name: input.fullName.trim(),
  address: input.address.trim(),
  zip: input.zip.trim(),
  city: input.city.trim(),
  phone: input.phone.trim(),
})

export const addressesService = {
  /** Liste les adresses de l'utilisateur (défaut en premier, puis plus récentes). */
  async list(): Promise<{ data: Address[]; error: string | null }> {
    const { data, error } = await supabase
      .from('addresses')
      .select('id, label, full_name, address, zip, city, phone, is_default')
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })
    if (error) return { data: [], error: error.message }
    return { data: (data ?? []).map((r) => fromRow(r as AddressRow)), error: null }
  },

  /** Crée une adresse. La première adresse devient automatiquement celle par défaut. */
  async create(input: AddressInput, makeDefault = false): Promise<{ data: Address | null; error: string | null }> {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) return { data: null, error: 'Vous devez être connecté.' }

    const { count } = await supabase.from('addresses').select('id', { count: 'exact', head: true })
    const isDefault = makeDefault || (count ?? 0) === 0
    if (isDefault) await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId)

    const { data, error } = await supabase
      .from('addresses')
      .insert({ ...toRow(input), user_id: userId, is_default: isDefault })
      .select('id, label, full_name, address, zip, city, phone, is_default')
      .single()
    if (error) return { data: null, error: error.message }
    return { data: fromRow(data as AddressRow), error: null }
  },

  /** Met à jour une adresse existante. */
  async update(id: string, input: AddressInput): Promise<{ error: string | null }> {
    const { error } = await supabase.from('addresses').update(toRow(input)).eq('id', id)
    return { error: error?.message ?? null }
  },

  /** Définit l'adresse par défaut (et retire le statut aux autres). */
  async setDefault(id: string): Promise<{ error: string | null }> {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) return { error: 'Vous devez être connecté.' }
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId)
    const { error } = await supabase.from('addresses').update({ is_default: true }).eq('id', id)
    return { error: error?.message ?? null }
  },

  /** Supprime une adresse. */
  async remove(id: string): Promise<{ error: string | null }> {
    const { error } = await supabase.from('addresses').delete().eq('id', id)
    return { error: error?.message ?? null }
  },
}
