# -*- coding: utf-8 -*-
"""Remove JPEG/PNG re-sincronizados e webp duplicados (nome-2, nome-3...)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TIMELINE = ROOT / "public" / "timeline"
ASSETS = ROOT / "src" / "assets" / "timeline"
RAW_EXT = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".avif"}
# ortodoxa-01-2.webp → base ortodoxa-01.webp
DUP_RE = re.compile(r"^(.+-\d+)-(\d+)\.webp$", re.I)


def clean_folder(folder: Path) -> tuple[int, int]:
    if not folder.is_dir():
        return 0, 0
    removed_raw = 0
    removed_dup = 0
    files = [p for p in folder.iterdir() if p.is_file() and not p.name.startswith(".")]

    for p in files:
        if p.suffix.lower() in RAW_EXT:
            p.unlink(missing_ok=True)
            removed_raw += 1

    files = [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() == ".webp"]
    for p in files:
        m = DUP_RE.match(p.name)
        if not m:
            continue
        base = folder / f"{m.group(1)}.webp"
        if base.exists():
            p.unlink(missing_ok=True)
            removed_dup += 1

    state = folder / ".fit-state.json"
    if state.exists():
        state.unlink(missing_ok=True)

    return removed_raw, removed_dup


def main() -> None:
    roots = [TIMELINE, ASSETS]
    if len(sys.argv) > 1:
        roots = [Path(sys.argv[1])]

    total_raw = total_dup = 0
    for root in roots:
        if not root.is_dir():
            continue
        for folder in sorted(p for p in root.iterdir() if p.is_dir()):
            raw, dup = clean_folder(folder)
            left = sum(
                1
                for p in folder.iterdir()
                if p.is_file() and p.suffix.lower() in {".webp", ".jpg", ".jpeg", ".png"}
            )
            if raw or dup:
                print(f"{root.name}/{folder.name}: -{raw} raw, -{dup} dups, left={left}")
            total_raw += raw
            total_dup += dup
    print(f"done raw={total_raw} dups={total_dup}")


if __name__ == "__main__":
    main()
