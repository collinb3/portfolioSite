import { profile } from '../data/resume'

export default function Footer() {
  return (
    <footer className="border-t border-sage-200 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-6 text-sm text-ink-500 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} {profile.company} LLC. Built with React, Tailwind & Vite.</p>
        <div className="flex gap-4">
          <a href={`mailto:${profile.email}`} className="hover:text-sage-700">
            {profile.email}
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-sage-700">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
