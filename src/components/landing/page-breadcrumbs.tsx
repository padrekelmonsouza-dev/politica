import { Link } from "@tanstack/react-router";

import type { BreadcrumbItem } from "@/lib/site";
import { PageShell } from "./primitives";

export function PageBreadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav aria-label="Trilha de navegação" className="border-b border-border/60 bg-white">
      <PageShell className="py-3">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-gray-500 sm:text-sm">
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-gray-300">
                    /
                  </span>
                ) : null}
                {last ? (
                  <span aria-current="page" style={{ color: "var(--blue-primary)" }}>
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="transition-colors hover:text-[var(--blue-primary)]"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </PageShell>
    </nav>
  );
}
