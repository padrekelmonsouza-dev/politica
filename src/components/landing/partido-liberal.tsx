import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Church,
  Flag,
  Heart,
  Newspaper,
  Quote,
  ShieldCheck,
} from "lucide-react";

import plImg from "@/assets/kelmon-filiacao-pl.jpg";
import { Button } from "@/components/ui/button";
import { PARTIDO_LIBERAL } from "@/lib/campaign-data";
import { rejectStateDeputyNews } from "@/lib/news-filters";
import { getPlFeeds } from "@/lib/pl-feeds";
import { PageShell, Reveal } from "./primitives";

const VALUE_ICONS = [Church, Flag, Heart, ShieldCheck] as const;
const PL_REFRESH_MS = 30 * 1000;

export function PartidoLiberal() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const plQuery = useQuery({
    queryKey: ["pl-feeds", "v2-no-estadual-sp"],
    queryFn: () => getPlFeeds(),
    staleTime: PL_REFRESH_MS,
    refetchInterval: PL_REFRESH_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: ready,
  });

  const news = rejectStateDeputyNews(
    plQuery.data?.articles?.length ? plQuery.data.articles : PARTIDO_LIBERAL.news,
  );

  return (
    <section
      id="partido-liberal"
      aria-labelledby="partido-liberal-heading"
      className="section-pad relative overflow-hidden border-t border-border/50"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f4f7fc 42%, #ffffff 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-10 size-72 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--yellow-primary)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--blue-primary)" }}
      />

      <PageShell className="relative">
        <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-8 lg:gap-12">
          <Reveal className="order-2 min-h-0 min-w-0 md:order-1 md:h-full">
            <a
              href={PARTIDO_LIBERAL.affiliationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full min-h-[16rem] sm:min-h-[18rem]"
            >
              <figure className="relative flex h-full min-h-[16rem] flex-col overflow-hidden rounded-xl border-2 border-gray-200 bg-neutral-900 shadow-lg sm:min-h-[18rem]">
                <div className="relative min-h-0 flex-1">
                  <img
                    src={plImg}
                    alt="Padre Kelmon e o presidente Valdemar Costa Neto durante a assinatura da ficha de filiação ao PL"
                    title={PARTIDO_LIBERAL.photoCredit}
                    width={1024}
                    height={683}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
                  />
                </div>
                <figcaption className="relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-2 bg-white px-4 py-2.5 sm:px-5">
                  <span
                    className="text-sm font-black"
                    style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
                  >
                    Padre Kelmon e Valdemar Costa Neto
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Filiação ao PL · {PARTIDO_LIBERAL.joined}
                  </span>
                </figcaption>
              </figure>
            </a>
          </Reveal>

          <Reveal delay={0.08} className="order-1 flex min-w-0 flex-col justify-center md:order-2">
            <h2 id="partido-liberal-heading" className="sr-only">
              Partido Liberal
            </h2>
            <p
              className="inline-flex w-fit max-w-full rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide sm:text-xs"
              style={{
                backgroundColor: "var(--yellow-primary)",
                color: "var(--blue-primary)",
              }}
            >
              {PARTIDO_LIBERAL.slogan}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-gray-700 text-justify sm:text-base">
              {PARTIDO_LIBERAL.description}
            </p>
            <blockquote className="mt-5 rounded-xl border-2 border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <Quote
                className="mb-2 size-5"
                style={{ color: "var(--yellow-primary)" }}
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-gray-800 italic sm:text-[0.95rem]">
                “{PARTIDO_LIBERAL.quote}”
              </p>
              <footer
                className="mt-3 text-xs font-bold uppercase tracking-wide"
                style={{ color: "var(--blue-primary)" }}
              >
                {PARTIDO_LIBERAL.quoteAuthor}
              </footer>
            </blockquote>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {PARTIDO_LIBERAL.values.map((value, i) => {
            const Icon = VALUE_ICONS[i] ?? Flag;
            return (
              <Reveal key={value.title} delay={0.04 * i}>
                <article className="h-full rounded-xl border-2 border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-500 hover:shadow-lg sm:p-5">
                  <span
                    className="mb-3 inline-flex size-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "var(--blue-primary)" }}
                  >
                    <Icon className="size-5 text-white" aria-hidden="true" />
                  </span>
                  <h3
                    className="mb-1.5 text-base font-black"
                    style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
                  >
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">{value.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-10">
          <span
            className="mb-4 block text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--blue-primary)" }}
          >
            PL na mídia
          </span>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {news.map((item, i) => (
              <Reveal key={item.href} delay={0.05 * i}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-gray-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-200">
                    <img
                      src={item.image}
                      alt=""
                      width={640}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      <Newspaper className="size-3 shrink-0" aria-hidden="true" />
                      {item.date ? `${item.source} · ${item.date}` : item.source}
                    </p>
                    <h3
                      className="mb-2 line-clamp-3 text-sm font-black leading-snug"
                      style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
                    >
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="mb-3 line-clamp-3 flex-1 text-xs leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                    ) : (
                      <span className="mb-3 flex-1" />
                    )}
                    <span
                      className="mt-auto inline-flex items-center gap-1 text-xs font-bold"
                      style={{ color: "var(--blue-primary)" }}
                    >
                      Ler no site do PL
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 rounded-xl border-2 border-gray-200 bg-white p-5 shadow-sm sm:mt-10 sm:p-6">
            <p
              className="mb-4 text-center text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--blue-primary)" }}
            >
              Partido Liberal · PL {PARTIDO_LIBERAL.number}
            </p>
            <ul className="flex flex-wrap justify-center gap-2">
              {PARTIDO_LIBERAL.fronts.map((front) => (
                <li key={front.label}>
                  <a
                    href={front.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border-2 border-[var(--blue-primary)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--blue-primary)] transition-colors hover:bg-blue-600 hover:text-white active:bg-blue-700 active:text-white focus-visible:bg-blue-600 focus-visible:text-white"
                  >
                    {front.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-center">
              <Button asChild variant="campaign" size="xl" className="h-12 font-bold">
                <a
                  href={PARTIDO_LIBERAL.affiliationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ler a filiação no site do PL
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </PageShell>
    </section>
  );
}
