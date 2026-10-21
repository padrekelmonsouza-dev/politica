import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { YOUTUBE_HIGHLIGHTS, YOUTUBE_PINNED_GRID_IDS, type YoutubeHighlight } from "@/data/youtube-highlights";
import { getYoutubeGridVideos } from "@/lib/youtube-grid";

const FEATURED_WIDTH = 1080;
const FEATURED_HEIGHT = 1920;

const FEATURED_VIDEOS = [
  {
    id: 1,
    src: "/destaques/video-destaque.mp4",
    label: "Fé",
    title: "Fé",
  },
  {
    id: 2,
    src: "/destaques/dr-marcelo-polegar.mp4",
    label: "Marcelo Polegar",
    title: "Marcelo Polegar",
  },
  {
    id: 3,
    src: "/destaques/autenticidade-crista.mp4",
    label: "Cristiane Brasil",
    title: "Cristiane Brasil",
  },
  {
    id: 4,
    src: "/destaques/padre-kelmon.mp4",
    label: "Senador Marcos Pontes",
    title: "Senador Marcos Pontes",
  },
] as const;

const PREVIEW_WIDTH = 1920;
const PREVIEW_HEIGHT = 1080;

const SIDE_PAGE_SIZE = 4;
const LATEST_SLOT_COUNT = 1;
const PINNED_SLOT_COUNT = YOUTUBE_PINNED_GRID_IDS.length;
const ROTATING_SLOT_COUNT = Math.max(
  0,
  SIDE_PAGE_SIZE - LATEST_SLOT_COUNT - PINNED_SLOT_COUNT,
);

function youtubePreviewSrc(id: string) {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}
/** 1 minuto em cada conjunto de cards laterais antes de trocar. */
const SIDE_ROTATE_MS = 60_000;
/** Cards laterais em rotação (além dos vídeos fixos). */
const SIDE_ROTATION_LIMIT = 16;

function rankScore(
  video: YoutubeHighlight,
  maxViews: number,
  minDate: number,
  maxDate: number,
) {
  const viewsScore = maxViews > 0 ? video.views / maxViews : 0;
  const published = Date.parse(video.published || "") || minDate;
  const dateRange = Math.max(maxDate - minDate, 1);
  const recencyScore = (published - minDate) / dateRange;
  return viewsScore * 0.55 + recencyScore * 0.45;
}

function rankVideos(videos: YoutubeHighlight[]) {
  if (videos.length === 0) return [];
  const maxViews = Math.max(...videos.map((v) => v.views), 1);
  const dates = videos.map((v) => Date.parse(v.published || "") || 0);
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  return [...videos].sort(
    (a, b) => rankScore(b, maxViews, minDate, maxDate) - rankScore(a, maxViews, minDate, maxDate),
  );
}

function VideoCard({
  video,
  onOpen,
}: {
  video: YoutubeHighlight;
  onOpen: (video: YoutubeHighlight) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(video)}
      aria-label={`Assistir ${video.title}`}
      className="group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border-2 border-gray-200 bg-white text-left shadow-sm transition hover:border-blue-500 hover:shadow-md"
    >
      <div
        className="youtube-card-preview relative w-full shrink-0 overflow-hidden bg-gray-100"
        style={{ aspectRatio: `${PREVIEW_WIDTH} / ${PREVIEW_HEIGHT}` }}
      >
        <img
          src={youtubePreviewSrc(video.id)}
          alt=""
          width={PREVIEW_WIDTH}
          height={PREVIEW_HEIGHT}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = video.thumbnail;
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/35">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-red-600 text-white shadow-lg sm:size-10">
            <Play className="size-4 fill-current sm:size-5" aria-hidden="true" />
          </span>
        </span>
      </div>
      <div className="flex shrink-0 flex-col gap-1 p-2 sm:p-2.5">
        <h3
          className="line-clamp-2 text-xs font-bold leading-snug sm:text-sm"
          style={{ color: "var(--blue-primary)" }}
          title={video.title}
        >
          {video.title}
        </h3>
        <p className="line-clamp-1 text-[11px] leading-snug text-gray-600 sm:text-xs">
          {video.description}
        </p>
      </div>
    </button>
  );
}

const FEATURED_ROTATE_MS = 2 * 60 * 1000;

function pickRandomFeaturedId(currentId: (typeof FEATURED_VIDEOS)[number]["id"]) {
  const others = FEATURED_VIDEOS.filter((item) => item.id !== currentId);
  return others[Math.floor(Math.random() * others.length)]?.id ?? currentId;
}

