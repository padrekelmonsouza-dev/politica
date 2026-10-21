# -*- coding: utf-8 -*-
"""Fetch short descriptions and rewrite youtube-highlights.ts."""
import json
import re
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "data" / "youtube-highlights.ts"
CACHE = ROOT / "scripts" / "youtube-stats-cache.json"
FEATURED_ID = "DGrflujR5kw"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def preview_text(raw: str, limit: int = 180) -> str:
    text = re.sub(r"\s+", " ", (raw or "")).strip()
    text = re.sub(r"https?://\S+", "", text).strip()
    # remove emojis / symbols that break layout
    text = re.sub(r"[\U00010000-\U0010ffff]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return "Assista à entrevista completa com o Padre Kelmon."
    if len(text) <= limit:
        return text
    cut = text[: limit - 1].rsplit(" ", 1)[0]
    return (cut or text[: limit - 1]).rstrip(".,;:") + "…"


def fetch_description(vid: str) -> str:
    body = {
        "context": {
            "client": {
                "clientName": "WEB",
                "clientVersion": "2.20240410.01.00",
                "hl": "pt",
                "gl": "BR",
            }
        },
        "videoId": vid,
    }
    req = urllib.request.Request(
        "https://www.youtube.com/youtubei/v1/player?prettyPrint=false",
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"},
        method="POST",
    )
    raw = urllib.request.urlopen(req, timeout=25).read().decode("utf-8")
    data = json.loads(raw)
    vd = data.get("videoDetails") or {}
    return preview_text(vd.get("shortDescription") or "")


def main() -> None:
    text = SRC.read_text(encoding="utf-8")
    ids = [i for i in re.findall(r"id: '([^']+)'", text) if len(i) >= 6]
    by_id = {}
    if CACHE.exists():
        for row in json.loads(CACHE.read_text(encoding="utf-8")):
            by_id[row["id"]] = row

    results = []
    for i, vid in enumerate(ids):
        base = by_id.get(vid) or {
            "id": vid,
            "title": "Padre Kelmon no YouTube",
            "views": 0,
            "published": "",
            "url": f"https://www.youtube.com/watch?v={vid}",
            "thumbnail": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
        }
        desc = "Assista à entrevista completa com o Padre Kelmon."
        for attempt in range(3):
            try:
                desc = fetch_description(vid)
                break
            except Exception:
                time.sleep(0.5)
        row = {**base, "description": desc}
        results.append(row)
        safe = desc[:60].encode("ascii", "replace").decode("ascii")
        print(f"{i+1:02d}/{len(ids)} {vid} {safe}")
        time.sleep(0.1)

    featured = next((v for v in results if v["id"] == FEATURED_ID), results[0])
    rest = [v for v in results if v["id"] != featured["id"]]
    rest_sorted = sorted(
        rest, key=lambda v: (v.get("published") or "", v.get("views") or 0), reverse=True
    )
    ordered = [featured] + rest_sorted

    CACHE.write_text(json.dumps(ordered, ensure_ascii=False, indent=2), encoding="utf-8")

    lines = [
        "export type YoutubeHighlight = {",
        "  id: string;",
        "  title: string;",
        "  description: string;",
        "  url: string;",
        "  thumbnail: string;",
        "  views: number;",
        "  published: string;",
        "};",
        "",
        "/** Videos do Padre Kelmon — destaque fixo + demais por data. */",
        "export const YOUTUBE_HIGHLIGHTS: YoutubeHighlight[] = [",
    ]
    for v in ordered:
        lines += [
            "  {",
            f"    id: '{v['id']}',",
            f"    title: '{esc(v['title'])}',",
            f"    description: '{esc(v['description'])}',",
            f"    url: '{v['url']}',",
            f"    thumbnail: '{v['thumbnail']}',",
            f"    views: {v.get('views') or 0},",
            f"    published: '{v.get('published') or ''}',",
            "  },",
        ]
    lines += [
        "];",
        "",
        f"export const YOUTUBE_FEATURED_ID = '{FEATURED_ID}';",
        "",
    ]
    SRC.write_text("\n".join(lines), encoding="utf-8")
    print("wrote", SRC)


if __name__ == "__main__":
    main()
