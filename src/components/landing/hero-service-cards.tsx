import type { ReactNode } from "react";
import {
  Bus,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Fuel,
  IdCard,
  LineChart,
  MapPin,
  Sun,
  Train,
  TrainFront,
  type LucideIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import chapaCardImg from "@/assets/chapa-card-padre-kelmon.jpg";
import type { CetRegion } from "@/lib/cet-traffic";
import { getLocalNow, type LocalNowResult } from "@/lib/local-now";
import { getMarketFuel, type FuelPrices, type MarketQuote } from "@/lib/market-fuel";
import { cn } from "@/lib/utils";

const SP_LAT = -23.5505;
const SP_LON = -46.6333;
const TSE_LOCAL_VOTACAO =
  "https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral#/";
const CET_PAGE =
  "https://www.cetsp.com.br/transito-agora/transito-nas-principais-vias.aspx";
const ARTESP_TRANSIT_PAGE = "https://ccm.artesp.sp.gov.br/metroferroviario/status-linhas/";
const WEATHER_PAGE = "https://www.climatempo.com.br/previsao-do-tempo/cidade/558/saopaulo-sp";
const MARKET_PAGE = "https://www.infomoney.com.br/ferramentas/cambio/";
const FUEL_PAGE = "https://precos.petrobras.com.br/";
const LOCAL_REFRESH_MS = 2 * 60 * 1000;
const ZONE_ORDER = ["Norte", "Oeste", "Centro", "Leste", "Sul"] as const;

function zoneLabel(name: string) {
  if (name === "Centro") return "Centro";
  return `Zona ${name}`;
}

function weatherLabel(code: number): { label: string; Icon: LucideIcon } {
  if (code === 0) return { label: "Céu limpo", Icon: Sun };
  if (code === 1) return { label: "Principalmente limpo", Icon: CloudSun };
  if (code <= 2) return { label: "Parcialmente nublado", Icon: CloudSun };
  if (code === 3) return { label: "Nublado", Icon: Cloud };
  if (code === 45 || code === 48) return { label: "Neblina", Icon: CloudFog };
  if (code >= 51 && code <= 67) return { label: "Chuva", Icon: CloudRain };
  if (code >= 71 && code <= 77) return { label: "Neve", Icon: CloudSnow };
  if (code >= 80 && code <= 82) return { label: "Pancadas de chuva", Icon: CloudRain };
  if (code >= 95) return { label: "Tempestade", Icon: CloudLightning };
  return { label: "Tempo instável", Icon: Cloud };
}

function PulseCard({
  href,
  icon,
  title,
  children,
  compact = false,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#d7e4f2] bg-white shadow-[0_6px_16px_rgba(30,91,184,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(30,91,184,0.12)]",
        compact ? "px-2.5 py-2" : "px-3.5 py-2",
      )}
    >
      <div className={cn("mb-1 flex min-w-0 items-center gap-1", compact ? "gap-1" : "gap-1.5")}>
        {icon}
        <h3
          className={cn(
            "min-w-0 truncate font-bold uppercase",
            compact ? "text-[10px] tracking-[0.04em]" : "text-[11px] tracking-[0.08em]",
          )}
          style={{ color: "var(--blue-primary)" }}
        >
          {title}
        </h3>
      </div>
      <div className="min-w-0">{children}</div>
      <span
        className={cn("font-semibold", compact ? "mt-1 text-[10px]" : "mt-1.5 text-[11px]")}
        style={{ color: "var(--blue-primary)" }}
      >
        {compact ? "Detalhes →" : "Ver detalhes →"}
      </span>
    </a>
  );
}

function VotingCard({ compact = false }: { compact?: boolean }) {
  return (
    <PulseCard
      href={TSE_LOCAL_VOTACAO}
      title="Votação"
      compact={compact}
      icon={<IdCard className={cn(compact ? "size-3.5" : "size-4", "shrink-0 text-sky-600")} aria-hidden="true" />}
    >
      <p
        className={cn("mb-1 font-bold", compact ? "text-[11px] leading-tight" : "text-[12px]")}
        style={{ color: "var(--blue-primary)" }}
      >
        Local de votação
      </p>
      <ul className="flex min-w-0 flex-wrap gap-1">
        {["Título", "CPF", "Nome"].map((field) => (
          <li
            key={field}
            className={cn(
              "rounded-md border border-[#d7e4f2] font-semibold",
              compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
            )}
            style={{ color: "var(--blue-primary)" }}
          >
            {field}
          </li>
        ))}
      </ul>
    </PulseCard>
  );
}

