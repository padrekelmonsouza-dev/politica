# -*- coding: utf-8 -*-
"""Normalize timeline photos: enhance, fit on fixed canvas without cropping."""
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
TIMELINE = ROOT / "src" / "assets" / "timeline"
ATTACHED = Path(
    r"C:\Users\Marketing\.cursor\projects\c-Users-Marketing-Desktop-Padre-Kelmon-kelmon-sua-voz-em-sp-main-kelmon-sua-voz-em-sp-main-pekelmon\assets\c__Users_Marketing_AppData_Roaming_Cursor_User_workspaceStorage_9bd8adcccfb1849bb80a5b51718af530_images_Juventude_padre_kelmon_4-56e9cfde-53ac-46c0-a515-33ec84aa81a8.png"
)

# Canvas único — retrato, sem cortar (letterbox)
CANVAS = (800, 1000)
BG = (245, 245, 244)  # neutro claro


def enhance(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    # leve melhora de nitidez/contraste sem morph de rosto
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.04)
    im = ImageEnhance.Sharpness(im).enhance(1.15)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.0, percent=90, threshold=3))
    return im


def fit_canvas(im: Image.Image) -> Image.Image:
    """Encaixa a imagem inteira no canvas sem cortar."""
    return ImageOps.contain(im, CANVAS, method=Image.Resampling.LANCZOS)


def pad_to_canvas(im: Image.Image) -> Image.Image:
    canvas = Image.new("RGB", CANVAS, BG)
    fitted = fit_canvas(im)
    x = (CANVAS[0] - fitted.size[0]) // 2
    y = (CANVAS[1] - fitted.size[1]) // 2
    canvas.paste(fitted, (x, y))
    return canvas


def save_webp(im: Image.Image, path: Path) -> None:
    im.save(path, "WEBP", quality=90, method=6)


def process_file(src: Path, dest: Path) -> None:
    im = enhance(Image.open(src))
    out = pad_to_canvas(im)
    save_webp(out, dest)
    print(f"OK {dest.name:20} {out.size} {dest.stat().st_size // 1024}KB")


def main() -> None:
    TIMELINE.mkdir(parents=True, exist_ok=True)

    # 1) Processar anexada -> raizes-9 (mover de juventude)
    if ATTACHED.exists():
        process_file(ATTACHED, TIMELINE / "raizes-9.webp")
    else:
        # fallback: usar juventude-4 atual
        process_file(TIMELINE / "juventude-4.webp", TIMELINE / "raizes-9.webp")

    # 2) Reprocessar raizes 1-8
    for i in range(1, 9):
        p = TIMELINE / f"raizes-{i}.webp"
        if p.exists():
            process_file(p, p)

    # 3) Reprocessar juventude: remover 4 e renumerar 5-9 -> 4-8
    # Guardar cópias processadas em memória/temp
    juv_sources = []
    for i in range(1, 10):
        p = TIMELINE / f"juventude-{i}.webp"
        if not p.exists():
            continue
        if i == 4:
            continue  # removida (foi para raízes)
        juv_sources.append(p)

    # carregar e regravar como 1..N
    processed = []
    for p in juv_sources:
        im = pad_to_canvas(enhance(Image.open(p)))
        processed.append(im)

    # apagar antigos juventude-*
    for p in TIMELINE.glob("juventude-*.webp"):
        p.unlink()

    for idx, im in enumerate(processed, start=1):
        dest = TIMELINE / f"juventude-{idx}.webp"
        save_webp(im, dest)
        print(f"OK {dest.name:20} {im.size} {dest.stat().st_size // 1024}KB")

    # 4) Reprocessar seminário
    for p in sorted(TIMELINE.glob("seminario-*.webp")):
        process_file(p, p)

    print("done")


if __name__ == "__main__":
    main()
