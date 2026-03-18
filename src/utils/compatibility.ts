import { supabase } from '../config'
import type { CategoryKey, Product } from '../types'

export interface CompatibilityResult {
  filtered: boolean
  productIds: string[]
  reason?: string
}

/**
 * Returns compatible product IDs for a target category based on already selected components.
 * Returns { filtered: false } if no relevant component is selected yet.
 */
export async function getCompatibleProductIds(
  targetCategory: CategoryKey,
  config: Partial<Record<CategoryKey, Product>>
): Promise<CompatibilityResult> {
  const cpu = config['cpu']
  const motherboard = config['motherboard']

  switch (targetCategory) {
    case 'motherboard': {
      const socket = cpu?.specs?.['socket'] as string | undefined
      if (!socket) return { filtered: false, productIds: [] }

      const { data } = await supabase
        .from('motherboard_specs')
        .select('product_id')
        .eq('socket', socket)

      return {
        filtered: true,
        productIds: data?.map((r) => r.product_id) ?? [],
        reason: `Socket ${socket}`,
      }
    }

    case 'cpu': {
      const socket = motherboard?.specs?.['socket'] as string | undefined
      if (!socket) return { filtered: false, productIds: [] }

      const { data } = await supabase
        .from('cpu_specs')
        .select('product_id')
        .eq('socket', socket)

      return {
        filtered: true,
        productIds: data?.map((r) => r.product_id) ?? [],
        reason: `Socket ${socket}`,
      }
    }

    case 'ram': {
      const ramType = motherboard?.specs?.['ram_type'] as string | undefined
      if (!ramType) return { filtered: false, productIds: [] }

      const { data } = await supabase
        .from('ram_specs')
        .select('product_id')
        .eq('ram_type', ramType)

      return {
        filtered: true,
        productIds: data?.map((r) => r.product_id) ?? [],
        reason: ramType,
      }
    }

    case 'cpu_cooler': {
      const socket = cpu?.specs?.['socket'] as string | undefined
      if (!socket) return { filtered: false, productIds: [] }

      const { data } = await supabase
        .from('cpu_cooler_specs')
        .select('product_id')
        .contains('cpu_sockets', [socket])

      return {
        filtered: true,
        productIds: data?.map((r) => r.product_id) ?? [],
        reason: `Socket ${socket}`,
      }
    }

    case 'pc_case': {
      const formFactor = motherboard?.specs?.['form_factor'] as string | undefined
      if (!formFactor) return { filtered: false, productIds: [] }

      const { data } = await supabase
        .from('pc_case_specs')
        .select('product_id')
        .contains('supported_mobo_form_factors', [formFactor])

      return {
        filtered: true,
        productIds: data?.map((r) => r.product_id) ?? [],
        reason: formFactor,
      }
    }

    default:
      return { filtered: false, productIds: [] }
  }
}
