import type { CategoryKey, Product } from '../types'

// Helpers locaux : mêmes règles que compatibility.ts, dupliquées ici pour
// éviter un import circulaire (selection-order est consommé par le store).
function normalizeFormFactorLocal(v: string): string {
  let s = v.toLowerCase().replace(/[\s\-_.]+/g, '')
  s = s.replace(/^(micro|u|µ)atx$/, 'matx')
  s = s.replace(/^extendedatx$/, 'eatx')
  s = s.replace(/^miniitx$/, 'mitx')
  return s
}

function detectSlotPresenceLocal(raw: unknown): 'present' | 'absent' | 'unknown' {
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
 * Ordre recommandé de sélection des composants.
 * Suit la logique d'un montage PC : on part du CPU (qui définit le socket),
 * puis la carte mère, puis on choisit le boîtier (qui contraint GPU/ventirad),
 * puis les composants secondaires.
 */
export const SELECTION_ORDER: CategoryKey[] = [
  'cpu',
  'motherboard',
  'pc_case',
  'ram',
  'gpu',
  'storage',
  'cpu_cooler',
  'psu',
]

/**
 * Pré-requis stricts : pour pouvoir sélectionner X, ces catégories doivent
 * déjà être renseignées (faute de quoi les règles de compatibilité ne peuvent
 * pas s'appliquer correctement).
 */
export const PREREQS: Record<CategoryKey, CategoryKey[]> = {
  cpu: [],
  motherboard: ['cpu'],
  pc_case: ['motherboard'],
  ram: ['motherboard'],
  storage: ['motherboard'],
  gpu: [],
  cpu_cooler: ['cpu'],
  psu: ['cpu'],
}

/** Pré-requis manquants pour une catégorie donnée. */
export function missingPrereqs(
  category: CategoryKey,
  config: Partial<Record<CategoryKey, Product>>,
): CategoryKey[] {
  return PREREQS[category].filter((p) => !config[p])
}

/** Toutes les pré-conditions sont-elles satisfaites ? */
export function prereqsMet(
  category: CategoryKey,
  config: Partial<Record<CategoryKey, Product>>,
): boolean {
  return missingPrereqs(category, config).length === 0
}

/**
 * Vérifie de manière synchrone (sans DB, uniquement sur les specs en mémoire)
 * qu'un produit déjà sélectionné reste compatible avec la nouvelle config.
 * Sert au cascade invalidation : on évite les allers-retours réseau.
 */
function specIsCompatible(
  category: CategoryKey,
  product: Product,
  config: Partial<Record<CategoryKey, Product>>,
): boolean {
  const specs = product.specs ?? {}
  const cpu = config['cpu']
  const motherboard = config['motherboard']
  const pcCase = config['pc_case']
  const gpu = config['gpu']

  switch (category) {
    case 'motherboard': {
      const cpuSocket = cpu?.specs?.['socket'] as string | undefined
      if (cpuSocket && specs['socket'] !== cpuSocket) return false
      return true
    }
    case 'ram': {
      const ramType = motherboard?.specs?.['ram_type'] as string | undefined
      if (ramType && specs['ram_type'] !== ramType) return false
      return true
    }
    case 'pc_case': {
      const mobof = motherboard?.specs?.['form_factor'] as string | undefined
      const supported = specs['supported_mobo_form_factors'] as string[] | undefined
      // Si la spec boîtier n'a pas de liste ou que la mobo n'a pas de format renseigné,
      // on laisse passer (ne pas exclure à tort).
      if (!mobof || !supported || !Array.isArray(supported) || supported.length === 0) return true
      const target = normalizeFormFactorLocal(mobof)
      return supported.some((s) => normalizeFormFactorLocal(s) === target)
    }
    case 'storage': {
      const m2Status = detectSlotPresenceLocal(motherboard?.specs?.['m2_slots'])
      const sataStatus = detectSlotPresenceLocal(motherboard?.specs?.['sata_6gbs'])
      const isNvme = specs['nvme'] as boolean | undefined
      // Si une info manque → on laisse passer.
      if (m2Status === 'unknown' || sataStatus === 'unknown' || isNvme === undefined) return true
      // NVMe mais pas de slot M.2 → KO.
      if (isNvme && m2Status === 'absent') return false
      // SATA mais pas de port SATA → KO.
      if (!isNvme && sataStatus === 'absent') return false
      return true
    }
    case 'cpu_cooler': {
      const cpuSocket = cpu?.specs?.['socket'] as string | undefined
      const supported = specs['cpu_sockets'] as string[] | undefined
      if (cpuSocket && supported && !supported.includes(cpuSocket)) return false
      const maxH = pcCase?.specs?.['max_cpu_cooler_height_mm'] as number | undefined
      const coolerH = specs['height_mm'] as number | undefined
      if (maxH && coolerH && coolerH > maxH) return false
      return true
    }
    case 'gpu': {
      const maxL = pcCase?.specs?.['max_gpu_length_mm'] as number | undefined
      const gpuL = specs['length_mm'] as number | undefined
      if (maxL && gpuL && gpuL > maxL) return false
      return true
    }
    case 'psu': {
      const gpuTdp = (gpu?.specs?.['tdp'] as number | undefined) ?? 0
      const cpuTdp = (cpu?.specs?.['tdp'] as number | undefined) ?? 0
      const wattage = specs['wattage'] as number | undefined
      if (wattage !== undefined && (gpuTdp || cpuTdp)) {
        const minWattage = Math.ceil((gpuTdp + cpuTdp + 100) * 1.2)
        if (wattage < minWattage) return false
      }
      return true
    }
    case 'cpu':
      return true
  }
}

/**
 * Renvoie la liste des catégories à invalider en cascade quand `changed`
 * vient de changer (sélection ou suppression). On parcourt l'ordre de
 * sélection en aval et on retire toute sélection qui n'est plus compatible.
 */
export function cascadeInvalidations(
  changed: CategoryKey,
  config: Partial<Record<CategoryKey, Product>>,
): CategoryKey[] {
  const order = SELECTION_ORDER
  const startIdx = order.indexOf(changed)
  if (startIdx < 0) return []

  const toRemove: CategoryKey[] = []
  const working: Partial<Record<CategoryKey, Product>> = { ...config }

  for (let i = startIdx + 1; i < order.length; i++) {
    const cat = order[i]
    const product = working[cat]
    if (!product) continue
    if (!specIsCompatible(cat, product, working)) {
      toRemove.push(cat)
      delete working[cat]
    }
  }

  return toRemove
}

/**
 * Renvoie la prochaine catégorie à compléter dans l'ordre de sélection,
 * ou null si tout est sélectionné.
 */
export function nextPendingCategory(
  config: Partial<Record<CategoryKey, Product>>,
): CategoryKey | null {
  for (const cat of SELECTION_ORDER) {
    if (!config[cat]) return cat
  }
  return null
}
