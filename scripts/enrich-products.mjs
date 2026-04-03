/**
 * enrich-products.mjs
 * ────────────────────────────────────────────────────────────────────────────
 * Enrichit les produits PC Aeris avec les fourchettes de prix second-hand
 * via l'API eBay Browse.
 *
 * Usage :
 *   node scripts/enrich-products.mjs [--category cpu] [--limit 50] [--dry-run]
 *
 * Variables d'environnement (.env) :
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_SERVICE_ROLE_KEY
 *   EBAY_CLIENT_ID           (developer.ebay.com → App ID)
 *   EBAY_CLIENT_SECRET       (developer.ebay.com → Cert ID)
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

const SUPABASE_URL       = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY       = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const EBAY_CLIENT_ID     = process.env.EBAY_CLIENT_ID
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET

const args     = process.argv.slice(2).reduce((acc, a) => {
  const [k, v] = a.replace(/^--/, '').split('=')
  acc[k] = v ?? true
  return acc
}, {})

const CATEGORY  = args.category ?? null
const DRY_RUN   = !!args['dry-run']
const PAGE_SIZE = 500

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const sleep    = ms => new Promise(r => setTimeout(r, ms))
const log      = (e, m) => console.log(`${e}  ${m}`)

// ── eBay ──────────────────────────────────────────────────────────────────────

let _ebayToken = null
let _ebayExpiry = 0

async function getEbayToken() {
  if (!EBAY_CLIENT_ID || !EBAY_CLIENT_SECRET) return null
  if (_ebayToken && Date.now() < _ebayExpiry) return _ebayToken

  const creds = Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString('base64')
  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type':  'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope',
  })

  if (!res.ok) { log('⚠️', `eBay auth failed: ${res.status}`); return null }

  const json = await res.json()
  _ebayToken  = json.access_token
  _ebayExpiry = Date.now() + (json.expires_in - 60) * 1000
  log('🔑', 'eBay token obtenu')
  return _ebayToken
}

async function fetchEbayPrices(product) {
  const token = await getEbayToken()
  if (!token) return null

  const q = `${product.manufacturer ?? ''} ${product.name}`.trim()
  const url = new URL('https://api.ebay.com/buy/browse/v1/item_summary/search')
  url.searchParams.set('q', q)
  url.searchParams.set('filter', 'conditionIds:{3000},deliveryCountry:FR,currency:EUR')
  url.searchParams.set('limit', '50')
  url.searchParams.set('sort', 'price')

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'Authorization':           `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_FR',
      }
    })
    if (!res.ok) return null

    const data   = await res.json()
    const items  = data.itemSummaries ?? []
    const prices = items
      .map(i => parseFloat(i.price?.value ?? '0'))
      .filter(p => p > 5)

    if (prices.length < 3) return null

    prices.sort((a, b) => a - b)
    const trimmed = prices.slice(
      Math.floor(prices.length * 0.1),
      Math.ceil(prices.length * 0.9)
    )

    return {
      price_min_eur:    Math.round(prices[0] * 100) / 100,
      price_max_eur:    Math.round(prices[prices.length - 1] * 100) / 100,
      price_avg_eur:    Math.round(trimmed.reduce((a, b) => a + b, 0) / trimmed.length * 100) / 100,
      price_updated_at: new Date().toISOString(),
    }
  } catch (err) {
    log('⚠️', `eBay error for "${product.name}": ${err.message}`)
    return null
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  log('🚀', `Enrichissement prix second-hand${DRY_RUN ? ' [DRY-RUN]' : ''}`)
  log('💶', `eBay: ${EBAY_CLIENT_ID ? '✓ prêt' : '✗ EBAY_CLIENT_ID manquant — en attente validation'}`)
  if (!EBAY_CLIENT_ID) { log('ℹ️', 'Lance ce script une fois les credentials eBay ajoutés dans .env'); return }
  console.log()

  const products = []
  let offset = 0
  while (true) {
    let query = supabase
      .from('products')
      .select('id, name, manufacturer')
      .is('price_avg_eur', null)
      .order('created_at')
      .range(offset, offset + PAGE_SIZE - 1)

    if (CATEGORY) query = query.eq('category', CATEGORY)

    const { data, error } = await query
    if (error) { console.error(error); process.exit(1) }
    if (!data || data.length === 0) break
    products.push(...data)
    if (data.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  log('📋', `${products.length} produits sans prix\n`)

  let done = 0, failed = 0

  for (const [i, product] of products.entries()) {
    const progress = `[${i + 1}/${products.length}]`
    const prices   = await fetchEbayPrices(product)

    if (!prices) {
      log('❌', `${progress} ${product.name} — pas assez d'annonces`)
      failed++
      await sleep(250)
      continue
    }

    log('💶', `${progress} ${product.name} → ${prices.price_min_eur}–${prices.price_max_eur}€ (moy: ${prices.price_avg_eur}€)`)

    if (!DRY_RUN) {
      const { error: err } = await supabase
        .from('products').update(prices).eq('id', product.id)
      if (err) { log('⚠️', err.message); failed++ }
      else done++
    } else {
      done++
    }

    await sleep(250)
  }

  console.log()
  log('✅', `Terminé — enrichis: ${done} | sans données: ${failed}`)
}

main().catch(console.error)
