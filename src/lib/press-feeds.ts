import { createServerFn } from "@tanstack/react-start";

import {
  FEATURED_PRESS_ARTICLE,
  PRESS_ARTICLES,
  PRESS_SOURCE_URL,
  type PressArticle,
} from "@/data/press-articles";
import { isBlockedStateDeputyNews, rejectStateDeputyNews } from "@/lib/news-filters";

export type PressFeedsResult = {
  articles: PressArticle[];
  sourceUrl: string;
  updatedAt: string;
  live: boolean;
};

const CACHE_TTL_MS = 60 * 1000;
const MAX_ARTICLES = 16;
const WP_SEARCH_URL =
  "https://7minutos.com.br/wp-json/wp/v2/posts?search=Kelmon&per_page=20&_embed=1&orderby=date&order=desc";

let cache: { data: PressFeedsResult; expiresAt: number } | null = null;

function cleanText(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&#8216;|&#8217;|&lsquo;|&rsquo;/gi, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/gi, '"')
    .replace(/&#8211;|&ndash;/gi, " - ")
    .replace(/&#8212;|&mdash;/gi, " - ")
    .replace(/&amp;/gi, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/[\u2013\u2014\u2015]/g, " - ")
    .replace(/\s+/g, " ")
    .trim();
}

function mentionsKelmon(title: string, url: string): boolean {
  return /kelmon/i.test(title) || /kelmon/i.test(url);
}

function categoryEyebrow(post: {
  _embedded?: {
    "wp:term"?: Array<Array<{ name?: string; taxonomy?: string }>>;
  };
}): string {
  const groups = post._embedded?.["wp:term"] ?? [];
  for (const group of groups) {
    for (const term of group) {
      if (term.taxonomy === "category" && term.name) {
        const name = cleanText(term.name)
          .replace(/^[^A-Za-zÀ-ÿ]+/, "")
          .replace(/^Notícias\s*:\s*/i, "")
          .replace(/^Estilo\s*:\s*/i, "")
          .replace(/^Variedades\s*:\s*/i, "")
          .trim();
        if (name) return name;
      }
    }
  }
  return "7Minutos";
}

function featuredImage(post: {
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string; media_details?: { sizes?: Record<string, { source_url?: string }> } }>;
  };
}): string {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return "";
  const sizes = media.media_details?.sizes ?? {};
  return (
    sizes.medium_large?.source_url ||
    sizes.large?.source_url ||
    sizes.medium?.source_url ||
    media.source_url ||
    ""
  );
}

type WpPost = {
  id: number;
  link?: string;
  title?: { rendered?: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      media_details?: { sizes?: Record<string, { source_url?: string }> };
    }>;
    "wp:term"?: Array<Array<{ name?: string; taxonomy?: string }>>;
  };
};

async function fetchLiveArticles(): Promise<PressArticle[]> {
  const res = await fetch(WP_SEARCH_URL, {
    headers: {
      Accept: "application/json",
      "User-Agent": "PadreKelmonSite/1.0 (+press-feed)",
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    throw new Error(`7Minutos WP API ${res.status}`);
  }

  const posts = (await res.json()) as WpPost[];
  const articles: PressArticle[] = [];

  for (const post of posts) {
    const title = cleanText(post.title?.rendered ?? "");
    const url = post.link ?? "";
    if (!title || !url || !mentionsKelmon(title, url)) continue;
    if (isBlockedStateDeputyNews({ title, url })) continue;

    const image = featuredImage(post);
    articles.push({
      id: String(post.id),
      title,
      eyebrow: categoryEyebrow(post),
      url,
      image: image || PRESS_ARTICLES[0]?.image || "",
      source: "7Minutos",
    });

    if (articles.length >= MAX_ARTICLES) break;
  }

  return articles;
}

function pinFeatured(articles: PressArticle[]): PressArticle[] {
  const rest = articles.filter((article) => article.id !== FEATURED_PRESS_ARTICLE.id);
  return [FEATURED_PRESS_ARTICLE, ...rest];
}

function fallbackResult(): PressFeedsResult {
  return {
    articles: pinFeatured(rejectStateDeputyNews(PRESS_ARTICLES)),
    sourceUrl: PRESS_SOURCE_URL,
    updatedAt: new Date().toISOString(),
    live: false,
  };
}

async function buildPressFeeds(): Promise<PressFeedsResult> {
  try {
    const articles = await fetchLiveArticles();
    if (articles.length === 0) return fallbackResult();
    return {
      articles: pinFeatured(articles),
      sourceUrl: PRESS_SOURCE_URL,
      updatedAt: new Date().toISOString(),
      live: true,
    };
  } catch (error) {
    console.warn("[press-feeds] fetch failed:", error);
    return fallbackResult();
  }
}

export const getPressFeeds = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.data;
  }

  const data = await buildPressFeeds();
  cache = { data, expiresAt: now + CACHE_TTL_MS };
  return data;
});
