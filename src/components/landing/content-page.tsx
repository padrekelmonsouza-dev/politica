import type { ReactNode } from "react";

import { PageBreadcrumbs } from "@/components/landing/page-breadcrumbs";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import type { BreadcrumbItem } from "@/lib/site";

export function ContentPage({
  children,
  breadcrumbs,
}: {
  children: ReactNode;
  breadcrumbs?: readonly BreadcrumbItem[];
}) {
  return (
    <div className="min-h-dvh bg-white md:min-h-screen">
      <a
        href="#conteudo"
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
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
