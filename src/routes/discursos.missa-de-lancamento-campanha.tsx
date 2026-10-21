import { Link, createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { PageShell } from "@/components/landing/primitives";
import { SITE_SPEECHES } from "@/data/site-speeches";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

const speech = SITE_SPEECHES[0];

export const Route = createFileRoute("/discursos/missa-de-lancamento-campanha")({
  component: MissaPage,
  head: () =>
    buildPageHead({
      ...PAGE_SEO.discursosMissa,
      video: {
        name: speech.title,
        description: speech.description,
        thumbnailUrl: `https://i.ytimg.com/vi/${speech.videoId}/hqdefault.jpg`,
        uploadDate: speech.dateIso,
        contentUrl: speech.url,
        embedUrl: `https://www.youtube-nocookie.com/embed/${speech.videoId}`,
      },
    }),
});

function MissaPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.discursosMissa.breadcrumbs}>
      <article className="section-pad bg-white">
        <PageShell className="max-w-3xl">
          <p
            className="text-xs font-bold uppercase tracking-[0.22em]"
            style={{ color: "var(--yellow-primary)" }}
          >
            Fala oficial
          </p>
          <h1
            className="mt-3 text-[1.65rem] font-black leading-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
          >
            {speech.title}
          </h1>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <time dateTime={speech.dateIso}>{speech.date}</time>
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-700">
            A campanha disponibilizou no YouTube a transmissão da missa de lançamento da
            candidatura de Padre Kelmon a Deputado Federal por São Paulo. Esta página
            contextualiza o registro oficial e incorpora o vídeo original, sem reproduzir
            integralmente o conteúdo de terceiros.
          </p>

          <div className="mt-6 aspect-video overflow-hidden rounded-2xl border-2 border-gray-200 bg-black shadow-lg">
            <iframe
              title={speech.title}
              src={`https://www.youtube-nocookie.com/embed/${speech.videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Fonte:{" "}
            <a
              href={speech.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-4"
              style={{ color: "var(--blue-primary)" }}
            >
              YouTube oficial
            </a>
            .
          </p>

          <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
            <Link to="/discursos" className="underline decoration-2 underline-offset-4" style={{ color: "var(--blue-primary)" }}>
              Todos os discursos
            </Link>
            <Link to="/sobre" className="underline decoration-2 underline-offset-4" style={{ color: "var(--blue-primary)" }}>
              Biografia de Padre Kelmon
            </Link>
            <Link to="/agenda" className="underline decoration-2 underline-offset-4" style={{ color: "var(--blue-primary)" }}>
              Agenda
            </Link>
          </nav>
        </PageShell>
      </article>
    </InnerPage>
  );
}
