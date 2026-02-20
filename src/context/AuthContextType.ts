import { createContext } from 'react'
import type { User, SignUpData, SignInData } from '../types'

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signUp: (data: SignUpData) => Promise<{ error: string | null }>
  signIn: (data: SignInData) => Promise<{ user: User | null; error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>
  updateProfile: (data: Partial<User>) => Promise<{ error: string | null }>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
