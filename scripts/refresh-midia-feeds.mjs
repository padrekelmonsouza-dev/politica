/**
 * Atualiza fallbacks da página Mídia: VV8, 7Minutos, Instagram, YouTube, TikTok, X, Facebook.
 * Uso: node scripts/refresh-midia-feeds.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const POSTS_PER_NETWORK = 8;
const YOUTUBE_CHANNEL_ID = "UCA0aqdkBHj5G4eS0raaeZhg";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url, extra = {}) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
      ...extra,
    },
    signal: AbortSignal.timeout(25000),
    redirect: "follow",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${url} (${text.slice(0, 80)})`);
  return text;
}

function extractMatches(text, pattern) {
  return [...text.matchAll(pattern)].map((m) => m[1]).filter(Boolean);
}

function uniqueLimit(ids, limit = POSTS_PER_NETWORK) {
  return [...new Set(ids.filter(Boolean))].slice(0, limit);
}

function cleanText(raw) {
  return String(raw ?? "")
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

function mentionsKelmon(title, url) {
  return /kelmon/i.test(title) || /kelmon/i.test(url);
}

async function downloadImage(url, dest, extraHeaders = {}) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      ...extraHeaders,
    },
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`img ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4000) throw new Error(`img too small ${buf.length}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function tsEscape(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function writeTsArticles(file, header, sourceUrlExport, sourceUrl, articles) {
  const body = articles
    .map((a) => {
      const title =
        a.title.length > 90
          ? `    title:\n      "${tsEscape(a.title)}",`
          : `    title: "${tsEscape(a.title)}",`;
      return `  {
    id: "${a.id}",
${title}
    eyebrow: "${tsEscape(a.eyebrow)}",
    url: "${a.url}",
    image: "${a.image}",
    source: "${tsEscape(a.source)}",
  }`;
    })
    .join(",\n");

  const contents = `${header}
export const ${sourceUrlExport} = "${sourceUrl}";

export const ${header.includes("VV8") ? "VV8_ARTICLES" : "PRESS_ARTICLES"}: PressArticle[] = [
${body},
];
`;
  fs.writeFileSync(file, contents, "utf8");
}

async function fetchVv8() {
  const html = await fetchText("https://portalvv8.com.br/busca/noticias/kelmon", {
    Accept: "text/html,application/xhtml+xml",
  });

  const ARTICLE_RE = new RegExp(
    [
      String.raw`<a href="(https://portalvv8\.com\.br/noticia/(\d+)/[^"]+)"[^>]*class="lista-home-4[^"]*"`,
      String.raw`[\s\S]*?data-src="([^"]+)"`,
      String.raw`[\s\S]*?chapeu-lista-home-4">\s*<b>(.*?)</b>`,
      String.raw`[\s\S]*?<h3>(.*?)</h3>`,
    ].join(""),
    "gi",
  );

  const start = html.indexOf('class="conteudo-interno lista-interna"');
  const endMarker = html.indexOf("ultimas-noticias", start === -1 ? 0 : start);
  const chunk = start !== -1 && endMarker !== -1 ? html.slice(start, endMarker) : html;

  const articles = [];
  const seen = new Set();
  for (const match of chunk.matchAll(ARTICLE_RE)) {
    const [, url, id, image, eyebrowRaw, titleRaw] = match;
    const title = cleanText(titleRaw);
    const eyebrow = cleanText(eyebrowRaw) || "Portal VV8";
    if (!url || !title || !mentionsKelmon(title, url)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    articles.push({
      id: `vv8-${id}`,
      title,
      eyebrow,
      url,
      image,
      source: "Portal VV8",
    });
    if (articles.length >= 16) break;
  }

  // Fallback: parse markdown-ish / looser links
  if (articles.length === 0) {
    const loose = [
      ...html.matchAll(
        /href="(https:\/\/portalvv8\.com\.br\/noticia\/(\d+)\/[^"]+)"[\s\S]{0,800}?<h3>(.*?)<\/h3>/gi,
      ),
    ];
    for (const m of loose) {
      const url = m[1];
      const id = m[2];
      const title = cleanText(m[3]);
      if (!mentionsKelmon(title, url) || seen.has(id)) continue;
      seen.add(id);
      articles.push({
        id: `vv8-${id}`,
        title,
        eyebrow: "Portal VV8",
        url,
        image: "",
        source: "Portal VV8",
      });
    }
  }

  return articles;
}

async function fetchPress() {
  const json = await fetchText(
    "https://7minutos.com.br/wp-json/wp/v2/posts?search=Kelmon&per_page=20&_embed=1&orderby=date&order=desc",
    { Accept: "application/json" },
  );
  const posts = JSON.parse(json);
  const articles = [];
  for (const post of posts) {
    const title = cleanText(post.title?.rendered ?? "");
    const url = post.link ?? "";
    if (!title || !url || !mentionsKelmon(title, url)) continue;
    const media = post._embedded?.["wp:featuredmedia"]?.[0];
    const sizes = media?.media_details?.sizes ?? {};
    const image =
      sizes.medium_large?.source_url ||
      sizes.large?.source_url ||
      sizes.medium?.source_url ||
      media?.source_url ||
      "";
    let eyebrow = "7Minutos";
    for (const group of post._embedded?.["wp:term"] ?? []) {
      for (const term of group) {
        if (term.taxonomy === "category" && term.name) {
          eyebrow = cleanText(term.name)
            .replace(/^[^A-Za-zÀ-ÿ]+/, "")
            .replace(/^Notícias\s*:\s*/i, "")
            .replace(/^Estilo\s*:\s*/i, "")
            .replace(/^Variedades\s*:\s*/i, "")
            .trim() || eyebrow;
          break;
        }
      }
    }
    articles.push({
      id: String(post.id),
      title,
      eyebrow,
      url,
      image,
      source: "7Minutos",
    });
    if (articles.length >= 16) break;
  }
  return articles;
}

