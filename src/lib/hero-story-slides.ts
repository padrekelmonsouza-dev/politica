import book1 from "@/assets/hero-book-01.jpg";
import book2 from "@/assets/hero-book-02.jpg";
import book3 from "@/assets/hero-book-03.jpg";
import book4 from "@/assets/hero-book-04.jpg";
import debate1 from "@/assets/hero-debate-01.png";
import debate4 from "@/assets/hero-debate-04.png";
import sp1 from "@/assets/hero-sp-01.jpg";
import sp2 from "@/assets/hero-sp-02.jpg";
import sp3 from "@/assets/hero-sp-03.jpg";
import sp4 from "@/assets/hero-sp-04.jpg";
import story1 from "@/assets/hero-story-01.jpg";
import story2 from "@/assets/hero-story-02.jpg";
import story3 from "@/assets/hero-story-03.jpg";
import story4 from "@/assets/hero-story-04.jpg";
import story5 from "@/assets/hero-story-05.jpg";
import values1 from "@/assets/hero-values-01.jpg";
import values2 from "@/assets/hero-values-02.jpg";

export const HERO_STORY_WIDTH = 1080;
export const HERO_STORY_HEIGHT = 1350;

export const HERO_STORY_SLIDES = [
  {
    src: story1,
    alt: "Quem é Padre Kelmon? Conheça sua trajetória de fé, espiritualidade e vida pública.",
  },
  {
    src: story2,
    alt: "Padre Kelmon nasceu em Salvador, em uma família marcada pela fé, pelo trabalho e pelos valores cristãos.",
  },
  {
    src: story3,
    alt: "Aos 20 anos, Padre Kelmon ingressou no seminário em São Paulo.",
  },
  {
    src: story4,
    alt: "Com atuação pública e sacerdotal, Padre Kelmon levou sua mensagem a diferentes regiões do Brasil.",
  },
  {
    src: story5,
    alt: "Uma vida dedicada a servir. Agora é por São Paulo e pelo Brasil.",
  },
] as const;

export const HERO_VALUES_SLIDES = [
  {
    src: values1,
    alt: "Fé, Pátria e Liberdade. Os valores que orientam a missão pública de Padre Kelmon.",
  },
  {
    src: values2,
    alt: "Minha atuação pública nasce desses três pilares: fé para permanecer firme, pátria para servir com responsabilidade e liberdade para defender aquilo que é essencial.",
  },
] as const;

export const HERO_DEBATE_SLIDES = [
  {
    src: debate1,
    kind: "image" as const,
    alt: "O debate que o Brasil não esqueceu. Padre Kelmon 2202.",
  },
  {
    src: "/hero-debate/02.mov",
    kind: "video" as const,
    alt: "Vídeo 2 do carrossel do debate de Padre Kelmon.",
  },
  {
    src: "/hero-debate/03.mov",
    kind: "video" as const,
    alt: "Vídeo 3 do carrossel do debate de Padre Kelmon.",
  },
  {
    src: debate4,
    kind: "image" as const,
    alt: "E agora a voz que não se calou em 2022 segue firme. Uma nova obrigação nasce por São Paulo e pelo Brasil. Padre Kelmon 2202.",
  },
] as const;

export const HERO_SP_SLIDES = [
  {
    src: sp1,
    alt: "Por que São Paulo? Padre Kelmon 2202.",
  },
  {
    src: sp2,
    alt: "Foi em São Paulo que Padre Kelmon teve sua formação no Seminário Maria Mater Ecclesiae e iniciou a vida missionária.",
  },
  {
    src: sp3,
    alt: "Em 2021, Padre Kelmon foi eleito pelo Santo Sínodo e, nesta mesma data, o MECCLA foi fundado em São Paulo.",
  },
  {
    src: sp4,
    alt: "Por isso coloco meu nome à disposição dos paulistas. Vote no PL. Vote 2202.",
  },
] as const;

export const HERO_BOOK_SLIDES = [
  {
    src: book1,
    alt: "Fé não fica fora da vida pública. Padre Kelmon 2202.",
  },
  {
    src: book2,
    alt: "Querem fazer o povo acreditar que fé e vida pública devem andar separadas. Eu penso o contrário.",
  },
  {
    src: book3,
    alt: "Foi por isso que escrevi Fé e Política de Mãos Dadas. Porque fé não é enfeite, é direção.",
  },
  {
    src: book4,
    alt: "Eu acredito em uma atuação pública com temor a Deus, amor à pátria e compromisso com a liberdade. Vote 2202.",
  },
] as const;

export const HERO_CAROUSELS = [
  {
    id: "1",
    title: "Carrossel 1",
    slides: HERO_STORY_SLIDES,
  },
  {
    id: "2",
    title: "Carrossel 2",
    slides: HERO_VALUES_SLIDES,
  },
  {
    id: "3",
    title: "Carrossel 3",
    slides: HERO_DEBATE_SLIDES,
  },
  {
    id: "4",
    title: "Carrossel 4",
    slides: HERO_BOOK_SLIDES,
  },
  {
    id: "5",
    title: "Carrossel 5",
    slides: HERO_SP_SLIDES,
  },
] as const;
