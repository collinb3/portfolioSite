import { sql } from './_db.js'
import { requireAdmin } from './_auth.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Public: list active services for the booking flow. Admins pass
    // ?all=1 (with the admin header) to also see inactive services.
    const wantsAll = req.query.all === '1'
    const isAdmin = wantsAll && req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD

    const rows = isAdmin
      ? await sql`select * from services order by name asc`
      : await sql`select * from services where active = true order by name asc`

    return res.status(200).json(rows)
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return

    const { name, description, duration_minutes, price_cents } = req.body || {}
    if (!name || !duration_minutes || !price_cents) {
      return res.status(400).json({ error: 'name, duration_minutes, and price_cents are required.' })
    }

    const [row] = await sql`
      insert into services (name, description, duration_minutes, price_cents)
      values (${name}, ${description ?? null}, ${duration_minutes}, ${price_cents})
      returning *
    `
    return res.status(201).json(row)
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
