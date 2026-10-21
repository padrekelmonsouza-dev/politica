import { Play } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reveal } from "./primitives";

type DefesaVideo = {
  id: string;
  src: string;
  poster: string;
  title: string;
  description: string;
};

const FEATURED: DefesaVideo = {
  id: "fome",
  src: "/videos/defesa/fome-na-venezuela.mp4",
  poster: "/videos/defesa/thumbs/fome-na-venezuela.jpg",
  title: "Fome na Venezuela",
  description: "O drama humanitário na Venezuela e a defesa da vida e da dignidade.",
};

const SIDE_VIDEOS: DefesaVideo[] = [
  {
    id: "servir",
    src: "/videos/defesa/servir.mp4",
    poster: "/videos/defesa/thumbs/servir.jpg",
    title: "Servir",
    description: "A vocação de servir o próximo.",
  },
  {
    id: "calar",
    src: "/videos/defesa/tentaram-me-calar.mp4",
    poster: "/videos/defesa/thumbs/tentaram-me-calar.jpg",
    title: "Tentaram me calar",
    description: "A voz que não se cala em defesa da verdade.",
  },
  {
    id: "mae",
    src: "/videos/defesa/mae.mp4",
    poster: "/videos/defesa/thumbs/mae.jpg",
    title: "Mãe",
    description: "Em defesa da mãe e da família.",
  },
  {
    id: "aborto",
    src: "/videos/defesa/aborto-aprovado.mp4",
    poster: "/videos/defesa/thumbs/aborto-aprovado.jpg",
    title: "Aborto aprovado",
    description: "Em defesa da vida desde a concepção.",
  },
];

export function DefesaDoBrasil() {
  const [active, setActive] = useState<DefesaVideo | null>(null);

  return (
    <div id="defesa-do-brasil" className="mt-14 sm:mt-16">
      <Reveal>
        <p
          className="mb-1.5 text-sm font-bold uppercase tracking-widest"
          style={{ color: "var(--yellow-primary)" }}
        >
          Em defesa do Brasil
        </p>
        <h2
          className="text-[1.6rem] font-black leading-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
        >
          Em defesa do ser humano
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-700 sm:text-base">
          Vídeos de Padre Kelmon sobre a fome, o serviço, a mãe, a voz que não se cala e a defesa
          dos que não podem se defender.
        </p>
      </Reveal>

      <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-5">
        <Reveal className="min-w-0">
          <article className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg">
            <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
              <video
                className="absolute inset-0 h-full w-full object-contain"
                src={FEATURED.src}
                poster={FEATURED.poster}
                controls
                playsInline
                preload="none"
                title={FEATURED.title}
              >
                Seu navegador não reproduz vídeo.{" "}
                <a href={FEATURED.src} className="underline">
                  Baixar {FEATURED.title}
                </a>
                .
              </video>
            </div>
            <div className="p-3 sm:p-4">
              <h3
                className="text-base font-black sm:text-lg"
                style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
              >
                {FEATURED.title}
              </h3>
              <p className="mt-1 text-sm leading-snug text-gray-600">{FEATURED.description}</p>
            </div>
          </article>
        </Reveal>

        <div className="grid h-full min-h-0 grid-cols-2 grid-rows-2 gap-2 sm:gap-3">
          {SIDE_VIDEOS.map((video, index) => (
            <Reveal key={video.id} delay={0.04 * index} className="min-h-0">
              <button
                type="button"
                onClick={() => setActive(video)}
                className="group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border-2 border-gray-200 bg-white text-left shadow-sm transition hover:border-blue-500 hover:shadow-md"
              >
                <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-neutral-900">
                  <img
                    src={video.poster}
                    alt=""
                    width={640}
                    height={360}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/40">
                    <span className="inline-flex size-9 items-center justify-center rounded-full bg-red-600 text-white shadow-lg sm:size-10">
                      <Play className="size-4 fill-current sm:size-5" aria-hidden="true" />
                    </span>
                  </span>
                </div>
                <div className="flex shrink-0 flex-col gap-0.5 p-2 sm:p-2.5">
                  <h3
                    className="line-clamp-1 text-xs font-bold leading-snug sm:text-sm"
                    style={{ color: "var(--blue-primary)" }}
                  >
                    {video.title}
                  </h3>
                  <p className="line-clamp-2 text-[11px] leading-snug text-gray-600 sm:text-xs">
                    {video.description}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl gap-3 border-0 bg-white p-3 sm:p-4">
          <DialogHeader className="pr-8 text-left">
            <DialogTitle className="line-clamp-2 text-base sm:text-lg">
              {active?.title ?? "Vídeo"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Reprodução do vídeo em defesa do ser humano
            </DialogDescription>
          </DialogHeader>
          {active ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <video
                key={active.id}
                className="absolute inset-0 h-full w-full object-contain"
                src={active.src}
                poster={active.poster}
                controls
                autoPlay
                playsInline
                title={active.title}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
