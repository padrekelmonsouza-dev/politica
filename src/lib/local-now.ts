import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { loadArtespTransit, type ArtespTransitResult } from "@/lib/artesp-transit";
import { loadCetTraffic, type CetTrafficResult } from "@/lib/cet-traffic";

export type LocalPlace = {
  city: string;
  state: string;
};

export type LocalWeather = {
  temp: number;
  humidity: number;
  wind: number;
  code: number;
  min: number;
  max: number;
};

export type LocalNowResult = {
  place: LocalPlace;
  weather: LocalWeather | null;
  traffic: CetTrafficResult | null;
  artesp: ArtespTransitResult | null;
  mapsTrafficUrl: string;
  mapsTransitUrl: string;
};

const inputSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

const cache = new Map<string, { data: LocalNowResult; expiresAt: number }>();
const CACHE_TTL_MS = 2 * 60 * 1000;

function cacheKey(lat: number, lon: number) {
  return `${lat.toFixed(3)},${lon.toFixed(3)}`;
}

function isSaoPauloMetro(place: LocalPlace, lat: number, lon: number) {
  const city = place.city.toLowerCase();
  const state = place.state.toLowerCase();
  const inState = state.includes("são paulo") || state.includes("sao paulo") || state === "sp";
  const inCapital =
    city.includes("são paulo") ||
    city.includes("sao paulo") ||
    city.includes("guarulhos") ||
    city.includes("osasco") ||
    city.includes("santo andré") ||
    city.includes("santo andre") ||
    city.includes("são bernardo") ||
    city.includes("sao bernardo");
  if (inState && inCapital) return true;
  return lat < -23.32 && lat > -23.9 && lon < -46.36 && lon > -46.95;
}

async function reverseGeocode(lat: number, lon: number): Promise<LocalPlace> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=pt-BR&zoom=12`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "PadreKelmonSite/1.0 (+local-now)",
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  const data = (await res.json()) as {
    address?: {
      city?: string;
      town?: string;
      village?: string;
      municipality?: string;
      suburb?: string;
      state?: string;
    };
  };
  const address = data.address ?? {};
  return {
    city:
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.suburb ||
      "sua região",
    state: address.state || "",
  };
}

async function fetchWeather(lat: number, lon: number): Promise<LocalWeather | null> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
  const res = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    temp: Math.round(data.current.temperature_2m),
    humidity: Math.round(data.current.relative_humidity_2m),
    wind: Math.round(data.current.wind_speed_10m),
    code: Number(data.current.weather_code),
    min: Math.round(data.daily.temperature_2m_min[0]),
    max: Math.round(data.daily.temperature_2m_max[0]),
  };
}

async function buildLocalNow(lat: number, lon: number): Promise<LocalNowResult> {
  let place: LocalPlace = { city: "sua região", state: "" };
  try {
    place = await reverseGeocode(lat, lon);
  } catch {
    place = { city: "sua região", state: "" };
  }

  const [weather, artesp] = await Promise.all([
    fetchWeather(lat, lon).catch(() => null),
    loadArtespTransit().catch(() => null),
  ]);

  let traffic: CetTrafficResult | null = null;
  if (isSaoPauloMetro(place, lat, lon)) {
    try {
      traffic = await loadCetTraffic();
    } catch {
      traffic = null;
    }
  }

  return {
    place,
    weather,
    traffic,
    artesp,
    mapsTrafficUrl: `https://www.google.com/maps/@${lat},${lon},14z/data=!5m1!1e1`,
    mapsTransitUrl: `https://www.google.com/maps/search/transporte+p%C3%BAblico/@${lat},${lon},15z`,
  };
}

export const getLocalNow = createServerFn({ method: "POST" })
  .validator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = cacheKey(data.lat, data.lon);
    const now = Date.now();
    const hit = cache.get(key);
    if (hit && hit.expiresAt > now) return hit.data;

    const result = await buildLocalNow(data.lat, data.lon);
    cache.set(key, { data: result, expiresAt: now + CACHE_TTL_MS });
    return result;
  });
