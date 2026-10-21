import { createServerFn } from "@tanstack/react-start";

import { VV8_ARTICLES, VV8_SOURCE_URL } from "@/data/vv8-articles";
import type { PressArticle } from "@/data/press-articles";
import { isBlockedStateDeputyNews, rejectStateDeputyNews } from "@/lib/news-filters";

export type Vv8FeedsResult = {
  articles: PressArticle[];
  sourceUrl: string;
  updatedAt: string;
  live: boolean;
};

const CACHE_TTL_MS = 60 * 1000;
const MAX_ARTICLES = 16;
const SEARCH_URL = VV8_SOURCE_URL;

let cache: { data: Vv8FeedsResult; expiresAt: number } | null = null;

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

const ARTICLE_RE = new RegExp(
  [
    String.raw`<a href="(https://portalvv8\.com\.br/noticia/(\d+)/[^"]+)"[^>]*class="lista-home-4[^"]*"`,
    String.raw`[\s\S]*?data-src="([^"]+)"`,
    String.raw`[\s\S]*?chapeu-lista-home-4">\s*<b>(.*?)</b>`,
    String.raw`[\s\S]*?<h3>(.*?)</h3>`,
  ].join(""),
  "gi",
);

function parseSearchHtml(html: string): PressArticle[] {
  const start = html.indexOf('class="conteudo-interno lista-interna"');
  const endMarker = html.indexOf("ultimas-noticias", start === -1 ? 0 : start);
  const chunk =
    start !== -1 && endMarker !== -1 ? html.slice(start, endMarker) : html;

  const articles: PressArticle[] = [];
  const seen = new Set<string>();

  for (const match of chunk.matchAll(ARTICLE_RE)) {
    const [, url, id, image, eyebrowRaw, titleRaw] = match;
    const title = cleanText(titleRaw ?? "");
    const eyebrow = cleanText(eyebrowRaw ?? "") || "Portal VV8";
    if (!url || !title || !mentionsKelmon(title, url)) continue;
    if (isBlockedStateDeputyNews({ title, url })) continue;
    if (seen.has(id)) continue;
    seen.add(id);

    articles.push({
      id: `vv8-${id}`,
      title,
      eyebrow,
      url,
      image: image || VV8_ARTICLES[0]?.image || "",
      source: "Portal VV8",
    });

    if (articles.length >= MAX_ARTICLES) break;
  }

  return articles;
}

async function fetchLiveArticles(): Promise<PressArticle[]> {
  const res = await fetch(SEARCH_URL, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "PadreKelmonSite/1.0 (+vv8-press-feed)",
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    throw new Error(`Portal VV8 ${res.status}`);
  }

  const html = await res.text();
  return parseSearchHtml(html);
}

function fallbackResult(): Vv8FeedsResult {
  return {
    articles: rejectStateDeputyNews(VV8_ARTICLES),
    sourceUrl: VV8_SOURCE_URL,
    updatedAt: new Date().toISOString(),
    live: false,
  };
}

async function buildVv8Feeds(): Promise<Vv8FeedsResult> {
  try {
    const articles = await fetchLiveArticles();
    if (articles.length === 0) return fallbackResult();
    return {
      articles,
      sourceUrl: VV8_SOURCE_URL,
      updatedAt: new Date().toISOString(),
      live: true,
    };
  } catch (error) {
    console.warn("[vv8-feeds] fetch failed:", error);
    return fallbackResult();
  }
}

export const getVv8Feeds = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.data;
  }

  const data = await buildVv8Feeds();
  cache = { data, expiresAt: now + CACHE_TTL_MS };
  return data;
});
