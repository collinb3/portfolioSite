import { experience, internships, education, expertise } from '../data/resume'

export default function Experience() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sage-600">Experience</p>
      <h1 className="text-4xl font-bold tracking-tight text-ink-900">Where I've worked</h1>
      <p className="mt-4 max-w-2xl text-ink-700">
        A closer look at the teams I've led, the products I've shipped, and the impact along the way.
      </p>

      {/* Areas of expertise */}
      <div className="mt-10 flex flex-wrap gap-2">
        {expertise.map((item) => (
          <span
            key={item}
            className="rounded-full border border-sage-300 px-3 py-1 text-sm font-medium text-sage-800"
          >
            {item}
          </span>
        ))}
      </div>

      {/* Timeline */}
      <div className="mt-14 space-y-10 border-l-2 border-sage-200 pl-8">
        {experience.map((job) => (
          <div key={`${job.company}-${job.dates}`} className="relative">
            <span className="absolute -left-[2.55rem] top-1.5 h-3 w-3 rounded-full bg-sage-600 ring-4 ring-[#faf9f6]" />
            <p className="text-sm font-medium text-sage-600">{job.dates}</p>
            <h2 className="mt-1 text-xl font-semibold text-ink-900">{job.role}</h2>
            <p className="text-ink-700">
              {job.company} · {job.location}
            </p>
            <p className="mt-3 leading-relaxed text-ink-700">{job.description}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-700">
              {job.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Internships */}
      <h2 className="mt-16 text-2xl font-bold tracking-tight text-ink-900">Internships</h2>
      <div className="mt-8 space-y-8 border-l-2 border-sage-200 pl-8">
        {internships.map((job) => (
          <div key={`${job.company}-${job.dates}`} className="relative">
            <span className="absolute -left-[2.55rem] top-1.5 h-3 w-3 rounded-full bg-sage-300 ring-4 ring-[#faf9f6]" />
            <p className="text-sm font-medium text-sage-600">{job.dates}</p>
            <h3 className="mt-1 text-lg font-semibold text-ink-900">{job.role}</h3>
            <p className="text-ink-700">
              {job.company} · {job.location}
            </p>
            <p className="mt-3 leading-relaxed text-ink-700">{job.description}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <h2 className="mt-16 text-2xl font-bold tracking-tight text-ink-900">Education</h2>
      <div className="mt-6 rounded-2xl border border-sage-200 bg-white p-6 shadow-sm">
        <p className="font-semibold text-ink-900">{education.degree}</p>
        <p className="text-ink-700">
          {education.school} · {education.location}
        </p>
      </div>
    </div>
  )
}
