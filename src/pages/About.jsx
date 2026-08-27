import { useState } from 'react'
import { profile, skillGroups } from '../data/resume'
import ResumeModal from '../components/ResumeModal'

export default function About() {
  const [resumeOpen, setResumeOpen] = useState(false)

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sage-600">About</p>
      <h1 className="text-4xl font-bold tracking-tight text-ink-900">The person behind the studio</h1>

      <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start">
        {/* Photo placeholder — swap for a real headshot when available */}
        <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-sage-100 text-4xl font-bold text-sage-500">
          CB
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink-900">{profile.name}</h2>
          <p className="mt-1 text-sage-700">
            {profile.title} <span className="text-sage-400">·</span> Founder, {profile.company}
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-700">{profile.blurb}</p>

          <button
            type="button"
            onClick={() => setResumeOpen(true)}
            className="mt-6 rounded-full border border-sage-300 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-sage-100"
          >
            View my résumé
          </button>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Skills</h2>
        <p className="mt-2 max-w-2xl text-ink-700">
          Tools and practices I rely on to ship accessible, well-tested products from design through deployment.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-sage-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-sage-700">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li key={skill} className="rounded-full bg-sage-100 px-3 py-1 text-sm font-medium text-sage-800">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  )
}
