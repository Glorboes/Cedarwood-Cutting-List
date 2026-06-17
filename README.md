# Cedarwood — Cutting List Part Search (Main Flats)

A single-file, mobile-first web app for **My Cabinet Guy**'s Cedarwood Development.
Search the 140-part cutting list **both ways** — by name to get the size, or by size
to find the part. Reads live from a published Google Sheet; it only ever **reads**,
never writes back.

## Files
- `index.html` — the whole app (vanilla JS, no frameworks, no build step).
- `cedarwood_parts.csv` — snapshot of the 140 parts (also embedded in `index.html`
  as an offline fallback, so the list still works on site with no signal).

## Data source
Published Google Sheet CSV (**Main Flats Cutting List V2**) with columns:

```
part_name, length_mm, width_mm, qty, material, edging, edge_l, edge_w, room, remarks
```

`edging` is the edge-banding material; `edge_l` / `edge_w` are how many of the two
**long** / **short** edges get banded (0–2). Each card shows an **Edge** line
(e.g. "Dumblane · 2 long edges + 2 short edges", or "None"). Columns are matched by
name, so adding more columns or re-ordering them won't break the app.

The live URL is set in `index.html` (search for `CSV_URL`, near the bottom). You can
also override it **without editing the file**:
- tap the **⚙** button in the app and paste a new published-CSV URL (saved on that
  device via `localStorage`), or
- add `?csv=<url>` to the page address.

To (re)publish the sheet: **File ▸ Share ▸ Publish to web ▸ pick the sheet ▸ CSV**.
Edit the sheet and the app updates live — no redeploy needed. Tap **↻** to refresh.

## How the search works
The single search box detects what you type:

| You type | What you get |
|---|---|
| `oven door` | Oven Door — **815 × 596**, qty, material, room |
| `drawer` | every drawer part (each size shown separately) |
| `815` | all parts with **815** in either dimension |
| `815 596` or `815 x 596` | the exact part at those dimensions |
| `drawer 524` | drawer parts that are **524** in a dimension |

- Case-insensitive; partial matches work.
- Numbers → size search; words → name/material/remarks search; mix them freely.
- The matched dimension is highlighted in each result card.
- **Duplicate part names are never merged** — every variant and its exact size shows.

Filters: **All / Kitchen / Bedroom** chips plus an optional **material** filter; both
combine with whatever is in the search box.

## Deploy to GitHub Pages
This is a static site — just host `index.html`.

**Option A — add to the existing site-map repo** (`Cedarwood-Site-map`):
put this folder in the repo so it's served at
`https://glorboes.github.io/Cedarwood-Site-map/cedarwood-cutlist/`.

**Option B — its own repo:** create a repo, drop `index.html` at the root, then
enable **Settings ▸ Pages ▸ Deploy from branch ▸ main / root**.

No login, no backend, no database. Mobile browsers can "Add to Home Screen" for an
app-like icon.
