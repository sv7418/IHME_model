# Lighter left pane, contextual insights, and more new-prescriber offices in Texas

## 1. Left pane goes light

The left rail currently uses the dark red sidebar theme, which makes the alert text hard to read. It becomes a light, near-white panel:

- Surface: white/off-white with a subtle right border, matching the card surfaces used in the main content.
- Text: normal foreground and muted-foreground colors instead of washed-out light red.
- Brand header at the top keeps the red J&J avatar tile on the light surface.
- Alert severity dots and the count tiles keep the red risk ramp so severity still reads at a glance.
- "Switch brand" and the engine footer stay, restyled for the light surface.

## 2. The rail becomes context-aware

The rail keeps a compact **Alerts** block at the top, then adds a second block below it that changes with the active tab:

| Tab | Rail block |
| --- | --- |
| Daily Summary | Alerts only (as today) |
| Key Barriers | "What's driving this" — top 3 barriers with patient counts, plus the stage/state scope line |
| Geography | "Geography signals" — top states by blocked patients and the rural/urban tilt |
| Accounts | "Account signals" — densest accounts, offices new to the brand, last-FRM-call staleness |
| Payer | "Payer signals" — top payers, step-therapy share, first-pass rates |
| Patients / PSP Utilization / Decision Ledger | Alerts only |

These lines are read from the insight text the analysis view already computes for each lens, so the rail always says the same thing as the page and reconciles to the same patient count. When a stage and/or state is selected (for example Prior auth + Texas), the block shows that scope and its numbers, so the rail re-populates as the user drills in.

## 3. More Texas offices are new to prescribing

Today Texas has 6 accounts and only one is flagged as new to the brand, so the Prior auth + Texas barrier reads "1 offices started prescribing…". Texas gets a realistic set of small, newly prescribing offices:

- Add roughly 8 new-to-brand Texas practices (community dermatology/rheumatology and regional-health offices in Austin, San Antonio, El Paso, Fort Worth, Corpus Christi, Lubbock, McAllen, Amarillo), each carrying a small patient block, high at-risk share (60-70%), and a last FRM call ~2-5 weeks ago covering generic reimbursement or copay content rather than PA coaching.
- Combined with the existing Valley Baptist entry, Prior auth + Texas then shows **9 offices new to prescribing TREMFYA**, and the barrier copy, insight line and drill-down drawer all pick that up automatically.
- Statewide Texas patient volume stays close to today's level: the new offices are sized so the state total and the funnel remain consistent, and every dependent lens (accounts, payers, SPs, PSP roles, patients) continues to reconcile by the existing apportionment.

Grammar in the barrier copy is fixed so it reads "9 offices" / "1 office" correctly.

## Technical notes

- `src/styles.css`: retune the `--sidebar*` tokens to a light surface (near-white background, dark foreground, light border) so the rail inherits the lighter look without hardcoded colors.
- `src/components/psp/command-sidebar.tsx`: light-surface styling; render `AlertsRail` plus a new `RailInsights` block; accept the active section.
- `src/components/psp/alerts-rail.tsx`: restyle for the light surface.
- New `src/components/psp/rail-insights.tsx`: reads the active section and, when inside a `StageViewProvider`, renders lines from `view.insights` (`exec`/`geography`/`accounts`/`payers`) plus the scope line; renders nothing on Daily Summary.
- `src/lib/psp-stage-view.tsx`: export an optional `useStageViewOptional()` (returns null outside the provider) so the rail is safe on `/journey`; fix the office-count pluralization in the `new-hcp` reason copy.
- `src/components/psp/app-shell.tsx`: pass `activeSection` down to `CommandSidebar`.
- `src/lib/psp-stage-data.ts`: add the ~8 new Texas accounts with `newToBrand: true`, small `patients`, high `highShare`, generic `lastFrmCallTopic`, and existing TX FRM owners.
