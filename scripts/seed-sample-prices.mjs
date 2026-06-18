/**
 * seed-sample-prices.mjs
 * ────────────────────────────────────────────────────────────────────────────
 * Remplit des prix NEUF *d'exemple* (min/max/moyen) pour la démo, sur les
 * produits qui n'en ont pas encore. Estimation déterministe par catégorie /
 * année (PAS de vrai prix marché) — sert à montrer l'UI prix + l'occasion
 * dérivée en attendant le scraping réel (scripts/scrape-prices.mjs).
 *
 * - N'écrase jamais un prix existant (ne remplit que price_avg_eur IS NULL).
 * - Laisse price_updated_at à NULL pour que le scraper réel reprenne ensuite
 *   ces produits et remplace l'estimation par de vrais prix.
 *
 * Usage :
 *   node scripts/seed-sample-prices.mjs [--limit=80] [--dry-run]
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
const LIMIT = Number(args.limit ?? 80)
const DRY = !!args['dry-run']

const CATEGORIES = ['cpu', 'gpu', 'ram', 'storage', 'motherboard', 'psu', 'pc_case', 'cpu_cooler']

// Prix moyen neuf de référence par catégorie (€), à moduler.
const BASE = { cpu: 300, gpu: 650, ram: 95, storage: 120, motherboard: 190, psu: 115, pc_case: 110, cpu_cooler: 75 }

// Facteur déterministe [0.55..1.70] dérivé de l'id (stable d'un run à l'autre).
function hashFactor(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return 0.55 + ((h % 1000) / 1000) * 1.15
}

function estimate(category, id, year) {
  const base = BASE[category] ?? 130
  const yearBump = year >= 2024 ? 1.15 : year <= 2019 ? 0.8 : 1
  const avg = Math.round(base * hashFactor(id) * yearBump)
  return {
    price_min_eur: Math.round(avg * 0.9),
    price_max_eur: Math.round(avg * 1.15),
    price_avg_eur: avg,
  }
}

const supabase = createClient(URL, KEY, { auth: { persistSession: false } })

let total = 0
for (const category of CATEGORIES) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, release_year')
    .eq('category', category)
    .is('price_avg_eur', null)
    .limit(LIMIT)
  if (error) { console.error(`✗ ${category}:`, error.message); continue }
  if (!data || data.length === 0) { console.log(`–  ${category}: rien à remplir`); continue }

  for (const p of data) {
    const row = estimate(category, p.id, p.release_year ?? 2022)
    if (DRY) { console.log(`[dry] ${category} ${p.name?.slice(0, 40)} → ${row.price_avg_eur}€ [${row.price_min_eur}-${row.price_max_eur}]`); continue }
    const { error: upErr } = await supabase.from('products').update(row).eq('id', p.id)
    if (upErr) console.error(`  ✗ ${p.id}:`, upErr.message)
    else total++
  }
  console.log(`✓  ${category}: ${data.length} produits`)
}
console.log(DRY ? 'Dry-run terminé.' : `Terminé — ${total} produits tarifés (exemple).`)
