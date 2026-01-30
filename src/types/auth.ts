// User types
export interface User {
  id: string
  email: string
  pseudo?: string
  firstName?: string
  lastName?: string
  phone?: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

// Auth types
export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface SignUpData {
  email: string
  password: string
  pseudo?: string
  firstName?: string
  lastName?: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthError {
  message: string
  code?: string
}
