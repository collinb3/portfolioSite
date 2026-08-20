// Thin fetch wrappers for the invoicing /api/* serverless functions.
// Admin calls attach the stored admin password as a header; the server
// verifies it against the shared ADMIN_PASSWORD env var on every request
// (same password as the booking app's admin dashboard).

async function request(path, { method = 'GET', body, adminPassword } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (adminPassword) headers['x-admin-password'] = adminPassword

  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let data
  let parseFailed = false
  try {
    data = await res.json()
  } catch {
    parseFailed = true
  }

  if (!res.ok || parseFailed) {
    throw new Error(data?.error || `Request failed (${res.status})`)
  }
  return data
}

export const getPublicInvoice = (token) => request(`/api/invoices/public/${encodeURIComponent(token)}`)

// --- Admin ---

export const adminGetClients = (adminPassword) => request('/api/clients', { adminPassword })

export const adminCreateClient = (payload, adminPassword) =>
  request('/api/clients', { method: 'POST', body: payload, adminPassword })

export const adminGetInvoices = (adminPassword) => request('/api/invoices', { adminPassword })

export const adminCreateInvoice = (payload, adminPassword) =>
  request('/api/invoices', { method: 'POST', body: payload, adminPassword })

export const adminUpdateInvoiceStatus = (id, status, adminPassword) =>
  request(`/api/invoices/${id}`, { method: 'PATCH', body: { status }, adminPassword })
