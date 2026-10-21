import { createServerFn } from "@tanstack/react-start";
import { copyFile, mkdir, readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const IMAGE_EXT = new Set([".webp", ".jpg", ".jpeg", ".png", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v"]);
const MEDIA_EXT = new Set([...IMAGE_EXT, ...VIDEO_EXT]);
const RAW_IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".avif"]);

export const TIMELINE_FOLDERS = [
  "historia-em-imagens",
  "minhas-raizes",
  "na-juventude",
  "seminario",
  "ordenacao-diaconal",
  "associacao",
  "seminario-santana-dos-melquitas",
  "ordenacao-ortodoxa",
  "missao-ortodoxa-em-serrolandia",
  "pastoral-com-venezuelanos",
  "livro-fe-e-politica",
  "ilha-de-mare",
  "atividades-politicas",
] as const;

/** Pastas antigas → pasta atual (compatibilidade). */
const FOLDER_ALIASES: Record<string, string[]> = {
  "ordenacao-diaconal": ["ordenacao-diaconal", "ordenacao-sacerdotal"],
  associacao: ["associacao", "ativismo-e-missoes"],
};

export type TimelineFolderId = (typeof TIMELINE_FOLDERS)[number];

export type TimelineMediaKind = "image" | "video";

export type TimelinePhotoFile = {
  src: string;
  name: string;
  kind: TimelineMediaKind;
};

export type TimelinePhotosResult = {
  byFolder: Record<string, TimelinePhotoFile[]>;
  updatedAt: string;
};

function publicTimelineRoot(): string {
  return path.join(process.cwd(), "public", "timeline");
}

function assetsTimelineRoot(): string {
  return path.join(process.cwd(), "src", "assets", "timeline");
}

function isImageFile(name: string): boolean {
  return IMAGE_EXT.has(path.extname(name).toLowerCase());
}

function isVideoFile(name: string): boolean {
  return VIDEO_EXT.has(path.extname(name).toLowerCase());
}

function isMediaFile(name: string): boolean {
  return MEDIA_EXT.has(path.extname(name).toLowerCase());
}

function mediaKind(name: string): TimelineMediaKind {
  return isVideoFile(name) ? "video" : "image";
}

function stemOf(name: string): string {
  return path.parse(name).name;
}

async function listImageFiles(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && isImageFile(e.name) && !e.name.startsWith("."))
      .map((e) => e.name);
  } catch {
    return [];
  }
}

async function listMediaFiles(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && isMediaFile(e.name) && !e.name.startsWith("."))
      .map((e) => e.name);
  } catch {
    return [];
  }
}

/**
 * public/timeline = fonte da verdade.
 * Espelha o que está em public para assets (backup) e remove de assets
 * o que foi apagado em public — assim deletar na pasta some do site.
 */
async function mirrorPublicToAssets(folder: string): Promise<void> {
  const aliases = FOLDER_ALIASES[folder] ?? [folder];
  const publicDir = path.join(publicTimelineRoot(), folder);
  await mkdir(publicDir, { recursive: true });

  const publicNames = new Set(await listMediaFiles(publicDir));

  for (const alias of aliases) {
    const assetsDir = path.join(assetsTimelineRoot(), alias);
    await mkdir(assetsDir, { recursive: true });

    // Remove do assets o que não existe mais no public
    const assetNames = await listMediaFiles(assetsDir);
    await Promise.all(
      assetNames.map(async (name) => {
        if (!publicNames.has(name)) {
          try {
            await unlink(path.join(assetsDir, name));
          } catch {
            // ignore
          }
        }
      }),
    );

    // Copia public → assets (novos / atualizados)
    for (const name of publicNames) {
      const from = path.join(publicDir, name);
      const to = path.join(assetsDir, name);
      try {
        const [srcStat, destStat] = await Promise.all([
          stat(from),
          stat(to).catch(() => null),
        ]);
        if (!destStat || srcStat.mtimeMs > destStat.mtimeMs) {
          await copyFile(from, to);
        }
      } catch {
        // ignore
      }
    }
  }
}

