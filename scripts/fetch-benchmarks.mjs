/**
 * fetch-benchmarks.mjs
 * ────────────────────────────────────────────────────────────────────────────
 * Remplit products.benchmark_score pour les CPU et GPU à partir des scores
 * PassMark de référence (cpumark / G3D Mark). Le benchmark n'a de sens que pour
 * ces deux catégories — alim, boîtier, etc. n'ont pas de "score de performance".
 *
 * - CPU : match PassMark par nom de produit (model token, ex. 7800x3d, 13700k).
 * - GPU : match par CHIPSET (gpu_specs.chipset, ex. "GeForce RTX 4070 Ti"),
 *         en ignorant la capacité mémoire. Précision via suffixes Ti/Super/XT.
 *
 * Usage :
 *   node scripts/fetch-benchmarks.mjs [--category=cpu|gpu] [--dry-run] [--verbose]
 *
 * Source : PassMark (cpubenchmark.net / videocardbenchmark.net), 1 requête/catégorie
 * (cookie de session requis). Données de référence — usage faible volume.
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

const args = process.argv.slice(2).reduce((a, x) => {
  const [k, v] = x.replace(/^--/, '').split('=')
  a[k] = v ?? true
  return a
}, {})
const ONLY = args.category ?? null
const DRY = !!args['dry-run']
const VERBOSE = !!args.verbose
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

// ── matching ──────────────────────────────────────────────────────────────────
const SUFFIX = new Set(['ti', 'super', 'xt', 'xtx', 'gre', 'ultra'])
const norm = (s) => (s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
const tokens = (s) => norm(s).split(' ').filter((t) => t.length >= 2)
const isModelTok = (t) => t.length >= 3 && /\d/.test(t)
const significant = (toks) => toks.filter((t) => isModelTok(t) || SUFFIX.has(t))

// Marque déduite des tokens — évite les collisions de model-token entre marques
// (ex. Intel i5-6400T vs AMD A4 Micro-6400T, ou GeForce vs Radeon).
const BRAND = {
  intel: ['intel', 'core', 'xeon', 'pentium', 'celeron', 'arc'],
  amd: ['amd', 'ryzen', 'athlon', 'phenom', 'threadripper', 'epyc', 'radeon'],
  nvidia: ['nvidia', 'geforce', 'gtx', 'rtx', 'quadro', 'titan', 'tesla'],
}
function brandOf(set) {
  for (const [b, marks] of Object.entries(BRAND)) if (marks.some((m) => set.has(m))) return b
  return null
}

// Nettoie un nom CPU des specs intégrées (GHz, cœurs, socket, OEM…).
const cleanCpu = (s) =>
  (s ?? '')
    .replace(/[®™©]/g, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b\d+(\.\d+)?\s*ghz\b/gi, ' ')
    .replace(/\b\d+\s*-?\s*core\b/gi, ' ')
    .replace(/\b(lga\s*\d+|am[0-9]|fm[0-9]\+?|str[0-9]|tr[0-9]|sp[0-9])\b/gi, ' ')
    .replace(/\b(socket|oem|tray|wof|bulk|processor|version)\b/gi, ' ')
// Nettoie un chipset GPU : on retire la capacité mémoire (PassMark ne distingue pas par Go).
const cleanGpu = (s) => (s ?? '').replace(/\d+\s*(gb|go|tb|to)\b/gi, ' ')

/** Index de candidats PassMark : { name, score, toks(set), sig(array) } + map model-token → candidats. */
function buildIndex(entries) {
  const cands = entries.map((e) => {
    const toks = tokens(e.name)
    return { name: e.name, score: e.score, set: new Set(toks), sig: significant(toks) }
  })
  const byTok = new Map()
  for (const c of cands) for (const t of c.sig) if (isModelTok(t)) (byTok.get(t) ?? byTok.set(t, []).get(t)).push(c)
  return { cands, byTok }
}

/** Meilleure correspondance : candidat contenant TOUS les tokens significatifs de la cible,
 *  puis le plus proche (moins d'extras), puis le meilleur recouvrement. -1 → aucun. */
function bestMatch(index, targetName) {
  const tToks = tokens(targetName)
  const tSig = significant(tToks)
  const models = tSig.filter(isModelTok)
  if (!models.length) return null
  const tBrand = brandOf(new Set(tToks))
  // Union des candidats partageant au moins un model-token.
  const pool = new Set()
  for (const m of models) for (const c of index.byTok.get(m) ?? []) pool.add(c)
  let best = null
  for (const c of pool) {
    if (!tSig.every((t) => c.set.has(t))) continue // tous les tokens significatifs requis
    const cBrand = brandOf(c.set)
    if (tBrand && cBrand && tBrand !== cBrand) continue // marques incompatibles
    const overlap = tToks.filter((t) => c.set.has(t)).length
    const score = { extras: c.sig.length - tSig.length, overlap }
    if (
      !best ||
      score.extras < best.extras ||
      (score.extras === best.extras && score.overlap > best.overlap)
    ) {
      best = { ...score, cand: c }
    }
  }
  return best?.cand ?? null
}

