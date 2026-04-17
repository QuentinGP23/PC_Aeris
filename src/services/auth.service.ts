import { supabase } from '../config'
import type { SignUpData, SignInData, User } from '../types'

// Admin credentials (hardcoded for now)
const ADMIN_EMAIL = 'admin@pcaeris.fr'
const ADMIN_PSEUDO = 'admin'

// Helper to check if a value contains "admin" (case insensitive)
const containsAdmin = (value: string | undefined): boolean => {
  if (!value) return false
  return value.toLowerCase().includes('admin')
}

// Helper to validate sign up data doesn't use reserved admin terms
export const validateSignUpData = (data: SignUpData): string | null => {
  if (containsAdmin(data.pseudo)) {
    return 'Le pseudo "admin" est réservé'
  }
  if (containsAdmin(data.firstName)) {
    return 'Le prénom ne peut pas contenir "admin"'
  }
  if (containsAdmin(data.lastName)) {
    return 'Le nom ne peut pas contenir "admin"'
  }
  if (data.email.toLowerCase() === ADMIN_EMAIL) {
    return 'Cet email est réservé'
  }
  return null
}

// Helper to check if identifier is email
const isEmail = (identifier: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
}

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
          phone_number: data.phone,
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

  // Sign in with email or pseudo and password
  async signIn(data: SignInData): Promise<{ user: User | null; error: string | null }> {
    let email = data.identifier
    
    // If identifier is not an email, it's a pseudo - need to find the email
    if (!isEmail(data.identifier)) {
      // Check if it's the admin
      if (data.identifier.toLowerCase() === ADMIN_PSEUDO) {
        email = ADMIN_EMAIL
      } else {
        const { data: foundEmail, error: rpcError } = await supabase.rpc('get_email_by_pseudo', { p_pseudo: data.identifier })
        if (rpcError || !foundEmail) {
          return { user: null, error: 'Pseudo introuvable.' }
        }
        email = foundEmail
      }
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
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
      phone: metadata?.phone_number,
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
      phone: metadata?.phone_number,
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
        phone_number: data.phone,
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
          phone: metadata?.phone_number,
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
