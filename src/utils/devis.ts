import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CATEGORIES, type CategoryKey } from '../types'
import { ASSEMBLY_OFFERS, ASSEMBLY_PRICE } from '../constants'
import { itemUnitPrice, itemTotal, cartTotal, type CartItem } from '../store'

const catLabel = (c: CategoryKey) => CATEGORIES.find((x) => x.value === c)?.label ?? c
// Espace standard comme séparateur de milliers (les polices jsPDF rendent mal
// l'espace fine insécable de toLocaleString).
const eur = (n: number) => `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`
const assemblyName = (id: CartItem['assembly']) => ASSEMBLY_OFFERS.find((o) => o.id === id)?.name ?? id

export interface DevisInfo {
  number: string
  date: string
  client?: string
}

const INDIGO: [number, number, number] = [79, 70, 229]
const INK: [number, number, number] = [26, 29, 41]
const MUTED: [number, number, number] = [122, 128, 146]
const SOFT: [number, number, number] = [246, 247, 251]
const LINE: [number, number, number] = [233, 236, 244]

/** PDF du devis — détail composants / marchand / prix + montage + total. */
export function buildDevis(items: CartItem[], info: DevisInfo): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 50

  const finalY = () => (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY

  // ── Bandeau + en-tête ──
  doc.setFillColor(...INDIGO)
  doc.rect(0, 0, W, 8, 'F')

  doc.setFont('helvetica', 'bold').setFontSize(22).setTextColor(...INK)
  doc.text('PC Aeris', M, 66)
  doc.setFont('helvetica', 'normal').setFontSize(9.5).setTextColor(...MUTED)
  doc.text('Le PC sur-mesure, enfin accessible à tous.', M, 82)

  doc.setFont('helvetica', 'bold').setFontSize(26).setTextColor(...INDIGO)
  doc.text('DEVIS', W - M, 64, { align: 'right' })

  // Bloc info (n°, date, client) dans un encadré léger.
  const boxW = 200
  const boxX = W - M - boxW
  const boxY = 84
  const rows: [string, string][] = [['Devis n°', info.number], ['Date', info.date]]
  if (info.client) rows.push(['Client', info.client])
  const boxH = 16 + rows.length * 16
  doc.setFillColor(...SOFT)
  doc.setDrawColor(...LINE)
  doc.roundedRect(boxX, boxY, boxW, boxH, 6, 6, 'FD')
  let ry = boxY + 20
  rows.forEach(([k, v]) => {
    doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(...MUTED)
    doc.text(k, boxX + 14, ry)
    doc.setFont('helvetica', 'bold').setFontSize(8.5).setTextColor(...INK)
    doc.text(v, boxX + boxW - 14, ry, { align: 'right' })
    ry += 16
  })

  let y = Math.max(120, boxY + boxH + 24)

  // ── Configurations ──
  items.forEach((item, idx) => {
    if (y > H - 150) { doc.addPage(); y = 70 }

    // Titre de section avec accent.
    doc.setFillColor(...INDIGO)
    doc.roundedRect(M, y - 9, 3, 13, 1.5, 1.5, 'F')
    doc.setFont('helvetica', 'bold').setFontSize(12.5).setTextColor(...INK)
    doc.text(`Configuration ${idx + 1} — ${item.name}`, M + 12, y)
    if (item.quantity > 1) {
      doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...MUTED)
      doc.text(`quantité : ${item.quantity}`, W - M, y, { align: 'right' })
    }
    y += 12

    const body = item.lines.map((l) => [
      catLabel(l.category),
      l.name,
      l.merchant ?? '—',
      l.price != null ? eur(l.price) : 'sur devis',
    ])
    body.push(['Montage', `Offre ${assemblyName(item.assembly)}`, 'PC Aeris', eur(ASSEMBLY_PRICE[item.assembly])])

    autoTable(doc, {
      startY: y,
      head: [['POSTE', 'COMPOSANT / PRESTATION', 'ACHETÉ CHEZ', 'PRIX']],
      body,
      theme: 'striped',
      styles: { fontSize: 9, cellPadding: { top: 7, bottom: 7, left: 9, right: 9 }, textColor: INK, lineColor: LINE, lineWidth: 0 },
      headStyles: { fillColor: INDIGO, textColor: [255, 255, 255], fontSize: 7.5, fontStyle: 'bold', cellPadding: { top: 8, bottom: 8, left: 9, right: 9 } },
      alternateRowStyles: { fillColor: SOFT },
      columnStyles: {
        0: { cellWidth: 92, textColor: MUTED, fontStyle: 'bold', fontSize: 8 },
        2: { cellWidth: 96 },
        3: { cellWidth: 76, halign: 'right', fontStyle: 'bold' },
      },
      margin: { left: M, right: M },
    })

    y = finalY() + 14
    const unit = itemUnitPrice(item)
    doc.setFont('helvetica', 'normal').setFontSize(9.5).setTextColor(...MUTED)
    const label = item.quantity > 1 ? `Sous-total  (${eur(unit)} × ${item.quantity})` : 'Sous-total'
    doc.text(label, W - M - 90, y, { align: 'right' })
    doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(...INK)
    doc.text(eur(itemTotal(item)), W - M, y, { align: 'right' })
    y += 30
  })

  // ── Total ──
  if (y > H - 130) { doc.addPage(); y = 70 }
  const tH = 44
  doc.setFillColor(238, 240, 254)
  doc.roundedRect(M, y, W - 2 * M, tH, 8, 8, 'F')
  doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(...INK)
  doc.text('TOTAL À PAYER', M + 18, y + tH / 2 + 4)
  doc.setFont('helvetica', 'bold').setFontSize(18).setTextColor(...INDIGO)
  doc.text(eur(cartTotal(items)), W - M - 18, y + tH / 2 + 6, { align: 'right' })
  y += tH + 26

  // ── Note ──
  doc.setDrawColor(...LINE).setLineWidth(0.5)
  doc.line(M, y, W - M, y)
  y += 16
  doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(...MUTED)
  const note =
    'Les composants sont sourcés au meilleur prix du marché identifié, sans marge de notre part : la rémunération de ' +
    'PC Aeris correspond à l\'offre de montage choisie. Les prix « sur devis » seront confirmés au moment du sourcing. ' +
    'Devis valable 7 jours à compter de sa date d\'émission.'
  doc.text(doc.splitTextToSize(note, W - 2 * M), M, y, { lineHeightFactor: 1.5 })

  // Pied de page sur chaque page.
  const pages = doc.getNumberOfPages()
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p)
    doc.setFont('helvetica', 'normal').setFontSize(7.5).setTextColor(...MUTED)
    doc.text('PC Aeris · pc-aeris.vercel.app', M, H - 28)
    doc.text(`${p} / ${pages}`, W - M, H - 28, { align: 'right' })
  }

  return doc
}

export function downloadDevis(items: CartItem[], info: DevisInfo): void {
  buildDevis(items, info).save(`devis-${info.number}.pdf`)
}

/** PDF en base64 (sans préfixe data-uri) pour l'envoi par email. */
export function devisBase64(items: CartItem[], info: DevisInfo): string {
  const uri = buildDevis(items, info).output('datauristring')
  return uri.split(',')[1] ?? ''
}

export function devisNumber(): string {
  return `${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}
