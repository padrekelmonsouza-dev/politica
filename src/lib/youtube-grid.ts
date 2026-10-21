import { createServerFn } from "@tanstack/react-start";

import { YOUTUBE_HIGHLIGHTS, type YoutubeHighlight } from "@/data/youtube-highlights";

const YOUTUBE_CHANNEL_ID = "UCA0aqdkBHj5G4eS0raaeZhg";
const CACHE_TTL_MS = 60_000;

let cache: { data: YoutubeHighlight[]; expiresAt: number } | null = null;

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function fetchLiveUploads(): Promise<YoutubeHighlight[]> {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
    { signal: AbortSignal.timeout(10_000) },
  );
  if (!res.ok) throw new Error(`YouTube feed ${res.status}`);
  const xml = await res.text();

  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map((match) => {
      const entry = match[1] ?? "";
      const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
      const title = decodeXml(entry.match(/<media:title>([^<]*)<\/media:title>/)?.[1] ?? "");
      const description = decodeXml(
        entry.match(/<media:description>([^<]*)<\/media:description>/)?.[1] ?? "",
      );
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
      const views = Number(entry.match(/<media:statistics[^>]*views="(\d+)"/)?.[1] ?? 0);

      return {
        id,
        title,
        description: description || title,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        views,
        published: published.slice(0, 10),
      } satisfies YoutubeHighlight;
    })
    .filter((video) => video.id);
}

function mergeVideos(live: YoutubeHighlight[]) {
  const byId = new Map<string, YoutubeHighlight>();

  for (const video of YOUTUBE_HIGHLIGHTS) {
    byId.set(video.id, video);
  }

  for (const video of live) {
    const previous = byId.get(video.id);
    byId.set(video.id, {
      ...previous,
      ...video,
      description: previous?.description || video.description,
      views: video.views || previous?.views || 0,
    });
  }

  return [...byId.values()].sort(
    (a, b) => Date.parse(b.published || "") - Date.parse(a.published || ""),
  );
}

export const getYoutubeGridVideos = createServerFn({ method: "GET" }).handler(async () => {
  if (cache && cache.expiresAt > Date.now()) return cache.data;

  let live: YoutubeHighlight[] = [];
  try {
    live = await fetchLiveUploads();
  } catch {
    live = [];
  }

  const data = mergeVideos(live);
  cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  return data;
});
