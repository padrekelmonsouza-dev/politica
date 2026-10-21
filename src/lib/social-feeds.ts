import { createServerFn } from "@tanstack/react-start";

import facebookPostsSeed from "@/data/facebook-posts.json";
import instagramPostsSeed from "@/data/instagram-posts.json";
import tiktokPostsSeed from "@/data/tiktok-posts.json";
import xPostsSeed from "@/data/x-posts.json";
import youtubePostsSeed from "@/data/youtube-posts.json";
import { CANDIDATE } from "@/lib/campaign-data";

/** Página oficial do Facebook — fonte única */
const FACEBOOK_PAGE_URL = CANDIDATE.facebook; // https://www.facebook.com/PadreKelmon
const FACEBOOK_PAGE_SLUG = "PadreKelmon";

export type SocialNetworkId = "instagram" | "youtube" | "tiktok" | "x" | "facebook";

export type SocialPost = {
  id: string;
  url: string;
  embedUrl: string;
  title?: string;
  thumbnail?: string;
  /** Tipo da publicação (Instagram: post/reel/story). */
  kind?: "post" | "reel" | "story";
};

export type SocialNetworkFeed = {
  id: SocialNetworkId;
  name: string;
  handle: string;
  profileUrl: string;
  color: string;
  posts: SocialPost[];
};

export type SocialFeedsResult = {
  networks: SocialNetworkFeed[];
  featuredVideoId: string | null;
  updatedAt: string;
};

const YOUTUBE_CHANNEL_ID = "UCA0aqdkBHj5G4eS0raaeZhg";
/** Uploads do canal (vídeos + shorts misturados, mais recentes primeiro). */
const YOUTUBE_UPLOADS_PLAYLIST_ID = `UU${YOUTUBE_CHANNEL_ID.slice(2)}`;
/** Playlist só de Shorts. */
const YOUTUBE_SHORTS_PLAYLIST_ID = `UUSH${YOUTUBE_CHANNEL_ID.slice(2)}`;
/** Long-form (sem Shorts). */
const YOUTUBE_LONG_FORM_PLAYLIST_ID = `UULF${YOUTUBE_CHANNEL_ID.slice(2)}`;
/** Cache curto para novos posts/reels/stories aparecerem rápido no site. */
const CACHE_TTL_MS = 30 * 1000;
const POSTS_PER_NETWORK = 8;

const NETWORK_META: Record<
  SocialNetworkId,
  { name: string; handle: string; profileUrl: string; color: string }
> = {
  instagram: {
    name: "Instagram",
    handle: "@pekelmon",
    profileUrl: "https://www.instagram.com/pekelmon/",
    color: "#E4405F",
  },
  youtube: {
    name: "YouTube",
    handle: "@PadreKelmonBr",
    profileUrl: "https://www.youtube.com/@PadreKelmonBr",
    color: "#FF0000",
  },
  tiktok: {
    name: "TikTok",
    handle: "@pekelmon",
    profileUrl: "https://www.tiktok.com/@pekelmon",
    color: "#000000",
  },
  x: {
    name: "X",
    handle: "@PeKelmon",
    profileUrl: "https://x.com/PeKelmon",
    color: "#000000",
  },
  facebook: {
    name: "Facebook",
    handle: "facebook.com/PadreKelmon",
    profileUrl: FACEBOOK_PAGE_URL,
    color: "#1877F2",
  },
};

