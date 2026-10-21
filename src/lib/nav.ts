import { BookOpen, BookText, Film, Flag, Home, StickyNote, TrendingUp, type LucideIcon } from "lucide-react";

export type NavLink = {
  to: "/" | "/sobre" | "/saiba-mais" | "/pautas" | "/midia" | "/numeros" | "/colinha" | "/links" | "/contato";
  hash?: "cadastro";
  sectionId: "inicio" | "historia" | "saiba-mais" | "bandeiras" | "midia" | "numeros" | "colinha";
  label: string;
  icon: LucideIcon;
  accent?: boolean;
};

export const NAV_LINKS: readonly NavLink[] = [
  { to: "/", sectionId: "inicio", label: "Início", icon: Home },
  { to: "/sobre", sectionId: "historia", label: "Sobre", icon: BookText },
  { to: "/saiba-mais", sectionId: "saiba-mais", label: "Saiba mais", icon: BookOpen },
  { to: "/pautas", sectionId: "bandeiras", label: "Pautas", icon: Flag },
  { to: "/midia", sectionId: "midia", label: "Mídia", icon: Film },
  { to: "/numeros", sectionId: "numeros", label: "Números", icon: TrendingUp },
  { to: "/colinha", sectionId: "colinha", label: "Colinha", icon: StickyNote },
] as const;

export const TOP_NAV_LINKS = NAV_LINKS;

export const FOOTER_NAV_LINKS = [
  { to: "/" as const, label: "Início" },
  { to: "/sobre" as const, label: "Sobre" },
  { to: "/saiba-mais" as const, label: "Saiba mais" },
  { to: "/pautas" as const, label: "Pautas" },
  { to: "/midia" as const, label: "Mídia" },
  { to: "/numeros" as const, label: "Indicadores" },
  { to: "/colinha" as const, label: "Colinha" },
  { to: "/links" as const, label: "Links Padre" },
  { to: "/contato" as const, label: "Contato" },
  { to: "/" as const, hash: "cadastro" as const, label: "Faça parte" },
];
