import { supabase } from '../config'
import type { CategoryKey, Product } from '../types'

export interface CompatibilityResult {
  filtered: boolean
  productIds: string[]
  reason?: string
}

/**
 * Helpers de normalisation. Les données BuildCores stockent parfois m2_slots
 * en JSONB et utilisent des variations de form_factor selon les sources.
 */

export function normalizeFormFactor(v: string): string {
  let s = v.toLowerCase().replace(/[\s\-_.]+/g, '')
  s = s.replace(/^(micro|u|µ)atx$/, 'matx')
  s = s.replace(/^extendedatx$/, 'eatx')
  s = s.replace(/^miniitx$/, 'mitx')
  return s
}

export function detectSlotPresence(raw: unknown): 'present' | 'absent' | 'unknown' {
  if (raw === null || raw === undefined) return 'unknown'
  if (typeof raw === 'number') return Number.isNaN(raw) ? 'unknown' : (raw > 0 ? 'present' : 'absent')
  if (typeof raw === 'string') {
    const n = Number(raw)
    return Number.isNaN(n) ? 'unknown' : (n > 0 ? 'present' : 'absent')
  }
  if (Array.isArray(raw)) return raw.length > 0 ? 'present' : 'absent'
  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    if (typeof obj['count'] === 'number') return obj['count'] > 0 ? 'present' : 'absent'
    if (Array.isArray(obj['types'])) return obj['types'].length > 0 ? 'present' : 'absent'
    const anyPositive = Object.values(obj).some((v) => typeof v === 'number' && v > 0)
    if (anyPositive) return 'present'
    return Object.keys(obj).length > 0 ? 'present' : 'absent'
  }
  return 'unknown'
}

/**
 * Description du filtre de compatibilité pour la catégorie cible. Utilisé par
 * le Configurator pour appliquer les contraintes côté serveur via un inner
 * join PostgREST, plutôt que de récupérer 1000+ IDs côté client puis les
 * renvoyer dans une clause `.in()` (qui plante au-delà de ~200 UUIDs à cause
 * de la limite d'URL PostgREST).
 */
export interface CompatibilityFilter {
  /** Table de specs à joindre en inner (ex: 'pc_case_specs'). */
  specsTable: string
  /**
   * Liste d'opérations filtre. Le Configurator les applique successivement
   * sur le query builder. La colonne ne contient PAS le préfixe table —
   * pour les colonnes de la table specs, mettre `embedded: true`.
   */
  ops: CompatFilterOp[]
  /** Libellé humain affiché à l'utilisateur. */
  reason: string
}

export type CompatFilterOp =
  | { kind: 'eq'; column: string; value: string | number | boolean; embedded?: boolean }
  | { kind: 'contains'; column: string; value: string[]; embedded?: boolean }
  | { kind: 'gte'; column: string; value: number; embedded?: boolean }
  | { kind: 'or'; condition: string; embedded?: boolean }

/**
 * Construit la description du filtre. Renvoie `null` si aucun filtre n'est
 * applicable (pré-requis manquants, info insuffisante pour décider, etc.).
 */
