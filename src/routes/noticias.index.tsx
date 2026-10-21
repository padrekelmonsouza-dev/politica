import { Link, createFileRoute } from "@tanstack/react-router";

import { ClusterLinks } from "@/components/landing/cluster-links";
import { InnerPage } from "@/components/landing/inner-page";
import { PageHeading } from "@/components/landing/page-heading";
import { PageShell } from "@/components/landing/primitives";
import { SITE_NEWS } from "@/data/site-news";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/noticias/")({
  component: NoticiasPage,
  head: () => buildPageHead(PAGE_SEO.noticias),
});

function NoticiasPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.noticias.breadcrumbs}>
      <section className="section-pad bg-white">
        <PageHeading kicker="Editorial" title="Notícias">
          <p>
            Páginas próprias da campanha e resumos originais de matérias da imprensa, com
            a fonte e o link para o texto original. O site não copia matérias de terceiros.
          </p>
        </PageHeading>

        <PageShell className="mt-10 grid gap-6 md:grid-cols-2">
          {SITE_NEWS.map((item) => (
            <Link
              key={item.slug}
              to={item.href}
              className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={item.image}
                alt={item.imageAlt}
                width={640}
                height={360}
                loading="lazy"
                decoding="async"
                className="h-48 w-full object-cover"
              />
              <div className="space-y-2 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  {item.category} · {item.source} · <time dateTime={item.dateIso}>{item.date}</time>
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
      <ClusterLinks current="/noticias" />
    </InnerPage>
  );
}
