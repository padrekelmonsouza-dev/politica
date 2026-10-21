import { PageShell } from "./primitives";
import { HeroServiceCards } from "./hero-service-cards";
import { NewsAndBook } from "./news-and-book";
import { VideoHighlights } from "./video-highlights";

export function Highlights() {
  return (
    <section
      id="destaques"
      aria-labelledby="destaques-heading"
      className="relative mt-6 pb-8 sm:mt-8 sm:pb-10 md:mt-[calc(0.5rem-1%)] lg:mt-8"
    >
      <PageShell>
        <h2 id="destaques-heading" className="sr-only">
          Destaques da campanha
        </h2>
        <div
          className="youtube-civic-row"
          style={{ display: "grid", alignItems: "start", gap: "1rem" }}
        >
          <div className="highlights-main">
            <VideoHighlights />
            <NewsAndBook />
          </div>
          <HeroServiceCards slots="rail" />
        </div>
      </PageShell>
    </section>
  );
}
