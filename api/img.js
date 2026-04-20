export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const url = req.query.url;
  if (!url) return res.status(400).end();
  try {
    const r = await fetch(url);
    const buf = await r.arrayBuffer();
    res.setHeader("Content-Type", r.headers.get("content-type") || "image/png");
    res.send(Buffer.from(buf));
  } catch(e) {
    res.status(500).end();
  }
}
