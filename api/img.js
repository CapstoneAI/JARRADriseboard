export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  let url = decodeURIComponent(req.query.url || "");
  if (!url) return res.status(400).end();
  
  const gateways = [
    "https://cloudflare-ipfs.com/ipfs/",
    "https://gateway.pinata.cloud/ipfs/",
    "https://ipfs.filebase.io/ipfs/",
  ];
  
  const hash = url.replace("https://ipfs.io/ipfs/", "").replace("http://ipfs.io/ipfs/", "");
  
  for (const gw of gateways) {
    try {
      const r = await fetch(gw + hash, { signal: AbortSignal.timeout(5000) });
      if (r.ok) {
        const ct = r.headers.get("content-type") || "image/png";
        if (ct.includes("image")) {
          const buf = await r.arrayBuffer();
          res.setHeader("Content-Type", ct);
          res.setHeader("Cache-Control", "public, max-age=86400");
          return res.end(Buffer.from(buf));
        }
      }
    } catch(e) { continue; }
  }
  res.status(404).end();
}
