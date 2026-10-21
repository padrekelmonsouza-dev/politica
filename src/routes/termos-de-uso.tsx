import { Link, createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { PageHeading, SectionTitle } from "@/components/landing/page-heading";
import { PageShell } from "@/components/landing/primitives";
import { CANDIDATE } from "@/lib/campaign-data";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/termos-de-uso")({
  component: TermosPage,
  head: () => buildPageHead(PAGE_SEO.termosDeUso),
});

function TermosPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.termosDeUso.breadcrumbs}>
      <section className="section-pad bg-white">
        <PageHeading kicker="Uso do site" title="Termos de Uso">
          <p>
            Ao navegar em padrekelmon.com.br, você concorda com estas condições. Esta página
            é institucional e não é usada para ranquear palavras-chave.
          </p>
        </PageHeading>

        <PageShell className="mt-10 max-w-3xl space-y-8 text-sm leading-relaxed text-gray-700 sm:text-base">
          <div>
            <SectionTitle>Objeto</SectionTitle>
            <p className="mt-3">
              O site apresenta informações da campanha de {CANDIDATE.name} a Deputado Federal
              por São Paulo e oferece um formulário de contato. O conteúdo político é de
              divulgação de campanha.
            </p>
          </div>
          <div>
            <SectionTitle>Uso permitido</SectionTitle>
            <p className="mt-3">
              É permitido acessar, ler e compartilhar links das páginas públicas. Não é
              permitido copiar o site para fingir ser o canal oficial, sobrecarregar o
              servidor ou enviar dados falsos no formulário.
            </p>
          </div>
          <div>
            <SectionTitle>Conteúdo de terceiros</SectionTitle>
            <p className="mt-3">
              Matérias de imprensa e vídeos do YouTube permanecem de seus titulares. Aqui
              publicamos links, embeds e contexto próprio, sem reproduzir obras alheias por
              completo.
            </p>
          </div>
          <div>
            <SectionTitle>Privacidade</SectionTitle>
            <p className="mt-3">
              O tratamento de dados pessoais segue a{" "}
              <Link to="/politica-de-privacidade" className="font-semibold underline underline-offset-4" style={{ color: "var(--blue-primary)" }}>
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
          <div>
            <SectionTitle>Contato</SectionTitle>
            <p className="mt-3">
              Dúvidas sobre estes termos podem ser enviadas pela página de{" "}
              <Link to="/contato" className="font-semibold underline underline-offset-4" style={{ color: "var(--blue-primary)" }}>
                contato
              </Link>
              .
            </p>
          </div>
        </PageShell>
      </section>
    </InnerPage>
  );
}
