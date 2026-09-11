# Decision Ledger

Remove the "What this means" bar from Key Insights, and add a Decision Ledger where every action the user picks during a drill-down is collected, reviewed in a table, and triggered together.

## Key Insights page

- Drop the "What this means" insight bar under the reason cards. Nothing else on the page changes.

## Capturing decisions during drill-down

In the reason drill-down drawer, each recommended action currently opens a draft email. Each action gets:

- The existing "Draft email · <recipient>" button (unchanged behaviour).
- A new "Add to ledger" button next to it. Once added, the button flips to an "Added" state so the user can see it is captured, and clicking again removes it.
- Inside the draft-email dialog itself, a second footer button "Add to Decision Ledger" so a user who edits the recipient/subject/body captures the edited version instead.

Each captured decision stores: journey stage, reason/issue, patients impacted (the sliced count for that reason), a one-line description of what the email or nudge will do, recipient name and email address, and the subject line.

The same "Add to ledger" option appears on the page-level Draft Email dialog (Key Insights, Geography, Accounts, Payer, Specialty Pharmacy, PSP Utilization), so page summaries can also be queued.

## Decision Ledger tab

A seventh tab, "Decision Ledger", in the sidebar and in the section tab row. Its label carries a count badge showing how many decisions are currently selected.

The page shows a table with one row per captured decision:

| Select | Stage | Issue / reason | Patients impacted | Action description | Recipient | Email |

- Checkbox per row (selected by default) plus a select-all header checkbox.
- Each row can be expanded/previewed to see the drafted subject and body, and removed from the ledger.
- Header line: "N of M decisions selected · X patients covered".
- Empty state points the user back to Key Insights to drill into a reason.
- A "Trigger N actions" submit button at the bottom: fires the selected rows, shows a confirmation toast listing how many emails/nudges went out, marks those rows as Sent (kept in the table with a Sent tag, no longer selectable).

## Technical notes

- New `src/lib/psp-ledger.tsx`: `LedgerProvider` context + `useLedger()` with `entries`, `add`, `remove`, `toggleSelect`, `submitSelected`, and a `selectedCount`. State is in React and persisted to `localStorage` so it survives navigation between sections (read in `useEffect` to avoid hydration mismatch). Entry shape: `{ id, stageId, stageLabel, reasonId, issue, patients, description, recipientName, recipientEmail, subject, body, status: "pending" | "sent" }`. Provider mounts in `src/routes/__root.tsx`.
- `src/lib/psp-sections.tsx`: add `decisions` section id with a `ClipboardList` icon.
- `src/components/psp/command-sidebar.tsx` and `section-tabs.tsx`: render the pending-selected count badge for that item.
- `src/components/psp/draft-email-dialog.tsx`: accept an optional `ledgerMeta` prop (stage, issue, patients) and render the "Add to Decision Ledger" footer button when present.
- `src/components/psp/reason-drawer.tsx`: add the per-action "Add to ledger" toggle, passing `ledgerMeta` through to the dialog.
- New `src/components/psp/decision-ledger.tsx`: the table, selection, preview, and submit UI.
- `src/routes/sense.tsx`: render the new section, hide the Draft Email header button on it, and add its head title/description.
- `src/components/psp/pa-exec-summary.tsx`: remove the `InsightBar`.
