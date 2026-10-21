import type { Candidate, CandidateSource } from "@/data/cola-candidates";

export type AssistantReply = {
  answer: string;
  sources: CandidateSource[];
};

const NO_RECOMMEND =
  "Este assistente não recomenda voto, não ranqueia e não compara quem é melhor. Você escolhe. Posso apenas repetir informações já cadastradas nas fontes.";

export function answerCandidateQuestion(candidate: Candidate, question: string): AssistantReply {
  const q = question.trim().toLowerCase();
  const sources = candidate.sources;

  if (!q) {
    return {
      answer: "Escreva uma pergunta sobre as informações já cadastradas deste candidato.",
      sources,
    };
  }

  if (/(vot[ae]|melhor|recomend|ranking|indique|devo votar)/i.test(q)) {
    return { answer: NO_RECOMMEND, sources };
  }

  if (/(tema|proposta|pauta)/i.test(q)) {
    if (!candidate.proposals.length) {
      return {
        answer:
          "Não há temas cadastrados a partir de fonte oficial para este candidato. Confirme no TSE e no site oficial, quando houver.",
        sources,
      };
    }
    return {
      answer: `Temas apresentados nas fontes cadastradas: ${candidate.proposals.join("; ")}.`,
      sources,
    };
  }

  if (/(trajet|histór|biograf|quem é|quem e)/i.test(q)) {
    const text = [candidate.biography, candidate.trajectory].filter(Boolean).join(" ");
    return {
      answer: text || "Não há trajetória cadastrada a partir de fonte oficial.",
      sources,
    };
  }

  if (/(fonte|oficial|tse|site)/i.test(q)) {
    const list = sources.map((item) => `${item.name} (${item.url})`).join("; ");
    return {
      answer: list
        ? `Fontes cadastradas: ${list}.`
        : "Não há fontes cadastradas para este candidato.",
      sources,
    };
  }

  if (/(partido|n[uú]mero|cargo|estado|situa)/i.test(q)) {
    return {
      answer: `${candidate.ballotName}. Nome civil: ${candidate.name}. Cargo: ver ficha. Número ${candidate.number}. Partido ${candidate.party}. UF ${candidate.state}. Situação: ${candidate.status}`,
      sources,
    };
  }

  const fallback = [candidate.biography, candidate.electoralInfo].filter(Boolean).join(" ");
  return {
    answer:
      fallback ||
      "Não há informação cadastrada para essa pergunta nas fontes disponíveis. Consulte o TSE.",
    sources,
  };
}
