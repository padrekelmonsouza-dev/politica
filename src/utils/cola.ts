import { POSITIONS, type Candidate, type PositionKey } from "@/data/cola-candidates";
import type { ColaSelection } from "@/lib/cola-store";

export function formatColaDate(iso: string) {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

export function candidateInitials(candidate: Candidate) {
  return candidate.ballotName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export function nextEmptyPosition(selection: ColaSelection, from?: PositionKey) {
  const start = from ? POSITIONS.findIndex((item) => item.key === from) + 1 : 0;
  return (
    POSITIONS.slice(Math.max(start, 0)).find((item) => !selection[item.key]) ??
    POSITIONS.find((item) => !selection[item.key]) ??
    null
  );
}

export function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}
