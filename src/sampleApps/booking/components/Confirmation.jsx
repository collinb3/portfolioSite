export default function Confirmation({ booking, service, onStartOver }) {
  const start = new Date(booking.start_time)

  return (
    <div role="status" aria-live="polite">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700">
        <span aria-hidden="true">✓</span>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">You're booked!</h2>
      <p className="mt-1 text-sm text-gray-600">We've saved your appointment under {booking.customer_email}.</p>

      <dl className="mt-5 space-y-2 rounded-xl border border-gray-200 p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Service</dt>
          <dd className="font-medium text-gray-900">{service.name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Date</dt>
          <dd className="font-medium text-gray-900">
            {start.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Time</dt>
          <dd className="font-medium text-gray-900">
            {start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onStartOver}
        className="mt-6 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        Book another appointment
      </button>
    </div>
  )
}
