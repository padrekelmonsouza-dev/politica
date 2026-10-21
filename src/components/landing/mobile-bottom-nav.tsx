import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { NAV_LINKS, type NavLink } from "@/lib/nav";
import { scrollToPageTop } from "@/lib/scroll-to-section";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bottomNavRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const activeKey = navActiveKey(pathname);
  const isBio = pathname === "/links" || pathname === "/bio";

  useEffect(() => {
    const el = itemRefs.current[activeKey];
    const nav = bottomNavRef.current;
    if (!el || !nav) return;
    const target = el.offsetLeft - nav.clientWidth / 2 + el.offsetWidth / 2;
    nav.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [activeKey]);

  return (
    <nav
      aria-label="Menu de seções"
      data-mobile-bottom-nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/90 backdrop-blur-md",
        isBio ? "mx-auto max-w-[430px]" : "lg:hidden",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div
        ref={bottomNavRef}
        className="mx-auto flex w-full max-w-lg items-stretch justify-center gap-0.5 px-1.5 py-1"
      >
        {NAV_LINKS.map((l) => {
          const Icon = l.icon;
          const isActive = isNavActive(l, pathname);

          return (
            <Link
              key={l.sectionId}
              ref={(node) => {
                itemRefs.current[l.sectionId] = node;
              }}
              to={l.to}
              hash={l.hash}
              onClick={() => scrollToPageTop()}
              className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1 outline-none transition-colors ${
                isActive
                  ? "bg-blue-50 text-[var(--blue-primary)]"
                  : "text-gray-500"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-4 stroke-[2.25]" aria-hidden="true" />
              <span className="text-[9px] font-bold leading-none tracking-tight">{l.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function isNavActive(link: NavLink, pathname: string) {
  return pathname === link.to;
}

function navActiveKey(pathname: string) {
  const current = NAV_LINKS.find((l) => !l.hash && l.to === pathname);
  return current?.sectionId ?? "inicio";
}
