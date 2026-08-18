import { projects } from '../data/projects'

function ProjectCard({ project }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-sage-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {project.image ? (
        <div className="h-40 overflow-hidden rounded-xl border border-sage-100 bg-sage-50">
          <img
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            className="h-full w-full object-cover object-top"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex h-36 items-center justify-center rounded-xl bg-sage-50 text-sage-300">
          <span className="text-sm font-medium">Preview coming soon</span>
        </div>
      )}

      <div className="mt-5 flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold text-ink-900">{project.title}</h2>
        {project.status && (
          <span className="shrink-0 rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-800">
            {project.status}
          </span>
        )}
      </div>

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

      {(project.liveHref || project.codeHref) && (
        <div className="mt-5 flex gap-5 border-t border-sage-100 pt-4 text-sm font-semibold">
          {project.liveHref && (
            <a
              href={project.liveHref}
              target="_blank"
              rel="noreferrer"
              className="text-sage-700 hover:text-sage-800"
            >
              View live demo →
            </a>
          )}
          {project.codeHref && (
            <a
              href={project.codeHref}
              target="_blank"
              rel="noreferrer"
              className="text-ink-700 hover:text-sage-800"
            >
              View code →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default function Projects() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sage-600">Projects</p>
      <h1 className="text-4xl font-bold tracking-tight text-ink-900">Sample work</h1>
      <p className="mt-4 max-w-2xl text-ink-700">
        A growing collection of sample apps and case studies that put my UX and accessibility focus into practice.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  )
}
