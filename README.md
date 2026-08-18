# Collin Blanchard — Portfolio

Personal portfolio site for Collin Blanchard, Senior Frontend Engineer. Built to showcase skills, professional experience, and sample projects for job applications and freelance work.

Live at [collin-blanchard.com](https://collin-blanchard.com).

## Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- Deployed on [Vercel](https://vercel.com/)

## Pages

- **Home** (`/`) — intro, UX/accessibility-focused passion blurb, and a prominent skills breakdown
- **Projects** (`/projects`) — sample apps and case studies, each linking to a live demo and/or source code
- **Experience** (`/experience`) — full work history, internships, and education

## Getting started

```bash
npm install
npm run dev
```

Builds for production with:

```bash
npm run build
```

## Content

Resume-derived content (skills, experience, projects, etc.) lives in `src/data/resume.js` — update that file to change what's displayed rather than editing the page components directly.

## Deployment notes

`vercel.json` includes a SPA rewrite so client-side routes (`/projects`, `/experience`) resolve correctly on direct navigation and page refresh, not just in-app links.
