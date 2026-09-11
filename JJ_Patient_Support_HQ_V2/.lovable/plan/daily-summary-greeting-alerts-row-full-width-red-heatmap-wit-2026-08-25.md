# Daily Summary: greeting, alerts row, full-width red heatmap with stage filter

## What changes

1. **Greeting** — "Good morning, John." becomes "Good morning, Liju." in the morning briefing.

2. **Alerts in a row** — Directly below the Active Patient Journey tile, alerts render full-width as a horizontal row of cards (responsive: 1 col mobile, 2 tablet, 3 up on desktop) instead of the current left-hand column. The four status counters stay above the cards. Cards get a tighter layout so they read well side by side.

3. **Heatmap across the full width** — Below the alerts, the US choropleth ("Where our patients are") spans the full page width. The PSP utilization trend chart moves below the map, also full width, so the page becomes a single vertical story: briefing → journey → alerts → map → trend.

4. **Stage filter on the map** — The journey stage tiles become selectable on this page. Selecting a stage (e.g. Prior authorization / PA) recolors the map to show patients currently stuck in that stage by state, with a header chip reading "Patients stuck in Prior authorization" and a clear button to return to all active patients. The selected tile gets a visible selected ring. Deep-dive into Sense & Diagnose stays available from the existing tile hover panel ("Diagnose this stage"), so selecting no longer navigates away.

5. **Red map palette** — Map bands change from the green→amber→red ramp to five shades of J&J red (light rose through deep brand red), so density reads as intensity of one color. Legend and tooltip pick up the same scale. Only the daily-summary map changes; other maps keep their current scale unless you want them switched too.

## Technical notes

- `src/lib/psp-journey-home.ts`: greeting string; add a `buildStageStatePatients(brand, stageId)` helper that distributes the selected stage's patient count across states using the existing `stateRisks` reference weights (deterministic, same approach as `buildStatePatients`).
- `src/components/psp/patient-location-map.tsx`: accepts an optional `stageId` + `onClearStage`, switches title/subtitle and values accordingly, and passes a red band set to `UsChoropleth`.
- `src/components/psp/us-choropleth.tsx`: add an exported red band preset (5 steps) used by the daily summary; no behavior change to the component API beyond that.
- `src/components/psp/journey-tracker.tsx`: optional `selectedStage` / `onSelectStage` props — when provided, tile click toggles selection instead of navigating; the hover panel keeps the navigate action.
- `src/components/psp/alerts-panel.tsx`: row/grid layout for the alert cards.
- `src/routes/journey.tsx`: holds the selected-stage state and the new single-column section order.

Presentation-only; no data model or backend changes.
