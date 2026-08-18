import { useEffect, useState } from 'react'
import { adminGetServices, adminCreateService, adminUpdateService } from '../services/api.js'

const emptyForm = { name: '', description: '', duration_minutes: 30, price_cents: 0 }

export default function ServicesPanel({ adminPassword }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  function load() {
    setLoading(true)
    adminGetServices(adminPassword)
      .then(setServices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [adminPassword])

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await adminCreateService(
        {
          name: form.name,
          description: form.description || null,
          duration_minutes: Number(form.duration_minutes),
          price_cents: Math.round(Number(form.price_cents) * 100),
        },
        adminPassword,
      )
      setForm(emptyForm)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(service) {
    try {
      await adminUpdateService(service.id, { active: !service.active }, adminPassword)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading services…</p>

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <ul className="divide-y divide-gray-200 rounded-2xl bg-white shadow-sm">
        {services.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className={`font-medium ${s.active ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{s.name}</p>
              <p className="text-sm text-gray-500">
                {s.duration_minutes} min · ${(s.price_cents / 100).toFixed(0)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleActive(s)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              {s.active ? 'Deactivate' : 'Reactivate'}
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">Add a service</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            aria-label="Service name"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
          <input
            aria-label="Duration in minutes"
            type="number"
            min="5"
            step="5"
            placeholder="Duration (min)"
            required
            value={form.duration_minutes}
            onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
          <input
            aria-label="Price in dollars"
            type="number"
            min="0"
            step="1"
            placeholder="Price ($)"
            required
            value={form.price_cents}
            onChange={(e) => setForm({ ...form, price_cents: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
          <input
            aria-label="Description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {saving ? 'Adding…' : 'Add service'}
        </button>
      </form>
    </div>
  )
}
