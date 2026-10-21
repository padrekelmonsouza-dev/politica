import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/landing/about";
import { InnerPage } from "@/components/landing/inner-page";
import { PAGE_SEO, buildPageHead, buildPersonJsonLd } from "@/lib/site";

export const Route = createFileRoute("/sobre")({
  component: SobrePage,
  head: () => {
    const head = buildPageHead(PAGE_SEO.sobre);
    return {
      ...head,
      scripts: [
        ...(head.scripts ?? []),
        {
          type: "application/ld+json",
          children: JSON.stringify(buildPersonJsonLd()),
        },
      ],
    };
  },
});

function SobrePage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.sobre.breadcrumbs}>
      <About headingAs="h1" standalone />
    </InnerPage>
  );
}