/** Last-known posts used when a live fetch is temporarily blocked. */
const FALLBACK_POSTS: Record<SocialNetworkId, SocialPost[]> = {
  instagram: (instagramPostsSeed as Array<{
    id: string;
    url: string;
    embedUrl: string;
    thumbnail?: string;
    kind?: "post" | "reel" | "story";
  }>).map((post) => ({
    id: post.id,
    url: post.url,
    embedUrl: post.embedUrl,
    ...(post.thumbnail ? { thumbnail: post.thumbnail } : {}),
    ...(post.kind ? { kind: post.kind } : {}),
  })),
  youtube: (youtubePostsSeed as Array<{
    id: string;
    url: string;
    embedUrl: string;
    thumbnail?: string;
    title?: string;
    kind?: "post" | "reel" | "story";
  }>).map((post) => ({
    id: post.id,
    url: post.url,
    embedUrl: post.embedUrl,
    ...(post.thumbnail ? { thumbnail: post.thumbnail } : {}),
    ...(post.title ? { title: post.title } : {}),
    ...(post.kind ? { kind: post.kind } : {}),
  })),
  tiktok: (tiktokPostsSeed as Array<{
    id: string;
    url: string;
    embedUrl: string;
    thumbnail?: string;
  }>).map((post) => ({
    id: post.id,
    url: post.url,
    embedUrl: post.embedUrl,
    ...(post.thumbnail ? { thumbnail: post.thumbnail } : {}),
  })),
  x: (xPostsSeed as Array<{
    id: string;
    url: string;
    embedUrl: string;
    thumbnail?: string;
    title?: string;
  }>).map((post) => ({
    id: post.id,
    url: post.url,
    embedUrl: post.embedUrl,
    ...(post.thumbnail ? { thumbnail: post.thumbnail } : {}),
    ...(post.title ? { title: post.title } : {}),
  })),
  facebook: (facebookPostsSeed as Array<{
    id: string;
    url: string;
    embedUrl: string;
    thumbnail?: string;
    title?: string;
  }>).map((post) => ({
    id: post.id,
    url: post.url,
    embedUrl: post.embedUrl,
    ...(post.thumbnail ? { thumbnail: post.thumbnail } : {}),
    ...(post.title ? { title: post.title } : {}),
  })),
};

let cache: { data: SocialFeedsResult; expiresAt: number } | null = null;
const FEEDS_CACHE_VERSION = 20; // bump: feeds 12/09/2026 — YouTube, 7Minutos, VV8
let cacheVersion = FEEDS_CACHE_VERSION;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchText(url: string, init?: RequestInit): Promise<string> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "User-Agent": UA,
      "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
      ...(init?.headers ?? {}),
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function uniqueLimit(ids: Array<string | undefined>, limit = POSTS_PER_NETWORK): string[] {
  return [...new Set(ids.filter((id): id is string => Boolean(id)))].slice(0, limit);
}

function extractMatches(text: string, pattern: RegExp): string[] {
  return [...text.matchAll(pattern)].map((m) => m[1]).filter((id): id is string => Boolean(id));
}

/** Returns true when the ID is a YouTube Short (must never appear in the grid). */
async function isYouTubeShort(videoId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
      method: "GET",
      redirect: "manual",
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(8000),
    });
    const location = res.headers.get("location") ?? "";
    // Regular videos redirect shorts URL → /watch?v=ID. Real Shorts stay on /shorts/.
    if (/\/watch\?v=/i.test(location)) return false;
    if (res.status >= 300 && res.status < 400 && location) return /\/shorts\//i.test(location);
    return res.status === 200;
  } catch {
    return false;
  }
}

async function parseYouTubeAtomPlaylist(
  playlistId: string,
  opts?: { shortsOnly?: boolean; excludeShorts?: boolean },
): Promise<Array<SocialPost & { publishedAt: number }>> {
  const xml = await fetchText(
    `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`,
  );
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
  const posts: Array<SocialPost & { publishedAt: number }> = [];

  for (const entry of entries) {
    const link = entry.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/)?.[1] ?? "";
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    if (!id) continue;

    const isShortLink = /\/shorts\//i.test(link);
    let isShort = isShortLink;
    if (opts?.shortsOnly) {
      if (!isShort && !(await isYouTubeShort(id))) continue;
      isShort = true;
    } else if (opts?.excludeShorts) {
      if (isShortLink) continue;
      if (await isYouTubeShort(id)) continue;
    } else if (!isShortLink) {
      isShort = await isYouTubeShort(id);
    }

    const title = entry.match(/<media:title>([^<]*)<\/media:title>/)?.[1];
    const thumbnail = entry.match(/<media:thumbnail url="([^"]+)"/)?.[1];
    const published =
      entry.match(/<published>([^<]+)<\/published>/)?.[1] ??
      entry.match(/<updated>([^<]+)<\/updated>/)?.[1];
    const publishedAt = published ? Date.parse(published) : 0;

    const post: SocialPost & { publishedAt: number } = {
      id,
      url: isShort
        ? `https://www.youtube.com/shorts/${id}`
        : `https://www.youtube.com/watch?v=${id}`,
      embedUrl: `https://www.youtube.com/embed/${id}`,
      publishedAt,
      kind: isShort ? "reel" : "post",
    };
    if (title) post.title = title;
    if (thumbnail) post.thumbnail = thumbnail;
    posts.push(post);
  }

  return posts;
}

