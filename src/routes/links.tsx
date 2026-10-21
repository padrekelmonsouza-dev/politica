import { createFileRoute } from "@tanstack/react-router";

import { LinkInBio } from "@/components/bio/link-in-bio";
import { PAGE_SEO, buildPageHead } from "@/lib/site";

export const Route = createFileRoute("/links")({
  component: LinksPage,
  head: () => buildPageHead(PAGE_SEO.links),
});

function LinksPage() {
  return <LinkInBio />;
}
