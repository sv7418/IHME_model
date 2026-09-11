# Top tabs, an alerts rail, and geo-aware Key Barriers

## 1. Navigation moves to the top

The left sidebar stops being the section switcher. The seven analysis sections (Key Barriers, Geography, Accounts, Payer, Patients, PSP Utilization, Decision Ledger) become a horizontal tab strip that sits in the page header, directly under the brand/title row, on every page. Daily Summary stays as its own entry at the far left of that strip.

The strip keeps the current active styling (red underline/active pill), scrolls horizontally on narrow screens, and keeps the Decision Ledger count badge.

## 2. The left rail becomes Alerts

The left column keeps the brand block and "Switch brand" footer, but its body is now a compact alerts list:

- The four status counts (New, In progress, Dismissed, Resolved) as a tight 2x2 block at the top.
- Below it, each alert as a compact row: severity dot, title, patients impacted, age. Clicking a row deep-dives to Key Barriers for that alert's stage, exactly like today's "Deep dive" button.
- The rail scrolls independently and is present on both Daily Summary and the analysis pages.

The full-width alerts row is removed from the Daily Summary page body, so that page becomes: greeting tile → patient journey → heatmap.

## 3. Journey step → state → Key Barriers deep dive

On Daily Summary, clicking a journey step (e.g. Prior auth) already filters the heatmap. Adding to that:

- Clicking a state on the heatmap selects it (as today) and now also reveals a "Deep dive into key barriers" button next to the state's patient count.
- That button opens Key Barriers scoped to both the selected journey step and the selected state.
- With no step selected, the deep dive still works and scopes to that state across all stages.

## 4. Key Barriers respects the selected state

The analysis pages gain a state scope alongside the existing stage scope:

- A removable state chip appears next to the stage filter in the header ("Texas ✕"), and the subtitle patient count reflects the state cohort.
- Every lens narrows to that state: the barrier tiles and their patient counts, accounts, payer mix, specialty pharmacies, patients table, PSP roles and the written insights.
- Because barrier volumes are derived from the accounts in scope, the reasons themselves re-rank per state — a state whose accounts skew to new-to-brand offices or to regional Medicaid plans surfaces a different lead barrier than the national view. Barrier copy and the drill-down drawer name the state, so the story reads as "why patients in Texas are stuck in prior auth".
- Clearing the state chip returns to the stage-wide view; clearing the stage keeps the state.

Numbers keep reconciling: the state cohort is the sum of that state's accounts within the stage, and every downstream panel is apportioned from it with the existing largest-remainder logic.

## Technical notes

- `src/lib/psp-sections.tsx`: no id changes; add a horizontal `SectionTabs` component (new `src/components/psp/section-tabs.tsx`) rendered by `AppShell` under the header.
- `src/components/psp/app-shell.tsx`: render `SectionTabs` in the header block; keep `activeSection` / `onSectionChange` props and pass through. On Daily Summary the tabs render as links.
- `src/components/psp/command-sidebar.tsx`: drop `sectionItems` nav; render a new `AlertsRail` (new `src/components/psp/alerts-rail.tsx`) built from `buildAlerts` / `alertStatusCounts` in `src/lib/psp-journey-home.ts`.
- `src/routes/journey.tsx`: remove `<AlertsPanel />` and its import; keep briefing, tracker, map. `alerts-panel.tsx` is deleted once nothing imports it.
- `src/components/psp/patient-location-map.tsx`: accept `onDeepDive(stateCode)`; render the deep-dive button when a state is selected. `journey.tsx` navigates to `/sense` with `{ stage, state, section: "summary" }`.
- `src/routes/sense.tsx`: add `state?: string` to `SenseSearch` + `validateSearch`; thread it through `StageViewProvider`, the state chip, and `setSection` / `setStage` so it survives navigation.
- `src/lib/psp-stage-view.tsx`: `buildView(brandId, stageId, stateId)` — filter `paAccounts` to the state before scaling, scale to the state's share of the stage total, expose `stateId` / `stateLabel` on `StageView`, and rewrite the geography/exec insight strings for a single-state scope.
- `src/lib/psp-reason-slice.ts`: unchanged logic; it slices whatever account/state set the view provides.
