export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const url = req.query.url;
  if (!url) return res.status(400).end();
  try {
    const r = await fetch(decodeURIComponent(url));
    const buf = await r.arrayBuffer();
    const ct = r.headers.get("content-type") || "image/png";
    res.setHeader("Content-Type", ct);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.end(Buffer.from(buf));
  } catch(e) {
    res.status(500).end();
  }
}
