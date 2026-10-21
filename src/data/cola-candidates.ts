import kelmonPhoto from "@/assets/padre-kelmon-original.jpg";
import ninaPhoto from "@/assets/nina-braga.png";

export const COLA_LEGAL_LINE =
  "ELEICAO 2026 KELMON LUIS DA SILVA SOUZA DEPUTADO FEDERAL · CNPJ 68.353.198/0001-20 COLIGAÇÃO CORAGEM PARA SEGUIR AVANÇANDO (Republicanos + MDB + PL + Federação União Progressista (União Brasil / Progressistas) + PSD + Federação Renovação Solidária (Solidariedade / PRD) + Democrata + Avante)";

export const COLA_DEMO_DISCLAIMER =
  "DADO DE DEMONSTRAÇÃO — confirmar em fonte oficial.";

export type CandidateSource = {
  name: string;
  url: string;
  consultedAt: string;
};

export type Candidate = {
  id: string;
  name: string;
  ballotName: string;
  number: string;
  party: string;
  position: PositionKey;
  state: string;
  photo: string | null;
  biography: string;
  trajectory: string;
  proposals: string[];
  electoralInfo: string;
  status: string;
  sources: CandidateSource[];
  updatedAt: string;
  demo: boolean;
};

export type PositionKey =
  | "federal"
  | "estadual"
  | "senador1"
  | "senador2"
  | "governador"
  | "presidente";

export type PositionSlot = {
  key: PositionKey;
  order: number;
  label: string;
  shortLabel: string;
  digits: number;
};

export const POSITIONS: PositionSlot[] = [
  { key: "federal", order: 1, label: "Deputado Federal", shortLabel: "Dep. Federal", digits: 4 },
  {
    key: "estadual",
    order: 2,
    label: "Deputada Estadual",
    shortLabel: "Dep. Estadual",
    digits: 5,
  },
  { key: "senador1", order: 3, label: "Senador — 1ª vaga", shortLabel: "Senador 1", digits: 3 },
  { key: "senador2", order: 4, label: "Senador — 2ª vaga", shortLabel: "Senador 2", digits: 3 },
  { key: "governador", order: 5, label: "Governador", shortLabel: "Governador", digits: 2 },
  { key: "presidente", order: 6, label: "Presidente", shortLabel: "Presidente", digits: 2 },
];

export const EMPTY_SELECTION: Record<PositionKey, string | null> = {
  federal: null,
  estadual: null,
  senador1: null,
  senador2: null,
  governador: null,
  presidente: null,
};

const CONSULTED = "2026-09-13";

