import { Link } from "react-router-dom";
import { profile } from "../data/resume";
import { services } from "../data/foxHollowServices";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 sm:pt-28">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-sage-600">
          {profile.company}
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl">
          Websites and web apps built for how small businesses actually work.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-700">
          Fox Hollow Studio designs and builds fast, accessible websites and
          custom web applications — from marketing sites to full booking and
          invoicing systems — for small businesses and teams who need more than
          a template.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/projects"
            className="rounded-full bg-sage-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sage-700"
          >
            View our work
          </Link>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-sage-300 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-sage-100"
          >
            Get in touch
          </a>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-sage-200 bg-sage-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            What we build
          </h2>
          <p className="mt-2 max-w-2xl text-ink-700">
            Real, working software — not just static pages — tailored to what
            your business actually needs.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-sage-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-ink-900">
                  {service.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-700">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          Have a project in mind?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-700">
          Take a look at our work, or reach out and tell us what you're trying
          to build.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-sage-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sage-700"
          >
            {profile.email}
          </a>
          <Link
            to="/about"
            className="rounded-full border border-sage-300 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-sage-100"
          >
            Meet the founder
          </Link>
        </div>
      </section>
    </div>
  );
}
