import { useQuery } from "@tanstack/react-query";
import { Quote } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Link } from "@tanstack/react-router";

import sobreRotating1 from "@/assets/sobre-rotating-1.webp";
import sobreRotating2 from "@/assets/sobre-rotating-2.webp";
import sobreRotating3 from "@/assets/sobre-rotating-3.webp";
import { Button } from "@/components/ui/button";
import { getTimelinePhotos } from "@/lib/timeline-photos";
import { PageShell } from "./primitives";
import { TIMELINE_CARD_META, TimelineCards } from "./timeline-cards";
import { cn } from "@/lib/utils";

const SOBRE_PORTRAITS = [
  {
    src: sobreRotating1,
    alt: "Padre Kelmon, retrato com fundo amarelo",
    caption: "Padre Kelmon",
  },
  {
    src: sobreRotating2,
    alt: "Padre Kelmon, retrato com fundo azul",
    caption: "Padre Kelmon",
  },
  {
    src: sobreRotating3,
    alt: "Padre Kelmon, retrato com fundo verde",
    caption: "Padre Kelmon",
  },
] as const;

const HISTORIA_ROTATE_MS = 7000;
const HISTORIA_HEIGHT = 600;
const HISTORIA_SWIPE_PX = 40;

const HISTORIA_LIMITS: Record<string, number> = {
  "minhas-raizes": 4,
  "na-juventude": 3,
  "seminario": 2,
  "ordenacao-diaconal": 2,
  "associacao": 2,
  "seminario-santana-dos-melquitas": 2,
  "ordenacao-ortodoxa": 2,
  "missao-ortodoxa-em-serrolandia": 2,
  "pastoral-com-venezuelanos": 2,
  "livro-fe-e-politica": 2,
  "ilha-de-mare": 2,
  "atividades-politicas": 2,
};

/** Preview curto — mesma altura aproximada do bloco atual (3 parágrafos). */
const BIO_PREVIEW = [
  "Padre Kelmon nasceu em Salvador, na Bahia, em 1976. Há mais de 30 anos vive a fé no dia a dia: formação, pastoral e o debate público.",
  "Começou na juventude, na Legião de Maria. Depois estudou Filosofia, Teologia e Pedagogia e atuou em missões e ações humanitárias.",
  "Em 2026, confirma a candidatura a Deputado Federal por São Paulo pelo Partido Liberal (PL).",
];

type HistoriaSlide = {
  src: string;
  alt: string;
  caption: string;
};

function pickHistoriaSlides(
  byFolder: Record<string, { src: string; name: string; kind?: "image" | "video" }[]> | undefined,
): HistoriaSlide[] {
  if (!byFolder) return [];
  const slides: HistoriaSlide[] = [];
  const historiaAcervo = (byFolder["historia-em-imagens"] ?? []).filter(
    (file) => (file.kind ?? "image") !== "video",
  );
  historiaAcervo.forEach((file, index) => {
    slides.push({
      src: file.src,
      alt: `Minha história em imagens — registro ${index + 1}`,
      caption: "Minha história",
    });
  });
  for (const meta of TIMELINE_CARD_META) {
    const files = (byFolder[meta.folder] ?? []).filter((file) => (file.kind ?? "image") !== "video");
    if (files.length === 0) continue;
    const cover = meta.coverFile ? files.find((file) => file.name === meta.coverFile) : undefined;
    const rest = cover ? files.filter((file) => file.name !== meta.coverFile) : files;
    const ordered = cover ? [cover, ...rest] : rest;
    const caption = meta.cardTitle ?? meta.title;
    ordered.slice(0, HISTORIA_LIMITS[meta.folder] ?? 2).forEach((file, index) => {
      slides.push({
        src: file.src,
        alt: index === 0 ? caption : `${caption} — registro ${index + 1}`,
        caption,
      });
    });
  }
  return slides;
}

