import { useState } from "react";
import { Expand } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PageShell, Reveal, SectionHeading } from "./primitives";
import { GALLERY, type GalleryItem } from "@/lib/campaign-data";

export function Gallery() {
  const [active, setActive] = useState<GalleryItem | null>(null);

  return (
    <section id="galeria" className="section-y border-t border-border/50">
      <PageShell>
        <SectionHeading
          eyebrow="Galeria"
          title="Registros da caminhada"
          subtitle="Fotos da campanha e do perfil @pekelmon."
        />

        <div className="mt-8 columns-1 gap-5 sm:mt-12 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {GALLERY.map((item, i) => (
            <Reveal key={item.src} delay={0.04 * i} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setActive(item)}
                aria-label={`Ampliar imagem: ${item.alt}`}
                className="group relative block w-full overflow-hidden rounded-2xl border border-border/70"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-background/90 via-background/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex items-center gap-2 text-left text-xs text-foreground">
                    <Expand className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    {item.caption}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </PageShell>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl border-border bg-card p-2">
          <DialogTitle className="sr-only">{active?.alt ?? "Imagem"}</DialogTitle>
          {active ? (
            <figure>
              <img
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
                className="max-h-[75vh] w-full rounded-lg object-contain"
              />
              <figcaption className="px-2 py-3 text-center text-xs text-muted-foreground">
                {active.caption}
              </figcaption>
            </figure>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
