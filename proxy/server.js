// WxPilot token proxy.
//
// The only job of this service is to hold the Webex Integration's Client
// Secret and swap a sign-in code for an access token. Webex requires the
// secret for that exchange, and the WxPilot page itself is public, so the
// secret can't live there. Every other API call goes straight from the
// browser to Webex/WxCC.

const express = require('express');

const PORT = process.env.PORT || 8787;
const {
  WEBEX_CLIENT_ID,
  WEBEX_CLIENT_SECRET,
  WEBEX_REDIRECT_URI,
  // Only pages from this origin may call the proxy
  ALLOWED_ORIGIN = 'https://krich5.github.io',
} = process.env;

const app = express();

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.set('Vary', 'Origin');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

app.use(express.json());

app.get('/', (req, res) => res.json({ service: 'wxpilot-proxy', ok: true }));

app.post('/token', async (req, res) => {
  if (!WEBEX_CLIENT_ID || !WEBEX_CLIENT_SECRET || !WEBEX_REDIRECT_URI) {
    return res.status(500).json({ error: 'Proxy is missing WEBEX_CLIENT_ID/WEBEX_CLIENT_SECRET/WEBEX_REDIRECT_URI' });
  }

  const code = ((req.body && req.body.code) || '').trim();
  if (!code) return res.status(400).json({ error: 'Missing code' });

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: WEBEX_CLIENT_ID,
    client_secret: WEBEX_CLIENT_SECRET,
    code,
    redirect_uri: WEBEX_REDIRECT_URI,
  });

  try {
    const upstream = await fetch('https://webexapis.com/v1/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: params.toString(),
    });
    const text = await upstream.text();
    res.status(upstream.status).set('Content-Type', 'application/json').send(text);
  } catch (err) {
    res.status(502).json({ error: 'Could not reach Webex: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`WxPilot proxy listening on port ${PORT}`);
});
