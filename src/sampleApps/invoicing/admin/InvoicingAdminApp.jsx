import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLogin from './AdminLogin.jsx'
import InvoiceList from './InvoiceList.jsx'
import ClientsPanel from './ClientsPanel.jsx'
import NewInvoiceForm from './NewInvoiceForm.jsx'
import { adminGetInvoices, adminGetClients } from '../services/api.js'

const SESSION_KEY = 'invoicing-demo-admin-password'

export default function InvoicingAdminApp() {
  const [adminPassword, setAdminPassword] = useState(() => sessionStorage.getItem(SESSION_KEY))
  const [tab, setTab] = useState('invoices')
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function load() {
    if (!adminPassword) return
    setLoading(true)
    Promise.all([adminGetInvoices(adminPassword), adminGetClients(adminPassword)])
      .then(([inv, cli]) => {
        setInvoices(inv)
        setClients(cli)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [adminPassword])

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
        <Link to="/invoicing/demo" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-100">
          ← Back to sample invoice
        </Link>
        <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Log out
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-8">
        <h1 className="text-xl font-semibold text-gray-900">Owner dashboard</h1>

        <div className="mt-4 flex gap-2" role="tablist" aria-label="Admin sections">
          {['invoices', 'clients'].map((t) => (
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
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          {loading && <p className="text-sm text-gray-500">Loading…</p>}

          {!loading && tab === 'invoices' && (
            <>
              <InvoiceList invoices={invoices} adminPassword={adminPassword} onChanged={load} />
              <NewInvoiceForm clients={clients} adminPassword={adminPassword} onCreated={load} />
            </>
          )}

          {!loading && tab === 'clients' && <ClientsPanel clients={clients} />}
        </div>
      </div>
    </div>
  )
}