export const COLA_CANDIDATES: Candidate[] = [
  {
    id: "kelmon-2202",
    name: "Kelmon Luís da Silva Souza",
    ballotName: "Padre Kelmon",
    number: "2202",
    party: "PL",
    position: "federal",
    state: "SP",
    photo: kelmonPhoto,
    biography:
      "Sacerdote, fundador e Presidente Nacional do Foro do Brasil. Candidato a Deputado Federal por São Paulo pelo Partido Liberal (PL), com o número 2202. Declarou ao TSE escolaridade superior completa e a ocupação de sacerdote.",
    trajectory:
      "Nasceu em Salvador (BA), em 21 de outubro de 1976. Tem formação em Filosofia, Teologia e Pedagogia. Em 2022, disputou a Presidência da República e obteve 81.129 votos, segundo o TSE. Em 2023, fundou o Foro do Brasil. Em 2024, filiou-se ao PL. Em 2026, registrou candidatura a Deputado Federal por São Paulo, com registro deferido em fichas públicas baseadas no TSE.",
    proposals: [
      "Defesa da família",
      "Defesa da vida",
      "Liberdade religiosa",
      "Patriotismo",
      "Liberdade econômica",
    ],
    electoralInfo:
      "Deputado Federal por São Paulo, número 2202, PL. Registro deferido, segundo fichas públicas com dados do TSE. Confirmar a situação atual no DivulgaCand.",
    status: "Registro deferido, segundo fichas públicas com dados do TSE.",
    sources: [
      {
        name: "Site oficial do candidato",
        url: "https://padrekelmon.com.br/",
        consultedAt: CONSULTED,
      },
      {
        name: "O TEMPO — ficha 2026 (dados TSE)",
        url: "https://www.otempo.com.br/eleicoes/2026/candidatos/sao-paulo/deputado-federal/padre-kelmon-2202",
        consultedAt: CONSULTED,
      },
      {
        name: "Nexo — candidatos 2026",
        url: "https://candidatos.nexojornal.com.br/2026/sp/padre-kelmon-250002535998/",
        consultedAt: CONSULTED,
      },
    ],
    updatedAt: CONSULTED,
    demo: false,
  },
  {
    id: "nina-22090",
    name: "Marina Pereira Braga",
    ballotName: "Nina Braga",
    number: "22090",
    party: "PL",
    position: "estadual",
    state: "SP",
    photo: ninaPhoto,
    biography:
      "Vereadora de São Bernardo do Campo. Candidata a Deputada Estadual por São Paulo pelo Partido Liberal (PL), com o número 22090. Declarou ao TSE escolaridade superior completa, estado civil casada e a ocupação de vereadora.",
    trajectory:
      "Nasceu em Belo Horizonte (MG), em 26 de fevereiro de 1986. É vereadora em São Bernardo do Campo pelo PL, eleita em 2024 com 4.707 votos. Aproxima-se da família Bolsonaro após 2022 e integrou o PL Mulher a convite de Michelle Bolsonaro. Em 2026, registrou candidatura à Assembleia Legislativa de São Paulo, com registro deferido em fichas públicas baseadas no TSE.",
    proposals: [
      "Proteção da infância e da família",
      "Segurança pública",
      "Educação",
      "Liberdade de expressão",
      "Combate às drogas",
    ],
    electoralInfo:
      "Deputada Estadual por São Paulo, número 22090, PL. Registro deferido, segundo fichas públicas com dados do TSE. Confirmar a situação atual no DivulgaCand.",
    status: "Registro deferido, segundo fichas públicas com dados do TSE.",
    sources: [
      {
        name: "O TEMPO — ficha 2026 (dados TSE)",
        url: "https://www.otempo.com.br/eleicoes/2026/candidatos/sao-paulo/deputado-estadual/nina-braga-22090",
        consultedAt: CONSULTED,
      },
      {
        name: "Nexo — candidatos 2026",
        url: "https://candidatos.nexojornal.com.br/2026/sp/nina-braga-250002536345/",
        consultedAt: CONSULTED,
      },
      {
        name: "Repórter Diário — pré-candidatura",
        url: "https://www.reporterdiario.com.br/noticia/3863070/nina-braga-mira-alesp-e-diz-que-direita-do-abc-esta-sem-representacao/",
        consultedAt: CONSULTED,
      },
    ],
    updatedAt: CONSULTED,
    demo: false,
  },
  {
    id: "prado-222",
    name: "André Luis do Prado",
    ballotName: "André do Prado",
    number: "222",
    party: "PL",
    position: "senador1",
    state: "SP",
    photo: "/news/andre-prado-oficial.jpg",
    biography:
      "Analista de sistemas e presidente da Assembleia Legislativa de São Paulo. Candidato a Senador por São Paulo pelo PL, com o número 222. Natural de Guararema (SP), é casado e tem formação em Análise de Sistemas pela Universidade de Mogi das Cruzes.",
    trajectory:
      "Nasceu em 7 de junho de 1969, em Guararema. Trabalhou como feirante, soldador e professor da rede pública antes da vida pública. Elegeu-se vereador em 1992, foi presidente da Câmara Municipal, vice-prefeito e prefeito de Guararema (2005–2008), quando implantou escola profissionalizante, equipamentos de saúde e assistência social e obras de saneamento. Em 2010, elegeu-se deputado estadual com 86.346 votos e cumpriu quatro mandatos. Preside a Alesp desde 2023 e foi reconduzido em 2025. Em 2026, disputa o Senado.",
    proposals: [
      "Municipalismo e representação dos municípios paulistas",
      "Segurança pública",
      "Saúde e fortalecimento da rede assistencial",
      "Liberdade de expressão",
      "Continuidade das políticas do governo paulista",
    ],
    electoralInfo:
      "Senador por São Paulo, número 222, PL. Coligação Coragem Para Seguir Avançando. Confirmar a situação atual no DivulgaCand.",
    status: "Candidatura registrada. Confirmar a situação atual no TSE.",
    sources: [
      {
        name: "Site oficial — trajetória",
        url: "https://andredoprado.com.br/trajetoria/",
        consultedAt: CONSULTED,
      },
      {
        name: "O TEMPO — ficha 2026 (dados TSE)",
        url: "https://www.otempo.com.br/eleicoes/2026/candidatos/sao-paulo/senador/andre-do-prado-222",
        consultedAt: CONSULTED,
      },
      {
        name: "CNN Brasil — perfil do candidato",
        url: "https://www.cnnbrasil.com.br/eleicoes/quem-e-andre-do-prado-candidato-ao-senado-por-sp/",
        consultedAt: CONSULTED,
      },
    ],
    updatedAt: CONSULTED,
    demo: false,
  },
  {
    id: "derrite-111",
    name: "Guilherme Muraro Derrite",
    ballotName: "Guilherme Derrite",
    number: "111",
    party: "PP",
    position: "senador2",
    state: "SP",
    photo: "/news/derrite-oficial.jpg",
    biography:
      "Deputado federal por São Paulo e policial militar da reserva. Candidato a Senador por São Paulo, com o número 111. Formado em Ciências Sociais e Segurança Pública pela Academia do Barro Branco, é bacharel em Direito e tem pós-graduação em Ciências Jurídicas.",
    trajectory:
      "Nasceu em Sorocaba (SP), em 10 de outubro de 1984. Ingressou na Polícia Militar de São Paulo em 2003, serviu na ROTA e no Corpo de Bombeiros e chegou a capitão. Foi eleito deputado federal em 2018 e reeleito em 2022, com 239.772 votos. De 2023 a 2025, foi secretário da Segurança Pública de São Paulo no governo Tarcísio de Freitas. Na Câmara, atuou em comissões de segurança pública e relatou o projeto antifacção. Em 2026, disputa o Senado.",
    proposals: [
      "Segurança pública",
      "Combate ao crime organizado",
      "Valorização das forças de segurança",
      "Legislação penal mais efetiva",
    ],
    electoralInfo:
      "Senador por São Paulo, número 111. Fichas públicas de 2026 registram a candidatura pelo PP. Confirmar partido e situação atual no DivulgaCand.",
    status: "Candidatura registrada. Confirmar a situação atual no TSE.",
    sources: [
      {
        name: "Câmara dos Deputados — biografia",
        url: "https://www.camara.leg.br/deputados/204531/biografia",
        consultedAt: CONSULTED,
      },
      {
        name: "G1 — ficha de candidato 2026",
        url: "https://g1.globo.com/politica/eleicoes/2026/quem-sao-os-candidatos/senador/sp/250002541312.ghtml",
        consultedAt: CONSULTED,
      },
    ],
    updatedAt: CONSULTED,
    demo: false,
  },
  {
    id: "tarcisio-10",
    name: "Tarcísio Gomes de Freitas",
    ballotName: "Tarcísio de Freitas",
    number: "10",
    party: "Republicanos",
    position: "governador",
    state: "SP",
    photo: "/news/tarcisio-oficial.jpg",
    biography:
      "Engenheiro civil, ex-capitão do Exército e atual governador de São Paulo. Candidato à reeleição pelo Republicanos, com o número 10. Formado pela AMAN e pelo Instituto Militar de Engenharia, com mestrado em Engenharia de Transportes.",
    trajectory:
      "Nasceu no Rio de Janeiro, em 19 de junho de 1975. Serviu no Exército de 1996 a 2008, inclusive em missão da ONU no Haiti. Foi analista da CGU, diretor-executivo e diretor-geral do DNIT e ministro da Infraestrutura (2019–2022), com ênfase em obras, rodovias e ferrovias. Filiou-se ao Republicanos em 2022 e elegeu-se governador de São Paulo com 13.480.643 votos (55,27% dos válidos). Em 2026, disputa a reeleição com Felício Ramuth (MDB) como vice.",
    proposals: [
      "Continuidade da gestão estadual",
      "Segurança pública",
      "Saúde",
      "Educação",
      "Infraestrutura e desenvolvimento",
    ],
    electoralInfo:
      "Governador de São Paulo, número 10, Republicanos. Vice: Felício Ramuth (MDB). Coligação Coragem Para Seguir Avançando. Registro deferido, segundo fichas públicas com dados do TSE. Confirmar a situação atual no DivulgaCand.",
    status: "Registro deferido, segundo fichas públicas com dados do TSE.",
    sources: [
      {
        name: "Republicanos — biografia",
        url: "https://republicanos10.org.br/quem_e_quem/tarcisio-gomes-de-freitas-2/",
        consultedAt: CONSULTED,
      },
      {
        name: "O TEMPO — ficha 2026 (dados TSE)",
        url: "https://www.otempo.com.br/eleicoes/2026/candidatos/sao-paulo/governador/tarcisio-10",
        consultedAt: CONSULTED,
      },
      {
        name: "CNN Brasil — perfil",
        url: "https://www.cnnbrasil.com.br/eleicoes/quem-e-tarcisio-de-freitas/",
        consultedAt: CONSULTED,
      },
    ],
    updatedAt: CONSULTED,
    demo: false,
  },
  {
    id: "flavio-22",
    name: "Flávio Nantes Bolsonaro",
    ballotName: "Flávio Bolsonaro",
    number: "22",
    party: "PL",
    position: "presidente",
    state: "BR",
    photo: "/news/flavio-oficial.jpg",
    biography:
      "Advogado, empresário e senador pelo Rio de Janeiro. Candidato a Presidente da República pelo PL, com o número 22. Formado em Direito pela Universidade Candido Mendes, com especializações em políticas públicas e empreendedorismo.",
    trajectory:
      "Nasceu em Resende (RJ), em 30 de abril de 1981. Foi o deputado estadual mais jovem da Alerj na legislatura 2003–2007 e cumpriu quatro mandatos, com atuação em segurança pública e valorização dos servidores. Elegeu-se senador pelo Rio de Janeiro em 2018, com mandato até 2027. No Senado, integra comissões de Segurança Pública, Desenvolvimento Regional e Transparência. Em 2026, o PL oficializou sua candidatura à Presidência, com Alfredo Gaspar como vice.",
    proposals: [
      "Segurança pública e combate às facções",
      "Valorização das forças de segurança",
      "Escolas cívico-militares",
      "Redução de impostos e enxugamento da máquina pública",
      "Modernização do Estado e dos serviços públicos",
    ],
    electoralInfo:
      "Presidente da República, número 22, PL. Vice: Alfredo Gaspar (PL). Plano de governo registrado: Para o Brasil Vencer o Atraso. Confirmar a situação atual no DivulgaCand.",
    status: "Candidatura registrada. Confirmar a situação atual no TSE.",
    sources: [
      {
        name: "Senado Federal — perfil",
        url: "https://www25.senado.leg.br/web/senadores/senador/-/perfil/5894",
        consultedAt: CONSULTED,
      },
      {
        name: "Folha — ficha 2026",
        url: "https://www1.folha.uol.com.br/poder/eleicoes/candidatos/2026/br/presidente/flavio-bolsonaro-280002551544.shtml",
        consultedAt: CONSULTED,
      },
      {
        name: "Poder360 — plano de governo",
        url: "https://www.poder360.com.br/poder-flash/leia-a-integra-do-plano-de-governo-de-flavio-bolsonaro/",
        consultedAt: CONSULTED,
      },
    ],
    updatedAt: CONSULTED,
    demo: false,
  },
];
