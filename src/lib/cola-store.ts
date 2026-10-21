import { EMPTY_SELECTION, type PositionKey } from "@/data/cola-candidates";

export const COLA_STORAGE_KEY = "minha-cola-2026";

export type ColaSelection = Record<PositionKey, string | null>;

export function loadColaSelection(): ColaSelection {
  if (typeof window === "undefined") return { ...EMPTY_SELECTION };
  try {
    const raw = window.localStorage.getItem(COLA_STORAGE_KEY);
    if (!raw) return { ...EMPTY_SELECTION };
    const parsed = JSON.parse(raw) as Partial<ColaSelection>;
    return { ...EMPTY_SELECTION, ...parsed };
  } catch {
    return { ...EMPTY_SELECTION };
  }
}

export function saveColaSelection(selection: ColaSelection) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COLA_STORAGE_KEY, JSON.stringify(selection));
}

export function clearColaSelection() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(COLA_STORAGE_KEY);
}

export function countColaProgress(selection: ColaSelection) {
  return Object.values(selection).filter(Boolean).length;
}
