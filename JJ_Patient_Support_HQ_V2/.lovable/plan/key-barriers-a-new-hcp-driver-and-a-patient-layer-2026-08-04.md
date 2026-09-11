# Key Barriers, a new-HCP driver, and a patient layer

## 1. Rename

"Key Insights" becomes **Key Barriers** everywhere it shows: sidebar, page header, the analysis route's title/meta, and the empty-state copy in the Decision Ledger. The underlying section id stays `summary`, so existing links and `?section=` URLs keep working.

## 2. Replace the Southwest driver

"Concentration of PA in Southwest" is replaced by **"HCP office is new to prescribing WINREVAIR"** (brand name follows the selected brand).

- Volume drops to a believable level — roughly 25-30% of the stage, since only a handful of offices are new prescribers.
- It stays pinned as the lead barrier with a "Highest risk" badge; the tile row states it is ranked by risk, not by raw volume, and the remaining barriers stay ranked by volume below it.
- Insight: these offices have little experience with the product's PA criteria and documentation, so their patients carry the highest never-start risk per patient in the book.
- The Southwest story is not lost — it stays as the geography insight inside the other barriers, but is no longer its own tile.

The slice for this barrier attaches to accounts newly flagged as first-time prescribers: they sit at **55-65% at-risk volume**, and their last FRM call (about two weeks ago) was generic reimbursement or copay education rather than PA-specific coaching.

## 3. Drawer order for barrier drill-down

Reorder the drill-down drawer to: **Accounts → Geography → Payer → Specialty pharmacy → PSP roles → Patients**.

The Accounts panel leads with the new-prescriber story: how many accounts started prescribing recently, their at-risk share (60-70%), days since the last FRM call and what that call covered.

The new **Patients** panel at the bottom lists patients in that barrier with a masked ID, risk label (High / Medium / Low), predicted risk score, and a filter chip row for the top barrier per patient (HCP inexperience, step therapy, LMN, clinical documentation, and so on).

## 4. New "Patients" tab

A new **Patients** section in the left sidebar, directly below Payer. It shows a sortable, filterable table:

| Masked ID | Risk score | Risk label | Urban / Rural | Age bucket | Payer | Plan ID | Top 3 never-start drivers |

Clicking a row opens a **patient profile drawer**:

- Risk score with its top drivers spelled out
- Welcome call received (yes / date)
- Last FRM touch on the patient's account, and last nurse navigator touchpoint
- Case manager and specialty pharmacy assigned
- Clinical context: WHO functional class, presenting symptoms, comorbidities
- Payer, plan ID and the specific PA requirement blocking them

All patient records are synthetic and derived deterministically from the current stage, barrier and account slice, so the list always reconciles to the count shown on the tile.

## 5. Believable numbers, reconciled

- Journey stage counts scale down across both brands (for example WINREVAIR referral ~1,180 → ~420, prior auth ~678 → ~245), keeping the funnel monotonic and the week-over-week deltas intact.
- The at-risk share on Key Barriers moves into the **60% range** rather than the high-70s/80s.
- Every dependent lens — accounts, states, payers, SPs, PSP roles, patient lists, alerts and the daily summary — is derived from those totals by the existing apportionment, so all views continue to reconcile exactly.

## Technical notes

- `src/lib/psp-sections.tsx`, `src/routes/sense.tsx`, `src/components/psp/decision-ledger.tsx`: rename to "Key Barriers"; add the `patients` section id and sidebar entry.
- `src/lib/psp-stage-data.ts`: lower `PA_COHORT.total` and `highRiskShare` (~0.6); add a `newToBrand` flag plus recent-call fields to a subset of accounts; rescale account/payer/SP seed counts.
- `src/lib/psp-brand.tsx`: rescale stage patient counts for both brands.
- `src/lib/psp-stage-view.tsx`: drop the `southwest` synthetic reason, add the `new-hcp` reason (weight sized to ~12-15%), pin it first, and lower the derived high-risk share band.
- `src/lib/psp-reason-slice.ts`: add `new-hcp` account/payer affinities keyed off `newToBrand`.
- `src/lib/psp-reason-actions.ts`: replace the `southwest` branch with a `new-hcp` branch — FRM onboarding visit at the new accounts, hub supervisor to attach a PA-documentation checklist, nurse navigator welcome-call sweep — each with its own draft email and ledger action.
- New `src/lib/psp-patients.ts`: deterministic patient generator (masked ID, risk score/label, setting, age bucket, payer/plan, top 3 drivers, touchpoints, clinical profile) apportioned from the current slice.
- New `src/components/psp/patients-table.tsx` and `src/components/psp/patient-drawer.tsx`; a compact patient list is embedded at the end of `reason-drawer.tsx`, which is also reordered.