import { sql } from './_db.js'
import { requireAdmin } from './_auth.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const [hours, blocked] = await Promise.all([
      sql`select * from business_hours order by day_of_week asc`,
      sql`select date, reason from blocked_dates where date >= current_date order by date asc`,
    ])
    return res.status(200).json({ hours, blockedDates: blocked })
  }

  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return

    const { day_of_week, open_time, close_time, is_closed } = req.body || {}
    if (day_of_week === undefined) {
      return res.status(400).json({ error: 'day_of_week is required.' })
    }

    const [row] = await sql`
      update business_hours
      set
        open_time = ${open_time ?? null},
        close_time = ${close_time ?? null},
        is_closed = ${is_closed ?? false}
      where day_of_week = ${day_of_week}
      returning *
    `
    if (!row) return res.status(404).json({ error: 'Day not found' })
    return res.status(200).json(row)
  }

  res.setHeader('Allow', 'GET, PUT')
  return res.status(405).json({ error: 'Method not allowed' })
}
