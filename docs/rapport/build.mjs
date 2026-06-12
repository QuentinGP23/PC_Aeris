// Génère le rapport PDF paginé à partir de docs/rapport/index.html.
// Deux passes : rendu → lecture des pages réelles de chaque entrée (pdfjs) →
// re-rendu avec les numéros injectés dans le sommaire / illustrations / annexes.
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const htmlPath = resolve(__dirname, 'index.html')
const pdfPath = resolve(__dirname, 'PC_Aeris_rapport.pdf')
const tmp = resolve(__dirname, '.pass1.pdf')

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find(existsSync)
if (!CHROME) throw new Error('Chrome/Edge introuvable pour le rendu PDF.')

const norm = (s) =>
  (s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '')

const html = readFileSync(htmlPath, 'utf8')

const pdfOpts = {
  format: 'A4',
  printBackground: true,
  margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
  displayHeaderFooter: true,
  headerTemplate:
    '<div style="font-size:7px;color:#aab0c0;width:100%;padding:0 15mm;text-align:right;font-family:Segoe UI,Arial;">PC Aeris — Rapport de projet</div>',
  footerTemplate:
    '<div style="font-size:7px;color:#aab0c0;width:100%;padding:0 15mm;font-family:Segoe UI,Arial;display:flex;justify-content:space-between;"><span>Quentin Geoffroy · ECV — Master 2 Développement</span><span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
}

async function render(content, out) {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] })
  const p = await b.newPage()
  await p.setContent(content, { waitUntil: 'networkidle0' })
  await p.pdf({ path: out, ...pdfOpts })
  await b.close()
}

async function extractPages(file) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(file)), isEvalSupported: false, useSystemFonts: true }).promise
  const pages = []
  for (let i = 1; i <= doc.numPages; i++) {
    const tc = await (await doc.getPage(i)).getTextContent()
    pages.push(norm(tc.items.map((it) => it.str).join(' ')))
  }
  return pages
}

// Dernière page contenant le texte (saute le sommaire, garde le corps).
// Gère la frontière de chiffre (« figure1 » ≠ « figure10 »).
function lastPageOf(pages, needle) {
  let last = ''
  const endsDigit = /\d$/.test(needle)
  for (let i = 0; i < pages.length; i++) {
    const hay = pages[i]
    let idx = hay.indexOf(needle)
    while (idx !== -1) {
      const after = hay[idx + needle.length]
      if (!(endsDigit && after >= '0' && after <= '9')) { last = i + 1; break }
      idx = hay.indexOf(needle, idx + 1)
    }
  }
  return last
}

const finds = [...new Set([...html.matchAll(/data-find="([^"]*)"/g)].map((m) => m[1]))]

await render(html, tmp)
const pages = await extractPages(tmp)
const map = {}
for (const f of finds) map[f] = lastPageOf(pages, norm(f))

const out = html.replace(
  /<span class="pg" data-find="([^"]*)"><\/span>/g,
  (_m, f) => `<span class="pg" data-find="${f}">${map[f] ?? ''}</span>`,
)
if (process.env.DUMP) writeFileSync(resolve(__dirname, '.final.html'), out)
await render(out, pdfPath)
rmSync(tmp, { force: true })

const missing = finds.filter((f) => !map[f])
if (missing.length) console.warn('⚠️ Sans page détectée :', missing)
console.log(`✅ Rapport : ${pdfPath} · ${pages.length} pages`)
