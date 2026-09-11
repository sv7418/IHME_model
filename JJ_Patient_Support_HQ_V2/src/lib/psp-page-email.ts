/**
 * Section-scoped email summaries.
 *
 * Every analysis page's "Draft Email" button summarises what is on screen —
 * the same numbers the user is reading — and defaults to the leader who owns
 * that lens. The recipient stays editable in the dialog.
 */

import type { EmailPrefill } from "@/components/psp/draft-email-dialog";
import type { SectionId } from "./psp-sections";
import type { StageView } from "./psp-stage-view";

const SIGNOFF = ["Thank you,", "Maria Alvarez", "VP, Patient Services — Johnson & Johnson"];

function frame(view: StageView) {
  return view.isAll
    ? `all ${view.totals.patients.toLocaleString()} open patients across the journey`
    : `the ${view.totals.patients.toLocaleString()} patients in the ${view.label.toLowerCase()} stage`;
}

export function pageEmailPrefill(view: StageView, section: SectionId): EmailPrefill {
  const scope = frame(view);
  const reasonNote = view.reasonId ? ` (filtered to ${view.reasonLabel})` : "";
  const stageTag = view.isAll ? "All stages" : view.label;

  switch (section) {
    case "geography": {
      const top = view.states.slice(0, 8);
      return {
        recipientId: "r-region",
        subject: `${stageTag}: where our ${view.totals.patients.toLocaleString()} patients sit${reasonNote}`,
        evidenceTitle: "States by patient volume and risk",
        evidence: top.map((s) => ({
          label: s.name,
          detail: `${s.region} · ${s.accounts.length} accounts · avg ${s.avgDays} days in stage`,
          metric: `${s.patients} patients · ${Math.round((s.risk.high / (s.patients || 1)) * 100)}% high risk`,
        })),
        body: [
          "Hi,",
          "",
          `Sharing the geographic picture for ${scope}${reasonNote}.`,
          "",
          ...view.insights.geography.map((p) => `• ${p}`),
          "",
          `The Southwest carries ${view.totals.southwest} of ${view.totals.patients} patients. State-level detail is below.`,
          "",
          ...SIGNOFF,
        ].join("\n"),
      };
    }

    case "accounts": {
      const top = view.accounts.slice(0, 10);
      return {
        recipientId: "r-frm",
        subject: `${stageTag}: accounts holding the most patients${reasonNote}`,
        evidenceTitle: "Top accounts by patient volume",
        evidence: top.map((a) => ({
          label: a.name,
          detail: `${a.stateName} · ${a.setting}, ${a.size} · FRM ${a.frm} · last call ${a.lastFrmCallDaysAgo}d ago`,
          metric: `${a.patients} patients · ${Math.round(a.highShare * 100)}% high risk`,
        })),
        body: [
          "Hi,",
          "",
          `Account view for ${scope}${reasonNote}.`,
          "",
          ...view.insights.accounts.map((p) => `• ${p}`),
          "",
          `These ${top.length} accounts hold ${top.reduce((s, a) => s + a.patients, 0)} patients between them.`,
          "",
          ...SIGNOFF,
        ].join("\n"),
      };
    }

    case "payer": {
      const top = view.payers.slice(0, 10);
      return {
        recipientId: "r-payer-contracting",
        subject: `${stageTag}: payer view of ${view.totals.patients.toLocaleString()} patients${reasonNote}`,
        evidenceTitle: "Payers holding these patients",
        evidence: top.map((p) => ({
          label: p.name,
          detail: `${p.scope} ${p.channel} · ${view.plans(p).plansRequiringStep} of ${view.plans(p).plans} plans with a step edit · PA TAT ${p.paTat.toFixed(1)}d`,
          metric: `${p.patients} patients · ${Math.round(p.firstPassApproval * 100)}% first-pass`,
        })),
        body: [
          "Hi,",
          "",
          `Payer view for ${scope}${reasonNote}.`,
          "",
          ...view.insights.payers.map((p) => `• ${p}`),
          "",
          ...SIGNOFF,
        ].join("\n"),
      };
    }

    case "sp": {
      return {
        recipientId: "r-sp-contracting",
        subject: `${stageTag}: specialty pharmacy performance${reasonNote}`,
        evidenceTitle: "Specialty pharmacies serving this cohort",
        evidence: view.sps.map((s) => ({
          label: s.name,
          detail: `${s.paSupport} · historical fill rate ${Math.round(s.pastFillRate * 100)}%`,
          metric: `${s.patients} patients · ${s.avgDaysToShip.toFixed(1)}d to ship`,
        })),

        body: [
          "Hi,",
          "",
          `Specialty pharmacy view for ${scope}${reasonNote}.`,
          "",
          ...view.insights.sp.map((p) => `• ${p}`),
          "",
          ...SIGNOFF,
        ].join("\n"),
      };
    }

    case "roles": {
      return {
        recipientId: "r-hub",
        subject: `${stageTag}: PSP utilization across field and hub${reasonNote}`,
        evidenceTitle: "Coverage of this cohort",
        evidence: [
          ...view.frms.slice(0, 5).map((f) => ({
            label: `FRM · ${f.name}`,
            detail: `${f.territory} · ${f.callsLast30} calls in 30d`,
            metric: `${f.patients} patients · ${Math.round(f.paFocusedCallShare * 100)}% blocker-focused`,
          })),
          ...view.caseManagers.slice(0, 4).map((c) => ({
            label: `Case mgr · ${c.name}`,
            detail: `${c.pod} · ${c.touchesPerCase.toFixed(1)} touches / case`,
            metric: `${c.patients} patients · ${c.avgProcessingDays}d per case`,
          })),
          ...view.intakeSpecialists.slice(0, 4).map((s) => ({
            label: `Intake · ${s.name}`,
            detail: `${s.pod} · ${s.avgTat.toFixed(1)}d intake TAT`,
            metric: `${s.patients} patients · ${Math.round(s.cleanSubmissionRate * 100)}% clean`,
          })),
        ],
        body: [
          "Hi,",
          "",
          `PSP utilization for ${scope}${reasonNote}.`,
          "",
          ...view.insights.roles.map((p) => `• ${p}`),
          "",
          ...SIGNOFF,
        ].join("\n"),
      };
    }

    case "summary":
    default: {
      const reasons = [...view.reasons, ...view.supplementalReasons];
      return {
        recipientId: "r-ma",
        subject: `${stageTag}: what is holding ${view.totals.patients.toLocaleString()} patients${reasonNote}`,
        evidenceTitle: "Primary reasons patients are open",
        evidence: reasons.map((r) => ({
          label: r.short,
          detail: r.detail,
          metric: `${r.patients} patients · ${Math.round((r.patients / (view.patients || 1)) * 100)}%`,
        })),
        body: [
          "Hi team,",
          "",
          `Summary of ${scope}${reasonNote}, as of the latest data refresh.`,
          "",
          `Average time in stage is ${view.avgDays} days against ${view.expectedDays} days expected, and ${Math.round((view.totals.risk.high / (view.totals.patients || 1)) * 100)}% of these patients are at ${view.riskLabel}.`,
          "",
          "What is driving it:",
          ...view.insights.exec.map((p) => `• ${p}`),
          "",
          "Reason-level breakdown is below. Request your view on where to intervene first.",
          "",
          ...SIGNOFF,
        ].join("\n"),
      };
    }
  }
}
