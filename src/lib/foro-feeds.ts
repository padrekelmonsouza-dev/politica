import { createServerFn } from "@tanstack/react-start";

import {
  FORO_ARTICLES,
  FORO_NEWS_URL,
  type ForoArticle,
} from "@/data/foro-articles";
import { isBlockedStateDeputyNews, rejectStateDeputyNews } from "@/lib/news-filters";

export type ForoFeedsResult = {
  articles: ForoArticle[];
  sourceUrl: string;
  updatedAt: string;
  live: boolean;
};

const CACHE_TTL_MS = 60 * 1000;
const MAX_ARTICLES = 4;
const WP_POSTS_URL =
  "https://forobrasil.org/wp-json/wp/v2/posts?per_page=4&_embed=1&orderby=date&order=desc";

let cache: { data: ForoFeedsResult; expiresAt: number } | null = null;

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

function formatDate(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function featuredImage(post: {
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      media_details?: { sizes?: Record<string, { source_url?: string }> };
    }>;
  };
}): string {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return "";
  const sizes = media.media_details?.sizes ?? {};
  return (
    sizes.large?.source_url ||
    sizes.medium_large?.source_url ||
    sizes.medium?.source_url ||
    media.source_url ||
    ""
  );
}

type WpPost = {
  id: number;
  date?: string;
  link?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      media_details?: { sizes?: Record<string, { source_url?: string }> };
    }>;
  };
};

async function fetchLiveArticles(): Promise<ForoArticle[]> {
  const res = await fetch(WP_POSTS_URL, {
    headers: {
      Accept: "application/json",
      "User-Agent": "PadreKelmonSite/1.0 (+foro-feed)",
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    throw new Error(`Foro do Brasil WP API ${res.status}`);
  }

  const posts = (await res.json()) as WpPost[];
  const articles: ForoArticle[] = [];

  for (const post of posts) {
    const title = cleanText(post.title?.rendered ?? "");
    const url = post.link ?? "";
    if (!title || !url) continue;
    if (isBlockedStateDeputyNews({ title, url, excerpt: cleanText(post.excerpt?.rendered ?? "") })) {
      continue;
    }

    articles.push({
      id: String(post.id),
      title,
      excerpt: cleanText(post.excerpt?.rendered ?? ""),
      date: formatDate(post.date ?? ""),
      url,
      image: featuredImage(post) || FORO_ARTICLES[0]?.image || "",
    });

    if (articles.length >= MAX_ARTICLES) break;
  }

  return articles;
}

function fallbackResult(): ForoFeedsResult {
  return {
    articles: rejectStateDeputyNews(FORO_ARTICLES),
    sourceUrl: FORO_NEWS_URL,
    updatedAt: new Date().toISOString(),
    live: false,
  };
}

async function buildForoFeeds(): Promise<ForoFeedsResult> {
  try {
    const articles = await fetchLiveArticles();
    if (articles.length === 0) return fallbackResult();
    return {
      articles,
      sourceUrl: FORO_NEWS_URL,
      updatedAt: new Date().toISOString(),
      live: true,
    };
  } catch (error) {
    console.warn("[foro-feeds] fetch failed:", error);
    return fallbackResult();
  }
}

export const getForoFeeds = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.data;
  }

  const data = await buildForoFeeds();
  cache = { data, expiresAt: now + CACHE_TTL_MS };
  return data;
});