async function fetchYouTubePosts(): Promise<SocialPost[]> {
  // Combina uploads recentes + Shorts + long-form — ordena pelo mais novo
  const batches = await Promise.allSettled([
    parseYouTubeAtomPlaylist(YOUTUBE_UPLOADS_PLAYLIST_ID),
    parseYouTubeAtomPlaylist(YOUTUBE_SHORTS_PLAYLIST_ID, { shortsOnly: true }),
    parseYouTubeAtomPlaylist(YOUTUBE_LONG_FORM_PLAYLIST_ID, { excludeShorts: true }),
  ]);

  const byId = new Map<string, SocialPost & { publishedAt: number }>();
  for (const batch of batches) {
    if (batch.status !== "fulfilled") continue;
    for (const post of batch.value) {
      const prev = byId.get(post.id);
      if (!prev || post.publishedAt >= prev.publishedAt) byId.set(post.id, post);
    }
  }

  return [...byId.values()]
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, POSTS_PER_NETWORK)
    .map(({ publishedAt: _p, ...post }) => post);
}

function isRealPostImage(url: string | undefined): url is string {
  if (!url) return false;
  if (url.startsWith("/instagram/") || url.startsWith("/facebook/") || url.startsWith("/x/") || url.startsWith("/tiktok/")) {
    return true;
  }
  return (
    /^https?:\/\//i.test(url) &&
    !/rsrc\.php|static\.cdninstagram\.com\/rsrc|data:image/i.test(url) &&
    /scontent|cdninstagram\.com\/v\/|fbcdn\.net|\.jpg|\.jpeg|\.png|stp=/i.test(url)
  );
}

async function fetchInstagramThumbnail(code: string): Promise<string | undefined> {
  const targets = [
    `https://www.instagram.com/reel/${code}/`,
    `https://www.instagram.com/p/${code}/`,
    `https://www.threads.com/@pekelmon/post/${code}`,
    `https://www.threads.net/@pekelmon/post/${code}`,
  ];

  for (const target of targets) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(
          `https://api.microlink.io/?url=${encodeURIComponent(target)}${attempt ? "&force=true" : ""}`,
          {
            headers: { Accept: "application/json", "User-Agent": UA },
            signal: AbortSignal.timeout(15000),
          },
        );
        if (!res.ok) continue;
        const json = (await res.json()) as {
          status?: string;
          data?: { image?: { url?: string } | string };
        };
        if (json.status !== "success") continue;
        const image = json.data?.image;
        const url = typeof image === "string" ? image : image?.url;
        if (isRealPostImage(url)) return url;
      } catch {
        // try again / next target
      }
    }
  }
  return undefined;
}

function instagramPostFromCode(
  code: string,
  kind: "post" | "reel" | "story",
  seeded?: SocialPost,
  liveThumb?: string,
): SocialPost {
  const localThumb =
    seeded?.thumbnail?.startsWith("/instagram/") && isRealPostImage(seeded.thumbnail)
      ? seeded.thumbnail
      : undefined;
  const thumbnail =
    localThumb ||
    (isRealPostImage(liveThumb) ? liveThumb : undefined) ||
    (isRealPostImage(seeded?.thumbnail) ? seeded.thumbnail : undefined) ||
    `/instagram/${code}.jpg`;

  const isReel = kind === "reel";
  const isStory = kind === "story";
  return {
    id: code,
    url: isStory
      ? `https://www.instagram.com/stories/pekelmon/${code}/`
      : isReel
        ? `https://www.instagram.com/reel/${code}/`
        : `https://www.instagram.com/p/${code}/`,
    embedUrl: isReel
      ? `https://www.instagram.com/reel/${code}/embed/`
      : isStory
        ? `https://www.instagram.com/stories/pekelmon/${code}/`
        : `https://www.instagram.com/p/${code}/embed/`,
    thumbnail,
    kind,
  };
}

