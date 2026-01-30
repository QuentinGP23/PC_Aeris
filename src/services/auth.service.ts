import { supabase } from '../config'
import type { SignUpData, SignInData, User } from '../types'

export const authService = {
  // Sign up with email and password
  async signUp(data: SignUpData): Promise<{ user: User | null; error: string | null }> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          pseudo: data.pseudo,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
        },
      },
    })

    if (authError) {
      return { user: null, error: authError.message }
    }

    if (!authData.user) {
      return { user: null, error: 'Une erreur est survenue' }
    }

    const user: User = {
      id: authData.user.id,
      email: authData.user.email!,
      pseudo: data.pseudo,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: 'user',
      createdAt: authData.user.created_at,
      updatedAt: authData.user.updated_at || authData.user.created_at,
    }

    return { user, error: null }
  },

  // Sign in with email and password
  async signIn(data: SignInData): Promise<{ user: User | null; error: string | null }> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      return { user: null, error: authError.message }
    }

    if (!authData.user) {
      return { user: null, error: 'Une erreur est survenue' }
    }

    const metadata = authData.user.user_metadata
    const user: User = {
      id: authData.user.id,
      email: authData.user.email!,
      pseudo: metadata?.pseudo,
      firstName: metadata?.first_name,
      lastName: metadata?.last_name,
      phone: metadata?.phone,
      role: metadata?.role || 'user',
      createdAt: authData.user.created_at,
      updatedAt: authData.user.updated_at || authData.user.created_at,
    }

    return { user, error: null }
  },

  // Sign out
  async signOut(): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signOut()
    return { error: error?.message || null }
  },

  // Get current session
  async getSession(): Promise<{ user: User | null; error: string | null }> {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return { user: null, error: error.message }
    }

    if (!data.session?.user) {
      return { user: null, error: null }
    }

    const supaUser = data.session.user
    const metadata = supaUser.user_metadata

    const user: User = {
      id: supaUser.id,
      email: supaUser.email!,
      pseudo: metadata?.pseudo,
      firstName: metadata?.first_name,
      lastName: metadata?.last_name,
      phone: metadata?.phone,
      role: metadata?.role || 'user',
      createdAt: supaUser.created_at,
      updatedAt: supaUser.updated_at || supaUser.created_at,
    }

    return { user, error: null }
  },

  // Reset password
  async resetPassword(email: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: error?.message || null }
  },

  // Update password
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { error: error?.message || null }
  },

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.updateUser({
      data: {
        pseudo: data.pseudo,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      },
    })
    return { error: error?.message || null }
  },

  // Subscribe to auth changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const metadata = session.user.user_metadata
        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          pseudo: metadata?.pseudo,
          firstName: metadata?.first_name,
          lastName: metadata?.last_name,
          phone: metadata?.phone,
          role: metadata?.role || 'user',
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at || session.user.created_at,
        }
        callback(user)
      } else {
        callback(null)
      }
    })
  },
}
