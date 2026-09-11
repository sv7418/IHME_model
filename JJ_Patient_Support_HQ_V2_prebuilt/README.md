# Prebuilt bundle — run with no `npm install`

This is a compiled, self-contained build of `../JJ_Patient_Support_HQ_V2`.
Every dependency is already bundled, so it needs **no `npm install`, no network
access, and no registry credentials**.

## Run it

```sh
cd JJ_Patient_Support_HQ_V2_prebuilt
node server/index.mjs
```

It prints the link:

```
➜ Listening on: http://localhost:3000/
```

To choose the port/host:

```sh
PORT=8080 HOST=127.0.0.1 node server/index.mjs
```

Pick a brand on the landing page first — `/journey` and `/sense` read the brand
from `localStorage["psp.brand"]` and redirect back to `/` until one is set.

## Requirements

Node 22 only — nothing else. Verified on Node 22.22. (The source project also
needs npm and a working registry; this bundle does not.)

## Caveats

- **The three logos still 404.** They were never in the export — see
  `../JJ_Patient_Support_HQ_V2/RUNNING_LOCALLY.md`. Everything else renders:
  routing, SSR, Recharts charts, the US choropleth, drawers, filters.
- **This is a build artifact, committed only as a convenience** for machines
  where `npm install` is blocked. Editing code here does nothing — change the
  source in `../JJ_Patient_Support_HQ_V2` and rebuild.

## Regenerating it

```sh
cd ../JJ_Patient_Support_HQ_V2
npm install
NITRO_PRESET=node-server npm run build
cp -r .output/* ../JJ_Patient_Support_HQ_V2_prebuilt/
```

`NITRO_PRESET=node-server` matters: the project's default preset is
`cloudflare-module`, whose output needs `wrangler` rather than plain `node`.
