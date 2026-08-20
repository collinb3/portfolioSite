// Sample apps and case studies featured on the Projects page.
// Swap in more entries here as they're built.
export const projects = [
  {
    title: 'i18n Translation Manager',
    status: 'Case study',
    description:
      'A full-stack translation management platform for organizing multilingual content by project and module. Admins create translation keys, manage locales, and export ready-to-use translation files; client apps pull translations through a simple REST API with automatic fallback to English for missing keys.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Express', 'Couchbase', 'REST API'],
    images: [
      '/project-images/translation-tool-editor.png',
      '/project-images/translation-tool-projects.png',
    ],
    codeHref: 'https://github.com/collinb3/translation-tool',
    liveHref: null,
  },
  {
    title: 'Poetry Explorer',
    status: 'Live demo',
    description:
      'A React app for searching poetrydb.org by author and/or title, with random-poem discovery, pagination, a detail view, and a dark/light toggle.',
    tags: ['React', 'Tailwind CSS', 'REST API'],
    image: '/project-images/poetry-explorer.png',
    codeHref: 'https://github.com/collinb3/poetry-web',
    liveHref: '/poetry',
  },
  {
    title: 'Service Booking System',
    status: 'Live demo',
    description:
      'A full-stack appointment booking system built for local service businesses — customers pick a service and open time slot and book instantly, while the owner manages bookings and services from a lightweight, password-protected admin dashboard. Backed by a real serverless Postgres database, not mock data.',
    tags: ['React', 'Tailwind CSS', 'Vercel Functions', 'Postgres (Neon)', 'REST API'],
    image: '/project-images/booking-services.png',
    codeHref: 'https://github.com/collinb3/portfolioSite/tree/main/src/sampleApps/booking',
    liveHref: '/booking',
  },
  {
    title: 'Invoicing & Quotes',
    status: 'Live demo',
    description:
      'A freelancer-focused invoicing tool: build an itemized invoice, send the client a shareable link (no login required on their end), and track paid/unpaid status from a lightweight admin dashboard. Clients can download a real, formatted PDF of their invoice in one click.',
    tags: ['React', 'Tailwind CSS', 'Vercel Functions', 'Postgres (Neon)', 'PDF generation'],
    codeHref: 'https://github.com/collinb3/portfolioSite/tree/main/src/sampleApps/invoicing',
    liveHref: '/invoicing/demo',
  },
]
