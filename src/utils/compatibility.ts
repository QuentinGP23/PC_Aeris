import { supabase } from '../config'
import type { CategoryKey, Product } from '../types'

export interface CompatibilityResult {
  filtered: boolean
  productIds: string[]
  reason?: string
}

/**
 * Normalise une chaîne de format de carte mère pour comparaison tolérante.
 * Ex : "Mini-ITX", "Mini ITX", "MiniITX", "mini itx" → "miniitx"
 *      "Micro ATX", "mATX", "Micro-ATX", "uATX" → "matx" / "microatx"
 *      "E-ATX", "Extended ATX" → "eatx" / "extendedatx"
 * On ne corrige pas tout : on retire espaces, tirets, et on lowercase. Si la
 * base contient encore des disparités, le filtre laisse passer (cf. cas par
 * défaut dans pc_case ci-dessous).
 */
function normalizeFormFactor(v: string): string {
  let s = v.toLowerCase().replace(/[\s\-_.]+/g, '')
  // Alias courants : mATX/uATX → matx ; eATX/EATX → eatx
  s = s.replace(/^(micro|u|µ)atx$/, 'matx')
  s = s.replace(/^extendedatx$/, 'eatx')
  s = s.replace(/^miniitx$/, 'mitx')
  return s
}

/**
 * Détecte si une spec de slot (m2_slots / sata_6gbs) indique présence, absence,
 * ou information inconnue. m2_slots est souvent un objet JSONB de BuildCores
 * ({ count: N } ou { types: [...] }), parfois un nombre, parfois null.
 * sata_6gbs est généralement un nombre mais peut être null.
 *
 * Règle : on retourne 'unknown' quand l'info manque ou est dans un format non
 * reconnu — l'appelant peut alors décider de ne pas filtrer plutôt que de
 * filtrer à tort.
 */
function detectSlotPresence(raw: unknown): 'present' | 'absent' | 'unknown' {
  if (raw === null || raw === undefined) return 'unknown'

  // Nombre brut (sata_6gbs typique).
  if (typeof raw === 'number') {
    if (Number.isNaN(raw)) return 'unknown'
    return raw > 0 ? 'present' : 'absent'
  }

  // String numérique éventuelle.
  if (typeof raw === 'string') {
    const n = Number(raw)
    if (!Number.isNaN(n)) return n > 0 ? 'present' : 'absent'
    return 'unknown'
  }

  // Array (liste de slots).
  if (Array.isArray(raw)) {
    return raw.length > 0 ? 'present' : 'absent'
  }

  // Objet JSONB BuildCores : { count: 2, types: [...] } ou { "M.2 PCIe 4.0": 2 } etc.
  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    if (typeof obj['count'] === 'number') return obj['count'] > 0 ? 'present' : 'absent'
    if (Array.isArray(obj['types'])) return obj['types'].length > 0 ? 'present' : 'absent'
    // Heuristique : si l'objet a au moins une clé avec une valeur > 0 (count par type), on considère présent.
    const values = Object.values(obj)
    const anyPositive = values.some((v) => typeof v === 'number' && v > 0)
    if (anyPositive) return 'present'
    // Sinon données ambiguës.
    return Object.keys(obj).length > 0 ? 'present' : 'absent'
  }

  return 'unknown'
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

    // Boîtier : filtre par format mobo, mais tolérant aux variations de nommage
    // ("ATX" vs "Standard-ATX", "Micro ATX" vs "mATX" vs "Micro-ATX", etc.)
    // Plutôt que d'utiliser contains() côté Postgres (exact match strict), on
    // récupère toutes les specs et on filtre en JS avec normalisation.
    case 'pc_case': {
      const formFactor = motherboard?.specs?.['form_factor'] as string | undefined
      if (!formFactor) return { filtered: false, productIds: [] }

      const { data } = await supabase
        .from('pc_case_specs')
        .select('product_id, supported_mobo_form_factors')

      if (!data) return { filtered: true, productIds: [], reason: `Format ${formFactor}` }

      const target = normalizeFormFactor(formFactor)
      const matching = data.filter((row) => {
        const supported = (row as Record<string, unknown>)['supported_mobo_form_factors'] as
          | string[]
          | null
          | undefined
        // Si la spec n'a pas de liste → on laisse passer (donnée incomplète, plutôt que d'exclure à tort).
        if (!supported || !Array.isArray(supported) || supported.length === 0) return true
        return supported.some((s) => normalizeFormFactor(s) === target)
      })

      return {
        filtered: true,
        productIds: matching.map((r) => r.product_id),
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

    // Stockage : interpréter m2_slots et sata_6gbs prudemment.
    // m2_slots est stocké en JSONB par l'import BuildCores (objet { count, types[] })
    // — un cast brutal en number donne NaN et fausse tout. sata_6gbs est un nombre
    // mais peut être null si l'info est manquante. Principe : on n'exclut une
    // famille (NVMe ou SATA) que si on est CERTAIN qu'elle est incompatible.
    case 'storage': {
      if (!motherboard) return { filtered: false, productIds: [] }

      const m2Raw   = motherboard.specs?.['m2_slots']
      const sataRaw = motherboard.specs?.['sata_6gbs']

      const m2Status   = detectSlotPresence(m2Raw)
      const sataStatus = detectSlotPresence(sataRaw)

      // Si on ne sait pas (donnée manquante ou format inconnu) → on ne filtre pas.
      if (m2Status === 'unknown' || sataStatus === 'unknown') {
        return { filtered: false, productIds: [] }
      }
      // Les deux présents → tout compatible.
      if (m2Status === 'present' && sataStatus === 'present') {
        return { filtered: false, productIds: [] }
      }
      // Aucun des deux → mobo bizarre, on laisse passer pour ne pas bloquer.
      if (m2Status === 'absent' && sataStatus === 'absent') {
        return { filtered: false, productIds: [] }
      }

      // Pas de M.2 → SATA uniquement (exclure NVMe).
      if (m2Status === 'absent' && sataStatus === 'present') {
        const { data } = await supabase
          .from('storage_specs')
          .select('product_id')
          .or('nvme.eq.false,nvme.is.null')

        return {
          filtered: true,
          productIds: data?.map((r) => r.product_id) ?? [],
          reason: 'Pas de slot M.2 — SATA uniquement',
        }
      }

      // Pas de SATA → M.2 NVMe uniquement.
      const { data } = await supabase
        .from('storage_specs')
        .select('product_id')
        .or('nvme.eq.true,nvme.is.null')

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