async function fetchInstagramPosts(): Promise<SocialPost[]> {
  // Sem token Meta: várias fontes públicas em paralelo (jina + busca)
  const sources = [
    () =>
      fetchText("https://r.jina.ai/https://www.instagram.com/pekelmon/reels/", {
        headers: { Accept: "text/plain" },
      }),
    () =>
      fetchText("https://r.jina.ai/https://www.instagram.com/pekelmon/", {
        headers: { Accept: "text/plain" },
      }),
    () =>
      fetchText("https://r.jina.ai/https://www.instagram.com/pekelmon/channel/", {
        headers: { Accept: "text/plain" },
      }),
    () =>
      fetchText("https://r.jina.ai/https://www.threads.com/@pekelmon", {
        headers: { Accept: "text/plain" },
      }),
    () =>
      fetchText(
        "https://html.duckduckgo.com/html/?q=" +
          encodeURIComponent("site:instagram.com/reel pekelmon"),
      ),
    () =>
      fetchText(
        "https://html.duckduckgo.com/html/?q=" +
          encodeURIComponent("site:instagram.com/p/ pekelmon"),
      ),
    () => fetchText("https://www.threads.com/@pekelmon"),
  ];

  const reelCodes: string[] = [];
  const postCodes: string[] = [];
  const storyCodes: string[] = [];

  const results = await Promise.allSettled(sources.map((s) => s()));
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const text = result.value;
    reelCodes.push(
      ...extractMatches(text, /instagram\.com\/reel\/([A-Za-z0-9_-]+)/g),
      ...extractMatches(text, /\/reel\/([A-Za-z0-9_-]+)/g),
    );
    postCodes.push(
      ...extractMatches(text, /instagram\.com\/p\/([A-Za-z0-9_-]+)/g),
      ...extractMatches(text, /\/@pekelmon\/post\/([A-Za-z0-9_-]+)/g),
      ...extractMatches(text, /threads\.com\/t\/([A-Za-z0-9_-]+)/g),
    );
    storyCodes.push(
      ...extractMatches(text, /instagram\.com\/stories\/pekelmon\/([A-Za-z0-9_-]+)/g).filter(
        (id) => !/^\d+$/.test(id),
      ),
    );
  }

  const seedById = new Map(
    FALLBACK_POSTS.instagram.map((post) => [post.id, post] as const),
  );

  const kindById = new Map<string, "post" | "reel" | "story">();
  for (const code of uniqueLimit(storyCodes, 8)) kindById.set(code, "story");
  for (const code of uniqueLimit(reelCodes, 24)) {
    if (!kindById.has(code)) kindById.set(code, "reel");
  }
  for (const code of uniqueLimit(postCodes, 24)) {
    if (!kindById.has(code)) kindById.set(code, seedById.get(code)?.kind ?? "post");
  }
  for (const seeded of FALLBACK_POSTS.instagram) {
    if (!kindById.has(seeded.id)) kindById.set(seeded.id, seeded.kind ?? "post");
  }

  const orderedCodes = uniqueLimit(
    [
      ...storyCodes,
      ...reelCodes,
      ...postCodes,
      ...FALLBACK_POSTS.instagram.map((p) => p.id),
    ],
    POSTS_PER_NETWORK + 6,
  );

  if (orderedCodes.length === 0) throw new Error("No Instagram posts/reels found");

  const posts = await Promise.all(
    orderedCodes.map(async (code) => {
      const seeded = seedById.get(code);
      const kind = kindById.get(code) ?? "post";
      const localThumb =
        seeded?.thumbnail?.startsWith("/instagram/") && isRealPostImage(seeded.thumbnail)
          ? seeded.thumbnail
          : undefined;
      const liveThumb = localThumb ? undefined : await fetchInstagramThumbnail(code);
      return instagramPostFromCode(code, kind, seeded, liveThumb);
    }),
  );

  const withImages = posts.filter((post) => isRealPostImage(post.thumbnail));
  const ordered = orderNewestInstagramPosts(
    withImages.length > 0 ? withImages : FALLBACK_POSTS.instagram,
  );

  // Sem token não dá para listar stories efêmeros com segurança:
  // inclui atalho fixo para os Stories públicos do perfil.
  const storiesShortcut: SocialPost = {
    id: "stories-pekelmon",
    url: "https://www.instagram.com/stories/pekelmon/",
    embedUrl: "https://www.instagram.com/stories/pekelmon/",
    thumbnail:
      FALLBACK_POSTS.instagram.find((p) => isRealPostImage(p.thumbnail))?.thumbnail ??
      "/instagram/Db53OtOxsZL.jpg",
    kind: "story",
    title: "Stories mais recentes",
  };

  const withoutDupShortcut = ordered.filter((p) => p.id !== storiesShortcut.id);
  return [storiesShortcut, ...withoutDupShortcut].slice(0, POSTS_PER_NETWORK);
}

