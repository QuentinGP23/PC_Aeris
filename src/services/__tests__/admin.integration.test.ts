import { describe, it, expect, vi, beforeEach } from 'vitest'

type BuilderResult = { data: unknown; error: { message: string } | null }

const { state, from, builder } = vi.hoisted(() => {
  const state = {
    nextResult: { data: null, error: null } as BuilderResult,
    lastCall: { filters: [] as Array<{ col: string; val: unknown }> } as {
      table?: string; op?: string; payload?: unknown; filters: Array<{ col: string; val: unknown }>
    },
  }
  const builder = {
    insert: vi.fn((payload: unknown) => {
      state.lastCall.op = 'insert'
      state.lastCall.payload = payload
      return builder
    }),
    update: vi.fn((payload: unknown) => {
      state.lastCall.op = 'update'
      state.lastCall.payload = payload
      return builder
    }),
    select: vi.fn(() => builder),
    single: vi.fn(() => builder),
    eq: vi.fn((col: string, val: unknown) => {
      state.lastCall.filters.push({ col, val })
      return builder
    }),
    then(resolve: (v: BuilderResult) => void) {
      return Promise.resolve(state.nextResult).then(resolve)
    },
  }
  const from = vi.fn((table: string) => {
    state.lastCall.table = table
    return builder
  })
  return { state, from, builder }
})

vi.mock('../../config', () => ({
  supabase: { from, rpc: vi.fn(), auth: {} },
}))

import { adminService } from '../admin.service'

beforeEach(() => {
  vi.clearAllMocks()
  state.lastCall.table = undefined
  state.lastCall.op = undefined
  state.lastCall.payload = undefined
  state.lastCall.filters = []
  state.nextResult = { data: null, error: null }
})

describe('adminService — product create flow', () => {
  it('createProduct: inserts into products and returns new row', async () => {
    state.nextResult = {
      data: {
        id: 'new-id', name: 'Ryzen 7 5800X', category: 'cpu',
        manufacturer: 'AMD', series: null, variant: null, release_year: 2020,
        image_url: null, price_min_eur: 250, price_max_eur: 350, price_avg_eur: 300,
        created_at: '2026-04-20T00:00:00Z',
      },
      error: null,
    }

    const { product, error } = await adminService.createProduct({
      name: 'Ryzen 7 5800X',
      category: 'cpu',
      manufacturer: 'AMD',
      release_year: 2020,
      price_avg_eur: 300,
    })

    expect(error).toBeNull()
    expect(product?.id).toBe('new-id')
    expect(from).toHaveBeenCalledWith('products')
    expect(builder.insert).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Ryzen 7 5800X', category: 'cpu', manufacturer: 'AMD',
    }))
  })

  it('createProductSpecs: inserts with product_id foreign key', async () => {
    state.nextResult = { data: null, error: null }

    const { error } = await adminService.createProductSpecs(
      'new-id',
      'cpu_specs',
      { socket: 'AM4', total_cores: 8, tdp: 105 },
    )

    expect(error).toBeNull()
    expect(from).toHaveBeenCalledWith('cpu_specs')
    expect(builder.insert).toHaveBeenCalledWith({
      product_id: 'new-id', socket: 'AM4', total_cores: 8, tdp: 105,
    })
  })

  it('full create flow: product → specs → updates price', async () => {
    // Step 1: createProduct
    state.nextResult = {
      data: {
        id: 'p-42', name: 'GPU', category: 'gpu', manufacturer: 'NVIDIA',
        series: null, variant: null, release_year: null, image_url: null,
        price_min_eur: null, price_max_eur: null, price_avg_eur: null,
        created_at: '2026-04-20T00:00:00Z',
      },
      error: null,
    }
    const { product } = await adminService.createProduct({ name: 'GPU', category: 'gpu' })
    expect(product?.id).toBe('p-42')

    // Step 2: createProductSpecs uses returned id
    state.nextResult = { data: null, error: null }
    await adminService.createProductSpecs(product!.id, 'gpu_specs', { memory_gb: 12, tdp: 285 })
    expect(builder.insert).toHaveBeenLastCalledWith(expect.objectContaining({
      product_id: 'p-42', memory_gb: 12,
    }))

    // Step 3: updateProduct with price
    state.nextResult = { data: null, error: null }
    const { error } = await adminService.updateProduct('p-42', { price_avg_eur: 450 })
    expect(error).toBeNull()
    expect(builder.update).toHaveBeenCalledWith(expect.objectContaining({ price_avg_eur: 450 }))
    expect(state.lastCall.filters).toContainEqual({ col: 'id', val: 'p-42' })
  })

  it('createProduct error: surfaces Supabase error message', async () => {
    state.nextResult = { data: null, error: { message: 'duplicate key' } }

    const { product, error } = await adminService.createProduct({ name: 'dup', category: 'cpu' })

    expect(product).toBeNull()
    expect(error).toBe('duplicate key')
  })
})
