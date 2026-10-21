import { SETE_SETEMBRO_ARTICLE } from "@/data/sete-setembro-article";

export type SiteNewsItem = {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateIso: string;
  dateModified?: string;
  source: string;
  author: string;
  href: string;
  image: string;
  imageAlt: string;
  internal: boolean;
  category: string;
  paragraphs: readonly string[];
  sourceUrl?: string;
};

export const SITE_NEWS: SiteNewsItem[] = [
  {
    slug: "7-de-setembro-paulista",
    title: SETE_SETEMBRO_ARTICLE.title,
    description: SETE_SETEMBRO_ARTICLE.lead,
    date: SETE_SETEMBRO_ARTICLE.date,
    dateIso: "2026-09-07",
    source: SETE_SETEMBRO_ARTICLE.source,
    author: "Padre Kelmon",
    href: "/imprensa/7-de-setembro",
    image: SETE_SETEMBRO_ARTICLE.image,
    imageAlt: "Padre Kelmon convoca São Paulo para o ato na Avenida Paulista no 7 de Setembro",
    internal: true,
    category: "Campanha",
    paragraphs: [],
  },
  {
    slug: "acesse-politica-camara",
    title: "Padre Kelmon tenta chegar à Câmara após os debates de 2022",
    description:
      "O portal Acesse Política registra a candidatura de Padre Kelmon a Deputado Federal por São Paulo pelo PL, após o destaque nos debates presidenciais de 2022.",
    date: "04/08/2026",
    dateIso: "2026-08-04",
    source: "Acesse Política",
    author: "Redação Padre Kelmon",
    href: "/noticias/acesse-politica-camara",
    image: "/news/acesse-politica-kelmon.webp",
    imageAlt: "Padre Kelmon em registro publicado pelo portal Acesse Política",
    internal: true,
    category: "Imprensa",
    sourceUrl:
      "https://acessepolitica.com.br/noticia/179453/baiano-padre-kelmon-tenta-chegar-a-camara-dos-deputados-apos-destaque-nos-debates-de-2022",
    paragraphs: [
      "Padre Kelmon, baiano, disputa o cargo de Deputado Federal por São Paulo pelo Partido Liberal após ter marcado os debates da eleição presidencial de 2022.",
      "Esta página resume o registro jornalístico com informações já publicadas pela campanha. O texto integral permanece no veículo original.",
    ],
  },
  {
    slug: "ndmais-debates-2022",
    title: "ND Mais inclui Padre Kelmon na memória eleitoral de 2022",
    description:
      "A reportagem do ND Mais relembra candidatos que marcaram eleições no Brasil e cita Padre Kelmon pelos debates de 2022 e pelos 81.129 votos.",
    date: "16/08/2026",
    dateIso: "2026-08-16",
    source: "ND Mais",
    author: "Redação Padre Kelmon",
    href: "/noticias/ndmais-debates-2022",
    image: "/news/ndmais-candidatos.jpg",
    imageAlt: "Registro da matéria do ND Mais sobre candidatos que marcaram eleições no Brasil",
    internal: true,
    category: "Imprensa",
    sourceUrl: "https://ndmais.com.br/politica/candidatos-curiosos-que-marcaram-eleicoes-no-brasil/",
    paragraphs: [
      "O portal ND Mais publicou uma retrospectiva de candidatos que chamaram atenção em eleições brasileiras. Padre Kelmon aparece na lista pela participação nos debates de 2022 e pelos 81.129 votos obtidos na disputa presidencial.",
      "O site oficial não reproduz a matéria. O contexto abaixo usa apenas fatos já publicados pela campanha e o link da fonte.",
    ],
  },
  {
    slug: "7minutos-liderancas-cristas",
    title: "Padre Kelmon reúne lideranças cristãs e celebra 11 anos de sacerdócio",
    description:
      "O 7Minutos noticiou o encontro de lideranças cristãs em apoio à pré-campanha e a celebração de 11 anos de sacerdócio de Padre Kelmon.",
    date: "08/2026",
    dateIso: "2026-08-01",
    source: "7Minutos",
    author: "Redação Padre Kelmon",
    href: "/noticias/7minutos-liderancas-cristas",
    image: "/news/7minutos-liderancas.webp",
    imageAlt: "Padre Kelmon em encontro com lideranças cristãs registrado pelo 7Minutos",
    internal: true,
    category: "Imprensa",
    sourceUrl:
      "https://7minutos.com.br/noticias/padre-kelmon-reune-liderancas-cristas-em-apoio-a-pre-campanha-de-flavio-bolsonaro-e-celebra-11-anos-de-sacerdocio/",
    paragraphs: [
      "O 7Minutos registrou um encontro de lideranças cristãs ligado à pré-campanha e à celebração de 11 anos de sacerdócio de Padre Kelmon.",
      "A campanha republica aqui apenas o contexto público do fato e o endereço da matéria original, sem copiar o texto do veículo.",
    ],
  },
];

export function getNewsBySlug(slug: string) {
  return SITE_NEWS.find((item) => item.slug === slug && item.href === `/noticias/${item.slug}`);
}

export function getRelatedNews(slug: string, limit = 3) {
  return SITE_NEWS.filter((item) => item.slug !== slug).slice(0, limit);
}
