import { projects } from '../data/resume'

export default function Projects() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sage-600">Projects</p>
      <h1 className="text-4xl font-bold tracking-tight text-ink-900">Sample work</h1>
      <p className="mt-4 max-w-2xl text-ink-700">
        A growing collection of sample apps and case studies that put my UX and accessibility focus into practice.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => {
          const card = (
            <div className="flex h-full flex-col rounded-2xl border border-sage-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-36 items-center justify-center rounded-xl bg-sage-50 text-sage-300">
                <span className="text-sm font-medium">Preview coming soon</span>
              </div>
              <h2 className="mt-5 text-xl font-semibold text-ink-900">{project.title}</h2>
              <p className="mt-2 flex-1 text-ink-700">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {project.href && (
                <span className="mt-4 text-sm font-semibold text-sage-700">View project →</span>
              )}
            </div>
          )

          return project.href ? (
            <a key={project.title} href={project.href} target="_blank" rel="noreferrer">
              {card}
            </a>
          ) : (
            <div key={project.title}>{card}</div>
          )
        })}
      </div>
    </div>
  )
}
