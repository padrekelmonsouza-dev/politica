import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  HERO_BANNER_HEIGHT,
  HERO_BANNER_WIDTH,
  HERO_BANNERS,
} from "@/lib/hero-banners";
import { cn } from "@/lib/utils";

export function HeroBannerCarousel({
  className,
  sizes = "(min-width: 1280px) 1280px, 100vw",
}: {
  className?: string;
  sizes?: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActive(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const id = window.setTimeout(() => {
      api.scrollNext();
    }, HERO_BANNERS[active]?.holdMs ?? 8000);
    return () => window.clearTimeout(id);
  }, [api, active]);

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <Carousel
        opts={{ align: "start", loop: true, duration: 20 }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {HERO_BANNERS.map((banner, index) => (
            <CarouselItem key={banner.src} className="basis-full pl-0">
              <div
                className="relative w-full bg-[var(--blue-primary)]"
                style={{ aspectRatio: `${HERO_BANNER_WIDTH} / ${HERO_BANNER_HEIGHT}` }}
              >
                <img
                  src={banner.src}
                  alt={banner.alt}
                  width={HERO_BANNER_WIDTH}
                  height={HERO_BANNER_HEIGHT}
                  sizes={sizes}
                  fetchPriority={index === 0 ? "high" : "low"}
                  decoding={index === 0 ? "sync" : "async"}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover object-center select-none"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
