import { Newspaper } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

import livroSlide01 from "@/assets/livro-slide-01.jpg";
import livroSlide02 from "@/assets/livro-slide-02.jpg";
import livroSlide03 from "@/assets/livro-slide-03.jpg";
import livroSlide04 from "@/assets/livro-slide-04.jpg";
import livroSlide05 from "@/assets/livro-slide-05.jpg";
import livroSlide06 from "@/assets/livro-slide-06.jpg";
import livroSlide07 from "@/assets/livro-slide-07.jpg";
import livroSlide08 from "@/assets/livro-slide-08.jpg";
import { SeteSetembroArticleModal } from "@/components/landing/sete-setembro-article-modal";
import { SETE_SETEMBRO_ARTICLE } from "@/data/sete-setembro-article";

const HOME_NEWS = [
  {
    source: SETE_SETEMBRO_ARTICLE.source,
    date: SETE_SETEMBRO_ARTICLE.date,
    title: SETE_SETEMBRO_ARTICLE.title,
    description:
      "Candidato a deputado federal reforça mobilização marcada para as 15h deste Dia da Independência. O ato ocorre em plena reta final da campanha presidencial e terá Flávio Bolsonaro entre seus protagonistas. O chamado acontece em um dos momentos mais intensos da campanha eleitoral de 2026.",
    url: SETE_SETEMBRO_ARTICLE.url,
    image: SETE_SETEMBRO_ARTICLE.image,
    objectPosition: SETE_SETEMBRO_ARTICLE.imagePosition,
    opensModal: true,
    external: false,
  },
  {
    source: "Acesse Política",
    date: "04/08/2026",
    title: "Baiano, Padre Kelmon tenta chegar à Câmara dos Deputados após destaque nos debates de 2022",
    description:
      "Após a disputa presidencial e o destaque nos debates de 2022, o religioso é candidato a deputado federal por São Paulo pelo PL. A matéria acompanha a tentativa de chegar à Câmara dos Deputados.",
    url: "https://acessepolitica.com.br/noticia/179453/baiano-padre-kelmon-tenta-chegar-a-camara-dos-deputados-apos-destaque-nos-debates-de-2022",
    image: "/news/acesse-politica-kelmon.webp",
    objectPosition: "center 18%",
    opensModal: false,
    external: true,
  },
  {
    source: "ND Mais",
    date: "16/08/2026",
    title: "Eles roubaram a cena: relembre 6 candidatos que marcaram eleições no Brasil",
    description:
      "A matéria inclui Padre Kelmon na memória eleitoral de 2022, com os debates e os 81 mil votos, entre candidatos que marcaram eleições no Brasil. O texto relembra o destaque do religioso naquela disputa.",
    url: "https://ndmais.com.br/politica/candidatos-curiosos-que-marcaram-eleicoes-no-brasil/",
    image: "/news/ndmais-candidatos.jpg",
    objectPosition: "center 30%",
    opensModal: false,
    external: false,
  },
  {
    source: "7Minutos",
    date: "08/2026",
    title:
      "Padre Kelmon reúne lideranças cristãs em apoio a Flávio Bolsonaro e celebra 11 anos de sacerdócio",
    description:
      "Padre Kelmon reúne lideranças cristãs em apoio a Flávio Bolsonaro, reforça a pré-campanha e celebra 11 anos de sacerdócio. O encontro marca mais um ano de ministério e a mobilização em torno da pré-campanha.",
    url: "https://7minutos.com.br/noticias/padre-kelmon-reune-liderancas-cristas-em-apoio-a-pre-campanha-de-flavio-bolsonaro-e-celebra-11-anos-de-sacerdocio/",
    image: "/news/7minutos-liderancas.webp",
    objectPosition: "center center",
    opensModal: false,
    external: false,
  },
] as const;

const BOOK_SLIDES = [
  {
    src: livroSlide01,
    alt: "Capa do livro Fé e Política de Mãos Dadas, de Padre Kelmon",
  },
  {
    src: livroSlide02,
    alt: "Lançamento do livro Fé e Política de Mãos Dadas",
  },
  {
    src: livroSlide03,
    alt: "Padre Kelmon apresenta o livro Fé e Política de Mãos Dadas",
  },
  {
    src: livroSlide04,
    alt: "Padre Kelmon com o livro Fé e Política de Mãos Dadas no PL",
  },
  {
    src: livroSlide05,
    alt: "Padre Kelmon com o livro Fé e Política de Mãos Dadas em livraria",
  },
  {
    src: livroSlide06,
    alt: "Padre Kelmon apresenta o livro em entrevista",
  },
  {
    src: livroSlide07,
    alt: "Padre Kelmon com o livro Fé e Política de Mãos Dadas",
  },
  {
    src: livroSlide08,
    alt: "Apresentação do livro Fé e Política de Mãos Dadas",
  },
] as const;

