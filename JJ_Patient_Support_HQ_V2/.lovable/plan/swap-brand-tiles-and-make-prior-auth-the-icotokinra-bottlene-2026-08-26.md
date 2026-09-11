# Swap brand tiles and make prior auth the ICOTOKINRA bottleneck

## What changes

1. **Tile order on the landing page** — ICOTOKINRA appears first, TREMFYA second. The landing page renders tiles straight from the brand list, so reordering that list swaps the tiles.

2. **ICOTOKINRA Daily Summary story** — prior auth becomes the flagged bottleneck instead of benefit investigation:
   - Prior auth: flagged, average turnaround raised well above its 5-day target (about 9 days) with a larger week-over-week increase, so it reads clearly as "higher than median time".
   - Benefit investigation: unflagged and brought back to normal (average turnaround at or under its 3-day target, small week-over-week move).

## Knock-on effects (automatic, no extra work)

The morning briefing narrative, the alerts (rail and cards), and the "time to ship" metric are all derived from the stage list, so they will retitle themselves to prior auth for ICOTOKINRA once the stage numbers change. Both brands then tell a prior-auth story, which matches the demo's main deep-dive path (prior auth → state → key barriers).

## Technical detail

Single file: `src/lib/psp-brand.tsx` — reorder the `brands` array and edit the ICOTOKINRA `prior-auth` and `benefit-check` stage entries (`flagged`, `avgTat`, `wow`). No component or layout changes needed.
