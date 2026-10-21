import { Link } from "@tanstack/react-router";

import { PageShell } from "./primitives";

const CLUSTER = [
  { to: "/sobre", label: "Biografia" },
  { to: "/noticias", label: "Notícias" },
  { to: "/pautas", label: "Pautas" },
  { to: "/midia", label: "Mídia" },
  { to: "/numeros", label: "Números" },
  { to: "/agenda", label: "Agenda" },
  { to: "/eventos", label: "Eventos" },
  { to: "/entrevistas", label: "Entrevistas" },
  { to: "/discursos", label: "Discursos" },
  { to: "/conteudos", label: "Conteúdos" },
  { to: "/downloads", label: "Downloads" },
  { to: "/links", label: "Redes sociais" },
  { to: "/contato", label: "Contato" },
] as const;

export function ClusterLinks({ current }: { current?: string }) {
  return (
    <aside className="border-t border-border/60 bg-[#f4f7fc] py-8">
      <PageShell>
        <p
          className="mb-3 text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--blue-primary)" }}
        >
          Explore o site oficial
        </p>
        <ul className="flex flex-wrap gap-2">
          {CLUSTER.filter((item) => item.to !== current).map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="inline-flex rounded-full border-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-blue-600 hover:text-white"
                style={{
                  borderColor: "var(--blue-primary)",
                  color: "var(--blue-primary)",
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </PageShell>
    </aside>
  );
}
