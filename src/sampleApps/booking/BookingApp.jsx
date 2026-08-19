import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ServiceStep from './components/ServiceStep.jsx'
import DateTimeStep from './components/DateTimeStep.jsx'
import ContactStep from './components/ContactStep.jsx'
import Confirmation from './components/Confirmation.jsx'
import { getServices, createBooking } from './services/api.js'

const STEPS = ['Service', 'Date & time', 'Your details']

export default function BookingApp() {
  const [services, setServices] = useState([])
  const [loadError, setLoadError] = useState(null)
  const [step, setStep] = useState(0)
  const [serviceId, setServiceId] = useState(null)
  const [slot, setSlot] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((err) => setLoadError(err.message))
  }, [])

  const service = services.find((s) => String(s.id) === String(serviceId))

  function reset() {
    setStep(0)
    setServiceId(null)
    setSlot(null)
    setBooking(null)
    setSubmitError(null)
  }

  async function handleSubmit(contact) {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const created = await createBooking({ service_id: serviceId, start_time: slot, ...contact })
      setBooking(created)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[80vh] bg-gray-50">
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link to="/projects" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-100">
          ← Back to Projects
        </Link>
        <span className="text-sm font-medium text-gray-500">Willowbrook Salon &amp; Spa — booking demo</span>
      </div>

      <div className="mx-auto max-w-xl px-4 pb-16 sm:px-8">
        {!booking && (
          <ol className="mb-6 flex gap-4 text-sm text-gray-500" aria-label="Booking steps">
            {STEPS.map((label, i) => (
              <li key={label} aria-current={i === step ? 'step' : undefined} className={i === step ? 'font-semibold text-teal-700' : ''}>
                {i + 1}. {label}
              </li>
            ))}
          </ol>
        )}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {loadError && <p className="text-sm text-red-600">Couldn't load services: {loadError}</p>}

          {!loadError && services.length === 0 && !booking && <p className="text-sm text-gray-500">Loading services…</p>}

          {!loadError && booking && service && (
            <Confirmation booking={booking} service={service} onStartOver={reset} />
          )}

          {!loadError && !booking && services.length > 0 && step === 0 && (
            <ServiceStep
              services={services}
              selectedId={serviceId}
              onSelect={setServiceId}
              onNext={() => setStep(1)}
            />
          )}

          {!loadError && !booking && step === 1 && service && (
            <DateTimeStep
              service={service}
              selectedSlot={slot}
              onSelectSlot={setSlot}
              onBack={() => setStep(0)}
              onNext={() => setStep(2)}
            />
          )}

          {!loadError && !booking && step === 2 && (
            <ContactStep
              onBack={() => setStep(1)}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitError={submitError}
            />
          )}
        </div>
      </div>
    </div>
  )
}
