/** Build estático (`npm run build:static`): sem servidor Node, dados vêm de /data/*.json. */
export const IS_STATIC_SITE = import.meta.env.VITE_STATIC_SITE === "1";

export async function fetchStaticData<T>(name: string): Promise<T> {
  const res = await fetch(`/data/${name}.json`, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Snapshot ${name} indisponível (${res.status})`);
  return (await res.json()) as T;
}

/** Usa o snapshot estático quando não há servidor; senão chama a server function. */
export function serverData<T>(name: string, load: () => Promise<T>): Promise<T> {
  return IS_STATIC_SITE ? fetchStaticData<T>(name) : load();
}
