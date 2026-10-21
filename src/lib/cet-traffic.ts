import { createServerFn } from "@tanstack/react-start";

export type CetRegion = {
  name: string;
  km: number;
  percent: number;
};

export type CetTrafficResult = {
  regions: CetRegion[];
  totalKm: number;
  rodizio: string;
  rodizioHours: string;
  rodizioPlates: string;
  sourceUrl: string;
  updatedAt: string;
  live: boolean;
};

const CACHE_TTL_MS = 2 * 60 * 1000;
const CET_HOME_URL = "https://www.cetsp.com.br/";
const CET_SOURCE_URL = "https://www.cetsp.com.br/transito-agora/transito-nas-principais-vias.aspx";
const REGIONS = ["Norte", "Oeste", "Centro", "Leste", "Sul"] as const;

let cache: { data: CetTrafficResult; expiresAt: number } | null = null;

function parseRegions(html: string): CetRegion[] {
  const regions: CetRegion[] = [];
  const seen = new Set<string>();

  const pattern =
    /(Norte|Oeste|Centro|Leste|Sul)[\s\S]{0,500}?(\d+)\s*km[\s\S]{0,120}?\((\d+)\s*%\)/gi;

  for (const match of html.matchAll(pattern)) {
    const name = match[1] ?? "";
    if (!name || seen.has(name) || !REGIONS.includes(name as (typeof REGIONS)[number])) continue;
    seen.add(name);
    regions.push({
      name,
      km: Number(match[2]),
      percent: Number(match[3]),
    });
    if (regions.length >= REGIONS.length) break;
  }

  return regions;
}

const RODIZIO_HOURS = "7h às 10h e 17h às 20h";
const PLATES_BY_WEEKDAY: Record<number, string | null> = {
  0: null,
  1: "1 e 2",
  2: "3 e 4",
  3: "5 e 6",
  4: "7 e 8",
  5: "9 e 0",
  6: null,
};

function saoPauloWeekday(date = new Date()) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
  }).format(date);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday] ?? date.getDay();
}

function rodizioFromPlates(plates: string) {
  return {
    rodizio: `Rodízio placas final ${plates}`,
    rodizioHours: RODIZIO_HOURS,
    rodizioPlates: plates,
  };
}

function rodizioFromWeekday() {
  const plates = PLATES_BY_WEEKDAY[saoPauloWeekday()];
  if (!plates) {
    return { rodizio: "Sem rodízio hoje", rodizioHours: "", rodizioPlates: "" };
  }
  return rodizioFromPlates(plates);
}

function parseRodizio(html: string): { rodizio: string; rodizioHours: string; rodizioPlates: string } {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  const platesMatch = text.match(/Placas de final\s+(\d+\s+e\s+\d+)/i);
  if (platesMatch?.[1]) {
    return rodizioFromPlates(platesMatch[1]);
  }
  if (/n[aã]o h[aá] rod[ií]zio|sem rod[ií]zio|rod[ií]zio:\s*n[aã]o/i.test(text)) {
    return { rodizio: "Sem rodízio hoje", rodizioHours: "", rodizioPlates: "" };
  }
  return rodizioFromWeekday();
}

async function fetchCetHtml(): Promise<string> {
  const res = await fetch(CET_HOME_URL, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "PadreKelmonSite/1.0 (+cet-traffic)",
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    throw new Error(`CET homepage ${res.status}`);
  }
  return res.text();
}

function fallbackResult(): CetTrafficResult {
  return {
    regions: [],
    totalKm: 0,
    ...rodizioFromWeekday(),
    sourceUrl: CET_SOURCE_URL,
    updatedAt: new Date().toISOString(),
    live: false,
  };
}

async function buildCetTraffic(): Promise<CetTrafficResult> {
  try {
    const html = await fetchCetHtml();
    const regions = parseRegions(html);
    const rodizio = parseRodizio(html);
    if (regions.length === 0) {
      return { ...fallbackResult(), ...rodizio };
    }
    return {
      regions,
      totalKm: regions.reduce((sum, region) => sum + region.km, 0),
      ...rodizio,
      sourceUrl: CET_SOURCE_URL,
      updatedAt: new Date().toISOString(),
      live: true,
    };
  } catch (error) {
    console.warn("[cet-traffic] fetch failed:", error);
    return fallbackResult();
  }
}

export async function loadCetTraffic(): Promise<CetTrafficResult> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.data;
  }

  const data = await buildCetTraffic();
  cache = { data, expiresAt: now + CACHE_TTL_MS };
  return data;
}

export const getCetTraffic = createServerFn({ method: "GET" }).handler(async () => {
  return loadCetTraffic();
});
