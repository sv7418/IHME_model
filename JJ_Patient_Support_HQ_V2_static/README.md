# Static build — no Node, no npm required

A prerendered static snapshot of `../JJ_Patient_Support_HQ_V2`. It needs only a
static file server — **Python is enough**, which you already have for the rest
of this repo.

## Run it

```sh
cd JJ_Patient_Support_HQ_V2_static
python3 -m http.server 8080
```

Then open **http://localhost:8080/**

On Windows, use `py -m http.server 8080`.

## Why this works

The app makes no server calls at all — no server functions, no API routes, no
data fetching. Every number on screen is generated client-side by the mock-data
modules in `src/lib/psp-*.ts`. So the server-rendered HTML plus the client
bundle is the whole app; nothing is lost by serving it as static files.

Prerendered entry points:

| File | URL |
| --- | --- |
| `index.html` | `/` — brand select |
| `journey/index.html` | `/journey` — Daily Summary |
| `sense/index.html` | `/sense` — Key Barriers and the other tabs |

Once the page hydrates, the TanStack router takes over and all in-app
navigation (tabs, drill-downs, drawers, filters) happens client-side.

## Important: serve it, don't double-click it

Opening `index.html` straight from the filesystem (`file://`) shows a blank
page — the asset paths are absolute (`/assets/...`), which `file://` cannot
resolve. You must serve it over HTTP with the command above.

## Caveats

- **The three logos still 404** — they were never in the Lovable export. See
  `../JJ_Patient_Support_HQ_V2/RUNNING_LOCALLY.md`.
- **It is a snapshot.** The "Data through 09/08/2026" header and the date-range
  defaults were baked in at build time. Editing files here does nothing; change
  the source and regenerate.
- **Committed build artifact**, here to get the app running without a Node
  toolchain. Delete it once you have Node installed.

## Regenerating it

Needs Node 22 once, on whatever machine does the build:

```sh
cd ../JJ_Patient_Support_HQ_V2
npm install
NITRO_PRESET=node-server npm run build
node .output/server/index.mjs &          # serves on :3000

cd ../JJ_Patient_Support_HQ_V2_static
cp -r ../JJ_Patient_Support_HQ_V2/.output/public/* .
mkdir -p journey sense
curl -s http://localhost:3000/        -o index.html
curl -s http://localhost:3000/journey -o journey/index.html
curl -s http://localhost:3000/sense   -o sense/index.html
```
