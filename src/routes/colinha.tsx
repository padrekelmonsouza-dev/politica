import { createFileRoute } from "@tanstack/react-router";

import { ColaApp } from "@/components/cola/cola-app";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/colinha")({
  component: ColinhaPage,
  head: () => {
    const base = buildPageHead(PAGE_SEO.colinha);
    return {
      ...base,
      links: [
        ...base.links,
        { rel: "manifest", href: "/cola-manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/cola-icon-192.png" },
      ],
      meta: [
        ...base.meta,
        { name: "theme-color", content: "#1264E5" },
        { name: "apple-mobile-web-app-title", content: "Minha Cola 2026" },
        { name: "application-name", content: "Minha Cola 2026" },
      ],
    };
  },
});

function ColinhaPage() {
  return <ColaApp />;
}
