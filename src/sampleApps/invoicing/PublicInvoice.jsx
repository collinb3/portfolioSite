import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPublicInvoice } from './services/api.js'
import { downloadInvoicePdf } from './utils/pdf.js'
import { formatCents, lineItemTotalCents, invoiceTotalCents } from './utils/money.js'

const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-amber-100 text-amber-800',
  paid: 'bg-emerald-100 text-emerald-800',
  overdue: 'bg-red-100 text-red-700',
}

export default function PublicInvoice() {
  const { token } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [error, setError] = useState(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    getPublicInvoice(token)
      .then(setInvoice)
      .catch((err) => setError(err.message))
  }, [token])

  return (
    <div className="min-h-[80vh] bg-gray-50">
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link to="/projects" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-100">
          ← Back to Projects
        </Link>
        <span className="text-sm font-medium text-gray-500">Fieldstone Web Studio — invoicing demo</span>
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-8">
        {error && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-red-600">Couldn't load this invoice: {error}</p>
          </div>
        )}

        {!error && !invoice && <p className="text-sm text-gray-500">Loading invoice…</p>}

        {invoice && (
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Fieldstone Web Studio</p>
                <h1 className="mt-1 text-2xl font-bold text-gray-900">Invoice {invoice.invoice_number}</h1>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${STATUS_STYLES[invoice.status] ?? ''}`}>
                {invoice.status}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-gray-500">Billed to</dt>
                <dd className="font-medium text-gray-900">{invoice.client_name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Issue date</dt>
                <dd className="font-medium text-gray-900">{invoice.issue_date}</dd>
              </div>
              {invoice.due_date && (
                <div>
                  <dt className="text-gray-500">Due date</dt>
                  <dd className="font-medium text-gray-900">{invoice.due_date}</dd>
                </div>
              )}
            </dl>

            <table className="mt-6 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-2 font-medium">Description</th>
                  <th className="py-2 font-medium">Qty</th>
                  <th className="py-2 text-right font-medium">Unit price</th>
                  <th className="py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.line_items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{item.description}</td>
                    <td className="py-3 text-gray-600">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-600">{formatCents(item.unit_price_cents)}</td>
                    <td className="py-3 text-right text-gray-900">{formatCents(lineItemTotalCents(item))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="pt-4 text-right font-semibold text-gray-900">
                    Total
                  </td>
                  <td className="pt-4 text-right text-lg font-bold text-teal-700">
                    {formatCents(invoiceTotalCents(invoice.line_items))}
                  </td>
                </tr>
              </tfoot>
            </table>

            {invoice.notes && <p className="mt-6 text-sm text-gray-600">{invoice.notes}</p>}

            <button
              type="button"
              onClick={async () => {
                setDownloading(true)
                try {
                  await downloadInvoicePdf(invoice)
                } finally {
                  setDownloading(false)
                }
              }}
              disabled={downloading}
              className="mt-8 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloading ? 'Preparing PDF…' : 'Download PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
