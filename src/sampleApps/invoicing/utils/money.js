export function formatCents(cents) {
  return `$${(cents / 100).toFixed(2)}`
}

export function lineItemTotalCents(item) {
  return Math.round(item.quantity * item.unit_price_cents)
}

export function invoiceTotalCents(lineItems) {
  return lineItems.reduce((sum, item) => sum + lineItemTotalCents(item), 0)
}
