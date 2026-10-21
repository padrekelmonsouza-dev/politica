import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import layoutCss from "../layout.css?url";
import { Toaster } from "../components/ui/sonner";
import { PwaRegister } from "../components/pwa-register";
import { CookieBanner } from "../components/cookie-banner";
import { CnpjRail } from "../components/landing/cnpj-rail";
import { MobileBottomNav } from "../components/landing/mobile-bottom-nav";
import { SiteFooter } from "../components/landing/site-footer";
import { SiteHeader } from "../components/landing/site-header";
import { scrollToSection } from "../lib/scroll-to-section";
import {
  GENERAL_META,
  absoluteUrl,
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  buildWebSiteJsonLd,
} from "../lib/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <title>Página não encontrada | Padre Kelmon</title>
      <meta name="robots" content="noindex, follow" />
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16 pt-[5.5rem] sm:pt-24">
        <div className="max-w-lg text-center">
          <p
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--yellow-primary)" }}
          >
            Erro 404
          </p>
          <h1
            className="mt-3 text-3xl font-black sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
          >
            Página não encontrada
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            Este endereço não existe no site oficial de Padre Kelmon. Volte ao início
            ou escolha uma das páginas abaixo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-bold text-white"
              style={{ backgroundColor: "var(--blue-primary)" }}
            >
              Ir para o início
            </Link>
            <Link
              to="/sobre"
              className="inline-flex items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-bold"
              style={{ borderColor: "var(--blue-primary)", color: "var(--blue-primary)" }}
            >
              Biografia
            </Link>
            <Link
              to="/noticias"
              className="inline-flex items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-bold"
              style={{ borderColor: "var(--blue-primary)", color: "var(--blue-primary)" }}
            >
              Notícias
            </Link>
            <Link
              to="/contato"
              className="inline-flex items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-bold"
              style={{ borderColor: "var(--blue-primary)", color: "var(--blue-primary)" }}
            >
              Contato
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocorreu um erro inesperado. Tente atualizar a página ou voltar ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              reset();
              window.location.assign("/");
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5",
      },
      {
        name: "google-site-verification",
        content: "bcJCCb6X2PSfiJUJmaqbMVwrGSQxG0WHzVsjDVgdmxI",
      },
      {
        name: "facebook-domain-verification",
        content: "82m9eas0exktmg3bfd42o6gdjxhpvv",
      },
      { name: "theme-color", content: "#1e5bb8" },
      { name: "msapplication-TileColor", content: "#1e5bb8" },
      { name: "color-scheme", content: "light" },
      { name: "format-detection", content: "telephone=no" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Padre Kelmon" },
      { name: "application-name", content: "Padre Kelmon" },
      ...GENERAL_META,
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: layoutCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "sitemap", type: "application/xml", href: absoluteUrl("/sitemap.xml") },
      { rel: "icon", href: "/favicon-campanha.png?v=9", type: "image/png", sizes: "any" },
      { rel: "icon", href: "/favicon-32x32.png?v=9", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16x16.png?v=9", type: "image/png", sizes: "16x16" },
      { rel: "shortcut icon", href: "/favicon.ico?v=9" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png?v=9" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildPersonJsonLd()),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(buildOrganizationJsonLd()),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(buildWebSiteJsonLd()),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <style>{`
          @media (max-width:1023px){.hero-story-card{width:100%!important;max-width:100%}.youtube-civic-row>.civic-stack{display:none!important}}
          .civic-mobile-rail{display:block;margin-top:.75rem}
          .site-nav-desktop{display:none;align-items:center;justify-content:flex-end}
          .site-nav-toggle{display:inline-flex}
          .youtube-civic-row{display:grid;grid-template-columns:1fr;gap:1rem;align-items:start}
          .civic-stack{display:flex;flex-direction:column;gap:.75rem}
          .presenca-foro-grid{display:grid;grid-template-columns:1fr;gap:2rem;align-items:start}
          .brazil-presence-map-frame svg{width:100%;height:auto}
          .brazil-presence-map-caption{margin-top:.5rem}
          .highlights-main{display:flex;flex-direction:column;min-width:0}
          .highlights-main>:first-child{flex-shrink:0}
          .imprensa-block{display:flex;flex-direction:column;margin-top:1.5rem}
          .imprensa-row{display:flex;flex-direction:column;gap:1rem;min-height:0}
          .imprensa-book{position:relative;width:100%;max-width:28rem;aspect-ratio:3/4;touch-action:pan-y;user-select:none}
          .imprensa-book-slide{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;opacity:0;pointer-events:none;transition:opacity 1.8s ease}
          .imprensa-book-slide.is-active{opacity:1}
          .imprensa-book-dots{position:absolute;left:50%;bottom:.55rem;z-index:3;display:flex;transform:translateX(-50%);gap:.28rem}
          .imprensa-book-dot{width:.42rem;height:.42rem;padding:0;border:0;border-radius:999px;background:rgba(255,255,255,.55);box-shadow:0 0 0 1px rgba(15,23,42,.18);cursor:pointer}
          .imprensa-book-dot.is-active{width:.95rem;background:#fff}
          .imprensa-news-grid{display:grid;grid-template-columns:1fr;gap:.75rem;min-width:0}
          .imprensa-news-card{display:flex;height:100%;min-height:0;flex-direction:column;overflow:hidden;border-radius:.75rem;border:2px solid #e5e7eb;background:#fff;text-align:left;box-shadow:0 1px 2px rgba(15,23,42,.06)}
          .imprensa-news-copy{display:flex;flex:1;min-height:0;flex-direction:column;gap:.3rem;overflow:hidden;padding:.7rem .8rem .55rem}
          .imprensa-news-meta{flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#6b7280}
          .imprensa-news-title{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;flex-shrink:0;font-size:13px;font-weight:700;line-height:1.3;overflow-wrap:anywhere}
          .imprensa-news-desc{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:6;overflow:hidden;flex:1;min-height:0;font-size:12px;line-height:1.4;color:#4b5563;overflow-wrap:break-word}
          .civic-rail-spacer{display:none}
          .youtube-grid-row{display:grid;grid-template-columns:1fr;gap:1rem;align-items:start}
          .youtube-featured{position:relative;width:100%;max-width:none;margin-inline:0;aspect-ratio:1080/1920;height:auto;overflow:hidden;border-radius:.75rem;background:#171717}
          .youtube-featured video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
          .youtube-cards{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:.75rem;min-height:0}
          .youtube-card-preview{aspect-ratio:1920/1080}
          @media (min-width:768px){
            .imprensa-news-grid{grid-template-columns:1fr 1fr}
            .youtube-grid-row{grid-template-columns:minmax(14rem,20rem) minmax(0,1fr);align-items:stretch;gap:1.25rem}
            .youtube-featured{margin-inline:0;max-width:none}
            .youtube-cards{height:100%}
          }
          @media (min-width:1024px){
            .civic-mobile-rail{display:none!important}
            .site-nav-desktop{display:flex}
            .site-nav-toggle,[data-mobile-bottom-nav]{display:none!important}
            .cookie-banner{bottom:1rem}
            .youtube-civic-row{grid-template-columns:minmax(0,1fr) minmax(16rem,20rem);gap:1.25rem;align-items:start}
            .presenca-foro-grid{grid-template-columns:minmax(0,45fr) minmax(0,55fr);gap:2.5rem;align-items:stretch}
            .presenca-foro-map{display:flex;flex-direction:column;height:0;min-height:100%}
            .presenca-foro-map .brazil-presence-map{display:flex;flex:1;height:0;min-height:0;flex-direction:column}
            .presenca-foro-map .brazil-presence-map-frame{flex:1;min-height:0;position:relative}
            .presenca-foro-map .brazil-presence-map-frame svg{position:absolute;inset:0;width:100%;height:100%}
            .presenca-foro-map .brazil-presence-map-caption{position:absolute;right:0;bottom:0;left:0;z-index:1;margin-top:0;padding-top:1.5rem;background:linear-gradient(to top,#fff 55%,rgba(255,255,255,0))}
            .highlights-main{height:0;min-height:100%}
            .imprensa-block,.imprensa-row{height:100%}
            .imprensa-block{flex:1;min-height:0;margin-top:2rem}
            .imprensa-row{flex:1;flex-direction:row;align-items:stretch;gap:1.25rem}
            .imprensa-book{width:min(20rem,34%);max-width:20rem;margin-inline:0;flex:0 0 auto;height:100%;min-height:0;aspect-ratio:auto}
            .imprensa-news-grid{flex:1;grid-template-columns:1fr 1fr;gap:.75rem}
            .civic-rail-spacer{display:block}
          }
        `}</style>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const locationHref = useRouterState({ select: (s) => s.location.href });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isColaApp = pathname.startsWith("/colinha");

  // Hash (#cadastro) rola até o formulário; sem hash, cada aba abre no topo.
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
      const timer = window.setTimeout(() => {
        scrollToSection(hash);
      }, 80);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [locationHref]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      {!isColaApp && <CnpjRail />}
      {!isColaApp && <MobileBottomNav />}
      <CookieBanner />
      <PwaRegister />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

