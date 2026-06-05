// Build a professional PDF from docs/RAPPORT_PROJET_PC_AERIS.md
// Two passes: render once, read the real page of each heading from the produced
// PDF (pdfjs-dist), then re-render with page numbers injected into the TOC.
// Uses marked (md -> html) + puppeteer-core driving the installed Chrome.
// Run: node scripts/build-report-pdf.mjs
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { marked } from 'marked'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const mdPath = resolve(root, 'docs/RAPPORT_PROJET_PC_AERIS.md')
const pdfPath = resolve(root, 'docs/RAPPORT_PROJET_PC_AERIS.pdf')
const tmpPdf = resolve(root, 'docs/.report.pass1.pdf')

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
]
const chrome = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!chrome) throw new Error('No Chrome/Edge executable found for PDF rendering.')

const raw = readFileSync(mdPath, 'utf8')
const coverMatch = raw.match(/<!-- COVER -->([\s\S]*?)<!-- ENDCOVER -->/)
const coverMd = coverMatch ? coverMatch[1].trim() : ''
let bodyMd = raw.replace(/<!-- COVER -->[\s\S]*?<!-- ENDCOVER -->/, '').trim()
bodyMd = bodyMd.replace(/^---\s*/, '')

const slug = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

// Normalize text for matching headings against extracted PDF text.
const norm = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '')

const toc = []
const renderer = new marked.Renderer()
renderer.heading = (text, level, rawText) => {
  const id = slug(typeof rawText === 'string' ? rawText : text)
  if ((level === 1 || level === 2) && !/^sommaire$/i.test(rawText)) {
    toc.push({ level, text: text.replace(/<[^>]+>/g, ''), raw: rawText, id })
  }
  return `<h${level} id="${id}">${text}</h${level}>\n`
}
marked.setOptions({ renderer, gfm: true, breaks: false })

const coverHtml = marked.parse(coverMd)
toc.length = 0 // cover headings must not appear in the TOC
const bodyHtml = marked.parse(bodyMd)

const css = `
  :root { --brand:#6366F1; --brand-dark:#4338CA; --ink:#1e2233; --muted:#5b6172; --line:#e4e6ef; --soft:#f7f8fc; }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; background:#ffffff; }
  body { font-family:"Segoe UI",-apple-system,Helvetica,Arial,sans-serif; color:var(--ink); font-size:10.7px; line-height:1.55; }
  h1,h2,h3,h4 { color:var(--ink); line-height:1.25; }
  h1 { font-size:21px; margin:0 0 14px; padding-bottom:8px; border-bottom:3px solid var(--brand); page-break-before:always; }
  h2 { font-size:15.5px; margin:22px 0 9px; color:var(--brand-dark); }
  h3 { font-size:12.2px; margin:15px 0 5px; }
  h4 { font-size:11px; margin:11px 0 4px; }
  p { margin:5px 0; }
  a { color:var(--brand-dark); text-decoration:none; }
  ul,ol { margin:5px 0 5px 0; padding-left:20px; }
  li { margin:2px 0; }
  strong { color:var(--ink); }
  blockquote { margin:8px 0; padding:7px 12px; background:var(--soft); border-left:3px solid var(--brand); color:var(--muted); border-radius:0 4px 4px 0; }
  blockquote p { margin:2px 0; }
  code { background:var(--soft); padding:1px 4px; border-radius:3px; font-size:9.4px; }
  pre { background:#1e2233; color:#e7e9f5; padding:11px 13px; border-radius:6px; overflow:hidden; font-size:8.6px; line-height:1.35; page-break-inside:avoid; }
  pre code { background:transparent; color:inherit; padding:0; white-space:pre; }
  table { border-collapse:collapse; width:100%; margin:9px 0; font-size:9.3px; page-break-inside:avoid; }
  th,td { border:1px solid var(--line); padding:4px 7px; text-align:left; vertical-align:top; }
  th { background:var(--brand); color:#fff; font-weight:600; }
  tr:nth-child(even) td { background:var(--soft); }
  hr { border:none; border-top:1px solid var(--line); margin:16px 0; }
  /* Cover */
  .cover { height:920px; display:flex; flex-direction:column; justify-content:center; page-break-after:always; text-align:left; padding:0 8px; }
  .cover h1 { border:none; page-break-before:avoid; font-size:54px; margin:0; color:var(--brand-dark); letter-spacing:-1px; }
  .cover h2 { font-size:23px; color:var(--ink); margin:6px 0 30px; font-weight:500; }
  .cover p { font-size:13px; }
  .cover blockquote { margin-top:26px; max-width:560px; }
  .cover .rule { height:5px; width:120px; background:var(--brand); margin:0 0 26px; border-radius:3px; }
  /* TOC */
  .toc { page-break-after:always; }
  .toc h1 { page-break-before:avoid; }
  ul.toc-list { list-style:none; padding:0; margin:12px 0; }
  ul.toc-list li { margin:0; }
  ul.toc-list a { display:flex; align-items:baseline; text-decoration:none; }
  .toc-l1 { margin-top:14px; padding-top:8px; border-top:1px solid var(--line); }
  .toc-l1 a { font-weight:700; color:var(--brand-dark); font-size:12.5px; }
  .toc-l2 { padding-left:18px; margin-top:3px; }
  .toc-l2 a { color:var(--ink); font-size:10.6px; }
  .toc-l2 .toc-title:before { content:"›  "; color:var(--brand); }
  .toc-dots { flex:1 1 auto; border-bottom:1px dotted #b4bacb; margin:0 7px; position:relative; top:-3px; }
  .toc-page { flex:0 0 auto; color:var(--muted); font-variant-numeric:tabular-nums; }
  .toc-l1 .toc-page { color:var(--brand-dark); }
`

