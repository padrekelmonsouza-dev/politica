import { Link, createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { PageHeading } from "@/components/landing/page-heading";
import { PageShell } from "@/components/landing/primitives";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/contato/sucesso")({
  component: ContatoSucessoPage,
  head: () => buildPageHead(PAGE_SEO.contatoSucesso),
});

function ContatoSucessoPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.contatoSucesso.breadcrumbs}>
      <section className="section-pad bg-white">
        <PageHeading kicker="Mensagem enviada" title="Obrigado pelo contato">
          <p>
            Seu cadastro foi enviado à campanha. Em breve a equipe poderá retornar pelos
            dados informados.
          </p>
        </PageHeading>
        <PageShell className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex rounded-md px-4 py-2 text-sm font-bold text-white"
            style={{ backgroundColor: "var(--blue-primary)" }}
          >
            Voltar ao início
          </Link>
          <Link
            to="/noticias"
            className="inline-flex rounded-md border-2 px-4 py-2 text-sm font-bold"
            style={{ borderColor: "var(--blue-primary)", color: "var(--blue-primary)" }}
          >
            Ver notícias
          </Link>
        </PageShell>
      </section>
    </InnerPage>
  );
}
