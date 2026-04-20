import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCompatibleProductIds } from '../compatibility'
import type { Product } from '../../types'

type FromResponse = { data: { product_id: string; form_factor?: string }[] | null; error: null }

const { state, makeBuilder } = vi.hoisted(() => {
  const state = {
    queue: [] as FromResponse[],
    callLog: [] as Array<{ table: string; ops: string[] }>,
  }
  const makeBuilder = (table: string) => {
    const entry: { table: string; ops: string[] } = { table, ops: [] }
    state.callLog.push(entry)
    const builder = {
      select: vi.fn(() => { entry.ops.push('select'); return builder }),
      eq: vi.fn((c: string, v: unknown) => { entry.ops.push(`eq(${c}=${String(v)})`); return builder }),
      contains: vi.fn((c: string, v: unknown) => { entry.ops.push(`contains(${c}=${JSON.stringify(v)})`); return builder }),
      gte: vi.fn((c: string, v: unknown) => { entry.ops.push(`gte(${c}>=${String(v)})`); return builder }),
      then(resolve: (r: FromResponse) => void) {
        const r = state.queue.shift() ?? { data: [], error: null }
        return Promise.resolve(r).then(resolve)
      },
    }
    return builder
  }
  return { state, makeBuilder }
})

vi.mock('../../config', () => ({
  supabase: { from: (t: string) => makeBuilder(t) },
}))

function prod(specs: Record<string, unknown>): Product {
  return {
    id: 'p', name: 'x', manufacturer: null, series: null, variant: null, release_year: null,
    category: 'cpu', image_url: null, description: null,
    price_min_eur: null, price_max_eur: null, price_avg_eur: null, price_updated_at: null,
    retailer_url: null, benchmark_score: null, specs,
  }
}

beforeEach(() => {
  state.queue = []
  state.callLog.length = 0
})

describe('Configurator flow — chained compatibility filters', () => {
  it('AM5 build: selects mobo → filters CPU and RAM with correct constraints', async () => {
    const mobo = prod({ socket: 'AM5', ram_type: 'DDR5', form_factor: 'ATX' })

    state.queue = [
      { data: [{ product_id: 'cpu-1' }, { product_id: 'cpu-2' }], error: null },
      { data: [{ product_id: 'ram-1' }], error: null },
    ]

    const cpuRes = await getCompatibleProductIds('cpu', { motherboard: mobo })
    const ramRes = await getCompatibleProductIds('ram', { motherboard: mobo })

    expect(cpuRes.productIds).toEqual(['cpu-1', 'cpu-2'])
    expect(ramRes.productIds).toEqual(['ram-1'])
    expect(state.callLog[0].table).toBe('cpu_specs')
    expect(state.callLog[0].ops).toContain('eq(socket=AM5)')
    expect(state.callLog[1].table).toBe('ram_specs')
    expect(state.callLog[1].ops).toContain('eq(ram_type=DDR5)')
  })

  it('once CPU picked, cooler filter uses CPU socket (not mobo)', async () => {
    const mobo = prod({ socket: 'AM5', ram_type: 'DDR5' })
    const cpu = prod({ socket: 'AM5', tdp: 105 })

    state.queue = [{ data: [{ product_id: 'cooler-1' }], error: null }]

    const res = await getCompatibleProductIds('cpu_cooler', { motherboard: mobo, cpu })

    expect(res.productIds).toEqual(['cooler-1'])
    expect(state.callLog[0].table).toBe('cpu_cooler_specs')
    expect(state.callLog[0].ops.some((o) => o.includes('contains(cpu_sockets'))).toBe(true)
  })

  it('high-end config: PSU wattage scales with GPU + CPU TDP', async () => {
    const gpu = prod({ tdp: 450 }) // RTX 4090-class
    const cpu = prod({ tdp: 170 }) // i9-class
    state.queue = [{ data: [{ product_id: 'psu-1000w' }], error: null }]

    const res = await getCompatibleProductIds('psu', { gpu, cpu })

    // (450 + 170 + 100) * 1.2 = 864W
    expect(res.reason).toContain('864W')
    expect(state.callLog[0].ops).toContainEqual('gte(wattage>=864)')
  })

  it('ITX build: mobo filtered by both CPU socket AND case form factor', async () => {
    const cpu = prod({ socket: 'AM5' })
    const pcCase = prod({ supported_mobo_form_factors: ['Mini ITX'] })

    state.queue = [{
      data: [
        { product_id: 'mb-atx', form_factor: 'ATX' },
        { product_id: 'mb-itx', form_factor: 'Mini ITX' },
      ],
      error: null,
    }]

    const res = await getCompatibleProductIds('motherboard', { cpu, pc_case: pcCase })

    expect(res.productIds).toEqual(['mb-itx'])
    expect(res.reason).toContain('Socket AM5')
    expect(res.reason).toContain('Mini ITX')
  })

  it('SATA-only mobo: storage excludes NVMe', async () => {
    const mobo = prod({ m2_slots: 0, sata_6gbs: 4 })
    state.queue = [{ data: [{ product_id: 'sata-ssd' }, { product_id: 'hdd' }], error: null }]

    const res = await getCompatibleProductIds('storage', { motherboard: mobo })

    expect(res.filtered).toBe(true)
    expect(state.callLog[0].ops).toContain('eq(nvme=false)')
  })
})
