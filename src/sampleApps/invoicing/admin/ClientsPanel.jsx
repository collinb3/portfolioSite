export default function ClientsPanel({ clients }) {
  if (clients.length === 0) return <p className="text-sm text-gray-500">No clients yet — add one when creating an invoice.</p>

  return (
    <ul className="divide-y divide-gray-200 rounded-2xl bg-white shadow-sm">
      {clients.map((c) => (
        <li key={c.id} className="p-4">
          <p className="font-medium text-gray-900">{c.name}</p>
          <p className="text-sm text-gray-500">{c.email}</p>
        </li>
      ))}
    </ul>
  )
}
