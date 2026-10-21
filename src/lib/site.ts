import { CANDIDATE, FORO_BRASIL } from "./campaign-data";

/** Domínio canônico de produção. www e http redirecionam no servidor. */
export const CANONICAL_ORIGIN = "https://padrekelmon.com.br";

/** URL canônica do site. Em produção use VITE_SITE_URL=https://padrekelmon.com.br */
export const SITE_URL = (
  typeof import.meta.env.VITE_SITE_URL === "string" && import.meta.env.VITE_SITE_URL.trim()
    ? import.meta.env.VITE_SITE_URL
    : CANONICAL_ORIGIN
).replace(/\/$/, "");

export const SITE_NAME = "Padre Kelmon";

export const SITE_TITLE = "Padre Kelmon | Candidato a Deputado Federal por São Paulo";

/** Meta description distinta do title (~140–160 caracteres) para SEO e redes. */
export const SITE_DESCRIPTION =
  "Site oficial de Padre Kelmon, candidato a Deputado Federal por São Paulo pelo PL. Conheça sua trajetória, pautas, posicionamentos, notícias, vídeos e materiais de campanha.";

export const SITE_KEYWORDS =
  "Padre Kelmon, site oficial Padre Kelmon, biografia, notícias, entrevistas, redes sociais, sacerdote, Deputado Federal, São Paulo, PL, campanha 2026, fé e política";

export const SITE_CLASSIFICATION = "Política, campanha eleitoral, fé cristã";

export const SITE_COPYRIGHT = `© ${new Date().getFullYear()} Campanha Padre Kelmon`;

/** Metadados comuns a todas as páginas. */
export const GENERAL_META = [
  { name: "referrer", content: "origin-when-cross-origin" },
  { name: "rating", content: "general" },
  { name: "classification", content: SITE_CLASSIFICATION },
  { name: "publisher", content: SITE_NAME },
  { name: "copyright", content: SITE_COPYRIGHT },
  { name: "coverage", content: "São Paulo, Brasil" },
  { name: "distribution", content: "global" },
  { name: "revisit-after", content: "7 days" },
] as const;

/** JPEG 1200×630 da arte de prévia. Nome novo para o WhatsApp não reusar o cache. */
export const OG_IMAGE_PATH = "/og-banner-previa-kelmon.jpg";
export const OG_IMAGE_WIDTH = "1200";
export const OG_IMAGE_HEIGHT = "630";

