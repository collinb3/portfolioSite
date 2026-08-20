import { sql } from '../../_db.js'

// Public, unauthenticated — this is the endpoint the shareable client-facing
// link hits. Deliberately keyed by the hard-to-guess public_token rather than
// the sequential id, and only ever returns the single matching invoice.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token } = req.query

  const [invoice] = await sql`
    select
      i.id, i.invoice_number, i.status, i.issue_date, i.due_date, i.notes,
      c.name as client_name, c.email as client_email,
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
    where i.public_token = ${token}
    group by i.id, c.name, c.email
  `

  if (!invoice) return res.status(404).json({ error: 'Invoice not found' })
  return res.status(200).json(invoice)
}
