import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { ClusterLinks } from "@/components/landing/cluster-links";
import { InnerPage } from "@/components/landing/inner-page";
import { PageShell } from "@/components/landing/primitives";
import { getNewsBySlug, getRelatedNews } from "@/data/site-news";
import { absoluteUrl, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/noticias/$slug")({
  loader: ({ params }) => {
    const article = getNewsBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.article) {
      return { meta: [{ name: "robots", content: "noindex, follow" }] };
    }
    const article = loaderData.article;
    return buildPageHead({
      path: article.href,
      title: `${article.title} | Padre Kelmon`,
      description: article.description,
      image: article.image,
      schema: "article",
      datePublished: article.dateIso,
      dateModified: article.dateModified ?? article.dateIso,
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "Notícias", path: "/noticias" },
        { name: article.title, path: article.href },
      ],
    });
  },
  component: NoticiaPage,
});

function NoticiaPage() {
  const { article } = Route.useLoaderData();
  const related = getRelatedNews(article.slug);
  const shareUrl = absoluteUrl(article.href);
  const shareText = encodeURIComponent(`${article.title} ${shareUrl}`);

  return (
    <InnerPage
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Notícias", path: "/noticias" },
        { name: article.title, path: article.href },
      ]}
    >
      <article className="section-pad bg-white">
        <PageShell className="max-w-3xl">
          <p
            className="text-xs font-bold uppercase tracking-[0.22em]"
            style={{ color: "var(--yellow-primary)" }}
          >
            {article.category}
          </p>
          <h1
            className="mt-3 text-[1.65rem] font-black leading-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
          >
            {article.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-gray-700">{article.description}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <time dateTime={article.dateIso}>{article.date}</time>
            {article.dateModified ? (
              <>
                {" "}
                · Atualizado em <time dateTime={article.dateModified}>{article.dateModified}</time>
              </>
            ) : null}
            {" · "}
            {article.author}
          </p>

          <img
            src={article.image}
            alt={article.imageAlt}
            width={1200}
            height={675}
            className="mt-6 w-full rounded-2xl object-cover"
          />

          <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-700">
            {article.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {article.sourceUrl ? (
            <p className="mt-6 text-sm text-gray-600">
              Fonte: {article.source}.{" "}
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-4"
                style={{ color: "var(--blue-primary)" }}
              >
                Leia a matéria original
              </a>
              .
            </p>
          ) : null}

          <p className="mt-6 text-sm text-gray-600">
            Compartilhar:{" "}
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-4"
              style={{ color: "var(--blue-primary)" }}
            >
              WhatsApp
            </a>
            {" · "}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-4"
              style={{ color: "var(--blue-primary)" }}
            >
              X
            </a>
            {" · "}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-4"
              style={{ color: "var(--blue-primary)" }}
            >
              Facebook
            </a>
          </p>

          <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
            <Link to="/noticias" className="underline decoration-2 underline-offset-4" style={{ color: "var(--blue-primary)" }}>
              Todas as notícias
            </Link>
            <Link to="/sobre" className="underline decoration-2 underline-offset-4" style={{ color: "var(--blue-primary)" }}>
              Biografia de Padre Kelmon
            </Link>
            <Link to="/pautas" className="underline decoration-2 underline-offset-4" style={{ color: "var(--blue-primary)" }}>
              Pautas defendidas
            </Link>
            <Link to="/midia" className="underline decoration-2 underline-offset-4" style={{ color: "var(--blue-primary)" }}>
              Padre Kelmon na mídia
            </Link>
          </nav>

          {related.length ? (
            <div className="mt-10">
              <h2
                className="text-lg font-black"
                style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
              >
                Outras notícias
              </h2>
              <ul className="mt-3 space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={item.href}
                      className="text-sm font-semibold underline underline-offset-4"
                      style={{ color: "var(--blue-primary)" }}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </PageShell>
      </article>
      <ClusterLinks current="/noticias" />
    </InnerPage>
  );
}
