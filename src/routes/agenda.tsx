import { Link, createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { PageHeading } from "@/components/landing/page-heading";
import { PageShell } from "@/components/landing/primitives";
import { SITE_EVENTS } from "@/data/site-events";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/agenda")({
  component: AgendaPage,
  head: () => buildPageHead(PAGE_SEO.agenda),
});

const upcoming = SITE_EVENTS.filter((event) => event.status !== "past");
const past = SITE_EVENTS.filter((event) => event.status === "past");

function AgendaPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.agenda.breadcrumbs}>
      <section className="section-pad bg-white">
        <PageHeading kicker="Compromissos públicos" title="Agenda">
          <p>
            Só entram nesta agenda eventos com data, horário e local confirmados. Novos
            compromissos serão publicados quando houver informação verificável.
          </p>
        </PageHeading>

        <PageShell className="mt-10 max-w-3xl space-y-8">
          <div>
            <h2
              className="text-xl font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
            >
              Próximos eventos
            </h2>
            {upcoming.length === 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                Não há evento futuro confirmado neste momento. Acompanhe as{" "}
                <Link to="/links" className="font-semibold underline underline-offset-4" style={{ color: "var(--blue-primary)" }}>
                  redes oficiais
                </Link>{" "}
                e volte a esta página.
              </p>
            ) : (
              <EventList events={upcoming} />
            )}
          </div>

          <div>
            <h2
              className="text-xl font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
            >
              Arquivo histórico
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
              Eventos passados com valor informativo permanecem publicados.
            </p>
            <EventList events={past} />
          </div>
        </PageShell>
      </section>
    </InnerPage>
  );
}

function EventList({ events }: { events: readonly (typeof SITE_EVENTS)[number][] }) {
  return (
    <ul className="mt-4 space-y-4">
      {events.map((event) => (
        <li key={event.slug} className="rounded-2xl border border-border/70 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            <time dateTime={event.dateIso}>{event.date}</time> · {event.time} · {event.location}
          </p>
          <h3
            className="mt-2 text-lg font-black"
            style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
          >
            <Link to={event.href} className="underline-offset-4 hover:underline">
              {event.name}
            </Link>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{event.description}</p>
        </li>
      ))}
    </ul>
  );
}