async function fetchYouTube() {
  const xml = await fetchText(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
  );
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
  const posts = [];
  for (const entry of entries) {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    if (!id) continue;
    const title = entry.match(/<media:title>([^<]*)<\/media:title>/)?.[1];
    const thumbnail = entry.match(/<media:thumbnail url="([^"]+)"/)?.[1];
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];
    const link = entry.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/)?.[1] ?? "";
    const isShort = /\/shorts\//i.test(link);
    posts.push({
      id,
      url: isShort
        ? `https://www.youtube.com/shorts/${id}`
        : `https://www.youtube.com/watch?v=${id}`,
      embedUrl: `https://www.youtube.com/embed/${id}`,
      title,
      thumbnail: thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      kind: isShort ? "reel" : "post",
      published,
    });
    if (posts.length >= POSTS_PER_NETWORK) break;
  }
  return posts;
}

async function fetchInstagramCodes() {
  const sources = [
    "https://r.jina.ai/https://www.instagram.com/pekelmon/reels/",
    "https://r.jina.ai/https://www.instagram.com/pekelmon/",
    "https://r.jina.ai/https://www.instagram.com/pekelmon/channel/",
    "https://html.duckduckgo.com/html/?q=" +
      encodeURIComponent("site:instagram.com/reel pekelmon"),
    "https://html.duckduckgo.com/html/?q=" +
      encodeURIComponent("site:instagram.com/p/ pekelmon"),
  ];
  const reelCodes = [];
  const postCodes = [];
  for (const url of sources) {
    try {
      const text = await fetchText(url, { Accept: "text/plain,text/html,*/*" });
      reelCodes.push(
        ...extractMatches(text, /instagram\.com\/reel\/([A-Za-z0-9_-]+)/g),
        ...extractMatches(text, /\/reel\/([A-Za-z0-9_-]+)/g),
      );
      postCodes.push(...extractMatches(text, /instagram\.com\/p\/([A-Za-z0-9_-]+)/g));
    } catch (e) {
      console.warn("ig source fail", url.slice(0, 70), e.message);
    }
  }
  return { reelCodes: uniqueLimit(reelCodes, 12), postCodes: uniqueLimit(postCodes, 12) };
}

