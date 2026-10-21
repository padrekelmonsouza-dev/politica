/**
 * Gera public/data/*.json com o resultado das server functions, para a
 * versão estática do site (hospedagem PHP/HTML sem Node.js).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "data");

const SP_LAT = -23.5505;
const SP_LON = -46.6333;

const SNAPSHOTS = [
  { name: "social-feeds", module: "/src/lib/social-feeds.ts", fn: "getSocialFeeds" },
  { name: "press-feeds", module: "/src/lib/press-feeds.ts", fn: "getPressFeeds" },
  { name: "vv8-feeds", module: "/src/lib/vv8-feeds.ts", fn: "getVv8Feeds" },
  { name: "foro-feeds", module: "/src/lib/foro-feeds.ts", fn: "getForoFeeds" },
  { name: "pl-feeds", module: "/src/lib/pl-feeds.ts", fn: "getPlFeeds" },
  { name: "youtube-grid", module: "/src/lib/youtube-grid.ts", fn: "getYoutubeGridVideos" },
  { name: "timeline-photos", module: "/src/lib/timeline-photos.ts", fn: "getTimelinePhotos" },
  { name: "market-fuel", module: "/src/lib/market-fuel.ts", fn: "getMarketFuel" },
  {
    name: "local-now",
    module: "/src/lib/local-now.ts",
    fn: "getLocalNow",
    args: { data: { lat: SP_LAT, lon: SP_LON } },
  },
];

/** Server functions exigem o contexto de request do TanStack Start (AsyncLocalStorage global). */
function runInStartContext(fn) {
  const storage = globalThis[Symbol.for("tanstack-start:start-storage-context")];
  if (!storage) return fn();
  return storage.run(
    {
      request: new Request("https://padrekelmon.com.br/"),
      startOptions: {},
      contextAfterGlobalMiddlewares: {},
      executedRequestMiddlewares: new Set(),
      handlerType: "serverFn",
      getRouter: () => {
        throw new Error("router indisponível no snapshot");
      },
    },
    fn,
  );
}

const server = await createServer({
  root,
  logLevel: "error",
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: "custom",
});

let failures = 0;
try {
  mkdirSync(outDir, { recursive: true });
  for (const snap of SNAPSHOTS) {
    try {
      const mod = await server.ssrLoadModule(snap.module);
      const data = await runInStartContext(() => mod[snap.fn](snap.args));
      writeFileSync(join(outDir, `${snap.name}.json`), JSON.stringify(data));
      console.log(`[snapshot] ${snap.name}.json ok`);
    } catch (error) {
      failures += 1;
      console.warn(`[snapshot] ${snap.name} falhou: ${error?.message ?? error}`);
    }
  }
} finally {
  await server.close();
}

if (failures) console.warn(`[snapshot] ${failures} snapshot(s) falharam; o site usará o conteúdo padrão.`);
process.exit(0);
