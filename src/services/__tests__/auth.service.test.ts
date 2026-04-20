import { describe, it, expect } from 'vitest'
import { validateSignUpData } from '../auth.service'

vi.mock('../../config', () => ({
  supabase: { auth: {}, rpc: vi.fn() },
}))

describe('validateSignUpData', () => {
  const baseData = {
    email: 'user@example.com',
    password: 'password123',
    pseudo: 'testuser',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '0600000000',
  }

  it('returns null for valid data', () => {
    expect(validateSignUpData(baseData)).toBeNull()
  })

  it('rejects pseudo containing "admin"', () => {
    expect(validateSignUpData({ ...baseData, pseudo: 'admin' })).toMatch(/réservé/)
    expect(validateSignUpData({ ...baseData, pseudo: 'superadmin' })).toMatch(/réservé/)
    expect(validateSignUpData({ ...baseData, pseudo: 'ADMIN' })).toMatch(/réservé/)
  })

  it('rejects firstName containing "admin"', () => {
    expect(validateSignUpData({ ...baseData, firstName: 'Administrator' })).toMatch(/prénom/)
  })

  it('rejects lastName containing "admin"', () => {
    expect(validateSignUpData({ ...baseData, lastName: 'Admin' })).toMatch(/nom/)
  })

  it('rejects reserved admin email', () => {
    expect(validateSignUpData({ ...baseData, email: 'admin@pcaeris.fr' })).toMatch(/réservé/)
  })

  it('accepts email with different casing from reserved admin email', () => {
    expect(validateSignUpData({ ...baseData, email: 'Admin@pcaeris.fr' })).toMatch(/réservé/)
  })

  it('allows regular users with clean data', () => {
    expect(validateSignUpData({ ...baseData, pseudo: 'jean_dupont42' })).toBeNull()
    expect(validateSignUpData({ ...baseData, email: 'another@mail.com' })).toBeNull()
  })
})
