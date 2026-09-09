# Trendy local mirror

This is a local, offline-oriented capture of `https://trendy.on-forge.com`.

## Run

```powershell
npm start
```

Then open `http://127.0.0.1:4187/en`.

The custom server supports byte ranges so the mirrored MP4 videos can seek and play normally. Internal page links use full-page navigation so every captured route works without the original Next.js server.

## Contents

- `mirror/pages/` — captured HTML for the English home page and all discovered project pages
- `mirror/assets/` — JavaScript, CSS, fonts, images, icons, and videos
- `mirror/manifest.json` — route map, source URLs, byte sizes, capture time, and any failures

External social-media and booking links remain external because they are links to other services, not assets hosted by the Trendy site.

See `CONTENT_INVENTORY.md` for a human-readable summary of the captured site and `mirror/manifest.json` for the exact machine-readable route and asset inventory.
