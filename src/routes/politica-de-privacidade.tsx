import { Link, createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { PageHeading, SectionTitle } from "@/components/landing/page-heading";
import { PageShell } from "@/components/landing/primitives";
import { CANDIDATE } from "@/lib/campaign-data";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/politica-de-privacidade")({
  component: PoliticaPrivacidadePage,
  head: () => buildPageHead(PAGE_SEO.politicaPrivacidade),
});

function PoliticaPrivacidadePage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.politicaPrivacidade.breadcrumbs}>
      <section className="section-pad bg-white">
        <PageHeading kicker="LGPD" title="Política de Privacidade">
          <p>
            Esta página explica como o site padrekelmon.com.br trata dados pessoais. Não é
            uma página de captação de busca. Controlador: {CANDIDATE.razaoSocial}, CNPJ{" "}
            {CANDIDATE.cnpj}.
          </p>
        </PageHeading>

        <PageShell className="mt-10 max-w-3xl space-y-8 text-sm leading-relaxed text-gray-700 sm:text-base">
          <div>
            <SectionTitle>Quais dados coletamos</SectionTitle>
            <p className="mt-3">
              O formulário de contato/cadastro pede nome, telefone, e-mail, cidade, estado e
              se a pessoa deseja atuar como voluntária ou receber novidades. Não pedimos
              CPF, endereço residencial nem documentos neste site.
            </p>
          </div>
          <div>
            <SectionTitle>Para que usamos</SectionTitle>
            <p className="mt-3">
              Os dados servem à comunicação da campanha: retorno de contato, convites e
              avisos de agenda. Base legal: consentimento (art. 7º, I, da Lei nº 13.709/2018)
              e, quando aplicável, execução de atividades de campanha eleitoral.
            </p>
          </div>
          <div>
            <SectionTitle>Como o envio é feito</SectionTitle>
            <p className="mt-3">
              O formulário é processado no servidor do site e encaminhado ao e-mail da
              campanha. Não vendemos listas e não usamos os dados para publicidade de
              terceiros.
            </p>
          </div>
          <div>
            <SectionTitle>Cookies e armazenamento local</SectionTitle>
            <p className="mt-3">
              O site usa um aviso de cookies e guarda no navegador apenas a preferência de
              fechamento desse aviso. Não há, neste momento, ferramentas de analytics,
              publicidade ou pixels de terceiros instalados pelo site. Detalhes em{" "}
              <Link to="/politica-de-cookies" className="font-semibold underline underline-offset-4" style={{ color: "var(--blue-primary)" }}>
                Política de Cookies
              </Link>
              .
            </p>
          </div>
          <div>
            <SectionTitle>Seus direitos</SectionTitle>
            <p className="mt-3">
              Você pode pedir confirmação de tratamento, acesso, correção ou exclusão dos
              dados enviados pelo formulário de{" "}
              <Link to="/contato" className="font-semibold underline underline-offset-4" style={{ color: "var(--blue-primary)" }}>
                contato
              </Link>
              , identificando-se e descrevendo o pedido.
            </p>
          </div>
          <div>
            <SectionTitle>Atualização</SectionTitle>
            <p className="mt-3">
              Esta política pode ser atualizada se a campanha passar a usar novas
              ferramentas. A versão vigente é a publicada nesta URL.
            </p>
          </div>
        </PageShell>
      </section>
    </InnerPage>
  );
}
