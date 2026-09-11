# Running this app locally

Verified working with Node 22 and npm 10 (Vite 8 dev server + SSR, and a full production build).

## Quick start

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 8080
```

Then open http://127.0.0.1:8080/

Production build / preview:

```sh
npm run build
npx vite preview
```

## Two gotchas

**1. Use `npm`, not `bun`, unless you are inside Lovable.**
`bun.lock` pins every tarball to Lovable's private registry mirror
(`europe-west4-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache`), which returns
403 outside their sandbox. `package-lock.json` (committed here) resolves the
same dependency versions from public npm instead. All packages, including
`@lovable.dev/vite-tanstack-config`, are published publicly.

**2. `--host 127.0.0.1` may be required.**
`@lovable.dev/vite-tanstack-config` defaults to binding `::` (IPv6) on port
8080. On hosts without IPv6 that fails with
`listen EAFNOSUPPORT: address family not supported :::8080`. Passing an IPv4
host works around it. If your machine has IPv6, plain `npm run dev` is fine.

## Known limitation: brand logos 404

The three images are not real files — they are Lovable asset manifests:

- `src/assets/jnj-logo.png.asset.json`
- `src/assets/tremfya.png.asset.json`
- `src/assets/icotokinra.png.asset.json`

Each holds a `url` like `/__l5e/assets-v1/<id>/<name>.png`, served by Lovable's
CDN. The PNG bytes were never in the export, so outside Lovable those three
requests 404 and you get broken-image placeholders in the top bar and on the
brand-select cards. Everything else — routing, SSR, charts, maps, drawers —
works. To fix, drop real PNGs into `src/assets/` and import those files
directly instead of the `.asset.json` manifests.

## What the app is

A TanStack Start (React 19 + Vite + Tailwind v4 + shadcn/ui) patient-support
workbench, fully driven by generated mock data in `src/lib/psp-*.ts`. No
backend or API keys needed.

Routes:

| Route      | Purpose                                                      |
| ---------- | ------------------------------------------------------------ |
| `/`        | Brand select — TREMFYA (PsO) or ICOTOKINRA (UC)               |
| `/journey` | Daily Summary — KPIs, journey tracker, alerts, patient map    |
| `/sense`   | Key Barriers, Geography, Accounts, Payer, Patients, PSP Utilization, Decision Ledger |

Pick a brand on `/` first: the other two routes read the choice from
`localStorage["psp.brand"]` and bounce back to `/` if it is not set, so hitting
`/journey` directly in a fresh browser just shows the landing page.
