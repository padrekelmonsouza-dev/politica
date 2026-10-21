import { createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { Stats } from "@/components/landing/stats";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/numeros")({
  component: NumerosPage,
  head: () => buildPageHead(PAGE_SEO.numeros),
});

function NumerosPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.numeros.breadcrumbs}>
      <Stats headingAs="h1" />
    </InnerPage>
  );
}
