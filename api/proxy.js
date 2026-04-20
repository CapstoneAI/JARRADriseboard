export default async function handler(req, res) {
  const path = req.query.path || "";
  const url = `https://public.rise.rich${path}`;
  const r = await fetch(url, { headers: { "x-api-key": "fkv2e7h3c4l4k7y5" } });
  const data = await r.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(data);
}
