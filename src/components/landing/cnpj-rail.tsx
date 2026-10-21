import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { CANDIDATE } from "@/lib/campaign-data";

export function CnpjRail() {
  const railRef = useRef<HTMLElement>(null);
  const [overDark, setOverDark] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const update = () => {
      const rail = railRef.current;
      if (!rail) {
        setOverDark(false);
        return;
      }

      const a = rail.getBoundingClientRect();
      const bands = document.querySelectorAll("[data-cnpj-on-dark]");
      const overlaps = Array.from(bands).some((el) => {
        const b = el.getBoundingClientRect();
        return a.bottom > b.top && a.top < b.bottom;
      });
      setOverDark(overlaps);
    };

    update();
    const frame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  if (pathname === "/links" || pathname === "/bio") return null;

  return (
    <aside
      ref={railRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 select-none pr-[max(0.15rem,env(safe-area-inset-right))] lg:block"
    >
      <p
        className={`whitespace-nowrap text-[6.2px] font-semibold tracking-[0.1em] transition-colors duration-200 sm:text-[7.8px] sm:tracking-[0.12em] ${
          overDark ? "text-white" : "text-[var(--blue-primary)]"
        }`}
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {CANDIDATE.razaoSocial} · CNPJ {CANDIDATE.cnpj}
      </p>
    </aside>
  );
}
