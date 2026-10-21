import { createFileRoute } from "@tanstack/react-router";

import { InnerPage } from "@/components/landing/inner-page";
import { SaibaMais } from "@/components/landing/saiba-mais";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/saiba-mais")({
  component: SaibaMaisPage,
  head: () => buildPageHead(PAGE_SEO.saibaMais),
});

function SaibaMaisPage() {
  return (
    <InnerPage breadcrumbs={PAGE_SEO.saibaMais.breadcrumbs}>
      <SaibaMais />
    </InnerPage>
  );
}
