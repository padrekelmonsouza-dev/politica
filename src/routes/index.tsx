import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { Highlights } from "@/components/landing/highlights";
import { ForoDoBrasil } from "@/components/landing/foro-do-brasil";
import { ForoNews } from "@/components/landing/foro-news";
import { ChapaNews } from "@/components/landing/chapa-news";
import { SocialStrip } from "@/components/landing/social-strip";
import { PartidoLiberal } from "@/components/landing/partido-liberal";
import { CallToAction } from "@/components/landing/call-to-action";
import { SignupForm } from "@/components/landing/signup-form";
import { SocialLinks } from "@/components/landing/social-links";
import { SiteFooter } from "@/components/landing/site-footer";
import { scrollToSection } from "@/lib/scroll-to-section";
import heroKvUrl from "@/assets/banner-kelmon-1-fe-para-servir.jpg?url";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/")({
  // Feeds sociais carregam na seção Mídia — não bloqueiam a abertura da página.
  component: Index,
  head: () => {
    const head = buildPageHead(PAGE_SEO.home);
    return {
      ...head,
      links: [
        ...head.links,
        {
          rel: "preload",
          as: "image",
          href: heroKvUrl,
          type: "image/jpeg",
        },
      ],
    };
  },
});

function Index() {
  return (
    <div className="min-h-dvh bg-white md:min-h-screen">
      <a
        href="#conteudo"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById("conteudo");
          if (el) {
            el.focus({ preventScroll: true });
            scrollToSection("inicio");
          }
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:px-4 focus:py-2"
        style={{ backgroundColor: "var(--blue-primary)", color: "white" }}
      >
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo" tabIndex={-1} className="overflow-x-clip outline-none">
        <Hero />
        <Highlights />
        <ForoDoBrasil />
        <SocialStrip />
        <CallToAction />
        <ForoNews />
        <PartidoLiberal />
        <SignupForm />
        <ChapaNews />
        <SocialLinks />
      </main>
      <SiteFooter />
    </div>
  );
}
