const HELIUS_KEY = '3c94ad1c-0497-4a35-ac0b-b32e2adc108b';
const CACHE = {};
const TTL = 5 * 60 * 1000;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const mint = req.query.mint;
  if (!mint) return res.status(400).json({ error: 'no mint' });

  const now = Date.now();
  if (CACHE[mint] && (now - CACHE[mint].ts) < TTL)
    return res.json(CACHE[mint].data);

  let allAccounts = [];
  let cursor = null;

  try {
    while (true) {
      const body = {
        jsonrpc: '2.0', id: 1,
        method: 'getTokenAccounts',
        params: {
          mint,
          limit: 1000,
          displayOptions: { showZeroBalance: false },
          ...(cursor ? { cursor } : {})
        }
      };
      const r = await fetch(
        `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      );
      const data = await r.json();
      const accounts = data?.result?.token_accounts || [];
      allAccounts = allAccounts.concat(accounts);
      cursor = data?.result?.cursor;
      if (!cursor || accounts.length < 1000) break;
    }

    const result = {
      ok: true,
      total: allAccounts.length,
      holders: allAccounts.map(a => ({
        wallet: a.owner,
        amount: Number(a.amount),
        delegated: Number(a.delegated_amount || 0),
        frozen: a.frozen || false
      }))
    };

    CACHE[mint] = { data: result, ts: now };
    res.json(result);
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