function FeaturedVideoCarousel() {
  const [selectedId, setSelectedId] = useState<(typeof FEATURED_VIDEOS)[number]["id"]>(
    FEATURED_VIDEOS[0].id,
  );
  const selected = FEATURED_VIDEOS.find((item) => item.id === selectedId) ?? FEATURED_VIDEOS[0];

  useEffect(() => {
    const id = window.setInterval(() => {
      setSelectedId((current) => pickRandomFeaturedId(current));
    }, FEATURED_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [selectedId]);

  return (
    <div
      className="youtube-featured"
      style={{ aspectRatio: `${FEATURED_WIDTH} / ${FEATURED_HEIGHT}` }}
    >
      <video
        key={selected.src}
        src={selected.src}
        width={FEATURED_WIDTH}
        height={FEATURED_HEIGHT}
        controls
        playsInline
        preload="metadata"
        title={selected.title}
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        Seu navegador não reproduz vídeo.{" "}
        <a href={selected.src} className="underline">
          Baixar {selected.title}
        </a>
        .
      </video>

      <div
        role="tablist"
        aria-label="Escolher vídeo"
        className="absolute z-10 flex items-stretch overflow-hidden rounded-lg bg-white/95 shadow-sm"
        style={{ top: "0.55rem", left: "5%", width: "90%", gap: 2, padding: 2 }}
      >
        {FEATURED_VIDEOS.map((item) => {
          const isActive = item.id === selected.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={item.title}
              onClick={() => setSelectedId(item.id)}
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
                  <span
                    className="grid shrink-0 place-items-center rounded-full bg-white font-black text-[var(--blue-primary)]"
                    style={{ width: 18, height: 18, fontSize: "0.56rem" }}
                  >
                    {item.id}
                  </span>
                  <span className="truncate">{item.label}</span>
                </>
              ) : (
                item.id
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const YOUTUBE_REFRESH_MS = 60_000;

export function VideoHighlights() {
  const youtubeQuery = useQuery({
    queryKey: ["youtube-grid", "live-uploads"],
    queryFn: () => getYoutubeGridVideos(),
    staleTime: YOUTUBE_REFRESH_MS,
    refetchInterval: YOUTUBE_REFRESH_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: YOUTUBE_HIGHLIGHTS,
  });
  const videos = youtubeQuery.data ?? YOUTUBE_HIGHLIGHTS;
  const ranked = useMemo(() => rankVideos(videos), [videos]);
  const [page, setPage] = useState(0);
  const [active, setActive] = useState<YoutubeHighlight | null>(null);

  const latestVideo = videos[0];

  const pinned = useMemo(() => {
    const byId = new Map(videos.map((video) => [video.id, video]));
    return YOUTUBE_PINNED_GRID_IDS.map((id) => byId.get(id)).filter(
      (video): video is YoutubeHighlight => Boolean(video) && video.id !== latestVideo?.id,
    );
  }, [latestVideo, videos]);
  const pinnedIds = useMemo(() => new Set(pinned.map((video) => video.id)), [pinned]);

  const rotatingVideos = useMemo(
    () =>
      ranked
        .filter((video) => !pinnedIds.has(video.id) && video.id !== latestVideo?.id)
        .slice(0, SIDE_ROTATION_LIMIT),
    [ranked, pinnedIds, latestVideo],
  );
  const pageCount =
    ROTATING_SLOT_COUNT > 0
      ? Math.max(1, Math.ceil(rotatingVideos.length / ROTATING_SLOT_COUNT))
      : 1;

  useEffect(() => {
    if (active || pageCount <= 1) return;
    const id = window.setInterval(() => {
      setPage((current) => (current + 1) % pageCount);
    }, SIDE_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [active, pageCount]);

  const rotatingPage = rotatingVideos.slice(
    page * ROTATING_SLOT_COUNT,
    page * ROTATING_SLOT_COUNT + ROTATING_SLOT_COUNT,
  );
  const sidePage = [...pinned, ...rotatingPage];

  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-xl font-black sm:text-2xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
        >
          Padre Kelmon
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Últimas notícias e novidades do Padre Kelmon
        </p>
      </div>

      <div className="youtube-grid-row min-w-0">
        <FeaturedVideoCarousel />
        <div className="youtube-cards">
          {latestVideo ? <VideoCard video={latestVideo} onOpen={setActive} /> : null}
          {Array.from({ length: SIDE_PAGE_SIZE - LATEST_SLOT_COUNT }, (_, index) => {
            const video = sidePage[index];
            if (!video) {
              return <div key={`empty-${index}`} className="rounded-xl bg-gray-50" />;
            }
            return (
              <VideoCard
                key={pinnedIds.has(video.id) ? video.id : `${video.id}-${page}`}
                video={video}
                onOpen={setActive}
              />
            );
          })}
        </div>
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl gap-3 border-0 bg-white p-3 sm:p-4">
          <DialogHeader className="pr-8 text-left">
            <DialogTitle className="line-clamp-2 text-base sm:text-lg">
              {active?.title ?? "Vídeo"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Reprodução do vídeo do YouTube
            </DialogDescription>
          </DialogHeader>
          {active ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                key={active.id}
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${active.id}?autoplay=1&rel=0`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
