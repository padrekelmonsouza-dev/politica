# -*- coding: utf-8 -*-
"""
Ajusta automaticamente fotos das pastas public/timeline/<card>/
- Remove barras pretas / UI de print
- Encaixa em 700x500 priorizando rostos (topo)
- Converte para .webp
Rode: python scripts/auto-fit-timeline-images.py [pasta-opcional]
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]
TIMELINE = ROOT / "public" / "timeline"
TARGET = (700, 500)
# Ilha de Maré: mais altura para não cortar pessoas
ILHA_TARGET = (700, 600)
IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}
STATE_NAME = ".fit-state.json"


def trim_edge_bars(im: Image.Image) -> tuple[Image.Image, bool]:
    rgb = im.convert("RGB")
    arr = np.asarray(rgb, dtype=np.float32)
    lum = arr.mean(axis=2)
    h, w = lum.shape
    is_bar_row = ((lum < 30).mean(axis=1) > 0.92) & (lum.std(axis=1) < 22)
    is_bar_col = ((lum < 30).mean(axis=0) > 0.92) & (lum.std(axis=0) < 22)
    had_letterbox = float(is_bar_row.mean()) > 0.12
    top = 0
    while top < h and is_bar_row[top]:
        top += 1
    bot = h - 1
    while bot > top and is_bar_row[bot]:
        bot -= 1
    left = 0
    while left < w and is_bar_col[left]:
        left += 1
    right = w - 1
    while right > left and is_bar_col[right]:
        right -= 1
    if bot - top >= h * 0.2 and right - left >= w * 0.2:
        rgb = rgb.crop((left, top, right + 1, bot + 1))
    w, h = rgb.size
    if had_letterbox and h > w * 1.35 and h >= 700:
        rgb = rgb.crop((0, int(h * 0.05), w, int(h * 0.82)))
        w, h = rgb.size
        arr = np.asarray(rgb, dtype=np.float32)
        lum = arr.mean(axis=2)
        is_bar_row = ((lum < 30).mean(axis=1) > 0.92) & (lum.std(axis=1) < 22)
        top = 0
        while top < h and is_bar_row[top]:
            top += 1
        bot = h - 1
        while bot > top and is_bar_row[bot]:
            bot -= 1
        if bot - top >= h * 0.35:
            rgb = rgb.crop((0, top, w, bot + 1))
    return rgb, had_letterbox


def cover_to_size(
    photo: Image.Image,
    size: tuple[int, int] = TARGET,
    *,
    vertical_bias: float = 0.08,
    zoom: float = 1.0,
) -> Image.Image:
    """Cover size. vertical_bias 0=topo, 0.5=centro, 1=base. zoom<1 afasta (mostra mais)."""
    a = np.asarray(photo.convert("RGB"), dtype=np.float32)
    near_bg = (a[:, :, 0] > 236) & (a[:, :, 1] > 236) & (a[:, :, 2] > 234)
    near_black = (a[:, :, 0] < 18) & (a[:, :, 1] < 18) & (a[:, :, 2] < 18)
    content = ~(near_bg | near_black)
    rows = content.mean(1) > 0.04
    cols = content.mean(0) > 0.04
    if rows.any() and cols.any():
        ys = np.where(rows)[0]
        xs = np.where(cols)[0]
        photo = photo.crop((int(xs[0]), int(ys[0]), int(xs[-1]) + 1, int(ys[-1]) + 1))

    tw, th = size
    w, h = photo.size
    target_ratio = tw / th
    src_ratio = w / max(h, 1)
    if src_ratio > target_ratio:
        new_w = int(h * target_ratio)
        left = max(0, (w - new_w) // 2)
        top = 0
        crop_w, crop_h = new_w, h
    else:
        new_h = int(w / target_ratio)
        max_top = max(0, h - new_h)
        bias = min(1.0, max(0.0, vertical_bias))
        left = 0
        top = int(max_top * bias)
        crop_w, crop_h = w, new_h

    # zoom < 1: amplia a janela de corte (afasta 5% = zoom 0.95)
    z = max(0.5, min(1.5, float(zoom)))
    if z < 1.0:
        expand = (1.0 / z - 1.0) / 2.0
        extra_w = int(crop_w * expand)
        extra_h = int(crop_h * expand)
        left = max(0, left - extra_w)
        top = max(0, top - extra_h)
        right = min(w, left + crop_w + 2 * extra_w)
        bottom = min(h, top + crop_h + 2 * extra_h)
        # recentra se bateu na borda
        if right - left < crop_w + 2 * extra_w:
            left = max(0, min(left, w - (right - left)))
        if bottom - top < crop_h + 2 * extra_h:
            top = max(0, min(top, h - (bottom - top)))
        photo = photo.crop((left, top, right, bottom))
    else:
        photo = photo.crop((left, top, left + crop_w, top + crop_h))

    # garante proporção exata do target antes do resize
    w2, h2 = photo.size
    if w2 / max(h2, 1) > target_ratio:
        nw = int(h2 * target_ratio)
        lx = max(0, (w2 - nw) // 2)
        photo = photo.crop((lx, 0, lx + nw, h2))
    elif w2 / max(h2, 1) < target_ratio:
        nh = int(w2 / target_ratio)
        ty = max(0, (h2 - nh) // 2)
        photo = photo.crop((0, ty, w2, ty + nh))

    out = photo.resize(size, Image.Resampling.LANCZOS)
    out = ImageEnhance.Contrast(out).enhance(1.03)
    out = ImageEnhance.Sharpness(out).enhance(1.08)
    return out


def cover_700x500(photo: Image.Image, *, vertical_bias: float = 0.08) -> Image.Image:
    return cover_to_size(photo, TARGET, vertical_bias=vertical_bias)


def cover_700x500_keep_heads(photo: Image.Image) -> Image.Image:
    return cover_to_size(photo, TARGET, vertical_bias=0.08)


BG = (245, 245, 244)

# Pastas Ilha: remove bordas pretas/brancas e PREENCHE 700x500 (sem letterbox)
CONTAIN_FOLDERS = {"ilha-de-mare"}

# Pastas que priorizam o centro no crop 700x500 (cover)
CENTER_FOLDERS = {"ilha-de-mare"}


def folder_vertical_bias(folder: Path) -> float:
    return 0.5 if folder.name.lower() in CENTER_FOLDERS else 0.08


def folder_contain(folder: Path) -> bool:
    return folder.name.lower() in CONTAIN_FOLDERS


def extract_photo_region(im: Image.Image) -> Image.Image:
    """
    Extrai só a foto real:
    remove barras pretas (WhatsApp), brancas e cinza claro de letterbox.
    """
    rgb = im.convert("RGB")
    arr = np.asarray(rgb, dtype=np.float32)
    lum = arr.mean(axis=2)
    h, w = lum.shape

    row_dark_frac = (lum < 40).mean(axis=1)
    row_mean = lum.mean(axis=1)
    # preto/UI OU faixa branca/cinza clara de letterbox
    is_bar_row = (
        (row_dark_frac > 0.70)
        | (row_mean < 28)
        | ((row_mean > 242) & (lum.std(axis=1) < 18))
    )

    best_start, best_end = 0, 0
    start = None
    for i, bar in enumerate(is_bar_row):
        if not bar and start is None:
            start = i
        if (bar or i == h - 1) and start is not None:
            end = i if bar else i + 1
            if end - start > best_end - best_start:
                best_start, best_end = start, end
            start = None

    if best_end - best_start < h * 0.12:
        top = 0
        while top < h and is_bar_row[top]:
            top += 1
        bot = h - 1
        while bot > top and is_bar_row[bot]:
            bot -= 1
        best_start, best_end = top, bot + 1

    photo = rgb.crop((0, best_start, w, best_end))
    a = np.asarray(photo, dtype=np.float32)
    col_lum = a.mean(axis=2)
    col_dark = (col_lum < 40).mean(axis=0)
    col_mean = col_lum.mean(axis=0)
    col_std = col_lum.std(axis=0)
    is_side_bar = (col_dark > 0.85) | ((col_mean > 242) & (col_std < 18))
    left = 0
    while left < len(is_side_bar) and is_side_bar[left]:
        left += 1
    right = len(is_side_bar) - 1
    while right > left and is_side_bar[right]:
        right -= 1
    if right - left >= photo.width * 0.2:
        photo = photo.crop((left, 0, right + 1, photo.height))

    # segunda passada: remove residual de chrome escuro/branco fino
    a = np.asarray(photo, dtype=np.float32)
    lum2 = a.mean(axis=2)
    row_dark2 = (lum2 < 45).mean(axis=1)
    row_mean2 = lum2.mean(axis=1)
    row_std2 = lum2.std(axis=1)
    top = 0
    max_chrome = max(8, int(photo.height * 0.15))
    while top < max_chrome and (
        row_dark2[top] > 0.55
        or row_mean2[top] < 50
        or (row_mean2[top] > 242 and row_std2[top] < 18)
    ):
        top += 1
    bot = photo.height - 1
    while bot > photo.height - max_chrome and (
        row_dark2[bot] > 0.55
        or row_mean2[bot] < 50
        or (row_mean2[bot] > 242 and row_std2[bot] < 18)
    ):
        bot -= 1
    if bot - top >= photo.height * 0.35:
        photo = photo.crop((0, top, photo.width, bot + 1))

    return photo


def folder_target(folder: Path) -> tuple[int, int]:
    return ILHA_TARGET if folder.name.lower() in CONTAIN_FOLDERS else TARGET


def fill_700x500_no_borders(
    photo: Image.Image, size: tuple[int, int] = ILHA_TARGET
) -> Image.Image:
    """
    size SEM bordas pretas/brancas:
    1) remove letterbox/UI
    2) preenche o quadro inteiro (cover), pessoas no centro
    """
    photo = extract_photo_region(photo)
    photo = ImageEnhance.Contrast(photo).enhance(1.03)
    photo = ImageEnhance.Sharpness(photo).enhance(1.06)
    return cover_to_size(photo, size, vertical_bias=0.45, zoom=1.0)


# alias usado pelo process_file (pasta CONTAIN)
def contain_700x500_centered(
    photo: Image.Image, size: tuple[int, int] = ILHA_TARGET
) -> Image.Image:
    return fill_700x500_no_borders(photo, size)


def load_state(folder: Path) -> dict:
    path = folder / STATE_NAME
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def save_state(folder: Path, state: dict) -> None:
    (folder / STATE_NAME).write_text(
        json.dumps(state, ensure_ascii=False, indent=0),
        encoding="utf-8",
    )


def process_file(
    path: Path,
    out_name: str | None = None,
    *,
    vertical_bias: float = 0.08,
    contain: bool = False,
    size: tuple[int, int] = TARGET,
) -> Path | None:
    try:
        raw = Image.open(path)
        if contain:
            fitted = contain_700x500_centered(raw, size)
        else:
            photo, _ = trim_edge_bars(raw)
            fitted = cover_to_size(photo, size, vertical_bias=vertical_bias)
        dest = path.with_name(out_name) if out_name else path.with_suffix(".webp")
        if dest.suffix.lower() != ".webp":
            dest = dest.with_suffix(".webp")
        fitted.save(dest, "WEBP", quality=92, method=6)
        if dest.resolve() != path.resolve() and path.exists():
            path.unlink(missing_ok=True)
        return dest
    except Exception as e:
        print(f"ERR {path.name}: {e}", file=sys.stderr)
        return None


def process_folder(folder: Path) -> int:
    if not folder.is_dir():
        return 0
    state = load_state(folder)
    bias = folder_vertical_bias(folder)
    contain = folder_contain(folder)
    size = folder_target(folder)
    files = [
        p
        for p in folder.iterdir()
        if p.is_file() and p.suffix.lower() in IMAGE_EXT and not p.name.startswith(".")
    ]
    files.sort(key=lambda p: p.name.lower())
    changed = 0
    new_state: dict = {}

    for path in files:
        try:
            mtime = str(path.stat().st_mtime_ns)
        except FileNotFoundError:
            continue

        key = path.name
        # já processado no tamanho certo?
        if state.get(key) == mtime and path.suffix.lower() == ".webp":
            try:
                with Image.open(path) as im:
                    if im.size == size:
                        new_state[key] = mtime
                        continue
            except Exception:
                pass

        if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".gif", ".avif"}:
            safe = "".join(ch if ch.isalnum() or ch in "-_" else "-" for ch in path.stem)[:48].strip("-")
            out_name = f"{safe or folder.name}.webp"
            dest = process_file(
                path,
                out_name=out_name,
                vertical_bias=bias,
                contain=contain,
                size=size,
            )
        else:
            need = True
            try:
                with Image.open(path) as im:
                    if im.size == size and state.get(key) == mtime:
                        need = False
            except Exception:
                need = True
            if not need:
                new_state[key] = mtime
                continue
            dest = process_file(
                path, vertical_bias=bias, contain=contain, size=size
            )
        if dest and dest.exists():
            changed += 1
            new_state[dest.name] = str(dest.stat().st_mtime_ns)

    save_state(folder, new_state)
    return changed


def main() -> None:
    if len(sys.argv) > 1:
        folders = [Path(sys.argv[1])]
    else:
        folders = [p for p in TIMELINE.iterdir() if p.is_dir()]

    total = 0
    for folder in folders:
        n = process_folder(folder)
        if n:
            print(f"{folder.name}: {n} ajustada(s)")
            total += n
    print(f"done total={total}")


if __name__ == "__main__":
    main()
