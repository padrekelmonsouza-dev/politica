import {
  ArrowRight,
  Flag,
  Globe,
  Heart,
  Landmark,
  MessageSquare,
  Quote,
  Shield,
  Users,
} from "lucide-react";

import foroImg from "@/assets/foro-do-brasil.webp";
import { Button } from "@/components/ui/button";
import { FORO_BRASIL } from "@/lib/campaign-data";
import { PageShell, Reveal } from "./primitives";

const VALUE_ICONS = [Flag, Landmark, MessageSquare, Heart] as const;
const PILLAR_ICONS = [Shield, Globe, Users] as const;

export function ForoDoBrasil() {
  return (
    <section
      id="foro-do-brasil"
      aria-labelledby="foro-do-brasil-heading"
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
            <figure className="relative flex h-full min-h-[16rem] flex-col overflow-hidden rounded-xl border-2 border-gray-200 bg-neutral-900 shadow-lg sm:min-h-[18rem]">
              <div className="relative min-h-0 flex-1">
                <img
                  src={foroImg}
                  alt=""
                  aria-hidden="true"
                  width={800}
                  height={400}
                  className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-40 blur-md"
                />
                <img
                  src={foroImg}
                  alt="Padre Kelmon, Presidente Nacional do Foro do Brasil"
                  width={800}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 m-auto h-full w-full object-contain object-center"
                />
              </div>
              <figcaption className="relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-2 bg-white px-4 py-2.5 sm:px-5">
                <span
                  className="text-sm font-black"
                  style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
                >
                  Padre Kelmon
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {FORO_BRASIL.role} · desde {FORO_BRASIL.founded}
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.08} className="order-1 flex min-w-0 flex-col justify-center md:order-2">
            <h2 id="foro-do-brasil-heading" className="sr-only">
              Foro do Brasil
            </h2>
            <p
              className="inline-flex w-fit max-w-full rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide sm:text-xs"
              style={{
                backgroundColor: "var(--yellow-primary)",
                color: "var(--blue-primary)",
              }}
            >
              {FORO_BRASIL.slogan}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-gray-700 text-justify sm:text-base">
              {FORO_BRASIL.description}
            </p>
            <blockquote className="mt-5 rounded-xl border-2 border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <Quote
                className="mb-2 size-5"
                style={{ color: "var(--yellow-primary)" }}
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-gray-800 italic sm:text-[0.95rem]">
                “{FORO_BRASIL.quote}”
              </p>
              <footer
                className="mt-3 text-xs font-bold uppercase tracking-wide"
                style={{ color: "var(--blue-primary)" }}
              >
                {FORO_BRASIL.quoteAuthor}
              </footer>
            </blockquote>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {FORO_BRASIL.values.map((value, i) => {
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

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {FORO_BRASIL.pillars.map((pillar, i) => {
            const Icon = PILLAR_ICONS[i] ?? Shield;
            return (
              <Reveal key={pillar.title} delay={0.05 * i}>
                <article className="group flex h-full flex-col rounded-xl border-2 border-gray-200 bg-white p-5 shadow-lg transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl sm:p-6">
                  <span
                    className="mb-4 inline-flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: "var(--blue-primary)" }}
                  >
                    <Icon className="size-6 text-white" aria-hidden="true" />
                  </span>
                  <h3
                    className="mb-3 text-lg font-black leading-tight"
                    style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-700 text-justify">
                    {pillar.description}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-11 w-full border-2 border-[var(--blue-primary)] font-bold text-[var(--blue-primary)] transition-colors hover:bg-blue-600 hover:text-white active:bg-blue-700 active:text-white"
                  >
                    <a href={pillar.href} target="_blank" rel="noopener noreferrer">
                      {pillar.cta}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                  </Button>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 rounded-xl border-2 border-gray-200 bg-white p-5 shadow-sm sm:mt-10 sm:p-6">
            <p
              className="mb-4 text-center text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--blue-primary)" }}
            >
              Diretórios e frentes
            </p>
            <ul className="flex flex-wrap justify-center gap-2">
              {FORO_BRASIL.fronts.map((front) => (
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
                <a href={FORO_BRASIL.url} target="_blank" rel="noopener noreferrer">
                  Visitar forobrasil.org
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
