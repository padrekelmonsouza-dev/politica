export type NewsFilterInput = {
  title?: string;
  href?: string;
  url?: string;
  description?: string;
  excerpt?: string;
};

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function haystack(item: NewsFilterInput): string {
  return fold(
    [item.title, item.href, item.url, item.description, item.excerpt]
      .filter(Boolean)
      .join(" "),
  );
}

/** Matérias avulsas que não devem aparecer, como a do Pollon no card do PL. */
const BLOCKED_TERMS = ["pollon"] as const;

/**
 * Nomes que costumam sair no site do PL como deputado estadual / candidato
 * estadual por São Paulo. O filtro só vale se a matéria não citar Kelmon.
 */
const SP_STATE_DEPUTY_NAMES = [
  "alex madureira",
  "bruno zambelli",
  "conte lopes",
  "dani alonso",
  "danilo balas",
  "delegada graciela",
  "delegado olim",
  "filipe sabara",
  "franco sardelli",
  "gil diniz",
  "leticia aguiar",
  "lucas bove",
  "major bonfim",
  "marcelo bolsonaro",
  "marcos damasio",
  "paulo kogos",
  "rafa zimbaldi",
  "ricardo madalena",
  "rodrigo moraes",
  "sonaira fernandes",
  "tenente coimbra",
  "thiago auricchio",
  "valeria bolsonaro",
] as const;

const ESTADUAL_ROLE = /\bdeputad(?:o|a|os|as)\s+estadual/;
const SP_CONTEXT = /\b(?:sao paulo|alesp|assembleia legislativa)\b/;

export function isBlockedStateDeputyNews(item: NewsFilterInput): boolean {
  const text = haystack(item);
  if (!text) return false;
  if (text.includes("kelmon")) return false;

  if (BLOCKED_TERMS.some((term) => text.includes(term))) return true;
  if (text.includes("alesp")) return true;
  if (ESTADUAL_ROLE.test(text) && SP_CONTEXT.test(text)) return true;
  if (SP_STATE_DEPUTY_NAMES.some((name) => text.includes(name))) return true;
  return false;
}

export function rejectStateDeputyNews<T extends NewsFilterInput>(items: readonly T[]): T[] {
  return items.filter((item) => !isBlockedStateDeputyNews(item));
}
