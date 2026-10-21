import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Newspaper, Play } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { PRESS_ARTICLES, PRESS_SOURCE_URL, type PressArticle } from "@/data/press-articles";
import { SETE_SETEMBRO_ARTICLE } from "@/data/sete-setembro-article";
import { VV8_ARTICLES, VV8_SOURCE_URL } from "@/data/vv8-articles";
import { rejectStateDeputyNews } from "@/lib/news-filters";
import { getPressFeeds } from "@/lib/press-feeds";
import { getVv8Feeds } from "@/lib/vv8-feeds";
import { getSocialFeeds, type SocialNetworkId, type SocialPost } from "@/lib/social-feeds";
import { SeteSetembroArticleModal } from "@/components/landing/sete-setembro-article-modal";

const MEDIA_REFRESH_MS = 30 * 1000;
const VV8_ACCENT = "#0168e1";

import { PageShell, Reveal } from "./primitives";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const ICONS: Record<SocialNetworkId, () => ReactNode> = {
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
  x: XIcon,
  facebook: FacebookIcon,
};

function InstagramCard({ post, color }: { post: SocialPost; color: string }) {
  const isReel = post.kind === "reel";
  const isStory = post.kind === "story";
  const badge = isReel ? "Reel" : isStory ? "Story" : null;

  // Stories: capa + link (stories públicos não embutem bem no iframe)
  if (isStory) {
    return (
      <CoverImageCard
        post={post}
        color={color}
        label="Instagram"
        aspectClass="aspect-[4/5]"
      />
    );
  }

  // Reels: embed do Instagram para o vídeo tocar no site
  if (isReel) {
    return (
      <div
        className="group relative overflow-hidden rounded-xl border-2 bg-neutral-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
        style={{ borderColor: color + "40" }}
      >
        {badge ? (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {badge}
          </span>
        ) : null}
        <div className="aspect-[4/5] w-full overflow-hidden bg-black">
          <iframe
            src={`${post.embedUrl}${post.embedUrl.includes("?") ? "&" : "?"}utm_source=ig_embed`}
            title={post.title ?? "Instagram Reel"}
            className="h-full w-full border-0"
            loading="eager"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 border-t bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:text-[#E4405F]"
        >
          <span className="truncate">Abrir no Instagram</span>
          <ExternalLink className="size-3.5 shrink-0" />
        </a>
      </div>
    );
  }

  return <CoverImageCard post={post} color={color} label="Instagram" aspectClass="aspect-[4/5]" />;
}

function CoverImageCard({
  post,
  color,
  label,
  aspectClass = "aspect-square",
}: {
  post: SocialPost;
  color: string;
  label: string;
  aspectClass?: string;
}) {
  const imageSrc = post.thumbnail;
  const isFacebook = label === "Facebook";
  const isVideo = post.kind === "reel" || post.kind === "story" || label === "TikTok";
  const badge =
    post.kind === "reel" ? "Reel" : post.kind === "story" ? "Story" : null;

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block ${aspectClass} overflow-hidden rounded-xl border-2 bg-neutral-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}
      style={{ borderColor: color + "40" }}
      aria-label={`Abrir publicação no ${label}`}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={`Publicação recente de ${label}, Padre Kelmon`}
          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const img = e.currentTarget;
            if (isFacebook && !img.dataset.fallbackTried) {
              img.dataset.fallbackTried = "1";
              img.src = "/facebook/default.jpg";
              return;
            }
            img.style.display = "none";
            const fallback = img.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.hidden = false;
          }}
        />
      ) : null}
      <span
        hidden={Boolean(imageSrc)}
        className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center"
        style={{ background: `linear-gradient(160deg, ${color}22, ${color}55)` }}
      >
        <span
          className="inline-flex size-12 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          <ExternalLink className="size-5" />
        </span>
        <span className="text-sm font-bold" style={{ color }}>
          Ver no {label}
        </span>
      </span>

      {badge ? (
        <span className="absolute left-2.5 top-2.5 z-20 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
          {badge}
        </span>
      ) : null}

      {isVideo ? (
        <span className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-black/55 text-white shadow-lg transition group-hover:scale-110">
            <Play className="size-5 fill-current" aria-hidden="true" />
          </span>
        </span>
      ) : (
        <span className="absolute inset-0 z-10 bg-black/0 transition-colors group-hover:bg-black/15" />
      )}

      <span className="absolute bottom-3 right-3 z-20 inline-flex size-8 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
        <ExternalLink className="size-4" />
      </span>
    </a>
  );
}

