export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  const path = req.url.replace("/api/proxy", "");
  const url = "https://public.rise.rich" + path;
  try {
    const r = await fetch(url, { headers: { "x-api-key": "fkv2e7h3c4l4k7y5" } });
    const data = await r.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
