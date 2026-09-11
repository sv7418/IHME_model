# Command Center Landing Page + Four Capability Pillars

## What we're building

A new landing page that becomes the app's front door: a "Command Center" brain in the middle with four orbiting buttons. Each button opens a full working area.

```text
            Sense & Diagnose
                   |
 Learn &  ---  [ BRAIN ]  ---  Decide & Design
 Optimize          |
             Act & Orchestrate
```

## 1. Landing page (`/`)

- Centered brain graphic labeled "Command Center", with a soft pulse/glow using existing tokens (teal surface, signal orange accent).
- Four buttons positioned around it (orbit layout on desktop, 2x2 grid on mobile), each with icon, title, one-line description, and a live stat pulled from current data (e.g. "18 open signals", "6 recommended actions", "4 active workflows", "12 interventions measured").
- Clicking a button routes into that pillar. Header keeps the date-range filter, avatar and Draft Email actions.

## 2. Sense & Diagnose — existing dashboard

Move today's dashboard (Executive Summary, Geography, Accounts, PSP Roles) under this pillar, unchanged in behavior. Sidebar keeps those four sections plus a way back to the landing page and across to the other pillars.

## 3. Decide & Design — recommended actions

A prioritized list of system-generated recommendations, each derived from the existing risk data, for example:
- "Inform FRM Director — 3 FRMs below 60% action rate for 6+ weeks"
- "Inform Payer Contracting — PA denial rate above 30% at 4 payers"
- "Inform SP Contracting — 2 specialty pharmacies with TAT > 7 days"
- "Inform Hub Supervisor — never-start backlog up 18% in 3 states"

Each card shows: rationale, supporting evidence (accounts / states / payers involved), suggested recipient role, and impact estimate. Actions: **Draft Email** (opens the existing composer prefilled with recipient, subject, body and the relevant evidence table), **Snooze**, **Mark actioned**. Filters by stakeholder type (PSP role leads, payer contracting, SP contracting, hub).

## 4. Act & Orchestrate — workflow builder

- List of workflows with status (active/paused), trigger summary, last run, times fired.
- "New workflow" builder in plain rule language:
  - **When** [metric] for [scope] is [above/below] [threshold] over [window]
    - metrics: fulfillment rate, time to first fill / TAT, never-start risk, discontinuation risk, PA approval rate, action rate
    - scopes: FRM territories, accounts, states, specialty pharmacies, payers, at-risk patient cohort
    - thresholds can be absolute or relative to national average (e.g. "10% below national average")
    - optional count qualifier: "in at least N territories"
  - **Then** send email to [recipient role or custom address] using [template], optionally attach the matching list.
  - Preview panel shows how many entities match the rule right now, so the VP sees whether it would fire today.
- Two seeded example workflows matching your examples (FRM fulfillment vs national average; high-TAT at-risk patients to Hub Supervisor).

## 5. Learn & Optimize — outcome measurement

- Period selector (last 4 / 8 / 12 weeks) reusing the global date filter.
- **Interventions scorecard**: past actions/workflows with before-vs-after metric movement, lift vs a comparison group, and a worked / didn't work verdict.
- **Geographies improving vs worsening**: ranked lists with the metric that moved.
- **Accounts doing better & why**: top improvers with attributed drivers (e.g. "PA turnaround down 2.1 days after payer escalation").
- **What we learned**: short generated takeaways tying intervention type to outcome, so the next decision is informed.

## Technical notes

- Routes: `src/routes/index.tsx` becomes the landing page; new routes `sense.tsx` (with the existing summary/geo/accounts/roles sections and their drill-downs), `decide.tsx`, `act.tsx`, `learn.tsx`. Each gets its own `head()` metadata.
- Current dashboard body moves into a component (`src/components/psp/sense-dashboard.tsx`) so the route files stay thin; drill-down state stays local as today.
- `PeriodProvider` moves to `__root.tsx` so the date filter applies across all pillars.
- New deterministic mock data modules: `src/lib/psp-actions.ts` (recommendations), `src/lib/psp-workflows.ts` (rule vocabulary, seeded workflows, live match counts), `src/lib/psp-outcomes.ts` (intervention results, improving/worsening geos and accounts) — same hash-seeded approach as `psp-detail-data.ts` so values are stable and react to the selected period.
- Workflows are held in React state (no backend) and persist for the session.
- Existing `DraftEmailDialog` is extended to accept a prefilled recipient/subject/body/evidence payload so recommendation cards and workflows reuse it.
- All styling uses existing semantic tokens; no new colors.
