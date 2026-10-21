import { useEffect, useRef, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HERO_CAROUSELS,
  HERO_STORY_HEIGHT,
  HERO_STORY_WIDTH,
} from "@/lib/hero-story-slides";
import { cn } from "@/lib/utils";

type StorySlide = {
  src: string;
  alt: string;
  kind?: "image" | "video";
};

function isVideoSlide(slide: StorySlide) {
  return slide.kind === "video";
}

function mediaCountLabel(slides: readonly StorySlide[]) {
  const videos = slides.filter(isVideoSlide).length;
  const images = slides.length - videos;
  const parts: string[] = [];
  if (images > 0) parts.push(`${images} ${images === 1 ? "imagem" : "imagens"}`);
  if (videos > 0) parts.push(`${videos} ${videos === 1 ? "vídeo" : "vídeos"}`);
  return parts.join(" · ");
}

function StoryCarousel({
  slides,
  label,
  onIndexChange,
}: {
  slides: readonly StorySlide[];
  label: string;
  onIndexChange: (index: number) => void;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      const index = api.selectedScrollSnap();
      setActive(index);
      onIndexChange(index);
      videoRefs.current.forEach((video, i) => {
        if (video && i !== index) video.pause();
      });
    };
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onIndexChange]);

  return (
    <Carousel
      opts={{ align: "start", loop: true, duration: 18, dragFree: false }}
      setApi={setApi}
      className="h-full w-full"
      aria-label={label}
    >
      <CarouselContent className="-ml-0 h-full">
        {slides.map((slide, index) => (
          <CarouselItem key={slide.src} className="h-full basis-full pl-0">
            <div
              className="relative mx-auto h-full w-full overflow-hidden bg-[var(--blue-primary)]"
              style={{ aspectRatio: `${HERO_STORY_WIDTH} / ${HERO_STORY_HEIGHT}` }}
            >
              {isVideoSlide(slide) ? (
                <video
                  ref={(node) => {
                    videoRefs.current[index] = node;
                  }}
                  src={slide.src}
                  controls
                  playsInline
                  preload={index === active ? "metadata" : "none"}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                >
                  <track kind="captions" />
                </video>
              ) : (
                <img
                  src={slide.src}
                  alt={slide.alt}
                  width={HERO_STORY_WIDTH}
                  height={HERO_STORY_HEIGHT}
                  sizes="(min-width: 768px) 28rem, 90vw"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover object-center select-none"
                />
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        disabled={false}
        className="left-2 top-1/2 z-10 size-10 -translate-y-1/2 border-0 bg-white/95 text-[var(--blue-primary)] shadow-md hover:bg-white"
        aria-label="Item anterior"
      />
      <CarouselNext
        disabled={false}
        className="right-2 top-1/2 z-10 size-10 -translate-y-1/2 border-0 bg-white/95 text-[var(--blue-primary)] shadow-md hover:bg-white"
        aria-label="Próximo item"
      />
    </Carousel>
  );
}

export function HeroStoryCarousel({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [matched, setMatched] = useState<{ height: number; width: number } | null>(null);
  const [selectedId, setSelectedId] = useState<(typeof HERO_CAROUSELS)[number]["id"]>(
    HERO_CAROUSELS[0].id,
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const selected = HERO_CAROUSELS.find((item) => item.id === selectedId) ?? HERO_CAROUSELS[0];
  const selectedIndex = HERO_CAROUSELS.findIndex((item) => item.id === selected.id);
  const cover = selected.slides[0];

  useEffect(() => {
    if (open) setActive(0);
  }, [open]);

  useEffect(() => {
    const card = rootRef.current;
    const row = card?.parentElement;
    const banner = card?.previousElementSibling as HTMLElement | undefined;
    if (!card || !row || !banner) return;

    const sync = () => {
      const sideBySide = getComputedStyle(row).flexDirection === "row";
      const bannerBox = banner.getBoundingClientRect();
      if (!sideBySide) {
        const width = Math.round(bannerBox.width || row.clientWidth);
        if (width < 8) {
          setMatched(null);
          return;
        }
        setMatched({
          width,
          height: Math.round(width * (HERO_STORY_HEIGHT / HERO_STORY_WIDTH)),
        });
        return;
      }
      const height = Math.round(bannerBox.height);
      if (height < 8) {
        setMatched(null);
        return;
      }
      const width = Math.round(height * (HERO_STORY_WIDTH / HERO_STORY_HEIGHT));
      setMatched({
        height,
        width: Math.min(width, Math.max(160, Math.round(row.clientWidth * 0.3))),
      });
    };

    const observer = new ResizeObserver(sync);
    observer.observe(banner);
    observer.observe(row);
    window.addEventListener("resize", sync);
    sync();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  if (!cover) return null;

  return (
    <>
      <div
        ref={rootRef}
        className={cn("relative overflow-hidden", className)}
        style={
          matched
            ? { width: matched.width, height: matched.height }
            : {
                width: "min(17.5rem, 100%)",
                maxWidth: "100%",
                aspectRatio: `${HERO_STORY_WIDTH} / ${HERO_STORY_HEIGHT}`,
              }
        }
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block h-full w-full overflow-hidden text-left"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <div className="relative h-full w-full overflow-hidden bg-[var(--blue-primary)]">
            <div
              className="flex h-full transition-transform duration-500 ease-out"
              style={{
                width: `${HERO_CAROUSELS.length * 100}%`,
                transform: `translateX(-${selectedIndex * (100 / HERO_CAROUSELS.length)}%)`,
              }}
            >
              {HERO_CAROUSELS.map((item) => {
                const itemCover = item.slides[0];
                return (
                  <div
                    key={item.id}
                    className="relative h-full shrink-0"
                    style={{ width: `${100 / HERO_CAROUSELS.length}%` }}
                  >
                    <img
                      src={itemCover.src}
                      alt={itemCover.alt}
                      width={HERO_STORY_WIDTH}
                      height={HERO_STORY_HEIGHT}
                      sizes="(min-width: 1024px) 26vw, 90vw"
                      fetchPriority="low"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  </div>
                );
              })}
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute inset-x-2.5 bottom-2.5 text-xs font-semibold leading-snug text-white">
              {selected.title} · {mediaCountLabel(selected.slides)} · Clique para abrir
            </span>
          </div>
        </button>

        <div
          role="tablist"
          aria-label="Escolher carrossel"
          className="absolute z-10 flex items-stretch overflow-hidden rounded-lg bg-white/95 shadow-sm"
          style={{ top: "0.55rem", left: "5%", width: "90%", gap: 2, padding: 2 }}
        >
          {HERO_CAROUSELS.map((item) => {
            const isActive = item.id === selected.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={item.title}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedId(item.id);
                }}
                style={
                  isActive
                    ? { flex: 1, minWidth: 0, height: 25 }
                    : { width: 25, height: 25, flexShrink: 0 }
                }
                className={`flex items-center justify-center overflow-hidden rounded-md text-[0.58rem] font-black uppercase tracking-wide transition-all duration-300 ease-out ${
                  isActive
                    ? "gap-1 bg-[var(--blue-primary)] px-1 text-white"
                    : "text-[var(--blue-primary)] hover:bg-black/5"
                }`}
              >
                {isActive ? (
                  <>
                    <span className="truncate">Carrossel</span>
                    <span
                      className="grid shrink-0 place-items-center rounded-full bg-white font-black text-[var(--blue-primary)]"
                      style={{ width: 18, height: 18, fontSize: "0.56rem" }}
                    >
                      {item.id}
                    </span>
                  </>
                ) : (
                  item.id
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="gap-0 overflow-hidden border-0 bg-white p-0 sm:rounded-2xl"
          style={{ width: "min(96vw, 28rem)", maxWidth: "min(96vw, 28rem)", maxHeight: "94dvh" }}
        >
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3 pr-12">
            <div className="min-w-0">
              <DialogTitle className="text-sm font-black uppercase tracking-wide text-[var(--blue-primary)]">
                {selected.title}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-xs text-gray-600">
                {active + 1} de {selected.slides.length} · {mediaCountLabel(selected.slides)}
              </DialogDescription>
            </div>
          </div>
          {open ? (
            <div className="relative bg-[var(--blue-primary)]">
              <StoryCarousel
                key={selected.id}
                slides={selected.slides}
                label={`${selected.title} — imagens de Padre Kelmon`}
                onIndexChange={setActive}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