export const TWITTER_HANDLE = "@PeKelmon";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!SITE_URL) return normalized;
  return `${SITE_URL}${normalized}`;
}

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export const PAGE_SEO = {
  home: {
    path: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    breadcrumbs: [{ name: "Início", path: "/" }] satisfies BreadcrumbItem[],
  },
  biografia: {
    path: "/sobre",
    title: "Quem é Padre Kelmon | Biografia e Trajetória",
    description:
      "Conheça a trajetória de Padre Kelmon, sua formação, atuação pastoral, vida pública e participação política no Brasil.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Biografia", path: "/sobre" },
    ] satisfies BreadcrumbItem[],
    schema: "profile" as const,
  },
  sobre: {
    path: "/sobre",
    title: "Quem é Padre Kelmon | Biografia e Trajetória",
    description:
      "Conheça a trajetória de Padre Kelmon, sua formação, atuação pastoral, vida pública e participação política no Brasil.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Biografia", path: "/sobre" },
    ] satisfies BreadcrumbItem[],
    schema: "profile" as const,
  },
  saibaMais: {
    path: "/saiba-mais",
    title: "Padre Kelmon | Vida, missão e projetos",
    description:
      "A mobilização pró-vida de 2010, coordenada por Padre Kelmon.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Saiba mais", path: "/saiba-mais" },
    ] satisfies BreadcrumbItem[],
  },
  pautas: {
    path: "/pautas",
    title: "Pautas de Padre Kelmon | Família, Liberdade e Brasil",
    description:
      "Conheça as principais pautas defendidas por Padre Kelmon, incluindo família, vida, liberdade religiosa, segurança, liberdade econômica e Brasil.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Pautas", path: "/pautas" },
    ] satisfies BreadcrumbItem[],
  },
  midia: {
    path: "/midia",
    title: "Padre Kelmon na Mídia | Notícias, Entrevistas e Vídeos",
    description:
      "Acompanhe notícias, entrevistas, vídeos e participações de Padre Kelmon na imprensa e nos principais meios de comunicação.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Mídia", path: "/midia" },
    ] satisfies BreadcrumbItem[],
  },
  noticias: {
    path: "/noticias",
    title: "Notícias de Padre Kelmon | Campanha e imprensa",
    description:
      "Notícias e matérias sobre Padre Kelmon: convocações da campanha, imprensa e registros públicos da trajetória.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Notícias", path: "/noticias" },
    ] satisfies BreadcrumbItem[],
  },
  agenda: {
    path: "/agenda",
    title: "Padre Kelmon | Agenda",
    description:
      "Agenda pública de Padre Kelmon. Eventos com data, horário e local confirmados, inclusive o arquivo histórico.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Agenda", path: "/agenda" },
    ] satisfies BreadcrumbItem[],
  },
  eventos: {
    path: "/eventos",
    title: "Padre Kelmon | Eventos",
    description:
      "Eventos públicos de Padre Kelmon com informações verificáveis de data, horário e local.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Eventos", path: "/eventos" },
    ] satisfies BreadcrumbItem[],
  },
  entrevistas: {
    path: "/entrevistas",
    title: "Padre Kelmon | Entrevistas",
    description:
      "Entrevistas reais de Padre Kelmon em podcasts e programas, com data, veículo e o vídeo oficial no YouTube.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Entrevistas", path: "/entrevistas" },
    ] satisfies BreadcrumbItem[],
  },
  discursos: {
    path: "/discursos",
    title: "Padre Kelmon | Discursos e falas",
    description:
      "Falas e pronunciamentos públicos de Padre Kelmon com registro em vídeo oficial, sem reproduzir conteúdo de terceiros.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Discursos", path: "/discursos" },
    ] satisfies BreadcrumbItem[],
  },
  conteudos: {
    path: "/conteudos",
    title: "Padre Kelmon | Conteúdos",
    description:
      "Textos, livro, projetos e materiais editoriais do site oficial de Padre Kelmon.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Conteúdos", path: "/conteudos" },
    ] satisfies BreadcrumbItem[],
  },
  redesSociais: {
    path: "/redes-sociais",
    title: "Padre Kelmon | Redes Sociais Oficiais",
    description:
      "Perfis oficiais de Padre Kelmon no Instagram, TikTok, YouTube, Facebook e X.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Redes sociais", path: "/redes-sociais" },
    ] satisfies BreadcrumbItem[],
  },
  mapaDoSite: {
    path: "/mapa-do-site",
    title: "Padre Kelmon | Mapa do site",
    description:
      "Mapa do site oficial de Padre Kelmon, com links para biografia, notícias, agenda, entrevistas e contato.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Mapa do site", path: "/mapa-do-site" },
    ] satisfies BreadcrumbItem[],
  },
  numeros: {
    path: "/numeros",
    title: "Padre Kelmon | Trajetória, Votos e Atuação Pública",
    description:
      "Conheça números, resultados e informações da trajetória pública e política de Padre Kelmon.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Números", path: "/numeros" },
    ] satisfies BreadcrumbItem[],
  },
  discursosMissa: {
    path: "/discursos/missa-de-lancamento-campanha",
    title: "Padre Kelmon | Missa de lançamento da campanha",
    description:
      "Missa de lançamento da campanha de Padre Kelmon a Deputado Federal, com o vídeo oficial no YouTube.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Discursos", path: "/discursos" },
      { name: "Missa de lançamento", path: "/discursos/missa-de-lancamento-campanha" },
    ] satisfies BreadcrumbItem[],
  },
  links: {
    path: "/links",
    title: "Padre Kelmon | Redes Sociais Oficiais",
    description:
      "Canais oficiais de Padre Kelmon: Instagram, TikTok, YouTube, Facebook, X e o site da campanha a Deputado Federal.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Redes sociais", path: "/links" },
    ] satisfies BreadcrumbItem[],
  },
  contato: {
    path: "/contato",
    title: "Padre Kelmon | Contato",
    description:
      "Fale com a campanha de Padre Kelmon. Envie seus dados pelo formulário oficial ou acompanhe pelos canais verificados.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Contato", path: "/contato" },
    ] satisfies BreadcrumbItem[],
  },
  seteSetembro: {
    path: "/imprensa/7-de-setembro",
    title: "Padre Kelmon | 7 de Setembro na Paulista",
    description:
      "Padre Kelmon convoca São Paulo para o ato na Avenida Paulista às 15h no 7 de Setembro, Dia da Independência.",
    image: "/news/7-de-setembro-paulista.jpg",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Notícias", path: "/noticias" },
      { name: "7 de Setembro", path: "/imprensa/7-de-setembro" },
    ] satisfies BreadcrumbItem[],
    schema: "article" as const,
    datePublished: "2026-09-07",
  },
  colinha: {
    path: "/colinha",
    title: "Minha Cola 2026 | Organize sua cola eleitoral",
    description:
      "Conheça candidatos e organize sua cola eleitoral. Você escolhe. O sistema apenas organiza as informações.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Minha Cola 2026", path: "/colinha" },
    ] satisfies BreadcrumbItem[],
  },
  downloads: {
    path: "/downloads",
    title: "Materiais de Campanha Padre Kelmon 2202 | Downloads",
    description:
      "Encontre materiais oficiais de Padre Kelmon, conteúdos para divulgação e materiais relacionados à campanha.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Downloads", path: "/downloads" },
    ] satisfies BreadcrumbItem[],
  },
  politicaPrivacidade: {
    path: "/politica-de-privacidade",
    title: "Política de Privacidade | Padre Kelmon",
    description:
      "Como o site oficial de Padre Kelmon trata dados pessoais enviados pelo formulário de contato, em conformidade com a LGPD.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Política de Privacidade", path: "/politica-de-privacidade" },
    ] satisfies BreadcrumbItem[],
    robots: "noindex, follow",
  },
  termosDeUso: {
    path: "/termos-de-uso",
    title: "Termos de Uso | Padre Kelmon",
    description:
      "Condições de uso do site oficial de Padre Kelmon, da campanha a Deputado Federal por São Paulo.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Termos de Uso", path: "/termos-de-uso" },
    ] satisfies BreadcrumbItem[],
    robots: "noindex, follow",
  },
  politicaCookies: {
    path: "/politica-de-cookies",
    title: "Política de Cookies | Padre Kelmon",
    description:
      "Informações sobre o aviso de cookies usado no site oficial de Padre Kelmon.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Política de Cookies", path: "/politica-de-cookies" },
    ] satisfies BreadcrumbItem[],
    robots: "noindex, follow",
  },
  contatoSucesso: {
    path: "/contato/sucesso",
    title: "Mensagem enviada | Padre Kelmon",
    description: "Seu cadastro foi enviado à campanha de Padre Kelmon.",
    breadcrumbs: [
      { name: "Início", path: "/" },
      { name: "Contato", path: "/contato" },
      { name: "Enviado", path: "/contato/sucesso" },
    ] satisfies BreadcrumbItem[],
    robots: "noindex, follow",
  },
} as const;

