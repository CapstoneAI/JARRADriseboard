const cache = {};
const CACHE_TTL = 5 * 60 * 1000;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const path = req.query.path;
  if (!path) return res.status(400).json({ ok: false, error: "no path" });

  const now = Date.now();
  if (cache[path] && (now - cache[path].ts) < CACHE_TTL) {
    return res.json(cache[path].data);
  }

  const url = "https://public.rise.rich" + path;
  try {
    const r = await fetch(url, { headers: { "x-api-key": "fkv2e7h3c4l4k7y5" } });
    const data = await r.json();
    cache[path] = { data, ts: now };
    res.json(data);
  } catch(e) {
    if (cache[path]) return res.json(cache[path].data);
    res.status(500).json({ ok: false, error: e.message });
  }
}
