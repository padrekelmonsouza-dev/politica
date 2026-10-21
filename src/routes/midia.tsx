import { createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { Media } from "@/components/landing/media";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/midia")({
  component: MidiaPage,
  head: () => buildPageHead(PAGE_SEO.midia),
});

function MidiaPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.midia.breadcrumbs}>
      <Media headingAs="h1" />
    </InnerPage>
  );
}
