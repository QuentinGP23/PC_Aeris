import { describe, it, expect } from 'vitest'
import {
  PREREQS,
  SELECTION_ORDER,
  cascadeInvalidations,
  missingPrereqs,
  nextPendingCategory,
  prereqsMet,
} from '../selection-order'
import type { CategoryKey, Product } from '../../types'

function makeProduct(specs: Record<string, unknown>, id = 'p1'): Product {
  return {
    id,
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

describe('SELECTION_ORDER', () => {
  it('contains all 8 categories exactly once', () => {
    expect(SELECTION_ORDER).toHaveLength(8)
    expect(new Set(SELECTION_ORDER).size).toBe(8)
  })

  it('starts with cpu', () => {
    expect(SELECTION_ORDER[0]).toBe('cpu')
  })

  it('places motherboard right after cpu', () => {
    expect(SELECTION_ORDER[1]).toBe('motherboard')
  })

  it('places pc_case before gpu (gpu needs case length)', () => {
    expect(SELECTION_ORDER.indexOf('pc_case')).toBeLessThan(SELECTION_ORDER.indexOf('gpu'))
  })

  it('places pc_case before cpu_cooler (cooler needs case height)', () => {
    expect(SELECTION_ORDER.indexOf('pc_case')).toBeLessThan(SELECTION_ORDER.indexOf('cpu_cooler'))
  })

  it('places psu after gpu (psu needs gpu TDP)', () => {
    expect(SELECTION_ORDER.indexOf('gpu')).toBeLessThan(SELECTION_ORDER.indexOf('psu'))
  })
})

describe('PREREQS', () => {
  it('cpu has no prereqs', () => {
    expect(PREREQS.cpu).toEqual([])
  })

  it('motherboard requires cpu', () => {
    expect(PREREQS.motherboard).toEqual(['cpu'])
  })

  it('pc_case, ram, storage require motherboard', () => {
    expect(PREREQS.pc_case).toContain('motherboard')
    expect(PREREQS.ram).toContain('motherboard')
    expect(PREREQS.storage).toContain('motherboard')
  })
})

describe('missingPrereqs / prereqsMet', () => {
  it('returns empty when all prereqs are satisfied', () => {
    const config = { cpu: makeProduct({ socket: 'AM5' }) }
    expect(missingPrereqs('motherboard', config)).toEqual([])
    expect(prereqsMet('motherboard', config)).toBe(true)
  })

  it('returns all upstream missing categories in strict order', () => {
    // ram est à l'index 3 ; tout ce qui précède (cpu, motherboard, pc_case)
    // doit être renseigné, sinon les pré-requis manquants sont retournés.
    expect(missingPrereqs('ram', {})).toEqual(['cpu', 'motherboard', 'pc_case'])
    expect(prereqsMet('ram', {})).toBe(false)
  })
})

describe('cascadeInvalidations', () => {
  it('removes incompatible motherboard when cpu changes socket', () => {
    const config = {
      cpu: makeProduct({ socket: 'LGA1700' }, 'cpu1'),
      motherboard: makeProduct({ socket: 'AM5', form_factor: 'ATX', ram_type: 'DDR5' }, 'mb1'),
    }
    expect(cascadeInvalidations('cpu', config)).toEqual(['motherboard'])
  })

  it('removes ram and pc_case downstream when motherboard would invalidate them', () => {
    const config = {
      cpu: makeProduct({ socket: 'AM5' }, 'cpu1'),
      motherboard: makeProduct({ form_factor: 'ITX', ram_type: 'DDR5' }, 'mb1'),
      pc_case: makeProduct({ supported_mobo_form_factors: ['ATX'] }, 'case1'),
      ram: makeProduct({ ram_type: 'DDR4' }, 'ram1'),
    }
    const invalidated = cascadeInvalidations('motherboard', config)
    expect(invalidated).toContain('pc_case')
    expect(invalidated).toContain('ram')
  })

  it('removes cooler when case max height is exceeded', () => {
    const config = {
      cpu: makeProduct({ socket: 'AM5' }, 'cpu1'),
      pc_case: makeProduct({ max_cpu_cooler_height_mm: 80 }, 'case1'),
      cpu_cooler: makeProduct({ cpu_sockets: ['AM5'], height_mm: 160 }, 'cooler1'),
    }
    expect(cascadeInvalidations('pc_case', config)).toEqual(['cpu_cooler'])
  })

  it('removes gpu when case max length is exceeded', () => {
    const config = {
      pc_case: makeProduct({ max_gpu_length_mm: 250 }, 'case1'),
      gpu: makeProduct({ length_mm: 320 }, 'gpu1'),
    }
    expect(cascadeInvalidations('pc_case', config)).toContain('gpu')
  })

  it('does nothing when changes remain compatible', () => {
    const config = {
      cpu: makeProduct({ socket: 'AM5' }, 'cpu1'),
      motherboard: makeProduct({ socket: 'AM5', ram_type: 'DDR5' }, 'mb1'),
      ram: makeProduct({ ram_type: 'DDR5' }, 'ram1'),
    }
    expect(cascadeInvalidations('cpu', config)).toEqual([])
  })
})

describe('nextPendingCategory', () => {
  it('returns cpu when config is empty', () => {
    expect(nextPendingCategory({})).toBe('cpu')
  })

  it('returns the next missing category in order', () => {
    const config: Partial<Record<CategoryKey, Product>> = {
      cpu: makeProduct({}),
      motherboard: makeProduct({}),
    }
    expect(nextPendingCategory(config)).toBe('pc_case')
  })

  it('returns null when all categories are filled', () => {
    const config: Partial<Record<CategoryKey, Product>> = {}
    for (const cat of SELECTION_ORDER) {
      config[cat] = makeProduct({})
    }
    expect(nextPendingCategory(config)).toBeNull()
  })
})
