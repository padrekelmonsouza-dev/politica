import { ChevronRight, Facebook, Globe, Instagram, Youtube } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { type ComponentType } from "react";

import { HeroBannerCarousel } from "@/components/landing/hero-banner-carousel";
import { HeroServiceCards } from "@/components/landing/hero-service-cards";
import { CANDIDATE } from "@/lib/campaign-data";

function XIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2H21.5l-7.19 8.21L22.5 22h-6.66l-5.22-6.82L4.66 22H1.4l7.69-8.78L1.5 2h6.83l4.72 6.24L18.244 2Zm-1.17 18h1.83L7.02 3.9H5.06L17.074 20Z" />
    </svg>
  );
}

function TikTokIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.8a4.84 4.84 0 0 1-1-.11Z" />
    </svg>
  );
}

function LegalLine() {
  return (
    <p className="text-center text-[10px] font-medium leading-snug text-[#9aafc4]">
      {CANDIDATE.legalLine}
    </p>
  );
}

type BioLink = {
  label: string;
  handle: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
  featured?: boolean;
  internal?: boolean;
};

const LINKS: BioLink[] = [
  {
    label: "Site oficial",
    handle: "padrekelmon.com.br",
    href: "/",
    Icon: Globe,
    featured: true,
    internal: true,
  },
  {
    label: "Instagram",
    handle: "@pekelmon",
    href: CANDIDATE.instagram,
    Icon: Instagram,
  },
  {
    label: "TikTok",
    handle: "@pekelmon",
    href: CANDIDATE.tiktok,
    Icon: TikTokIcon,
  },
  {
    label: "YouTube",
    handle: "@PadreKelmonBr",
    href: CANDIDATE.youtube,
    Icon: Youtube,
  },
  {
    label: "Facebook",
    handle: "PadreKelmon",
    href: CANDIDATE.facebook,
    Icon: Facebook,
  },
  {
    label: "X",
    handle: "@PeKelmon",
    href: CANDIDATE.x,
    Icon: XIcon,
  },
];

function BioButton({ link }: { link: BioLink }) {
  const className = link.featured
    ? "flex min-h-12 w-full items-center gap-3 rounded-2xl px-3.5 text-white active:opacity-90"
    : "flex min-h-12 w-full items-center gap-3 rounded-2xl bg-white px-3.5 ring-1 ring-[#d7e4f4] active:bg-[#f4f8fc]";

  const style = link.featured
    ? { backgroundColor: "var(--blue-primary)" }
    : undefined;

  const inner = (
    <>
      <span
        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full ${
          link.featured ? "bg-white/15 text-white" : "text-white"
        }`}
        style={link.featured ? undefined : { backgroundColor: "var(--blue-primary)" }}
      >
        <link.Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span
          className={`block truncate text-[15px] font-semibold leading-none ${
            link.featured ? "text-white" : "text-[#163a6b]"
          }`}
        >
          {link.label}
        </span>
        <span
          className={`mt-1 block truncate text-[11px] leading-none ${
            link.featured ? "text-white/75" : "text-[#7a90ab]"
          }`}
        >
          {link.handle}
        </span>
      </span>
      <ChevronRight
        className={`size-4 shrink-0 ${link.featured ? "text-white/70" : "text-[#b7c7da]"}`}
        aria-hidden="true"
      />
    </>
  );

  if (link.internal) {
    return (
      <Link to="/" className={className} style={style}>
        {inner}
      </Link>
    );
  }

  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
      {inner}
    </a>
  );
}

export function LinkInBio() {
  return (
    <div className="min-h-dvh bg-[#eaf1f8]">
      <div
        className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white [touch-action:manipulation]"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="h-1 w-full" style={{ background: "var(--yellow-primary)" }} />

        <header className="w-full p-[20px] pb-3">
          <h1 className="sr-only">Padre Kelmon, candidato a Deputado Federal por São Paulo, 2202</h1>
          <HeroBannerCarousel className="rounded-2xl" sizes="430px" />
        </header>

        <nav aria-label="Redes oficiais" className="flex flex-col gap-2.5 px-5">
          {LINKS.map((link) => (
            <BioButton key={link.label} link={link} />
          ))}
        </nav>

        <div className="px-5 pt-1">
          <HeroServiceCards compact className="grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-2" />
        </div>

        <div className="mt-auto w-full px-5 pb-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.75rem))] pt-8">
          <LegalLine />
        </div>
      </div>
    </div>
  );
}
