# -*- coding: utf-8 -*-
import json
import re
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "data" / "youtube-highlights.ts"
JSON_CACHE = ROOT / "scripts" / "youtube-stats-cache.json"


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def fetch(vid: str) -> dict:
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
    micro = ((data.get("microformat") or {}).get("playerMicroformatRenderer") or {})
    return {
        "id": vid,
        "title": vd.get("title") or "Padre Kelmon no YouTube",
        "views": int(vd.get("viewCount") or 0),
        "published": (micro.get("publishDate") or micro.get("uploadDate") or "")[:10],
        "url": f"https://www.youtube.com/watch?v={vid}",
        "thumbnail": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
    }


def main() -> None:
    text = SRC.read_text(encoding="utf-8")
    ids = re.findall(r"id: '([^']+)'", text)
    # drop type field false positive
    ids = [i for i in ids if len(i) >= 6]
    print("ids", len(ids))

    results = []
    for i, vid in enumerate(ids):
        for attempt in range(3):
            try:
                row = fetch(vid)
                results.append(row)
                print(f"{i+1:02d} {row['views']:>8} {row['published']} {vid}")
                break
            except Exception as e:
                if attempt == 2:
                    results.append(
                        {
                            "id": vid,
                            "title": "Padre Kelmon no YouTube",
                            "views": 0,
                            "published": "",
                            "url": f"https://www.youtube.com/watch?v={vid}",
                            "thumbnail": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
                        }
                    )
                    print(f"{i+1:02d} FAIL {vid} {e}")
                else:
                    time.sleep(0.6)
        time.sleep(0.1)

    featured = sorted(results, key=lambda x: (x["views"], x["published"]), reverse=True)[0]
    rest = [v for v in results if v["id"] != featured["id"]]
    ordered = [featured] + sorted(rest, key=lambda x: (x["views"], x["published"]), reverse=True)

    JSON_CACHE.write_text(json.dumps(ordered, ensure_ascii=False, indent=2), encoding="utf-8")

    lines = [
        "export type YoutubeHighlight = {",
        "  id: string;",
        "  title: string;",
        "  url: string;",
        "  thumbnail: string;",
        "  views: number;",
        "  published: string;",
        "};",
        "",
        "/** Videos selecionados — ordenados por visualizacoes (destaque primeiro). */",
        "export const YOUTUBE_HIGHLIGHTS: YoutubeHighlight[] = [",
    ]
    for v in ordered:
        lines.append("  {")
        lines.append(f"    id: '{v['id']}',")
        lines.append(f"    title: '{esc(v['title'])}',")
        lines.append(f"    url: '{v['url']}',")
        lines.append(f"    thumbnail: '{v['thumbnail']}',")
        lines.append(f"    views: {v['views']},")
        lines.append(f"    published: '{v['published']}',")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    lines.append(f"export const YOUTUBE_FEATURED_ID = '{featured['id']}';")
    lines.append("")
    SRC.write_text("\n".join(lines), encoding="utf-8")
    print("FEATURED", featured["id"], featured["views"], featured["title"])
    print("wrote", SRC)


if __name__ == "__main__":
    main()
