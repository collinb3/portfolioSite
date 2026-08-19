import { useEffect, useState } from 'react'
import { getAvailability } from '../services/api.js'

function nextDays(count) {
  const days = []
  const today = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

function formatSlotTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })
}

export default function DateTimeStep({ service, selectedSlot, onSelectSlot, onBack, onNext }) {
  const [date, setDate] = useState(isoDate(new Date()))
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const days = nextDays(14)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    onSelectSlot(null)

    getAvailability(service.id, date)
      .then((res) => {
        if (!cancelled) setSlots(res.slots)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, service.id])

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Pick a date &amp; time</h2>

      <div role="radiogroup" aria-label="Choose a date" className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {days.map((d) => {
          const value = isoDate(d)
          const checked = value === date
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => setDate(value)}
              className={`flex min-w-[64px] flex-col items-center rounded-lg border px-3 py-2 text-sm transition-colors ${
                checked ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-gray-200 text-gray-600 hover:border-teal-300'
              }`}
            >
              <span className="text-xs uppercase">{d.toLocaleDateString([], { weekday: 'short' })}</span>
              <span className="font-medium">{d.getDate()}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-5" aria-live="polite">
        {loading && <p className="text-sm text-gray-500">Loading available times…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && slots.length === 0 && (
          <p className="text-sm text-gray-500">No openings on this date — try another day.</p>
        )}
        {!loading && slots.length > 0 && (
          <div role="radiogroup" aria-label="Choose a time" className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((slot) => {
              const checked = slot === selectedSlot
              return (
                <button
                  key={slot}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => onSelectSlot(slot)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    checked ? 'border-teal-600 bg-teal-600 text-white' : 'border-gray-200 text-gray-700 hover:border-teal-300'
                  }`}
                >
                  {formatSlotTime(slot)}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedSlot}
          className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
