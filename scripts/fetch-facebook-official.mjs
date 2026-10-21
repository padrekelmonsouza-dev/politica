/**
 * Baixa as imagens OFICIAIS dos últimos posts via Facebook Embed Plugin
 * (não usa assets da pasta do site).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "facebook");
const dataFile = path.join(root, "src", "data", "facebook-posts.json");

const PAGE = "https://www.facebook.com/PadreKelmon";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const POST_IDS = [
  "1375432754686648",
  "1374659944763929",
  "1369401381956452",
  "1362921195937804",
];

function embedUrl(postUrl) {
  return (
    "https://www.facebook.com/plugins/post.php?href=" +
    encodeURIComponent(postUrl) +
    "&show_text=false&width=500"
  );
}

async function fetchEmbedHtml(postUrl) {
  const res = await fetch(embedUrl(postUrl), {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "pt-BR,pt;q=0.9",
      Referer: "https://www.facebook.com/",
    },
  });
  if (!res.ok) throw new Error(`embed ${res.status}`);
  return res.text();
}

/** Extrai a imagem do post (não avatar 50x50). */
function extractPostImage(html) {
  const urls = [...html.matchAll(/https:\/\/scontent[^"'\\\s>]+/g)].map((m) =>
    m[0].replace(/&amp;/g, "&"),
  );

  const postImgs = urls.filter(
    (u) =>
      !/s50x50|s100x100|s200x200|_s\./i.test(u) &&
      (/t51\.82787|t39\.30808-6|p180x540|p394x394|p403x403|s720x720|dst-jpg/i.test(u) ||
        /photo\.php|fbid=/i.test(html)),
  );

  // Prefer larger content images
  const preferred = postImgs.filter((u) => /t51\.82787|t39\.30808-6/i.test(u));
  return preferred[0] || postImgs[0] || null;
}

async function download(imageUrl, dest) {
  const res = await fetch(imageUrl, {
    headers: {
      "User-Agent": UA,
      Referer: "https://www.facebook.com/",
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    },
  });
  if (!res.ok) throw new Error(`img ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error(`img too small ${buf.length}`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  // remove capas antigas de assets
  for (const f of fs.readdirSync(outDir)) {
    if (f.endsWith(".jpg") || f.endsWith(".png")) {
      fs.unlinkSync(path.join(outDir, f));
    }
  }

  const posts = [];

  for (const id of POST_IDS) {
    const postUrl = `${PAGE}/posts/${id}/`;
    console.log("\n==", id);
    const html = await fetchEmbedHtml(postUrl);
    const imageUrl = extractPostImage(html);
    console.log("image", imageUrl?.slice(0, 120));

    if (!imageUrl) {
      throw new Error(`Sem imagem oficial no embed do post ${id}`);
    }

    // pedir versão maior quando possível
    const bigger = imageUrl
      .replace(/p180x540/g, "s720x720")
      .replace(/p394x394/g, "s720x720")
      .replace(/p403x403/g, "s720x720")
      .replace(/s50x50/g, "s720x720");

    const dest = path.join(outDir, `${id}.jpg`);
    let size;
    try {
      size = await download(bigger, dest);
    } catch {
      size = await download(imageUrl, dest);
    }
    console.log("saved", dest, size);

    posts.push({
      id,
      url: postUrl,
      embedUrl: embedUrl(postUrl),
      thumbnail: `/facebook/${id}.jpg`,
      title: "Publicação no Facebook",
    });

    await new Promise((r) => setTimeout(r, 800));
  }

  fs.writeFileSync(dataFile, JSON.stringify(posts, null, 2), "utf8");
  // default = primeiro post oficial
  fs.copyFileSync(path.join(outDir, `${POST_IDS[0]}.jpg`), path.join(outDir, "default.jpg"));
  console.log("\nOK — 4 capas oficiais salvas");
  console.log(JSON.stringify(posts, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
