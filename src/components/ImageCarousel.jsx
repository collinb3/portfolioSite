import { useState } from 'react'

export default function ImageCarousel({ images, alt }) {
  const [index, setIndex] = useState(0)

  if (!images || images.length === 0) return null

  const goTo = (i) => setIndex((i + images.length) % images.length)

  return (
    <div className="group relative h-40 overflow-hidden rounded-xl border border-sage-100 bg-sage-50">
      <img
        src={images[index]}
        alt={`${alt} — screenshot ${index + 1} of ${images.length}`}
        className="h-full w-full object-cover object-top"
        loading="lazy"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              goTo(index - 1)
            }}
            aria-label="Previous screenshot"
            className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              goTo(index + 1)
            }}
            aria-label="Next screenshot"
            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            ›
          </button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  goTo(i)
                }}
                aria-label={`Go to screenshot ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
