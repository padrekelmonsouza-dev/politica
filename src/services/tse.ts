import {
  COLA_CANDIDATES,
  POSITIONS,
  type Candidate,
  type PositionKey,
} from "@/data/cola-candidates";

function officeOrder(position: PositionKey) {
  return POSITIONS.find((item) => item.key === position)?.order ?? 99;
}

/** Camada pronta para trocar dados de demonstração por fonte oficial do TSE. */
export async function getCandidates(): Promise<Candidate[]> {
  return [...COLA_CANDIDATES].sort((a, b) => {
    const byOffice = officeOrder(a.position) - officeOrder(b.position);
    if (byOffice !== 0) return byOffice;
    const byNumber = a.number.localeCompare(b.number, "pt-BR", { numeric: true });
    if (byNumber !== 0) return byNumber;
    return a.ballotName.localeCompare(b.ballotName, "pt-BR");
  });
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  const list = await getCandidates();
  return list.find((item) => item.id === id) ?? null;
}

export async function searchCandidates(query: string): Promise<Candidate[]> {
  const term = query.trim().toLowerCase();
  const list = await getCandidates();
  if (!term) return list;
  return list.filter((item) => {
    return (
      item.name.toLowerCase().includes(term) ||
      item.ballotName.toLowerCase().includes(term) ||
      item.number.includes(term) ||
      item.party.toLowerCase().includes(term)
    );
  });
}

export async function getCandidatesByPosition(position: PositionKey): Promise<Candidate[]> {
  const list = await getCandidates();
  return list.filter((item) => item.position === position);
}

export async function getCandidatesByState(state: string): Promise<Candidate[]> {
  const uf = state.trim().toUpperCase();
  const list = await getCandidates();
  return list.filter((item) => item.state.toUpperCase() === uf);
}

export function getPosition(key: PositionKey) {
  return POSITIONS.find((item) => item.key === key) ?? POSITIONS[0];
}
