# Geo-flavoured rail insights + a PE.AI Fulfillment Risk filter on the map

## 1. Left rail on Key Barriers stops repeating the drivers

Today the rail on Key Barriers lists the same top three barriers the page already shows. It changes to a short set of geography-flavoured observations that the page does *not* say, so the rail adds something instead of echoing:

- Where the cohort actually sits: the state (or top states) holding the biggest share, with its patient count and share of the stage.
- A concentration line: how few accounts / metros carry the bulk of blocked patients (e.g. "3 accounts hold 61% of Texas prior-auth patients").
- A setting tilt: rural / small-site share versus the national average, and what that implies for reach.
- A coverage gap line: average days since the last FRM call in this geography and how much of it was generic education.

Same numbers as the underlying view, but framed as geo colour rather than a driver ranking. The three-driver list is removed from the rail (it stays on the page). Geography, Accounts and Payer tabs keep their existing lens lines.

## 2. PE.AI Fulfillment Risk filter on the Daily Summary map

When a journey step such as Prior auth is selected on the Daily Summary, the heatmap header gains a dropdown labelled **PE.AI Fulfillment Risk** with options: All risk levels, High, Medium, Low.

- Picking a bucket refilters the choropleth to only the patients in that risk band, so the shading and the state counts become "high-risk patients stuck in prior auth by state".
- The map title/subtitle names the active filter ("High fulfillment risk · patients stuck in prior auth").
- Selecting a state then shows that state's count for the chosen bucket, e.g. "Texas · 61 high-risk patients", and the existing **Deep dive into key barriers** button carries the step + state (and the risk bucket) into the Key Barriers view.
- The Key Barriers header shows a removable risk chip next to the stage and state chips; clearing it returns to the full cohort.

Risk buckets are derived deterministically per state from the existing risk profile (never-start and discontinuation risk), so the three buckets always sum back to the unfiltered state count and the numbers reconcile with the deep dive.

## Technical notes

- `src/lib/psp-journey-home.ts`: add a `RiskBucket = "all" | "high" | "medium" | "low"` type and `buildStageStateRiskPatients(brand, stageId, bucket)` that splits each state's stage count into high/medium/low using largest-remainder on that state's risk profile, so buckets sum to the total.
- `src/components/psp/patient-location-map.tsx`: add the PE.AI Fulfillment Risk select (shadcn `Select`), local `bucket` state, use the new builder, update title/subtitle/selection copy, and pass the bucket to `onDeepDive(stateCode, bucket)`.
- `src/routes/journey.tsx`: forward `risk` in the `/sense` search params.
- `src/routes/sense.tsx`: add optional `risk` to `SenseSearch` + `validateSearch`, thread into `StageViewProvider`, render a removable risk chip alongside the stage/state chips.
- `src/lib/psp-stage-view.tsx`: accept an optional risk bucket in `buildView`; when set, scale the cohort to that bucket's patients and tilt reason weights toward risk-correlated drivers; expose `riskBucket` on `StageView`.
- `src/components/psp/rail-insights.tsx`: replace the top-3 reason list on the `summary` lens with a new geo-flavoured line set (concentration, setting tilt, FRM staleness) computed from `view.accounts` / `view.states` / `view.totals`; keep the scope tile at the top.
