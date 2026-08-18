import { useState } from 'react'
import { adminGetBookings } from '../services/api.js'

export default function AdminLogin({ onLoggedIn }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [checking, setChecking] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setChecking(true)
    setError(null)
    try {
      await adminGetBookings(password)
      onLoggedIn(password)
    } catch {
      setError('Incorrect password.')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="mx-auto mt-24 max-w-sm px-4">
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900">Owner login</h1>
        <label htmlFor="admin-password" className="mt-4 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? 'admin-password-error' : undefined}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
        />
        {error && (
          <p id="admin-password-error" role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={checking}
          className="mt-4 w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
        >
          {checking ? 'Checking…' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
