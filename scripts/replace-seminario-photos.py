# -*- coding: utf-8 -*-
"""Replace seminario photos with new WhatsApp attachments; uniform canvas, no crop."""
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageChops

ROOT = Path(__file__).resolve().parents[1]
TIMELINE = ROOT / "src" / "assets" / "timeline"
ASSETS = Path(
    r"C:\Users\Marketing\.cursor\projects\c-Users-Marketing-Desktop-Padre-Kelmon-kelmon-sua-voz-em-sp-main-kelmon-sua-voz-em-sp-main-pekelmon\assets"
)

# Ordem dos anexos enviados pelo usuário (UUID único)
UUIDS = [
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

CANVAS = (800, 1000)
BG = (245, 245, 244)


def find_source(uuid: str) -> Path:
    matches = list(ASSETS.glob(f"*{uuid}*"))
    if not matches:
        raise FileNotFoundError(uuid)
    return matches[0]


def trim_black_bars(im: Image.Image) -> Image.Image:
    """Remove barras pretas laterais típicas de print do Facebook."""
    rgb = im.convert("RGB")
    bg = Image.new("RGB", rgb.size, (0, 0, 0))
    diff = ImageChops.difference(rgb, bg)
    bbox = diff.getbbox()
    if not bbox:
        return rgb
    # folga mínima
    left, top, right, bottom = bbox
    pad = 2
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(rgb.width, right + pad)
    bottom = min(rgb.height, bottom + pad)
    cropped = rgb.crop((left, top, right, bottom))
    # se ainda parece screenshot FB (muito alto e estreito), corta UI topo/base
    w, h = cropped.size
    if h > w * 1.4 and h >= 900:
        # corta faixa superior (~8%) e inferior (~14%) da UI
        top_cut = int(h * 0.08)
        bottom_cut = int(h * 0.86)
        cropped = cropped.crop((0, top_cut, w, bottom_cut))
    return cropped


def enhance(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.05)
    im = ImageEnhance.Sharpness(im).enhance(1.18)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.0, percent=95, threshold=3))
    return im


def pad_to_canvas(im: Image.Image) -> Image.Image:
    fitted = ImageOps.contain(im, CANVAS, method=Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", CANVAS, BG)
    x = (CANVAS[0] - fitted.size[0]) // 2
    y = (CANVAS[1] - fitted.size[1]) // 2
    canvas.paste(fitted, (x, y))
    return canvas


def main() -> None:
    TIMELINE.mkdir(parents=True, exist_ok=True)

    # remove seminarios antigos
    for p in TIMELINE.glob("seminario-*.webp"):
        p.unlink()

    for i, uuid in enumerate(UUIDS, start=1):
        src = find_source(uuid)
        im = Image.open(src)
        im = trim_black_bars(im)
        im = enhance(im)
        out = pad_to_canvas(im)
        dest = TIMELINE / f"seminario-{i}.webp"
        out.save(dest, "WEBP", quality=90, method=6)
        print(f"{i:02d} {src.name[-45:]} -> {dest.name} {out.size} {dest.stat().st_size // 1024}KB")

    print("total", len(UUIDS))


if __name__ == "__main__":
    main()
