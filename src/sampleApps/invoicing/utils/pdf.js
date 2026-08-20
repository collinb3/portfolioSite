import { formatCents, lineItemTotalCents, invoiceTotalCents, formatDate } from './money.js'

// Generates and triggers a browser download of the invoice as a real PDF file.
// jspdf (+ its jspdf-autotable plugin) is a fairly hefty dependency, so it's
// loaded on demand here rather than imported at the top of the module — that
// keeps it out of the main bundle for every visitor and only fetches it when
// someone actually clicks "Download PDF".
export async function downloadInvoicePdf(invoice) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])

  const doc = new jsPDF({ unit: 'pt', format: 'letter' })

  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Fieldstone Web Studio', 40, 50)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('hello@fieldstonewebstudio.example', 40, 68)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`Invoice ${invoice.invoice_number}`, 40, 100)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Bill to: ${invoice.client_name} (${invoice.client_email})`, 40, 120)
  doc.text(`Issue date: ${formatDate(invoice.issue_date)}`, 40, 136)
  if (invoice.due_date) doc.text(`Due date: ${formatDate(invoice.due_date)}`, 40, 152)
  doc.text(`Status: ${invoice.status}`, 40, 168)

  autoTable(doc, {
    startY: 190,
    head: [['Description', 'Qty', 'Unit price', 'Amount']],
    body: invoice.line_items.map((item) => [
      item.description,
      String(item.quantity),
      formatCents(item.unit_price_cents),
      formatCents(lineItemTotalCents(item)),
    ]),
    foot: [['', '', 'Total', formatCents(invoiceTotalCents(invoice.line_items))]],
    headStyles: { fillColor: [30, 120, 110] },
    footStyles: { fillColor: [245, 245, 245], textColor: [20, 20, 20], fontStyle: 'bold' },
    styles: { fontSize: 10 },
  })

  if (invoice.notes) {
    const finalY = doc.lastAutoTable.finalY + 24
    doc.setFontSize(10)
    doc.text(doc.splitTextToSize(invoice.notes, 520), 40, finalY)
  }

  doc.save(`${invoice.invoice_number}.pdf`)
}
