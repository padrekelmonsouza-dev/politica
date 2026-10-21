import { ArrowUpRight, Quote } from "lucide-react";

import confiancaImg from "@/assets/confianca-kelmon.webp";
import { BrazilPresenceMap } from "./brazil-presence-map";
import { FORO_BRASIL, FORO_PRESENCE_STATES, STATS, TRUST_PILLARS } from "@/lib/campaign-data";
import { Counter, PageShell, Reveal } from "./primitives";

export function Stats({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  const Heading = headingAs;
  return (
    <section
      id="numeros"
      className="section-pad relative overflow-hidden border-t border-border/50"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f4f7fc 42%, #ffffff 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 size-72 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--yellow-primary)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-0 size-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--blue-primary)" }}
      />

      <PageShell className="relative">
          <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-8 lg:gap-12">
            <Reveal className="h-full min-w-0">
              <div className="flex h-full max-h-none flex-col justify-center md:max-h-[480px]">
                <div>
                  <p
                    className="mb-3 text-sm font-bold uppercase tracking-widest"
                    style={{ color: "var(--yellow-primary)" }}
                  >
                    Indicadores
                  </p>
                  <Heading
                    className="display-heading font-black leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--blue-primary)",
                      fontSize: "clamp(1.5rem, 4vw, 2.75rem)",
                    }}
                  >
                    Trajetória pública e confiança
                  </Heading>
                </div>

                <div className="mt-5 flex flex-col gap-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                  <p className="text-justify">
                    Em 2022, foi candidato à Presidência e obteve{" "}
                    <strong style={{ color: "var(--blue-primary)" }}>81.129 votos</strong> em 19
                    dias de campanha. Em 2023, fundou o{" "}
                    <a
                      href={FORO_BRASIL.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline-offset-2 hover:underline"
                      style={{ color: "var(--blue-primary)" }}
                    >
                      Foro do Brasil
                    </a>
                    , do qual é Presidente Nacional. Defende liberdade, família e dignidade
                    humana em vários estados do país.
                  </p>
                  <p className="text-justify">
                    Candidato a Deputado Federal por São Paulo pelo PL, com mais de{" "}
                    <strong style={{ color: "var(--blue-primary)" }}>30 anos</strong> de fé e
                    serviço. Os números abaixo são públicos e conferíveis.
                  </p>
                </div>

                <p className="mt-4 inline-flex items-start gap-2 text-sm font-semibold text-gray-800">
                  <Quote
                    className="mt-0.5 size-4 shrink-0"
                    style={{ color: "var(--yellow-primary)" }}
                  />
                  “Pelo Brasil que acreditamos, pelos direitos que defendemos.”
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="min-w-0">
              <div className="relative mx-auto h-full w-full overflow-hidden rounded-2xl shadow-2xl md:ml-auto md:max-w-none md:aspect-[4/5] md:max-h-[480px]">
                <img
                  src={confiancaImg}
                  alt="Padre Kelmon em ato público"
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                  style={{ maxHeight: "480px" }}
                />
                <div className="absolute inset-0 ring-2 ring-inset ring-white/10 rounded-2xl" />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0, 60, 140, 0.55), transparent)",
                  }}
                />
                <div className="absolute bottom-5 left-5 right-5">
                  <p
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "var(--yellow-primary)" }}
                  >
                    Padre Kelmon
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white sm:text-base">
                    Candidato a Deputado Federal por São Paulo · PL
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Números-chave */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STATS.map((stat, index) => (
              <Reveal key={stat.label} delay={0.06 * index}>
                <div
                  className="group relative h-full overflow-hidden rounded-2xl border-2 bg-white px-5 py-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ borderColor: "rgba(0, 102, 204, 0.12)" }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    style={{ background: "var(--gradient-yellow)" }}
                  />
                  <p
                    className="text-3xl font-black tabular-nums sm:text-4xl lg:text-5xl"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--blue-primary)",
                    }}
                  >
                    <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </p>
                  <p className="mt-3 text-sm font-bold leading-snug text-gray-900">{stat.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500">{stat.note}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div id="presenca-foro" className="presenca-foro-grid mt-12">
                <div className="presenca-foro-copy min-w-0">
                  <p
                    className="text-sm font-bold uppercase tracking-widest"
                    style={{ color: "var(--yellow-primary)" }}
                  >
                    Foro do Brasil
                  </p>
                  <h3
                    className="mt-3 text-2xl font-black leading-tight sm:text-3xl"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--blue-primary)",
                    }}
                  >
                    17 estados com presença organizada
                  </h3>
                  <p className="mt-3 text-base font-semibold text-gray-800">
                    Diretórios estaduais em atuação no país
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-gray-700 sm:text-base">
                    O Foro do Brasil está presente nestes estados, com atuação organizada e
                    lideranças locais. Padre Kelmon é Presidente Nacional do movimento, fundado
                    em 2023.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {FORO_PRESENCE_STATES.map((state) => state.name).join(", ")}.
                  </p>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <p
                        className="text-sm font-black"
                        style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
                      >
                        Diretórios Nacionais
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {FORO_BRASIL.nationalDirectories.map((item) => (
                          <li key={item.href}>
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:underline"
                            >
                              <span
                                className="size-2 shrink-0 rounded-full"
                                style={{ background: "var(--yellow-primary)" }}
                              />
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p
                        className="text-sm font-black"
                        style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
                      >
                        Diretórios Internacionais
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {FORO_BRASIL.internationalDirectories.map((item) => (
                          <li key={item.href}>
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:underline"
                            >
                              <span
                                className="size-2 shrink-0 rounded-full"
                                style={{ background: "var(--yellow-primary)" }}
                              />
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href={FORO_BRASIL.directoriesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform hover:scale-105"
                    style={{
                      backgroundColor: "var(--yellow-primary)",
                      color: "var(--blue-primary)",
                    }}
                  >
                    Conheça o Foro do Brasil
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>

                <div className="presenca-foro-map min-w-0">
                  <BrazilPresenceMap />
                </div>
            </div>
          </Reveal>

          {/* Destaque Foro do Brasil */}
          <Reveal delay={0.12}>
            <div
              className="relative mt-12 overflow-hidden rounded-3xl px-6 py-8 text-white sm:px-10 sm:py-10"
              style={{ background: "var(--gradient-hero)" }}
            >
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 size-48 rounded-full opacity-20"
                style={{ background: "var(--yellow-primary)" }}
              />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-[0.22em]"
                    style={{ color: "var(--yellow-primary)" }}
                  >
                    {FORO_BRASIL.name} · desde {FORO_BRASIL.founded}
                  </p>
                  <h3
                    className="mt-3 text-2xl font-black leading-tight sm:text-3xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {FORO_BRASIL.tagline}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
                    {FORO_BRASIL.description}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/95">
                    <Quote className="size-4 shrink-0" style={{ color: "var(--yellow-primary)" }} />
                    Padre Kelmon, {FORO_BRASIL.role}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:items-start lg:items-end">
                  <a
                    href={FORO_BRASIL.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform hover:scale-105"
                    style={{
                      backgroundColor: "var(--yellow-primary)",
                      color: "var(--blue-primary)",
                    }}
                  >
                    Conhecer o Foro do Brasil
                    <ArrowUpRight className="size-4" />
                  </a>
                  <a
                    href={FORO_BRASIL.aboutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 underline-offset-4 hover:text-white hover:underline"
                  >
                    História, missão e liderança
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Pilares de confiança */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {TRUST_PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={0.05 * index}>
                <article className="flex h-full gap-4 rounded-2xl border border-blue-100/80 bg-white/90 p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
                  <span
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: "var(--blue-primary)" }}
                  >
                    <pillar.icon className="size-6 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3
                      className="text-lg font-black"
                      style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
                    >
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700">{pillar.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground">
              Fontes públicas: resultado eleitoral de 2022 (TSE); biografia e trabalho no{" "}
              <a
                href={FORO_BRASIL.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline-offset-2 hover:underline"
                style={{ color: "var(--blue-primary)" }}
              >
                Foro do Brasil
              </a>
              ; cobertura jornalística sobre a candidatura a Deputado Federal por São Paulo (PL).
            </p>
          </Reveal>
      </PageShell>
    </section>
  );
}
