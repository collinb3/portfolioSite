import { sql } from '../_db.js'
import { requireAdmin } from '../_auth.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Admin only: list bookings, optionally filtered by status.
    if (!requireAdmin(req, res)) return

    const { status } = req.query
    const rows = status
      ? await sql`
          select b.*, s.name as service_name, s.duration_minutes, s.price_cents
          from bookings b join services s on s.id = b.service_id
          where b.status = ${status}
          order by b.start_time asc
        `
      : await sql`
          select b.*, s.name as service_name, s.duration_minutes, s.price_cents
          from bookings b join services s on s.id = b.service_id
          order by b.start_time asc
        `
    return res.status(200).json(rows)
  }

  if (req.method === 'POST') {
    // Public: create a booking.
    const { service_id, customer_name, customer_email, customer_phone, start_time, notes } = req.body || {}

    if (!service_id || !customer_name || !customer_email || !start_time) {
      return res.status(400).json({ error: 'service_id, customer_name, customer_email, and start_time are required.' })
    }
    if (!EMAIL_RE.test(customer_email)) {
      return res.status(400).json({ error: 'That email address doesn’t look valid.' })
    }

    const [service] = await sql`select * from services where id = ${service_id} and active = true`
    if (!service) return res.status(404).json({ error: 'Service not found' })

    const start = new Date(start_time)
    if (Number.isNaN(start.getTime()) || start <= new Date()) {
      return res.status(400).json({ error: 'start_time must be a valid future time.' })
    }
    const end = new Date(start.getTime() + service.duration_minutes * 60 * 1000)

    // Re-check for a conflicting booking right before inserting, since the
    // slot the customer picked may have been taken since they loaded the page.
    const conflicts = await sql`
      select 1 from bookings
      where status != 'cancelled'
        and start_time < ${end.toISOString()}
        and end_time > ${start.toISOString()}
      limit 1
    `
    if (conflicts.length > 0) {
      return res.status(409).json({ error: 'That time was just booked by someone else. Please pick another slot.' })
    }

    const [row] = await sql`
      insert into bookings (service_id, customer_name, customer_email, customer_phone, start_time, end_time, notes)
      values (${service_id}, ${customer_name}, ${customer_email}, ${customer_phone ?? null}, ${start.toISOString()}, ${end.toISOString()}, ${notes ?? null})
      returning *
    `
    return res.status(201).json(row)
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
