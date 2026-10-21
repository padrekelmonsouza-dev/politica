import { ArrowRight } from "lucide-react";

import fotoComoVotarPl from "@/assets/como-votar-noticias-pl.png";
import { PageShell, Reveal } from "./primitives";

const CHAPA_NEWS = [
  {
    candidate: "Presidente · 22",
    name: "Flávio Bolsonaro",
    office: "Candidato a Presidente da República",
    href: "https://partidoliberal.org.br/flavio-bolsonaro-vai-honrar-a-escolha-do-pai-com-o-lema-o-brasil-vai-vencer/",
    image: "/news/flavio-oficial.jpg",
    imageClass: "object-[center_10%]",
  },
  {
    candidate: "Governador · 10",
    name: "Tarcísio de Freitas",
    office: "Candidato a Governador de São Paulo",
    href: "https://partidoliberal.org.br/flavio-bolsonaro-fala-em-resgatar-o-brasil-e-varrer-o-pt-na-convencao-do-pl/",
    image: "/news/tarcisio-oficial.jpg",
    imageClass: "object-[center_12%]",
  },
  {
    candidate: "Senador · 222",
    name: "André do Prado",
    office: "Candidato a Senador por São Paulo",
    href: "https://partidoliberal.org.br/deputado-danilo-balas-participa-da-convencao-do-pl-e-e-escolhido-candidato-a-reeleicao-para-o-3o-mandato/",
    image: "/news/andre-prado-oficial.jpg",
    imageClass: "object-[center_18%]",
  },
  {
    candidate: "Senador · 111",
    name: "Guilherme Derrite",
    office: "Candidato a Senador por São Paulo",
    href: "https://partidoliberal.org.br/deputado-danilo-balas-participa-da-convencao-do-pl-e-e-escolhido-candidato-a-reeleicao-para-o-3o-mandato/",
    image: "/news/derrite-oficial.jpg?v=2",
    imageClass: "object-top",
  },
] as const;

export function ChapaNews() {
  return (
    <section
      id="chapa"
      aria-labelledby="chapa-heading"
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
                Notícias do PL
              </p>
              <h2
                id="chapa-heading"
                className="text-[1.5rem] font-black leading-tight sm:text-3xl lg:text-[1.85rem] xl:text-4xl"
                style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
              >
                A chapa da direita em São Paulo
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:mt-3 sm:text-base">
                Acompanhe as notícias do Partido Liberal sobre Flávio Bolsonaro,
                o governador Tarcísio de Freitas, o senador André do Prado e o senador Guilherme Derrite.
              </p>
            </Reveal>

            <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
              {CHAPA_NEWS.map((item, i) => (
                <Reveal key={item.name} delay={0.05 * i} className="h-full min-h-0">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-full min-h-[11rem] min-w-0 overflow-hidden rounded-xl border-2 border-gray-200 bg-white text-left shadow-sm transition-all hover:border-blue-500 hover:shadow-lg sm:min-h-[13rem]"
                  >
                    <img
                      src={item.image}
                      alt={`Foto oficial de ${item.name}`}
                      width={640}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className={`absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${item.imageClass}`}
                    />
                    <span
                      className="absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]"
                      style={{ backgroundColor: "var(--blue-primary)" }}
                    >
                      {item.candidate}
                    </span>
                    <div className="relative z-10 mt-auto w-full bg-gradient-to-t from-black/85 via-black/55 to-transparent px-2.5 pb-2.5 pt-10 sm:px-3 sm:pb-3 sm:pt-12">
                      <h3
                        className="text-xs font-black leading-tight text-white sm:text-sm"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.name}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/90 sm:text-xs">
                        {item.office}
                      </p>
                      <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--yellow-primary)] sm:text-xs">
                        Ler no site do PL
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          <figure className="aspect-[3/4] w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-[#6b7280] shadow-lg lg:aspect-auto lg:h-full">
            <img
              src={fotoComoVotarPl}
              alt="Como votar nas eleições 2026. Padre Kelmon 2202, chapa da direita em São Paulo"
              width={768}
              height={1024}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain object-center"
            />
          </figure>
        </div>
      </PageShell>
    </section>
  );
}
