import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Remember-me flag (US-016) :
 * Si activé, la session est persistée dans localStorage (par défaut Supabase).
 * Sinon, on bascule sur sessionStorage : la session expire à la fermeture du
 * navigateur. Le flag est lui-même conservé dans localStorage pour survivre aux
 * rechargements de page.
 */
const REMEMBER_KEY = 'pc-aeris-remember-session'

export function setRememberMe(value: boolean) {
  if (typeof window === 'undefined') return
  if (value) window.localStorage.setItem(REMEMBER_KEY, 'true')
  else window.localStorage.removeItem(REMEMBER_KEY)
}

function shouldRemember(): boolean {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(REMEMBER_KEY) === 'true'
}

const switchableStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    const store = shouldRemember() ? window.localStorage : window.sessionStorage
    return store.getItem(key)
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    const store = shouldRemember() ? window.localStorage : window.sessionStorage
    store.setItem(key, value)
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(key)
    window.sessionStorage.removeItem(key)
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: switchableStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
})
