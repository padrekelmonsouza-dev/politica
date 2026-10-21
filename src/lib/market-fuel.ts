import { createServerFn } from "@tanstack/react-start";

export type MarketQuote = {
  name: string;
  value: string;
  change: string;
};

export type FuelPrices = {
  saoPaulo: { gasolina: string; aditivada: string; etanol: string };
  brasil: { gasolina: string; aditivada: string; etanol: string };
};

export type MarketFuelResult = {
  market: MarketQuote[];
  fuel: FuelPrices;
};

const CACHE_TTL_MS = 2 * 60 * 1000;
let cache: { data: MarketFuelResult; expiresAt: number } | null = null;

function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function pct(value: number) {
  return `${value > 0 ? "+" : ""}${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "PadreKelmonSite/1.0" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json();
}

async function fetchMarket(): Promise<MarketQuote[]> {
  const [fx, ibov] = await Promise.allSettled([
    fetchJson("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL"),
    fetchJson("https://query1.finance.yahoo.com/v8/finance/chart/%5EBVSP?interval=1d&range=5d"),
  ]);

  const market: MarketQuote[] = [];

  if (fx.status === "fulfilled") {
    const usd = fx.value.USDBRL;
    const eur = fx.value.EURBRL;
    if (usd) {
      market.push({
        name: "Dólar",
        value: brl(Number(usd.bid)),
        change: pct(Number(usd.pctChange)),
      });
    }
    if (eur) {
      market.push({
        name: "Euro",
        value: brl(Number(eur.bid)),
        change: pct(Number(eur.pctChange)),
      });
    }
  }

  if (ibov.status === "fulfilled") {
    const meta = ibov.value?.chart?.result?.[0]?.meta;
    const price = Number(meta?.regularMarketPrice);
    const previous = Number(meta?.chartPreviousClose ?? meta?.previousClose);
    if (price > 0) {
      const change = previous > 0 ? ((price - previous) / previous) * 100 : 0;
      market.push({
        name: "Ibovespa",
        value: Math.round(price).toLocaleString("pt-BR"),
        change: pct(change),
      });
    }
  }

  return market;
}

function fuelFallback(): FuelPrices {
  return {
    saoPaulo: { gasolina: "R$ 6,09", aditivada: "R$ 6,35", etanol: "R$ 4,19" },
    brasil: { gasolina: "R$ 6,12", aditivada: "R$ 6,38", etanol: "R$ 4,21" },
  };
}

export const getMarketFuel = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (cache && cache.expiresAt > now) return cache.data;

  const market = await fetchMarket().catch(() => [] as MarketQuote[]);
  const data = { market, fuel: fuelFallback() };
  cache = { data, expiresAt: now + CACHE_TTL_MS };
  return data;
});
