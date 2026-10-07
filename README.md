<p align="center"><img src="assets/images/WxPilot.png" alt="WxPilot" width="520"></p>

# WxPilot

A supervisor control panel for Webex Contact Center (WxCC). Supervisors can flip toggles and change the settings their call flows depend on, without going into Control Hub:

- **Global variables:** on/off switches and text values, such as an emergency-closure flag or a greeting message.
- **Business hours:** the weekly open/close schedule.
- **Overrides:** one-off schedule changes, such as closing early or opening on a holiday.
- **Holiday lists:** view-only.

WxPilot runs in two places, using the same widget:

1. **Standalone web page / mobile app.** It signs in with Webex and works on a phone. Supervisors can add it to their home screen and use it like an app.
2. **Agent Desktop tab.** It adds a **WxPilot** page to the Supervisor Desktop navigation.

<!-- Optional: add screenshots, e.g. ![WxPilot on mobile](screenshot-mobile.png) -->

## What supervisors can do

| Item | What they can change |
|------|----------------------|
| **Boolean global variables** | Turn a switch on or off. Changes are saved straight away. |
| **String global variables** | Edit the value inline and save |
| **Override hours** | Add, edit and remove override windows (name, start and end date/time). Mark each window as **working** (open) or **not working** (closed). Switch between override sets with a dropdown. |
| **Override message** | Edit the message variable that goes with an override, such as "We're closed early today" |
| **Business hours** | Edit the shifts for each day of the week. Switch between business hours schedules with a dropdown. |
| **Holiday lists** | Read-only. Shown as a link on the business hours card that expands to list the holidays and their dates. |

Every change is saved straight to WxCC through the Config API, so call flows that read these values pick up the change on their next run.

## Access and permissions

WxPilot doesn't have its own user list or roles. **It acts as the signed-in person, with that person's Webex token,** so it can only see and change what their WxCC role allows:

- A supervisor whose role can edit global variables and business hours gets full control.
- If their role can't read or edit something, the WxCC API refuses the request and WxPilot shows the error. It can't be used to get around Control Hub permissions.
- Only **active** global variables are shown.

