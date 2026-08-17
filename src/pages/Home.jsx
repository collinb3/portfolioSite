import { Link } from 'react-router-dom'
import { profile, skillGroups } from '../data/resume'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 sm:pt-28">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-sage-600">
          {profile.title}
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl">
          Hi, I'm {profile.name.split(' ')[0]}. I build accessible, friction-free web experiences.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-700">
          {profile.blurb}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/projects"
            className="rounded-full bg-sage-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sage-700"
          >
            View my projects
          </Link>
          <Link
            to="/experience"
            className="rounded-full border border-sage-300 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-sage-100"
          >
            See my experience
          </Link>
        </div>
      </section>

      {/* Skills — the most prominent feature */}
      <section className="border-t border-sage-200 bg-sage-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Skills</h2>
          <p className="mt-2 max-w-2xl text-ink-700">
            Tools and practices I rely on to ship accessible, well-tested products from design through deployment.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-sage-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-sage-700">
                  {group.title}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-sage-100 px-3 py-1 text-sm font-medium text-sage-800"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
