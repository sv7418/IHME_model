# Overlapping reasons, ranked — plus pies, fill-time histograms, and a cleaner map click

## 1. Reasons overlap, so stop forcing them to sum

Today the four prior-auth reasons are apportioned to add up to the stage total (678), and the Southwest lens sits below as a "supplemental" row. That framing goes away.

- All reasons — including Southwest access concentration (509 patients) — render in one ranked list, same visual format, sorted by patient count descending. Southwest lands on top.
- Each row's percentage reads "% of patients in stage" and the header subtitle changes to say patients can carry more than one reason, so shares intentionally exceed 100%.
- Reason counts become independent (each sized on its own weight against the stage total) rather than apportioned to sum, so the existing counts for step therapy / LMN / appeal / incomplete docs stay in the same ballpark but no longer get squeezed.

## 2. Southwest drill-down recommends a capacity shift

The Southwest insight becomes: the region holds 509 of 678 patients with the slowest regional-plan turnaround and the thinnest field/hub coverage, while the Southeast pods carry materially fewer patients per case manager. The recommendation is to reassign hub capacity from the Southeast pods into the Southwest pods, and the primary email goes to the Hub Supervisor (secondary: Regional Business Director, Payer Contracting).

## 3. Email drafts get a generic label

Every insight/action in the reason drawer shows a "Draft email" button with the recipient named underneath (e.g. "to Hub Supervisor"), instead of a differently-worded button per action. Each reason's action set is re-checked so the routing is logical:

- Southwest concentration -> Hub Supervisor (capacity shift), RBD, Payer Contracting
- Step therapy -> Payer Contracting, FRM
- LMN delay -> FRM, Hub Supervisor
- Incomplete docs -> Hub Supervisor, FRM
- Appeal -> Payer Contracting, Case Management Lead

## 4. Pie charts where a share reads better than a bar

Age distribution and urban-vs-rural splits render as donut/pie charts (with a legend showing counts and %) in both the state drawer and the account drawer. Payer mix and account lists stay as bar lists.

## 5. Time-to-fill histograms in three drawers

A shared histogram component shows day-buckets (0-3, 4-7, 8-14, 15-21, 22-30, 30+) with two overlaid series: the entity's overall average and the current reason-filtered cohort, so the drag from the selected blocker is visible.

- Account drawer: time to fill for that account, filtered reason vs account average
- Payer drawer: time to fill for that payer, filtered reason vs payer average
- Specialty pharmacy: time to fill at that SP, filtered vs average

Distributions are generated deterministically from the entity name plus its known average days, so they are stable across renders and their mean reconciles with the average already displayed.

## 6. Geography map click opens the drawer only

Clicking a state on the choropleth opens the state drill-down drawer directly. The state table on the right keeps its own current behaviour and is no longer driven by the map selection.

## Technical notes

- Reason sizing and the Southwest row move out of `supplementalReasons` into the main `reasons` array in `src/lib/psp-stage-view.tsx`; the apportion-to-total step is dropped and ordering is by patient count. `pa-exec-summary.tsx` loses the supplemental block.
- `src/lib/psp-reason-actions.ts` gains a Southwest capacity-shift brief and uniform `Draft email` labels with a `recipientLabel` field; `reason-drawer.tsx` renders label + recipient.
- New `PieSplit` and `FillHistogram` components in `src/components/psp/drill-bits.tsx`; new seeded `fillTimeHistogram(entityKey, avgDays, reasonKey)` in `src/lib/psp-drill-data.ts`.
- `pa-geography.tsx`: `onSelect` from `UsChoropleth` sets only the drawer state.
- `psp-page-email.ts` summary section updated for the non-summing share language.