let fitRunning: Promise<void> | null = null;
let lastFitAt = 0;

async function folderHasRawImages(): Promise<boolean> {
  const root = publicTimelineRoot();
  try {
    const folders = await readdir(root, { withFileTypes: true });
    for (const entry of folders) {
      if (!entry.isDirectory()) continue;
      const names = await listImageFiles(path.join(root, entry.name));
      if (names.some((n) => RAW_IMAGE_EXT.has(path.extname(n).toLowerCase()))) {
        return true;
      }
    }
  } catch {
    // ignore
  }
  return false;
}

/** Ajusta automaticamente novas imagens (em segundo plano). */
function autoFitTimelineImages(): Promise<void> {
  if (fitRunning) return fitRunning;
  if (Date.now() - lastFitAt < 15_000) return Promise.resolve();

  fitRunning = (async () => {
    try {
      if (!(await folderHasRawImages())) {
        lastFitAt = Date.now();
        return;
      }
      await new Promise<void>((resolve) => {
        const script = path.join(process.cwd(), "scripts", "auto-fit-timeline-images.py");
        const child = spawn("python", [script], {
          cwd: process.cwd(),
          windowsHide: true,
          stdio: ["ignore", "pipe", "pipe"],
        });
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          resolve();
        };
        child.on("error", finish);
        child.on("close", finish);
        setTimeout(finish, 45_000);
      });
    } finally {
      lastFitAt = Date.now();
      fitRunning = null;
    }
  })();

  return fitRunning;
}

/**
 * Lista o que está em public/timeline agora.
 * - Prefere .webp se existir o mesmo nome-base
 * - Mostra jpg/png novos na hora (antes do auto-fit)
 * - Vídeos sempre listados
 */
async function listFolderPhotos(folder: string): Promise<TimelinePhotoFile[]> {
  const dir = path.join(publicTimelineRoot(), folder);
  try {
    const names = await listMediaFiles(dir);
    const webpStems = new Set(
      names
        .filter((n) => path.extname(n).toLowerCase() === ".webp")
        .map((n) => stemOf(n).toLowerCase()),
    );

    const selected = names.filter((name) => {
      const ext = path.extname(name).toLowerCase();
      if (isVideoFile(name)) return true;
      if (ext === ".webp") return true;
      // raw só se ainda não tem webp do mesmo stem
      if (RAW_IMAGE_EXT.has(ext)) {
        return !webpStems.has(stemOf(name).toLowerCase());
      }
      return false;
    });

    const withMtime = await Promise.all(
      selected.map(async (name) => {
        const full = path.join(dir, name);
        const info = await stat(full);
        return { name, mtime: info.mtimeMs, kind: mediaKind(name) };
      }),
    );

    withMtime.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "image" ? -1 : 1;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    return withMtime.map((f) => ({
      name: f.name,
      kind: f.kind,
      src: `/timeline/${folder}/${encodeURIComponent(f.name)}?v=${Math.floor(f.mtime)}`,
    }));
  } catch {
    return [];
  }
}

/** Lê as pastas a cada chamada — adicionar/remover em public/timeline atualiza o site. */
export const getTimelinePhotos = createServerFn({ method: "GET" }).handler(
  async (): Promise<TimelinePhotosResult> => {
    // 1) lista o que está em public agora (fonte da verdade)
    const byFolder: Record<string, TimelinePhotoFile[]> = {};
    await Promise.all(
      TIMELINE_FOLDERS.map(async (folder) => {
        byFolder[folder] = await listFolderPhotos(folder);
      }),
    );

    // 2) espelha public → assets e remove do assets o que foi apagado
    void Promise.all(TIMELINE_FOLDERS.map((folder) => mirrorPublicToAssets(folder)));

    // 3) auto-ajusta jpg/png novos em segundo plano
    void autoFitTimelineImages();

    return { byFolder, updatedAt: new Date().toISOString() };
  },
);
