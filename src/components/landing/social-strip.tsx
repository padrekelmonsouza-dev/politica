import { Facebook, Instagram, Youtube } from "lucide-react";

import { CANDIDATE } from "@/lib/campaign-data";
import { PageShell } from "./primitives";

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2H21.5l-7.19 8.21L22.5 22h-6.66l-5.22-6.82L4.66 22H1.4l7.69-8.78L1.5 2h6.83l4.72 6.24L18.244 2Zm-1.17 18h1.83L7.02 3.9H5.06L17.074 20Z" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.8a4.84 4.84 0 0 1-1-.11Z" />
    </svg>
  );
}

const NETWORKS = [
  {
    label: "Instagram",
    href: CANDIDATE.instagram,
    Icon: Instagram,
    handle: "@pekelmon",
    hover: "#E4405F",
  },
  {
    label: "TikTok",
    href: CANDIDATE.tiktok,
    Icon: TikTokIcon,
    handle: "@pekelmon",
    hover: "#111111",
  },
  {
    label: "Facebook",
    href: CANDIDATE.facebook,
    Icon: Facebook,
    handle: "PadreKelmon",
    hover: "#1877F2",
  },
  {
    label: "YouTube",
    href: CANDIDATE.youtube,
    Icon: Youtube,
    handle: "@PadreKelmonBr",
    hover: "#FF0000",
  },
  {
    label: "X",
    href: CANDIDATE.x,
    Icon: XIcon,
    handle: "@PeKelmon",
    hover: "#0f0f0f",
  },
] as const;

const TICKER_ITEMS = NETWORKS.map((n) => `${n.label}  ${n.handle}`);

export function SocialStrip() {
  return (
    <section
      aria-labelledby="redes-faixa-heading"
      data-cnpj-on-dark
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div
        aria-hidden="true"
        className="h-1 w-full"
        style={{ background: "var(--yellow-primary)" }}
      />

      <div
        aria-hidden="true"
        className="social-strip-ticker border-b border-white/10 py-1.5"
      >
        <div className="social-strip-ticker-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex shrink-0 items-center gap-8 px-8 text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">
              {TICKER_ITEMS.map((item) => (
                <span key={`${copy}-${item}`} className="flex items-center gap-8">
                  {item}
                  <span className="inline-block size-1 rounded-full bg-[var(--yellow-primary)]" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <PageShell className="relative py-5 sm:py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-8">
          <div className="text-center sm:text-left">
            <span
              className="block text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: "var(--yellow-primary)" }}
            >
              Redes oficiais
            </span>
            <h2
              id="redes-faixa-heading"
              className="mt-1 text-lg font-black leading-tight text-white sm:text-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Siga o Padre Kelmon
            </h2>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {NETWORKS.map(({ label, href, Icon, handle, hover }, i) => (
              <li
                key={label}
                className="social-strip-icon"
                style={{ animationDelay: `${i * 0.18}s` }}
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} de Padre Kelmon, ${handle}`}
                  title={`${label} · ${handle}`}
                  className="group relative inline-flex size-12 items-center justify-center rounded-full bg-white text-[var(--blue-primary)] shadow-md transition-transform duration-300 hover:-translate-y-1 hover:text-white hover:shadow-xl focus-visible:outline-offset-4"
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: hover }}
                    aria-hidden="true"
                  />
                  <Icon className="relative z-10 size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </PageShell>
    </section>
  );
}
