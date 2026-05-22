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
 *
 * L'ordre logique de sélection (cf. utils/selection-order.ts) garantit qu'au moment où on
 * filtre une catégorie, ses pré-requis sont déjà sélectionnés. La fonction reste défensive
 * (filtered:false si un pré-requis manque) pour rester utilisable en standalone.
 */
export async function getCompatibleProductIds(
  targetCategory: CategoryKey,
  config: Partial<Record<CategoryKey, Product>>
): Promise<CompatibilityResult> {
  const cpu = config['cpu']
  const motherboard = config['motherboard']
  const pcCase = config['pc_case']

  switch (targetCategory) {
    // CPU est le point de départ : aucun filtre n'est appliqué (ordre verrouillé en amont).
    case 'cpu':
      return { filtered: false, productIds: [] }

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
        reason: `Format ${formFactor}`,
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

    // GPU : aucun filtre tant que le boîtier n'est pas sélectionné. Sinon, on filtre
    // par longueur max GPU supportée.
    case 'gpu': {
      const maxLen = pcCase?.specs?.['max_gpu_length_mm'] as number | undefined
      if (!maxLen) return { filtered: false, productIds: [] }

      const { data } = await supabase
        .from('gpu_specs')
        .select('product_id, length_mm')
        .or(`length_mm.lte.${maxLen},length_mm.is.null`)

      return {
        filtered: true,
        productIds: data?.map((r) => r.product_id) ?? [],
        reason: `Longueur ≤ ${maxLen} mm`,
      }
    }

    case 'storage': {
      if (!motherboard) return { filtered: false, productIds: [] }

      const m2Slots   = motherboard.specs?.['m2_slots']  as number | undefined
      const sataPorts = motherboard.specs?.['sata_6gbs'] as number | undefined

      const hasM2   = (m2Slots ?? 0) > 0
      const hasSata = (sataPorts ?? 0) > 0

      if (!hasM2 && !hasSata) return { filtered: false, productIds: [] }
      if (hasM2 && hasSata)   return { filtered: false, productIds: [] } // tout compatible

      if (!hasM2 && hasSata) {
        const { data } = await supabase
          .from('storage_specs')
          .select('product_id')
          .eq('nvme', false)

        return {
          filtered: true,
          productIds: data?.map((r) => r.product_id) ?? [],
          reason: 'Pas de slot M.2 — SATA uniquement',
        }
      }

      const { data } = await supabase
        .from('storage_specs')
        .select('product_id')
        .eq('nvme', true)

      return {
        filtered: true,
        productIds: data?.map((r) => r.product_id) ?? [],
        reason: 'Pas de port SATA — M.2 NVMe uniquement',
      }
    }

    // Ventirad : socket CPU + hauteur max boîtier (si boîtier sélectionné).
    case 'cpu_cooler': {
      const socket = cpu?.specs?.['socket'] as string | undefined
      if (!socket) return { filtered: false, productIds: [] }

      const maxH = pcCase?.specs?.['max_cpu_cooler_height_mm'] as number | undefined

      let query = supabase
        .from('cpu_cooler_specs')
        .select('product_id, height_mm')
        .contains('cpu_sockets', [socket])

      if (maxH) {
        query = query.or(`height_mm.lte.${maxH},height_mm.is.null`)
      }

      const { data } = await query
      const reason = maxH ? `Socket ${socket} · hauteur ≤ ${maxH} mm` : `Socket ${socket}`

      return {
        filtered: true,
        productIds: data?.map((r) => r.product_id) ?? [],
        reason,
      }
    }

    case 'psu': {
      const gpu = config['gpu']
      const gpuTdp = gpu?.specs?.['tdp'] as number | undefined
      const cpuTdp = cpu?.specs?.['tdp'] as number | undefined

      if (!gpuTdp && !cpuTdp) return { filtered: false, productIds: [] }

      const systemTdp = (gpuTdp ?? 0) + (cpuTdp ?? 0) + 100
      const minWattage = Math.ceil(systemTdp * 1.2)

      const { data } = await supabase
        .from('psu_specs')
        .select('product_id')
        .gte('wattage', minWattage)

      return {
        filtered: true,
        productIds: data?.map((r) => r.product_id) ?? [],
        reason: `≥ ${minWattage}W (TDP système ~${systemTdp}W)`,
      }
    }

    default:
      return { filtered: false, productIds: [] }
  }
}
