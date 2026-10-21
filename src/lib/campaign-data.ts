import {
  Heart,
  Church,
  Shield,
  Flag,
  TrendingUp,
  ShieldCheck,
  Scale,
  Users,
  Landmark,
  type LucideIcon,
} from "lucide-react";

import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import heroPortrait from "@/assets/hero-portrait.webp";

export const CANDIDATE = {
  name: "Padre Kelmon",
  fullName: "Kelmon Luís da Silva Souza",
  role: "Candidato a Deputado Federal por São Paulo",
  party: "PL",
  instagram: "https://www.instagram.com/pekelmon/",
  facebook: "https://www.facebook.com/PadreKelmon",
  youtube: "https://www.youtube.com/@PadreKelmonBr",
  x: "https://x.com/PeKelmon",
  tiktok: "https://www.tiktok.com/@pekelmon",
  razaoSocial: "ELEICAO 2026 KELMON LUIS DA SILVA SOUZA DEPUTADO FEDERAL",
  cnpj: "68.353.198/0001-20",
  legalLine:
    "ELEICAO 2026 KELMON LUIS DA SILVA SOUZA DEPUTADO FEDERAL · CNPJ: 68.353.198/0001-20 COLIGAÇÃO CORAGEM PARA SEGUIR AVANÇANDO (Republicanos + MDB + PL + Federação União Progressista (União Brasil / Progressistas) + PSD + Federação Renovação Solidária (Solidariedade / PRD) + Democrata + Avante)",
};

export type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

/** Fontes: Foro Brasil (biografia oficial), Wikipédia, veículos de imprensa. Informações condensadas para divulgação política. */
export const TIMELINE: TimelineItem[] = [
  {
    year: "1976",
    title: "Nascimento em Salvador, Bahia",
    description:
      "Nasce em 21 de outubro de 1976, às 14h45, em Salvador, Bahia. Primogênito de Risoldete da Silva Souza e José Gomes de Souza. Cresce com mais três irmãos em uma família católica tradicional.",
  },
  {
    year: "1977-1995",
    title: "Formação católica e liderança juvenil",
    description:
      "Batizado em 25 de dezembro de 1977, recebe a Primeira Eucaristia aos 10 anos (1986) e a Crisma aos 19 anos (1995). Aos 20, passa a servir ativamente na Legião de Maria, Pastoral da Criança e Escola da Fé da Comunidade de Taizé. É cofundador do grupo JUSPE (Jovens Unidos Semeando Paz e Esperança).",
  },
  {
    year: "1996",
    title: "Convento dos Capuchinhos",
    description:
      "Vive no convento dos Frades Capuchinhos em Maceió, onde estabelece vínculo com o frei Severino Batista França (hoje bispo emérito no Recife) e aprofunda seu chamado ao sacerdócio.",
  },
  {
    year: "2000-2003",
    title: "Seminário e formação acadêmica",
    description:
      "Em 23 de fevereiro de 2000, inicia formação seminarista em São Paulo com os Legionários de Cristo. Torna-se membro fundador do Seminário Maria Mater Ecclesiae do Brasil, cursando Filosofia, Teologia e Pedagogia. Conhece a tradição católica oriental melquita.",
  },
  {
    year: "2010",
    title: "Mobilização pró-vida",
    description:
      "Coordena a distribuição nacional do documento “Apelo a Todos os Brasileiros e Brasileiras”, da Comissão em Defesa da Vida do Regional Sul 1 da CNBB, durante as eleições presidenciais. Episódio que relembrou em entrevista à VV8.",
  },
  {
    year: "2014-2015",
    title: "Ordenação sacerdotal",
    description:
      "Funda a associação missionária Theotokos. Em 2014, é ordenado diácono pela Igreja Ortodoxa Sirian de Antioquia. Em 2 de agosto de 2015, é ordenado sacerdote na Igreja Ortodoxa da América por Dom Ioannes de Santa Catarina.",
  },
  {
    year: "2017",
    title: "Missão humanitária em Roraima",
    description:
      "Viaja a Roraima para testemunhar e auxiliar refugiados venezuelanos na crise humanitária. A experiência reforçou sua oposição aos regimes socialistas na América Latina.",
  },
  {
    year: "2019-2021",
    title: "Fundação do Movimento Cristão Conservador",
    description:
      "Conhece Roberto Jefferson, que o convida para colaborar com o PTB. A pedido de Jefferson, funda o Movimento Cristão Conservador (MCC), tornando-se seu primeiro presidente nacional.",
  },
  {
    year: "2022",
    title: "Candidatura presidencial pelo PTB",
    description:
      "Com impedimento de Jefferson, é indicado candidato à Presidência tendo pastor Gamonal como vice. Em 19 dias de campanha, percorre quase todo o país e participa de debates nacionais (SBT e Globo). Obtém 81.129 votos.",
  },
  {
    year: "2023",
    title: "Fundação do Foro do Brasil",
    description:
      "Funda o Foro do Brasil em cerimônia no Congresso Nacional (29/06/2023). O movimento reúne o pensamento conservador no país, com diretórios em diversos estados.",
  },
  {
    year: "2024",
    title: "Livro e filiação ao PL",
    description:
      "Lança 'Fé e Política de Mãos Dadas' na Livraria Drummond. Em agosto, filia-se ao Partido Liberal (PL 22), partido do ex-presidente Jair Bolsonaro.",
  },
  {
    year: "2025",
    title: "Programas na VV8 TV",
    description:
      "Estreia em 2 de junho o talk show 'Confessionário com Padre Kelmon' e 'Oração pelo Brasil' na VV8 TV (Valinhos/SP). Programas sobre fé, política e cultura.",
  },
  {
    year: "2026",
    title: "Deputado Federal por São Paulo",
    description:
      "Confirma candidatura à Câmara dos Deputados por São Paulo pelo PL. Formação em Filosofia, Teologia e Pedagogia. Mensagem: “Juntos vamos resgatar o Brasil.”",
  },
];

