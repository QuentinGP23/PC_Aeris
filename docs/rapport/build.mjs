// Génère le rapport PDF A4 à partir de docs/rapport/index.html.
// Paged.js pagine le HTML en pages A4 (en-tête, pied, n° de page, sommaire calculé) ;
// on imprime le résultat avec preferCSSPageSize.
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const htmlPath = resolve(__dirname, 'index.html')
const pdfPath = resolve(__dirname, 'PC_Aeris_rapport.pdf')

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find(existsSync)
if (!CHROME) throw new Error('Chrome/Edge introuvable pour le rendu PDF.')

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' })

// Attendre la fin de la pagination Paged.js.
await page.waitForSelector('.pagedjs_pages', { timeout: 120000 })
await page.waitForFunction(
  () => window.PagedPolyfill && document.querySelectorAll('.pagedjs_page').length > 0,
  { timeout: 120000 },
)
await new Promise((r) => setTimeout(r, 600))

const pages = await page.$$eval('.pagedjs_page', (els) => els.length)

await page.pdf({ path: pdfPath, printBackground: true, preferCSSPageSize: true })
await browser.close()
console.log(`✅ Rapport : ${pdfPath} · ${pages} pages`)
