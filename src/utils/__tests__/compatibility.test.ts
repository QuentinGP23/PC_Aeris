import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCompatibleProductIds } from '../compatibility'
import type { Product } from '../../types'

// Chainable mock that resolves with configurable data
let mockResolvedData: { product_id: string; form_factor?: string; height_mm?: number; length_mm?: number }[] = []

const mockBuilder = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  contains: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  or: vi.fn().mockReturnThis(),
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
    it('is never filtered (cpu is first in selection order)', async () => {
      const result = await getCompatibleProductIds('cpu', {})
      expect(result.filtered).toBe(false)
    })
  })

  describe('motherboard', () => {
    it('returns filtered:false when no cpu selected', async () => {
      const result = await getCompatibleProductIds('motherboard', {})
      expect(result.filtered).toBe(false)
    })

    it('filters by cpu socket', async () => {
      mockResolvedData = [{ product_id: 'mb-1' }]
      const result = await getCompatibleProductIds('motherboard', {
        cpu: makeProduct({ socket: 'AM5' }),
      })
      expect(result.filtered).toBe(true)
      expect(result.productIds).toEqual(['mb-1'])
      expect(mockBuilder.eq).toHaveBeenCalledWith('socket', 'AM5')
      expect(result.reason).toBe('Socket AM5')
    })
  })

  describe('pc_case', () => {
    it('returns filtered:false when no motherboard selected', async () => {
      const result = await getCompatibleProductIds('pc_case', {})
      expect(result.filtered).toBe(false)
    })

    it('filters pc_case_specs by normalized form_factor (tolerant matching)', async () => {
      mockResolvedData = [
        { product_id: 'case-1', supported_mobo_form_factors: ['ATX', 'Micro ATX'] },
        { product_id: 'case-2', supported_mobo_form_factors: ['Mini ITX'] },
        { product_id: 'case-3', supported_mobo_form_factors: null }, // donnée manquante → passe
      ]
      const result = await getCompatibleProductIds('pc_case', {
        motherboard: makeProduct({ form_factor: 'ATX' }),
      })
      expect(result.filtered).toBe(true)
      expect(result.productIds).toEqual(['case-1', 'case-3'])
      expect(result.reason).toContain('ATX')
    })

    it('matches Micro ATX vs mATX vs Micro-ATX via normalization', async () => {
      mockResolvedData = [
        { product_id: 'case-1', supported_mobo_form_factors: ['mATX'] },
        { product_id: 'case-2', supported_mobo_form_factors: ['Micro ATX'] },
        { product_id: 'case-3', supported_mobo_form_factors: ['Micro-ATX'] },
      ]
      const result = await getCompatibleProductIds('pc_case', {
        motherboard: makeProduct({ form_factor: 'Micro ATX' }),
      })
      expect(result.productIds).toEqual(['case-1', 'case-2', 'case-3'])
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

  describe('gpu', () => {
    it('returns filtered:false when no pc_case selected', async () => {
      const result = await getCompatibleProductIds('gpu', {})
      expect(result.filtered).toBe(false)
    })

    it('filters by case max GPU length', async () => {
      mockResolvedData = [{ product_id: 'gpu-1' }]
      const result = await getCompatibleProductIds('gpu', {
        pc_case: makeProduct({ max_gpu_length_mm: 320 }),
      })
      expect(result.filtered).toBe(true)
      expect(result.productIds).toEqual(['gpu-1'])
      expect(mockBuilder.or).toHaveBeenCalledWith('length_mm.lte.320,length_mm.is.null')
      expect(result.reason).toContain('320 mm')
    })
  })

  describe('storage', () => {
    it('returns filtered:false when no motherboard selected', async () => {
      const result = await getCompatibleProductIds('storage', {})
      expect(result.filtered).toBe(false)
    })

    it('returns filtered:false when motherboard has both M.2 and SATA (numbers)', async () => {
      const result = await getCompatibleProductIds('storage', {
        motherboard: makeProduct({ m2_slots: 2, sata_6gbs: 4 }),
      })
      expect(result.filtered).toBe(false)
    })

    it('returns filtered:false when m2_slots est un objet JSONB non-vide (BuildCores) — info présente', async () => {
      // Cas réel : m2_slots = { count: 2, types: [...] } stocké en JSONB.
      const result = await getCompatibleProductIds('storage', {
        motherboard: makeProduct({ m2_slots: { count: 2, types: ['PCIe 4.0'] }, sata_6gbs: 4 }),
      })
      expect(result.filtered).toBe(false)
    })

    it('returns filtered:false when slots info is unknown (does not over-filter)', async () => {
      const result = await getCompatibleProductIds('storage', {
        motherboard: makeProduct({ m2_slots: null, sata_6gbs: 4 }),
      })
      expect(result.filtered).toBe(false)
    })

    it('excludes NVMe when m2 absent and SATA present (mais accepte nvme=null)', async () => {
      mockResolvedData = [{ product_id: 'sata-1' }]
      const result = await getCompatibleProductIds('storage', {
        motherboard: makeProduct({ m2_slots: 0, sata_6gbs: 4 }),
      })
      expect(result.filtered).toBe(true)
      expect(mockBuilder.or).toHaveBeenCalledWith('nvme.eq.false,nvme.is.null')
      expect(result.reason).toContain('SATA')
    })

    it('excludes SATA when sata absent and M.2 present (mais accepte nvme=null)', async () => {
      mockResolvedData = [{ product_id: 'nvme-1' }]
      const result = await getCompatibleProductIds('storage', {
        motherboard: makeProduct({ m2_slots: 2, sata_6gbs: 0 }),
      })
      expect(result.filtered).toBe(true)
      expect(mockBuilder.or).toHaveBeenCalledWith('nvme.eq.true,nvme.is.null')
      expect(result.reason).toContain('NVMe')
    })
  })

  describe('cpu_cooler', () => {
    it('returns filtered:false when no cpu selected', async () => {
      const result = await getCompatibleProductIds('cpu_cooler', {})
      expect(result.filtered).toBe(false)
    })

    it('filters by socket only when no case is selected', async () => {
      mockResolvedData = [{ product_id: 'cooler-1' }]
      const result = await getCompatibleProductIds('cpu_cooler', {
        cpu: makeProduct({ socket: 'LGA1700' }),
      })
      expect(result.filtered).toBe(true)
      expect(mockBuilder.contains).toHaveBeenCalledWith('cpu_sockets', ['LGA1700'])
      expect(mockBuilder.or).not.toHaveBeenCalled()
      expect(result.reason).toBe('Socket LGA1700')
    })

    it('filters by socket and case max cooler height', async () => {
      mockResolvedData = [{ product_id: 'cooler-2' }]
      const result = await getCompatibleProductIds('cpu_cooler', {
        cpu: makeProduct({ socket: 'AM5' }),
        pc_case: makeProduct({ max_cpu_cooler_height_mm: 165 }),
      })
      expect(result.filtered).toBe(true)
      expect(mockBuilder.contains).toHaveBeenCalledWith('cpu_sockets', ['AM5'])
      expect(mockBuilder.or).toHaveBeenCalledWith('height_mm.lte.165,height_mm.is.null')
      expect(result.reason).toContain('165 mm')
    })
  })

  describe('psu', () => {
    it('returns filtered:false when no gpu or cpu tdp', async () => {
      const result = await getCompatibleProductIds('psu', {})
      expect(result.filtered).toBe(false)
    })

    it('calculates min wattage from gpu+cpu TDP with 20% headroom', async () => {
      mockResolvedData = [{ product_id: 'psu-1' }]
      const result = await getCompatibleProductIds('psu', {
        gpu: makeProduct({ tdp: 300 }),
        cpu: makeProduct({ tdp: 65 }),
      })
      expect(result.filtered).toBe(true)
      expect(mockBuilder.gte).toHaveBeenCalledWith('wattage', 558)
      expect(result.reason).toContain('558W')
    })

    it('works with cpu only (no gpu)', async () => {
      mockResolvedData = []
      // cpu: 65W → system = 65+0+100 = 165W → min = ceil(165*1.2) = 198W
      await getCompatibleProductIds('psu', {
        cpu: makeProduct({ tdp: 65 }),
      })
      expect(mockBuilder.gte).toHaveBeenCalledWith('wattage', 198)
    })
  })
})