export type Bandeira = {
  icon: LucideIcon;
  title: string;
  badge: string;
  description: string;
};

/**
 * Pautas baseadas em posicionamentos públicos amplamente noticiados.
 * Revisar e ajustar com a assessoria antes da publicação oficial.
 */
export const BANDEIRAS: Bandeira[] = [
  {
    icon: Heart,
    title: "Defesa da Família",
    badge: "Família",
    description:
      "A família é a base do Brasil. Defender o direito dos pais de educar os filhos e apoiar políticas que valorizem o casamento, a maternidade e a proteção da infância.",
  },
  {
    icon: Shield,
    title: "Defesa da Vida",
    badge: "Segurança",
    description:
      "A vida humana deve ser protegida desde a concepção até a morte natural. Combater o aborto e apoiar mães em situação de vulnerabilidade.",
  },
  {
    icon: Church,
    title: "Liberdade Religiosa",
    badge: "Livre arbítrio",
    description:
      "Ninguém pode ser perseguido por crer. Garantir o culto, proteger templos e fiéis e defender o direito de viver a fé cristã em público.",
  },
  {
    icon: Flag,
    title: "Patriotismo",
    badge: "Brasil",
    description:
      "Resgatar o amor à pátria, os símbolos nacionais e a história do Brasil. Defender a soberania e as Forças Armadas.",
  },
  {
    icon: TrendingUp,
    title: "Liberdade Econômica",
    badge: "Seu dinheiro",
    description:
      "Menos burocracia e menos peso do Estado sobre quem trabalha. Apoiar a livre iniciativa, o emprego e os pequenos e médios empresários.",
  },
  {
    icon: ShieldCheck,
    title: "Combate à Corrupção",
    badge: "Fora esquerda",
    description:
      "O dinheiro público é do cidadão. Punir desvio, exigir transparência e tratar a gestão pública com ética e honestidade.",
  },
  {
    icon: Scale,
    title: "Defesa da Constituição",
    badge: "Respeito",
    description:
      "Respeito à Constituição, à separação dos Poderes e às liberdades individuais. Sem abuso de autoridade e sem atropelar a República.",
  },
  {
    icon: Users,
    title: "Valorização da Juventude",
    badge: "Futuro",
    description:
      "Educação de verdade, primeiro emprego e proteção contra drogas e violência. Os jovens precisam de valores sólidos e de esperança.",
  },
  {
    icon: Landmark,
    title: "Foro do Brasil",
    badge: "Conservadorismo",
    description:
      "Fortalecer o Foro do Brasil, fundado em 2023 no Congresso Nacional. Unir o país em defesa da liberdade, da fé cristã e da dignidade da pessoa humana.",
  },
];

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

/**
 * PLACEHOLDER: substituir pelas fotos oficiais do acervo da campanha
 * (registros do Instagram @pekelmon, eventos, agenda e apoiadores).
 */
