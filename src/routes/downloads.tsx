import { createFileRoute } from "@tanstack/react-router";

import { ClusterLinks } from "@/components/landing/cluster-links";
import { InnerPage } from "@/components/landing/inner-page";
import { PageHeading } from "@/components/landing/page-heading";
import { PageShell } from "@/components/landing/primitives";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/downloads")({
  component: DownloadsPage,
  head: () => buildPageHead(PAGE_SEO.downloads),
});

const MATERIALS = [
  {
    href: "/Logo-Site-Padre-kelmon-campanha.png",
    title: "Logotipo oficial da campanha",
    description: "Marca Padre Kelmon 2202 usada no site oficial.",
  },
  {
    href: "/qr-padre-kelmon-links.png",
    title: "QR Code dos links oficiais",
    description: "QR para a página de redes oficiais da campanha.",
  },
  {
    href: "/og-banner-previa-kelmon.jpg",
    title: "Imagem de compartilhamento",
    description: "Arte 1200×630 usada nas prévias sociais do site.",
  },
] as const;

function DownloadsPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.downloads.breadcrumbs}>
      <section className="section-pad bg-white">
        <PageHeading kicker="Campanha 2202" title="Downloads">
          <p>
            Materiais oficiais já publicados no site. Use para divulgação da campanha de
            Padre Kelmon a Deputado Federal por São Paulo.
          </p>
        </PageHeading>

        <PageShell className="mt-10 grid gap-4 md:grid-cols-2">
          {MATERIALS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              download
              className="rounded-2xl border border-border/70 p-5 transition-shadow hover:shadow-md"
            >
              <h2
                className="text-lg font-black"
                style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
              >
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.description}</p>
              <p
                className="mt-3 text-xs font-bold uppercase tracking-wide"
                style={{ color: "var(--blue-primary)" }}
              >
                Baixar arquivo
              </p>
            </a>
          ))}
        </PageShell>
      </section>
      <ClusterLinks current="/downloads" />
    </InnerPage>
  );
}
