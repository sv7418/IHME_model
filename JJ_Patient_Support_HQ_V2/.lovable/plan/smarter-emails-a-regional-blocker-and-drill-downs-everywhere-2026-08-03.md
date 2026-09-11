# Smarter emails, a regional blocker, and drill-downs everywhere

Six changes, all on the existing mock data — nothing new to store.

## 1. Emails that match who can actually fix the problem

Today every reason offers the same two emails (payer contracting + FRM). Route them by cause:

- Incomplete benefit / clinical documentation -> Hub Supervisor **and** FRM Director. The hub email says intake is submitting packets without functional class / walk test / imaging (clean-submission rate 68-74% in the Southwest pods) and asks for a checklist fix at intake; the FRM email asks the field to close the gap at the offices.
- Letter-of-medical-necessity delay -> FRM Director (office chase) + Hub Supervisor (LMN template and follow-up cadence).
- Step therapy -> Payer Contracting + FRM (unchanged).
- Appeal -> Payer Contracting + Case Management Lead (peer-to-peer scheduling).
- Capacity / unreachable-type reasons -> Hub Supervisor + Case Management Lead.

Reasons may carry two or three actions; the drawer already renders a row of action buttons.

## 2. Southwest concentration becomes its own top reason

Add a "Southwest access concentration" reason to the prior-auth and all-stage reason lists, sized from the Southwest share of the cohort (currently 75%, ~509 patients in prior auth). Because it overlaps the other four, it renders as a supplemental row below the four primary reasons — visually separated, labelled "supplemental lens", and excluded from the "100% attributed to one primary reason" math. Clicking it opens the same drill-down: Southwest payers (7 regional plans, ~50% first-pass approval, 10-13 day TATs), the Southwest choropleth, the Southwest accounts, and the 6 Southwest FRMs. Its emails go to the Regional Business Director and Payer Contracting.

## 3. Page-level "Draft Email" summarises the page

The Draft Email button in the analysis header currently opens a generic template. It will build its email from whatever section is on screen — executive summary sends the reason breakdown with patient counts and shares; geography sends the top states with risk splits; accounts, payer, specialty pharmacy and PSP utilisation each send their own top rows as the evidence table. Recipient defaults to a sensible leader for that section, and the full leader list (FRM Director, Market Access, Hub Supervisor, Nurse Navigator Lead, RBD, Payer Contracting, SP Contracting, Case Management Lead) stays selectable, plus free-text.

## 4. Geography: richer state drawer

Clicking a state currently updates a side panel. Replace it with a drawer showing:

- High / medium / low risk split
- Payer mix in that state
- Urban vs rural split and an age-band distribution (derived deterministically from state and setting so it is stable)
- Top accounts as a horizontal bar chart of % high-risk patients

## 5. Payer drawer gets charts

The existing payer sheet gains two bar charts above the current detail rows: patients by blocking reason for that payer, and patient volume by plan ID (using the plan-ID generator already in the data, extended to cover non-step plans).

## 6. PSP utilisation: every person is clickable

In all five role tabs (FRM, case manager, intake specialist, nurse navigator, affordability counsellor) each row opens a person profile drawer: patients handled, territory/pod and location, accounts covered with patient counts, and past-performance trend over the last 8 weeks against the team average. Trends are generated deterministically from the person's name so they stay consistent.

Also in the reason drill-down, the PSP-roles panel switches from plain counts to horizontal bar charts of patients handled per person.

## Technical notes

- New reason and per-reason action routing live in `src/lib/psp-stage-view.tsx` reason seeds and `src/lib/psp-reason-actions.ts` (actions become an array of 2-3, with a hub action added).
- New `src/lib/psp-page-email.ts` builds section-scoped subject/body/evidence from the current `StageView`; `src/routes/sense.tsx` passes it into `DraftEmailDialog`.
- New drawers: `state-drill-drawer.tsx`, extended `PayerProfile`, and `role-person-drawer.tsx`. Charts use the Recharts setup already used by the utilisation trend chart.
- Derived distributions (age bands, weekly performance, plan volumes) use a seeded hash helper so numbers are stable across renders and still reconcile to each entity's patient total.
