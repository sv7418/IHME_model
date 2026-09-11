# Reason drill-down drawer: the 4 Ps behind every blocker

On the Executive Summary, each bar in **Top reasons** becomes clickable. Selecting one opens a right-side drawer that answers, for that reason only: which payers, where, which accounts, and which PSP people are on it — with a key insight and two ready-to-send email actions at the top.

## Drawer layout (top to bottom)

**Header** — reason label, patient count for that reason, share of the stage, and the one-line detail already in the data.

**Key insight + actions** (pinned directly under the header)

- One or two sentences written per reason, computed from the same numbers shown below so they always reconcile. Example for step therapy: "N patients sit behind M plans that require documented prior therapy; X of those plans are small regional payers. Prescriber offices hold the prior-treatment-failure records for Y of them."
- Two buttons next to the insight, each opening the existing draft-email dialog pre-filled:
  - **Email payer contracting** — plan list, patients held per plan, and the access change requested.
  - **Brief FRM team** — the accounts to work and the ask (nudge the provider office for prior-therapy / LMN documentation).
- Action wording varies per reason (LMN delay → office documentation push; appeal → appeals escalation; incomplete docs → intake/CM packet completeness).

**The 4 Ps, stacked in the drawer: Add a button in each P category to further deep dive that takes the user to individual tab for details and filtered to journey category & that reason**

1. **Payer distribution** — payers holding this reason's patients, with a share bar, count, scope (regional vs national), and step-therapy / LMN requirement flags.
2. **Geography** — the existing US choropleth, filtered to this reason's patients, with hover counts and a short list of the top states below it.
3. **Top accounts** — top 8 accounts holding this reason, with patients, rural/urban and size flags, days since last FRM call, and the topic of that call.
4. **PSP coverage** — the FRMs, case managers and intake specialists serving this reason's patients, with their counts and turnaround metrics; nurse navigators shown only when the stage actually involves them.

Every panel's counts sum exactly to the reason's patient count.

## Technical notes

- New `reasonSlice(view, reasonId)` helper in `src/lib/psp-stage-view.tsx` (or a sibling `psp-reason-slice.ts`) uses the existing `scaleCounts` largest-remainder function to apportion the reason's patients across payers, states, accounts, FRMs, CMs and intake specialists. Apportionment is weighted by each entity's stage-level share, tilted by reason-specific affinities (e.g. step therapy tilts toward payers with `requiresStepTherapy`, LMN delay tilts toward accounts with stale FRM calls) so slices look causal rather than uniform.
- New `src/components/psp/reason-drawer.tsx` built on the existing `@/components/ui/sheet` (right side, scrollable, wide), composed of small panels reusing `SectionCard`, `InsightBar`, `RiskChips` and `UsChoropleth`.
- New `src/lib/psp-reason-actions.ts` holds per-reason insight text and the two email prefills, returned as the existing `EmailPrefill` shape (subject, body, recipient, evidence rows) so `DraftEmailDialog` renders them unchanged and the user can still edit the address.
- `pa-exec-summary.tsx`: each reason row becomes a button (keyboard focusable, hover state, chevron affordance) that sets the selected reason; the drawer mounts once at that level.
- Works for every stage and for the "all patients" view — no data is hard-coded to prior auth.
- Illustrative data only; no backend changes.