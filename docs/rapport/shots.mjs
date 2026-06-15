// Capture des pages publiques en production + dépôt GitHub, pour illustrer le rapport.
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, 'img')
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find(existsSync)
if (!CHROME) throw new Error('Chrome/Edge introuvable.')

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })

const base = 'https://pc-aeris.vercel.app'
const shots = [
  [`${base}/`, 'home.png'],
  [`${base}/configurateur`, 'configurateur.png'],
  [`${base}/configs-pretes`, 'configs-pretes.png'],
  [`${base}/questionnaire`, 'questionnaire.png'],
  ['https://github.com/QuentinGP23/PC_Aeris', 'github.png'],
]

for (const [url, file] of shots) {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 })
    await new Promise((r) => setTimeout(r, 3000))
    await page.screenshot({ path: resolve(outDir, file) })
    console.log('OK   ', file)
  } catch (e) {
    console.log('FAIL ', file, '·', e.message)
  }
}
await browser.close()
console.log('done')
