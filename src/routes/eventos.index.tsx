import { Link, createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { PageHeading } from "@/components/landing/page-heading";
import { PageShell } from "@/components/landing/primitives";
import { SITE_EVENTS } from "@/data/site-events";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/eventos/")({
  component: EventosPage,
  head: () => buildPageHead(PAGE_SEO.eventos),
});

function EventosPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.eventos.breadcrumbs}>
      <section className="section-pad bg-white">
        <PageHeading kicker="Agenda pública" title="Eventos">
          <p>
            Páginas de evento só existem quando há dados reais. A{" "}
            <Link to="/agenda" className="font-semibold underline underline-offset-4" style={{ color: "var(--blue-primary)" }}>
              agenda
            </Link>{" "}
            organiza os compromissos por data.
          </p>
        </PageHeading>

        <PageShell className="mt-10 grid gap-6 md:grid-cols-2">
          {SITE_EVENTS.map((event) => (
            <Link
              key={event.slug}
              to={event.href}
              className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={event.image}
                alt={event.imageAlt}
                width={640}
                height={400}
                className="h-48 w-full object-cover"
              />
              <div className="space-y-2 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  <time dateTime={event.dateIso}>{event.date}</time> · {event.time}
                </p>
                <h2
                  className="text-lg font-black leading-snug"
                  style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
                >
                  {event.name}
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">{event.location}</p>
              </div>
            </Link>
          ))}
        </PageShell>
      </section>
    </InnerPage>
  );
}