/** Stories e reels primeiro (conteúdo recente), depois posts — sem pin fixo. */
function orderNewestInstagramPosts(posts: SocialPost[]): SocialPost[] {
  const rank = (p: SocialPost) =>
    p.kind === "story" ? 0 : p.kind === "reel" ? 1 : 2;
  return [...posts].sort((a, b) => rank(a) - rank(b)).slice(0, POSTS_PER_NETWORK);
}

async function fetchTikTokCover(videoUrl: string): Promise<{ thumbnail?: string; title?: string }> {
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return {};
    const json = (await res.json()) as { thumbnail_url?: string; title?: string };
    const result: { thumbnail?: string; title?: string } = {};
    if (json.thumbnail_url) result.thumbnail = json.thumbnail_url;
    if (json.title) result.title = json.title;
    return result;
  } catch {
    return {};
  }
}

async function fetchTikTokPosts(): Promise<SocialPost[]> {
  const sources = [
    () =>
      fetchText("https://r.jina.ai/https://www.tiktok.com/@pekelmon", {
        headers: { Accept: "text/plain" },
      }),
    () =>
      fetchText(
        "https://html.duckduckgo.com/html/?q=" +
          encodeURIComponent("site:tiktok.com/@pekelmon/video"),
      ),
    () =>
      fetchText(
        "https://html.duckduckgo.com/html/?q=" +
          encodeURIComponent("pekelmon tiktok.com/@pekelmon/video"),
      ),
  ];

  let ids: string[] = [];
  const results = await Promise.allSettled(sources.map((s) => s()));
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const found = extractMatches(result.value, /tiktok\.com\/@pekelmon\/video\/(\d+)/gi);
    ids.push(...found);
  }
  ids = uniqueLimit(ids);

  if (ids.length === 0) {
    ids = FALLBACK_POSTS.tiktok.map((post) => post.id);
  }
  if (ids.length === 0) throw new Error("No TikTok posts found");

  const seedById = new Map(FALLBACK_POSTS.tiktok.map((post) => [post.id, post] as const));

  const posts = await Promise.all(
    ids.map(async (id) => {
      const url = `https://www.tiktok.com/@pekelmon/video/${id}`;
      const seeded = seedById.get(id);
      const localThumb =
        seeded?.thumbnail?.startsWith("/tiktok/") && seeded.thumbnail
          ? seeded.thumbnail
          : undefined;
      const live = localThumb ? {} : await fetchTikTokCover(url);
      const thumbnail = localThumb || live.thumbnail || seeded?.thumbnail || `/tiktok/${id}.jpg`;
      const post: SocialPost = {
        id,
        url,
        embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
        thumbnail,
        kind: "reel",
      };
      if (live.title) post.title = live.title;
      return post;
    }),
  );

  return posts.filter((post) => Boolean(post.thumbnail));
}

