import { useEffect, useRef } from 'react'
import { experience, internships, education, expertise } from '../data/resume'

export default function ResumeModal({ open, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    dialogRef.current?.focus()

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink-900/50 p-4 py-10 sm:p-6"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Résumé"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl focus:outline-none sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-sage-600">Résumé</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink-900">Where I've worked</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close résumé"
            className="rounded-full p-2 text-ink-500 hover:bg-sage-100 hover:text-ink-900"
          >
            ✕
          </button>
        </div>

        {/* Areas of expertise */}
        <div className="mt-6 flex flex-wrap gap-2">
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
        <div className="mt-8 space-y-8 border-l-2 border-sage-200 pl-6">
          {experience.map((job) => (
            <div key={`${job.company}-${job.dates}`} className="relative">
              <span className="absolute -left-[1.95rem] top-1.5 h-3 w-3 rounded-full bg-sage-600 ring-4 ring-white" />
              <p className="text-sm font-medium text-sage-600">{job.dates}</p>
              <h3 className="mt-1 text-lg font-semibold text-ink-900">{job.role}</h3>
              <p className="text-ink-700">
                {job.company} · {job.location}
              </p>
              <p className="mt-2 leading-relaxed text-ink-700">{job.description}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-700">
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Internships */}
        <h3 className="mt-10 text-xl font-bold tracking-tight text-ink-900">Internships</h3>
        <div className="mt-6 space-y-6 border-l-2 border-sage-200 pl-6">
          {internships.map((job) => (
            <div key={`${job.company}-${job.dates}`} className="relative">
              <span className="absolute -left-[1.95rem] top-1.5 h-3 w-3 rounded-full bg-sage-300 ring-4 ring-white" />
              <p className="text-sm font-medium text-sage-600">{job.dates}</p>
              <h4 className="mt-1 font-semibold text-ink-900">{job.role}</h4>
              <p className="text-ink-700">
                {job.company} · {job.location}
              </p>
              <p className="mt-2 leading-relaxed text-ink-700">{job.description}</p>
            </div>
          ))}
        </div>

        {/* Education */}
        <h3 className="mt-10 text-xl font-bold tracking-tight text-ink-900">Education</h3>
        <div className="mt-4 rounded-2xl border border-sage-200 bg-sage-50 p-5">
          <p className="font-semibold text-ink-900">{education.degree}</p>
          <p className="text-ink-700">
            {education.school} · {education.location}
          </p>
        </div>
      </div>
    </div>
  )
}
