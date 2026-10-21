import { Link, createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { PageShell } from "@/components/landing/primitives";
import { getEventBySlug } from "@/data/site-events";
import { buildEventJsonLd, buildPageHead } from "@/lib/site";

const event = getEventBySlug("7-de-setembro-na-paulista")!;

const seo = {
  path: event.href,
  title: `${event.name} | Padre Kelmon`,
  description: event.description,
  image: event.image,
  breadcrumbs: [
    { name: "Início", path: "/" },
    { name: "Agenda", path: "/agenda" },
    { name: event.name, path: event.href },
  ],
};

export const Route = createFileRoute("/eventos/7-de-setembro-na-paulista")({
  component: EventoPaulistaPage,
  head: () => {
    const head = buildPageHead(seo);
    return {
      ...head,
      scripts: [
        ...(head.scripts ?? []),
        {
          type: "application/ld+json",
          children: JSON.stringify(buildEventJsonLd()),
        },
      ],
    };
  },
});

function EventoPaulistaPage() {
  return (
    <InnerPage breadcrumbs={seo.breadcrumbs}>
      <article className="section-pad bg-white">
        <PageShell className="max-w-3xl">
          <p
            className="text-xs font-bold uppercase tracking-[0.22em]"
            style={{ color: "var(--yellow-primary)" }}
          >
            Evento
          </p>
          <h1
            className="mt-3 text-[1.65rem] font-black leading-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
          >
            {event.name}
          </h1>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            <time dateTime={event.dateIso}>{event.date}</time> · {event.time} · {event.location}
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-700">{event.description}</p>

          <figure className="mt-6 overflow-hidden rounded-2xl border-2 border-gray-200 shadow-lg">
            <img
              src={event.image}
              alt={event.imageAlt}
              width={1080}
              height={1350}
              className="h-auto w-full object-cover"
            />
          </figure>

          <ul className="mt-8 space-y-3 text-[1.05rem] leading-relaxed text-foreground">
            {event.details.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-gray-600">
            A cobertura textual está em{" "}
            <Link
              to="/imprensa/7-de-setembro"
              className="font-semibold underline underline-offset-4"
              style={{ color: "var(--blue-primary)" }}
            >
              Notícias
            </Link>
            .
          </p>
        </PageShell>
      </article>
    </InnerPage>
  );
}
