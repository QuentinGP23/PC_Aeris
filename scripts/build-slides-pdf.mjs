// Génère un PDF 16:9 du deck client à partir de docs/presentation-client/index.html
// (mode "print" = toutes les slides empilées, une par page). Utilise le Chrome installé.
// Run: node scripts/build-slides-pdf.mjs
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const htmlPath = resolve(root, 'docs/presentation-client/index.html')
const pdfPath = resolve(root, 'docs/presentation-client/PC_Aeris_presentation_client.pdf')

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync)
if (!CHROME) throw new Error('Chrome/Edge introuvable pour le rendu PDF.')

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' })
await page.evaluate(() => document.body.classList.add('print'))
await page.pdf({
  path: pdfPath,
  printBackground: true,
  width: '1280px',
  height: '720px',
  pageRanges: '',
  margin: { top: '0', bottom: '0', left: '0', right: '0' },
})
await browser.close()
console.log('PDF écrit →', pdfPath)
