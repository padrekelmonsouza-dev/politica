import { createFileRoute } from "@tanstack/react-router";

import { Bandeiras } from "@/components/landing/bandeiras";
import { InnerPage } from "@/components/landing/inner-page";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/pautas")({
  component: PautasPage,
  head: () => buildPageHead(PAGE_SEO.pautas),
});

function PautasPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.pautas.breadcrumbs}>
      <Bandeiras headingAs="h1" />
    </InnerPage>
  );
}
