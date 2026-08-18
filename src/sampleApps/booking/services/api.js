// Thin fetch wrappers for the /api/* serverless functions.
// Admin calls attach the stored admin password as a header; the server
// verifies it against the ADMIN_PASSWORD env var on every request.

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

export const getServices = () => request('/api/services')

export const getAvailability = (serviceId, date) =>
  request(`/api/availability?serviceId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`)

export const createBooking = (payload) => request('/api/bookings', { method: 'POST', body: payload })

export const getBusinessHours = () => request('/api/business-hours')

// --- Admin ---

export const adminGetServices = (adminPassword) =>
  request('/api/services?all=1', { adminPassword })

export const adminGetBookings = (adminPassword, status) =>
  request(`/api/bookings${status ? `?status=${status}` : ''}`, { adminPassword })

export const adminUpdateBookingStatus = (id, status, adminPassword) =>
  request(`/api/bookings/${id}`, { method: 'PATCH', body: { status }, adminPassword })

export const adminCreateService = (payload, adminPassword) =>
  request('/api/services', { method: 'POST', body: payload, adminPassword })

export const adminUpdateService = (id, payload, adminPassword) =>
  request(`/api/services/${id}`, { method: 'PUT', body: payload, adminPassword })

export const adminDeleteService = (id, adminPassword) =>
  request(`/api/services/${id}`, { method: 'DELETE', adminPassword })