function PostCard({
  post,
  networkId,
  color,
  profileUrl,
}: {
  post: SocialPost | null;
  networkId: SocialNetworkId;
  color: string;
  profileUrl: string;
}) {
  if (!post) {
    return (
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border-2 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:min-h-[280px]"
        style={{ borderColor: color + "40" }}
      >
        <span className="text-sm font-semibold" style={{ color }}>
          Ver perfil
        </span>
        <span className="text-xs text-gray-500">Abrir publicações mais recentes</span>
      </a>
    );
  }

  if (networkId === "instagram") {
    return <InstagramCard post={post} color={color} />;
  }

  if (networkId === "tiktok") {
    return (
      <CoverImageCard post={post} color={color} label="TikTok" aspectClass="aspect-[4/5]" />
    );
  }

  if (networkId === "x") {
    return <CoverImageCard post={post} color={color} label="X" aspectClass="aspect-[4/5]" />;
  }

  // Facebook embeds (iframe) often fail on mobile — use image cards like IG/X
  if (networkId === "facebook") {
    return (
      <CoverImageCard post={post} color={color} label="Facebook" aspectClass="aspect-[4/5]" />
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: color + "40" }}
    >
      {post.kind === "reel" ? (
        <span className="absolute left-2 top-2 z-10 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Short
        </span>
      ) : null}
      <div className="aspect-video">
        <iframe
          src={post.embedUrl}
          title={post.title ?? `Publicação ${networkId}`}
          className="h-full w-full border-0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-2 border-t px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:text-blue-700"
      >
        <span className="truncate">{post.title ?? "Abrir publicação"}</span>
        <ExternalLink className="size-3.5 shrink-0" />
      </a>
    </div>
  );
}

function PostSkeleton({ color }: { color: string }) {
  return (
    <div
      className="min-h-[220px] animate-pulse rounded-xl border-2 bg-white sm:min-h-[280px]"
      style={{ borderColor: color + "30" }}
    >
      <div className="aspect-video bg-gray-100" />
      <div className="h-9 bg-gray-50" />
    </div>
  );
}

function PressCard({ article }: { article: PressArticle }) {
  const [articleOpen, setArticleOpen] = useState(false);
  const isExternal = article.url.startsWith("http");
  const opensModal = article.id === SETE_SETEMBRO_ARTICLE.id;
  const cardClassName =
    "group flex h-full flex-col overflow-hidden rounded-xl border-2 border-gray-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg";

  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={article.image}
          alt={`${article.title} · ${article.source}`}
          width={640}
          height={400}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={article.objectPosition ? { objectPosition: article.objectPosition } : undefined}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <span className="absolute left-2 top-2 rounded-md bg-blue-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          {article.source}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p
          className="mb-1 text-[11px] font-bold uppercase tracking-wider"
          style={{ color: "var(--yellow-primary)" }}
        >
          {article.eyebrow}
        </p>
        <h4
          className="line-clamp-3 text-sm font-bold leading-snug sm:text-[0.95rem]"
          style={{ color: "var(--blue-primary)" }}
        >
          {article.title}
        </h4>
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-blue-700">
          Ler matéria
          {isExternal ? <ExternalLink className="size-3.5" /> : null}
        </span>
      </div>
    </>
  );

  if (opensModal) {
    return (
      <div className="h-full">
        <button type="button" onClick={() => setArticleOpen(true)} className={`${cardClassName} h-full w-full`}>
          {body}
        </button>
        <SeteSetembroArticleModal open={articleOpen} onOpenChange={setArticleOpen} />
      </div>
    );
  }

  return (
    <a
      href={article.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cardClassName}
    >
      {body}
    </a>
  );
}