export const GALLERY: GalleryItem[] = [
  {
    src: gallery1,
    alt: "Multidão em ato público com bandeiras do Brasil ao entardecer",
    caption: "Ato público com bandeiras do Brasil",
    width: 1024,
    height: 1280,
  },
  {
    src: gallery2,
    alt: "Interior de igreja cristã com velas acesas e ícones dourados",
    caption: "Celebração religiosa",
    width: 1024,
    height: 768,
  },
  {
    src: heroPortrait,
    alt: "Silhueta de sacerdote discursando em um púlpito",
    caption: "Padre Kelmon",
    width: 1024,
    height: 1280,
  },
  {
    src: gallery3,
    alt: "Bandeira do Brasil tremulando contra o céu azul",
    caption: "Bandeira do Brasil",
    width: 1024,
    height: 1024,
  },
  {
    src: gallery4,
    alt: "Mãos de uma família unidas em oração sobre uma mesa de madeira",
    caption: "Família em oração",
    width: 1024,
    height: 1280,
  },
  {
    src: gallery5,
    alt: "Vista aérea da cidade de São Paulo no fim da tarde",
    caption: "São Paulo",
    width: 1280,
    height: 853,
  },
];

export type VideoItem = {
  title: string;
  description: string;
  url: string;
};

/**
 * PLACEHOLDER: inserir aqui os vídeos oficiais (YouTube/Instagram).
 * Substituir `url` pelo link de incorporação assim que a assessoria liberar.
 */
export const VIDEOS: VideoItem[] = [
  {
    title: "Anúncio da candidatura",
    description: "Pronunciamento nas redes confirmando a disputa por São Paulo.",
    url: CANDIDATE.instagram,
  },
  {
    title: "Fé, família e Brasil",
    description: "As bandeiras da campanha em vídeo.",
    url: CANDIDATE.instagram,
  },
  {
    title: "Agenda com apoiadores",
    description: "Encontros da campanha pelo estado.",
    url: CANDIDATE.instagram,
  },
];

export type StatItem = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  note: string;
};

export type TrustPillar = {
  icon: LucideIcon;
  title: string;
  description: string;
};

/** Indicadores públicos e verificáveis — foco em credibilidade e trajetória. */
export const STATS: StatItem[] = [
  {
    value: 81129,
    label: "Votos na eleição presidencial de 2022",
    note: "Alcance nacional em 19 dias de campanha. Resultado oficial do TSE.",
  },
  {
    value: 3,
    suffix: "+",
    label: "Anos liderando o Foro do Brasil",
    note: "Movimento fundado em 29/06/2023; Instituto constituído em 2025",
  },
  {
    value: 30,
    suffix: "+",
    label: "Anos de fé e serviço comunitário",
    note: "Da formação na juventude e nas missões à defesa pública da fé cristã",
  },
];

export const FORO_PRESENCE_STATES = [
  { uf: "RR", name: "Roraima" },
  { uf: "AM", name: "Amazonas" },
  { uf: "PA", name: "Pará" },
  { uf: "CE", name: "Ceará" },
  { uf: "RN", name: "Rio Grande do Norte" },
  { uf: "PB", name: "Paraíba" },
  { uf: "PE", name: "Pernambuco" },
  { uf: "BA", name: "Bahia" },
  { uf: "TO", name: "Tocantins" },
  { uf: "GO", name: "Goiás" },
  { uf: "DF", name: "Distrito Federal" },
  { uf: "MG", name: "Minas Gerais" },
  { uf: "ES", name: "Espírito Santo" },
  { uf: "RJ", name: "Rio de Janeiro" },
  { uf: "SP", name: "São Paulo" },
  { uf: "SC", name: "Santa Catarina" },
  { uf: "RS", name: "Rio Grande do Sul" },
] as const;

export const FORO_PRESENCE_UFS = new Set<string>(
  FORO_PRESENCE_STATES.map((state) => state.uf),
);

/** Pilares de confiança para o eleitor — sem controvérsias, só qualificações públicas. */
export const TRUST_PILLARS: TrustPillar[] = [
  {
    icon: Flag,
    title: "Experiência nacional",
    description:
      "Ex-candidato à Presidência da República. Debates nacionais e mensagem clara em defesa da família, da liberdade e do Brasil.",
  },
  {
    icon: Users,
    title: "Liderança do Foro do Brasil",
    description:
      "Fundador e Presidente Nacional do Foro do Brasil. Junta juventude, mulheres, indígenas e tem presença no exterior.",
  },
  {
    icon: ShieldCheck,
    title: "Candidatura pelo PL em São Paulo",
    description:
      "Candidato a Deputado Federal por São Paulo pelo Partido Liberal. Representa o povo paulista e ajuda a resgatar o Brasil.",
  },
  {
    icon: Church,
    title: "Voz cristã na vida pública",
    description:
      "Fé ortodoxa, programas de comunicação e defesa da liberdade religiosa, da vida e da dignidade da pessoa humana.",
  },
];