async function fetchXPostIds(): Promise<string[]> {
  const sources = [
    () => fetchText("https://zamantika.com/profile/PeKelmon"),
    () =>
      fetchText(
        "https://html.duckduckgo.com/html/?q=" +
          encodeURIComponent("site:x.com/PeKelmon/status"),
      ),
    () =>
      fetchText("https://r.jina.ai/https://x.com/PeKelmon", {
        headers: { Accept: "text/plain" },
      }),
  ];

  const all: string[] = [];
  const results = await Promise.allSettled(sources.map((s) => s()));
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const html = result.value;
    all.push(
      ...extractMatches(html, /(?:x|twitter)\.com\/PeKelmon\/status\/(\d{15,})/gi),
      ...extractMatches(html, /\/PeKelmon\/status\/(\d{15,})/gi),
      ...extractMatches(html, /status\/(\d{15,})/gi),
    );
  }

  return [...new Set(all.filter(Boolean))].sort((a, b) =>
    BigInt(b) > BigInt(a) ? 1 : -1,
  );
}

async function fetchFxTweet(id: string): Promise<{
  screenName?: string;
  title?: string;
  thumbnail?: string;
} | null> {
  try {
    const res = await fetch(`https://api.fxtwitter.com/status/${id}`, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      tweet?: {
        author?: { screen_name?: string; avatar_url?: string };
        text?: string;
        media?: {
          all?: Array<{ url?: string; thumbnail_url?: string }>;
          photos?: Array<{ url?: string }>;
          videos?: Array<{ thumbnail_url?: string; url?: string }>;
        };
      };
    };
    const tweet = json.tweet;
    if (!tweet) return null;
    const media = tweet.media?.all?.[0] || tweet.media?.photos?.[0] || tweet.media?.videos?.[0];
    const thumbnail =
      media?.thumbnail_url ||
      media?.url ||
      tweet.author?.avatar_url?.replace("_200x200", "_400x400") ||
      tweet.author?.avatar_url;
    const result: { screenName?: string; title?: string; thumbnail?: string } = {};
    if (tweet.author?.screen_name) result.screenName = tweet.author.screen_name;
    if (tweet.text) result.title = tweet.text.replace(/\s+/g, " ").slice(0, 100);
    if (thumbnail) result.thumbnail = thumbnail;
    return result;
  } catch {
    return null;
  }
}

