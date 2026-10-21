import { useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { CallToAction } from "@/components/landing/call-to-action";
import { ChapaNews } from "@/components/landing/chapa-news";
import { ForoNews } from "@/components/landing/foro-news";
import { Hero } from "@/components/landing/hero";
import { PageBreadcrumbs } from "@/components/landing/page-breadcrumbs";
import { SignupForm } from "@/components/landing/signup-form";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { SocialLinks } from "@/components/landing/social-links";
import { SocialStrip } from "@/components/landing/social-strip";
import type { BreadcrumbItem } from "@/lib/site";
import { scrollToPageTop } from "@/lib/scroll-to-section";

export function InnerPage({
  children,
  breadcrumbs,
}: {
  children: ReactNode;
  breadcrumbs?: readonly BreadcrumbItem[];
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    scrollToPageTop("auto");
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-white md:min-h-screen">
      <a
        href="#conteudo"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById("conteudo");
          if (el) {
            el.focus({ preventScroll: true });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:px-4 focus:py-2"
        style={{ backgroundColor: "var(--blue-primary)", color: "white" }}
      >
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <main
        id="conteudo"
        tabIndex={-1}
        className="overflow-x-clip pt-[4.25rem] outline-none sm:pt-[4.75rem]"
      >
        {breadcrumbs?.length ? <PageBreadcrumbs items={breadcrumbs} /> : null}
        <Hero embedded />
        {children}
        <SocialStrip />
        <CallToAction />
        <ForoNews />
        <SignupForm />
        <ChapaNews />
        <SocialLinks />
      </main>
      <SiteFooter />
    </div>
  );
}
