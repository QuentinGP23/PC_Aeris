import { supabase } from '../config'

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

export const adminService = {
  async listUsers(): Promise<{ users: AdminUser[]; error: string | null }> {
    const { data, error } = await supabase.rpc('admin_list_users')

    if (error) {
      return { users: [], error: error.message }
    }

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
    const { error } = await supabase.rpc('admin_delete_user', {
      target_user_id: userId,
    })

    return { error: error?.message || null }
  },
}
