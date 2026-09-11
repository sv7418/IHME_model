# Story-first entry: brand picker → patient journey tracker

Reshape the entry experience so the app tells a story: pick a brand, see where patients are stuck, then move into the four capabilities.

## 1. Thin Merck top bar (all pages)

A new white top row, matching the second reference:

- Left: Merck logo mark + "Patient Support Command Center" with a small subtitle line ("Enterprise Landing" on the landing page, brand name elsewhere).
- Right: "Data through **07/12/2026**" (driven by the existing date-range/period state) and "Welcome, **John Smith**".
- Sits above everything, including the existing dashboard shell, so the header/sidebar layout stays intact.

## 2. Landing page (`/`) — brand selection

Replaces the current four-pillar grid.

- Deep teal gradient background, matching the first reference.
- Pill in the top-right of the hero area: "Patient Support · Command Center".
- Headline: "Welcome to the PSP Command Center", sub-line: "What brand are you interested to learn & act on today?"
- Two centered white cards:
  - **WINREVAIR** — PAH (Pulmonary Arterial Hypertension)
  - **OHTUVAYRE** — COPD (Chronic Obstructive Pulmonary Disease)
  - Each with a typographic brand wordmark (no third-party logo files), disease-state caption, and "Open →" with the polished hover/focus/press states already used on the current cards.
- Selecting a brand stores it (React context + localStorage) so every downstream page and the top bar show the active brand, with a way to switch back.

## 3. New journey page (`/journey`) — the pizza tracker

Where the user lands after picking a brand.

- Headline: "Where are our WINREVAIR patients stuck?" (brand-aware) plus the intro copy about the morning view of the journey.
- Horizontal 9-stage tracker: Referral, Rx, Enrollment, Benefit check, Prior auth, Nurse training, Tx start, Monitoring, Persistency — circular icons on a connecting rail, count under each stage.
- WINREVAIR counts use the numbers from the reference: 212, 184, 301, 156, **678**, 98, 142, 2,340, 1,905. Prior auth is the flagged bottleneck: red circle, alert badge, red rail segments on either side, red count.
- Caption: "Prior authorization is flagged — click it to start there, or click any other step."
- Clicking any stage navigates into **Sense & Diagnose** with that stage as the active focus (stage shown in the header/subtitle so the drill-down feels continuous).
- Below the tracker: four numbered cards — Sense & Diagnose, Decide, Orchestrate, Optimize & Learn — with the reference copy, linking to `/sense`, `/decide`, `/act`, `/learn`.
- OHTUVAYRE gets its own stage counts and flagged stage so the two brands tell different stories. Since no real OHTUVAYRE figures were provided, those numbers will be clearly marked as illustrative in the page footnote (same as the rest of the demo data).

## 4. Navigation wiring

- Sidebar logo/home link points to `/journey` when a brand is selected, `/` otherwise; a small "Switch brand" affordance returns to `/`.
- Brand name appears in the sidebar and in each page subtitle.

## Technical notes

- New: `src/lib/psp-brand.tsx` (brand list, journey stage data per brand, context/provider + hook), `src/components/psp/top-bar.tsx`, `src/components/psp/journey-tracker.tsx`, `src/routes/journey.tsx`.
- Edited: `src/routes/index.tsx` (brand picker), `src/components/psp/app-shell.tsx` (render top bar, brand-aware subtitle), `src/components/psp/command-sidebar.tsx` (home target + brand label), `src/routes/__root.tsx` (wrap in `BrandProvider` alongside the existing `PeriodProvider`), `src/routes/sense.tsx` (accept optional `stage` search param for focus context), `src/styles.css` (teal hero gradient token, journey rail/flag tokens).
- All colors go through semantic tokens; no hardcoded hex or `text-white`.
- Route `head()` metadata added for `/journey` and updated for `/`.