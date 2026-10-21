import { Shield, X } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { BANDEIRAS, type Bandeira } from "@/lib/campaign-data";
import fotoPadreKelmon from "@/assets/padre-kelmon-original.jpg";
import { PageShell, Reveal } from "./primitives";

export function Bandeiras({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  const [selected, setSelected] = useState<Bandeira | null>(null);
  const Heading = headingAs;

  return (
    <section id="bandeiras" className="section-pad bg-card/30">
      <PageShell>
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(16rem,22.5rem)_1fr] lg:gap-10">
          <div className="flex min-w-0 flex-col gap-3 lg:h-0 lg:min-h-full">
            <Reveal className="shrink-0">
              <Heading
                className="text-[1.75rem] font-semibold leading-tight sm:text-3xl lg:text-[1.85rem]"
                style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
              >
                As Pautas que Defendo
              </Heading>
              <p className="mt-1.5 text-sm leading-snug text-muted-foreground text-justify">
                Agenda conservadora cristã em defesa da família, da liberdade e do Brasil.
              </p>
            </Reveal>
            <figure className="relative aspect-[527/648] min-h-0 w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-[#d6d6d6] shadow-lg lg:aspect-auto lg:flex-1">
              <img
                src={fotoPadreKelmon}
                alt="Padre Kelmon, candidato a Deputado Federal por São Paulo"
                width={527}
                height={648}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 block h-full w-full object-cover object-center"
              />
            </figure>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {BANDEIRAS.map((b, i) => (
              <Reveal key={b.title} delay={0.04 * i} className="h-full">
                <button
                  type="button"
                  onClick={() => setSelected(b)}
                  className="surface-card group relative h-full w-full rounded-2xl border-2 border-gray-200 bg-white p-4 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-primary)] focus-visible:ring-offset-2 sm:p-5"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2.5">
                    <span
                      className="inline-flex size-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                      style={{ backgroundColor: "var(--blue-primary)" }}
                    >
                      <b.icon className="size-5 stroke-[2.5] text-white" aria-hidden="true" />
                    </span>
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide"
                      style={{
                        backgroundColor: "var(--yellow-primary)",
                        color: "var(--blue-primary)",
                      }}
                    >
                      <Shield className="size-3" />
                      {b.badge}
                    </div>
                  </div>

                  <h3
                    className="mb-2 text-base font-black leading-tight"
                    style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
                  >
                    {b.title}
                  </h3>

                  <p className="line-clamp-3 text-sm leading-relaxed text-gray-700 text-justify">
                    {b.description}
                  </p>
                  <span
                    className="mt-2 inline-block text-xs font-bold"
                    style={{ color: "var(--blue-primary)" }}
                  >
                    Ler mais
                  </span>

                  <div
                    className="absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(0, 102, 204, 0.08), transparent)",
                    }}
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-xs text-muted-foreground sm:mt-10">
            Conteúdo baseado em posicionamentos públicos. Revisar e ampliar com o programa oficial
            quando disponível.
          </p>
        </Reveal>
      </PageShell>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent
          hideCloseButton
          className="w-[min(96vw,36rem)] max-w-[min(96vw,36rem)] gap-0 overflow-hidden border-0 bg-white p-0 sm:rounded-2xl"
        >
          {selected ? (
            <>
              <div className="relative border-b px-5 py-4 pr-14 sm:px-6">
                <div className="mb-3 flex flex-wrap items-center gap-2.5">
                  <span
                    className="inline-flex size-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "var(--blue-primary)" }}
                  >
                    <selected.icon className="size-5 stroke-[2.5] text-white" aria-hidden="true" />
                  </span>
                  <div
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor: "var(--yellow-primary)",
                      color: "var(--blue-primary)",
                    }}
                  >
                    <Shield className="size-3" />
                    {selected.badge}
                  </div>
                </div>
                <DialogTitle
                  className="text-xl font-black leading-tight sm:text-2xl"
                  style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
                >
                  {selected.title}
                </DialogTitle>
                <DialogClose className="absolute right-3 top-3 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                  <X className="size-5" />
                  <span className="sr-only">Fechar</span>
                </DialogClose>
              </div>
              <div className="max-h-[min(60dvh,28rem)] overflow-y-auto px-5 py-5 sm:px-6">
                <DialogDescription className="text-base leading-relaxed text-gray-700 text-justify">
                  {selected.description}
                </DialogDescription>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
