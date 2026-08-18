function formatPrice(cents) {
  return `$${(cents / 100).toFixed(0)}`
}

export default function ServiceStep({ services, selectedId, onSelect, onNext }) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold text-gray-900">Choose a service</legend>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {services.map((service) => {
          const checked = String(service.id) === String(selectedId)
          return (
            <label
              key={service.id}
              className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-colors ${
                checked ? 'border-teal-600 bg-teal-50 ring-1 ring-teal-600' : 'border-gray-200 hover:border-teal-300'
              }`}
            >
              <input
                type="radio"
                name="service"
                value={service.id}
                checked={checked}
                onChange={() => onSelect(service.id)}
                className="sr-only"
              />
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-medium text-gray-900">{service.name}</span>
                <span className="text-sm font-semibold text-teal-700">{formatPrice(service.price_cents)}</span>
              </span>
              <span className="text-sm text-gray-500">{service.duration_minutes} min</span>
              {service.description && <span className="mt-1 text-sm text-gray-600">{service.description}</span>}
            </label>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={!selectedId}
        className="mt-6 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
      </button>
    </fieldset>
  )
}