// ── source PassMark ─────────────────────────────────────────────────────────────
async function fetchPassMark(kind) {
  const base = kind === 'cpu' ? 'https://www.cpubenchmark.net' : 'https://www.videocardbenchmark.net'
  const page = kind === 'cpu' ? '/CPU_mega_page.html' : '/GPU_mega_page.html'
  const r1 = await fetch(base + page, { headers: { 'User-Agent': UA } })
  await r1.text()
  const cookie = (r1.headers.getSetCookie?.() ?? []).map((c) => c.split(';')[0]).join('; ')
  const r2 = await fetch(base + '/data/', {
    headers: { 'User-Agent': UA, Accept: 'application/json', Referer: base + page, 'X-Requested-With': 'XMLHttpRequest', Cookie: cookie },
  })
  const data = (await r2.json()).data ?? []
  const scoreKey = kind === 'cpu' ? 'cpumark' : 'g3d'
  // Les BuildCores sont des composants desktop : on écarte les variantes mobiles.
  const isMobile = (n) => /laptop|mobile|max-?q/i.test(n)
  return data
    .map((e) => ({ name: e.name, score: parseInt(String(e[scoreKey]).replace(/[^\d]/g, ''), 10) }))
    .filter((e) => e.name && Number.isFinite(e.score) && e.score > 0 && !(kind === 'gpu' && isMobile(e.name)))
}

// ── écriture ──────────────────────────────────────────────────────────────────
async function bulkUpdate(rows) {
  // De vrais UPDATE (pas upsert : il validerait les colonnes NOT NULL).
  // Exécutés par lots parallèles pour la vitesse.
  let done = 0
  const CONC = 20
  for (let i = 0; i < rows.length; i += CONC) {
    const batch = rows.slice(i, i + CONC)
    const res = await Promise.all(
      batch.map((r) => supabase.from('products').update({ benchmark_score: r.benchmark_score }).eq('id', r.id)),
    )
    for (const { error } of res) {
      if (error) console.log('  ⚠️ update:', error.message)
      else done++
    }
  }
  return done
}

// ── passes ──────────────────────────────────────────────────────────────────────
async function runCpu() {
  console.log('\n=== CPU ===')
  const pm = await fetchPassMark('cpu')
  console.log(`PassMark : ${pm.length} CPU`)
  const index = buildIndex(pm)
  const { data: products } = await supabase.from('products').select('id, name, manufacturer').eq('category', 'cpu')
  const rows = []
  for (const p of products) {
    const m = bestMatch(index, cleanCpu(`${p.manufacturer ?? ''} ${p.name}`))
    if (m) {
      rows.push({ id: p.id, benchmark_score: m.score })
      if (VERBOSE) console.log(`  ✓ ${p.name.slice(0, 42).padEnd(42)} → ${m.score}  (${m.name})`)
    }
  }
  console.log(`Match : ${rows.length}/${products.length} (${Math.round((rows.length / products.length) * 100)}%)`)
  if (!DRY) console.log(`Écrits : ${await bulkUpdate(rows)}`)
}

async function runGpu() {
  console.log('\n=== GPU ===')
  const pm = await fetchPassMark('gpu')
  console.log(`PassMark : ${pm.length} GPU`)
  const index = buildIndex(pm)
  // Produits GPU + leur chipset.
  const { data: products } = await supabase
    .from('products')
    .select('id, name, gpu_specs(chipset)')
    .eq('category', 'gpu')
  const cache = new Map() // chipset → score|null
  const rows = []
  let withChipset = 0
  for (const p of products) {
    const chipset = p.gpu_specs?.chipset
    if (!chipset) continue
    withChipset++
    if (!cache.has(chipset)) {
      const m = bestMatch(index, cleanGpu(chipset))
      cache.set(chipset, m?.score ?? null)
      if (VERBOSE && m) console.log(`  ✓ ${chipset.padEnd(34)} → ${m.score}  (${m.name})`)
      else if (VERBOSE) console.log(`  ✗ ${chipset}`)
    }
    const score = cache.get(chipset)
    if (score != null) rows.push({ id: p.id, benchmark_score: score })
  }
  const matchedChipsets = [...cache.values()].filter((v) => v != null).length
  console.log(`Chipsets distincts matchés : ${matchedChipsets}/${cache.size}`)
  console.log(`Produits couverts : ${rows.length}/${withChipset} (avec chipset)`)
  if (!DRY) console.log(`Écrits : ${await bulkUpdate(rows)}`)
}

// ── main ──────────────────────────────────────────────────────────────────────
if (!ONLY || ONLY === 'cpu') await runCpu()
if (!ONLY || ONLY === 'gpu') await runGpu()
console.log(`\n✅ Terminé${DRY ? ' (DRY-RUN, rien écrit)' : ''}.`)