export function buildCompatibilityFilter(
  targetCategory: CategoryKey,
  config: Partial<Record<CategoryKey, Product>>,
): CompatibilityFilter | null {
  const cpu = config['cpu']
  const motherboard = config['motherboard']
  const pcCase = config['pc_case']
  const gpu = config['gpu']

  switch (targetCategory) {
    case 'cpu':
      return null

    case 'motherboard': {
      const socket = cpu?.specs?.['socket'] as string | undefined
      if (!socket) return null
      return {
        specsTable: 'motherboard_specs',
        ops: [{ kind: 'eq', column: 'socket', value: socket, embedded: true }],
        reason: `Socket ${socket}`,
      }
    }

    case 'pc_case': {
      const formFactor = motherboard?.specs?.['form_factor'] as string | undefined
      if (!formFactor) return null
      return {
        specsTable: 'pc_case_specs',
        ops: [{
          kind: 'contains',
          column: 'supported_mobo_form_factors',
          value: [formFactor],
          embedded: true,
        }],
        reason: `Format ${formFactor}`,
      }
    }

    case 'ram': {
      const ramType = motherboard?.specs?.['ram_type'] as string | undefined
      if (!ramType) return null
      return {
        specsTable: 'ram_specs',
        ops: [{ kind: 'eq', column: 'ram_type', value: ramType, embedded: true }],
        reason: ramType,
      }
    }

    case 'gpu': {
      const maxLen = pcCase?.specs?.['max_gpu_length_mm'] as number | undefined
      if (!maxLen) return null
      return {
        specsTable: 'gpu_specs',
        ops: [{
          kind: 'or',
          condition: `length_mm.lte.${maxLen},length_mm.is.null`,
          embedded: true,
        }],
        reason: `Longueur ≤ ${maxLen} mm`,
      }
    }

    case 'storage': {
      if (!motherboard) return null
      const m2Status = detectSlotPresence(motherboard.specs?.['m2_slots'])
      const sataStatus = detectSlotPresence(motherboard.specs?.['sata_6gbs'])

      if (m2Status === 'unknown' || sataStatus === 'unknown') return null
      if (m2Status === 'present' && sataStatus === 'present') return null
      if (m2Status === 'absent' && sataStatus === 'absent') return null

      if (m2Status === 'absent' && sataStatus === 'present') {
        return {
          specsTable: 'storage_specs',
          ops: [{ kind: 'or', condition: 'nvme.eq.false,nvme.is.null', embedded: true }],
          reason: 'Pas de slot M.2 — SATA uniquement',
        }
      }
      return {
        specsTable: 'storage_specs',
        ops: [{ kind: 'or', condition: 'nvme.eq.true,nvme.is.null', embedded: true }],
        reason: 'Pas de port SATA — M.2 NVMe uniquement',
      }
    }

    case 'cpu_cooler': {
      const socket = cpu?.specs?.['socket'] as string | undefined
      if (!socket) return null
      const maxH = pcCase?.specs?.['max_cpu_cooler_height_mm'] as number | undefined
      const ops: CompatFilterOp[] = [
        { kind: 'contains', column: 'cpu_sockets', value: [socket], embedded: true },
      ]
      if (maxH) {
        ops.push({
          kind: 'or',
          condition: `height_mm.lte.${maxH},height_mm.is.null`,
          embedded: true,
        })
      }
      return {
        specsTable: 'cpu_cooler_specs',
        ops,
        reason: maxH ? `Socket ${socket} · hauteur ≤ ${maxH} mm` : `Socket ${socket}`,
      }
    }

    case 'psu': {
      const gpuTdp = gpu?.specs?.['tdp'] as number | undefined
      const cpuTdp = cpu?.specs?.['tdp'] as number | undefined
      if (!gpuTdp && !cpuTdp) return null
      const systemTdp = (gpuTdp ?? 0) + (cpuTdp ?? 0) + 100
      const minWattage = Math.ceil(systemTdp * 1.2)
      return {
        specsTable: 'psu_specs',
        ops: [{ kind: 'gte', column: 'wattage', value: minWattage, embedded: true }],
        reason: `≥ ${minWattage}W (TDP système ~${systemTdp}W)`,
      }
    }

    default:
      return null
  }
}

/**
 * @deprecated Renvoie une liste d'IDs qui dépasse la limite d'URL PostgREST
 * quand l'usage est `.in('id', ids)`. Préférer `buildCompatibilityFilter` qui
 * applique les contraintes côté serveur via un inner join. Conservée pour
 * les tests existants et un éventuel usage standalone.
 */
export async function getCompatibleProductIds(
  targetCategory: CategoryKey,
  config: Partial<Record<CategoryKey, Product>>,
): Promise<CompatibilityResult> {
  const filter = buildCompatibilityFilter(targetCategory, config)
  if (!filter) return { filtered: false, productIds: [] }

  // On exécute directement sur la table de specs (sans préfixe), pour
  // récupérer juste les product_id compatibles. Utilisable pour audits/tests.
  let q = supabase.from(filter.specsTable).select('product_id') as unknown as {
    eq: (c: string, v: unknown) => typeof q
    contains: (c: string, v: unknown) => typeof q
    gte: (c: string, v: unknown) => typeof q
    or: (s: string) => typeof q
    then: (...args: unknown[]) => Promise<{ data: Array<{ product_id: string }> | null }>
  }
  for (const op of filter.ops) {
    if (op.kind === 'eq') q = q.eq(op.column, op.value)
    else if (op.kind === 'contains') q = q.contains(op.column, op.value)
    else if (op.kind === 'gte') q = q.gte(op.column, op.value)
    else if (op.kind === 'or') q = q.or(op.condition)
  }
  const { data } = await (q as unknown as Promise<{ data: Array<{ product_id: string }> | null }>)
  return {
    filtered: true,
    productIds: data?.map((r) => r.product_id) ?? [],
    reason: filter.reason,
  }
}
