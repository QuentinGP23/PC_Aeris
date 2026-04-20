import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCompatibleProductIds } from '../compatibility'
import type { Product } from '../../types'

// Chainable mock that resolves with configurable data
let mockResolvedData: { product_id: string; form_factor?: string }[] = []

const mockBuilder = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  contains: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  then(resolve: (v: { data: typeof mockResolvedData; error: null }) => void) {
    return Promise.resolve({ data: mockResolvedData, error: null }).then(resolve)
  },
}

vi.mock('../../config', () => ({
  supabase: { from: vi.fn(() => mockBuilder) },
}))

function makeProduct(specs: Record<string, unknown>): Product {
  return {
    id: 'p1',
    name: 'Test',
    manufacturer: 'Test',
    series: null,
    variant: null,
    release_year: null,
    category: 'cpu',
    image_url: null,
    description: null,
    price_min_eur: null,
    price_max_eur: null,
    price_avg_eur: null,
    price_updated_at: null,
    retailer_url: null,
    benchmark_score: null,
    specs,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockResolvedData = []
})

describe('getCompatibleProductIds', () => {
  describe('cpu', () => {
    it('returns filtered:false when no motherboard selected', async () => {
      const result = await getCompatibleProductIds('cpu', {})
      expect(result.filtered).toBe(false)
    })

    it('returns filtered:false when motherboard has no socket', async () => {
      const result = await getCompatibleProductIds('cpu', {
        motherboard: makeProduct({}),
      })
      expect(result.filtered).toBe(false)
    })

    it('queries cpu_specs by socket and returns ids', async () => {
      mockResolvedData = [{ product_id: 'cpu-1' }, { product_id: 'cpu-2' }]
      const result = await getCompatibleProductIds('cpu', {
        motherboard: makeProduct({ socket: 'AM4' }),
      })
      expect(result.filtered).toBe(true)
      expect(result.productIds).toEqual(['cpu-1', 'cpu-2'])
      expect(result.reason).toBe('Socket AM4')
      expect(mockBuilder.eq).toHaveBeenCalledWith('socket', 'AM4')
    })
  })

  describe('ram', () => {
    it('returns filtered:false when no motherboard selected', async () => {
      const result = await getCompatibleProductIds('ram', {})
      expect(result.filtered).toBe(false)
    })

    it('queries ram_specs by ram_type', async () => {
      mockResolvedData = [{ product_id: 'ram-1' }]
      const result = await getCompatibleProductIds('ram', {
        motherboard: makeProduct({ ram_type: 'DDR5' }),
      })
      expect(result.filtered).toBe(true)
      expect(result.productIds).toEqual(['ram-1'])
      expect(result.reason).toBe('DDR5')
      expect(mockBuilder.eq).toHaveBeenCalledWith('ram_type', 'DDR5')
    })
  })

  describe('cpu_cooler', () => {
    it('returns filtered:false when no cpu selected', async () => {
      const result = await getCompatibleProductIds('cpu_cooler', {})
      expect(result.filtered).toBe(false)
    })

    it('queries cpu_cooler_specs by socket array containment', async () => {
      mockResolvedData = [{ product_id: 'cooler-1' }]
      const result = await getCompatibleProductIds('cpu_cooler', {
        cpu: makeProduct({ socket: 'LGA1700' }),
      })
      expect(result.filtered).toBe(true)
      expect(result.productIds).toEqual(['cooler-1'])
      expect(mockBuilder.contains).toHaveBeenCalledWith('cpu_sockets', ['LGA1700'])
    })
  })

  describe('pc_case', () => {
    it('returns filtered:false when no motherboard selected', async () => {
      const result = await getCompatibleProductIds('pc_case', {})
      expect(result.filtered).toBe(false)
    })

    it('queries pc_case_specs by form_factor containment', async () => {
      mockResolvedData = [{ product_id: 'case-1' }]
      const result = await getCompatibleProductIds('pc_case', {
        motherboard: makeProduct({ form_factor: 'ATX' }),
      })
      expect(result.filtered).toBe(true)
      expect(result.productIds).toEqual(['case-1'])
      expect(mockBuilder.contains).toHaveBeenCalledWith('supported_mobo_form_factors', ['ATX'])
    })
  })

  describe('motherboard', () => {
    it('returns filtered:false when neither cpu nor pc_case selected', async () => {
      const result = await getCompatibleProductIds('motherboard', {})
      expect(result.filtered).toBe(false)
    })

    it('filters by cpu socket only', async () => {
      mockResolvedData = [{ product_id: 'mb-1', form_factor: 'ATX' }]
      const result = await getCompatibleProductIds('motherboard', {
        cpu: makeProduct({ socket: 'AM5' }),
      })
      expect(result.filtered).toBe(true)
      expect(result.productIds).toEqual(['mb-1'])
      expect(mockBuilder.eq).toHaveBeenCalledWith('socket', 'AM5')
    })

    it('filters by both socket and case form factors', async () => {
      mockResolvedData = [
        { product_id: 'mb-1', form_factor: 'ATX' },
        { product_id: 'mb-2', form_factor: 'mATX' },
      ]
      const result = await getCompatibleProductIds('motherboard', {
        cpu: makeProduct({ socket: 'AM5' }),
        pc_case: makeProduct({ supported_mobo_form_factors: ['ATX'] }),
      })
      expect(result.filtered).toBe(true)
      expect(result.productIds).toEqual(['mb-1'])
    })
  })

  describe('psu', () => {
    it('returns filtered:false when no gpu or cpu tdp', async () => {
      const result = await getCompatibleProductIds('psu', {})
      expect(result.filtered).toBe(false)
    })

    it('calculates min wattage from gpu+cpu TDP with 20% headroom', async () => {
      mockResolvedData = [{ product_id: 'psu-1' }]
      // gpu: 300W, cpu: 65W → system = 300+65+100 = 465W → min = ceil(465*1.2) = 558W
      const result = await getCompatibleProductIds('psu', {
        gpu: makeProduct({ tdp: 300 }),
        cpu: makeProduct({ tdp: 65 }),
      })
      expect(result.filtered).toBe(true)
      expect(mockBuilder.gte).toHaveBeenCalledWith('wattage', 558)
      expect(result.reason).toContain('558W')
    })

    it('works with gpu only (no cpu)', async () => {
      mockResolvedData = []
      // gpu: 200W → system = 200+0+100 = 300W → min = ceil(300*1.2) = 360W
      await getCompatibleProductIds('psu', {
        gpu: makeProduct({ tdp: 200 }),
      })
      expect(mockBuilder.gte).toHaveBeenCalledWith('wattage', 360)
    })
  })

  describe('storage', () => {
    it('returns filtered:false when no motherboard selected', async () => {
      const result = await getCompatibleProductIds('storage', {})
      expect(result.filtered).toBe(false)
    })

    it('returns filtered:false when motherboard has both M.2 and SATA', async () => {
      const result = await getCompatibleProductIds('storage', {
        motherboard: makeProduct({ m2_slots: 2, sata_6gbs: 4 }),
      })
      expect(result.filtered).toBe(false)
    })

    it('excludes NVMe when motherboard has no M.2 slot', async () => {
      mockResolvedData = [{ product_id: 'sata-1' }]
      const result = await getCompatibleProductIds('storage', {
        motherboard: makeProduct({ m2_slots: 0, sata_6gbs: 4 }),
      })
      expect(result.filtered).toBe(true)
      expect(mockBuilder.eq).toHaveBeenCalledWith('nvme', false)
      expect(result.reason).toContain('SATA')
    })

    it('excludes SATA when motherboard has no SATA ports', async () => {
      mockResolvedData = [{ product_id: 'nvme-1' }]
      const result = await getCompatibleProductIds('storage', {
        motherboard: makeProduct({ m2_slots: 2, sata_6gbs: 0 }),
      })
      expect(result.filtered).toBe(true)
      expect(mockBuilder.eq).toHaveBeenCalledWith('nvme', true)
      expect(result.reason).toContain('NVMe')
    })
  })

  describe('default / unhandled categories', () => {
    it('returns filtered:false for gpu category', async () => {
      const result = await getCompatibleProductIds('gpu', {})
      expect(result.filtered).toBe(false)
    })
  })
})
