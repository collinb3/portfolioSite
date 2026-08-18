import { useState } from 'react'

export default function ContactStep({ onBack, onSubmit, submitting, submitError }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [touched, setTouched] = useState(false)

  const nameError = touched && !name.trim() ? 'Please enter your name.' : null
  const emailError = touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Please enter a valid email.' : null

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    onSubmit({ customer_name: name.trim(), customer_email: email.trim(), customer_phone: phone.trim() || null, notes: notes.trim() || null })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-lg font-semibold text-gray-900">Your details</h2>

      <div className="mt-4 grid gap-4">
        <div>
          <label htmlFor="booking-name" className="block text-sm font-medium text-gray-700">
            Full name
          </label>
          <input
            id="booking-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!nameError}
            aria-describedby={nameError ? 'booking-name-error' : undefined}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
          {nameError && (
            <p id="booking-name-error" className="mt-1 text-sm text-red-600">
              {nameError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="booking-email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="booking-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? 'booking-email-error' : undefined}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
          {emailError && (
            <p id="booking-email-error" className="mt-1 text-sm text-red-600">
              {emailError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="booking-phone" className="block text-sm font-medium text-gray-700">
            Phone <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            id="booking-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>

        <div>
          <label htmlFor="booking-notes" className="block text-sm font-medium text-gray-700">
            Notes <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="booking-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
      </div>

      {submitError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {submitError}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Booking…' : 'Confirm booking'}
        </button>
      </div>
    </form>
  )
}