function buildHtml(pageOf) {
  const tocHtml = toc
    .map((t) => {
      const page = pageOf ? (pageOf[t.id] ?? '') : ''
      return `<li class="toc-l${t.level}"><a href="#${t.id}"><span class="toc-title">${t.text}</span><span class="toc-dots"></span><span class="toc-page">${page}</span></a></li>`
    })
    .join('\n')
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${css}</style></head>
<body>
  <section class="cover"><div class="rule"></div>${coverHtml}</section>
  <section class="toc"><h1>Sommaire</h1><ul class="toc-list">${tocHtml}</ul></section>
  ${bodyHtml}
</body></html>`
}

const pdfOpts = {
  format: 'A4',
  printBackground: true,
  margin: { top: '16mm', bottom: '16mm', left: '15mm', right: '15mm' },
  displayHeaderFooter: true,
  headerTemplate:
    '<div style="font-size:7px;color:#9aa0b4;width:100%;padding:0 15mm;text-align:right;font-family:Segoe UI,Arial;">PC Aeris — Rapport de projet</div>',
  footerTemplate:
    '<div style="font-size:7px;color:#9aa0b4;width:100%;padding:0 15mm;font-family:Segoe UI,Arial;display:flex;justify-content:space-between;"><span>Quentin Geoffroy · Juin 2026</span><span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
}

async function renderPdf(html, outPath) {
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  })
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.pdf({ path: outPath, ...pdfOpts })
  await browser.close()
}

// Read the real page index of each heading from the pass-1 PDF.
async function extractHeadingPages(file) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const data = new Uint8Array(readFileSync(file))
  const doc = await pdfjs.getDocument({ data, isEvalSupported: false, useSystemFonts: true }).promise
  const pages = []
  for (let i = 1; i <= doc.numPages; i++) {
    const pg = await doc.getPage(i)
    const tc = await pg.getTextContent()
    pages.push(norm(tc.items.map((it) => it.str).join(' ')))
  }
  // The single page whose text contains the TOC title "Sommaire" is the TOC page.
  let tocPage = pages.findIndex((t) => t.includes('sommaire'))
  if (tocPage < 0) tocPage = 1 // fallback: assume page 2 (0-based 1)
  const pageOf = {}
  // Headings appear in document order: enforce monotonic non-decreasing pages so
  // a short title (e.g. "Conclusion") doesn't match an earlier inline occurrence.
  let startIdx = tocPage + 1
  for (const t of toc) {
    const needle = norm(t.raw)
    let foundIdx = -1
    for (let i = startIdx; i < pages.length; i++) {
      if (pages[i].includes(needle)) {
        foundIdx = i
        break
      }
    }
    if (foundIdx >= 0) {
      pageOf[t.id] = foundIdx + 1 // 1-based page number
      startIdx = foundIdx // next heading can share the same page
    } else {
      pageOf[t.id] = ''
    }
  }
  return pageOf
}

// Pass 1
await renderPdf(buildHtml(null), tmpPdf)
const pageOf = await extractHeadingPages(tmpPdf)
// Pass 2 (final, with TOC page numbers)
const finalHtml = buildHtml(pageOf)
if (process.env.DUMP_HTML) writeFileSync(resolve(root, 'docs/.report.final.html'), finalHtml, 'utf8')
await renderPdf(finalHtml, pdfPath)
rmSync(tmpPdf, { force: true })

const missing = toc.filter((t) => !pageOf[t.id]).map((t) => t.text)
if (missing.length) console.warn('TOC entries without a detected page:', missing)
console.log('PDF written to', pdfPath)