function TransportCard({
  data,
  loading,
  compact = false,
}: {
  data?: LocalNowResult;
  loading: boolean;
  compact?: boolean;
}) {
  const modes = data?.artesp?.live ? data.artesp.modes : [];
  const lineColor: Record<string, string> = {
    Metrô: "#0057A8",
    Trens: "#EE3E34",
    "Ônibus": "#E3B505",
  };
  const lineIcon: Record<string, LucideIcon> = {
    Metrô: TrainFront,
    Trens: Train,
    "Ônibus": Bus,
  };

  return (
    <PulseCard
      href={ARTESP_TRANSIT_PAGE}
      title="Transporte"
      compact={compact}
      icon={<TrainFront className={cn(compact ? "size-3.5" : "size-4", "shrink-0 text-sky-600")} aria-hidden="true" />}
    >
      {modes.length > 0 ? (
        <ul className="space-y-0.5">
          {modes.map((item) => {
            const Icon = lineIcon[item.mode] ?? Bus;
            return compact ? (
              <li key={item.mode} className="flex min-w-0 items-start gap-1.5">
                <Icon
                  className="mt-0.5 size-3.5 shrink-0"
                  style={{ color: lineColor[item.mode] }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold" style={{ color: "var(--blue-primary)" }}>
                    {item.mode}
                  </p>
                  <p className="break-words text-[10px] font-bold leading-snug text-gray-500">
                    {item.status}
                  </p>
                </div>
              </li>
            ) : (
              <li key={item.mode} className="flex min-w-0 items-center gap-2">
                <Icon
                  className="size-3.5 shrink-0"
                  style={{ color: lineColor[item.mode] }}
                  aria-hidden="true"
                />
                <p className="shrink-0 text-[13px] font-semibold" style={{ color: "var(--blue-primary)" }}>
                  {item.mode}
                </p>
                <span className="min-w-0 flex-1 text-right text-[11px] font-bold leading-snug text-gray-500">
                  {item.status}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={cn("font-semibold text-gray-500", compact ? "text-[10px] leading-snug" : "text-[11px]")}>
          {loading ? "Atualizando linhas…" : "Abra o painel da ARTESP."}
        </p>
      )}
    </PulseCard>
  );
}

function zoneTone(percent: number) {
  if (percent >= 40) return "text-amber-500";
  if (percent >= 20) return "text-amber-400";
  return "text-emerald-600";
}

function TrafficCard({
  data,
  loading,
  compact = false,
}: {
  data?: LocalNowResult;
  loading: boolean;
  compact?: boolean;
}) {
  const traffic = data?.traffic;
  const live = Boolean(traffic?.live && traffic.regions.length);
  const byName = new Map((traffic?.regions ?? []).map((region: CetRegion) => [region.name, region]));

  return (
    <PulseCard
      href={CET_PAGE}
      title="Trânsito"
      compact={compact}
      icon={<MapPin className={cn(compact ? "size-3.5" : "size-4", "shrink-0 text-sky-600")} aria-hidden="true" />}
    >
      {live && traffic ? (
        <div className="min-w-0">
          <p
            className={cn("mb-1 truncate font-bold", compact ? "text-[11px] leading-tight" : "text-[12px]")}
            style={{ color: "var(--blue-primary)" }}
          >
            SP · {traffic.totalKm} km
          </p>
          <p className={cn("mb-1 truncate text-gray-500", compact ? "text-[9px]" : "text-[10px]")}>
            {traffic.rodizioPlates ? `Rodízio ${traffic.rodizioPlates}` : "Sem rodízio"}
          </p>
          <ul className={cn(compact ? "space-y-0.5" : "grid grid-cols-2 gap-x-3 gap-y-0.5")}>
            {ZONE_ORDER.map((name) => {
              const region = byName.get(name);
              const percent = region?.percent ?? 0;
              return (
                <li key={name} className="flex min-w-0 items-center justify-between gap-1">
                  <span
                    className={cn("min-w-0 truncate font-semibold", compact ? "text-[10px]" : "text-[11px]")}
                    style={{ color: "var(--blue-primary)" }}
                  >
                    {compact ? name : zoneLabel(name)}
                  </span>
                  <span className={cn("shrink-0 font-bold tabular-nums", compact ? "text-[10px]" : "text-[11px]", zoneTone(percent))}>
                    {percent}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className={cn("font-semibold text-gray-500", compact ? "text-[10px] leading-snug" : "text-[11px]")}>
          {loading ? "Atualizando o trânsito…" : "Abra o mapa da CET."}
        </p>
      )}
    </PulseCard>
  );
}

function WeatherCard({
  data,
  loading,
  compact = false,
}: {
  data?: LocalNowResult;
  loading: boolean;
  compact?: boolean;
}) {
  const weather = data?.weather;
  const info = weather ? weatherLabel(weather.code) : { label: "Carregando…", Icon: CloudSun };
  const WeatherIcon = info.Icon;

  return (
    <PulseCard
      href={WEATHER_PAGE}
      title="Tempo"
      compact={compact}
      icon={<CloudSun className={cn(compact ? "size-3.5" : "size-4", "shrink-0 text-sky-500")} aria-hidden="true" />}
    >
      {weather ? (
        <div className="flex min-w-0 items-start justify-between gap-1.5">
          <div className="min-w-0">
            <p
              className={cn("truncate font-bold leading-tight", compact ? "text-[11px]" : "text-[12px]")}
              style={{ color: "var(--blue-primary)" }}
            >
              São Paulo
            </p>
            <p className={cn("truncate leading-snug text-gray-500", compact ? "text-[10px]" : "text-[11px]")}>
              {info.label}
            </p>
            <p className={cn("mt-1 inline-flex items-center gap-1 text-gray-500", compact ? "text-[10px]" : "text-[11px]")}>
              <WeatherIcon className="size-3.5 shrink-0 text-sky-500" aria-hidden="true" />
              {weather.min}°/{weather.max}°
            </p>
          </div>
          <p
            className={cn("shrink-0 font-black leading-none", compact ? "text-[18px]" : "text-[22px]")}
            style={{ color: "var(--blue-primary)" }}
          >
            {weather.temp}°
          </p>
        </div>
      ) : (
        <p className={cn("font-semibold text-gray-500", compact ? "text-[10px] leading-snug" : "text-[11px]")}>
          {loading ? "Atualizando o tempo…" : "Abra a previsão de São Paulo."}
        </p>
      )}
    </PulseCard>
  );
}

function MarketCard({
  market,
  loading,
  compact = false,
}: {
  market: MarketQuote[];
  loading: boolean;
  compact?: boolean;
}) {
  const icons = [
    { bg: "#22c55e", label: "$", color: "#fff" },
    { bg: "var(--blue-primary)", label: "€", color: "#fff" },
    { bg: "var(--yellow-primary)", label: "↗", color: "var(--blue-primary)" },
  ];

  return (
    <PulseCard
      href={MARKET_PAGE}
      title="Mercado"
      compact={compact}
      icon={<LineChart className={cn(compact ? "size-3.5" : "size-4", "shrink-0 text-sky-600")} aria-hidden="true" />}
    >
      {market.length > 0 ? (
        <ul className="space-y-1">
          {market.map((item, index) => (
            <li key={item.name} className="flex min-w-0 items-start gap-1">
              <span
                className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black"
                style={{ background: icons[index]?.bg, color: icons[index]?.color }}
              >
                {icons[index]?.label}
              </span>
              <p
                className={cn("min-w-0 flex-1 truncate font-semibold", compact ? "text-[10px]" : "text-[12px]")}
                style={{ color: "var(--blue-primary)" }}
              >
                {item.name}
              </p>
              <div className="shrink-0 text-right">
                <p
                  className={cn("font-black tabular-nums", compact ? "text-[10px]" : "text-[12px]")}
                  style={{ color: "var(--blue-primary)" }}
                >
                  {item.value}
                </p>
                <p className={cn("tabular-nums text-gray-500", compact ? "text-[9px]" : "text-[11px]")}>
                  {item.change}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={cn("font-semibold text-gray-500", compact ? "text-[10px] leading-snug" : "text-[11px]")}>
          {loading ? "Atualizando cotações…" : "Abra o mercado."}
        </p>
      )}
    </PulseCard>
  );
}

function shortPrice(value: string) {
  return value.replace(/^R\$\s?/, "");
}

function FuelCard({ fuel, compact = false }: { fuel: FuelPrices; compact?: boolean }) {
  const rows = [
    ["Gasolina", fuel.saoPaulo.gasolina, fuel.brasil.gasolina],
    ["Aditivada", fuel.saoPaulo.aditivada, fuel.brasil.aditivada],
    ["Etanol", fuel.saoPaulo.etanol, fuel.brasil.etanol],
  ] as const;

  return (
    <PulseCard
      href={FUEL_PAGE}
      title="Combustível"
      compact={compact}
      icon={<Fuel className={cn(compact ? "size-3.5" : "size-4", "shrink-0 text-amber-500")} aria-hidden="true" />}
    >
      {compact ? (
        <div className="min-w-0">
          <div className="mb-0.5 grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-2 text-[9px] font-bold uppercase tracking-wide text-[var(--yellow-dark)]">
            <span />
            <span>SP</span>
            <span>BR</span>
          </div>
          <ul className="space-y-0.5">
            {rows.map((row) => (
              <li key={row[0]} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-x-2">
                <span className="truncate text-[10px] text-gray-500">{row[0]}</span>
                <span className="text-[10px] font-black tabular-nums" style={{ color: "var(--blue-primary)" }}>
                  {shortPrice(row[1])}
                </span>
                <span className="text-[10px] font-black tabular-nums" style={{ color: "var(--blue-primary)" }}>
                  {shortPrice(row[2])}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {(["São Paulo", "Brasil"] as const).map((title, col) => (
            <div key={title} className="min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--yellow-dark)]">
                {title}
              </p>
              <ul className="space-y-1">
                {rows.map((row) => (
                  <li key={row[0]} className="flex items-baseline justify-between gap-1">
                    <span className="min-w-0 truncate text-[11px] text-gray-500">{row[0]}</span>
                    <span className="shrink-0 whitespace-nowrap text-[12px] font-black" style={{ color: "var(--blue-primary)" }}>
                      {row[col + 1]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </PulseCard>
  );
}

export function HeroServiceCards({
  className,
  compact = false,
  slots = "all",
}: {
  className?: string;
  compact?: boolean;
  slots?: "all" | "civic" | "pulse" | "rail";
}) {
  const localQuery = useQuery({
    queryKey: ["local-now", "sao-paulo"],
    queryFn: () => getLocalNow({ data: { lat: SP_LAT, lon: SP_LON } }),
    staleTime: LOCAL_REFRESH_MS,
    refetchInterval: LOCAL_REFRESH_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const marketQuery = useQuery({
    queryKey: ["market-fuel"],
    queryFn: () => getMarketFuel(),
    staleTime: LOCAL_REFRESH_MS,
    refetchInterval: LOCAL_REFRESH_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const loading = localQuery.isLoading;
  const data = localQuery.data;
  const market = marketQuery.data?.market ?? [];
  const fuel = marketQuery.data?.fuel ?? {
    saoPaulo: { gasolina: "—", aditivada: "—", etanol: "—" },
    brasil: { gasolina: "—", aditivada: "—", etanol: "—" },
  };

  const showCivic = slots === "all" || slots === "civic" || slots === "rail";
  const showPulse = slots === "all" || slots === "pulse" || slots === "rail";
  const stacked = slots === "civic" || slots === "rail";

  return (
    <div
      className={cn(
        stacked
          ? "civic-stack"
          : "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
        compact && "items-stretch [&>*]:min-w-0",
        className,
      )}
      style={
        stacked
          ? { display: "flex", flexDirection: "column", gap: "0.75rem" }
          : undefined
      }
    >
      {showCivic ? (
        <>
          <VotingCard compact={compact} />
          <TransportCard data={data} loading={loading} compact={compact} />
          <TrafficCard data={data} loading={loading} compact={compact} />
        </>
      ) : null}
      {showPulse ? (
        <>
          <WeatherCard data={data} loading={loading} compact={compact} />
          <MarketCard market={market} loading={marketQuery.isLoading} compact={compact} />
          <FuelCard fuel={fuel} compact={compact} />
        </>
      ) : null}
      {slots === "rail" ? (
        <figure className="m-0 overflow-hidden rounded-xl border border-[#d7e4f2] bg-white shadow-[0_6px_16px_rgba(30,91,184,0.08)]">
          <img
            src={chapaCardImg}
            alt="Chapa Padre Kelmon 22022, senador André do Prado 2222 e presidente Flávio Bolsonaro 22"
            width={768}
            height={1024}
            className="block h-auto w-full"
          />
        </figure>
      ) : null}
    </div>
  );
}
