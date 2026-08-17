import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
]

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-sage-200 bg-[#faf9f6]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="text-lg font-semibold tracking-tight text-ink-900">
          Collin Blanchard
        </NavLink>
        <ul className="flex items-center gap-1 text-sm font-medium">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition-colors ${
                    isActive
                      ? 'bg-sage-600 text-white'
                      : 'text-ink-700 hover:bg-sage-100 hover:text-sage-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
