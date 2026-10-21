import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "facebook");
const dataFile = path.join(root, "src", "data", "facebook-posts.json");

const POSTS = [
  "1375432754686648",
  "1374659944763929",
  "1369401381956452",
  "1362921195937804",
];

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchScreenshot(postId) {
  const pageUrl = `https://www.facebook.com/PadreKelmon/posts/${postId}/`;
  const api =
    "https://api.microlink.io/?" +
    new URLSearchParams({
      url: pageUrl,
      screenshot: "true",
      meta: "false",
      embed: "screenshot.url",
      force: "true",
    });

  const res = await fetch(api, {
    headers: { "User-Agent": UA, Accept: "*/*" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 40000) throw new Error(`too small ${buf.length}`);
  return buf;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const posts = [];

  for (let i = 0; i < POSTS.length; i++) {
    const id = POSTS[i];
    const dest = path.join(outDir, `${id}.jpg`);
    try {
      const buf = await fetchScreenshot(id);
      fs.writeFileSync(dest, buf);
      console.log(id, "ok", buf.length);
    } catch (e) {
      console.log(id, "fail", e.message);
    }
    if (i < POSTS.length - 1) await new Promise((r) => setTimeout(r, 2500));

    const hasJpg = fs.existsSync(dest) && fs.statSync(dest).size > 40000;
    const hasPng =
      fs.existsSync(path.join(outDir, `${id}.png`)) &&
      fs.statSync(path.join(outDir, `${id}.png`)).size > 40000;

    posts.push({
      id,
      url: `https://www.facebook.com/PadreKelmon/posts/${id}/`,
      embedUrl:
        "https://www.facebook.com/plugins/post.php?href=" +
        encodeURIComponent(`https://www.facebook.com/PadreKelmon/posts/${id}/`) +
        "&show_text=false&width=500",
      thumbnail: hasJpg
        ? `/facebook/${id}.jpg`
        : hasPng
          ? `/facebook/${id}.png`
          : `/facebook/${id}.jpg`,
      title: "Publicação no Facebook",
    });
  }

  fs.writeFileSync(dataFile, JSON.stringify(posts, null, 2));
  console.log("wrote", dataFile);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