const BOOK_ROTATE_MS = 60_000;
const BOOK_SWIPE_PX = 40;
const BOOK_HOVER_PX = 72;

function BookCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const hoverX = useRef<number | null>(null);
  const hoverAt = useRef(0);

  const go = (direction: 1 | -1) => {
    setIndex((current) => (current + direction + BOOK_SLIDES.length) % BOOK_SLIDES.length);
  };

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % BOOK_SLIDES.length);
    }, BOOK_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, index]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* pointer capture is optional; swipe still reads the up coordinates */
    }
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    pointer.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= BOOK_SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div
      className="imprensa-book mx-auto overflow-hidden rounded-xl border-2 border-gray-200 bg-neutral-100 shadow-lg md:mx-0"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Fotos do livro Fé e Política de Mãos Dadas"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        hoverX.current = null;
      }}
      onMouseMove={(event) => {
        if (pointer.current) return;
        if (hoverX.current == null) {
          hoverX.current = event.clientX;
          return;
        }
        const dx = event.clientX - hoverX.current;
        const now = Date.now();
        if (Math.abs(dx) >= BOOK_HOVER_PX && now - hoverAt.current > 800) {
          go(dx < 0 ? 1 : -1);
          hoverX.current = event.clientX;
          hoverAt.current = now;
        }
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        pointer.current = null;
      }}
    >
      {BOOK_SLIDES.map((slide, slideIndex) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          width={1080}
          height={1440}
          loading={slideIndex === 0 ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className={`imprensa-book-slide${slideIndex === index ? " is-active" : ""}`}
        />
      ))}
      <div className="imprensa-book-dots" role="tablist" aria-label="Escolher foto">
        {BOOK_SLIDES.map((slide, slideIndex) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={slideIndex === index}
            aria-label={`Foto ${slideIndex + 1}`}
            className={`imprensa-book-dot${slideIndex === index ? " is-active" : ""}`}
            onClick={() => setIndex(slideIndex)}
          />
        ))}
      </div>
    </div>
  );
}

function NewsCardMedia({
  item,
}: {
  item: (typeof HOME_NEWS)[number];
}) {
  return (
    <>
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-neutral-200">
        <img
          src={item.image}
          alt=""
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top"
          style={{ objectPosition: item.objectPosition } as CSSProperties}
        />
      </div>
      <div className="imprensa-news-copy">
        <p className="imprensa-news-meta">
          <Newspaper className="mr-1 inline size-3 align-[-2px]" aria-hidden="true" />
          {item.source} · {item.date}
        </p>
        <h3
          className="imprensa-news-title"
          style={{ color: "var(--blue-primary)" }}
          title={item.title}
        >
          {item.title}
        </h3>
        <p className="imprensa-news-desc">{item.description}</p>
      </div>
    </>
  );
}

const newsCardClassName =
  "imprensa-news-card group transition hover:border-blue-500 hover:shadow-md";

export function NewsAndBook() {
  const [articleOpen, setArticleOpen] = useState(false);

  return (
    <div className="imprensa-block">
      <div className="mb-4 shrink-0">
        <h2
          className="text-xl font-black sm:text-2xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
        >
          Padre Kelmon na imprensa
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Matérias recentes e o livro Fé e Política de Mãos Dadas.
        </p>
      </div>

      <div className="imprensa-row">
        <BookCarousel />

        <div className="imprensa-news-grid">
          {HOME_NEWS.map((item) => {
            if (item.opensModal) {
              return (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => setArticleOpen(true)}
                  className={newsCardClassName}
                >
                  <NewsCardMedia item={item} />
                </button>
              );
            }

            const isExternal = item.url.startsWith("http");
            return (
              <a
                key={item.url}
                href={item.url}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={newsCardClassName}
              >
                <NewsCardMedia item={item} />
              </a>
            );
          })}
        </div>
      </div>

      <SeteSetembroArticleModal open={articleOpen} onOpenChange={setArticleOpen} />
    </div>
  );
}