function useCarouselAutoplay(api: CarouselApi | undefined, intervalMs = 12000, startDelayMs = 0) {
  useEffect(() => {
    if (!api) return;
    let tickId = 0;
    const startId = window.setTimeout(() => {
      tickId = window.setInterval(() => {
        api.scrollNext();
      }, intervalMs);
    }, startDelayMs);
    return () => {
      window.clearTimeout(startId);
      window.clearInterval(tickId);
    };
  }, [api, intervalMs, startDelayMs]);
}

function PressNewsCarousel({
  articles = [],
  sourceUrl = PRESS_SOURCE_URL,
  showPlaceholders = false,
  heading = "Padre Kelmon na imprensa",
  subheading = "Matérias no portal 7Minutos",
  accentColor = "var(--blue-primary)",
  skeletonKey = "press",
}: {
  articles?: PressArticle[];
  sourceUrl?: string;
  showPlaceholders?: boolean;
  heading?: string;
  subheading?: string;
  accentColor?: string;
  skeletonKey?: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  useCarouselAutoplay(api, 12000);

  const list = articles ?? [];
  const slots =
    showPlaceholders || list.length === 0
      ? Array.from({ length: 4 }, () => null)
      : list;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: accentColor }}
          >
            <Newspaper className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold" style={{ color: "var(--blue-primary)" }}>
              {heading}
            </h3>
            <p className="truncate text-sm text-gray-600">{subheading}</p>
          </div>
        </div>

        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 sm:h-auto sm:w-auto"
          style={{ backgroundColor: accentColor }}
        >
          <span>Ver todas</span>
          <ExternalLink className="size-4" />
        </a>
      </div>

      <Carousel
        opts={{ align: "start", loop: true, dragFree: false }}
        setApi={setApi}
        className="relative w-full px-0 sm:px-10"
      >
        <CarouselContent className="-ml-3">
          {slots.map((article, index) => (
            <CarouselItem
              key={article?.id ?? `${skeletonKey}-sk-${index}`}
              className="basis-[82%] pl-3 sm:basis-1/2 lg:basis-1/4"
            >
              {showPlaceholders || !article ? (
                <div className="overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-sm">
                  <div className="aspect-[16/10] animate-pulse bg-gray-100" />
                  <div className="space-y-2 p-3 sm:p-4">
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-[80%] animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              ) : (
                <PressCard article={article} />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex left-0 border-blue-200 bg-white text-blue-700 hover:bg-blue-50" />
        <CarouselNext className="hidden sm:inline-flex right-0 border-blue-200 bg-white text-blue-700 hover:bg-blue-50" />
      </Carousel>
    </div>
  );
}

function SocialNetworkCarousel({
  social,
  showPlaceholders,
  autoplayDelayMs = 0,
}: {
  social: {
    id: string;
    name: string;
    handle: string;
    profileUrl: string;
    color: string;
    posts: SocialPost[];
  };
  showPlaceholders: boolean;
  autoplayDelayMs?: number;
}) {
  const [api, setApi] = useState<CarouselApi>();
  useCarouselAutoplay(api, 12000, autoplayDelayMs);

  const IconComponent = ICONS[social.id as SocialNetworkId] ?? InstagramIcon;
  const posts = social.posts;
  const slots =
    showPlaceholders || posts.length === 0
      ? Array.from({ length: 4 }, () => null)
      : posts;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl p-2 text-white"
            style={{ backgroundColor: social.color }}
          >
            <IconComponent />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold" style={{ color: "var(--blue-primary)" }}>
              {social.name}
            </h3>
            <a
              href={social.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-sm text-gray-600 transition-colors hover:text-blue-600"
            >
              {social.handle}
            </a>
            <p className="mt-0.5 text-xs text-gray-500">
              {social.id === "instagram"
                ? "Posts, Reels e Stories mais recentes"
                : social.id === "youtube"
                  ? "Vídeos e Shorts mais recentes"
                  : social.id === "tiktok"
                    ? "Vídeos mais recentes"
                    : social.id === "x"
                      ? "Posts mais recentes"
                      : "Posts mais recentes"}
            </p>
          </div>
        </div>

        <a
          href={social.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 sm:h-auto sm:w-auto"
          style={{ backgroundColor: social.color }}
        >
          <span>Ver todos</span>
          <ExternalLink className="size-4" />
        </a>
      </div>

      <Carousel
        opts={{ align: "start", loop: true, dragFree: false }}
        setApi={setApi}
        className="relative w-full px-0 sm:px-10"
      >
        <CarouselContent className="-ml-3">
          {slots.map((post, index) => (
            <CarouselItem
              key={`${social.name}-${post?.id ?? `sk-${index}`}`}
              className="basis-[82%] pl-3 sm:basis-1/2 lg:basis-1/4"
            >
              {showPlaceholders || !post ? (
                <PostSkeleton color={social.color} />
              ) : (
                <PostCard
                  post={post}
                  networkId={social.id as SocialNetworkId}
                  color={social.color}
                  profileUrl={social.profileUrl}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex left-0 border-blue-200 bg-white text-blue-700 hover:bg-blue-50" />
        <CarouselNext className="hidden sm:inline-flex right-0 border-blue-200 bg-white text-blue-700 hover:bg-blue-50" />
      </Carousel>
    </div>
  );
}

export function Media({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  const Heading = headingAs;
  // Importante: SSR e 1º render no cliente devem ser iguais (evita React #418).
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const socialQuery = useQuery({
    queryKey: ["social-feeds", "v19-youtube-seed"],
    queryFn: () => getSocialFeeds(),
    staleTime: MEDIA_REFRESH_MS,
    refetchInterval: MEDIA_REFRESH_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: ready,
  });

  const pressQuery = useQuery({
    queryKey: ["press-feeds", "v4-no-estadual-sp"],
    queryFn: () => getPressFeeds(),
    staleTime: MEDIA_REFRESH_MS,
    refetchInterval: MEDIA_REFRESH_MS,
    refetchOnWindowFocus: true,
    enabled: ready,
  });

  const vv8Query = useQuery({
    queryKey: ["vv8-feeds", "v3-no-estadual-sp"],
    queryFn: () => getVv8Feeds(),
    staleTime: MEDIA_REFRESH_MS,
    refetchInterval: MEDIA_REFRESH_MS,
    refetchOnWindowFocus: true,
    enabled: ready,
  });

  const networks = socialQuery.data?.networks ?? [];
  const showSocialPlaceholders = ready && socialQuery.isLoading;
  const showPressPlaceholders = ready && pressQuery.isLoading;
  const showVv8Placeholders = ready && vv8Query.isLoading;
  const pressArticles = rejectStateDeputyNews(
    pressQuery.data?.articles?.length ? pressQuery.data.articles : PRESS_ARTICLES,
  );
  const pressSourceUrl = pressQuery.data?.sourceUrl ?? PRESS_SOURCE_URL;
  const vv8Articles = rejectStateDeputyNews(
    vv8Query.data?.articles?.length ? vv8Query.data.articles : VV8_ARTICLES,
  );
  const vv8SourceUrl = vv8Query.data?.sourceUrl ?? VV8_SOURCE_URL;
  const featuredVideoId = socialQuery.data?.featuredVideoId || "EI-bTS70q0U";
  const isRefreshing =
    socialQuery.isFetching || pressQuery.isFetching || vv8Query.isFetching;
  const hasUpdatedAt = Boolean(
    socialQuery.data?.updatedAt || pressQuery.data?.updatedAt || vv8Query.data?.updatedAt,
  );

  return (
    <section
      id="midia"
      className="section-pad border-t border-border/50 bg-white"
    >
      <PageShell>
          <div className="mb-8 grid items-stretch gap-6 sm:mb-12 sm:gap-8 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <p
                className="mb-3 text-sm font-bold uppercase tracking-widest"
                style={{ color: "var(--yellow-primary)" }}
              >
                Mídia
              </p>
              <Heading
                className="display-heading mb-4 font-black"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--blue-primary)",
                  fontSize: "clamp(1.5rem, 4vw, 2.75rem)",
                }}
              >
                Padre Kelmon nas Redes Sociais
              </Heading>
              <p className="text-sm leading-relaxed text-gray-700 text-justify sm:text-base">
                Acompanhe Instagram, Facebook, X, YouTube e TikTok com os posts e reels públicos
                mais recentes. Os feeds usam conteúdo público e se atualizam sozinhos. Veja também as{" "}
                <Link
                  to="/noticias"
                  className="font-semibold underline underline-offset-4"
                  style={{ color: "var(--blue-primary)" }}
                >
                  notícias da campanha
                </Link>
                .
              </p>
              {hasUpdatedAt ? (
                <p className="mt-3 text-xs text-gray-500">
                  Atualizado automaticamente
                  {isRefreshing ? " · buscando novidades…" : ""}
                </p>
              ) : null}
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${featuredVideoId}`}
                title="Padre Kelmon - Vídeo em destaque"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12">
            <Reveal>
              <PressNewsCarousel
                articles={vv8Articles}
                sourceUrl={vv8SourceUrl}
                showPlaceholders={showVv8Placeholders}
                heading="Padre Kelmon no Portal VV8"
                subheading="Notícias em tempo real · portalvv8.com.br"
                accentColor={VV8_ACCENT}
                skeletonKey="vv8"
              />
            </Reveal>

            <Reveal>
              <PressNewsCarousel
                articles={pressArticles}
                sourceUrl={pressSourceUrl}
                showPlaceholders={showPressPlaceholders}
                heading="Padre Kelmon na imprensa"
                subheading="Matérias no portal 7Minutos"
                skeletonKey="7minutos"
              />
            </Reveal>

            {(showSocialPlaceholders ? placeholderNetworks() : networks).map((social, index) => (
              <Reveal key={social.name}>
                <SocialNetworkCarousel
                  social={{
                    id: social.id,
                    name: social.name,
                    handle: social.handle,
                    profileUrl: social.profileUrl,
                    color: social.color,
                    posts: "posts" in social ? social.posts : [],
                  }}
                  showPlaceholders={showSocialPlaceholders}
                  autoplayDelayMs={index * 1500}
                />
              </Reveal>
            ))}
          </div>
      </PageShell>
    </section>
  );
}

function placeholderNetworks() {
  return (
    [
      ["instagram", "Instagram", "@pekelmon", "https://www.instagram.com/pekelmon/", "#E4405F"],
      ["youtube", "YouTube", "@PadreKelmonBr", "https://www.youtube.com/@PadreKelmonBr", "#FF0000"],
      ["tiktok", "TikTok", "@pekelmon", "https://www.tiktok.com/@pekelmon", "#000000"],
      ["x", "X", "@PeKelmon", "https://x.com/PeKelmon", "#000000"],
      ["facebook", "Facebook", "facebook.com/PadreKelmon", "https://www.facebook.com/PadreKelmon", "#1877F2"],
    ] as const
  ).map(([id, name, handle, profileUrl, color]) => ({
    id,
    name,
    handle,
    profileUrl,
    color,
    posts: [] as SocialPost[],
  }));
}