async function fetchXPosts(): Promise<SocialPost[]> {
  const seedById = new Map(FALLBACK_POSTS.x.map((post) => [post.id, post] as const));
  let ids = await fetchXPostIds();
  if (ids.length === 0) ids = FALLBACK_POSTS.x.map((post) => post.id);
  if (ids.length === 0) throw new Error("No X posts found");

  const posts: SocialPost[] = [];
  for (const id of ids) {
    if (posts.length >= POSTS_PER_NETWORK) break;
    const live = await fetchFxTweet(id);
    if (live?.screenName && live.screenName.toLowerCase() !== "pekelmon") continue;

    const seeded = seedById.get(id);
    const localThumb =
      seeded?.thumbnail?.startsWith("/x/") && seeded.thumbnail ? seeded.thumbnail : undefined;
    const thumbnail =
      localThumb || live?.thumbnail || seeded?.thumbnail || `/x/${id}.jpg`;

    const post: SocialPost = {
      id,
      url: `https://x.com/PeKelmon/status/${id}`,
      embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${id}`,
      thumbnail,
    };
    if (live?.title) post.title = live.title;
    else if (seeded?.title) post.title = seeded.title;
    posts.push(post);
  }

  return posts.length > 0 ? posts : FALLBACK_POSTS.x;
}

function facebookPostUrl(page: string, id: string) {
  return `${page}/posts/${id}/`;
}

function extractFacebookPostIds(text: string): string[] {
  const numeric = [
    ...extractMatches(text, new RegExp(`${FACEBOOK_PAGE_SLUG}\\/posts\\/(\\d{10,})`, "g")),
    ...extractMatches(text, /fbid[=:](\d{10,})/g),
    ...extractMatches(text, /story_fbid[=:](\d{10,})/g),
    ...extractMatches(text, /multi_permalinks=(\d{10,})/g),
    ...extractMatches(text, /\/posts\/(\d{10,})/g),
  ];
  const pfbid = extractMatches(text, /\/posts\/(pfbid[A-Za-z0-9]+)/g);

  // Numeric IDs: newest first. pfbid has no sortable order — keep discovery order.
  const sortedNumeric = [...new Set(numeric)].sort((a, b) => {
    try {
      return BigInt(b) > BigInt(a) ? 1 : BigInt(b) < BigInt(a) ? -1 : 0;
    } catch {
      return b.localeCompare(a);
    }
  });

  return uniqueLimit([...sortedNumeric, ...pfbid], POSTS_PER_NETWORK * 3);
}

function buildFacebookPost(
  page: string,
  id: string,
  seeded?: SocialPost,
  liveThumb?: string,
): SocialPost {
  const url = seeded?.url?.includes(id) ? seeded.url : facebookPostUrl(page, id);
  const localThumb =
    seeded?.thumbnail?.startsWith("/facebook/") && isRealPostImage(seeded.thumbnail)
      ? seeded.thumbnail
      : undefined;

  const thumbnail =
    localThumb ||
    (isRealPostImage(liveThumb) ? liveThumb : undefined) ||
    (isRealPostImage(seeded?.thumbnail) ? seeded.thumbnail : undefined) ||
    `/facebook/${id}.jpg`;

  return {
    id,
    url,
    embedUrl:
      "https://www.facebook.com/plugins/post.php?href=" +
      encodeURIComponent(url) +
      "&show_text=false&width=500",
    thumbnail,
    title: seeded?.title ?? "Publicação no Facebook",
  };
}

/** Imagem oficial do post via Facebook Embed Plugin (não usa assets do site). */
async function fetchFacebookThumbnail(postUrl: string): Promise<string | undefined> {
  try {
    const embed =
      "https://www.facebook.com/plugins/post.php?href=" +
      encodeURIComponent(postUrl) +
      "&show_text=false&width=500";
    const html = await fetchText(embed, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        Referer: "https://www.facebook.com/",
      },
    });

    const urls = [...html.matchAll(/https:\/\/scontent[^"'\\\s>]+/g)].map((m) =>
      m[0].replace(/&amp;/g, "&"),
    );

    const postImgs = urls.filter(
      (u) =>
        !/s50x50|s100x100|s200x200/i.test(u) &&
        /t51\.82787|t39\.30808-6|p180x540|p394x394|p403x403|s720x720/i.test(u),
    );

    const preferred = postImgs.find((u) => /t51\.82787|t39\.30808-6/i.test(u));
    const picked = preferred || postImgs[0];
    return isRealPostImage(picked) ? picked : undefined;
  } catch {
    return undefined;
  }
}

async function fetchFacebookPosts(): Promise<SocialPost[]> {
  const page = FACEBOOK_PAGE_URL.replace(/\/$/, "");
  const seed = FALLBACK_POSTS.facebook;
  const seedById = new Map(seed.map((post) => [post.id, post] as const));

  const sources = [
    () => fetchText(`https://r.jina.ai/${page}`, { headers: { Accept: "text/plain" } }),
    () => fetchText(`https://r.jina.ai/${page}/posts`, { headers: { Accept: "text/plain" } }),
    () => fetchText(`https://r.jina.ai/${page}/photos_by`, { headers: { Accept: "text/plain" } }),
    () =>
      fetchText(`https://r.jina.ai/https://mbasic.facebook.com/${FACEBOOK_PAGE_SLUG}`, {
        headers: { Accept: "text/plain" },
      }),
    () =>
      fetchText(
        "https://html.duckduckgo.com/html/?q=" +
          encodeURIComponent(`site:facebook.com/${FACEBOOK_PAGE_SLUG}/posts`),
      ),
    () =>
      fetchText(
        "https://html.duckduckgo.com/html/?q=" +
          encodeURIComponent(`site:facebook.com/${FACEBOOK_PAGE_SLUG} pfbid`),
      ),
  ];

  let liveIds: string[] = [];
  const results = await Promise.allSettled(sources.map((s) => s()));
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    liveIds.push(...extractFacebookPostIds(result.value));
  }
  liveIds = uniqueLimit(liveIds, POSTS_PER_NETWORK * 3);

  const mergedIds = uniqueLimit(
    [...liveIds, ...seed.map((post) => post.id)],
    POSTS_PER_NETWORK,
  );

  if (mergedIds.length === 0) {
    return seed.slice(0, POSTS_PER_NETWORK);
  }

  const posts = await Promise.all(
    mergedIds.map(async (id) => {
      const seeded = seedById.get(id);
      const hasLocal =
        seeded?.thumbnail?.startsWith("/facebook/") && isRealPostImage(seeded.thumbnail);
      const liveThumb = hasLocal
        ? undefined
        : await fetchFacebookThumbnail(facebookPostUrl(page, id));
      return buildFacebookPost(page, id, seeded, liveThumb);
    }),
  );

  while (posts.length < POSTS_PER_NETWORK && seed[posts.length]) {
    const seeded = seed[posts.length];
    if (seeded && !posts.some((p) => p.id === seeded.id)) {
      posts.push(buildFacebookPost(page, seeded.id, seeded));
    } else {
      break;
    }
  }

  return posts.slice(0, POSTS_PER_NETWORK);
}

