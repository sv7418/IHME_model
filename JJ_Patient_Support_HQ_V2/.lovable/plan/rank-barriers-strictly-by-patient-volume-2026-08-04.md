# Rank barriers strictly by patient volume

## What changes

Today the "HCP office is new to prescribing WINREVAIR" barrier is force-pinned to the top of the Key Barriers list regardless of how many patients it holds, while the rest are sorted by volume. That makes the ordering inconsistent.

New behaviour:

- Every barrier tile is ranked purely by the number of patients associated with it, highest first — no pinning, no special case.
- In the Prior authorization stage, the new-prescriber barrier genuinely holds the most patients, so it lands first on its own merit. Its volume is raised to sit just above the next-largest PA barrier (step therapy / missing clinical documentation), staying at a believable level and keeping the 60-something percent at-risk share.
- In other stages the new-prescriber barrier is ranked wherever its volume puts it.
- The tile row subtitle drops the "pinned as highest risk" framing and simply states the list is ranked by patient volume, with overlapping barriers noted as before.

All downstream lenses (accounts, geography, payer, SP, PSP roles, patients) continue to derive from the same slice, so the counts keep reconciling to whatever is shown on each tile.

## Technical notes

- `src/lib/psp-stage-view.tsx`: remove the `pinned` unshift; push the new-hcp reason into `reasons` before the single `sort((a, b) => b.patients - a.patients)`. For the prior-auth stage, scale the new-to-brand account share (or apply a stage-specific multiplier on `newPatients`) so it exceeds the top PA reason count; drop the now-unused `pinned` field from `StageReason`.
- `src/components/psp/pa-exec-summary.tsx`: update the SectionCard subtitle and remove any "highest risk" badge tied to the pinned tile.
