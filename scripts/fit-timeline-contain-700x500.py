# -*- coding: utf-8 -*-
"""
Ajusta TODAS as fotos da timeline para 700x500 SEM CORTAR o conteúdo.
1) Remove barras pretas / UI
2) Encaixa a foto INTEIRA dentro de 700x500 (letterbox)
"""
from pathlib import Path
import subprocess

import numpy as np
from PIL import Image, ImageChops, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
TIMELINE = ROOT / "src" / "assets" / "timeline"
ASSETS = Path(
    r"C:\Users\Marketing\.cursor\projects\c-Users-Marketing-Desktop-Padre-Kelmon-kelmon-sua-voz-em-sp-main-kelmon-sua-voz-em-sp-main-pekelmon\assets"
)
TARGET = (700, 500)
BG = (245, 245, 244)

SEMINARIO_UUIDS = [
    "26a2b1d2-e4a8-4773-a851-d9f1e1b225af",
    "3dffdc8f-f978-42c8-af43-8774b9aa3868",
    "4b2e4139-3818-43f8-8e72-7418bbe241d3",
    "380e4b0b-d38a-4bab-a994-da569538e46b",
    "f4c4ebe3-8149-4356-ab64-73e5602c2917",
    "01371c3d-20d2-4794-8167-a92d9050ff88",
    "d95e6320-72e2-410a-8f5f-2db438788f73",
    "5af53032-0f3d-40ea-8ca9-db3a3bb17ab1",
    "5ccd8f75-50d9-4cf2-b88b-1f7a67701b29",
    "a15339dc-944f-45fd-8219-09dc712a1520",
    "6b51c7e2-f0a8-4dfa-b3db-c7354aa47b55",
    "b21a0d89-9141-4b84-9d1b-1847f7404bde",
    "575ce204-fcb6-425f-916c-89bc4842c4e1",
    "fcb17859-1001-4404-b02f-621f4e3ce7f0",
    "0ec615ec-96dc-4931-8e77-c2bd788518da",
    "ac868e7a-86a1-42a1-9a4f-f87456cb1621",
    "52a97ff0-951a-46d2-86f2-9a5d1ae9af8f",
    "19c2e434-bfbe-4cde-aa5e-ae01f2111029",
    "f1728dd8-e2dc-48de-9056-dff458776405",
    "a3dc1ad3-3dd1-480d-85d2-2e39c9712918",
]

RAIZES9 = ASSETS / (
    "c__Users_Marketing_AppData_Roaming_Cursor_User_workspaceStorage_"
    "9bd8adcccfb1849bb80a5b51718af530_images_Juventude_padre_kelmon_4-"
    "56e9cfde-53ac-46c0-a515-33ec84aa81a8.png"
)


def enhance(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    im = ImageEnhance.Contrast(im).enhance(1.04)
    im = ImageEnhance.Color(im).enhance(1.03)
    im = ImageEnhance.Sharpness(im).enhance(1.1)
    im = im.filter(ImageFilter.UnsharpMask(radius=0.8, percent=80, threshold=3))
    return im


def trim_non_content(im: Image.Image) -> Image.Image:
    """Remove barras pretas de print — mantém a foto inteira (sem cortar cabeças)."""
    rgb = im.convert("RGB")
    arr = np.asarray(rgb, dtype=np.float32)
    lum = arr.mean(axis=2)
    # linha "preta" = >80% dos pixels escuros (barra FB)
    is_black = (lum < 28).mean(axis=1) > 0.80

    # Sem barra dominante: só remove margem preta leve
    if is_black.mean() < 0.15:
        bbox = ImageChops.difference(
            rgb, Image.new("RGB", rgb.size, (0, 0, 0))
        ).getbbox()
        return rgb.crop(bbox) if bbox else rgb

    # Maior faixa contínua com foto real (ignora chrome no topo + barra preta)
    best = (0, 0)
    start = None
    for i, black_row in enumerate(is_black):
        if not black_row and start is None:
            start = i
        if (black_row or i == len(is_black) - 1) and start is not None:
            end = i if black_row else i + 1
            if end - start > best[1] - best[0]:
                best = (start, end)
            start = None

    top, bottom = best
    if bottom - top < rgb.height * 0.08:
        return rgb

    photo = rgb.crop((0, top, rgb.width, bottom))
    a = np.asarray(photo, dtype=np.float32)
    col_black = (a.mean(axis=2) < 28).mean(axis=0) > 0.85
    left = 0
    while left < len(col_black) and col_black[left]:
        left += 1
    right = len(col_black) - 1
    while right > left and col_black[right]:
        right -= 1
    return photo.crop((left, 0, right + 1, photo.height))


def fit_contain_700x500(im: Image.Image) -> Image.Image:
    """Encaixa a imagem INTEIRA em 700x500 — nunca corta o conteúdo da foto."""
    photo = trim_non_content(im)
    photo = enhance(photo)
    fitted = ImageOps.contain(photo, TARGET, method=Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", TARGET, BG)
    x = (TARGET[0] - fitted.size[0]) // 2
    y = (TARGET[1] - fitted.size[1]) // 2
    canvas.paste(fitted, (x, y))
    return canvas


def save(im: Image.Image, path: Path) -> None:
    im.save(path, "WEBP", quality=92, method=6)
    print(f"OK {path.name:22} {im.size} {path.stat().st_size // 1024}KB")


def find_uuid(uuid: str) -> Path:
    matches = list(ASSETS.glob(f"*{uuid}*"))
    if not matches:
        raise FileNotFoundError(uuid)
    return matches[0]


def main() -> None:
    # Restaura originais de raízes/juventude do git
    subprocess.run(
        ["git", "checkout", "HEAD", "--", "src/assets/timeline"],
        cwd=ROOT,
        check=False,
        capture_output=True,
    )

    for p in TIMELINE.glob("seminario-*.webp"):
        p.unlink(missing_ok=True)

    for i, uuid in enumerate(SEMINARIO_UUIDS, start=1):
        src = find_uuid(uuid)
        save(fit_contain_700x500(Image.open(src)), TIMELINE / f"seminario-{i}.webp")

    for i in range(1, 9):
        src = TIMELINE / f"raizes-{i}.webp"
        if src.exists():
            save(fit_contain_700x500(Image.open(src)), src)

    if RAIZES9.exists():
        save(fit_contain_700x500(Image.open(RAIZES9)), TIMELINE / "raizes-9.webp")
    elif (TIMELINE / "juventude-4.webp").exists():
        save(
            fit_contain_700x500(Image.open(TIMELINE / "juventude-4.webp")),
            TIMELINE / "raizes-9.webp",
        )

    juv = []
    for i in range(1, 10):
        p = TIMELINE / f"juventude-{i}.webp"
        if p.exists() and i != 4:
            juv.append(fit_contain_700x500(Image.open(p)))
    for p in TIMELINE.glob("juventude-*.webp"):
        p.unlink()
    for idx, im in enumerate(juv, start=1):
        save(im, TIMELINE / f"juventude-{idx}.webp")

    # Confirma: nenhuma imagem com barra preta dominante
    for p in sorted(TIMELINE.glob("*.webp")):
        arr = np.asarray(Image.open(p).convert("RGB"))
        black = (arr.mean(axis=2) < 15).mean()
        if black > 0.25:
            print("WARN still blackish", p.name, round(black, 2))

    print("done — todas 700x500 SEM cortar a foto")


if __name__ == "__main__":
    main()
