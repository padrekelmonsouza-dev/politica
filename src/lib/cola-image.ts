import colaOficial from "@/assets/colinha-oficial.jpg";
import type { Candidate } from "@/data/cola-candidates";
import type { ColaSelection } from "./cola-store";

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function generateColaImage(
  _selection: ColaSelection,
  _byId: Record<string, Candidate>,
) {
  const img = await loadImage(colaOficial);
  if (!img) throw new Error("Não foi possível gerar a imagem");

  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");

  ctx.fillStyle = "#0050b8";
  ctx.fillRect(0, 0, W, H);

  const scale = Math.min(W / img.naturalWidth, H / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = (W - dw) / 2;
  const dy = (H - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Não foi possível gerar a imagem"));
    }, "image/png");
  });
}

export async function downloadColaImage(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "minha-cola-eleicoes-2026.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function shareColaImage(blob: Blob) {
  const file = new File([blob], "minha-cola-eleicoes-2026.png", { type: "image/png" });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: "Minha Cola 2026",
      text: "Minha cola eleitoral pessoal.",
      files: [file],
    });
    return true;
  }
  await downloadColaImage(blob);
  return false;
}

export { loadImage };
