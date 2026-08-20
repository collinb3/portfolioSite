import { useState } from 'react'
import { adminCreateClient, adminCreateInvoice } from '../services/api.js'

const emptyLineItem = { description: '', quantity: 1, unit_price_cents: 0 }

export default function NewInvoiceForm({ clients, adminPassword, onCreated }) {
  const [clientId, setClientId] = useState('')
  const [showNewClient, setShowNewClient] = useState(clients.length === 0)
  const [newClientName, setNewClientName] = useState('')
  const [newClientEmail, setNewClientEmail] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [lineItems, setLineItems] = useState([{ ...emptyLineItem }])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function updateLineItem(index, patch) {
    setLineItems((items) => items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function addLineItem() {
    setLineItems((items) => [...items, { ...emptyLineItem }])
  }

  function removeLineItem(index) {
    setLineItems((items) => items.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      let resolvedClientId = clientId

      if (showNewClient) {
        if (!newClientName.trim() || !newClientEmail.trim()) {
          throw new Error('New client needs a name and email.')
        }
        const client = await adminCreateClient({ name: newClientName.trim(), email: newClientEmail.trim() }, adminPassword)
        resolvedClientId = client.id
      }

      if (!resolvedClientId) throw new Error('Choose or add a client.')
      if (lineItems.some((item) => !item.description.trim() || Number(item.quantity) <= 0)) {
        throw new Error('Every line item needs a description and a quantity greater than 0.')
      }

      await adminCreateInvoice(
        {
          client_id: resolvedClientId,
          due_date: dueDate || null,
          notes: notes.trim() || null,
          line_items: lineItems.map((item) => ({
            description: item.description.trim(),
            quantity: Number(item.quantity),
            unit_price_cents: Math.round(Number(item.unit_price_cents) * 100 || 0),
          })),
        },
        adminPassword,
      )

      setClientId('')
      setShowNewClient(false)
      setNewClientName('')
      setNewClientEmail('')
      setDueDate('')
      setNotes('')
      setLineItems([{ ...emptyLineItem }])
      onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-sm font-semibold text-gray-900">New invoice</h3>

      <div className="mt-3">
        {!showNewClient ? (
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label htmlFor="invoice-client" className="block text-sm font-medium text-gray-700">
                Client
              </label>
              <select
                id="invoice-client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                <option value="">Select a client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" onClick={() => setShowNewClient(true)} className="pb-2 text-sm font-medium text-teal-700 hover:text-teal-800">
              + New client
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              aria-label="New client name"
              placeholder="Client name"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
            <div className="flex gap-2">
              <input
                aria-label="New client email"
                type="email"
                placeholder="Client email"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
              {clients.length > 0 && (
                <button type="button" onClick={() => setShowNewClient(false)} className="whitespace-nowrap text-sm font-medium text-gray-500 hover:text-gray-700">
                  Use existing
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700">Line items</p>
        <div className="mt-2 space-y-2">
          {lineItems.map((item, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input
                aria-label={`Line item ${i + 1} description`}
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateLineItem(i, { description: e.target.value })}
                className="min-w-[160px] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
              <input
                aria-label={`Line item ${i + 1} quantity`}
                type="number"
                min="1"
                step="1"
                value={item.quantity}
                onChange={(e) => updateLineItem(i, { quantity: e.target.value })}
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
              <input
                aria-label={`Line item ${i + 1} unit price in dollars`}
                type="number"
                min="0"
                step="0.01"
                placeholder="Price ($)"
                value={item.unit_price_cents}
                onChange={(e) => updateLineItem(i, { unit_price_cents: e.target.value })}
                className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
              {lineItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLineItem(i)}
                  aria-label={`Remove line item ${i + 1}`}
                  className="rounded-lg border border-gray-300 px-2.5 py-2 text-sm text-gray-500 hover:bg-gray-50"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addLineItem} className="mt-2 text-sm font-medium text-teal-700 hover:text-teal-800">
          + Add line item
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="invoice-due-date" className="block text-sm font-medium text-gray-700">
            Due date <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            id="invoice-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
        <div>
          <label htmlFor="invoice-notes" className="block text-sm font-medium text-gray-700">
            Notes <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            id="invoice-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {saving ? 'Creating…' : 'Create invoice'}
      </button>
    </form>
  )
}