export type VideoObjectInput = {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
};

function ogImageType(src: string) {
  if (/\.webp(?:$|\?)/i.test(src)) return "image/webp";
  if (/\.png(?:$|\?)/i.test(src)) return "image/png";
  return "image/jpeg";
}

export function buildPageHead({
  path,
  title,
  description,
  image,
  imageWidth,
  imageHeight,
  breadcrumbs,
  schema,
  robots,
  datePublished,
  dateModified,
  video,
}: {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageWidth?: string;
  imageHeight?: string;
  breadcrumbs?: readonly BreadcrumbItem[];
  schema?: "profile" | "article";
  robots?: string;
  datePublished?: string;
  dateModified?: string;
  video?: VideoObjectInput;
}) {
  const pageUrl = absoluteUrl(path);
  const ogImage = absoluteUrl(image ?? OG_IMAGE_PATH);
  const width = imageWidth ?? OG_IMAGE_WIDTH;
  const height = imageHeight ?? OG_IMAGE_HEIGHT;
  const isArticle = schema === "article";

  const scripts: Array<{ type: string; children: string }> = [
    {
      type: "application/ld+json",
      children: JSON.stringify(
        schema === "profile"
          ? buildProfilePageJsonLd({ path, title, description, image, imageWidth, imageHeight })
          : buildWebPageJsonLd({ path, title, description, image, imageWidth, imageHeight }),
      ),
    },
  ];

  if (breadcrumbs?.length) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)),
    });
  }

  if (isArticle) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify(
        buildNewsArticleJsonLd({
          path,
          title,
          description,
          image,
          datePublished,
          dateModified,
        }),
      ),
    });
  }

  if (video) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify(buildVideoObjectJsonLd(video)),
    });
  }

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: SITE_KEYWORDS },
      { name: "author", content: SITE_NAME },
      ...GENERAL_META,
      {
        name: "robots",
        content:
          robots ??
          "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "googlebot", content: robots?.includes("noindex") ? "noindex, follow" : "index, follow" },
      { name: "geo.region", content: "BR-SP" },
      { name: "geo.placename", content: "São Paulo" },
      { name: "language", content: "pt-BR" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: isArticle ? "article" : "website" },
      { property: "og:url", content: pageUrl },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:locale:alternate", content: "pt" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage },
      { property: "og:image:secure_url", content: ogImage },
      { property: "og:image:type", content: ogImageType(ogImage) },
      { property: "og:image:width", content: width },
      { property: "og:image:height", content: height },
      { property: "og:image:alt", content: title },
      ...(datePublished
        ? [
            { property: "article:published_time", content: datePublished },
            { property: "article:modified_time", content: dateModified ?? datePublished },
          ]
        : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: TWITTER_HANDLE },
      { name: "twitter:creator", content: TWITTER_HANDLE },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
      { name: "twitter:image:alt", content: title },
    ],
    links: [
      { rel: "canonical", href: pageUrl },
      { rel: "alternate", hrefLang: "pt-BR", href: pageUrl },
      { rel: "alternate", hrefLang: "x-default", href: pageUrl },
      { rel: "image_src", href: ogImage },
      { rel: "author", href: absoluteUrl("/") },
    ],
    scripts,
  };
}

