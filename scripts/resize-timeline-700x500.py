# -*- coding: utf-8 -*-
"""Resize all timeline photos to 700x500 filling the frame (cover zoom)."""
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
TIMELINE = ROOT / "src" / "assets" / "timeline"
TARGET = (700, 500)
MAX_UPSCALE = 1.12


def enhance(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Color(im).enhance(1.03)
    im = ImageEnhance.Sharpness(im).enhance(1.12)
    im = im.filter(ImageFilter.UnsharpMask(radius=0.9, percent=85, threshold=3))
    return im


def trim_letterbox(im: Image.Image, bg=(245, 245, 244), tol=12) -> Image.Image:
    arr = np.array(im.convert("RGB"))
    diff = np.abs(arr.astype(np.int16) - np.array(bg, dtype=np.int16)).sum(axis=2)
    mask = diff > tol
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    if len(rows) == 0 or len(cols) == 0:
        return im.convert("RGB")
    return im.crop((int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1)).convert(
        "RGB"
    )


def fit_700x500(im: Image.Image) -> Image.Image:
    """
    Preenche 700x500 com zoom (cover).
    Prioriza o centro-superior para preservar rostos.
    Não amplia além de MAX_UPSCALE para preservar qualidade.
    """
    im = trim_letterbox(im.convert("RGB"))
    w, h = im.size

    # Evita upscale excessivo: se a imagem for menor, amplia só até o limite
    min_side_needed = min(TARGET) / MAX_UPSCALE
    if min(w, h) < min_side_needed:
        scale = min(MAX_UPSCALE, max(TARGET[0] / w, TARGET[1] / h))
        im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.Resampling.LANCZOS)

    # cover: encaixa preenchendo, com bias para o topo (rostos)
    out = ImageOps.fit(im, TARGET, method=Image.Resampling.LANCZOS, centering=(0.5, 0.38))
    return enhance(out)


def main() -> None:
    files = sorted(TIMELINE.glob("*.webp"))
    print("files", len(files))
    for p in files:
        out = fit_700x500(Image.open(p))
        out.save(p, "WEBP", quality=90, method=6)
        print(f"OK {p.name:22} {out.size} {p.stat().st_size // 1024}KB")


if __name__ == "__main__":
    main()
