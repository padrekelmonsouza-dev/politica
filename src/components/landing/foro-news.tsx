import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import fotoPadreKelmonForo from "@/assets/banner-noticias-foro-padre-kelmon.jpg";
import { FORO_ARTICLES } from "@/data/foro-articles";
import { getForoFeeds } from "@/lib/foro-feeds";
import { rejectStateDeputyNews } from "@/lib/news-filters";
import { PageShell, Reveal } from "./primitives";

const FORO_REFRESH_MS = 30 * 1000;

export function ForoNews() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const foroQuery = useQuery({
    queryKey: ["foro-feeds", "v2-no-estadual-sp"],
    queryFn: () => getForoFeeds(),
    staleTime: FORO_REFRESH_MS,
    refetchInterval: FORO_REFRESH_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: ready,
  });

  const news = rejectStateDeputyNews(
    foroQuery.data?.articles?.length ? foroQuery.data.articles : FORO_ARTICLES,
  );

  return (
    <section
      id="noticias-foro"
      aria-labelledby="noticias-foro-heading"
      className="section-pad relative overflow-hidden border-t border-border/50"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f4f7fc 42%, #ffffff 100%)",
      }}
    >
      <PageShell className="relative">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22.5rem)] lg:gap-6">
          <div className="flex min-w-0 flex-col gap-4 lg:h-0 lg:min-h-full lg:gap-5">
            <Reveal className="shrink-0">
              <p
                className="mb-2 text-sm font-bold uppercase tracking-widest"
                style={{ color: "var(--yellow-primary)" }}
              >
                Notícias do Foro do Brasil
              </p>
              <h2
                id="noticias-foro-heading"
                className="text-[1.5rem] font-black leading-tight sm:text-3xl lg:text-[1.85rem] xl:text-4xl"
                style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
              >
                O movimento conservador em todo o país
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:mt-3 sm:text-base">
                Acompanhe as notícias oficiais do Foro do Brasil, presidido pelo Padre Kelmon.
                Liberdade, fé cristã e união entre os povos.
              </p>
            </Reveal>

            <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
              {news.slice(0, 4).map((item, i) => (
                <Reveal key={item.id} delay={0.05 * i} className="h-full min-h-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-full min-h-[11rem] min-w-0 overflow-hidden rounded-xl border-2 border-gray-200 bg-neutral-900 text-left shadow-sm transition-all hover:border-blue-500 hover:shadow-lg sm:min-h-[13rem]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      width={640}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                    <div className="relative z-10 mt-auto w-full bg-gradient-to-t from-black/85 via-black/55 to-transparent px-2.5 pb-2.5 pt-10 sm:px-3 sm:pb-3 sm:pt-12">
                      <h3
                        className="line-clamp-3 text-xs font-black leading-tight text-white sm:text-sm"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.title}
                      </h3>
                      <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--yellow-primary)] sm:text-xs">
                        Ler no Foro do Brasil
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          <figure className="aspect-[3/4] w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-lg lg:aspect-auto lg:h-full">
            <img
              src={fotoPadreKelmonForo}
              alt="Padre Kelmon 2202, candidato a Deputado Federal pelo PL"
              width={768}
              height={1024}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
          </figure>
        </div>
      </PageShell>
    </section>
  );
}