async function safeFetch(
  id: SocialNetworkId,
  fetcher: () => Promise<SocialPost[]>,
): Promise<SocialPost[]> {
  try {
    const posts = await fetcher();
    if (posts.length > 0) {
      FALLBACK_POSTS[id] =
        id === "instagram" ? orderNewestInstagramPosts(posts) : posts;
      return FALLBACK_POSTS[id];
    }
  } catch (error) {
    console.warn(`[social-feeds] ${id} fetch failed:`, error);
  }
  if (id === "instagram") {
    return orderNewestInstagramPosts(FALLBACK_POSTS.instagram);
  }
  return FALLBACK_POSTS[id] ?? [];
}

async function buildFeeds(): Promise<SocialFeedsResult> {
  const [instagram, youtube, tiktok, x, facebook] = await Promise.all([
    safeFetch("instagram", fetchInstagramPosts),
    safeFetch("youtube", fetchYouTubePosts),
    safeFetch("tiktok", fetchTikTokPosts),
    safeFetch("x", fetchXPosts),
    safeFetch("facebook", fetchFacebookPosts),
  ]);

  const byId: Record<SocialNetworkId, SocialPost[]> = {
    instagram: orderNewestInstagramPosts(instagram),
    youtube,
    tiktok,
    x,
    facebook,
  };

  const order: SocialNetworkId[] = ["instagram", "youtube", "tiktok", "x", "facebook"];

  return {
    networks: order.map((networkId) => ({
      id: networkId,
      ...NETWORK_META[networkId],
      posts: byId[networkId].slice(0, POSTS_PER_NETWORK),
    })),
    featuredVideoId:
      youtube.find((p) => p.kind !== "reel")?.id ?? youtube[0]?.id ?? "EI-bTS70q0U",
    updatedAt: new Date().toISOString(),
  };
}

export const getSocialFeeds = createServerFn({ method: "GET" }).handler(async () => {
  if (cacheVersion !== FEEDS_CACHE_VERSION) {
    cache = null;
    cacheVersion = FEEDS_CACHE_VERSION;
  }

  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.data;
  }

  const data = await buildFeeds();
  // Confirma o reel pinado mesmo se o scrape falhar parcialmente
  const ig = data.networks.find((network) => network.id === "instagram");
  if (ig) {
    ig.posts = orderNewestInstagramPosts(ig.posts);
  }
  const hasThumbs = ig?.posts.every((post) => isRealPostImage(post.thumbnail));
  if (hasThumbs) {
    cache = { data, expiresAt: now + CACHE_TTL_MS };
  }
  return data;
});
