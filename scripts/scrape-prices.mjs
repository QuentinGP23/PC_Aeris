/**
 * scrape-prices.mjs
 * ────────────────────────────────────────────────────────────────────────────
 * Récupère des prix EUR pour les produits PC Aeris en interrogeant des marchands
 * FR (TopAchat en source principale, LDLC en option) et en faisant correspondre
 * le bon produit par matching de tokens-modèle (évite les résultats sponsorisés
 * ou voisins).
 *
 * Stratégie : faible volume + cache. On ne tarife PAS les 25k produits d'un coup.
 * Chaque run prend les produits jamais tarifés ou les plus anciens d'abord
 * (--max-age), avec un délai poli entre requêtes. Relancer reprend là où on en
 * était. Les produits sans correspondance restent à null (l'UI affiche "—").
 *
 * Usage (clé=valeur) :
 *   node scripts/scrape-prices.mjs [--category=cpu] [--limit=40] [--min-year=2022]
 *                                  [--max-age=7] [--dry-run] [--verbose]
 *                                  [--query="AMD Ryzen 7 7800X3D"]  (test 1 produit)
 *
 * Variables d'environnement (.env) :
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_SERVICE_ROLE_KEY
 *
 * ⚠️ Scraping : faible volume, User-Agent honnête, rate-limit. Pas de
 *    contournement anti-bot. Données mises en cache via price_updated_at.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// ── env ──────────────────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const raw = readFileSync('.env', 'utf-8')
    for (const line of raw.split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq === -1) continue
      const k = t.slice(0, eq).trim()
      const v = t.slice(eq + 1).trim()
      if (!process.env[k]) process.env[k] = v
    }
  } catch {}
}
loadEnv()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  VITE_SUPABASE_URL ou VITE_SUPABASE_SERVICE_ROLE_KEY manquant dans .env')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2).reduce((a, x) => {
  const [k, v] = x.replace(/^--/, '').split('=')
  a[k] = v ?? true
  return a
}, {})
const CATEGORY = args.category ?? null
const LIMIT = parseInt(args.limit ?? '40', 10)
const MAX_AGE_DAYS = parseInt(args['max-age'] ?? '7', 10)
const DRY_RUN = !!args['dry-run']
const VERBOSE = !!args.verbose
const DELAY_MS = parseInt(args.delay ?? '1500', 10)

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ── utils texte / matching ────────────────────────────────────────────────────
const norm = (s) =>
  (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const STOP = new Set(['de', 'le', 'la', 'les', 'pour', 'avec', 'et', 'ghz', 'mhz', 'go', 'gb', 'to', 'tb'])

// Normalise + fusionne nombre et unité de capacité pour réconcilier les
// conventions inter-catalogues : "2TB"/"2 To" → "2to", "32GB"/"32 Go" → "32go".
function normCap(s) {
  return norm(s)
    .replace(/(\d+)\s*(to|tb)\b/g, '$1to')
    .replace(/(\d+)\s*(go|gb)\b/g, '$1go')
}

function tokens(s) {
  return normCap(s)
    .split(' ')
    .filter((t) => t.length >= 2 && !STOP.has(t))
}

// Tokens "modèle" = porteurs de sens fort (contiennent un chiffre, longueur ≥ 3).
// Ex : 7800x3d, 4070, 990, 2tb, ddr5. Sert à exiger une vraie correspondance.
function modelTokens(toks) {
  return toks.filter((t) => t.length >= 3 && /\d/.test(t))
}

// Repère les annonces d'occasion / reconditionné (on veut un prix "neuf").
const isUsed = (title) => /occasion|reconditionn|d.?occasion|refurb/i.test(title)

/**
 * Score une correspondance candidate. Retourne un score 0..1, ou -1 si invalide
 * (le token-modèle le plus discriminant est absent → on refuse).
 */
function matchScore(targetToks, targetModels, candidateTitle) {
  const cand = normCap(candidateTitle)
  const candToks = new Set(tokens(candidateTitle))
  // Exigence : TOUS les tokens-modèle de la cible doivent être présents
  // (ex. "990" ET "2to" → écarte le 990 Pro 1 To quand on cherche le 2 To).
  for (const mt of targetModels) {
    if (!cand.includes(mt)) return -1
  }
  const hits = targetToks.filter((t) => candToks.has(t)).length
  return hits / targetToks.length
}

