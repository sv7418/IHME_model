# Journey page as the command-center home

Trim the brand picker, rebuild the journey page around a morning briefing, key alerts, trend charts, and a patient map. All data stays in the existing mock modules — no new backend.

## 1. Landing page

- Remove KEYTRUDA and WELIREG so only WINREVAIR (PAH) and OHTUVAYRE (COPD) show. The two cards center in the grid.
- Their logo assets and brand records are deleted along with the `BrandId` union entries.

## 2. Top bar date

- "Data through" becomes a date computed at render time: today minus 3 days, formatted MM/DD/YYYY. It stays current instead of the hard-coded 07/12/2026.

## 3. Journey tracker cleanup

- Drop the circular stage icons entirely.
- Move each stage's patient count up into the space the icon vacated, so the number is the first thing read; label sits above it, TAT / persistency detail below.
- Keep the numbered order, the share-of-patients bar, the flag/status coloring, tooltips, and click-through into Sense & Diagnose.
- Add a week-over-week change under each stage count (e.g. "+6.2% WoW"), colored green/red by whether the direction is good for that stage. WoW percentages get added to the stage data in the brand module as fixed demo values consistent with the existing story (prior auth backing up for WINREVAIR, benefit investigation for OHTUVAYRE).

## 4. New journey page layout

Top to bottom:

**a. Morning briefing banner** (styled after reference image 1)
- Time-of-day chip ("Monday, 8:15 AM" style, derived from the data-through date).
- "Good morning, John." plus a brand line so it is obvious which brand is in view — brand logo/name and indication next to the greeting.
- A narrative paragraph built from the brand's own numbers: new enrollments, patients started on therapy, and the slip in time-to-therapy, naming the flagged stage as the main driver.
- Three inline metric tiles: New enrollments, Patients started on therapy, Median time to therapy — each with a vs-prior-week delta.

**b. Journey tracker** (as revised above), unchanged in position.

**c. Two-column section below the journey**

Left column — **Alerts** ("Key items to focus on", styled after reference image 2):
- Status count strip: Active / In progress / Dismissed / Completed.
- Three alert cards drawn from data we already have:
  1. **Prior authorization** — the flagged stage: TAT running 9.4d vs 5d expected, patients backed up, concentrated in the top Southeast accounts.
  2. **Persistency** — 6-month persistency at 65% with average days on therapy below target; drop-off as dosing escalates.
  3. **Enrollment TAT** — enrollment averaging 3.8d vs 3d expected (lowest severity of the three).
- Each card carries severity, category, status, patients impacted, owner, confidence, and a "Deep dive" button that routes into Sense & Diagnose filtered to that stage.
- Alert content is generated per brand from that brand's stage data, so switching brands keeps the story honest.

Right column — **two charts** (recharts, already installed):
- **PSP utilization trend**: multi-series line chart over the last N weeks for copay enrollment, bridge, hub enrollment, and nurse enrollment. A control lets you switch the window (8 / 12 / 26 weeks) and toggle series on/off, so the chart is dynamic.
- Below it, **patient location choropleth**: the existing `UsChoropleth` reused with total active patients per state for the selected brand, with hover/select detail.

**d. Pillar tiles removed** — the Sense & Diagnose / Decide / Orchestrate / Optimize tiles come off the journey page. Navigation to those pillars stays available through the stage clicks and alert "Deep dive" buttons.

## Technical notes

- Trend data: new deterministic generator in a mock data module producing weekly series per brand for the four programs, seeded so values are stable across renders but shaped as realistic trends.
- State-level patient counts for the map: derived from existing `stateRisks` patient figures, scaled to the selected brand's active total.
- New components under `src/components/psp/`: `morning-briefing.tsx`, `alerts-panel.tsx`, `utilization-trend-chart.tsx`, plus a thin wrapper for the patient map.
- All colors via existing semantic tokens (`risk-*`, `signal`, `success`, `destructive`); no hard-coded hex.
- Head metadata on `/journey` updated to match the new briefing framing.
