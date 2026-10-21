import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { useJunglePlayer } from "@/hooks/use-jungle-player";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TOP_NAV_LINKS, type NavLink } from "@/lib/nav";
import { scrollToPageTop } from "@/lib/scroll-to-section";
import { PageShell } from "./primitives";

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { playing, toggle } = useJunglePlayer();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-all duration-300 ${
        scrolled ? "border-b border-blue-200 bg-white shadow-md" : "bg-white/95 backdrop-blur-md"
      }`}
    >
      <nav aria-label="Navegação principal" className="w-full min-w-0">
        <PageShell className="flex min-w-0 items-center gap-2 py-2 sm:gap-3 sm:py-2.5 lg:gap-4">
          <Link to="/" onClick={() => scrollToPageTop()} className="flex min-w-0 shrink-0 items-center">
            <img
              src="/Logo-Site-Padre-kelmon-campanha.png"
              alt="Padre Kelmon 2202, Deputado Federal"
              width={220}
              height={50}
              decoding="async"
              className="h-9 w-auto max-w-[min(42vw,11rem)] rounded-md object-contain object-left sm:h-10 lg:h-11 lg:max-w-[13rem] xl:h-12 xl:max-w-none"
            />
          </Link>

          <div className="ml-auto flex min-w-0 items-center justify-end gap-2 sm:gap-3">
            <ul className="site-nav-desktop min-w-0 gap-1 xl:gap-2">
              {TOP_NAV_LINKS.map((l) => {
                const Icon = l.icon;
                const isActive = isNavActive(l, pathname);
                return (
                  <li key={l.sectionId} className="flex shrink-0">
                    <Link
                      to={l.to}
                      onClick={() => scrollToPageTop()}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 transition-colors xl:px-2.5 xl:py-2 ${
                        isActive
                          ? "bg-blue-50 text-[var(--blue-primary)]"
                          : "text-gray-600 hover:bg-blue-50 hover:text-[var(--blue-primary)]"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="size-4 shrink-0 stroke-[2.25]" aria-hidden="true" />
                      <span className="whitespace-nowrap text-xs font-bold leading-none tracking-wide xl:text-[13px]">
                        {l.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={toggle}
              aria-pressed={playing}
              aria-label={playing ? "Parar jungle" : "Escute nossa jungle"}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-2 text-xs font-bold transition-colors hover:bg-blue-50 sm:px-2.5"
              style={{ color: "var(--blue-primary)" }}
            >
              <span
                className="inline-flex size-7 items-center justify-center rounded-full shadow-sm"
                style={{
                  backgroundColor: "var(--yellow-primary)",
                  color: "var(--blue-primary)",
                }}
              >
                {playing ? (
                  <Pause className="size-3.5" aria-hidden="true" />
                ) : (
                  <Play className="size-3.5" aria-hidden="true" />
                )}
              </span>
              <span className="hidden whitespace-nowrap sm:inline">
                {playing ? "Parar" : "Jungle"}
              </span>
            </button>

            <Button
              asChild
              variant="campaign"
              size="sm"
              className="relative z-10 inline-flex h-9 shrink-0 px-2.5 text-xs font-bold sm:px-3 md:px-4 md:text-sm"
            >
              <Link
                to="/links"
                onClick={() => scrollToPageTop()}
                aria-current={pathname === "/links" ? "page" : undefined}
              >
                Links da Bio
              </Link>
            </Button>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="site-nav-toggle size-10 shrink-0 border-blue-100"
                  aria-label="Abrir menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-[min(20rem,100%)] flex-col gap-4 bg-white p-5">
                <SheetHeader className="text-left">
                  <SheetTitle className="text-[var(--blue-primary)]">Menu</SheetTitle>
                  <SheetDescription>Navegue pelas páginas do site oficial.</SheetDescription>
                </SheetHeader>
                <ul className="flex flex-col gap-1">
                  {TOP_NAV_LINKS.map((l) => {
                    const Icon = l.icon;
                    const isActive = isNavActive(l, pathname);
                    return (
                      <li key={l.sectionId}>
                        <SheetClose asChild>
                          <Link
                            to={l.to}
                            onClick={() => scrollToPageTop()}
                            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold ${
                              isActive
                                ? "bg-blue-50 text-[var(--blue-primary)]"
                                : "text-gray-700 hover:bg-blue-50 hover:text-[var(--blue-primary)]"
                            }`}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <Icon className="size-4 shrink-0" aria-hidden="true" />
                            {l.label}
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>
                <button
                  type="button"
                  onClick={toggle}
                  aria-pressed={playing}
                  aria-label={playing ? "Parar jungle" : "Escute nossa jungle"}
                  className="mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-blue-100 text-sm font-bold"
                  style={{ color: "var(--blue-primary)" }}
                >
                  <span
                    className="inline-flex size-8 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "var(--yellow-primary)",
                      color: "var(--blue-primary)",
                    }}
                  >
                    {playing ? (
                      <Pause className="size-4" aria-hidden="true" />
                    ) : (
                      <Play className="size-4" aria-hidden="true" />
                    )}
                  </span>
                  {playing ? "Parar jungle" : "Escute nossa jungle"}
                </button>
                <SheetClose asChild>
                  <Button asChild variant="campaign" className="h-11 w-full font-bold">
                    <Link to="/links" onClick={() => scrollToPageTop()}>
                      Links da Bio
                    </Link>
                  </Button>
                </SheetClose>
              </SheetContent>
            </Sheet>
          </div>
        </PageShell>
      </nav>
    </header>
  );
}

function isNavActive(link: NavLink, pathname: string) {
  if (link.hash === "cadastro") return false;
  return pathname === link.to;
}
