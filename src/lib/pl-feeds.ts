import { createServerFn } from "@tanstack/react-start";

import { PARTIDO_LIBERAL } from "@/lib/campaign-data";
import { isBlockedStateDeputyNews, rejectStateDeputyNews } from "@/lib/news-filters";

export type PlNewsItem = {
  source: string;
  date: string;
  title: string;
  description: string;
  href: string;
  image: string;
};

export type PlFeedsResult = {
  articles: PlNewsItem[];
  sourceUrl: string;
  updatedAt: string;
  live: boolean;
};

const CACHE_TTL_MS = 60 * 1000;
const MAX_ARTICLES = 4;
const PL_HOME_URL = "https://partidoliberal.org.br/";
const SKIP_PATHS = [
  "/noticias/",
  "/historia-do-pl/",
  "/tv-pl",
  "/doacao/",
  "/downloads/",
  "/wp-content/",
  "/tag/",
  "/categoria/",
];

let cache: { data: PlFeedsResult; expiresAt: number } | null = null;

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

function dateFromText(raw: string): string {
  const match = raw.match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
  if (!match) return "";
  return `${match[1]}/${match[2]}/${match[3]}`;
}

function isArticleUrl(url: string): boolean {
  if (!url.startsWith("https://partidoliberal.org.br/")) return false;
  const path = url.slice("https://partidoliberal.org.br".length);
  if (path.length < 24) return false;
  if (SKIP_PATHS.some((skip) => path.startsWith(skip) || path.includes(skip))) return false;
  if (/\.(jpg|jpeg|png|webp|pdf|mp4)$/i.test(path)) return false;
  return true;
}

function parseHomeNews(html: string): PlNewsItem[] {
  const articles: PlNewsItem[] = [];
  const seen = new Set<string>();
  const blocks = html.matchAll(/<(?:div|li) class="noticia">([\s\S]*?)<\/(?:div|li)>/gi);

  for (const match of blocks) {
    const block = match[1] ?? "";
    const href = block.match(/href="(https:\/\/partidoliberal\.org\.br\/[^"]+)"/)?.[1] ?? "";
    const image =
      block.match(/<img[^>]+src="(https:\/\/partidoliberal\.org\.br\/wp-content\/uploads\/[^"]+)"/)?.[1] ?? "";
    const title = cleanText(block.match(/<h3>([\s\S]*?)<\/h3>/)?.[1] ?? "");
    const date = dateFromText(block) || dateFromText(image) || dateFromText(href);

    if (!href || !title || !isArticleUrl(href) || seen.has(href)) continue;
    if (isBlockedStateDeputyNews({ title, href })) continue;
    seen.add(href);

    articles.push({
      source: "PL 22",
      date,
      title,
      description: "",
      href,
      image: image || PARTIDO_LIBERAL.news[0]?.image || "",
    });

    if (articles.length >= MAX_ARTICLES) break;
  }

  return articles;
}

function fallbackResult(): PlFeedsResult {
  return {
    articles: rejectStateDeputyNews(PARTIDO_LIBERAL.news),
    sourceUrl: PL_HOME_URL,
    updatedAt: new Date().toISOString(),
    live: false,
  };
}

async function fetchHomeHtml(): Promise<string> {
  const res = await fetch(PL_HOME_URL, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "Mozilla/5.0 (compatible; PadreKelmonSite/1.0; +https://padrekelmon.com.br/)",
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    throw new Error(`PL homepage ${res.status}`);
  }
  return res.text();
}

async function buildPlFeeds(): Promise<PlFeedsResult> {
  try {
    const html = await fetchHomeHtml();
    const articles = parseHomeNews(html);
    if (articles.length === 0) return fallbackResult();
    return {
      articles,
      sourceUrl: PL_HOME_URL,
      updatedAt: new Date().toISOString(),
      live: true,
    };
  } catch (error) {
    console.warn("[pl-feeds] fetch failed:", error);
    return fallbackResult();
  }
}

export const getPlFeeds = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.data;
  }

  const data = await buildPlFeeds();
  cache = { data, expiresAt: now + CACHE_TTL_MS };
  return data;
});
