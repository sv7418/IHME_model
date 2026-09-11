# Key Insights: reasons as insight cards

Rename the "Executive Summary" section to "Key Insights" and turn the ranked list of blocking reasons into a grid of clickable insight tiles.

## Rename

- Section label becomes **Key Insights** everywhere it appears: the sidebar, the section tab row above the journey, the page header, and the page title/meta on the analysis route.
- The underlying section id stays `summary`, so existing links and the `?section=` URLs keep working.

## Reason tiles

Replace the stacked rows with a responsive card grid (1 column on mobile, 2 on desktop). Each card keeps the current click-to-open drill-down behavior and shows:

- Rank badge and reason name, with a severity tint on the top reason.
- Patient count plus its share of the stage, in large type.
- The share bar (same "share of patients in this stage" scale as today).
- The existing one-line reason detail.
- A short **insight line** — derived from the data already on screen (top payer, top account/state, or TAT vs. expected for that reason) so it reconciles with the drawer.
- A "Drill down" button in the card footer.

Nothing else on the page changes: the three KPI cards, the "What this means" insight bar, the drawer, and the Draft Email action all stay as they are.

## Technical notes

- `src/lib/psp-sections.tsx`: change the `summary` label to "Key Insights".
- `src/routes/sense.tsx`: update head title/description strings that say "Patient Analysis"/"Executive Summary".
- `src/components/psp/pa-exec-summary.tsx`: swap the `<button>` list for a card grid; add a small helper that builds the per-reason insight sentence from `useStageView()` data (payers, accounts, geography already exposed on the view) — no new data files or business-logic changes.
