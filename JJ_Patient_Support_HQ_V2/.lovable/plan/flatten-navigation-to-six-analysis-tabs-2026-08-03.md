# Flatten navigation to six analysis tabs

Drop the four capability pillars as navigation. The app has one analysis surface with six tabs, reachable directly from the journey page.

## 1. Navigation model

The six tabs become the only navigation:

Executive Summary · Geography · Accounts · Payer · Specialty Pharmacy · PSP Utilization

- "PSP Roles" is relabeled **PSP Utilization** (same content: FRM, Case Manager, Intake Specialist, Nurse Navigator, Affordability).
- The sidebar's "Sense & Diagnose / Decide & Design / Act & Orchestrate / Learn & Optimize" group is removed. The sidebar keeps the brand header, the Patient Journey link, the six section links (always visible, no longer nested under a pillar), and Switch brand.
- The Decide, Act and Learn pages are removed from the app. Their functionality is not currently reachable any other way, so this is a deliberate trim — say the word if you want any of it folded into a tab instead.
- Page titles drop the "Sense & Diagnose ·" prefix and read just the section name (e.g. "Geography").

## 2. Tab bar on the journey page

A horizontal tab row is added to the journey page, in the same row as "Switch brand", sitting above the morning briefing and the journey tracker. Clicking a tab opens that section of the analysis page (all patients, no stage filter). The row scrolls horizontally on narrow screens.

The journey tracker's stage clicks and the alert "Deep dive" buttons keep working as they do today — they open the analysis page filtered to that stage.

## Technical notes

- The active section moves from `useState` in `src/routes/sense.tsx` into the URL as a search param (`?section=geography`), validated alongside the existing `stage` param, so the journey tab links and the sidebar can link straight into a section and the browser back button works.
- Shared tab definitions (id, label, icon) move into a small module used by both the sidebar and the new journey tab bar; `SectionId` stays the same union with `roles` relabeled in display text only, so `PaRoles` needs no change beyond the section title map.
- Delete `src/routes/decide.tsx`, `src/routes/act.tsx`, `src/routes/learn.tsx`; the route tree regenerates. `src/lib/psp-actions.ts`, `psp-workflows.ts`, and `psp-pa-outcomes.ts` become unused and are deleted too, except anything still imported elsewhere (`DraftEmailDialog` and its prefill stay).
- New component `src/components/psp/section-tabs.tsx` rendering the row, used on `/journey`.
