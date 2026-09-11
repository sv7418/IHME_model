# Drill-downs for Geography, Accounts, and PSP Roles

Add three levels of detail to the command center, all built on extended illustrative data (no backend).

## 1. Geography — state detail view

Clicking a state on the map opens a full state detail panel (replacing the small preview card, shown below the map) with:

- Header: state name, never-start risk, discontinuation risk, patients, FRM coverage
- Bottom N accounts in that state (N selector: 5 / 10), ranked by fulfillment rate — with never-start risk, persistency rate, fulfillment rate
- Payer mix for the state: commercial / Medicare / Medicaid split plus the top named payers with their approval and denial rates
- Specialty pharmacies: side-by-side Top N and Bottom N lists with fulfillment rate, persistency rate, avg. time to first fill, and patient volume
- Back / clear control, and the state stays applied as the accounts filter

## 2. Accounts — account detail view

Clicking a row in the accounts table opens an account detail view (full-panel drill-down with a back button) showing:

- Header with account name, state, patients, never-start and discontinuation risk, fulfillment rate
- Top drivers of never-start risk — ranked list with contribution % bars (PA latency, copay abandonment, benefit verification, SP onboarding, formulary exclusion, etc.)
- Top drivers of discontinuation risk — same treatment (copay burden, tolerability follow-up gaps, refill lapses, navigation gaps)
- Payer mix: named payers with share of patients, approval rate, avg. PA turnaround
- Channel mix: commercial / Medicare / Medicaid / other as a stacked bar with values
- SP mix: specialty pharmacies serving the account with share, fulfillment rate, persistency rate
- Assigned field coverage (FRM / Case Manager / Nurse Navigator) for that account

## 3. PSP Roles — per-role tabs

Replace the single dropdown with a tab bar, one tab per role (FRM, Case Manager, Nurse Navigator, Field Reimbursement Specialist, Hub Coordinator). Each role tab shows:

- A role-specific KPI strip (e.g., FRM: PA turnaround, benefit verifications cleared, accounts covered; Nurse Navigator: adherence calls, 90-day persistency lift; Case Manager: cases closed, time-to-resolution; Hub Coordinator: intake-to-enrollment time)
- Top N / Bottom N performer toggle over the ranked people list, keeping current metrics plus the role-specific metric
- A short "coverage gaps" callout listing territories under target for that role

## Technical notes

- Extend `src/lib/psp-data.ts` with: `statePayerMix`, `specialtyPharmacies` (per state), `accountDetails` (risk drivers, payer mix, channel mix, SP mix, coverage), `persistencyRate` on accounts, and per-role metric definitions. All deterministic mock data.
- New components in `src/components/psp/`: `state-detail.tsx`, `account-detail.tsx`, `role-tabs.tsx` (plus small shared `share-bar` / `driver-list` bits).
- `src/routes/index.tsx` gains `selectedAccount` state; geography and accounts sections render list vs. detail. Draft Email keeps working from both views.
