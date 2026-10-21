/** Matérias públicas do Foro do Brasil — fallback quando o feed ao vivo não responde. */
export type ForoArticle = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  url: string;
  image: string;
};

export const FORO_NEWS_URL = "https://forobrasil.org/noticias/";

export const FORO_ARTICLES: ForoArticle[] = [
  {
    id: "1576",
    title: "Foro do Brasil celebra 2 anos de existência com grande evento em Salvador, BA",
    excerpt:
      "No último dia 01 de julho de 2025, o Foro do Brasil comemorou seu segundo aniversário com um grande evento realizado no Salão Nobre da Associação Atlética da Bahia, em Salvador.",
    date: "18/07/2025",
    url: "https://forobrasil.org/foro-do-brasil-celebra-2-anos-de-existencia-com-grande-evento-em-salvador-ba/",
    image: "https://forobrasil.org/wp-content/uploads/2025/07/0c409544ce1867c12076f87345c3586e_158_1751985467.webp",
  },
  {
    id: "1573",
    title:
      "O Foro do Brasil Santa Catarina repudia a perseguição política sofrida pelo Presidente Jair Bolsonaro e as restrições impostas pelo Ministro Alexandre de Moraes",
    excerpt:
      "Na manhã desta sexta-feira (18/07/2025), o Presidente Bolsonaro sofreu busca e apreensão em seus endereços, inclusive na sede do Partido Liberal, em Brasília.",
    date: "18/07/2025",
    url: "https://forobrasil.org/o-foro-do-brasil-santa-catarina-repudia-a-perseguicao-politica-sofrida-pelo-presidente-jair-bolsonaro-e-as-restricoes-impostas-pelo-ministro-alexandre-de-moraes/",
    image: "https://forobrasil.org/wp-content/uploads/2025/07/nota-sc.jpeg",
  },
  {
    id: "1569",
    title: "Foro do Brasil Jovem avança no Rio de Janeiro com nova nomeação na Capital",
    excerpt:
      "Em mais um passo importante para o fortalecimento da juventude conservadora no país, o Foro do Brasil realizou uma reunião estratégica com lideranças nacionais e estaduais.",
    date: "18/07/2025",
    url: "https://forobrasil.org/foro-do-brasil-jovem-avanca-no-rio-de-janeiro-com-nova-nomeacao-na-capital/",
    image: "https://forobrasil.org/wp-content/uploads/2025/07/foro-jovem-1-scaled.jpeg",
  },
  {
    id: "1563",
    title: "Foro do Brasil avança no Sul de Santa Catarina com executiva regional em Criciúma",
    excerpt:
      "A presidente estadual do Foro do Brasil Santa Catarina, Letícia Mattos, esteve em Criciúma nesta sexta-feira (27/06) para uma reunião com a Deputada Federal Júlia Zanatta.",
    date: "30/06/2025",
    url: "https://forobrasil.org/foro-do-brasil-avanca-no-sul-de-santa-catarina-com-executiva-regional-em-criciuma/",
    image: "https://forobrasil.org/wp-content/uploads/2025/06/sc-e1751286442527.jpeg",
  },
];
