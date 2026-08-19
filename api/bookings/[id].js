import { sql } from '../_db.js'
import { requireAdmin } from '../_auth.js'

const VALID_STATUSES = ['confirmed', 'cancelled', 'completed']

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!requireAdmin(req, res)) return

  const { id } = req.query
  const { status } = req.body || {}
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` })
  }

  const [row] = await sql`
    update bookings set status = ${status} where id = ${id} returning *
  `
  if (!row) return res.status(404).json({ error: 'Booking not found' })
  return res.status(200).json(row)
}
