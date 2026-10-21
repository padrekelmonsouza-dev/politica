export const SITE_INTERVIEWS = [
  {
    slug: "fala-candidato-lima-tv",
    title: "Fala Candidato: Padre Kelmon fala da candidatura e dos desafios do Brasil",
    program: "Fala Candidato, Lima TV",
    date: "16/08/2026",
    dateIso: "2026-08-16",
    videoId: "k8n5EIaJVlk",
    url: "https://www.youtube.com/watch?v=k8n5EIaJVlk",
    description:
      "No podcast Fala Candidato, da Lima TV, Padre Kelmon fala da candidatura a deputado federal pelo PL e dos desafios do Brasil.",
  },
  {
    slug: "sem-limites-religiao-e-politica",
    title: "Religião e política no Sem Limites",
    program: "Sem Limites #185",
    date: "16/10/2025",
    dateIso: "2025-10-16",
    videoId: "DGrflujR5kw",
    url: "https://www.youtube.com/watch?v=DGrflujR5kw",
    description:
      "Padre Kelmon fala de sua formação em Filosofia, Teologia e Pedagogia e da relação entre fé e vida pública.",
  },
  {
    slug: "dr-chagas-cast",
    title: "Religião e política se misturam? Padre Kelmon no Dr. Chagas Cast",
    program: "Dr. Chagas Cast, EP.19",
    date: "08/08/2026",
    dateIso: "2026-08-08",
    videoId: "wHqwAaXmKqQ",
    url: "https://www.youtube.com/watch?v=wHqwAaXmKqQ",
    description:
      "No Dr. Chagas Cast, Padre Kelmon debate liderança, conservadorismo e o encontro entre Direito e fé.",
  },
  {
    slug: "papagaio-falante",
    title: "Padre Kelmon no Podcast Papagaio Falante",
    program: "Papagaio Falante",
    date: "15/07/2026",
    dateIso: "2026-07-15",
    videoId: "kkKqcg5jXAc",
    url: "https://www.youtube.com/watch?v=kkKqcg5jXAc",
    description:
      "Conversa sobre fé, política e o momento do Brasil, com a entrevista completa disponível no YouTube.",
  },
] as const;

export function getInterviewBySlug(slug: string) {
  return SITE_INTERVIEWS.find((item) => item.slug === slug);
}
