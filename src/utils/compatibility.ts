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

    // US-034 — Compatibilité Boîtier → Carte mère (format ATX/mATX/ITX)
    case 'motherboard': {
      const pcCase = config['pc_case']
      const socket = cpu?.specs?.['socket'] as string | undefined
      const caseFormFactors = pcCase?.specs?.['supported_mobo_form_factors'] as string[] | undefined

      if (!socket && !caseFormFactors?.length) return { filtered: false, productIds: [] }

      let query = supabase.from('motherboard_specs').select('product_id, form_factor')
      if (socket) query = query.eq('socket', socket)

      const { data } = await query

      if (!data?.length) return { filtered: true, productIds: [], reason: socket ? `Socket ${socket}` : undefined }

      // Filtre supplémentaire par format de boîtier si boîtier sélectionné
      if (caseFormFactors?.length) {
        const filtered = data.filter((r) => {
          const mf = (r as Record<string, unknown>)['form_factor'] as string | undefined
          return mf ? caseFormFactors.includes(mf) : true
        })
        const reason = [socket && `Socket ${socket}`, pcCase && `Format ${caseFormFactors.join('/')}`]
          .filter(Boolean).join(' · ')
        return { filtered: true, productIds: filtered.map((r) => r.product_id), reason }
      }

      return { filtered: true, productIds: data.map((r) => r.product_id), reason: socket ? `Socket ${socket}` : undefined }
    }

    // US-033 — Compatibilité GPU / Alimentation (calcul TDP)
    case 'psu': {
      const gpu = config['gpu']
      const gpuTdp = gpu?.specs?.['tdp'] as number | undefined
      const cpuTdp = cpu?.specs?.['tdp'] as number | undefined

      if (!gpuTdp && !cpuTdp) return { filtered: false, productIds: [] }

      const systemTdp = (gpuTdp ?? 0) + (cpuTdp ?? 0) + 100 // +100W buffer système
      const minWattage = Math.ceil(systemTdp * 1.2) // 20% headroom recommandé

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

    // US-035 — Compatibilité Stockage / Connectique carte mère (M.2/SATA)
    case 'storage': {
      if (!motherboard) return { filtered: false, productIds: [] }

      const m2Slots  = motherboard.specs?.['m2_slots']  as number | undefined
      const sataPorts = motherboard.specs?.['sata_6gbs'] as number | undefined

      const hasM2   = (m2Slots ?? 0) > 0
      const hasSata = (sataPorts ?? 0) > 0

      if (!hasM2 && !hasSata) return { filtered: false, productIds: [] }
      if (hasM2 && hasSata)   return { filtered: false, productIds: [] } // tout compatible

      // Pas de M.2 → exclure NVMe
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

      // Pas de SATA → exclure les disques SATA non-NVMe
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

    default:
      return { filtered: false, productIds: [] }
  }
}
