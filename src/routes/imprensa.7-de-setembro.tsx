import { Link, createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { PageShell } from "@/components/landing/primitives";
import { SETE_SETEMBRO_ARTICLE } from "@/data/sete-setembro-article";
import { PageBreadcrumbs } from "@/components/landing/page-breadcrumbs";
import { PAGE_SEO, buildEventJsonLd, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/imprensa/7-de-setembro")({
  component: SeteSetembroPage,
  head: () => {
    const head = buildPageHead(PAGE_SEO.seteSetembro);
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

function SeteSetembroPage() {
  const article = SETE_SETEMBRO_ARTICLE;

  return (
    <div className="min-h-dvh bg-white md:min-h-screen">
      <SiteHeader />
      <main
        id="conteudo"
        className="overflow-x-clip pt-[4.25rem] outline-none sm:pt-[4.75rem]"
      >
        <PageBreadcrumbs items={PAGE_SEO.seteSetembro.breadcrumbs} />
        <article className="section-pad bg-white">
          <PageShell className="max-w-3xl">
            <p
              className="text-xs font-bold uppercase tracking-[0.22em]"
              style={{ color: "var(--yellow-primary)" }}
            >
              {article.eyebrow}
            </p>
            <h1
              className="mt-3 text-[1.65rem] font-black leading-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
            >
              {article.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {article.lead}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Por Padre Kelmon · {article.source} ·{" "}
              <time dateTime="2026-09-07">{article.date}</time>
            </p>

            <figure className="mt-6 overflow-hidden rounded-2xl border-2 border-gray-200 shadow-lg">
              <img
                src={article.image}
                alt="Padre Kelmon convoca São Paulo para o ato na Avenida Paulista no 7 de Setembro"
                width={1080}
                height={1350}
                className="h-auto w-full object-cover"
              />
            </figure>

            <div className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-foreground">
              {article.body.map((block, index) => {
                if (block.type === "h2") {
                  return (
                    <h2
                      key={index}
                      className="pt-4 text-xl font-black sm:text-2xl"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--blue-primary)",
                      }}
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "quote") {
                  return (
                    <blockquote
                      key={index}
                      className="rounded-xl border-l-4 px-4 py-3 text-lg font-bold"
                      style={{
                        borderColor: "var(--yellow-primary)",
                        backgroundColor: "oklch(0.97 0.04 95 / 0.55)",
                        color: "var(--blue-primary)",
                      }}
                    >
                      “{block.text}”
                    </blockquote>
                  );
                }
                return <p key={index}>{block.text}</p>;
              })}
            </div>

            <div
              className="mt-10 space-y-2 rounded-2xl border-2 p-5 text-sm font-semibold leading-relaxed sm:text-base"
              style={{
                borderColor: "var(--blue-primary)",
                color: "var(--blue-primary)",
              }}
            >
              {article.footer.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <nav aria-label="Leia também" className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
              <Link
                to="/midia"
                className="underline decoration-2 underline-offset-4"
                style={{ color: "var(--blue-primary)" }}
              >
                Mais notícias e entrevistas
              </Link>
              <Link
                to="/sobre"
                className="underline decoration-2 underline-offset-4"
                style={{ color: "var(--blue-primary)" }}
              >
                Biografia de Padre Kelmon
              </Link>
              <Link
                to="/contato"
                className="underline decoration-2 underline-offset-4"
                style={{ color: "var(--blue-primary)" }}
              >
                Fale com a campanha
              </Link>
            </nav>
          </PageShell>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
