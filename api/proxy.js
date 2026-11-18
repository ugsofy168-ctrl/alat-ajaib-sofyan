const ALLOWED_HOSTS = new Set([
  'api.kie.ai',
  'kieai.redpandaai.co',
  'api.emix.ai'
]);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check so frontend auto-detects Vercel Proxy + Blob availability
  if (req.method === 'GET' && req.query && req.query.health === '1') {
    return res.status(200).json({
      ok: true,
      proxy: true,
      blobEnabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN)
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ code: 405, msg: 'Method not allowed' });
  }

  try {
    const { url, method = 'GET', apiKey = '', body = null } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ code: 400, msg: 'Parameter url wajib diisi.' });
    }

    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsed.hostname)) {
      return res.status(403).json({ code: 403, msg: 'Host API tidak diizinkan oleh proxy.' });
    }

    const headers = {};
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
    if (body !== null && method !== 'GET') headers['Content-Type'] = 'application/json';

    const upstream = await fetch(url, {
      method: method.toUpperCase(),
      headers,
      body: body !== null && method.toUpperCase() !== 'GET' ? JSON.stringify(body) : undefined
    });

    const text = await upstream.text();
    try {
      const json = JSON.parse(text);
      return res.status(upstream.status).json(json);
    } catch {
      return res.status(upstream.status).json({ code: upstream.status, msg: text || 'Upstream response non-JSON' });
    }
  } catch (err) {
    return res.status(500).json({ code: 500, msg: err?.message || 'Proxy gagal menghubungi server API.' });
  }
}
