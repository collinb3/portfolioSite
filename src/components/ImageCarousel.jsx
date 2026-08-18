import { useEffect, useState } from 'react'

function CarouselControls({ images, index, goTo, size = 'sm' }) {
  if (images.length <= 1) return null

  const btnSize = size === 'lg' ? 'h-11 w-11 text-xl' : 'h-8 w-8'
  const dotVisual = size === 'lg' ? 'h-2 w-2' : 'h-1.5 w-1.5'

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goTo(index - 1)
        }}
        aria-label="Previous screenshot"
        className={`absolute left-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100 ${btnSize}`}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goTo(index + 1)
        }}
        aria-label="Next screenshot"
        className={`absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100 ${btnSize}`}
      >
        ›
      </button>

      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2">
        {images.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              goTo(i)
            }}
            aria-label={`Go to screenshot ${i + 1}`}
            className="flex h-6 w-6 items-center justify-center"
          >
            <span
              className={`block rounded-full transition-colors ${dotVisual} ${
                i === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          </button>
        ))}
      </div>
    </>
  )
}

export default function ImageCarousel({ images, alt }) {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    if (!lightboxOpen) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') goTo(index - 1)
      if (e.key === 'ArrowRight') goTo(index + 1)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, index])

  if (!images || images.length === 0) return null

  const goTo = (i) => setIndex((i + images.length) % images.length)

  return (
    <>
      <div className="group relative h-40 overflow-hidden rounded-xl border border-sage-100 bg-sage-50">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            setLightboxOpen(true)
          }}
          aria-label={`View full size screenshot ${index + 1} of ${images.length}`}
          className="block h-full w-full cursor-zoom-in"
        >
          <img
            src={images[index]}
            alt={`${alt} — screenshot ${index + 1} of ${images.length}`}
            className="h-full w-full object-cover object-top"
            loading="lazy"
          />
        </button>

        <CarouselControls images={images} index={index} goTo={goTo} />
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/90 p-6"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — full size screenshot viewer`}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close full size view"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
          >
            ×
          </button>

          <div
            className="group relative max-h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[index]}
              alt={`${alt} — screenshot ${index + 1} of ${images.length}, full size`}
              className="max-h-[85vh] w-auto rounded-lg object-contain shadow-2xl"
            />
            <CarouselControls images={images} index={index} goTo={goTo} size="lg" />
          </div>
        </div>
      )}
    </>
  )
}