export const FORO_BRASIL = {
  name: "Foro do Brasil",
  url: "https://forobrasil.org/",
  newsUrl: "https://forobrasil.org/noticias/",
  aboutUrl: "https://forobrasil.org/sobre/",
  directoriesUrl: "https://forobrasil.org/diretorios/",
  contactUrl: "https://forobrasil.org/contato/",
  founded: "29 de junho de 2023",
  role: "Presidente Nacional",
  slogan: "Liberdade, Humanidade, Cristianismo e a União entre povos",
  tagline: "Pelo Brasil que acreditamos, pelos direitos que defendemos",
  description:
    "O Foro do Brasil reúne quem defende uma sociedade livre e justa. Atua pela liberdade, pela propriedade, pela livre expressão e pelos direitos do cidadão.",
  quote:
    "O Brasil precisa de uma organização política que una cidadãos comprometidos com a liberdade, a ordem e o progresso. O Foro do Brasil é esse espaço.",
  quoteAuthor: "Padre Kelmon, Presidente Nacional",
  values: [
    {
      title: "Liberdade",
      description: "Defesa das liberdades fundamentais e dos direitos individuais.",
    },
    {
      title: "Propriedade",
      description: "Proteção da propriedade e da livre iniciativa das famílias brasileiras.",
    },
    {
      title: "Livre expressão",
      description: "Direito de falar, crer e participar da vida pública sem censura.",
    },
    {
      title: "Dignidade humana",
      description: "Cultura, educação, saúde e respeito à pessoa humana em primeiro lugar.",
    },
  ],
  pillars: [
    {
      title: "Defendendo valores, fortalecendo a sociedade",
      description:
        "Missão e princípios do Foro em defesa da liberdade e dos direitos individuais.",
      href: "https://forobrasil.org/sobre/",
      cta: "Conheça o Foro",
    },
    {
      title: "Presença em todo o Brasil e no mundo",
      description:
        "Diretórios em cada região, com frentes de juventude, mulheres, indígenas e presença no Equador e no Peru.",
      href: "https://forobrasil.org/diretorios/",
      cta: "Conheça os Diretórios",
    },
    {
      title: "Junte-se a nós e apoie o Foro do Brasil",
      description:
        "Saiba como contribuir e fortalecer a missão pelo Brasil que acreditamos.",
      href: "https://forobrasil.org/contato/",
      cta: "Faça Parte",
    },
  ],
  fronts: [
    { label: "Diretórios Estaduais", href: "https://forobrasil.org/diretorios/" },
    { label: "Juventude", href: "https://forobrasil.org/foro-do-brasil-juventude/" },
    { label: "Mulher", href: "https://forobrasil.org/foro-do-brasil-mulher/" },
    { label: "Indígena", href: "https://forobrasil.org/foro-do-brasil-indigena/" },
    { label: "Equador", href: "https://forobrasil.org/foro-do-brasil-equador/" },
    { label: "Peru", href: "https://forobrasil.org/foro-do-brasil-peru/" },
  ],
  nationalDirectories: [
    { label: "Foro do Brasil Mulher", href: "https://forobrasil.org/foro-do-brasil-mulher/" },
    { label: "Foro do Brasil Juventude", href: "https://forobrasil.org/foro-do-brasil-juventude/" },
    { label: "Foro do Brasil Indígena", href: "https://forobrasil.org/foro-do-brasil-indigena/" },
  ],
  internationalDirectories: [
    { label: "Foro do Brasil Equador", href: "https://forobrasil.org/foro-do-brasil-equador/" },
    { label: "Foro do Brasil Peru", href: "https://forobrasil.org/foro-do-brasil-peru/" },
  ],
};

