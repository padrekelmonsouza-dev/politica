import { Facebook, Instagram, Youtube } from "lucide-react";

import { CANDIDATE } from "@/lib/campaign-data";
import { PageShell, Reveal } from "./primitives";

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
  { label: "Instagram", href: CANDIDATE.instagram, Icon: Instagram, handle: "@pekelmon" },
  { label: "TikTok", href: CANDIDATE.tiktok, Icon: TikTokIcon, handle: "@pekelmon" },
  { label: "Facebook", href: CANDIDATE.facebook, Icon: Facebook, handle: "facebook.com/PadreKelmon" },
  { label: "YouTube", href: CANDIDATE.youtube, Icon: Youtube, handle: "@PadreKelmonBr" },
  { label: "X", href: CANDIDATE.x, Icon: XIcon, handle: "@PeKelmon" },
];

export function SocialLinks() {
  return (
    <section
      id="redes"
      className="section-pad relative overflow-hidden border-t border-border/50"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f4f7fc 50%, #ffffff 100%)",
      }}
    >
      <PageShell>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="mb-3 text-sm font-bold uppercase tracking-widest"
              style={{ color: "var(--yellow-primary)" }}
            >
              Redes sociais
            </p>
            <h2
              className="display-heading font-black leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--blue-primary)",
                fontSize: "clamp(1.5rem, 4vw, 2.75rem)",
              }}
            >
              Siga Padre Kelmon
            </h2>
            <div className="gold-rule mx-auto mt-4 sm:mt-5" />
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-700 sm:mt-5 sm:text-base">
              Redes oficiais da campanha. Posicionamentos e encontros pelo Brasil.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {NETWORKS.map(({ label, href, Icon, handle }, i) => (
            <Reveal key={label} delay={0.05 * i}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full min-h-14 items-center gap-3 rounded-xl border-2 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:bg-blue-50"
                style={{ borderColor: "rgba(0, 102, 204, 0.12)" }}
              >
                <span
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: "var(--blue-primary)" }}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-gray-900">{label}</span>
                  <span className="block truncate text-xs text-gray-500">{handle}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </PageShell>
    </section>
  );
}
