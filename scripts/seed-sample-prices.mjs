/**
 * seed-sample-prices.mjs
 * ────────────────────────────────────────────────────────────────────────────
 * Remplit des prix NEUF *estimés* (min/max/moyen) sur tous les produits qui
 * n'en ont pas, pour rendre le configurateur utilisable tout de suite. Ce ne
 * sont PAS de vrais prix marché : estimation par benchmark (CPU/GPU) et par
 * fourchette de catégorie. Le scraper réel (scripts/scrape-prices.mjs) reprend
 * ensuite ces produits (price_updated_at laissé NULL) pour les vrais prix.
 *
 * - Ne touche jamais un prix existant (price_avg_eur IS NULL uniquement).
 * - Écritures par lots (rapide sur plusieurs milliers de lignes).
 *
 * Usage :
 *   node scripts/seed-sample-prices.mjs [--limit=100000] [--dry-run]
 *
 * .env requis : VITE_SUPABASE_URL, VITE_SUPABASE_SERVICE_ROLE_KEY
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
  } catch { /* pas de .env */ }
}
loadEnv()

const URL = process.env.VITE_SUPABASE_URL
const KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) {
  console.error('✗ VITE_SUPABASE_URL et VITE_SUPABASE_SERVICE_ROLE_KEY requis dans .env')
  process.exit(1)
}

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, v] = a.replace(/^--/, '').split('=')
  return [k, v ?? true]
}))
const LIMIT = Number(args.limit ?? 100000)
const DRY = !!args['dry-run']

// Fourchette de prix neuf [bas, haut] (€) par catégorie. Pour CPU/GPU on
// interpole selon le benchmark ; sinon selon un facteur déterministe stable.
const RANGE = {
  cpu:         [70, 650],
  gpu:         [120, 1700],
  ram:         [40, 280],
  storage:     [30, 320],
  motherboard: [70, 520],
  psu:         [45, 260],
  pc_case:     [45, 260],
  cpu_cooler:  [20, 160],
}
const CATEGORIES = Object.keys(RANGE)

function hashUnit(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return (h % 1000) / 1000 // 0..1 déterministe
}

function priceRow(category, id, bench, benchMin, benchMax) {
  const [lo, hi] = RANGE[category] ?? [50, 300]
  let t // position 0..1 dans la fourchette
  if ((category === 'cpu' || category === 'gpu') && bench != null && benchMax > benchMin) {
    t = Math.max(0, Math.min(1, (bench - benchMin) / (benchMax - benchMin)))
    // léger bruit déterministe pour ne pas avoir des prix trop "lisses"
    t = Math.max(0, Math.min(1, t * 0.9 + hashUnit(id) * 0.1))
  } else {
    t = hashUnit(id)
  }
  const avg = Math.round(lo + t * (hi - lo))
  return {
    id,
    price_min_eur: Math.round(avg * 0.92),
    price_max_eur: Math.round(avg * 1.12),
    price_avg_eur: avg,
  }
}

const supabase = createClient(URL, KEY, { auth: { persistSession: false } })

async function chunkedUpdate(rows) {
  const SIZE = 50
  let done = 0
  for (let i = 0; i < rows.length; i += SIZE) {
    const slice = rows.slice(i, i + SIZE)
    await Promise.all(slice.map(({ id, ...vals }) =>
      supabase.from('products').update(vals).eq('id', id),
    ))
    done += slice.length
    process.stdout.write(`\r   …${done}/${rows.length}`)
  }
  process.stdout.write('\n')
}

let grand = 0
for (const category of CATEGORIES) {
  // Bornes de benchmark de la catégorie (pour interpoler les prix CPU/GPU).
  let benchMin = 0, benchMax = 0
  if (category === 'cpu' || category === 'gpu') {
    const { data: bmax } = await supabase.from('products').select('benchmark_score')
      .eq('category', category).not('benchmark_score', 'is', null)
      .order('benchmark_score', { ascending: false }).limit(1)
    const { data: bmin } = await supabase.from('products').select('benchmark_score')
      .eq('category', category).not('benchmark_score', 'is', null)
      .order('benchmark_score', { ascending: true }).limit(1)
    benchMax = bmax?.[0]?.benchmark_score ?? 0
    benchMin = bmin?.[0]?.benchmark_score ?? 0
  }

  // Pagination : on récupère tous les produits sans prix de la catégorie.
  const rows = []
  const PAGE = 1000
  for (let from = 0; from < LIMIT; from += PAGE) {
    const { data, error } = await supabase
      .from('products')
      .select('id, benchmark_score')
      .eq('category', category)
      .is('price_avg_eur', null)
      .range(from, Math.min(from + PAGE, LIMIT) - 1)
    if (error) { console.error(`✗ ${category}:`, error.message); break }
    if (!data || data.length === 0) break
    for (const p of data) rows.push(priceRow(category, p.id, p.benchmark_score, benchMin, benchMax))
    if (data.length < PAGE) break
  }

  if (rows.length === 0) { console.log(`–  ${category}: rien à tarifer`); continue }
  if (DRY) {
    const sample = rows.slice(0, 3).map((r) => `${r.price_avg_eur}€`).join(', ')
    console.log(`[dry] ${category}: ${rows.length} produits (ex: ${sample})`)
    continue
  }
  console.log(`✓  ${category}: ${rows.length} produits`)
  await chunkedUpdate(rows)
  grand += rows.length
}
console.log(DRY ? 'Dry-run terminé.' : `Terminé — ${grand} produits tarifés (estimation).`)
