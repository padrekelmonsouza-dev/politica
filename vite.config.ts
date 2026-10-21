import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(async ({ command, mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  const plugins = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
  ];

  if (command === "build") {
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
