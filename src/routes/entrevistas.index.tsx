import { Link, createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { PageHeading } from "@/components/landing/page-heading";
import { PageShell } from "@/components/landing/primitives";
import { SITE_INTERVIEWS } from "@/data/site-interviews";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/entrevistas/")({
  component: EntrevistasPage,
  head: () => buildPageHead(PAGE_SEO.entrevistas),
});

function EntrevistasPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.entrevistas.breadcrumbs}>
      <section className="section-pad bg-white">
        <PageHeading kicker="Vídeo oficial" title="Entrevistas">
          <p>
            Somente entrevistas com registro público no YouTube. Não há transcrição integral
            de programas de terceiros. Cada página traz contexto próprio e o vídeo original.
          </p>
        </PageHeading>

        <PageShell className="mt-10 grid gap-6 md:grid-cols-2">
          {SITE_INTERVIEWS.map((item) => (
            <Link
              key={item.slug}
              to="/entrevistas/$slug"
              params={{ slug: item.slug }}
              className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm transition-shadow hover:shadow-md"
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
                  {item.program} · <time dateTime={item.dateIso}>{item.date}</time>
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
