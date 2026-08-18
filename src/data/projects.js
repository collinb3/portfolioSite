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
    codeHref: 'https://github.com/collinb3/poetry-web',
    liveHref: '/poetry',
  },
]
