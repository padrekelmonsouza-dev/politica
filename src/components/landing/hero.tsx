import { motion } from "motion/react";

import { PageShell } from "./primitives";
import { HeroBannerCarousel } from "./hero-banner-carousel";
import { HeroServiceCards } from "./hero-service-cards";
import { HeroSocialBar } from "./hero-social-bar";
import { HeroStoryCarousel } from "./hero-story-carousel";

export function Hero({ embedded = false }: { embedded?: boolean }) {
  return (
    <section
      id={embedded ? undefined : "inicio"}
      className={`relative isolate bg-white pb-2 sm:pb-3 lg:pb-0 ${
        embedded ? "pt-2 sm:pt-3" : "pt-[4.25rem] sm:pt-[4.75rem]"
      }`}
    >
      <PageShell>
        {embedded ? null : (
          <h1 className="sr-only">
            Padre Kelmon
          </h1>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55 }}
        >
          <div className="flex min-w-0 flex-col items-center gap-3 lg:flex-row lg:items-start">
            <HeroBannerCarousel className="min-w-0 w-full flex-1 rounded-2xl shadow-lg" />
            <HeroStoryCarousel className="hero-story-card min-w-0 max-w-full shrink-0 rounded-2xl shadow-lg" />
          </div>
        </motion.div>
        <HeroSocialBar />
        <div className="civic-mobile-rail">
          <HeroServiceCards slots="rail" />
        </div>
      </PageShell>
    </section>
  );
}
