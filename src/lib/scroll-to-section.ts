export function getHeaderOffset() {
  const header = document.querySelector("header");
  return Math.ceil(header?.getBoundingClientRect().height ?? 80);
}

export function getBottomNavOffset() {
  const nav = document.querySelector("[data-mobile-bottom-nav]");
  if (!nav) return 0;
  const style = window.getComputedStyle(nav);
  if (style.display === "none") return 0;
  return Math.ceil(nav.getBoundingClientRect().height);
}

export function scrollToPageTop(behavior: ScrollBehavior = "smooth") {
  window.scrollTo({ top: 0, left: 0, behavior });
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  // Buffer extra no tablet para o menu do topo não cortar a seção
  const isTablet =
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px) and (max-width: 1023px)").matches;
  const buffer = isTablet ? 16 : 4;
  const offset = Math.max(0, getHeaderOffset() + buffer);
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}
