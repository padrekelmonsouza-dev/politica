import { Link, createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { PageHeading, SectionTitle } from "@/components/landing/page-heading";
import { PageShell } from "@/components/landing/primitives";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/politica-de-cookies")({
  component: PoliticaCookiesPage,
  head: () => buildPageHead(PAGE_SEO.politicaCookies),
});

function PoliticaCookiesPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.politicaCookies.breadcrumbs}>
      <section className="section-pad bg-white">
        <PageHeading kicker="Aviso" title="Política de Cookies">
          <p>
            O site exibe um aviso de cookies. Esta página descreve o que realmente é usado
            hoje, sem inventar ferramentas de publicidade ou analytics.
          </p>
        </PageHeading>

        <PageShell className="mt-10 max-w-3xl space-y-8 text-sm leading-relaxed text-gray-700 sm:text-base">
          <div>
            <SectionTitle>O que é usado</SectionTitle>
            <p className="mt-3">
              Ao fechar o aviso, o navegador guarda a chave <code>kelmon-cookie-banner-dismissed</code>{" "}
              em armazenamento local. Isso evita repetir o aviso na mesma sessão/aparelho.
              Não é um cookie de rastreamento de anúncios.
            </p>
          </div>
          <div>
            <SectionTitle>O que não é usado</SectionTitle>
            <p className="mt-3">
              Neste momento o site não instala Google Analytics, pixels de anúncio, Hotjar
              ou redes de remarketing. Se isso mudar, esta página será atualizada.
            </p>
          </div>
          <div>
            <SectionTitle>Vídeos do YouTube</SectionTitle>
            <p className="mt-3">
              Páginas de entrevistas e discursos podem incorporar o player do YouTube. O
              YouTube pode definir cookies próprios quando o vídeo é reproduzido. Usamos
              o domínio youtube-nocookie.com no embed para reduzir cookies de terceiros
              antes da reprodução.
            </p>
          </div>
          <div>
            <SectionTitle>Mais informações</SectionTitle>
            <p className="mt-3">
              O tratamento de dados pessoais está na{" "}
              <Link to="/politica-de-privacidade" className="font-semibold underline underline-offset-4" style={{ color: "var(--blue-primary)" }}>
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </PageShell>
      </section>
    </InnerPage>
  );
}
