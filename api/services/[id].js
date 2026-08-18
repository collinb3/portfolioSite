import { sql } from '../_db.js'
import { requireAdmin } from '../_auth.js'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return

    const { name, description, duration_minutes, price_cents, active } = req.body || {}
    const [row] = await sql`
      update services
      set
        name = coalesce(${name ?? null}, name),
        description = ${description ?? null},
        duration_minutes = coalesce(${duration_minutes ?? null}, duration_minutes),
        price_cents = coalesce(${price_cents ?? null}, price_cents),
        active = coalesce(${active ?? null}, active)
      where id = ${id}
      returning *
    `
    if (!row) return res.status(404).json({ error: 'Service not found' })
    return res.status(200).json(row)
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return

    // Soft-delete: keep history intact for any existing bookings.
    const [row] = await sql`
      update services set active = false where id = ${id} returning *
    `
    if (!row) return res.status(404).json({ error: 'Service not found' })
    return res.status(200).json(row)
  }

  res.setHeader('Allow', 'PUT, DELETE')
  return res.status(405).json({ error: 'Method not allowed' })
}