export function buildPersonJsonLd() {
  const url = absoluteUrl("/");
  const image = absoluteUrl(OG_IMAGE_PATH);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name: CANDIDATE.name,
    alternateName: CANDIDATE.fullName,
    jobTitle: CANDIDATE.role,
    description: SITE_DESCRIPTION,
    url,
    image,
    birthDate: "1976-10-21",
    birthPlace: {
      "@type": "Place",
      name: "Salvador, Bahia, Brasil",
    },
    nationality: {
      "@type": "Country",
      name: "Brasil",
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    knowsAbout: [
      "Política",
      "Liberdade religiosa",
      "Família",
      "Conservadorismo",
      "Deputado Federal",
    ],
    memberOf: [
      {
        "@type": "Organization",
        name: "Partido Liberal (PL)",
        sameAs: "https://partidoliberal.org.br/",
      },
      {
        "@type": "Organization",
        name: FORO_BRASIL.name,
        sameAs: FORO_BRASIL.url,
      },
    ],
    sameAs: [
      CANDIDATE.instagram,
      CANDIDATE.facebook,
      CANDIDATE.youtube,
      CANDIDATE.x,
      CANDIDATE.tiktok,
      "https://pt.wikipedia.org/wiki/Padre_Kelmon",
      FORO_BRASIL.url,
    ],
  };
}

