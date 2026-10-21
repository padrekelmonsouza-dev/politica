import { Link, createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { PageHeading } from "@/components/landing/page-heading";
import { PageShell } from "@/components/landing/primitives";
import { SITE_SPEECHES } from "@/data/site-speeches";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/discursos/")({
  component: DiscursosPage,
  head: () => buildPageHead(PAGE_SEO.discursos),
});

function DiscursosPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.discursos.breadcrumbs}>
      <section className="section-pad bg-white">
        <PageHeading kicker="Pronunciamentos" title="Discursos e falas">
          <p>
            Reunimos falas com vídeo oficial da campanha. Não copiamos discursos de terceiros
            nem inventamos pronunciamentos. Novos registros entram aqui quando houver fonte
            própria.
          </p>
        </PageHeading>

        <PageShell className="mt-10 max-w-3xl">
          {SITE_SPEECHES.map((item) => (
            <Link
              key={item.slug}
              to={item.href}
              className="block overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={`https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`}
                alt={item.title}
                width={480}
                height={360}
                className="h-48 w-full object-cover"
              />
              <div className="space-y-2 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  <time dateTime={item.dateIso}>{item.date}</time>
                </p>
                <h2
                  className="text-lg font-black leading-snug"
                  style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
                >
                  {item.title}
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
              </div>
            </Link>
          ))}
        </PageShell>
      </section>
    </InnerPage>
  );
}
