# Consistent shell, Daily Summary, and a real PSP Utilization view

## 1. One consistent layout everywhere

Today `/journey` renders its own bare page (top bar + content) while `/sense` uses the app shell with the left pane. The journey page moves into the same shell.

- Rename the post-brand landing page to **Daily Summary** (title, sidebar entry, page metadata).
- Left pane is present on Daily Summary too, with the same nav as the analysis pages, and "Daily Summary" highlighted as the active item.
- Remove the inline section-tab strip and the "Switch brand" pill from the journey body — both already live in the left pane.

## 2. Left pane navigation

```text
Daily Summary
--- Analysis ---
Key Insights
Geography
Accounts
Payer
PSP Utilization
Decision Ledger
```

- **Specialty Pharmacy is removed** as a left-pane tab. Its data stays available inside the drill-down drawers (reason drawer keeps the SP distribution chart) — only the standalone tab goes.
- PSP Utilization stays in the left pane but is no longer a section inside Key Insights (see 4 and 5).

## 3. Daily Summary metrics

The three tracked metrics on the briefing banner become:

- **Persistency rate** — share of patients still on therapy, with WoW delta
- **Fulfilment rate** — share of enrolled patients with a shipment, with WoW delta
- **Time to ship** — median days from enrollment to first shipment, with WoW delta

All three are derived from existing journey-stage counts and TAT/WoW fields so the numbers reconcile with the journey tracker below. The rest of the page (journey tracker, alerts, utilization trend, patient map) is unchanged in position.

## 4. Key Insights layout

- Driver/reason tiles stack **vertically one per row** (full-width cards) instead of two per row, so each card can carry its rank, share bar and one-line insight with room to breathe.
- Above the tiles, Key Insights gets its **own three tabs: Geography · Accounts · Payer** — scoped to the current stage/reason filter. These are insight-level lenses, separate from the broader left-pane sections of the same name.
- PSP Utilization is dropped from the Key Insights scope entirely — it only makes sense at the aggregate level.

## 5. PSP Utilization page (rebuilt)

This page becomes a service-utilization view, not a staffing/performance view. Services covered: **FRM, Case Manager (Hub), Nurse Navigator, Copay / Savings Card, Free Goods, SP Services, Digital**.

Layout, top to bottom:

1. **Overall utilization by year** — grouped bar chart, one bar group per service, series per year, showing enrolled/served patients and the year-over-year direction.
2. **Utilization by state** — US choropleth with a **service dropdown** (All services, or any single service). Colour = utilization rate for the selected service; clicking a state opens the existing state drawer scoped to that service.
3. **Low-utilization alert cards** — 2–4 cards generated from the same data, calling out where a service is materially under-used (e.g. "Copay enrollment 22% in the Southwest vs 41% nationally — 130 patients paying full price"), each with the affected patient count and a Draft Email action wired to the existing dialog and Decision Ledger.

The current FRM/Case Manager/Nurse performance tables and person drawers are retired from this page; individual-person drill-downs remain reachable from the reason drawers.

## Technical notes

- `src/routes/journey.tsx` wraps its body in `AppShell` with a new `dailySummary` nav id; `src/lib/psp-sections.tsx` drops `sp` and keeps `roles` (relabelled "PSP Utilization") for the left pane, plus a separate insight-lens list (`geography | accounts | payer`) used only inside Key Insights.
- `src/components/psp/section-tabs.tsx` is removed from the journey page; the sidebar becomes the single nav.
- `src/lib/psp-journey-home.ts` gains persistency / fulfilment / time-to-ship metric builders replacing the current three briefing metrics.
- `src/components/psp/pa-exec-summary.tsx`: reason grid becomes a single-column stack, and gains an internal tab strip rendering the existing `PaGeography` / `PaAccounts` / `PaPayers` bodies under the active stage+reason filter.
- New `src/lib/psp-utilization.ts` with the seven service definitions, per-year totals, per-state rates and low-utilization alert derivation (same deterministic hash-seeded approach as the other mock modules).
- `src/components/psp/pa-roles.tsx` is replaced by a new `psp-utilization.tsx` (year bar chart via recharts, `UsChoropleth` with a service `Select`, alert cards). `pa-sp.tsx` route section is dropped.
- All styling uses existing semantic tokens; each route keeps its own `head()` metadata with the Daily Summary title updated.
