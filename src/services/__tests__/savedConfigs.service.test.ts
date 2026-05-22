import { describe, it, expect, vi, beforeEach } from 'vitest'
import { savedConfigsService } from '../savedConfigs.service'

interface QueryResult {
  data: unknown
  error: { message: string } | null
}

let queue: QueryResult[] = []
let currentUserId: string | null = 'user-1'

const calls: { table: string; ops: string[] }[] = []

function makeBuilder(table: string) {
  const entry = { table, ops: [] as string[] }
  calls.push(entry)
  const builder = {
    select: vi.fn((cols?: string) => {
      entry.ops.push(`select(${cols ?? '*'})`)
      return builder
    }),
    insert: vi.fn((payload: unknown) => {
      entry.ops.push(`insert(${JSON.stringify(payload)})`)
      return builder
    }),
    update: vi.fn((payload: unknown) => {
      entry.ops.push(`update(${JSON.stringify(payload)})`)
      return builder
    }),
    delete: vi.fn(() => {
      entry.ops.push('delete')
      return builder
    }),
    eq: vi.fn((c: string, v: unknown) => {
      entry.ops.push(`eq(${c}=${String(v)})`)
      return builder
    }),
    in: vi.fn((c: string, v: unknown[]) => {
      entry.ops.push(`in(${c}=${JSON.stringify(v)})`)
      return builder
    }),
    order: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(queue.shift() ?? { data: null, error: null })),
    then(resolve: (r: QueryResult) => void) {
      return Promise.resolve(queue.shift() ?? { data: null, error: null }).then(resolve)
    },
  }
  return builder
}

vi.mock('../../config', () => ({
  supabase: {
    from: (t: string) => makeBuilder(t),
    auth: {
      getUser: () =>
        Promise.resolve({
          data: { user: currentUserId ? { id: currentUserId } : null },
        }),
    },
  },
}))

beforeEach(() => {
  queue = []
  calls.length = 0
  currentUserId = 'user-1'
})

describe('savedConfigsService', () => {
  it('list — returns sorted configs', async () => {
    queue = [
      {
        data: [
          { id: 'c1', name: 'Gaming', components: {}, created_at: 't1', updated_at: 't2' },
        ],
        error: null,
      },
    ]
    const { data, error } = await savedConfigsService.list()
    expect(error).toBeNull()
    expect(data).toHaveLength(1)
    expect(data[0].name).toBe('Gaming')
    expect(calls[0].table).toBe('saved_configs')
  })

  it('create — inserts with current user id and trimmed name', async () => {
    queue = [
      { data: { id: 'c1', name: 'Workstation', components: { cpu: 'p1' }, created_at: 't', updated_at: 't' }, error: null },
    ]
    const { data, error } = await savedConfigsService.create('  Workstation  ', { cpu: 'p1' })
    expect(error).toBeNull()
    expect(data?.name).toBe('Workstation')
    expect(calls[0].ops.some((o) => o.startsWith('insert'))).toBe(true)
    expect(calls[0].ops[0]).toContain('"user_id":"user-1"')
    expect(calls[0].ops[0]).toContain('"name":"Workstation"')
  })

  it('create — fails when user is not authenticated', async () => {
    currentUserId = null
    const { data, error } = await savedConfigsService.create('Test', { cpu: 'p1' })
    expect(data).toBeNull()
    expect(error).toBe('Utilisateur non connecté')
  })

  it('rename — updates by id with trimmed name', async () => {
    queue = [{ data: null, error: null }]
    const { error } = await savedConfigsService.rename('c1', '  New Name  ')
    expect(error).toBeNull()
    expect(calls[0].ops).toContainEqual('update({"name":"New Name"})')
    expect(calls[0].ops).toContain('eq(id=c1)')
  })

  it('delete — calls delete with id', async () => {
    queue = [{ data: null, error: null }]
    const { error } = await savedConfigsService.delete('c1')
    expect(error).toBeNull()
    expect(calls[0].ops).toContain('delete')
    expect(calls[0].ops).toContain('eq(id=c1)')
  })

  it('hydrate — re-fetches products and flags missing ones', async () => {
    queue = [
      {
        data: [
          { id: 'p1', name: 'CPU 1', manufacturer: 'X', series: null, variant: null, release_year: null, category: 'cpu', image_url: null, description: null, price_min_eur: null, price_max_eur: null, price_avg_eur: null, price_updated_at: null, retailer_url: null, benchmark_score: null },
        ],
        error: null,
      },
    ]
    const result = await savedConfigsService.hydrate({
      id: 'c1',
      name: 'Test',
      components: { cpu: 'p1', motherboard: 'deleted' },
      created_at: 't',
      updated_at: 't',
    })
    expect(result.products.cpu?.id).toBe('p1')
    expect(result.missing).toEqual(['motherboard'])
  })

  it('hydrate — returns empty products when components is empty', async () => {
    const result = await savedConfigsService.hydrate({
      id: 'c1',
      name: 'Empty',
      components: {},
      created_at: 't',
      updated_at: 't',
    })
    expect(result.products).toEqual({})
    expect(result.missing).toEqual([])
    expect(calls).toHaveLength(0)
  })
})
