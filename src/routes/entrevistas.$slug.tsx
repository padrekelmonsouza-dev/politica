import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { PageShell } from "@/components/landing/primitives";
import { getInterviewBySlug } from "@/data/site-interviews";
import { buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/entrevistas/$slug")({
  loader: ({ params }) => {
    const interview = getInterviewBySlug(params.slug);
    if (!interview) throw notFound();
    return { interview };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.interview) {
      return { meta: [{ name: "robots", content: "noindex, follow" }] };
    }
    const interview = loaderData.interview;
    return buildPageHead({
      path: `/entrevistas/${interview.slug}`,
      title: `${interview.title} | Padre Kelmon`,
      description: interview.description,
      image: `https://i.ytimg.com/vi/${interview.videoId}/hqdefault.jpg`,
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "Entrevistas", path: "/entrevistas" },
        { name: interview.title, path: `/entrevistas/${interview.slug}` },
      ],
      video: {
        name: interview.title,
        description: interview.description,
        thumbnailUrl: `https://i.ytimg.com/vi/${interview.videoId}/hqdefault.jpg`,
        uploadDate: interview.dateIso,
        contentUrl: interview.url,
        embedUrl: `https://www.youtube-nocookie.com/embed/${interview.videoId}`,
      },
    });
  },
  component: EntrevistaPage,
});

function EntrevistaPage() {
  const { interview } = Route.useLoaderData();

  return (
    <InnerPage
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Entrevistas", path: "/entrevistas" },
        { name: interview.title, path: `/entrevistas/${interview.slug}` },
      ]}
    >
      <article className="section-pad bg-white">
        <PageShell className="max-w-3xl">
          <p
            className="text-xs font-bold uppercase tracking-[0.22em]"
            style={{ color: "var(--yellow-primary)" }}
          >
            {interview.program}
          </p>
          <h1
            className="mt-3 text-[1.65rem] font-black leading-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
          >
            {interview.title}
          </h1>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <time dateTime={interview.dateIso}>{interview.date}</time> · {interview.program}
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-700">{interview.description}</p>

          <div className="mt-6 aspect-video overflow-hidden rounded-2xl border-2 border-gray-200 bg-black shadow-lg">
            <iframe
              title={interview.title}
              src={`https://www.youtube-nocookie.com/embed/${interview.videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Vídeo original no{" "}
            <a
              href={interview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-4"
              style={{ color: "var(--blue-primary)" }}
            >
              YouTube
            </a>
            .
          </p>

          <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
            <Link to="/entrevistas" className="underline decoration-2 underline-offset-4" style={{ color: "var(--blue-primary)" }}>
              Todas as entrevistas
            </Link>
            <Link to="/sobre" className="underline decoration-2 underline-offset-4" style={{ color: "var(--blue-primary)" }}>
              Biografia de Padre Kelmon
            </Link>
            <Link to="/noticias" className="underline decoration-2 underline-offset-4" style={{ color: "var(--blue-primary)" }}>
              Notícias da campanha
            </Link>
          </nav>
        </PageShell>
      </article>
    </InnerPage>
  );
}
