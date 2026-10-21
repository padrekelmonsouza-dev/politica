import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, ArrowUpRight } from "lucide-react";

import { CANDIDATE, FORO_BRASIL } from "@/lib/campaign-data";
import { useGoToCadastro } from "@/hooks/use-go-to-cadastro";
import { FOOTER_NAV_LINKS } from "@/lib/nav";
import { scrollToPageTop } from "@/lib/scroll-to-section";
import { PageShell } from "./primitives";

const USEFUL_LINKS = [
  { href: FORO_BRASIL.url, label: "Foro do Brasil", external: true },
  { href: FORO_BRASIL.aboutUrl, label: "Sobre o Foro", external: true },
  { href: CANDIDATE.instagram, label: "Instagram", external: true },
  { href: CANDIDATE.youtube, label: "YouTube", external: true },
  { href: "#cadastro", label: "Quero apoiar", external: false },
  { href: "/noticias", label: "Notícias", external: false },
  { href: "/downloads", label: "Downloads", external: false },
  { href: "/politica-de-privacidade", label: "Privacidade", external: false },
  { href: "/termos-de-uso", label: "Termos de uso", external: false },
  { href: "/mapa-do-site", label: "Mapa do site", external: false },
] as const;

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

const SOCIALS = [
  { label: "Instagram", href: CANDIDATE.instagram, Icon: Instagram },
  { label: "TikTok", href: CANDIDATE.tiktok, Icon: TikTokIcon },
  { label: "Facebook", href: CANDIDATE.facebook, Icon: Facebook },
  { label: "YouTube", href: CANDIDATE.youtube, Icon: Youtube },
  { label: "X", href: CANDIDATE.x, Icon: XIcon },
];

const titleClass =
  "mb-1.5 text-[11px] font-bold uppercase leading-none tracking-[0.2em]";

export function SiteFooter() {
  const goToCadastro = useGoToCadastro();

  return (
    <footer
      id="rodape"
      data-cnpj-on-dark
      className="relative overflow-hidden pb-[env(safe-area-inset-bottom,0px)] text-white"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <PageShell className="relative py-6 sm:py-7 lg:py-8">
        <div className="grid min-w-0 items-start gap-8 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.85fr)_minmax(0,0.85fr)_minmax(0,1.3fr)] lg:gap-x-8 xl:gap-x-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              onClick={() => scrollToPageTop()}
              className="inline-flex items-center"
            >
              <img
                src="/Logo-Site-Padre-kelmon-campanha.png"
                alt="Padre Kelmon 2202, Deputado Federal"
                width={200}
                height={45}
                loading="lazy"
                decoding="async"
                className="h-9 w-auto rounded-md sm:h-10"
              />
            </Link>
            <p className="mt-3 text-[10px] font-semibold leading-snug tracking-wide text-white/75 sm:text-xs">
              {CANDIDATE.legalLine}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-md border border-white/25 bg-white/10 text-white transition-all hover:bg-white/20 sm:size-8"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Links rápidos">
            <p className={titleClass} style={{ color: "var(--yellow-primary)" }}>
              Navegação
            </p>
            <ul className="space-y-1.5">
              {FOOTER_NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    hash={l.hash}
                    onClick={l.hash === "cadastro" ? goToCadastro : () => scrollToPageTop()}
                    className="inline-flex min-h-9 items-center text-sm font-semibold text-white/85 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Links úteis">
            <p className={titleClass} style={{ color: "var(--yellow-primary)" }}>
              Links úteis
            </p>
            <ul className="space-y-1.5">
              {USEFUL_LINKS.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center text-sm font-semibold text-white/85 transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  ) : l.href === "#cadastro" ? (
                    <Link
                      to="/"
                      hash="cadastro"
                      onClick={goToCadastro}
                      className="inline-flex min-h-9 items-center text-sm font-semibold text-white/85 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <Link
                      to={l.href}
                      className="inline-flex min-h-9 items-center text-sm font-semibold text-white/85 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div id="privacidade" className="sm:col-span-2 lg:col-span-1">
            <p className={titleClass} style={{ color: "var(--yellow-primary)" }}>
              Privacidade e LGPD
            </p>
            <p className="text-sm leading-relaxed text-white/85">
              Dados usados apenas para comunicação da campanha, conforme a LGPD (Lei nº
              13.709/2018). Solicite acesso ou exclusão pelo canal oficial.
            </p>
            <Link
              to="/"
              hash="cadastro"
              onClick={goToCadastro}
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-transform hover:scale-105 sm:h-auto sm:w-auto"
              style={{
                backgroundColor: "var(--yellow-primary)",
                color: "var(--blue-primary)",
              }}
            >
              Quero apoiar
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </PageShell>

      <div className="border-t border-white/15">
        <PageShell className="flex flex-col items-center justify-between gap-1 py-3 text-center text-[11px] text-white/65 sm:py-2.5 lg:flex-row lg:text-left">
          <p>
            © {new Date().getFullYear()} Campanha {CANDIDATE.name}. Todos os direitos reservados.
          </p>
          <p>Conteúdo informativo de campanha, a partir de fontes públicas.</p>
        </PageShell>
      </div>
    </footer>
  );
}
