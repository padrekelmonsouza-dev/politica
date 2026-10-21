import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

function readEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const out = {};
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    let value = trimmed.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function extractQuoted(filePath, key) {
  if (!existsSync(filePath)) return [];
  const text = readFileSync(filePath, "utf8");
  const re = new RegExp(`${key}:\\s*"([^"]+)"`, "g");
  const values = [];
  for (const match of text.matchAll(re)) {
    values.push(match[1]);
  }
  return values;
}

const env = {
  ...readEnvFile(resolve(process.cwd(), ".env")),
  ...readEnvFile(resolve(process.cwd(), ".env.local")),
  ...readEnvFile(resolve(process.cwd(), ".env.production")),
  ...process.env,
};

const siteUrl = String(env.VITE_SITE_URL || "https://padrekelmon.com.br")
  .trim()
  .replace(/\/$/, "");

const sitemapUrl = siteUrl ? `${siteUrl}/sitemap.xml` : "/sitemap.xml";
const lastmod = new Date().toISOString().slice(0, 10);
const src = (...parts) => resolve(process.cwd(), "src", ...parts);

const pages = [
  { path: "/", priority: "1.0" },
  { path: "/sobre", priority: "0.9" },
  { path: "/saiba-mais", priority: "0.9" },
  { path: "/pautas", priority: "0.9" },
  { path: "/midia", priority: "0.8" },
  { path: "/numeros", priority: "0.8" },
  { path: "/noticias", priority: "0.8" },
  { path: "/downloads", priority: "0.7" },
  { path: "/imprensa/7-de-setembro", priority: "0.8" },
  { path: "/links", priority: "0.7" },
  { path: "/contato", priority: "0.7" },
  { path: "/agenda", priority: "0.7" },
  { path: "/eventos", priority: "0.7" },
  { path: "/entrevistas", priority: "0.7" },
  { path: "/discursos", priority: "0.7" },
  { path: "/conteudos", priority: "0.6" },
  { path: "/mapa-do-site", priority: "0.6" },
  { path: "/colinha", priority: "0.7" },
];

const newsHrefs = extractQuoted(src("data", "site-news.ts"), "href").filter(
  (href) => href.startsWith("/") && href !== "/imprensa/7-de-setembro",
);
const interviewSlugs = extractQuoted(src("data", "site-interviews.ts"), "slug");
const speechHrefs = extractQuoted(src("data", "site-speeches.ts"), "href");
const eventHrefs = extractQuoted(src("data", "site-events.ts"), "href");

const extraPages = [
  ...newsHrefs.map((path) => ({ path, priority: "0.7" })),
  ...interviewSlugs.map((slug) => ({ path: `/entrevistas/${slug}`, priority: "0.6" })),
  ...speechHrefs.map((path) => ({ path, priority: "0.6" })),
  ...eventHrefs.map((path) => ({ path, priority: "0.6" })),
];

const seen = new Set();
const allPages = [...pages, ...extraPages].filter((page) => {
  if (seen.has(page.path)) return false;
  seen.add(page.path);
  return true;
});

const sitemapUrls = allPages
  .map((page) => {
    const href = siteUrl ? `${siteUrl}${page.path === "/" ? "/" : page.path}` : page.path;
    return `  <url>
    <loc>${href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

writeFileSync(resolve(process.cwd(), "public/sitemap.xml"), sitemap, "utf8");
writeFileSync(resolve(process.cwd(), "public/robots.txt"), robots, "utf8");

console.log(`[seo] sitemap (${allPages.length} urls) e robots gerados para ${siteUrl}`);
