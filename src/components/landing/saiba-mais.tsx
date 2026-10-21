import { motion } from "motion/react";

import saibaMaisProVida from "@/assets/saiba-mais-kelmon-pro-vida.png";
import { Button } from "@/components/ui/button";
import { DefesaDoBrasil } from "./defesa-do-brasil";
import { PageShell } from "./primitives";

const VV8_PRO_VIDA_2010 = {
  url: "https://portalvv8.com.br/noticia/67928/em-entrevista-a-vv8-padre-kelmon-relembra-mobilizacao-pro-vida-que-marcou-as-eleicoes-de-2010",
  image: saibaMaisProVida,
  date: "19 de agosto de 2026",
  source: "Portal VV8",
} as const;

export function SaibaMais() {
  return (
    <section
      id="saiba-mais"
      className="bg-white"
      style={{ background: "linear-gradient(to bottom, #ffffff, #f9fafb)" }}
    >
      <PageShell className="section-pad pb-8 sm:pb-10">
        <div className="mb-10 grid gap-6 sm:mb-14 md:mb-16 md:grid-cols-2 md:gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 min-w-0 max-w-full md:order-1"
          >
            <a
              href={VV8_PRO_VIDA_2010.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block w-full max-w-full overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <img
                src={VV8_PRO_VIDA_2010.image}
                alt="Padre Kelmon diante do documento da CNBB Regional Sul 1 e da mobilização pró-vida"
                width={1200}
                height={900}
                className="block h-auto w-full max-w-full object-contain object-center"
              />
            </a>
          </motion.div>

          <div className="order-1 flex min-w-0 flex-col justify-between md:order-2 md:h-0 md:min-h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="min-h-0"
            >
              <p
                className="mb-1.5 text-sm font-bold uppercase tracking-widest"
                style={{ color: "var(--yellow-primary)" }}
              >
                Saiba mais
              </p>
              <h1
                className="text-[1.6rem] font-black leading-tight sm:text-3xl"
                style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
              >
                Quem é Padre Kelmon
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-gray-700 text-justify sm:text-base">
                Em entrevista à VV8, Padre Kelmon relembrou a mobilização pró-vida de 2010: ainda
                antes da ordenação, coordenou a distribuição nacional do documento{" "}
                <strong>“Apelo a Todos os Brasileiros e Brasileiras”</strong>, da CNBB Regional Sul
                1, às 44 dioceses de São Paulo e depois ao país.
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-gray-700 text-justify sm:text-base">
                Parte dos panfletos foi apreendida e só voltou depois do segundo turno. Para ele, a
                defesa da vida desde a concepção continua sendo missão.
              </p>
              <Button asChild variant="yellow" className="mt-3 h-10 px-5 text-sm font-bold">
                <a href={VV8_PRO_VIDA_2010.url} target="_blank" rel="noopener noreferrer">
                  Ler a entrevista na VV8
                </a>
              </Button>
            </motion.div>

            <motion.blockquote
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative mt-3 shrink-0 overflow-hidden rounded-xl px-4 py-3 shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--blue-primary), #0052a3)" }}
            >
              <p
                className="relative text-center text-sm font-black leading-snug text-white sm:text-base"
                style={{ fontFamily: "var(--font-display)" }}
              >
                “O trabalho começou em São Paulo, mas depois fomos levando esse material para todo
                o país.”
              </p>
              <footer className="relative mt-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-yellow-300">
                Padre Kelmon, entrevista à VV8
              </footer>
            </motion.blockquote>
          </div>
        </div>

        <DefesaDoBrasil />
      </PageShell>
    </section>
  );
}
