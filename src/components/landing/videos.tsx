import { PlayCircle } from "lucide-react";

import { PageShell, Reveal, SectionHeading } from "./primitives";
import { VIDEOS } from "@/lib/campaign-data";

export function Videos() {
  return (
    <section id="videos" className="section-y border-t border-border/50 bg-card/30">
      <PageShell>
        <SectionHeading
          eyebrow="Vídeos"
          title="Palavra e presença"
          subtitle="Vídeos oficiais no YouTube e no Instagram. Os cartões levam ao perfil."
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {VIDEOS.map((v, i) => (
            <Reveal key={v.title} delay={0.06 * i}>
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card group flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative flex aspect-video items-center justify-center bg-[image:var(--gradient-hero)]">
                  <PlayCircle
                    className="size-14 text-primary transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <span className="absolute bottom-3 right-3 rounded-full border border-border bg-background/70 px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    Vídeo
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-base font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {v.description}
                  </p>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Assistir no perfil oficial
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </PageShell>
    </section>
  );
}
