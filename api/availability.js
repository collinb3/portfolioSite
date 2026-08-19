import { sql } from './_db.js'

// Slot granularity — how often a new bookable start time appears.
const SLOT_MINUTES = 15

// NOTE: this demo treats the business as operating in a single fixed
// timezone equal to the server's UTC clock (i.e. business_hours times like
// "09:00" are interpreted as 09:00 UTC). A real deployment would store a
// business timezone and convert accordingly — flagging this as a known
// simplification rather than silently guessing a timezone.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { serviceId, date } = req.query
  if (!serviceId || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'serviceId and date=YYYY-MM-DD are required.' })
  }

  const [service] = await sql`select * from services where id = ${serviceId} and active = true`
  if (!service) return res.status(404).json({ error: 'Service not found' })

  const dayOfWeek = new Date(`${date}T00:00:00Z`).getUTCDay()

  const [hoursRow] = await sql`select * from business_hours where day_of_week = ${dayOfWeek}`
  if (!hoursRow || hoursRow.is_closed || !hoursRow.open_time || !hoursRow.close_time) {
    return res.status(200).json({ slots: [] })
  }

  const [blocked] = await sql`select 1 from blocked_dates where date = ${date}`
  if (blocked) {
    return res.status(200).json({ slots: [] })
  }

  const dayStart = new Date(`${date}T00:00:00Z`)
  const dayEnd = new Date(`${date}T23:59:59Z`)
  const existing = await sql`
    select start_time, end_time from bookings
    where status != 'cancelled' and start_time >= ${dayStart.toISOString()} and start_time <= ${dayEnd.toISOString()}
  `

  const openAt = new Date(`${date}T${hoursRow.open_time}Z`)
  const closeAt = new Date(`${date}T${hoursRow.close_time}Z`)
  const durationMs = service.duration_minutes * 60 * 1000
  const stepMs = SLOT_MINUTES * 60 * 1000
  const now = new Date()

  const slots = []
  for (let start = openAt; start.getTime() + durationMs <= closeAt.getTime(); start = new Date(start.getTime() + stepMs)) {
    const end = new Date(start.getTime() + durationMs)
    if (start <= now) continue

    const overlaps = existing.some((b) => {
      const bStart = new Date(b.start_time)
      const bEnd = new Date(b.end_time)
      return start < bEnd && end > bStart
    })
    if (!overlaps) slots.push(start.toISOString())
  }

  return res.status(200).json({ slots })
}
