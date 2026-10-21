import { Link, createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { PageHeading } from "@/components/landing/page-heading";
import { PageShell } from "@/components/landing/primitives";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/conteudos")({
  component: ConteudosPage,
  head: () => buildPageHead(PAGE_SEO.conteudos),
});

const ITEMS = [
  {
    to: "/saiba-mais",
    title: "Vida, missão e projetos",
    description:
      "A mobilização pró-vida de 2010, apresentada com as informações já publicadas pela campanha.",
  },
  {
    to: "/pautas",
    title: "Pautas e atuação pública",
    description:
      "As bandeiras defendidas por Padre Kelmon no debate público, a partir de posicionamentos noticiados.",
  },
  {
    to: "/numeros",
    title: "Números e indicadores",
    description:
      "Votos de 2022 e demais indicadores públicos usados neste site, com fonte quando disponível.",
  },
  {
    to: "/noticias",
    title: "Notícias da campanha",
    description:
      "Artigo próprio e matérias de imprensa sobre Padre Kelmon.",
  },
] as const;

function ConteudosPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.conteudos.breadcrumbs}>
      <section className="section-pad bg-white">
        <PageHeading kicker="Editorial" title="Conteúdos">
          <p>
            Área para textos e materiais editoriais que não são necessariamente notícia do
            dia. Nada aqui foi gerado só para ocupar palavra-chave. O livro{" "}
            <em>Fé e Política de Mãos Dadas</em>, lançado em 2024, também faz parte dessa
            trajetória pública.
          </p>
        </PageHeading>

        <PageShell className="mt-10 grid gap-4 md:grid-cols-2">
          {ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-2xl border border-border/70 p-5 transition-shadow hover:shadow-md"
            >
              <h2
                className="text-lg font-black"
                style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
              >
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.description}</p>
            </Link>
          ))}
        </PageShell>
      </section>
    </InnerPage>
  );
}
