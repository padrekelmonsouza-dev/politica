export const SITE_EVENTS = [
  {
    slug: "7-de-setembro-na-paulista",
    name: "Ato do 7 de Setembro na Avenida Paulista",
    date: "07/09/2026",
    dateIso: "2026-09-07",
    time: "15h",
    startDate: "2026-09-07T15:00:00-03:00",
    location: "Avenida Paulista, São Paulo, SP",
    status: "past" as const,
    image: "/news/7-de-setembro-paulista.jpg",
    imageAlt: "Convocação de Padre Kelmon para o ato na Avenida Paulista no 7 de Setembro",
    href: "/eventos/7-de-setembro-na-paulista",
    description:
      "Padre Kelmon convocou apoiadores para o ato do Dia da Independência na Avenida Paulista, a partir das 15h, em 7 de setembro de 2026.",
    details: [
      "O chamado foi publicado nas redes oficiais com a frase “Chegou a hora! Vem para a Paulista às 15h. Vem com Fé!”.",
      "A mobilização ocorreu na reta final da campanha eleitoral de 2026 e teve a Avenida Paulista como palco.",
      "A agenda pública de Flávio Bolsonaro também confirmou concentração no mesmo horário.",
    ],
    newsHref: "/imprensa/7-de-setembro",
  },
] as const;

export function getEventBySlug(slug: string) {
  return SITE_EVENTS.find((event) => event.slug === slug);
}
