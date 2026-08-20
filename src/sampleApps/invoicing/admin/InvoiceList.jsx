import { useState } from 'react'
import { adminUpdateInvoiceStatus } from '../services/api.js'
import { formatCents, invoiceTotalCents } from '../utils/money.js'

const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-amber-100 text-amber-800',
  paid: 'bg-emerald-100 text-emerald-800',
  overdue: 'bg-red-100 text-red-700',
}

const NEXT_STATUS = {
  draft: { label: 'Mark sent', value: 'sent' },
  sent: { label: 'Mark paid', value: 'paid' },
}

export default function InvoiceList({ invoices, adminPassword, onChanged }) {
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState(null)

  async function setStatus(id, status) {
    setUpdatingId(id)
    setError(null)
    try {
      await adminUpdateInvoiceStatus(id, status, adminPassword)
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  if (invoices.length === 0) return <p className="text-sm text-gray-500">No invoices yet — create your first one below.</p>

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <ul className="divide-y divide-gray-200 rounded-2xl bg-white shadow-sm">
        {invoices.map((inv) => {
          const next = NEXT_STATUS[inv.status]
          return (
            <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-gray-900">
                  {inv.invoice_number} — {inv.client_name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatCents(invoiceTotalCents(inv.line_items))}
                  {inv.due_date ? ` · due ${inv.due_date}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[inv.status] ?? ''}`}>
                  {inv.status}
                </span>
                <a
                  href={`/invoicing/${inv.public_token}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  View
                </a>
                {next && (
                  <button
                    type="button"
                    disabled={updatingId === inv.id}
                    onClick={() => setStatus(inv.id, next.value)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {next.label}
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