async function microlinkImage(target) {
  for (const force of [false, true]) {
    try {
      const api =
        "https://api.microlink.io/?url=" +
        encodeURIComponent(target) +
        (force ? "&force=true" : "");
      const json = JSON.parse(await fetchText(api, { Accept: "application/json" }));
      if (json.status !== "success") continue;
      const image = json.data?.image;
      const url = typeof image === "string" ? image : image?.url;
      if (url && /^https?:\/\//i.test(url)) return url;
    } catch {
      // next
    }
  }
  return undefined;
}

async function fetchTikTokIds() {
  const sources = [
    "https://r.jina.ai/https://www.tiktok.com/@pekelmon",
    "https://html.duckduckgo.com/html/?q=" +
      encodeURIComponent("site:tiktok.com/@pekelmon/video"),
  ];
  const ids = [];
  for (const url of sources) {
    try {
      const text = await fetchText(url, { Accept: "text/plain,text/html,*/*" });
      ids.push(...extractMatches(text, /tiktok\.com\/@pekelmon\/video\/(\d+)/gi));
    } catch (e) {
      console.warn("tt source fail", e.message);
    }
  }
  return uniqueLimit(ids, POSTS_PER_NETWORK);
}

async function fetchTikTokCover(videoUrl) {
  try {
    const json = JSON.parse(
      await fetchText(`https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`, {
        Accept: "application/json",
      }),
    );
    return { thumbnail: json.thumbnail_url, title: json.title };
  } catch {
    return {};
  }
}

async function fetchXIds() {
  const sources = [
    "https://zamantika.com/profile/PeKelmon",
    "https://html.duckduckgo.com/html/?q=" +
      encodeURIComponent("site:x.com/PeKelmon/status"),
    "https://r.jina.ai/https://x.com/PeKelmon",
  ];
  const all = [];
  for (const url of sources) {
    try {
      const html = await fetchText(url, { Accept: "text/plain,text/html,*/*" });
      all.push(
        ...extractMatches(html, /(?:x|twitter)\.com\/PeKelmon\/status\/(\d{15,})/gi),
        ...extractMatches(html, /\/PeKelmon\/status\/(\d{15,})/gi),
        ...extractMatches(html, /status\/(\d{15,})/gi),
      );
    } catch (e) {
      console.warn("x source fail", e.message);
    }
  }
  return [...new Set(all.filter(Boolean))]
    .sort((a, b) => (BigInt(b) > BigInt(a) ? 1 : -1))
    .slice(0, POSTS_PER_NETWORK);
}

async function fetchFxTweet(id) {
  try {
    const json = JSON.parse(
      await fetchText(`https://api.fxtwitter.com/status/${id}`, { Accept: "application/json" }),
    );
    const tweet = json.tweet;
    if (!tweet) return null;
    const media = tweet.media?.all?.[0] || tweet.media?.photos?.[0] || tweet.media?.videos?.[0];
    const thumbnail =
      media?.thumbnail_url ||
      media?.url ||
      tweet.author?.avatar_url?.replace("_200x200", "_400x400") ||
      tweet.author?.avatar_url;
    return {
      screenName: tweet.author?.screen_name,
      title: tweet.text?.replace(/\s+/g, " ").slice(0, 100),
      thumbnail,
    };
  } catch {
    return null;
  }
}

function extractFacebookPostIds(text) {
  const numeric = [
    ...extractMatches(text, /PadreKelmon\/posts\/(\d{10,})/g),
    ...extractMatches(text, /fbid[=:](\d{10,})/g),
    ...extractMatches(text, /story_fbid[=:](\d{10,})/g),
    ...extractMatches(text, /multi_permalinks=(\d{10,})/g),
    ...extractMatches(text, /\/posts\/(\d{10,})/g),
  ];
  const pfbid = extractMatches(text, /\/posts\/(pfbid[A-Za-z0-9]+)/g);
  const sortedNumeric = [...new Set(numeric)].sort((a, b) => {
    try {
      return BigInt(b) > BigInt(a) ? 1 : BigInt(b) < BigInt(a) ? -1 : 0;
    } catch {
      return b.localeCompare(a);
    }
  });
  return uniqueLimit([...sortedNumeric, ...pfbid], POSTS_PER_NETWORK * 2);
}

async function fetchFacebookIds() {
  const page = "https://www.facebook.com/PadreKelmon";
  const sources = [
    `https://r.jina.ai/${page}`,
    `https://r.jina.ai/${page}/posts`,
    `https://r.jina.ai/https://mbasic.facebook.com/PadreKelmon`,
    "https://html.duckduckgo.com/html/?q=" +
      encodeURIComponent("site:facebook.com/PadreKelmon/posts"),
  ];
  const ids = [];
  for (const url of sources) {
    try {
      const text = await fetchText(url, { Accept: "text/plain,text/html,*/*" });
      ids.push(...extractFacebookPostIds(text));
    } catch (e) {
      console.warn("fb source fail", e.message);
    }
  }
  return uniqueLimit(ids, POSTS_PER_NETWORK);
}

async function fetchFacebookThumb(postUrl) {
  try {
    const embed =
      "https://www.facebook.com/plugins/post.php?href=" +
      encodeURIComponent(postUrl) +
      "&show_text=false&width=500";
    const html = await fetchText(embed, {
      Accept: "text/html,application/xhtml+xml",
      Referer: "https://www.facebook.com/",
    });
    const urls = [...html.matchAll(/https:\/\/scontent[^"'\\\s>]+/g)].map((m) =>
      m[0].replace(/&amp;/g, "&"),
    );
    const postImgs = urls.filter(
      (u) =>
        !/s50x50|s100x100|s200x200/i.test(u) &&
        /t51\.82787|t39\.30808-6|p180x540|p394x394|p403x403|s720x720/i.test(u),
    );
    return postImgs.find((u) => /t51\.82787|t39\.30808-6/i.test(u)) || postImgs[0];
  } catch {
    return undefined;
  }
}

function writeJson(rel, data) {
  const file = path.join(root, rel);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("wrote", rel, data.length);
}

async function main() {
  console.log("== VV8");
  const vv8 = await fetchVv8();
  console.log(vv8.map((a) => `${a.id} | ${a.title}`).join("\n"));

  console.log("\n== 7Minutos");
  const press = await fetchPress();
  console.log(press.map((a) => `${a.id} | ${a.date || ""} | ${a.title}`).join("\n"));

  console.log("\n== YouTube");
  const youtube = await fetchYouTube();
  console.log(youtube.map((p) => `${p.id} | ${p.published} | ${p.title}`).join("\n"));

  console.log("\n== Instagram");
  const igCodes = await fetchInstagramCodes();
  console.log("reels", igCodes.reelCodes);
  console.log("posts", igCodes.postCodes);

  const igExisting = JSON.parse(
    fs.readFileSync(path.join(root, "src/data/instagram-posts.json"), "utf8"),
  );
  const igById = new Map(igExisting.map((p) => [p.id, p]));
  const igOrdered = uniqueLimit(
    [...igCodes.reelCodes, ...igCodes.postCodes, ...igExisting.map((p) => p.id)],
    POSTS_PER_NETWORK,
  );
  const instagram = [];
  for (const code of igOrdered) {
    const kind = igCodes.reelCodes.includes(code)
      ? "reel"
      : igById.get(code)?.kind || "post";
    const url =
      kind === "reel"
        ? `https://www.instagram.com/reel/${code}/`
        : `https://www.instagram.com/p/${code}/`;
    const dest = path.join(root, "public/instagram", `${code}.jpg`);
    const hasLocal = fs.existsSync(dest) && fs.statSync(dest).size > 4000;
    if (!hasLocal) {
      const live = await microlinkImage(url);
      if (live) {
        try {
          await downloadImage(live, dest, { Referer: "https://www.instagram.com/" });
          console.log("ig thumb", code, "ok");
        } catch (e) {
          console.warn("ig thumb fail", code, e.message);
        }
      }
    }
    instagram.push({
      id: code,
      url,
      embedUrl:
        kind === "reel"
          ? `https://www.instagram.com/reel/${code}/embed/`
          : `https://www.instagram.com/p/${code}/embed/`,
      thumbnail: `/instagram/${code}.jpg`,
      kind,
    });
    await sleep(400);
  }

  console.log("\n== TikTok");
  const ttExisting = JSON.parse(
    fs.readFileSync(path.join(root, "src/data/tiktok-posts.json"), "utf8"),
  );
  let ttIds = await fetchTikTokIds();
  ttIds = uniqueLimit([...ttIds, ...ttExisting.map((p) => p.id)], POSTS_PER_NETWORK);
  const tiktok = [];
  for (const id of ttIds) {
    const url = `https://www.tiktok.com/@pekelmon/video/${id}`;
    const dest = path.join(root, "public/tiktok", `${id}.jpg`);
    const hasLocal = fs.existsSync(dest) && fs.statSync(dest).size > 4000;
    let title;
    if (!hasLocal) {
      const live = await fetchTikTokCover(url);
      title = live.title;
      if (live.thumbnail) {
        try {
          await downloadImage(live.thumbnail, dest, { Referer: "https://www.tiktok.com/" });
          console.log("tt thumb", id, "ok");
        } catch (e) {
          console.warn("tt thumb fail", id, e.message);
        }
      }
    }
    tiktok.push({
      id,
      url,
      embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
      thumbnail: `/tiktok/${id}.jpg`,
      ...(title ? { title } : {}),
    });
  }

  console.log("\n== X");
  const xExisting = JSON.parse(fs.readFileSync(path.join(root, "src/data/x-posts.json"), "utf8"));
  let xIds = await fetchXIds();
  xIds = uniqueLimit([...xIds, ...xExisting.map((p) => p.id)], POSTS_PER_NETWORK);
  console.log("x ids", xIds);
  const xPosts = [];
  for (const id of xIds) {
    const live = await fetchFxTweet(id);
    if (live?.screenName && live.screenName.toLowerCase() !== "pekelmon") {
      console.log("skip x", id, live.screenName);
      continue;
    }
    const dest = path.join(root, "public/x", `${id}.jpg`);
    const hasLocal = fs.existsSync(dest) && fs.statSync(dest).size > 4000;
    if (!hasLocal && live?.thumbnail) {
      try {
        await downloadImage(live.thumbnail, dest, { Referer: "https://x.com/" });
        console.log("x thumb", id, "ok");
      } catch (e) {
        console.warn("x thumb fail", id, e.message);
      }
    }
    const post = {
      id,
      url: `https://x.com/PeKelmon/status/${id}`,
      embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${id}`,
      thumbnail: `/x/${id}.jpg`,
    };
    if (live?.title) post.title = live.title;
    else {
      const seeded = xExisting.find((p) => p.id === id);
      if (seeded?.title) post.title = seeded.title;
    }
    xPosts.push(post);
    if (xPosts.length >= POSTS_PER_NETWORK) break;
  }

  console.log("\n== Facebook");
  const fbExisting = JSON.parse(
    fs.readFileSync(path.join(root, "src/data/facebook-posts.json"), "utf8"),
  );
  let fbIds = await fetchFacebookIds();
  fbIds = uniqueLimit([...fbIds, ...fbExisting.map((p) => p.id)], POSTS_PER_NETWORK);
  console.log("fb ids", fbIds);
  const facebook = [];
  for (const id of fbIds) {
    const postUrl = `https://www.facebook.com/PadreKelmon/posts/${id}/`;
    const dest = path.join(root, "public/facebook", `${id}.jpg`);
    const hasLocal = fs.existsSync(dest) && fs.statSync(dest).size > 4000;
    if (!hasLocal) {
      const live = await fetchFacebookThumb(postUrl);
      if (live) {
        try {
          await downloadImage(live, dest, { Referer: "https://www.facebook.com/" });
          console.log("fb thumb", id, "ok");
        } catch (e) {
          console.warn("fb thumb fail", id, e.message);
        }
      }
    }
    facebook.push({
      id,
      url: postUrl,
      embedUrl:
        "https://www.facebook.com/plugins/post.php?href=" +
        encodeURIComponent(postUrl) +
        "&show_text=false&width=500",
      thumbnail: `/facebook/${id}.jpg`,
      title: "Publicação no Facebook",
    });
    await sleep(500);
  }

  // Write social JSON
  writeJson("src/data/instagram-posts.json", instagram);
  writeJson("src/data/tiktok-posts.json", tiktok);
  writeJson("src/data/x-posts.json", xPosts);
  writeJson("src/data/facebook-posts.json", facebook);
  writeJson("src/data/youtube-posts.json", youtube);

  // Write press TS
  const pressFile = path.join(root, "src/data/press-articles.ts");
  const pressBody = press
    .map((a) => {
      const title =
        a.title.length > 88
          ? `    title:\n      "${tsEscape(a.title)}",`
          : `    title: "${tsEscape(a.title)}",`;
      return `  {
    id: "${a.id}",
${title}
    eyebrow: "${tsEscape(a.eyebrow)}",
    url: "${a.url}",
    image: "${a.image}",
    source: "7Minutos",
  }`;
    })
    .join(",\n");
  fs.writeFileSync(
    pressFile,
    `/** Matérias sobre Padre Kelmon no portal 7Minutos (fonte pública). */
export type PressArticle = {
  id: string;
  title: string;
  eyebrow: string;
  url: string;
  image: string;
  source: string;
};

export const PRESS_ARTICLES: PressArticle[] = [
${pressBody},
];

export const PRESS_SOURCE_URL = "https://7minutos.com.br/?s=Padre+Kelmon";
`,
    "utf8",
  );
  console.log("wrote src/data/press-articles.ts", press.length);

  const vv8File = path.join(root, "src/data/vv8-articles.ts");
  const vv8Body = vv8
    .map((a) => {
      const title =
        a.title.length > 88
          ? `    title:\n      "${tsEscape(a.title)}",`
          : `    title: "${tsEscape(a.title)}",`;
      const image =
        a.id === "vv8-67928" ? "/news/vv8-kelmon-pro-vida-2010.webp" : a.image;
      return `  {
    id: "${a.id}",
${title}
    eyebrow: "${tsEscape(a.eyebrow)}",
    url: "${a.url}",
    image: "${image}",
    source: "Portal VV8",
  }`;
    })
    .join(",\n");
  fs.writeFileSync(
    vv8File,
    `/** Fallback estático — Portal VV8 (atualizado automaticamente em produção via scrape). */
import type { PressArticle } from "./press-articles";

export const VV8_SOURCE_URL = "https://portalvv8.com.br/busca/noticias/kelmon";

export const VV8_ARTICLES: PressArticle[] = [
${vv8Body},
];
`,
    "utf8",
  );
  console.log("wrote src/data/vv8-articles.ts", vv8.length);

  console.log("\nDONE");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
