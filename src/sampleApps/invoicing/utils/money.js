export function formatCents(cents) {
  return `$${(cents / 100).toFixed(2)}`
}

export function lineItemTotalCents(item) {
  return Math.round(item.quantity * item.unit_price_cents)
}

export function invoiceTotalCents(lineItems) {
  return lineItems.reduce((sum, item) => sum + lineItemTotalCents(item), 0)
}

// Postgres `date` columns come back from Neon as full ISO timestamps
// (e.g. "2026-08-31T00:00:00.000Z") rather than plain "YYYY-MM-DD" strings.
// Slice rather than re-parsing with `new Date()`, since parsing-and-reformatting
// risks shifting the date by a day depending on the viewer's local timezone.
export function formatDate(value) {
  if (!value) return value
  return String(value).slice(0, 10)
}
