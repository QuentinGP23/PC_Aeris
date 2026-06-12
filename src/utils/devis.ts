import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CATEGORIES, type CategoryKey } from '../types'
import { ASSEMBLY_OFFERS, ASSEMBLY_PRICE } from '../constants'
import { itemUnitPrice, itemTotal, cartTotal, type CartItem } from '../store'

const catLabel = (c: CategoryKey) => CATEGORIES.find((x) => x.value === c)?.label ?? c
const eur = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`
const assemblyName = (id: CartItem['assembly']) => ASSEMBLY_OFFERS.find((o) => o.id === id)?.name ?? id

export interface DevisInfo {
  number: string
  date: string
  client?: string
}

const INDIGO: [number, number, number] = [79, 70, 229]
const INK: [number, number, number] = [26, 29, 41]
const MUTED: [number, number, number] = [120, 126, 145]

/** Construit le PDF du devis (détail composants, marchand, prix + montage + total). */
export function buildDevis(items: CartItem[], info: DevisInfo): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const M = 40

  // ── En-tête ──
  doc.setFillColor(...INDIGO)
  doc.rect(0, 0, W, 6, 'F')
  doc.setFont('helvetica', 'bold').setFontSize(20).setTextColor(...INK)
  doc.text('PC Aeris', M, 48)
  doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...MUTED)
  doc.text('Le PC sur-mesure, enfin accessible à tous.', M, 62)

  doc.setFont('helvetica', 'bold').setFontSize(22).setTextColor(...INDIGO)
  doc.text('DEVIS', W - M, 48, { align: 'right' })
  doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...MUTED)
  doc.text(`N° ${info.number}`, W - M, 62, { align: 'right' })
  doc.text(`Date : ${info.date}`, W - M, 74, { align: 'right' })
  if (info.client) doc.text(`Client : ${info.client}`, W - M, 86, { align: 'right' })

  let y = 110

  items.forEach((item, idx) => {
    if (y > 720) { doc.addPage(); y = 60 }

    doc.setFont('helvetica', 'bold').setFontSize(12).setTextColor(...INK)
    doc.text(`Configuration ${idx + 1} — ${item.name}${item.quantity > 1 ? `  (× ${item.quantity})` : ''}`, M, y)
    y += 8

    const body = item.lines.map((l) => [
      catLabel(l.category),
      l.name,
      l.merchant ?? '—',
      l.price != null ? eur(l.price) : 'sur devis',
    ])
    // Ligne montage
    body.push([
      'Montage',
      `Offre ${assemblyName(item.assembly)}`,
      'PC Aeris',
      eur(ASSEMBLY_PRICE[item.assembly]),
    ])

    autoTable(doc, {
      startY: y + 6,
      head: [['Poste', 'Composant / prestation', 'Acheté chez', 'Prix']],
      body,
      theme: 'grid',
      styles: { fontSize: 8.5, cellPadding: 5, textColor: INK, lineColor: [227, 230, 239] },
      headStyles: { fillColor: INDIGO, textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 90, textColor: MUTED },
        2: { cellWidth: 90 },
        3: { cellWidth: 70, halign: 'right', fontStyle: 'bold' },
      },
      margin: { left: M, right: M },
    })

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6
    const unit = itemUnitPrice(item)
    doc.setFont('helvetica', 'bold').setFontSize(9.5).setTextColor(...INK)
    const sub = item.quantity > 1 ? `Sous-total : ${eur(unit)} × ${item.quantity} = ${eur(itemTotal(item))}` : `Sous-total : ${eur(itemTotal(item))}`
    doc.text(sub, W - M, y, { align: 'right' })
    y += 24
  })

  // ── Total ──
  if (y > 740) { doc.addPage(); y = 60 }
  doc.setDrawColor(...INDIGO).setLineWidth(1)
  doc.line(M, y, W - M, y)
  y += 22
  doc.setFont('helvetica', 'bold').setFontSize(15).setTextColor(...INK)
  doc.text('TOTAL', M, y)
  doc.text(eur(cartTotal(items)), W - M, y, { align: 'right' })

  y += 26
  doc.setFont('helvetica', 'normal').setFontSize(7.5).setTextColor(...MUTED)
  const note =
    'Les composants sont sourcés au meilleur prix du marché identifié, sans marge de notre part. ' +
    'La rémunération de PC Aeris correspond à l\'offre de montage. Les prix « sur devis » seront confirmés au sourcing. ' +
    'Devis valable 7 jours — pc-aeris.vercel.app'
  doc.text(doc.splitTextToSize(note, W - 2 * M), M, y)

  return doc
}

export function downloadDevis(items: CartItem[], info: DevisInfo): void {
  buildDevis(items, info).save(`devis-${info.number}.pdf`)
}

/** Renvoie le PDF en base64 (sans préfixe data-uri) pour l'envoi par email. */
export function devisBase64(items: CartItem[], info: DevisInfo): string {
  const uri = buildDevis(items, info).output('datauristring')
  return uri.split(',')[1] ?? ''
}

export function devisNumber(): string {
  return `${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}
