# PSP Utilization: replace the shortfall cards with a role coverage table

Remove the "Where registration is falling short" alert cards from the PSP Utilization page and put a role coverage table in their place — who is covering this cohort's patients, and how much volume each person carries.

## What the new section shows

A single card titled "Who is covering these patients", with a toggle across four roles: FRM, Nurse Navigator, Case Manager, Intake Specialist. One role is shown at a time.

Table columns (per person, for the currently filtered cohort):

- Name and territory / pod
- Tenure tag: **New** (under ~12 months on the brand) or **Experienced**
- Patients covered in this cohort, with a small inline volume bar
- Accounts or open cases covered (whichever fits the role)
- A role-specific metric: FRM = calls in last 30 days; Nurse = training completion rate; Case Manager = avg processing days and touches per case; Intake = avg intake turnaround
- Rows sorted by patient volume, highest first

A footer line reconciles the table: total patients covered by that role vs. the cohort size, so it's clear which patients have no coverage from that role.

## Clicking a person

Clicking a row opens the existing person profile drawer (the same one used elsewhere), showing:

- Role, territory, patients in this cohort
- Stat tiles for that role's key metrics plus the tenure tag
- An 8-week trend of their headline metric against the team average
- The accounts they cover / touch

## Technical notes

- `src/components/psp/psp-utilization.tsx`: drop the alerts `SectionCard`, `buildUtilizationAlerts` usage, the `emailAlert` state and its `DraftEmailDialog` wiring for alerts. Add a new `RoleCoverageTable` render below the choropleth. Metric tiles, registrations bar chart, choropleth and the state drawer are unchanged.
- New `src/components/psp/role-coverage.tsx`: role toggle + table, sourced from `view.frms`, `view.nurseNavigators`, `view.caseManagers`, `view.intakeSpecialists` on `useStageView()`. Reuses `PersonRef` / `PersonDrawer` from `src/components/psp/person-drawer.tsx` so the profile drawer behaves the same as on other tabs.
- Tenure ("New" vs "Experienced") is derived deterministically from the person's name via the existing hash helper pattern — stable across renders and SSR, roughly a quarter of each roster flagged New. No data-model change.
- `buildUtilizationAlerts` and `recommendationFor` stay in `src/lib/psp-utilization.ts` (unused by this page) unless you'd rather I delete them.
