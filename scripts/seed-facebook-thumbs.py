import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "facebook"
DATA = ROOT / "src" / "data" / "facebook-posts.json"

IDS = [
    "1375432754686648",
    "1374659944763929",
    "1369401381956452",
    "1362921195937804",
]

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


def fetch_screenshot(page_url: str) -> bytes | None:
    api = (
        "https://api.microlink.io/?"
        + urllib.parse.urlencode(
            {
                "url": page_url,
                "screenshot": "true",
                "meta": "false",
                "embed": "screenshot.url",
                "force": "true",
            }
        )
    )
    req = urllib.request.Request(api, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=70) as res:
            data = res.read()
        if len(data) > 30000 and data[:8] == b"\x89PNG\r\n\x1a\n":
            return data
        if len(data) > 30000 and data[:3] == b"\xff\xd8\xff":
            return data
    except Exception as exc:
        print("fail", page_url, exc)
    return None


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    posts = []

    for i, post_id in enumerate(IDS):
        page_url = f"https://www.facebook.com/PadreKelmon/posts/{post_id}/"
        mobile_url = f"https://m.facebook.com/PadreKelmon/posts/{post_id}/"
        dest = OUT_DIR / f"{post_id}.png"

        # Keep existing good screenshot if already large enough
        if dest.exists() and dest.stat().st_size > 80000:
            print(post_id, "keep existing", dest.stat().st_size)
        else:
            data = fetch_screenshot(mobile_url) or fetch_screenshot(page_url)
            if data:
                dest.write_bytes(data)
                print(post_id, "saved", len(data))
            else:
                print(post_id, "missing")
            if i < len(IDS) - 1:
                time.sleep(3)

        thumb = f"/facebook/{post_id}.png" if dest.exists() else f"/facebook/{post_id}.jpg"
        posts.append(
            {
                "id": post_id,
                "url": page_url,
                "embedUrl": (
                    "https://www.facebook.com/plugins/post.php?href="
                    + urllib.parse.quote(page_url, safe="")
                    + "&show_text=false&width=500"
                ),
                "thumbnail": thumb,
                "title": "Publicação no Facebook",
            }
        )

    DATA.write_text(json.dumps(posts, ensure_ascii=False, indent=2), encoding="utf-8")
    print("wrote", DATA)


if __name__ == "__main__":
    main()
