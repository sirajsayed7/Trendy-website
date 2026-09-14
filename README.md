# Trendy creative studio website

This repository contains Trendy's redesigned, responsive studio website. Its desktop homepage follows the approved art direction exactly, while the interface below it stays black and white and photography and film remain in full color. The four featured sectors on the right open interactive project drawers.

## Run

```powershell
npm start
```

Then open `http://127.0.0.1:4187/en`.

The custom Node server has no package dependencies and supports byte ranges so the local MP4 videos can seek and play normally.

## Contents

- `index.html`, `styles.css`, `app.js` — the new responsive homepage
- `assets/hero-doha.png` — the art-directed Doha hero image
- `mirror/assets/` — the original locally stored photography, fonts, and films used by the redesign
- `mirror/pages/` and `mirror/manifest.json` — the preserved source-site capture and route inventory

The original captured project routes remain available through the server. External contact and social links remain external by design.

See `CONTENT_INVENTORY.md` for a human-readable summary of the captured site and `mirror/manifest.json` for the exact machine-readable route and asset inventory.
