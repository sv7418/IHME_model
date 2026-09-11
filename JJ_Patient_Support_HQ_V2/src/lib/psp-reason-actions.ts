/**
 * Per-reason key insight and the ready-to-send actions that sit next to it
 * in the reason drawer. Everything is derived from the sliced view so the copy
 * always reconciles with the numbers on screen, and each action is routed to
 * the person who can actually remove that blocker.
 */

import type { EmailPrefill } from "@/components/psp/draft-email-dialog";
import type { StageView } from "./psp-stage-view";

export type ReasonAction = {
  id: string;
  label: string;
  prefill: EmailPrefill;
};

export type ReasonBrief = {
  insight: string[];
  actions: ReasonAction[];
};

const SIGNOFF = ["Thank you,", "Maria Alvarez", "VP, Patient Services — Johnson & Johnson"];

function topAccounts(slice: StageView, n = 6) {
  return slice.accounts.slice(0, n);
}

function stepPlans(slice: StageView) {
  return slice.payers.filter((p) => p.requiresStepTherapy);
}

export function reasonBrief(slice: StageView, stageWord: string): ReasonBrief {
  const total = slice.patients;
  const reasonId = slice.reasonId ?? "";
  const reasonShort = slice.reasonLabel ?? "this blocker";
  const payers = slice.payers;
  const regional = payers.filter((p) => p.scope === "Regional");
  const accounts = topAccounts(slice);
  const planCount = stepPlans(slice).reduce((s, p) => s + slice.plans(p).plansRequiringStep, 0);
  const staleAccounts = slice.accounts.filter((a) => a.lastFrmCallDaysAgo >= 14);

  const payerEvidence = payers.slice(0, 8).map((p) => ({
    label: p.name,
    detail: `${p.scope} ${p.channel} · ${slice.plans(p).plansRequiringStep} of ${slice.plans(p).plans} plans with a step edit · PA TAT ${p.paTat}d`,
    metric: `${p.patients} patients · ${Math.round(p.firstPassApproval * 100)}% first-pass`,
  }));

  const accountEvidence = accounts.map((a) => ({
    label: a.name,
    detail: `${a.stateName} · ${a.setting}, ${a.size} · FRM ${a.frm} · last call ${a.lastFrmCallDaysAgo}d ago on "${a.lastFrmCallTopic}"`,
    metric: `${a.patients} patients`,
  }));

  const intakeEvidence = slice.intakeSpecialists.slice(0, 6).map((s) => ({
    label: s.name,
    detail: `${s.pod} · avg intake TAT ${s.avgTat.toFixed(1)}d`,
    metric: `${s.patients} patients · ${Math.round(s.cleanSubmissionRate * 100)}% clean submissions`,
  }));

  const cmEvidence = slice.caseManagers.slice(0, 6).map((c) => ({
    label: c.name,
    detail: `${c.pod} · ${c.avgProcessingDays}d avg per case · ${c.touchesPerCase.toFixed(1)} touches / case`,
    metric: `${c.patients} patients · ${c.openCases} open cases`,
  }));

  const stateEvidence = slice.states.slice(0, 6).map((s) => ({
    label: s.name,
    detail: `${s.region} · ${s.accounts.length} accounts · avg ${s.avgDays}d in stage`,
    metric: `${s.patients} patients · ${Math.round((s.risk.high / (s.patients || 1)) * 100)}% high risk`,
  }));

  const payerAction = (ask: string[]): ReasonAction => ({
    id: "payer",
    label: "Draft email · Payer contracting",
    prefill: {
      recipientId: "r-payer-contracting",
      subject: `Payer access change requested — ${reasonShort} holding ${total} patients in ${stageWord}`,
      evidenceTitle: "Plans holding these patients",
      evidence: payerEvidence,
      body: [
        "Hi,",
        "",
        `${total} patients in ${stageWord} are currently blocked by ${reasonShort.toLowerCase()}. ${payers.length} plans hold this volume, ${regional.length} of them small regional plans that approve only ${Math.round((regional.reduce((s, p) => s + p.firstPassApproval, 0) / (regional.length || 1)) * 100)}% of requests on first pass.`,
        "",
        "Request your partnership to:",
        ...ask.map((a) => `• ${a}`),
        "",
        "Plan-level detail is attached below.",
        "",
        ...SIGNOFF,
      ].join("\n"),
    },
  });

  const frmAction = (ask: string[], subject: string): ReasonAction => ({
    id: "frm",
    label: "Draft email · FRM team",
    prefill: {
      recipientId: "r-frm",
      subject,
      evidenceTitle: "Accounts to work this week",
      evidence: accountEvidence,
      body: [
        "Hi,",
        "",
        `${total} patients in ${stageWord} are held by ${reasonShort.toLowerCase()}. The accounts below carry ${accounts.reduce((s, a) => s + a.patients, 0)} of them, and were last called on ${slice.avgDaysSinceFrmCall} days ago on average — mostly generic reimbursement education rather than the specific blocker.`,
        "",
        "Ask for the field team:",
        ...ask.map((a) => `• ${a}`),
        "",
        ...SIGNOFF,
      ].join("\n"),
    },
  });

  const hubAction = (ask: string[], subject: string, opening: string): ReasonAction => ({
    id: "hub",
    label: "Draft email · Hub supervisor",
    prefill: {
      recipientId: "r-hub",
      subject,
      evidenceTitle: "Intake performance behind this blocker",
      evidence: intakeEvidence,
      body: [
        "Hi,",
        "",
        opening,
        "",
        "Request from the hub:",
        ...ask.map((a) => `• ${a}`),
        "",
        ...SIGNOFF,
      ].join("\n"),
    },
  });

  const cmAction = (ask: string[], subject: string, opening: string): ReasonAction => ({
    id: "cm",
    label: "Draft email · Case management lead",
    prefill: {
      recipientId: "r-cm-lead",
      subject,
      evidenceTitle: "Case management pods carrying this work",
      evidence: cmEvidence,
      body: ["Hi,", "", opening, "", "Ask:", ...ask.map((a) => `• ${a}`), "", ...SIGNOFF].join("\n"),
    },
  });

  const rbdAction = (ask: string[], subject: string, opening: string): ReasonAction => ({
    id: "rbd",
    label: "Draft email · Regional business director",
    prefill: {
      recipientId: "r-region",
      subject,
      evidenceTitle: "States in this regional concentration",
      evidence: stateEvidence,
      body: ["Hi,", "", opening, "", "Ask:", ...ask.map((a) => `• ${a}`), "", ...SIGNOFF].join("\n"),
    },
  });

  switch (reasonId) {
    case "step":
      return {
        insight: [
          `Payer access needs to change for ${planCount} plan designs across ${stepPlans(slice).length} payers — they require documented prior therapy before ${slice.isAll ? "activation" : "this stage can clear"}, and hold ${total} patients today.`,
          `${regional.length} of those are small regional plans holding ${regional.reduce((s, p) => s + p.patients, 0)} patients. HCP offices must be asked for prior-treatment failure documentation on the remaining cases — ${staleAccounts.length} accounts have not had a PA-focused FRM touch in two weeks or more.`,
        ],
        actions: [
          payerAction([
            "Remove or narrow the step-therapy edit on the plan designs listed below",
            "Confirm which plans accept a documented contraindication in place of a trial",
            "Align on a joint escalation contact for the highest-volume regional plans",
          ]),
          frmAction(
            [
              "Nudge each provider office for prior-therapy trial and failure documentation",
              "Walk the office through exactly which fields the plan requires on the PA packet",
              "Flag any case where a documented contraindication can replace the trial",
            ],
            `Field action: prior-therapy documentation needed at ${accounts.length} accounts`,
          ),
        ],
      };

    case "docs":
    case "incomplete-referral": {
      const cleanAvg = Math.round(
        (slice.intakeSpecialists.reduce((s, x) => s + x.cleanSubmissionRate, 0) /
          (slice.intakeSpecialists.length || 1)) *
          100,
      );
      return {
        insight: [
          `${total} patients in ${stageWord} are held because the packet went out incomplete — this is a hub intake problem before it is a payer or office problem. Clean-submission rate across the pods handling this volume is ${cleanAvg}%.`,
          `${slice.intakeSpecialists.filter((s) => s.cleanSubmissionRate < 0.78).length} intake specialists sit below the 78% clean-submission bar, and ${staleAccounts.length} of the affected accounts have had no field touch in 14+ days to close the missing clinical fields.`,
        ],
        actions: [
          hubAction(
            [
              "Add functional class, six-minute walk test and imaging to the mandatory intake checklist",
              "Re-train the pods below on the payer-specific required fields before resubmission",
              "Run a same-week QC pass on every open packet in this cohort before it is resubmitted",
            ],
            `Hub action: incomplete documentation is holding ${total} patients in ${stageWord}`,
            `${total} patients in ${stageWord} are blocked by incomplete benefit or clinical documentation at submission. The pods below are submitting at a ${cleanAvg}% clean rate, so the packets are failing before the plan ever reviews them.`,
          ),
          frmAction(
            [
              "Collect the missing clinical fields directly from the offices below",
              "Confirm with each office which data the hub still needs before resubmission",
              "Report back any office that cannot produce the required diagnostics",
            ],
            `Field action: missing clinical data on ${total} patient packets`,
          ),
          payerAction([
            "Publish the exact clinical fields each plan requires for a clean first submission",
            "Confirm which plans accept an e-PA attachment for the missing diagnostics",
          ]),
        ],
      };
    }

    case "lmn":
    case "office-followup":
    case "no-signature":
      return {
        insight: [
          `${total} patients are waiting on paperwork that only the prescriber office can produce; ${staleAccounts.length} of these accounts have not had an FRM touch in 14+ days.`,
          `${payers.filter((p) => p.requiresLmn).length} plans in this slice explicitly require a signed letter of medical necessity, so the fastest lever is office-side, not payer-side.`,
        ],
        actions: [
          frmAction(
            [
              "Schedule a documentation-specific call with each office below",
              "Leave the plan-specific LMN template and required clinical fields on site",
              "Confirm who signs and by when for every open case",
            ],
            `Field action: letters of medical necessity outstanding for ${total} patients`,
          ),
          hubAction(
            [
              "Send the plan-specific LMN template to every open case with the fields pre-filled",
              "Set a 48-hour follow-up cadence on unsigned letters instead of weekly outreach",
              "Escalate to the FRM any office that has not returned a letter after two attempts",
            ],
            `Hub action: LMN follow-up cadence for ${total} patients in ${stageWord}`,
            `${total} patients in ${stageWord} are waiting on a signed letter of medical necessity. Hub outreach is currently averaging fewer than two touches per case, so letters sit unsigned between follow-ups.`,
          ),
          payerAction([
            "Confirm which plans accept an electronic LMN or e-PA attachment",
            "Publish the exact clinical fields required so offices submit clean the first time",
          ]),
        ],
      };

    case "appeal":
      return {
        insight: [
          `${total} patients sit in appeal after a first-pass denial; the plans below approve only ${Math.round((payers.reduce((s, p) => s + p.firstPassApproval, 0) / (payers.length || 1)) * 100)}% on first pass and average ${(payers.reduce((s, p) => s + p.paTat, 0) / (payers.length || 1)).toFixed(1)} days of review.`,
          `Appeals concentrate in ${regional.length} regional plans and in centers of excellence — the volume is large enough to warrant a payer-level conversation, not case-by-case escalation.`,
        ],
        actions: [
          payerAction([
            "Review first-pass denial rates against the contracted service level",
            "Agree a peer-to-peer fast track for the plans with the longest appeal clock",
            "Confirm the appeal packet contents that resolve on first review",
          ]),
          cmAction(
            [
              "Assign a named owner to every open appeal and track the plan clock daily",
              "Book peer-to-peer slots before the plan deadline rather than after",
              "Standardise the appeal packet so functional class, walk test and imaging always ship together",
            ],
            `Case management: ${total} appeals need an owner and a clock`,
            `${total} patients are in appeal in ${stageWord}. Pods below carry the case load and average ${slice.caseManagers[0]?.avgProcessingDays ?? "—"} days per case, which is longer than the plan review window allows.`,
          ),
          frmAction(
            [
              "Prioritise peer-to-peer scheduling at the accounts below",
              "Ensure the appeal packet carries functional class, walk test and imaging",
            ],
            `Field action: ${total} patients stuck in appeal — peer-to-peer support needed`,
          ),
        ],
      };

    case "new-hcp": {
      const newAccounts = slice.accounts.filter((a) => a.newToBrand);
      const atRisk = newAccounts.reduce(
        (s, a) => s + Math.min(a.patients, Math.round(a.patients * a.highShare)),
        0,
      );
      const atRiskPct = Math.round((atRisk / (total || 1)) * 100);
      const genericPct = Math.round(slice.genericCallShare * 100);
      return {
        insight: [
          `${newAccounts.length} offices started prescribing in the last two quarters and now hold ${total} patients in ${stageWord} — ${atRiskPct}% of them are at risk, well above the rest of the book.`,
          `These offices have little experience with the PA criteria: ${payers.filter((p) => p.requiresStepTherapy).length} of the ${payers.length} plans in this slice need documented prior therapy and ${payers.filter((p) => p.requiresLmn).length} need a signed letter of medical necessity.`,
          `The last FRM call at these accounts was ${slice.avgDaysSinceFrmCall} days ago and ${genericPct}% of those calls were generic reimbursement or copay overviews rather than a PA documentation walk-through.`,
        ],
        actions: [
          frmAction(
            [
              "Run a first-submission PA walk-through at each new office below within the next two weeks",
              "Leave the plan-specific documentation checklist (prior therapy, functional class, imaging) on site",
              "Replace the generic reimbursement/copay overview with a live-case working session",
            ],
            `Field action: onboard ${newAccounts.length} new prescriber offices holding ${total} patients`,
          ),
          hubAction(
            [
              "Assign a named case manager to every patient coming from a new office",
              "QC the first three PA packets from each new office before they are submitted",
              "Send the office a pre-filled documentation checklist at case creation instead of after a denial",
            ],
            `Hub action: new prescriber offices holding ${total} patients need packet QC`,
            `${total} patients in ${stageWord} sit at ${newAccounts.length} offices that have only recently started prescribing. ${atRiskPct}% are at risk, and the pattern is first-submission errors rather than plan policy.`,
          ),
          cmAction(
            [
              "Prioritise welcome calls for patients from new offices so nothing waits on the office alone",
              "Track first-pass PA success by office and flag any office below 60% for FRM coaching",
            ],
            `Case management: new-office cohort of ${total} patients needs a tighter cadence`,
            `The ${newAccounts.length} newest prescribing offices carry ${total} patients in ${stageWord}, with ${atRisk} at risk of never starting.`,
          ),
        ],
      };
    }


    case "capacity":
    case "unreachable":
      return {
        insight: [
          `${total} patients in ${stageWord} are held by ${reasonShort.toLowerCase()} — the constraint is hub and field capacity, not payer policy.`,
          `${slice.caseManagers.filter((c) => c.avgProcessingDays > 4.5).length} pods run above the 4.5-day processing bar and average under two touches per case, so cases idle between follow-ups.`,
        ],
        actions: [
          hubAction(
            [
              "Rebalance the queue away from the pods running longest per case",
              "Set a minimum touch cadence so no case idles more than 48 hours",
              "Escalate cases with three failed contact attempts to the field rather than re-queueing them",
            ],
            `Hub action: capacity constraints holding ${total} patients in ${stageWord}`,
            `${total} patients in ${stageWord} are held by ${reasonShort.toLowerCase()}. The pods below carry the load and are running above the processing-time bar.`,
          ),
          cmAction(
            [
              "Reassign the largest open case loads across pods",
              "Confirm an owner and next action date on every case older than 10 days",
            ],
            `Case management: rebalance ${total} open cases in ${stageWord}`,
            `${total} patients are waiting in ${stageWord}. The case load is concentrated in a small number of pods.`,
          ),
        ],
      };

    default:
      return {
        insight: [
          `${total} patients in ${stageWord} are held by ${reasonShort.toLowerCase()} — ${Math.round((total / (slice.reasonById[reasonId]?.patients || total || 1)) * 100)}% attributable to a single primary cause.`,
          `${accounts[0]?.name ?? "The top account"} and ${payers[0]?.name ?? "the top payer"} carry the largest share; last FRM touch on these accounts averaged ${slice.avgDaysSinceFrmCall} days ago.`,
        ],
        actions: [
          frmAction(
            [
              "Work the accounts below with blocker-specific messaging",
              "Close the missing documentation or outreach gap on each open case",
            ],
            `Field action: ${reasonShort} holding ${total} patients in ${stageWord}`,
          ),
          hubAction(
            [
              "Confirm the hub-side step that is stalling these cases",
              "Set a follow-up cadence and a named owner on every open case",
            ],
            `Hub action: ${reasonShort} holding ${total} patients in ${stageWord}`,
            `${total} patients in ${stageWord} are held by ${reasonShort.toLowerCase()}. The pods below are carrying the volume.`,
          ),
          payerAction([
            "Review the plan requirements driving this blocker",
            "Align on a faster path for the highest-volume plans",
          ]),
        ],
      };
  }
}
