import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLogin from './AdminLogin.jsx'
import BookingsPanel from './BookingsPanel.jsx'
import ServicesPanel from './ServicesPanel.jsx'

const SESSION_KEY = 'booking-demo-admin-password'

export default function AdminApp() {
  const [adminPassword, setAdminPassword] = useState(() => sessionStorage.getItem(SESSION_KEY))
  const [tab, setTab] = useState('bookings')

  function handleLoggedIn(password) {
    sessionStorage.setItem(SESSION_KEY, password)
    setAdminPassword(password)
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY)
    setAdminPassword(null)
  }

  if (!adminPassword) {
    return (
      <div className="min-h-[80vh] bg-gray-50">
        <AdminLogin onLoggedIn={handleLoggedIn} />
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] bg-gray-50">
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link to="/booking" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-100">
          ← Back to booking page
        </Link>
        <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Log out
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-8">
        <h1 className="text-xl font-semibold text-gray-900">Owner dashboard</h1>

        <div className="mt-4 flex gap-2" role="tablist" aria-label="Admin sections">
          {['bookings', 'services'].map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === 'bookings' && <BookingsPanel adminPassword={adminPassword} />}
          {tab === 'services' && <ServicesPanel adminPassword={adminPassword} />}
        </div>
      </div>
    </div>
  )
}