export const PARTIDO_LIBERAL = {
  name: "Partido Liberal",
  shortName: "PL",
  number: "22",
  url: "https://partidoliberal.org.br/",
  affiliationUrl:
    "https://partidoliberal.org.br/valdemar-assina-ficha-de-filiacao-de-padre-kelmon-ao-pl/",
  joinUrl: "https://queromefiliaraopl.com.br/",
  donateUrl: "https://www.partidoliberal.org.br/doacao/",
  joined: "14 de agosto de 2024",
  role: "Filiado ao PL 22",
  photoCredit: "Foto: Beto Barata/PL",
  slogan: "Liberdade, Verdade e Fé, pelo bem do Brasil",
  description:
    "Em 14 de agosto de 2024, na sede do Partido Liberal em Brasília, o presidente nacional Valdemar Costa Neto assinou a ficha de filiação de Padre Kelmon. Na cerimônia, Kelmon falou de 25 anos dedicados à juventude e do chamado a líderes comprometidos com Deus, pátria, família, vida e liberdade.",
  quote:
    "Como padre, meu compromisso é servir ao povo, e na política, não é diferente. Estamos aqui para servir à comunidade, ao povo, à nação. No PL, pretendo me dedicar com o mesmo zelo, pois precisamos de líderes comprometidos com Deus, pátria, família, vida e liberdade.",
  quoteAuthor: "Padre Kelmon, na filiação ao PL",
  values: [
    {
      title: "Deus",
      description: "Fé cristã na vida pública e liberdade religiosa sem concessões.",
    },
    {
      title: "Pátria",
      description: "Servir à nação com zelo, responsabilidade e amor ao Brasil.",
    },
    {
      title: "Família e vida",
      description: "Defesa da família e da vida, do nascimento à dignidade de cada pessoa.",
    },
    {
      title: "Liberdade",
      description: "Líderes comprometidos com a liberdade do povo e com o futuro do Brasil.",
    },
  ],
  news: [
    {
      source: "PL 22",
      date: "16/08/2026",
      title: "Flávio Bolsonaro vai honrar a escolha do pai com o lema “O Brasil Vai Vencer”",
      description:
        "Flávio Bolsonaro confirma o lema da campanha e diz que vai honrar a escolha de Jair Bolsonaro.",
      href: "https://partidoliberal.org.br/flavio-bolsonaro-vai-honrar-a-escolha-do-pai-com-o-lema-o-brasil-vai-vencer/",
      image: "/news/flavio-brasil-vai-vencer.jpg",
    },
    {
      source: "PL 22",
      date: "11/08/2026",
      title:
        "“Juntos com este time para resgatar o Brasil”, diz Flávio Bolsonaro ao lado dos candidatos ao Senado",
      description:
        "O senador recebe candidatos conservadores ao Senado e reforça a união para resgatar o Brasil.",
      href: "https://partidoliberal.org.br/juntos-com-este-time-para-resgatar-o-brasil-diz-flavio-bolsonaro-ao-lado-dos-candidatos-conservadores-ao-senado/",
      image: "/news/flavio-time-senado.jpg",
    },
    {
      source: "PL 22",
      date: "25/07/2026",
      title: "Flávio Bolsonaro fala em resgatar o Brasil e varrer o PT na Convenção do PL",
      description:
        "A Convenção Nacional do PL, em São Paulo, oficializa a candidatura de Flávio Bolsonaro à Presidência.",
      href: "https://partidoliberal.org.br/flavio-bolsonaro-fala-em-resgatar-o-brasil-e-varrer-o-pt-na-convencao-do-pl/",
      image: "/news/flavio-convencao-pl.jpg",
    },
    {
      source: "PL 22",
      date: "07/07/2026",
      title:
        "Valdemar Costa Neto anuncia o lançamento da candidatura de Flávio Bolsonaro à Presidência",
      description:
        "O presidente nacional do PL convoca o Brasil para a Convenção que lança a chapa presidencial da legenda.",
      href: "https://partidoliberal.org.br/valdemar-costa-neto-anuncia-lancamento-da-candidatura-do-senador-flavio-bolsonaro-a-presidencia-da-republica/",
      image: "/news/flavio-valdemar-lancamento.jpg",
    },
  ],
  fronts: [
    {
      label: "Matéria da filiação",
      href: "https://partidoliberal.org.br/valdemar-assina-ficha-de-filiacao-de-padre-kelmon-ao-pl/",
    },
    { label: "Site oficial", href: "https://partidoliberal.org.br/" },
    { label: "Filie-se", href: "https://queromefiliaraopl.com.br/" },
    { label: "Doação", href: "https://www.partidoliberal.org.br/doacao/" },
  ],
};