export function buildWebSiteJsonLd() {
  const url = absoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}#website`,
    name: SITE_NAME,
    alternateName: SITE_TITLE,
    url,
    description: SITE_DESCRIPTION,
    inLanguage: "pt-BR",
    publisher: {
      "@id": `${url}#organization`,
    },
  };
}

export function buildBreadcrumbJsonLd(items: readonly BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildProfilePageJsonLd(page: {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageWidth?: string;
  imageHeight?: string;
}) {
  const url = absoluteUrl(page.path);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    name: page.title,
    description: page.description,
    url,
    inLanguage: "pt-BR",
    isPartOf: {
      "@id": `${absoluteUrl("/")}#website`,
    },
    mainEntity: {
      "@id": `${absoluteUrl("/")}#person`,
    },
    about: {
      "@id": `${absoluteUrl("/")}#person`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(page.image ?? OG_IMAGE_PATH),
      width: Number(page.imageWidth ?? OG_IMAGE_WIDTH),
      height: Number(page.imageHeight ?? OG_IMAGE_HEIGHT),
    },
  };
}

export function buildNewsArticleJsonLd(page: {
  path: string;
  title: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const url = absoluteUrl(page.path);
  const published = page.datePublished;
  const modified = page.dateModified ?? page.datePublished;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: page.title,
    description: page.description,
    image: [absoluteUrl(page.image ?? OG_IMAGE_PATH)],
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/Logo-Site-Padre-kelmon-campanha.png"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function buildVideoObjectJsonLd(video: VideoObjectInput) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    ...(video.contentUrl ? { contentUrl: video.contentUrl } : {}),
    ...(video.embedUrl ? { embedUrl: video.embedUrl } : {}),
  };
}

export function buildEventJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Ato do 7 de Setembro na Avenida Paulista",
    description:
      "Convocação de Padre Kelmon para o ato na Avenida Paulista às 15h no Dia da Independência.",
    startDate: "2026-09-07T15:00:00-03:00",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: absoluteUrl("/imprensa/7-de-setembro"),
    image: absoluteUrl("/news/7-de-setembro-paulista.jpg"),
    location: {
      "@type": "Place",
      name: "Avenida Paulista",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Avenida Paulista",
        addressLocality: "São Paulo",
        addressRegion: "SP",
        addressCountry: "BR",
      },
    },
    organizer: {
      "@id": `${absoluteUrl("/")}#person`,
    },
  };
}

export function buildWebPageJsonLd(page?: {
  path?: string;
  title?: string;
  description?: string;
  image?: string;
  imageWidth?: string;
  imageHeight?: string;
}) {
  const url = absoluteUrl(page?.path ?? "/");
  const name = page?.title ?? SITE_TITLE;
  const description = page?.description ?? SITE_DESCRIPTION;
  const imagePath = page?.image ?? OG_IMAGE_PATH;
  const imageWidth = page?.imageWidth ?? OG_IMAGE_WIDTH;
  const imageHeight = page?.imageHeight ?? OG_IMAGE_HEIGHT;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name,
    description,
    url,
    inLanguage: "pt-BR",
    isPartOf: {
      "@id": `${absoluteUrl("/")}#website`,
    },
    about: {
      "@id": `${absoluteUrl("/")}#person`,
    },
    primaryEntity: {
      "@id": `${absoluteUrl("/")}#person`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(imagePath),
      width: Number(imageWidth),
      height: Number(imageHeight),
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "#historia"],
    },
  };
}

export function buildOrganizationJsonLd() {
  const url = absoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organization`,
    name: SITE_NAME,
    alternateName: CANDIDATE.fullName,
    url,
    logo: absoluteUrl("/Logo-Site-Padre-kelmon-campanha.png"),
    description: SITE_DESCRIPTION,
    identifier: {
      "@type": "PropertyValue",
      name: "CNPJ",
      value: CANDIDATE.cnpj,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "São Paulo, Brasil",
    },
    sameAs: [
      CANDIDATE.instagram,
      CANDIDATE.facebook,
      CANDIDATE.youtube,
      CANDIDATE.x,
      CANDIDATE.tiktok,
    ],
  };
}
