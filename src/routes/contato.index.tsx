import { createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { PageShell } from "@/components/landing/primitives";
import { CANDIDATE } from "@/lib/campaign-data";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/contato/")({
  component: ContatoPage,
  head: () => buildPageHead(PAGE_SEO.contato),
});

const OFFICIAL_CHANNELS = [
  { label: "Instagram", href: CANDIDATE.instagram },
  { label: "Facebook", href: CANDIDATE.facebook },
  { label: "YouTube", href: CANDIDATE.youtube },
  { label: "X", href: CANDIDATE.x },
  { label: "TikTok", href: CANDIDATE.tiktok },
] as const;

function ContatoPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.contato.breadcrumbs}>
      <section
        id="contato"
        className="section-pad bg-white"
        aria-labelledby="contato-heading"
      >
        <PageShell className="max-w-3xl">
          <p
            className="mb-3 text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--yellow-primary)" }}
          >
            Contato
          </p>
          <h1
            id="contato-heading"
            className="text-[1.75rem] font-black sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
          >
            Fale com Padre Kelmon
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-700 sm:text-base">
            Use o formulário desta página para apoiar a campanha ou receber novidades.
            Os canais abaixo são os perfis oficiais de Padre Kelmon. Não há telefone
            ou endereço físico publicado neste site.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {OFFICIAL_CHANNELS.map((channel) => (
              <li key={channel.href}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-blue-600 hover:text-white"
                  style={{
                    borderColor: "var(--blue-primary)",
                    color: "var(--blue-primary)",
                  }}
                >
                  {channel.label}
                </a>
              </li>
            ))}
          </ul>
        </PageShell>
      </section>
    </InnerPage>
  );
}