To control *which* items a supervisor sees, set up the Desktop Layout version with a fixed list of variables (see [Choosing what's shown](#choosing-whats-shown)). You can then give different teams different layouts.

## Repo contents

| File | Purpose |
|------|---------|
| `controls.js` | The widget itself: a plain Web Component, `<global-variable-manager>`, with no framework or build step |
| `index.html` | The standalone page: sign-in screen, session handling, and automatic scaling to fit phone screens |
| `callback.html` | Where Webex sends the user after sign-in. It swaps the sign-in code for a token through the proxy, then looks up the user's org |
| `config.js` | **The one file to edit:** Client ID, redirect URI, proxy URL, data center and scopes |
| `proxy/` | A tiny Node/Express service (deployed to Railway) that holds the Integration's Client Secret and does the token exchange. Nothing else goes through it |
| `manifest.json` | Lets the page be installed on a home screen (name, icons, standalone display) |
| `assets/images/` | WxPilot logo (`WxPilot.png`) and icon (`WxPilot_icon.png`, plus generated 192px, maskable and Apple touch sizes), Webex logo, background |
| `Desktop_Layout_WxPilot.json` | Sample Desktop Layout that adds the WxPilot page to the Supervisor and Supervisor-Agent personas |

## Option 1: Standalone web / mobile app

The page runs on **GitHub Pages**, with its own **Webex Integration**, so it doesn't depend on any other app's sign-in.

### How sign-in works

```
Browser (GitHub Pages)                 Proxy (Railway)                 Webex
──────────────────────                 ───────────────                 ─────
index.html  ── Sign in with Webex ─────────────────────────────────▶  /v1/authorize
callback.html ◀──────────────────────── ?code=…&state=… ───────────────┘
callback.html ── POST /token {code} ──▶  adds Client Secret ───────▶  /v1/access_token
callback.html ◀── access_token ────────┘
callback.html ── GET /v1/people/me ────────────────────────────────▶  (gets orgId)
index.html  ── loads controls.js and calls the WxCC APIs directly ─▶  api.wxcc-{dc}.cisco.com
```

1. **Sign in.** **Sign in with Webex** sends the supervisor to Webex's login page, with a random `state` value saved for the callback to check.
2. **Token exchange.** Webex redirects back to `callback.html` with a one-time code. The page sends the code to the proxy. The proxy adds the Client Secret, swaps the code for an access token, and sends the token back.
3. **Find the org.** `callback.html` calls `/v1/people/me` to get the user's org ID and saves the session to `localStorage`. The keys are prefixed `wxpilot.`, so the session isn't shared with other apps hosted on the same domain.
4. **Load the widget.** `index.html` mounts the widget, which then **auto-loads**:
   - every active global variable,
   - the first override set,
   - the first business hours schedule,
   - with dropdowns to switch to other override sets and schedules.
5. **Phone screens.** On narrow screens the widget is **scaled down to fit** the phone width.
6. **Sign out.** **Sign out** clears the session from this device.

### Setup

**1. Create the Webex Integration**

At [developer.webex.com](https://developer.webex.com) → **My Webex Apps** → **Create a New App** → **Integration**:

- **Redirect URI:** `https://krich5.github.io/WxPilot/callback.html`, or your own Pages URL plus `/callback.html`
- **Scopes:** `spark:people_read`, `cjp:config_read`, `cjp:config_write`

Save the **Client ID** and **Client Secret**.

**2. Deploy the proxy**

Deploy the `proxy/` folder as its own Railway service (or any Node 18+ host), with these variables:

| Variable | Value |
|----------|-------|
| `WEBEX_CLIENT_ID` | The Integration's Client ID |
| `WEBEX_CLIENT_SECRET` | The Integration's Client Secret |
| `WEBEX_REDIRECT_URI` | Exactly the Redirect URI from step 1 |
| `ALLOWED_ORIGIN` | The origin of the page, e.g. `https://krich5.github.io` (this is the default) |

Opening the service URL in a browser should return `{"service":"wxpilot-proxy","ok":true}`.

**3. Fill in `config.js`**

```js
window.WXPILOT_CLIENT_ID    = '<Client ID>';
window.WXPILOT_REDIRECT_URI = 'https://krich5.github.io/WxPilot/callback.html';
window.WXPILOT_PROXY_BASE   = 'https://<your-proxy>.up.railway.app';
window.WXPILOT_DATA_CENTER  = 'us1';   // us1, eu1, eu2, anz1, ca1
```

> Only the Client ID goes in `config.js`. It's public by design. **Never commit the Client Secret.** It belongs only in the proxy's environment variables.

**4. Turn on GitHub Pages**

Go to repo **Settings → Pages → Deploy from a branch → `main` / root**. Then open `https://krich5.github.io/WxPilot/`, sign in, and on a phone use **Add to Home Screen**.

## Option 2: Agent Desktop tab

### Host the script

`controls.js` must be reachable over HTTPS. With GitHub Pages turned on for this repo, it's served at:

```
https://krich5.github.io/WxPilot/controls.js
```

### Add it to your Desktop Layout

Add a navigation page to the `supervisor` and/or `supervisorAgent` persona. The desktop already holds the supervisor's token, org and data center, so no separate sign-in is needed:

```json
{
  "nav": {
    "label": "WxPilot",
    "icon": "https://krich5.github.io/WxPilot/assets/images/WxPilot_icon.png",
    "iconType": "other",
    "navigateTo": "WxPilot",
    "align": "top"
  },
  "page": {
    "id": "WxPilot",
    "widgets": {
      "comp1": {
        "comp": "global-variable-manager",
        "script": "https://krich5.github.io/WxPilot/controls.js",
        "attributes": {
          "token": "$STORE.auth.accessToken",
          "org-id": "$STORE.agent.orgId",
          "data-center": "$STORE.app.datacenter"
        }
      }
    },
    "layout": {
      "areas": [["comp1"]],
      "size": { "cols": [1], "rows": [1] }
    }
  }
}
```

> A complete sample is included: [`Desktop_Layout_WxPilot.json`](Desktop_Layout_WxPilot.json)

Then upload the layout in **Control Hub → Contact Center → Desktop Layouts** and assign it to your supervisor teams.

## Widget attributes

### Required

| Attribute | Description |
|-----------|-------------|
| `token` | Webex access token used for every API call |
| `org-id` | WxCC organization ID (plain UUID) |
| `data-center` | `us1`, `eu1`, `eu2`, `anz1` or `ca1`. Defaults to `us1` |

### Choosing what's shown

With no other attributes, the widget **auto-loads everything** the user can access. To show a fixed set instead, list the items. Setting any variable attribute turns off auto-load for variables.

| Attribute | Description |
|-----------|-------------|
| `variable_boolean_1_name` … `variable_boolean_10_name` | Label for an on/off variable card |
| `variable_boolean_1_id` … `variable_boolean_10_id` | Global variable ID for that card |
| `variable_string_1_name` … `variable_string_10_name` | Label for a text variable card |
| `variable_string_1_id` … `variable_string_10_id` | Global variable ID for that card |
| `override_hours_id` | Override set to show |
| `override_message_variable_id` | Variable that holds the override message, shown on the override card instead of as its own card |
| `business-hours-id` | Business hours schedule to show |
| `auto-load` | `true`/`false`: load all active global variables |
| `auto-load-overrides` | `true`/`false`: auto-pick the first override set |
| `auto-load-business-hours` | `true`/`false`: auto-pick the first business hours schedule |
| `theme` | `light` or `dark`. If not set, it follows the desktop or system theme |

Example: a locked-down card set for one team:

```json
"attributes": {
  "token": "$STORE.auth.accessToken",
  "org-id": "$STORE.agent.orgId",
  "data-center": "$STORE.app.datacenter",
  "variable_boolean_1_name": "Emergency Closure",
  "variable_boolean_1_id": "<global-variable-id>",
  "variable_string_1_name": "Emergency Message",
  "variable_string_1_id": "<global-variable-id>",
  "override_hours_id": "<override-id>",
  "override_message_variable_id": "<global-variable-id>",
  "business-hours-id": "<business-hours-id>"
}
```

## WxCC APIs used

Every call goes to `https://api.wxcc-{dc}.cisco.com/organization/{orgId}/...`:

| Resource | Read | Write |
|----------|------|-------|
| Global variables | `GET v2/cad-variable`, `GET cad-variable/{id}` | `PUT cad-variable/{id}` |
| Overrides | `GET v2/overrides`, `GET overrides/{id}` | `PUT overrides/{id}` |
| Business hours | `GET v2/business-hours`, `GET business-hours/{id}` | `PUT business-hours/{id}` |
| Holiday lists | `GET v2/holiday-list` | None (read-only) |

## Known limitations

- **No silent token refresh.** When the Webex access token expires, the supervisor signs in again.
- **Sign-out is local only.** It forgets the token on this device, but the token stays valid at Webex until it expires.
- **Phone layout is scaled, not redesigned.** On small screens the desktop layout is shrunk to fit, so text is smaller.
- **Holiday lists can't be edited.** They're shown for reference only.

## License

See [LICENSE](LICENSE).
