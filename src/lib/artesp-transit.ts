import { createServerFn } from "@tanstack/react-start";

export type ArtespMode = "Metrô" | "Trens" | "Ônibus";

export type ArtespModeStatus = {
  mode: ArtespMode;
  status: string;
  note: string;
};

export type ArtespTransitResult = {
  modes: ArtespModeStatus[];
  sourceUrl: string;
  live: boolean;
  updatedAt: string;
};

const CACHE_TTL_MS = 2 * 60 * 1000;
const LINES_URL = "https://ccm.artesp.sp.gov.br/metroferroviario/status-linhas/";
const BUS_URL = "https://ccm.artesp.sp.gov.br/onibus/dashboard/";
const HEADERS = {
  Accept: "text/html,application/xhtml+xml",
  "User-Agent": "PadreKelmonSite/1.0 (+artesp-transit)",
};

const METRO_LINES = new Set([1, 2, 3, 4, 5, 15, 17]);
const TRAIN_LINES = new Set([6, 7, 8, 9, 10, 11, 12, 13]);

type ParsedLine = {
  name: string;
  number: number;
  situacao: string;
};

let cache: { data: ArtespTransitResult; expiresAt: number } | null = null;

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function lineNumber(name: string) {
  const match = name.match(/Linha\s+(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function modeForLine(number: number): "Metrô" | "Trens" | null {
  if (METRO_LINES.has(number)) return "Metrô";
  if (TRAIN_LINES.has(number)) return "Trens";
  return null;
}

function isNormal(situacao: string) {
  return /opera[cç][aã]o\s+normal/i.test(situacao);
}

function isClosed(situacao: string) {
  return /encerrada/i.test(situacao);
}

function statusRank(situacao: string) {
  const text = situacao.toLowerCase();
  if (/paralis/.test(text)) return 100;
  if (/velocidade reduzida|maiores intervalos/.test(text)) return 80;
  if (/parcial|impacto pontual/.test(text)) return 70;
  if (/ocorr[eê]n/.test(text) || /problema/.test(text)) return 60;
  if (/atividade programada|diferenciada|especial/.test(text)) return 50;
  if (/indispon/.test(text) || /desconhecido/.test(text)) return 20;
  if (isClosed(text)) return 5;
  if (isNormal(text)) return 0;
  return 40;
}

function parseLines(html: string): ParsedLine[] {
  const lines: ParsedLine[] = [];
  const seen = new Set<string>();
  const pattern =
    /<h3[^>]*>\s*(Linha\s+[^<]+?)\s*<\/h3>[\s\S]{0,2800}?<strong>\s*Situa[cç][aã]o:\s*<\/strong>\s*([^<\n]+)/gi;

  for (const match of html.matchAll(pattern)) {
    const name = decodeEntities(match[1] ?? "");
    const situacao = decodeEntities(match[2] ?? "");
    const number = lineNumber(name);
    if (!name || !situacao || !number || seen.has(name)) continue;
    seen.add(name);
    lines.push({ name, number, situacao });
  }

  return lines;
}

function summarizeMode(lines: ParsedLine[]): { status: string; note: string } {
  if (lines.length === 0) {
    return { status: "Status indisponível", note: "" };
  }

  const operating = lines.filter((line) => !isClosed(line.situacao));
  const pool = operating.length > 0 ? operating : lines;
  const worst = pool.slice().sort((a, b) => statusRank(b.situacao) - statusRank(a.situacao))[0];
  const issues = pool.filter((line) => !isNormal(line.situacao) && !isClosed(line.situacao));

  if (!worst || statusRank(worst.situacao) === 0) {
    return { status: "Operação Normal", note: "" };
  }

  if (issues.length === 1) {
    return { status: issues[0].situacao, note: issues[0].name.replace(/^Linha\s+/i, "L.") };
  }

  if (issues.length > 1) {
    return {
      status: "Com ocorrências",
      note: issues.map((line) => line.name.replace(/^Linha\s+/i, "L.")).join(", "),
    };
  }

  return { status: worst.situacao, note: "" };
}

function parseBusActive(html: string): number | null {
  const match = html.match(
    /Ocorr[eê]ncias\s+ativas[\s\S]{0,500}?text-3xl[^>]*>\s*([\d.]+)\s*</i,
  );
  if (!match?.[1]) return null;
  const value = Number(match[1].replace(/\./g, ""));
  return Number.isFinite(value) ? value : null;
}

function formatCount(value: number) {
  return value.toLocaleString("pt-BR");
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    throw new Error(`${url} ${res.status}`);
  }
  return res.text();
}

function fallbackResult(): ArtespTransitResult {
  return {
    modes: [
      { mode: "Metrô", status: "Status indisponível", note: "" },
      { mode: "Trens", status: "Status indisponível", note: "" },
      { mode: "Ônibus", status: "Status indisponível", note: "" },
    ],
    sourceUrl: LINES_URL,
    live: false,
    updatedAt: new Date().toISOString(),
  };
}

async function buildArtespTransit(): Promise<ArtespTransitResult> {
  try {
    const [linesHtml, busHtml] = await Promise.all([
      fetchHtml(LINES_URL),
      fetchHtml(BUS_URL).catch(() => ""),
    ]);

    const lines = parseLines(linesHtml);
    const metro = summarizeMode(lines.filter((line) => modeForLine(line.number) === "Metrô"));
    const trains = summarizeMode(lines.filter((line) => modeForLine(line.number) === "Trens"));
    const busActive = busHtml ? parseBusActive(busHtml) : null;

    const bus: ArtespModeStatus =
      busActive == null
        ? { mode: "Ônibus", status: "Status indisponível", note: "" }
        : busActive > 0
          ? {
              mode: "Ônibus",
              status: "Com ocorrências",
              note: `${formatCount(busActive)} ativas`,
            }
          : { mode: "Ônibus", status: "Operação Normal", note: "" };

    const live = lines.length > 0 || busActive != null;
    if (!live) return fallbackResult();

    return {
      modes: [
        { mode: "Metrô", ...metro },
        { mode: "Trens", ...trains },
        bus,
      ],
      sourceUrl: LINES_URL,
      live,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn("[artesp-transit] fetch failed:", error);
    return fallbackResult();
  }
}

export async function loadArtespTransit(): Promise<ArtespTransitResult> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.data;
  }

  const data = await buildArtespTransit();
  cache = { data, expiresAt: now + CACHE_TTL_MS };
  return data;
}

export const getArtespTransit = createServerFn({ method: "GET" }).handler(async () => {
  return loadArtespTransit();
});
