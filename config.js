/* WxPilot configuration — the one file to edit when deploying your own copy.

   The Client ID is public (it's just part of the Webex authorize URL), so it's
   safe here. The Client Secret is NOT here — it lives only as an environment
   variable on the token proxy (see proxy/server.js), because anything in this
   repo is readable by anyone. */

// Webex Integration created for WxPilot at developer.webex.com → My Webex Apps
window.WXPILOT_CLIENT_ID = 'C8f0824f5ee6234fccfd175820dfd7ff5754f243dc682ea4788d8a7f11bfcd935';

// Must exactly match a Redirect URI on that Integration
window.WXPILOT_REDIRECT_URI = 'https://krich5.github.io/WxPilot/callback.html';

// Base URL of the deployed token proxy (proxy/ folder), no trailing slash
window.WXPILOT_PROXY_BASE = 'https://wxpilot-proxy-production.up.railway.app';

// WxCC data center for the tenant: us1, eu1, eu2, anz1, ca1
window.WXPILOT_DATA_CENTER = 'us1';

// Scopes requested at sign-in. The Integration must have these checked too.
window.WXPILOT_OAUTH_SCOPES = [
  'spark:people_read',   // /people/me — to look up the signed-in user's org
  'cjp:config_read',     // read global variables, business hours, overrides, holiday lists
  'cjp:config_write'     // save changes
].join(' ');