function HistoriaImagensCarousel() {
  const photosQuery = useQuery({
    queryKey: ["timeline-photos", "live-public-folder-v2"],
    queryFn: () => getTimelinePhotos(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
  const timelineSlides = useMemo(
    () => pickHistoriaSlides(photosQuery.data?.byFolder),
    [photosQuery.data?.byFolder],
  );
  const slides: HistoriaSlide[] = timelineSlides.length > 0 ? timelineSlides : [...SOBRE_PORTRAITS];
  const [active, setActive] = useState(0);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const index = active % slides.length;

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setActive((currentIndex) => (currentIndex + 1) % slides.length);
    }, HISTORIA_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [slides.length, index]);

  const go = (direction: 1 | -1) => {
    setActive((currentIndex) => (currentIndex + direction + slides.length) % slides.length);
  };

  return (
    <div className="flex h-full min-w-0 flex-col">
      <p
        className="mb-3 text-sm font-bold uppercase tracking-widest"
        style={{ color: "var(--blue-primary)" }}
      >
        Minha história em imagens
      </p>
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-neutral-100"
        style={{ height: HISTORIA_HEIGHT }}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Minha história em imagens"
        onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
          pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
          try {
            event.currentTarget.setPointerCapture(event.pointerId);
          } catch {
            /* swipe still works from pointerup coordinates */
          }
        }}
        onPointerUp={(event: PointerEvent<HTMLDivElement>) => {
          const start = pointer.current;
          pointer.current = null;
          if (!start || start.id !== event.pointerId) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) >= HISTORIA_SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
            go(dx < 0 ? 1 : -1);
          }
        }}
        onPointerCancel={() => {
          pointer.current = null;
        }}
      >
        {slides.map((slide, slideIndex) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={800}
            height={HISTORIA_HEIGHT}
            loading={slideIndex === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={{
              opacity: slideIndex === index ? 1 : 0,
              transition: "opacity 1.4s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function About({
  headingAs = "h2",
  standalone = false,
}: {
  headingAs?: "h1" | "h2";
  standalone?: boolean;
}) {
  const Heading = headingAs;
  return (
    <section
      id="historia"
      className={cn(
        "section-pad relative",
        standalone
          ? "bg-white"
          : "max-sm:!pt-3 md:-mt-[7%] md:scroll-mt-[calc(6rem+env(safe-area-inset-top,0px))] lg:mt-0 lg:scroll-mt-[calc(4.5rem+env(safe-area-inset-top,0px))]",
      )}
      style={{ background: "linear-gradient(to bottom, #ffffff, #f9fafb)" }}
    >
      <PageShell>
        <div className="mb-10 grid items-stretch gap-6 sm:mb-14 md:mb-16 md:grid-cols-2 md:gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 min-w-0 md:order-1"
          >
            <HistoriaImagensCarousel />
          </motion.div>

          <div className="order-1 flex h-full min-w-0 flex-col justify-between md:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-5 sm:mb-6"
            >
              <p
                className="mb-3 text-sm font-bold uppercase tracking-widest"
                style={{ color: "var(--yellow-primary)" }}
              >
                Sobre Padre Kelmon
              </p>
              <Heading
                className="display-heading font-black"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--blue-primary)",
                  fontSize: "clamp(1.5rem, 4vw, 2.75rem)",
                }}
              >
                {standalone ? "Padre Kelmon Biografia" : "Uma Vida de Fé e Serviço"}
              </Heading>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              {BIO_PREVIEW.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-base leading-relaxed text-gray-700 text-justify sm:text-lg ${
                    index < BIO_PREVIEW.length - 1 ? "mb-4" : "mb-5"
                  }`}
                >
                  {paragraph}
                </p>
              ))}

              <Button asChild variant="yellow" className="h-11 px-6 text-base font-bold">
                <Link to="/saiba-mais">Saiba mais</Link>
              </Button>
            </motion.div>

            <motion.blockquote
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative mt-6 overflow-hidden rounded-2xl p-6 shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--blue-primary), #0052a3)" }}
            >
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, white 2px, transparent 2px), radial-gradient(circle at 80% 70%, white 2px, transparent 2px)",
                  backgroundSize: "60px 60px",
                }}
              />
              <Quote className="relative mx-auto mb-3 size-6 text-yellow-400" aria-hidden="true" />
              <p
                className="relative text-center text-lg font-black leading-relaxed text-white sm:text-xl lg:text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                "Juntos vamos resgatar o Brasil."
              </p>
              <footer className="relative mt-3 text-center text-xs font-semibold uppercase tracking-wider text-yellow-300">
                Padre Kelmon, São Paulo, 2026
              </footer>
            </motion.blockquote>
          </div>
        </div>

        <TimelineCards />
      </PageShell>
    </section>
  );
}
