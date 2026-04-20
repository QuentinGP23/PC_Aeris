import { describe, it, expect, vi, beforeEach } from 'vitest'

const { signInWithPassword, rpc } = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  rpc: vi.fn(),
}))

vi.mock('../../config', () => ({
  supabase: {
    auth: { signInWithPassword },
    rpc,
  },
}))

import { authService } from '../auth.service'

const fakeAuthUser = {
  id: 'u-1',
  email: 'jean@example.com',
  user_metadata: { pseudo: 'jean', first_name: 'Jean', last_name: 'Dupont', role: 'user' },
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('authService.signIn — integration flows', () => {
  it('email identifier: skips RPC, calls signInWithPassword directly', async () => {
    signInWithPassword.mockResolvedValue({ data: { user: fakeAuthUser }, error: null })

    const { user, error } = await authService.signIn({
      identifier: 'jean@example.com',
      password: 'pw',
    })

    expect(rpc).not.toHaveBeenCalled()
    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'jean@example.com', password: 'pw' })
    expect(user?.pseudo).toBe('jean')
    expect(error).toBeNull()
  })

  it('admin pseudo: resolves to hardcoded admin email without RPC', async () => {
    signInWithPassword.mockResolvedValue({
      data: { user: { ...fakeAuthUser, email: 'admin@pcaeris.fr', user_metadata: { role: 'admin' } } },
      error: null,
    })

    const { user, error } = await authService.signIn({ identifier: 'admin', password: 'pw' })

    expect(rpc).not.toHaveBeenCalled()
    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'admin@pcaeris.fr', password: 'pw' })
    expect(user?.role).toBe('admin')
    expect(error).toBeNull()
  })

  it('regular pseudo: calls RPC to resolve email then signs in', async () => {
    rpc.mockResolvedValue({ data: 'jean@example.com', error: null })
    signInWithPassword.mockResolvedValue({ data: { user: fakeAuthUser }, error: null })

    const { user, error } = await authService.signIn({ identifier: 'jean', password: 'pw' })

    expect(rpc).toHaveBeenCalledWith('get_email_by_pseudo', { p_pseudo: 'jean' })
    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'jean@example.com', password: 'pw' })
    expect(user).toBeTruthy()
    expect(error).toBeNull()
  })

  it('unknown pseudo: RPC returns null → returns "Pseudo introuvable" without calling auth', async () => {
    rpc.mockResolvedValue({ data: null, error: null })

    const { user, error } = await authService.signIn({ identifier: 'inexistant', password: 'pw' })

    expect(rpc).toHaveBeenCalled()
    expect(signInWithPassword).not.toHaveBeenCalled()
    expect(user).toBeNull()
    expect(error).toBe('Pseudo introuvable.')
  })

  it('RPC error: surfaces "Pseudo introuvable" and skips auth', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'boom' } })

    const { error } = await authService.signIn({ identifier: 'jean', password: 'pw' })

    expect(signInWithPassword).not.toHaveBeenCalled()
    expect(error).toBe('Pseudo introuvable.')
  })

  it('wrong password: surfaces Supabase auth error', async () => {
    signInWithPassword.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid credentials' } })

    const { user, error } = await authService.signIn({
      identifier: 'jean@example.com',
      password: 'wrong',
    })

    expect(user).toBeNull()
    expect(error).toBe('Invalid credentials')
  })
})
