# PSP Utilization: service registrations for the filtered patient group

Today the PSP Utilization tab shows brand-level, multi-year adoption rates that ignore the stage/reason filter. It becomes a view of the *current* filtered cohort: how many of those patients are registered in each support service, how much service effort they received, and where that coverage is strong or weak geographically.

## 1. Registrations reconcile with the filtered cohort

The page reads the same stage/reason view model the other tabs use, so the header count (e.g. "Prior Authorization · 245 patients") is the denominator for everything on the page.

For each service — Hub (Case Manager), FRM, Nurse Navigator, Copay / Savings Card, Bridge / Free Goods, SP Services, Digital — we derive a registered patient count as a share of that exact cohort, so no service can exceed the cohort and each count is a strict subset:

- Hub enrollment is near-universal for enrolled stages and is the upper bound for the others.
- Copay is capped by the commercial share of the cohort's payer mix (already in the payer data).
- Bridge / Free Goods is capped by the at-risk / uninsured slice.
- Nurse Navigator and Digital are capped by the hub-enrolled count.
- Shares vary by stage (e.g. more bridge and copay at Prior Authorization, more nurse at Training) and by reason filter.

## 2. Layout, top to bottom

1. **Metric tiles** (one row): patients in cohort, hub-registered %, avg FRM calls per patient, avg Case Manager calls per patient, avg Nurse Navigator touchpoints — each with the team average for comparison.
2. **Current registrations bar chart**: one bar per service showing registered patients out of the cohort, with the % of cohort labelled. Stays a bar chart.
3. **Utilization by state choropleth**: with the existing service dropdown. Values are the share of that state's cohort patients registered in the selected service (blended for "All services"), so the map updates instantly on dropdown change. Clicking a state keeps the current drawer with the per-service breakdown, now scoped to the filtered cohort.
4. **Low-utilization alert cards**: unchanged in shape, but computed from the cohort-scoped rates, so the patient counts they cite reconcile with the cohort.

The multi-year grouped bar chart is retired from this page; the year-over-year direction is kept as a small "vs last year" delta on each service in the registrations chart tooltip.

## Technical notes

- `PspUtilization` consumes `useStageView()` for `patients`, `stageId`, `reasonId`, payer mix and risk split; `psp-utilization.ts` functions gain a cohort argument instead of taking only `Brand`.
- New builders in `src/lib/psp-utilization.ts`: `buildCohortRegistrations(view)` (per-service registered counts with the caps above), `buildContactMetrics(view)` (avg FRM / CM / nurse calls per patient vs team average, derived from the existing FRM and case-manager rosters in the stage view), and a reworked `buildStateUtilization(view, service)` keyed off the stage view's per-state patient counts.
- `buildUtilizationAlerts` takes the cohort rates so `patientsAffected` never exceeds the cohort.
- The state drawer and Draft Email / Decision Ledger wiring stay as they are; only the numbers feeding them change.
- Existing semantic tokens and `SectionCard` / `UsChoropleth` components are reused; no new dependencies.
