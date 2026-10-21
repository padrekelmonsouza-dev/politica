import { useEffect, useRef } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SETE_SETEMBRO_ARTICLE, SETE_SETEMBRO_REEL } from "@/data/sete-setembro-article";

export function SeteSetembroArticleBody() {
  const article = SETE_SETEMBRO_ARTICLE;

  return (
    <div className="space-y-4 text-sm leading-relaxed text-foreground sm:text-[0.95rem]">
      <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--yellow-primary)" }}>
        {article.eyebrow}
      </p>
      <p className="text-base font-black leading-snug sm:text-lg" style={{ color: "var(--blue-primary)" }}>
        {article.title}
      </p>
      <p className="text-gray-600">{article.lead}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {article.source} · {article.date}
      </p>
      {article.body.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h3
              key={index}
              className="pt-2 text-base font-black sm:text-lg"
              style={{ fontFamily: "var(--font-display)", color: "var(--blue-primary)" }}
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={index}
              className="rounded-xl border-l-4 px-3 py-2 text-base font-bold"
              style={{
                borderColor: "var(--yellow-primary)",
                backgroundColor: "oklch(0.97 0.04 95 / 0.55)",
                color: "var(--blue-primary)",
              }}
            >
              “{block.text}”
            </blockquote>
          );
        }
        return <p key={index}>{block.text}</p>;
      })}
      <div
        className="space-y-1 rounded-xl border-2 p-3 text-xs font-semibold leading-relaxed sm:text-sm"
        style={{ borderColor: "var(--blue-primary)", color: "var(--blue-primary)" }}
      >
        {article.footer.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export function SeteSetembroArticleModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) videoRef.current?.pause();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[min(100%,56rem)] max-w-5xl gap-4 overflow-y-auto border-0 bg-white p-3 sm:p-5">
        <DialogHeader className="pr-8 text-left">
          <DialogTitle className="line-clamp-3 text-base sm:text-lg">
            {SETE_SETEMBRO_ARTICLE.title}
          </DialogTitle>
          <DialogDescription>
            Matéria completa do 7 de Setembro. Use o player para reproduzir o Reel.
          </DialogDescription>
        </DialogHeader>

        <div className="grid items-start gap-5 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
          <div className="mx-auto w-full max-w-[16rem]">
            {open ? (
              <div className="relative aspect-[1080/1920] w-full overflow-hidden rounded-xl bg-black">
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  src={SETE_SETEMBRO_REEL.videoSrc}
                  width={1080}
                  height={1920}
                  controls
                  playsInline
                  autoPlay
                  preload="auto"
                  title={SETE_SETEMBRO_REEL.title}
                >
                  Seu navegador não reproduz vídeo.{" "}
                  <a href={SETE_SETEMBRO_REEL.videoSrc} className="underline">
                    Baixar o Reel
                  </a>
                  .
                </video>
              </div>
            ) : null}
            <a
              href={SETE_SETEMBRO_REEL.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-semibold text-gray-600 hover:underline"
            >
              Abrir Reel no Instagram
            </a>
          </div>

          <div className="min-w-0">
            <SeteSetembroArticleBody />
            <a
              href={SETE_SETEMBRO_ARTICLE.url}
              className="mt-4 inline-flex text-sm font-bold underline decoration-2 underline-offset-4"
              style={{ color: "var(--blue-primary)" }}
            >
              Abrir matéria em página inteira
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
