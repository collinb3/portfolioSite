import crypto from 'node:crypto'
import { sql } from './_db.js'
import { requireAdmin } from './_auth.js'

function generatePublicToken() {
  return crypto.randomBytes(9).toString('base64url')
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    // One row per invoice, with client info and line items aggregated as JSON
    // so the admin dashboard can render everything from a single request.
    const rows = await sql`
      select
        i.*,
        c.name as client_name,
        c.email as client_email,
        coalesce(
          json_agg(
            json_build_object(
              'id', li.id,
              'description', li.description,
              'quantity', li.quantity,
              'unit_price_cents', li.unit_price_cents
            )
            order by li.id
          ) filter (where li.id is not null),
          '[]'
        ) as line_items
      from invoices i
      join clients c on c.id = i.client_id
      left join invoice_line_items li on li.invoice_id = i.id
      group by i.id, c.name, c.email
      order by i.created_at desc
    `
    return res.status(200).json(rows)
  }

  if (req.method === 'POST') {
    const { client_id, due_date, notes, line_items } = req.body || {}

    if (!client_id || !Array.isArray(line_items) || line_items.length === 0) {
      return res.status(400).json({ error: 'client_id and at least one line item are required.' })
    }
    for (const item of line_items) {
      if (!item.description || !item.quantity || item.unit_price_cents == null) {
        return res.status(400).json({ error: 'Each line item needs a description, quantity, and unit price.' })
      }
    }

    const [client] = await sql`select id from clients where id = ${client_id}`
    if (!client) return res.status(404).json({ error: 'Client not found' })

    const [{ count }] = await sql`select count(*)::int as count from invoices`
    const invoiceNumber = `INV-${1000 + count + 1}`
    const publicToken = generatePublicToken()

    const [invoice] = await sql`
      insert into invoices (client_id, invoice_number, public_token, status, due_date, notes)
      values (${client_id}, ${invoiceNumber}, ${publicToken}, 'draft', ${due_date ?? null}, ${notes ?? null})
      returning *
    `

    for (const item of line_items) {
      await sql`
        insert into invoice_line_items (invoice_id, description, quantity, unit_price_cents)
        values (${invoice.id}, ${item.description}, ${item.quantity}, ${item.unit_price_cents})
      `
    }

    return res.status(201).json(invoice)
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
