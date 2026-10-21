import { readFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

/** Rotas do sitemap gerado no prebuild — ponto de partida do prerender estático. */
function sitemapPaths(): string[] {
  try {
    const xml = readFileSync(`${process.cwd()}/public/sitemap.xml`, "utf8");
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      ([, loc]) => new URL(loc ?? "/", "https://padrekelmon.com.br").pathname,
    );
    return [...new Set(["/", ...paths])];
  } catch {
    return ["/"];
  }
}

export default defineConfig(async ({ command, mode }) => {
  // `vite build --mode static`: HTML pré-renderizado para hospedagem PHP/HTML (sem Node).
  const isStatic = mode === "static";
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  if (isStatic) loadedEnv["VITE_STATIC_SITE"] = "1";
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  const plugins = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
      ...(isStatic && {
        prerender: {
          enabled: true,
          crawlLinks: true,
          autoSubfolderIndex: true,
          failOnError: false,
          // O crawler salva a resposta como texto: arquivos binários (png, mp4) sairiam corrompidos.
          filter: ({ path }: { path: string }) => !path.includes("#") && !/\.\w+$/.test(path),
        },
        pages: sitemapPaths().map((path) => ({ path })),
      }),
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
  ];

  if (command === "build" && !isStatic) {
    const { nitro } = await import("nitro/vite");
    plugins.push(
      nitro({
        // Hospedagem Node (painel Nitro / entry server/index.mjs).
        // Não usar cloudflare-module aqui — gera Worker e causa 503 no Node.
        defaultPreset: "node-server",
        // Evita chunks circulares (__commonJSMin) que quebram o SSR em runtime.
        rolldownConfig: {
          platform: "node",
          output: {
            codeSplitting: false,
          },
        },
        routeRules: {
          // HTML nunca pode ficar em cache longo — senão o navegador
          // guarda página sem CSS/JS atual após um deploy.
          "/**": {
            headers: {
              "cache-control": "no-cache, no-store, must-revalidate",
              "x-content-type-options": "nosniff",
              "x-frame-options": "SAMEORIGIN",
              "referrer-policy": "strict-origin-when-cross-origin",
              "permissions-policy": "camera=(), microphone=(), geolocation=()",
            },
          },
          "/assets/**": {
            headers: {
              "cache-control": "public, max-age=31536000, immutable",
            },
          },
          "/**/*.{webp,jpg,jpeg,png,ico,css,js,mjs,mp4}": {
            headers: {
              "cache-control": "public, max-age=604800",
            },
          },
          "/sw.js": {
            headers: {
              "cache-control": "no-cache, no-store, must-revalidate",
              "content-type": "application/javascript; charset=utf-8",
              "service-worker-allowed": "/",
            },
          },
          "/manifest.webmanifest": {
            headers: {
              "cache-control": "no-cache, no-store, must-revalidate",
              "content-type": "application/manifest+json; charset=utf-8",
            },
          },
          "/google6e3cc8fc1fe21502.html": {
            headers: {
              "cache-control": "no-cache, no-store, must-revalidate",
              "content-type": "text/html; charset=utf-8",
            },
          },
          "/bio": { redirect: { to: "/links", statusCode: 301 } },
          "/biografia": { redirect: { to: "/sobre", statusCode: 301 } },
          "/redes-sociais": { redirect: { to: "/links", statusCode: 301 } },
        },
      }),
    );
  }

  plugins.push(viteReact());

  return {
    define: envDefine,
    server: {
      host: "::",
      port: 8080,
      // Saídas de build têm mídias grandes; vigiá-las derruba o dev server no Windows (EBUSY).
      watch: { ignored: ["**/.output/**", "**/dist/**"] },
    },
    resolve: {
      alias: {
        "@": `${process.cwd()}/src`,
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
    plugins,
  };
});
