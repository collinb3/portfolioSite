// Simple shared-secret gate for the admin dashboard endpoints.
// The admin UI sends the password back on every request in the
// `x-admin-password` header; we just compare it to the server-side env var.
// This is intentionally lightweight for a portfolio demo — a real product
// would use hashed credentials + sessions, not a single shared password.
export function requireAdmin(req, res) {
  const provided = req.headers['x-admin-password']
  const expected = process.env.ADMIN_PASSWORD

  if (!expected) {
    res.status(500).json({ error: 'Server is missing ADMIN_PASSWORD configuration.' })
    return false
  }

  if (!provided || provided !== expected) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }

  return true
}
