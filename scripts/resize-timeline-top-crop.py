# -*- coding: utf-8 -*-
"""700x500 cover aligned to TOP — never crop heads; crop bottom only."""
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
TIMELINE = ROOT / "src" / "assets" / "timeline"
ASSETS = Path(
    r"C:\Users\Marketing\.cursor\projects\c-Users-Marketing-Desktop-Padre-Kelmon-kelmon-sua-voz-em-sp-main-kelmon-sua-voz-em-sp-main-pekelmon\assets"
)
TARGET_W, TARGET_H = 700, 500
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
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Color(im).enhance(1.03)
    im = ImageEnhance.Sharpness(im).enhance(1.12)
    im = im.filter(ImageFilter.UnsharpMask(radius=0.9, percent=85, threshold=3))
    return im


def trim_black_bars(im: Image.Image) -> Image.Image:
    rgb = im.convert("RGB")
    bg = Image.new("RGB", rgb.size, (0, 0, 0))
    bbox = ImageChops.difference(rgb, bg).getbbox()
    if not bbox:
        return rgb
    left, top, right, bottom = bbox
    cropped = rgb.crop(
        (max(0, left - 2), max(0, top - 2), min(rgb.width, right + 2), min(rgb.height, bottom + 2))
    )
    w, h = cropped.size
    if h > w * 1.4 and h >= 900:
        cropped = cropped.crop((0, int(h * 0.08), w, int(h * 0.86)))
    return cropped


def trim_letterbox(im: Image.Image, bg=BG, tol=12) -> Image.Image:
    arr = np.array(im.convert("RGB"))
    diff = np.abs(arr.astype(np.int16) - np.array(bg, dtype=np.int16)).sum(axis=2)
    mask = diff > tol
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    if len(rows) == 0 or len(cols) == 0:
        return im.convert("RGB")
    return im.crop((int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1)).convert("RGB")


def top_fill_700x500(im: Image.Image) -> Image.Image:
    """
    Preenche 700x500 por completo.
    Alinha ao TOPO: nunca corta cabeças; corta só a parte de baixo (e laterais se preciso).
    """
    im = trim_letterbox(im.convert("RGB"))
    w, h = im.size

    # Escala para COBRIR o retângulo 700x500
    scale = max(TARGET_W / w, TARGET_H / h)
    nw, nh = max(TARGET_W, int(round(w * scale))), max(TARGET_H, int(round(h * scale)))
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)

    # Crop: topo fixo (y=0), centro horizontal
    left = max(0, (nw - TARGET_W) // 2)
    top = 0  # NUNCA corta o topo
    out = im.crop((left, top, left + TARGET_W, top + TARGET_H))
    if out.size != (TARGET_W, TARGET_H):
        out = ImageOps.fit(out, (TARGET_W, TARGET_H), method=Image.Resampling.LANCZOS, centering=(0.5, 0.0))
    return enhance(out)


def save(im: Image.Image, path: Path) -> None:
    im.save(path, "WEBP", quality=90, method=6)
    print(f"OK {path.name:22} {im.size} {path.stat().st_size // 1024}KB")


def find_uuid(uuid: str) -> Path:
    matches = list(ASSETS.glob(f"*{uuid}*"))
    if not matches:
        raise FileNotFoundError(uuid)
    return matches[0]


def main() -> None:
    # Restaura base do git para raízes/juventude com cabeça intacta
    # (seminario vem dos WhatsApp)
    import subprocess

    subprocess.run(
        ["git", "checkout", "HEAD", "--", "src/assets/timeline"],
        cwd=ROOT,
        check=False,
        capture_output=True,
    )

    for p in TIMELINE.glob("seminario-*.webp"):
        p.unlink(missing_ok=True)

    for i, uuid in enumerate(SEMINARIO_UUIDS, start=1):
        im = trim_black_bars(Image.open(find_uuid(uuid)))
        save(top_fill_700x500(im), TIMELINE / f"seminario-{i}.webp")

    for i in range(1, 9):
        src = TIMELINE / f"raizes-{i}.webp"
        if src.exists():
            save(top_fill_700x500(Image.open(src)), src)

    if RAIZES9.exists():
        save(top_fill_700x500(Image.open(RAIZES9)), TIMELINE / "raizes-9.webp")
    elif (TIMELINE / "juventude-4.webp").exists():
        save(top_fill_700x500(Image.open(TIMELINE / "juventude-4.webp")), TIMELINE / "raizes-9.webp")

    juv = []
    for i in range(1, 10):
        p = TIMELINE / f"juventude-{i}.webp"
        if p.exists() and i != 4:
            juv.append(top_fill_700x500(Image.open(p)))
    for p in TIMELINE.glob("juventude-*.webp"):
        p.unlink()
    for idx, im in enumerate(juv, start=1):
        save(im, TIMELINE / f"juventude-{idx}.webp")

    print("done")


if __name__ == "__main__":
    main()
