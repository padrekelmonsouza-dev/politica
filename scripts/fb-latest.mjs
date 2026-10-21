const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const urls = [
  "https://www.facebook.com/PadreKelmon",
  "https://www.facebook.com/PadreKelmon/photos_by",
  "https://mbasic.facebook.com/PadreKelmon",
  "https://m.facebook.com/PadreKelmon",
  "https://r.jina.ai/https://www.facebook.com/PadreKelmon",
  "https://r.jina.ai/https://mbasic.facebook.com/PadreKelmon",
];

function extract(text) {
  const numeric = [
    ...text.matchAll(/PadreKelmon\/posts\/(\d+)/g),
    ...text.matchAll(/fbid[=:](\d{10,})/g),
    ...text.matchAll(/story_fbid[=:](\d{10,})/g),
    ...text.matchAll(/\/posts\/(\d{10,})/g),
    ...text.matchAll(/multi_permalinks=(\d{10,})/g),
  ].map((m) => m[1]);
  const pfbid = [...text.matchAll(/posts\/(pfbid[A-Za-z0-9]+)/g)].map((m) => m[1]);
  return {
    numeric: [...new Set(numeric)],
    pfbid: [...new Set(pfbid)],
  };
}

for (const url of urls) {
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "pt-BR,pt;q=0.9", Accept: "text/html,text/plain,*/*" },
      redirect: "follow",
    });
    const t = await r.text();
    const ids = extract(t);
    console.log("\n", url.slice(0, 70), r.status, t.length);
    console.log(" numeric", ids.numeric.slice(0, 8));
    console.log(" pfbid", ids.pfbid.slice(0, 8));
  } catch (e) {
    console.log("\n", url.slice(0, 70), "ERR", e.message);
  }
}
