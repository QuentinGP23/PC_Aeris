/**
 * reset-prices.mjs
 * ────────────────────────────────────────────────────────────────────────────
 * Remet à NULL les prix d'une catégorie (nettoyage de données erronées).
 * Le scraper les reprendra ensuite (price_updated_at remis à null).
 *
 * Usage :
 *   node scripts/reset-prices.mjs <categorie> [--dry-run]
 *   ex : node scripts/reset-prices.mjs ram
 *
 * .env requis : VITE_SUPABASE_URL, VITE_SUPABASE_SERVICE_ROLE_KEY
 * ────────────────────────────────────────────────────────────────────────────
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

for (const l of readFileSync('.env', 'utf-8').split('\n')) {
  const t = l.trim()
  if (!t || t.startsWith('#')) continue
  const i = t.indexOf('=')
  if (i > 0 && !process.env[t.slice(0, i).trim()]) process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
}

const CAT = process.argv[2]
const DRY = process.argv.includes('--dry-run')
const CATEGORIES = ['cpu', 'gpu', 'ram', 'storage', 'motherboard', 'psu', 'pc_case', 'cpu_cooler']
if (!CAT || !CATEGORIES.includes(CAT)) {
  console.error(`Usage: node scripts/reset-prices.mjs <categorie> [--dry-run]\n  catégories : ${CATEGORIES.join(', ')}`)
  process.exit(1)
}

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const { count } = await sb.from('products').select('*', { count: 'exact', head: true }).eq('category', CAT).not('price_avg_eur', 'is', null)
console.log(`${CAT} : ${count ?? 0} produit(s) tarifé(s)`)
if (DRY) { console.log('Dry-run — rien modifié.'); process.exit(0) }
if (!count) { console.log('Rien à nettoyer.'); process.exit(0) }

const { error } = await sb.from('products')
  .update({ price_min_eur: null, price_max_eur: null, price_avg_eur: null, price_new_eur: null, price_new_source: null, price_updated_at: null })
  .eq('category', CAT).not('price_avg_eur', 'is', null)
console.log(error ? `✗ ${error.message}` : `✓ ${CAT} : prix remis à null (le scraper les reprendra).`)
