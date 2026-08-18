import { useEffect, useState } from 'react'
import { adminGetBookings, adminUpdateBookingStatus } from '../services/api.js'

const STATUS_STYLES = {
  confirmed: 'bg-teal-100 text-teal-800',
  completed: 'bg-gray-200 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function BookingsPanel({ adminPassword }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  function load() {
    setLoading(true)
    adminGetBookings(adminPassword)
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [adminPassword])

  async function setStatus(id, status) {
    setUpdatingId(id)
    try {
      await adminUpdateBookingStatus(id, status, adminPassword)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading bookings…</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (bookings.length === 0) return <p className="text-sm text-gray-500">No bookings yet.</p>

  return (
    <ul className="divide-y divide-gray-200 rounded-2xl bg-white shadow-sm">
      {bookings.map((b) => {
        const start = new Date(b.start_time)
        return (
          <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium text-gray-900">
                {b.service_name} — {b.customer_name}
              </p>
              <p className="text-sm text-gray-500">
                {start.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })}
                {' · '}
                {b.customer_email}
                {b.customer_phone ? ` · ${b.customer_phone}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[b.status] ?? ''}`}>{b.status}</span>
              {b.status === 'confirmed' && (
                <>
                  <button
                    type="button"
                    disabled={updatingId === b.id}
                    onClick={() => setStatus(b.id, 'completed')}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Mark complete
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === b.id}
                    onClick={() => setStatus(b.id, 'cancelled')}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
