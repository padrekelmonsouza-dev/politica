/** Matérias sobre Padre Kelmon no portal 7Minutos (fonte pública). */
import { SETE_SETEMBRO_ARTICLE } from "./sete-setembro-article";

export type PressArticle = {
  id: string;
  title: string;
  eyebrow: string;
  url: string;
  image: string;
  source: string;
  objectPosition?: string;
};

export const FEATURED_PRESS_ARTICLE: PressArticle = {
  id: SETE_SETEMBRO_ARTICLE.id,
  title: SETE_SETEMBRO_ARTICLE.title,
  eyebrow: SETE_SETEMBRO_ARTICLE.eyebrow,
  url: SETE_SETEMBRO_ARTICLE.url,
  image: SETE_SETEMBRO_ARTICLE.image,
  source: SETE_SETEMBRO_ARTICLE.source,
  objectPosition: SETE_SETEMBRO_ARTICLE.imagePosition,
};

export const PRESS_ARTICLES: PressArticle[] = [
  FEATURED_PRESS_ARTICLE,
  {
    id: "195774",
    title: "PADRE KELMON se REVOLTA após DESTRUIÇÃO de MATERIAL de CAMPANHA em SÃO PAULO",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/padre-kelmon-se-revolta-apos-destruicao-de-material-de-campanha-em-sao-paulo/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/09/stf-x-morcaro-3-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "195735",
    title: "PADRE KELMON eleva o TOM contra o PT em SÃO PAULO e quer levar o DEBATE ÀS URNAS",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/padre-kelmon-eleva-o-tom-contra-o-pt-em-sao-paulo-e-quer-levar-o-debate-as-urnas/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/08/pd-kelmo-sem-pt-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "195644",
    title: "PADRE KELMON se REVOLTA com FALAS de LULA na GLOBO e faz um ALERTA aos ELEITORES:",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/padre-kelmon-se-revolta-com-falas-de-lula-na-globo-e-faz-um-alerta-aos-eleitores/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/08/LULA-MEnte-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "195636",
    title: "PADRE KELMON leva DISCURSO de “SERVIR” À CAMPANHA",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/padre-kelmon-leva-discurso-de-servir-a-campanha/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/08/Kelmon-Fe-Familia-e-Servico-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "195570",
    title:
      "PADRE KELMON inicia caminhada por São Paulo e aposta na fé, no trabalhador e na força das famílias",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/padre-kelmon-inicia-caminhada-por-sao-paulo-e-aposta-na-fe-no-trabalhador-e-na-forca-das-familias/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/08/Pedro-Cannedo-2-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "195492",
    title: "PADRE KELMON lança CAMPANHA em SÃO PAULO com FÉ, CORAGEM E COMPROMISSO com o BRASIL",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/padre-kelmon-lanca-campanha-em-sao-paulo-com-fe-coragem-e-compromisso-com-o-brasil/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/08/kelmon-lancamento-1-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "195383",
    title:
      "O DIA em que PADRE KELMON enfrentou LULA DIANTE DO BRASIL, e agora VOLTA ÀS URNAS com o 2202",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/o-dia-em-que-padre-kelmon-enfrentou-lula-diante-do-brasil-e-agora-volta-as-urnas-com-o-2202/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/08/padr-kelmon-x-Lula-1-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "195349",
    title: "PADRE KELMON reage a HUGO MOTTA e COBRA EXPLICAÇÕES após APOIO a LULA",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/padre-kelmon-reage-a-hugo-motta-e-cobra-explicacoes-apos-apoio-a-lula/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/08/Kelmon-x-Hugo-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "195036",
    title:
      "Padre Kelmon reúne lideranças cristãs em apoio à pré-campanha de Flávio Bolsonaro e celebra 11 anos de sacerdócio",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/padre-kelmon-reune-liderancas-cristas-em-apoio-a-pre-campanha-de-flavio-bolsonaro-e-celebra-11-anos-de-sacerdocio/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/08/aliancas-Kelmon-2-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "194883",
    title: "Padre Kelmon critica declarações de Lula e defende mudança de rumo nas eleições de 2026",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/padre-kelmon-critica-declaracoes-de-lula-e-defende-mudanca-de-rumo-nas-eleicoes-de-2026/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/07/Ppadre-Kelmon-1-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "194778",
    title:
      "Padre Kelmon confirma pré candidatura à Câmara Federal e agora recebe reconhecimento nacional com o Prêmio Notável",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/padre-kelmon-confirma-pre-candidatura-a-camara-federal-e-agora-recebe-reconhecimento-nacional-com-o-premio-notavel/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/07/premi-Kelmon-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "191601",
    title: "PADRE KELMON CONFIRMA CANDIDATURA E ENTRA DE VEZ NA DISPUTA DE 2026",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/padre-kelmon-confirma-candidatura-e-entra-de-vez-na-disputa-de-2026/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/03/pADRE-KELMON-ELEICAO-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "190720",
    title:
      "Padre Kelmon uma importante liderança do clero ortodoxo em Lima e reforça oração pelo Brasil",
    eyebrow: "Comportamento",
    url: "https://7minutos.com.br/estilo/padre-kelmon-uma-importante-lideranca-do-clero-ortodoxo-em-lima-e-reforca-oracao-pelo-brasil/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/02/Projeto-kelmon-1-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "190563",
    title: "PADRE KELMON E A HOMILIA QUE ECOOU DIANTE DO CONSULADO AMERICANO:",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/padre-kelmon-e-a-homilia-que-ecoou-diante-do-consulado-americano/",
    image: "https://7minutos.com.br/wp-content/uploads/2026/02/Novo-Projeto-4-768x512.webp",
    source: "7Minutos",
  },
  {
    id: "189025",
    title: "A caminhada de PADRE KELMON na PAULISTA mostra a FORÇA DE UM POVO INDOMÁVEL",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/a-caminhada-de-padre-kelmon-na-paulista-mostra-a-forca-de-um-povo-indomavel/",
    image: "https://7minutos.com.br/wp-content/uploads/2025/12/Padre-Kelmon-5ddeff-768x512.jpg",
    source: "7Minutos",
  },
  {
    id: "188394",
    title: "Padre Kelmon desponta como nome forte do PL",
    eyebrow: "Política",
    url: "https://7minutos.com.br/noticias/padre-kelmon-desponta-como-nome-forte-do-pl/",
    image: "https://7minutos.com.br/wp-content/uploads/2025/11/Padre-Kelmon-e-PL22defff-768x512.jpg",
    source: "7Minutos",
  },
];

export const PRESS_SOURCE_URL = "https://7minutos.com.br/?s=Padre+Kelmon";
