/**
 * enrich-images.mjs
 * ────────────────────────────────────────────────────────────────────────────
 * Récupère les images produits depuis (par priorité) :
 *  1. Amazon  — construction directe depuis l'ASIN
 *  2. Page fabricant — og:image
 *
 * Usage :
 *   node scripts/enrich-images.mjs [--category cpu] [--concurrency 20] [--dry-run]
 * ────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

function loadEnv() {
  try {
    const raw = readFileSync('.env', 'utf-8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  } catch {}
}

loadEnv()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
)

const args = process.argv.slice(2).reduce((acc, a) => {
  const [k, v] = a.replace(/^--/, '').split('=')
  acc[k] = v ?? true
  return acc
}, {})

const CATEGORY    = args.category    ?? null
const CONCURRENCY = parseInt(args.concurrency ?? '20')
const DRY_RUN     = !!args['dry-run']
const PAGE_SIZE   = 1000

const log = (e, m) => console.log(`${e}  ${m}`)

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
}

// ── Amazon ────────────────────────────────────────────────────────────────────

async function fetchAmazonImage(asin) {
  if (!asin) return null
  const url = `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`
  try {
    const res = await fetch(url, { method: 'HEAD', headers: HEADERS, signal: AbortSignal.timeout(5000) })
    return res.ok ? url : null
  } catch {
    return null
  }
}

// ── Newegg ────────────────────────────────────────────────────────────────────

async function fetchNeweggImage(sku) {
  if (!sku) return null
  // Newegg image CDN — format standard
  const url = `https://c1.neweggimages.com/ProductImageCompressAll300/${sku}.jpg`
  try {
    const res = await fetch(url, { method: 'HEAD', headers: HEADERS, signal: AbortSignal.timeout(5000) })
    return res.ok ? url : null
  } catch {
    return null
  }
}

// ── Fabricant (og:image) ──────────────────────────────────────────────────────

function extractOgImage(html) {
  const m =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
  return m?.[1] ?? null
}

async function fetchManufacturerImage(url) {
  if (!url) return null
  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    return extractOgImage(await res.text())
  } catch {
    return null
  }
}

// ── Concurrency pool ──────────────────────────────────────────────────────────

async function runPool(items, concurrency, fn) {
  const results = new Array(items.length)
  let index = 0

  async function worker() {
    while (index < items.length) {
      const i = index++
      results[i] = await fn(items[i], i)
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker))
  return results
}

// ── Process one product ───────────────────────────────────────────────────────

const stats = { amazon: 0, manufacturer: 0, failed: 0 }
let processed = 0

async function processProduct(product, i) {
  let imageUrl = null
  let source   = ''

  if (product.amazon_sku) {
    imageUrl = await fetchAmazonImage(product.amazon_sku)
    if (imageUrl) source = 'amazon'
  }

  if (!imageUrl && product.newegg_sku) {
    imageUrl = await fetchNeweggImage(product.newegg_sku)
    if (imageUrl) source = 'newegg'
  }

  if (!imageUrl && product.manufacturer_url) {
    imageUrl = await fetchManufacturerImage(product.manufacturer_url)
    if (imageUrl) source = 'fabricant'
  }

  processed++
  if (processed % 100 === 0) log('⏳', `${processed} traités...`)

  if (!imageUrl) {
    stats.failed++
    return
  }

  if (!DRY_RUN) {
    const { error } = await supabase
      .from('products')
      .update({ image_url: imageUrl })
      .eq('id', product.id)

    if (error) { stats.failed++; return }
  }

  stats[source] = (stats[source] ?? 0) + 1
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  log('🚀', `Enrichissement images${DRY_RUN ? ' [DRY-RUN]' : ''} — ${CONCURRENCY} requêtes parallèles`)
  console.log()

  // Charger tous les produits sans image
  const products = []
  let offset = 0
  while (true) {
    let query = supabase
      .from('products')
      .select('id, amazon_sku, newegg_sku, manufacturer_url')
      .is('image_url', null)
      .range(offset, offset + PAGE_SIZE - 1)

    if (CATEGORY) query = query.eq('category', CATEGORY)

    const { data, error } = await query
    if (error) { console.error(error); process.exit(1) }
    if (!data?.length) break
    products.push(...data)
    if (data.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  log('📋', `${products.length} produits sans image\n`)

  await runPool(products, CONCURRENCY, processProduct)

  console.log()
  log('✅', `Terminé — Amazon: ${stats.amazon} | Fabricant: ${stats.manufacturer} | Introuvables: ${stats.failed}`)
}

main().catch(console.error)
