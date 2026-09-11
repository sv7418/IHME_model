# Prior Auth Story: One Stage, Five Lenses

Make the demo tell one crisp story. Clicking **Prior auth** on the journey tracker (678 patients, 9.4d avg TAT) drops the user into Sense & Diagnose with a locked **Stage: Prior auth** filter, and every page from there answers one question: why are these 678 patients stuck, and who fixes it.

Every number on every page reconciles to 678.

## Sense & Diagnose (5 pages)

Each page carries the same header: a **Stage filter (Prior auth)** chip, a time-range filter, and 1-2 plain-English insight sentences.

**1. Executive summary** — only three KPIs:

- Patients in stage: 678
- % at high risk of never-start: 78%
- Avg. days in stage: 9.4 (vs 5.0 expected)

Then **Top reasons** (patient counts add to 678): Show in a bar chart

- Payer requires step therapy / prior PAH therapy documentation — 244
- HCP office delay on letter of medical necessity — 187
- Stuck in appeal after first-pass denial — 141
- Incomplete benefit/clinical documentation at submission — 106

Insights: SW region holds 75% of these patients (509) across 8 FRM territories; 7 regional payers drive over half of all step-therapy holds.

**2. Geography** — a real US choropleth (state shapes, not the current grid), shaded by PA-stuck patients. Clicking a state shows its high / medium / low never-start risk split plus a table of top accounts in that state with the same three-way split, rural vs. urban flag, large or small account. State totals sum to 678; account splits sum to their state.

**3. Accounts** — table of accounts with: patients in PA step, top 3 never-start reasons (PA-specific, matching the exec summary and sometimes HCP has less experience with treatement), last FRM call date, and the education topic of that call. Bottom insights: average last touch was 12+ days ago; most calls covered generic reimbursement education rather than PA documentation.

**4. Payer** (new page) — list of payers with patients in PA, whether they require step therapy, and whether they require a letter of medical necessity, calling out the small regional plans. Clicking a payer opens: access complexity score, quantity limits, typical step-therapy requirement, patient count. Realistic named examples (e.g. regional Blues plans, Medicaid MCOs, a large national commercial plan, Medicare Part D).

**5. Specialty Pharmacy** — split of the 678 PA patients across SPs, avg. time to ship, and past fill rate per SP.

**6. PSP Roles** — role tabs:

- FRM: 7 FRMs covering the accounts that hold the majority of the 678
- Case Manager: CMs holding most of these patients, concentrated in SW, with each CM's avg. case processing time
- Nurse Navigator: no patient list — an explanatory note that injection training happens at a later stage, so the PA filter yields no cohort
- Have Intake specialist as another tab - show list of intake spec covering these patients and how much avg. TAT was taken
- Show a tab for affordability- show what % of patient enrolled into copay card and how many are still pending to be added to bridge program subject to PA delays

## Decide & Design

Three ready-to-send email actions tied to this bottleneck: Make these drafts real and allow the user to change email address

- **Payer contracting** — all payers where PA patients are stuck, with summarized reasons and counts
- **FRM director** — specific accounts to work, with focused messaging per account
- **Hub director** — shift Case Manager capacity from lower-load regions into SW to clear the PA queue

## Act & Orchestrate

Keep the current builder structure; ensure thresholds can create trigger emails (e.g. "if PA TAT > 8 days in any territory, email the hub supervisor").

## Optimize & Learn

Keep simple: a short list of past actions and what improved — fulfillment lift by geography, payer, account, and SP.

## Technical notes

- New `src/lib/psp-stage-data.ts` holds the Prior-auth cohort model (678) as the single source of truth: reasons, per-state risk splits, accounts, payers, SPs, FRMs, CMs. All views derive from it so totals always reconcile.
- Stage filter becomes shared context (`src/lib/psp-stage.tsx`) seeded from the `?stage=` search param that the journey tracker already passes; rendered as a chip next to the existing date-range filter in `app-shell`.
- `command-sidebar` section list gains `payer` and `sp`; `sense.tsx` gains the matching sections and delegates each to its own component under `src/components/psp/`.
- Choropleth: `geo-risk-map.tsx` is replaced by an SVG choropleth built with `d3-geo` + `topojson-client` and a bundled US states topology (`us-atlas`). All pure JS, bundles cleanly, no runtime asset fetching.
- Existing components (`accounts-table`, `role-performance`, `state-detail`, `account-detail`) are reworked to read the stage-filtered dataset rather than the generic mock data; date-range scaling stays wired through `psp-period`.
- Illustrative data only; no backend changes.