// ── fetch poli avec petit backoff ──────────────────────────────────────────────
async function getHtml(url, tries = 2) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, 'Accept-Language': 'fr-FR,fr;q=0.9', Accept: 'text/html' },
        redirect: 'follow',
      })
      if (res.status === 200) return await res.text()
      if (res.status === 429 || res.status >= 500) {
        await sleep(2000 * (i + 1))
        continue
      }
      return null // 403/404… inutile de réessayer
    } catch {
      await sleep(1000 * (i + 1))
    }
  }
  return null
}

// ── source : LDLC ────────────────────────────────────────────────────────────
// La page de résultats LDLC est rendue côté serveur et contient, par produit,
// le titre (h3.title-3), le lien fiche et le prix (class="price" → "389€95",
// milliers en &nbsp; : "1 889€95"). Une seule requête par produit.
// Retire les specs intégrées aux noms BuildCores (clock, cœurs, socket, OEM…)
// qui sur-spécifient la requête et faussent le matching. Garde marque + modèle.
function cleanName(s) {
  return (s ?? '')
    .replace(/[®™©]/g, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b\d+(\.\d+)?\s*ghz\b/gi, ' ') // 4.7 GHz
    .replace(/\b\d+\s*-?\s*core\b/gi, ' ') // 8-Core
    .replace(/\b(lga\s*\d+|am[0-9]|fm[0-9]\+?|str[0-9]|tr[0-9]|sp[0-9])\b/gi, ' ') // sockets
    .replace(/\b(socket|oem|tray|wof|bulk|processor|version)\b/gi, ' ')
    .replace(/\//g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function scrapeLDLC(query, ctx) {
  const url = `https://www.ldlc.com/recherche/${encodeURIComponent(query)}/`
  const html = await getHtml(url)
  if (!html) return []

  // Titres + liens (tolère l'espace parasite "class =" du HTML LDLC).
  const titleRe = /<h3 class\s*=\s*"title-3"><a href="(\/fiche\/[A-Z0-9]+\.html)">([^<]+)<\/a>/g
  const titles = []
  let m
  while ((m = titleRe.exec(html))) titles.push({ pos: m.index, url: m[1], title: m[2].trim() })

  // Prix : "389€95" ou "1 889€95", mais le € et les décimales sont entrecoupés
  // de balises (<span>389</span>€<sup>95</sup>). On strippe d'abord, puis on parse.
  const priceRe = /class="price"[^>]*>([\s\S]{0,160})/g
  const prices = []
  while ((m = priceRe.exec(html))) {
    const text = m[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')
    const pm = text.match(/(\d[\d\s]*)\s*€\s*(\d{2})?/)
    if (!pm) continue
    const intPart = pm[1].replace(/\D/g, '')
    if (!intPart || intPart.length > 6) continue
    prices.push({ pos: m.index, price: parseFloat(`${intPart}.${pm[2] ?? '00'}`) })
  }

  // Apparie chaque titre au 1er prix qui le suit (avant le titre suivant).
  const out = []
  for (let k = 0; k < titles.length; k++) {
    const t = titles[k]
    const nextPos = k + 1 < titles.length ? titles[k + 1].pos : Infinity
    const pr = prices.find((p) => p.pos > t.pos && p.pos < nextPos)
    if (pr) out.push({ title: t.title, price: pr.price, url: 'https://www.ldlc.com' + t.url })
  }
  if (VERBOSE) ctx.log(`    LDLC: ${titles.length} résultats, ${out.length} avec prix`)
  return out
}

// ── traitement d'un produit ─────────────────────────────────────────────────────
async function priceOne(product, ctx) {
  const query = cleanName(`${product.manufacturer ?? ''} ${product.name}`)
  const targetToks = [...new Set(tokens(query))]
  const targetModels = modelTokens(targetToks)

  const candidates = []
  for (const c of await scrapeLDLC(query, ctx)) {
    if (isUsed(c.title)) continue // on ne tarife que du neuf
    const sc = matchScore(targetToks, targetModels, c.title)
    if (sc >= 0.5) candidates.push({ ...c, source: 'LDLC', score: sc })
  }

  if (!candidates.length) return null

  // Garde la meilleure correspondance par source (score le plus haut, sinon prix le + bas).
  candidates.sort((a, b) => b.score - a.score || a.price - b.price)
  const prices = candidates.map((c) => c.price)
  const best = candidates[0] // meilleure correspondance = prix "neuf" de référence
  return {
    price_min_eur: Math.min(...prices),
    price_max_eur: Math.max(...prices),
    price_avg_eur: Math.round((prices.reduce((s, p) => s + p, 0) / prices.length) * 100) / 100,
    price_new_eur: best.price,
    price_new_source: best.source,
    retailer_url: best.url,
    price_updated_at: new Date().toISOString(),
    _matchedTitle: best.title,
  }
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  // Mode test : --query="AMD Ryzen 7 7800X3D" → tarife un produit ad-hoc, sans DB.
  if (typeof args.query === 'string') {
    const ctx = { log: (m) => console.log(m) }
    const res = await priceOne({ name: args.query, manufacturer: '' }, ctx)
    console.log(res ? `\n→ ${JSON.stringify(res, null, 2)}` : '\n→ aucun match')
    return
  }

  const cutoff = new Date(Date.now() - MAX_AGE_DAYS * 86400_000).toISOString()
  let q = supabase
    .from('products')
    .select('id, name, manufacturer, category, release_year, price_updated_at')
    .or(`price_updated_at.is.null,price_updated_at.lt.${cutoff}`)
    // Priorité : jamais tarifés / plus anciens d'abord, puis produits récents
    // (bien plus susceptibles d'être en vente → meilleur taux de match).
    .order('price_updated_at', { ascending: true, nullsFirst: true })
    .order('release_year', { ascending: false, nullsFirst: false })
    .limit(LIMIT)
  if (CATEGORY) q = q.eq('category', CATEGORY)
  if (args['min-year']) q = q.gte('release_year', parseInt(args['min-year'], 10))

  const { data: products, error } = await q
  if (error) {
    console.error('❌  Lecture products:', error.message)
    process.exit(1)
  }
  console.log(
    `🔎  ${products.length} produit(s) à traiter` +
      `${CATEGORY ? ` [${CATEGORY}]` : ''} · source LDLC · ` +
      `${DRY_RUN ? 'DRY-RUN' : 'écriture'} · délai ${DELAY_MS}ms\n`,
  )

  let matched = 0
  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    const ctx = { log: (m) => console.log(m) }
    const prefix = `[${String(i + 1).padStart(3)}/${products.length}] ${p.name.slice(0, 48).padEnd(48)}`
    try {
      const res = await priceOne(p, ctx)
      if (!res) {
        console.log(`${prefix} ✗ aucun match`)
      } else {
        const { _matchedTitle, ...row } = res
        matched++
        console.log(
          `${prefix} ✓ ${row.price_new_eur}€ (${row.price_new_source}) ` +
            `[${row.price_min_eur}-${row.price_max_eur}] → « ${_matchedTitle.slice(0, 40)} »`,
        )
        if (!DRY_RUN) {
          const { error: upErr } = await supabase.from('products').update(row).eq('id', p.id)
          if (upErr) console.log(`      ⚠️  update: ${upErr.message}`)
        }
      }
    } catch (e) {
      console.log(`${prefix} ⚠️  ${e.message}`)
    }
    if (i < products.length - 1) await sleep(DELAY_MS)
  }

  console.log(`\n✅  Terminé : ${matched}/${products.length} tarifés (${Math.round((matched / Math.max(products.length, 1)) * 100)}%).`)
  if (!CATEGORY) console.log('   Relance la commande pour continuer (les non tarifés repassent en priorité).')
}

main().catch((e) => {
  console.error('Fatal:', e)
  process.exit(1)
})
