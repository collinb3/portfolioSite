import { sql } from './_db.js'
import { requireAdmin } from './_auth.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const rows = await sql`select * from clients order by name asc`
    return res.status(200).json(rows)
  }

  if (req.method === 'POST') {
    const { name, email } = req.body || {}
    if (!name || !EMAIL_RE.test(email || '')) {
      return res.status(400).json({ error: 'A valid name and email are required.' })
    }

    const [row] = await sql`
      insert into clients (name, email)
      values (${name}, ${email})
      on conflict (email) do update set name = excluded.name
      returning *
    `
    return res.status(201).json(row)
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
