/**
 * seed-prebuilts.mjs
 * ────────────────────────────────────────────────────────────────────────────
 * Compose des configs pré-faites RÉELLES et COMPATIBLES dans prebuilt_configs.
 * Sélection : CPU/GPU par tier de benchmark, puis carte mère (socket), RAM
 * (type), alim (wattage), boîtier (format), ventirad (socket), stockage (NVMe)
 * en respectant les règles de compatibilité. Budget = indicatif par gamme.
 *
 * Usage : node scripts/seed-prebuilts.mjs [--dry-run]
 * ────────────────────────────────────────────────────────────────────────────
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

function loadEnv() {
  try {
    for (const line of readFileSync('.env', 'utf-8').split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq === -1) continue
      const k = t.slice(0, eq).trim()
      if (!process.env[k]) process.env[k] = t.slice(eq + 1).trim()
    }
  } catch {}
}
loadEnv()
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY)
const DRY = process.argv.includes('--dry-run')

// ── sélecteurs compat-aware ─────────────────────────────────────────────────────
// Exclut les pièces serveur / workstation / OEM exotiques pour rester grand public.
const notServerCpu = (q) =>
  ['%epyc%', '%threadripper%', '%xeon%', '% pro %', '%-pro%', '%lga2066%', '%lga2011%', '%lga 2066%', '%lga 2011%'].reduce(
    (qq, p) => qq.not('name', 'ilike', p),
    q,
  )
const notServerGpu = (q) =>
  ['%rtx a%', '%quadro%', '%tesla%', '%radeon pro%', '%instinct%', '% wx%', '%nvs %', '%ada generation%'].reduce(
    (qq, p) => qq.not('name', 'ilike', p),
    q,
  )

async function pickCpu({ minB, maxB, byCores, needIgpu }) {
  let q = supabase
    .from('products')
    .select('id, name, price_avg_eur, benchmark_score, cpu_specs!inner(socket, tdp, total_cores, integrated_graphics)')
    .eq('category', 'cpu')
    .not('cpu_specs.socket', 'is', null)
    .gte('benchmark_score', minB)
    .lte('benchmark_score', maxB)
    .order('benchmark_score', { ascending: false })
    .limit(byCores ? 40 : needIgpu ? 40 : 1)
  q = notServerCpu(q)
  // Écarte les plateformes HEDT/serveur par le socket (ex. i9-9960X / 7980XE
  // n'embarquent pas toujours le socket dans leur nom).
  q = q.not('cpu_specs.socket', 'ilike', '%2066%').not('cpu_specs.socket', 'ilike', '%2011%')
  if (needIgpu) {
    // build sans GPU → iGPU obligatoire. La donnée integrated_graphics est peu
    // fiable. On cible donc un Intel Core i3/i5 moderne (socket LGA1700, non-"F") :
    // ces puces grand public embarquent toujours un circuit graphique UHD.
    q = q
      .eq('cpu_specs.socket', 'LGA 1700')
      .or('name.ilike.*core i3*,name.ilike.*core i5*')
      .not('name', 'ilike', '%f %')
      .not('name', 'ilike', '%f')
  }
  const { data } = await q
  if (!data?.length) return null
  if (byCores) data.sort((a, b) => (b.cpu_specs.total_cores ?? 0) - (a.cpu_specs.total_cores ?? 0))
  return data[0]
}

async function pickGpu({ minB, maxB }) {
  let q = supabase
    .from('products')
    .select('id, name, price_avg_eur, benchmark_score, gpu_specs!inner(tdp)')
    .eq('category', 'gpu')
    .gte('benchmark_score', minB)
    .lte('benchmark_score', maxB)
    .order('benchmark_score', { ascending: false })
    .limit(1)
  q = notServerGpu(q)
  const { data } = await q
  return data?.[0] ?? null
}

async function pickMobo(socket) {
  const { data } = await supabase
    .from('products')
    .select('id, name, price_avg_eur, motherboard_specs!inner(socket, form_factor, ram_type)')
    .eq('category', 'motherboard')
    .eq('motherboard_specs.socket', socket)
    .limit(1)
  return data?.[0] ?? null
}

async function pickRam(ramType, capGB) {
  let q = supabase
    .from('products')
    .select('id, name, price_avg_eur, ram_specs!inner(ram_type, total_capacity_gb, registered)')
    .eq('category', 'ram')
    .eq('ram_specs.total_capacity_gb', capGB)
    .not('name', 'ilike', '%registered%')
    .limit(1)
  if (ramType) q = q.eq('ram_specs.ram_type', ramType)
  const { data } = await q
  if (data?.[0]) return data[0]
  // fallback : même type, n'importe quelle capacité grand public (≤ 64 Go), non registered
  let q2 = supabase
    .from('products')
    .select('id, name, price_avg_eur, ram_specs!inner(ram_type, total_capacity_gb)')
    .eq('category', 'ram')
    .lte('ram_specs.total_capacity_gb', 64)
    .not('name', 'ilike', '%registered%')
    .order('ram_specs(total_capacity_gb)', { ascending: false })
    .limit(1)
  if (ramType) q2 = q2.eq('ram_specs.ram_type', ramType)
  const { data: d2 } = await q2
  return d2?.[0] ?? null
}

async function pickPsu(watt) {
  const { data } = await supabase
    .from('products')
    .select('id, name, price_avg_eur, psu_specs!inner(wattage)')
    .eq('category', 'psu')
    .gte('psu_specs.wattage', watt)
    .order('psu_specs(wattage)', { ascending: true })
    .limit(1)
  return data?.[0] ?? null
}

async function pickCase(formFactor) {
  let q = supabase.from('products').select('id, name, price_avg_eur, pc_case_specs!inner(supported_mobo_form_factors)').eq('category', 'pc_case').limit(1)
  if (formFactor) q = q.contains('pc_case_specs.supported_mobo_form_factors', [formFactor])
  const { data } = await q
  return data?.[0] ?? null
}

async function pickCooler(socket) {
  let q = supabase.from('products').select('id, name, price_avg_eur, cpu_cooler_specs!inner(cpu_sockets)').eq('category', 'cpu_cooler').limit(1)
  if (socket) q = q.contains('cpu_cooler_specs.cpu_sockets', [socket])
  const { data } = await q
  return data?.[0] ?? null
}

async function pickStorage() {
  // SSD NVMe grand public ~1-2 To (pas les 4/8 To exotiques).
  const { data } = await supabase
    .from('products')
    .select('id, name, price_avg_eur, storage_specs!inner(nvme, capacity_gb)')
    .eq('category', 'storage')
    .eq('storage_specs.nvme', true)
    .gte('storage_specs.capacity_gb', 1000)
    .lte('storage_specs.capacity_gb', 2000)
    .order('storage_specs(capacity_gb)', { ascending: true })
    .limit(1)
  return data?.[0] ?? null
}

// ── définitions des builds ──────────────────────────────────────────────────────
const BUILDS = [
  // ── GAMING ──
  { slug: 'gaming-entree', name: 'Gaming — Entrée de gamme', usage: 'gaming', tier: 'entree',
    summary: '1080p fluide sur la plupart des jeux, sans se ruiner.',
    cpu: { minB: 15000, maxB: 25000 }, gpu: { minB: 9000, maxB: 15000 }, budget: [650, 850] },
  { slug: 'gaming-milieu', name: 'Gaming — Milieu de gamme', usage: 'gaming', tier: 'milieu',
    summary: '1080p / 1440p haut niveau, fluide sur les jeux récents.',
    cpu: { minB: 22000, maxB: 38000 }, gpu: { minB: 14000, maxB: 23000 }, budget: [900, 1100] },
  { slug: 'gaming-haut', name: 'Gaming — Haut de gamme', usage: 'gaming', tier: 'haut',
    summary: '1440p / 4K, hautes fréquences, prêt pour les années à venir.',
    cpu: { minB: 35000, maxB: 55000 }, gpu: { minB: 26000, maxB: 33000 }, budget: [1700, 2200] },
  // ── CRÉATION ──
  { slug: 'creation-entree', name: 'Création — Entrée de gamme', usage: 'creation', tier: 'entree',
    summary: 'Montage 1080p, retouche photo — bon multi-cœurs, prix doux.',
    cpu: { minB: 20000, maxB: 30000, byCores: true }, gpu: { minB: 10000, maxB: 16000 }, budget: [900, 1200] },
  { slug: 'creation-milieu', name: 'Création — Milieu de gamme', usage: 'creation', tier: 'milieu',
    summary: 'Montage 4K, 3D légère — CPU musclé, 32 Go de RAM.',
    cpu: { minB: 30000, maxB: 45000, byCores: true }, gpu: { minB: 16000, maxB: 22000 }, budget: [1300, 1650] },
  { slug: 'creation-haut', name: 'Création — Haut de gamme', usage: 'creation', tier: 'haut',
    summary: 'Montage 4K+, 3D, rendu lourd — CPU multi-cœurs, RAM généreuse.',
    cpu: { minB: 35000, maxB: 70000, byCores: true }, gpu: { minB: 17000, maxB: 24000 }, budget: [1700, 2200] },
  // ── STREAMING / POLYVALENT ──
  { slug: 'streaming-entree', name: 'Streaming — Entrée de gamme', usage: 'streaming', tier: 'entree',
    summary: 'Jouer et streamer en 1080p sans compromis majeur.',
    cpu: { minB: 18000, maxB: 28000 }, gpu: { minB: 11000, maxB: 16000 }, budget: [800, 1050] },
  { slug: 'streaming-milieu', name: 'Streaming — Milieu de gamme', usage: 'streaming', tier: 'milieu',
    summary: 'Jouer et streamer en même temps — équilibre CPU / GPU.',
    cpu: { minB: 28000, maxB: 42000 }, gpu: { minB: 16000, maxB: 24000 }, budget: [1100, 1450] },
  { slug: 'streaming-haut', name: 'Streaming — Haut de gamme', usage: 'streaming', tier: 'haut',
    summary: 'Stream haute qualité + jeu exigeant, sans concession.',
    cpu: { minB: 35000, maxB: 50000 }, gpu: { minB: 24000, maxB: 32000 }, budget: [1550, 1950] },
  // ── BUREAUTIQUE / ÉTUDES ──
  { slug: 'bureautique-entree', name: 'Bureautique — Entrée de gamme', usage: 'bureautique', tier: 'entree',
    summary: 'Navigation, bureautique, études — silencieux et économe.',
    cpu: { minB: 12000, maxB: 18000 }, gpu: null, budget: [500, 720] },
  { slug: 'bureautique-milieu', name: 'Bureautique — Milieu de gamme', usage: 'bureautique', tier: 'milieu',
    summary: 'Multitâche fluide, bureautique avancée, un peu de tout.',
    cpu: { minB: 18000, maxB: 24000 }, gpu: null, budget: [700, 950] },
  { slug: 'bureautique-haut', name: 'Bureautique — Haut de gamme', usage: 'bureautique', tier: 'haut',
    summary: 'Station bureautique réactive, prête pour les gros classeurs.',
    cpu: { minB: 24000, maxB: 31000 }, gpu: null, budget: [950, 1250] },
]

async function compose(def) {
  const cpu = await pickCpu({ ...def.cpu, needIgpu: !def.gpu })
  if (!cpu) return { def, error: 'CPU introuvable' }
  const socket = cpu.cpu_specs.socket
  const mobo = await pickMobo(socket)
  const gpu = def.gpu ? await pickGpu(def.gpu) : null
  const ramGB = def.usage === 'bureautique' ? 16 : def.usage === 'creation' && def.tier !== 'entree' ? 64 : 32
  const ram = await pickRam(mobo?.motherboard_specs?.ram_type, ramGB)
  const watt = Math.ceil(((cpu.cpu_specs.tdp ?? 105) + (gpu?.gpu_specs?.tdp ?? 0) + 150) * 1.15)
  const psu = await pickPsu(watt)
  const pcCase = await pickCase(mobo?.motherboard_specs?.form_factor)
  const cooler = await pickCooler(socket)
  const storage = await pickStorage()

  const parts = { cpu, motherboard: mobo, gpu, ram, psu, pc_case: pcCase, cpu_cooler: cooler, storage }
  const components = {}
  for (const [cat, p] of Object.entries(parts)) if (p) components[cat] = p.id
  return { def, parts, components }
}

async function main() {
  console.log(`Seed prebuilts ${DRY ? '(DRY-RUN)' : ''}\n`)
  let order = 0
  for (const def of BUILDS) {
    const r = await compose(def)
    if (r.error) { console.log(`✗ ${def.name}: ${r.error}`); continue }
    const filled = Object.keys(r.components).length
    console.log(`✓ ${def.name}  (${filled}/8 composants)`)
    for (const [cat, p] of Object.entries(r.parts)) console.log(`    ${cat.padEnd(12)} ${p ? p.name.slice(0, 52) : '— (manquant)'}`)
    if (!DRY) {
      const row = {
        slug: def.slug, name: def.name, usage: def.usage, tier: def.tier, summary: def.summary,
        components: r.components, est_budget_min: def.budget[0], est_budget_max: def.budget[1], sort_order: order++,
      }
      const { error } = await supabase.from('prebuilt_configs').upsert(row, { onConflict: 'slug' })
      if (error) console.log(`    ⚠️ ${error.message}`)
    }
  }
  console.log('\n✅ Terminé.')
}
main().catch((e) => { console.error(e); process.exit(1) })
