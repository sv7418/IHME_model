/**
 * Stage-aware view layer.
 *
 * The Sense & Diagnose lenses were originally hard-wired to the prior-auth
 * cohort. This module turns the prior-auth reference distribution into a
 * cohort for ANY journey stage the user selects — or for the whole book of
 * business when no stage filter is applied — so every page stays internally
 * consistent (accounts, states, payers, SPs and roles always reconcile to the
 * patient count shown on the journey tracker).
 */

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { sliceViewByReason } from "./psp-reason-slice";
import { brands, getBrand, type BrandId, type JourneyStageId } from "./psp-brand";
import {
  paAccounts,
  paCaseManagers,
  paFrms,
  paIntakeSpecialists,
  paPayers,
  paSps,
  payerPlans,
  stepPlanIds,
  type PaAccount,
  type PaCaseManager,
  type PaFrm,
  type PaIntakeSpecialist,
  type PaPayer,
  type PaSp,
  type PaState,
  type RiskSplit,
} from "./psp-stage-data";

/* ------------------------------------------------------------------ scaling */

/** Scale a set of counts to a new total using largest-remainder rounding. */
export function scaleCounts(values: number[], target: number): number[] {
  const sum = values.reduce((s, v) => s + v, 0) || 1;
  const exact = values.map((v) => (v / sum) * target);
  const out = exact.map((v) => Math.max(1, Math.floor(v)));
  let remainder = target - out.reduce((s, v) => s + v, 0);
  const order = exact
    .map((v, i) => ({ i, frac: v % 1 }))
    .sort((a, b) => b.frac - a.frac)
    .map((x) => x.i);
  let k = 0;
  while (remainder > 0) {
    out[order[k % order.length]] += 1;
    remainder -= 1;
    k += 1;
  }
  while (remainder < 0) {
    const idx = order[order.length - 1 - (k % order.length)];
    if (out[idx] > 1) {
      out[idx] -= 1;
      remainder += 1;
    }
    k += 1;
  }
  return out;
}

/* ------------------------------------------------------------------ reasons */

export type StageReason = {
  id: string;
  label: string;
  short: string;
  detail: string;
  patients: number;
};

type ReasonSeed = { id: string; label: string; short: string; detail: string; weight: number };

const reasonSeeds: Record<JourneyStageId | "all", ReasonSeed[]> = {
  referral: [
    { id: "incomplete-referral", label: "Referral form missing required clinical fields", short: "Incomplete referral", detail: "Diagnosis code, WHO class or baseline testing absent on the inbound referral.", weight: 36 },
    { id: "no-signature", label: "Prescriber signature or attestation outstanding", short: "No signature", detail: "Referral cannot be actioned until the prescribing office returns a signed form.", weight: 28 },
    { id: "unreachable", label: "Patient unreachable for referral confirmation", short: "Patient unreachable", detail: "Three or more outbound attempts without a confirmed callback.", weight: 22 },
    { id: "duplicate", label: "Duplicate or misrouted referral pending reconciliation", short: "Duplicate referral", detail: "Referral matched to an existing case or routed to the wrong therapy team.", weight: 14 },
  ],
  rx: [
    { id: "rx-detail", label: "Prescription missing dose, titration plan or site of care", short: "Rx detail missing", detail: "Hub cannot build the case without dose and titration schedule.", weight: 34 },
    { id: "erx-fail", label: "e-Prescription routing failure to the hub", short: "e-Rx routing failure", detail: "EHR transmission failed and the office has not re-sent the script.", weight: 26 },
    { id: "no-insurance", label: "No insurance information captured at intake", short: "No coverage info", detail: "Benefit investigation cannot start without payer and member ID.", weight: 24 },
    { id: "unreachable", label: "Patient unreachable to confirm intake details", short: "Patient unreachable", detail: "Outbound intake calls unanswered for 5+ days.", weight: 16 },
  ],
  enrollment: [
    { id: "consent", label: "Patient consent / HIPAA authorization outstanding", short: "Consent pending", detail: "Enrollment cannot progress until signed consent is returned.", weight: 35 },
    { id: "missing-card", label: "Insurance card or member ID not provided", short: "Missing insurance card", detail: "Coverage cannot be verified without the plan identifiers.", weight: 27 },
    { id: "unreachable", label: "Patient unreachable for enrollment completion", short: "Patient unreachable", detail: "Case manager attempts exhausted; case ageing in the queue.", weight: 22 },
    { id: "office-followup", label: "Prescriber office has not returned the enrollment packet", short: "Office follow-up", detail: "Office-side fields (diagnosis, prior therapy) still blank.", weight: 16 },
  ],
  "benefit-check": [
    { id: "verification", label: "Payer verification response pending", short: "Verification pending", detail: "Electronic eligibility check returned no response; manual call in queue.", weight: 34 },
    { id: "inactive", label: "Coverage inactive or plan not found", short: "Coverage inactive", detail: "Member terminated or moved plans since referral.", weight: 25 },
    { id: "bin-pcn", label: "BIN / PCN or pharmacy-vs-medical benefit mismatch", short: "Benefit mismatch", detail: "Case routed to the wrong benefit; test claim rejected.", weight: 23 },
    { id: "secondary", label: "Secondary coverage or Medicaid spend-down unresolved", short: "Secondary coverage", detail: "Coordination of benefits still open, blocking the PA submission.", weight: 18 },
  ],
  "prior-auth": [
    { id: "step", label: "Payer requires step therapy / prior therapy documentation", short: "Step therapy", detail: "Plan requires documented trial or failure of a background regimen before activation.", weight: 244 },
    { id: "lmn", label: "HCP office delay on letter of medical necessity", short: "LMN delay", detail: "Signed letter of medical necessity or diagnostic report outstanding at the prescriber office.", weight: 187 },
    { id: "appeal", label: "Stuck in appeal after first-pass denial", short: "In appeal", detail: "First-pass denial appealed; plan review clock running beyond 14 days.", weight: 141 },
    { id: "docs", label: "Incomplete benefit / clinical documentation at submission", short: "Incomplete docs", detail: "Missing functional class, walk-test or imaging data on the initial PA packet.", weight: 106 },
  ],
  triage: [
    { id: "sp-assign", label: "Specialty pharmacy assignment pending", short: "SP assignment", detail: "Payer-restricted network not yet confirmed for the patient.", weight: 33 },
    { id: "site-of-care", label: "Site of care unresolved (home vs. in-office)", short: "Site of care", detail: "Payer requires a site-of-care decision before dispense.", weight: 27 },
    { id: "copay", label: "Copay or affordability enrollment incomplete", short: "Copay pending", detail: "Out-of-pocket exposure not yet resolved; patient has not accepted the fill.", weight: 24 },
    { id: "cold-chain", label: "Cold-chain / delivery scheduling window missed", short: "Scheduling", detail: "First available delivery window fell outside the patient's availability.", weight: 16 },
  ],
  shipment: [
    { id: "cold-chain", label: "Cold-chain delivery window missed or rescheduled", short: "Delivery window", detail: "Shipment held for a confirmed signature window.", weight: 32 },
    { id: "copay", label: "Copay unresolved at dispense", short: "Copay at dispense", detail: "Patient declined the fill pending affordability support.", weight: 28 },
    { id: "unreachable", label: "Patient unreachable to confirm delivery", short: "Patient unreachable", detail: "Pharmacy outreach unanswered; shipment on hold.", weight: 24 },
    { id: "sp-capacity", label: "Specialty pharmacy fulfilment backlog", short: "SP backlog", detail: "Pharmacy operating beyond its time-to-ship SLA.", weight: 16 },
  ],
  "nurse-training": [
    { id: "nurse-capacity", label: "Nurse educator capacity / scheduling backlog", short: "Nurse capacity", detail: "No trainer availability within the patient's preferred window.", weight: 34 },
    { id: "patient-cancel", label: "Patient cancelled or no-showed the training visit", short: "Cancellation", detail: "Visit rescheduled at least once; therapy start delayed.", weight: 26 },
    { id: "injection-anxiety", label: "Injection anxiety or caregiver not available", short: "Injection anxiety", detail: "Patient requires a second session or caregiver participation.", weight: 24 },
    { id: "supplies", label: "Ancillary supplies or device kit not delivered", short: "Supplies missing", detail: "Sharps container or reconstitution supplies outstanding.", weight: 16 },
  ],
  persistent: [
    { id: "tolerability", label: "Tolerability / adverse events driving discontinuation risk", short: "Tolerability", detail: "Reported anemia, telangiectasia or injection-site reactions since last refill.", weight: 34 },
    { id: "reauth", label: "Reauthorization or renewal lapse approaching", short: "Reauth lapse", detail: "Payer reauthorization due within 30 days with no packet submitted.", weight: 27 },
    { id: "copay-lapse", label: "Copay support expiring or affordability gap", short: "Copay lapse", detail: "Copay program year ending; out-of-pocket exposure rising.", weight: 23 },
    { id: "monitoring", label: "Missed monitoring visits or lab draws", short: "Monitoring gaps", detail: "Required follow-up labs or echo overdue.", weight: 16 },
  ],
  all: [
    { id: "step", label: "Payer utilisation management (step therapy / PA edits)", short: "Utilisation mgmt", detail: "Step-therapy edits and PA criteria across payer-plan combinations.", weight: 32 },
    { id: "docs", label: "Missing clinical or benefit documentation", short: "Missing docs", detail: "Letters of medical necessity, functional class and benefit details outstanding.", weight: 27 },
    { id: "unreachable", label: "Patient or prescriber office unresponsive", short: "Unresponsive", detail: "Outreach attempts exhausted at referral, enrollment or delivery.", weight: 23 },
    { id: "capacity", label: "Hub / field capacity constraints", short: "Capacity", detail: "Case-manager, intake and nurse-educator capacity concentrated in the Southwest.", weight: 18 },
  ],
};

/* --------------------------------------------------------------- stage flavour */

const coverageStages = new Set<JourneyStageId>(["benefit-check", "prior-auth"]);
const fulfilmentStages = new Set<JourneyStageId>(["triage", "shipment", "persistent"]);
const nurseStages = new Set<JourneyStageId>(["nurse-training", "shipment", "persistent"]);

export type StageView = {
  stageId: JourneyStageId | null;
  /** Set when the view is narrowed to a single blocking reason. */
  reasonId?: string | null;
  reasonLabel?: string | null;
  /** Set when the view is narrowed to a single state. */
  stateId?: string | null;
  /** Set when the view is narrowed to one PE.AI fulfillment risk bucket. */
  riskBucket?: "high" | "medium" | "low" | null;
  stateLabel?: string | null;
  label: string;

  isAll: boolean;
  patients: number;
  avgDays: number;
  expectedDays: number;
  riskLabel: string;
  riskLabelShort: string;
  showStepTherapy: boolean;
  showNurseNavigators: boolean;
  spEmphasis: boolean;
  reasons: StageReason[];
  /** Overlapping lenses (e.g. regional concentration) shown below the primary reasons. */
  supplementalReasons: StageReason[];
  reasonById: Record<string, StageReason>;

  accounts: PaAccount[];
  states: PaState[];
  totals: { patients: number; risk: RiskSplit; southwest: number };
  payers: PaPayer[];
  payerStep: Record<string, number>;
  totalStepPatients: number;
  sps: PaSp[];
  frms: PaFrm[];
  frmCovered: number;
  caseManagers: PaCaseManager[];
  intakeSpecialists: PaIntakeSpecialist[];
  nurseNavigators: { name: string; pod: string; patients: number; avgDaysToTrain: number; completionRate: number }[];
  avgDaysSinceFrmCall: number;
  genericCallShare: number;
  insights: Record<
    "exec" | "geography" | "accounts" | "payers" | "sp" | "roles",
    string[]
  >;
  planIds: (p: PaPayer) => string[];
  plans: (p: PaPayer) => { plans: number; plansRequiringStep: number };
};

function splitRisk(patients: number, highShare: number): RiskSplit {
  const high = Math.min(patients, Math.round(patients * highShare));
  const medium = Math.round((patients - high) * 0.62);
  return { high, medium, low: patients - high - medium };
}

export function accountRiskOf(a: PaAccount): RiskSplit {
  return splitRisk(a.patients, a.highShare);
}

/** Deterministic 0..1 hash so a state's barrier mix is stable across renders. */
function hash01(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

/**
 * How much a barrier over- or under-indexes in one state. Blends a stable
 * pseudo-random tilt with real signals from the state's account mix (rural
 * share, offices new to the brand), so the ranked barriers re-order per state.
 */
function stateReasonTilt(reasonId: string, stateCode: string, pool: PaAccount[]): number {
  const total = pool.reduce((s, a) => s + a.patients, 0) || 1;
  const rural = pool.filter((a) => a.setting === "Rural").reduce((s, a) => s + a.patients, 0) / total;
  const newShare = pool.filter((a) => a.newToBrand).reduce((s, a) => s + a.patients, 0) / total;

  let t = 0.72 + 0.56 * hash01(`${reasonId}:${stateCode}`);
  if (/docs|lmn|signature|verification|card|consent/.test(reasonId)) t *= 1 + 0.5 * rural;
  if (/step|appeal|payer|inactive|bin-pcn|secondary/.test(reasonId)) t *= 1 + 0.4 * (1 - rural);
  if (/unreachable|copay|office|incomplete|detail/.test(reasonId)) t *= 1 + 0.45 * newShare;
  return t;
}

function buildView(
  brandId: BrandId | null,
  stageId: JourneyStageId | null,
  stateId: string | null = null,
  riskBucket: "high" | "medium" | "low" | null = null,
): StageView {
  const brand = getBrand(brandId) ?? brands[0];
  const stage = stageId ? brand.stages.find((s) => s.id === stageId) ?? null : null;
  const isAll = !stage;

  /* -------- geography scope: narrow the account pool to one state --------- */
  const statePool = stateId ? paAccounts.filter((a) => a.state === stateId) : paAccounts;
  const scopedState = stateId && statePool.length ? stateId : null;
  const pool = scopedState ? statePool : paAccounts;
  const stateLabel = scopedState ? pool[0].stateName : null;

  const stageTotal = stage
    ? stage.patients
    : brand.stages.reduce((s, x) => s + x.patients, 0);
  const poolShare = scopedState
    ? pool.reduce((s, a) => s + a.patients, 0) /
      (paAccounts.reduce((s, a) => s + a.patients, 0) || 1)
    : 1;
  const riskShare = riskBucket
    ? riskBucket === "high"
      ? 0.42
      : riskBucket === "medium"
        ? 0.34
        : 0.24
    : 1;
  const patients = Math.max(
    1,
    Math.round(
      (scopedState ? Math.max(pool.length, Math.round(stageTotal * poolShare)) : stageTotal) *
        riskShare,
    ),
  );
  const label = stage ? stage.label : "All stages";
  const avgDays = stage?.avgTat ?? Number(
    (
      brand.stages
        .filter((s) => s.avgTat)
        .reduce((s, x) => s + (x.avgTat ?? 0), 0) /
      brand.stages.filter((s) => s.avgTat).length
    ).toFixed(1),
  );
  const expectedDays = stage?.expectedTat ?? 3;

  const isPersistency = stage?.id === "persistent";
  const riskLabel = isPersistency
    ? "high risk of discontinuation"
    : "high risk of never-start";
  const riskLabelShort = isPersistency ? "discontinuation risk" : "never-start risk";

  // High-risk share tracks how far the stage runs beyond its expected TAT.
  const stageHighShare = isPersistency
    ? 0.28
    : Math.min(0.66, Math.max(0.18, 0.26 + 0.36 * (avgDays / (expectedDays || 1) - 1)));
  const riskFactor = stageHighShare / 0.78;

  /* ------------------------------------------------------------- reasons
   * Reasons overlap: a patient can carry more than one. Each reason is sized
   * independently against the stage total rather than apportioned to sum to it.
   * When a state is selected, weights tilt with that state's account mix so the
   * ranked barriers differ geography by geography.
   */
  const seeds = reasonSeeds[stage?.id ?? "all"];
  const weighted = seeds.map((s) => ({
    seed: s,
    weight: scopedState ? s.weight * stateReasonTilt(s.id, scopedState, pool) : s.weight,
  }));
  const seedTotal = weighted.reduce((s, x) => s + x.weight, 0) || 1;
  const reasons: StageReason[] = weighted.map(({ seed, weight }) => ({
    id: seed.id,
    label: seed.label,
    short: seed.short,
    detail: seed.detail,
    patients: Math.min(patients, Math.max(1, Math.round((weight / seedTotal) * patients * 1.25))),
  }));
  const reasonById = Object.fromEntries(reasons.map((r) => [r.id, r]));

  /* ------------------------------------------------------------ accounts */
  const accountCounts = scaleCounts(
    pool.map((a) => a.patients),
    patients,
  );
  const accounts: PaAccount[] = pool
    .map((a, i) => ({
      ...a,
      patients: accountCounts[i],
      highShare: Math.min(0.97, Math.max(0.05, a.highShare * riskFactor)),
      reasons: [0, 1, 2].map((k) => reasons[(i + k) % reasons.length].id),
    }))
    .sort((x, y) => y.patients - x.patients);


  /* -------------------------------------------------------------- states */
  const codes = Array.from(new Set(accounts.map((a) => a.state)));
  const states: PaState[] = codes
    .map((code) => {
      const list = accounts.filter((a) => a.state === code);
      const statePatients = list.reduce((s, a) => s + a.patients, 0);
      const risk = list.reduce<RiskSplit>(
        (acc, a) => {
          const r = accountRiskOf(a);
          return { high: acc.high + r.high, medium: acc.medium + r.medium, low: acc.low + r.low };
        },
        { high: 0, medium: 0, low: 0 },
      );
      const region = list[0].region;
      return {
        code,
        name: list[0].stateName,
        region,
        patients: statePatients,
        accounts: list,
        risk,
        avgDays: Number(
          (avgDays * (region === "Southwest" ? 1.1 : 0.85) + (statePatients % 5) * 0.06).toFixed(1),
        ),
      };
    })
    .sort((a, b) => b.patients - a.patients);

  const totals = {
    patients: states.reduce((s, x) => s + x.patients, 0),
    risk: states.reduce<RiskSplit>(
      (acc, s) => ({
        high: acc.high + s.risk.high,
        medium: acc.medium + s.risk.medium,
        low: acc.low + s.risk.low,
      }),
      { high: 0, medium: 0, low: 0 },
    ),
    southwest: states.filter((s) => s.region === "Southwest").reduce((s, x) => s + x.patients, 0),
  };

  /* ------------- offices new to the brand join the ranked barrier list ----- */
  const newAccounts = accounts.filter((a) => a.newToBrand);
  const newPatients = newAccounts.reduce((s, a) => s + a.patients, 0);
  if (newPatients > 0) {
    const newHigh = newAccounts.reduce(
      (s, a) => s + Math.min(a.patients, Math.round(a.patients * a.highShare)),
      0,
    );
    // In prior authorization the inexperienced offices carry the largest block
    // of blocked patients, so it ranks first on volume rather than by pinning.
    const topOther = reasons.reduce((m, r) => Math.max(m, r.patients), 0);
    const sized =
      stage?.id === "prior-auth"
        ? Math.min(patients, Math.max(newPatients, topOther + Math.max(3, Math.round(topOther * 0.06))))
        : newPatients;
    const newHighShare = Math.round((newHigh / (newPatients || 1)) * 100);
    const reason: StageReason = {
      id: "new-hcp",
      label: `HCP office is new to prescribing ${brand.wordmark}`,
      short: "New prescriber office",
      detail: `${newAccounts.length} ${newAccounts.length === 1 ? "office" : "offices"} started prescribing ${brand.wordmark} in the last two quarters and hold ${sized} patients; ${newHighShare}% of them are at risk because the office has little experience with the PA criteria and documentation the plans expect.`,
      patients: sized,
    };
    reasons.push(reason);
    reasonById[reason.id] = reason;
  }
  reasons.sort((a, b) => b.patients - a.patients);

  const supplementalReasons: StageReason[] = [];


  const payerCounts = scaleCounts(
    paPayers.map((p) => p.patients),
    patients,
  );
  const payers: PaPayer[] = paPayers.map((p, i) => ({ ...p, patients: payerCounts[i] }));

  const showStepTherapy = isAll || (stage ? coverageStages.has(stage.id) : false);
  const stepTotal = showStepTherapy ? reasonById["step"]?.patients ?? 0 : 0;
  const payerStep: Record<string, number> = (() => {
    if (!stepTotal) return {};
    const raw = payers.map((p) => {
      const { plans, plansRequiringStep } = payerPlans(p);
      return p.requiresStepTherapy && plans ? (p.patients * plansRequiringStep) / plans : 0;
    });
    const eligible = raw.map((v, i) => ({ i, v })).filter((x) => x.v > 0);
    const counts = scaleCounts(
      eligible.map((x) => x.v),
      stepTotal,
    );
    const out: Record<string, number> = {};
    eligible.forEach((x, k) => {
      out[payers[x.i].id] = Math.min(payers[x.i].patients, counts[k]);
    });
    return out;
  })();
  const totalStepPatients = Object.values(payerStep).reduce((s, v) => s + v, 0);

  /* ------------------------------------------------------------------ SP */
  const spCounts = scaleCounts(
    paSps.map((s) => s.patients),
    patients,
  );
  const sps: PaSp[] = paSps.map((s, i) => ({ ...s, patients: spCounts[i] }));

  /* --------------------------------------------------------------- roles */
  const frmNames = new Set(pool.map((a) => a.frm));
  const frmPoolRaw = scopedState ? paFrms.filter((f) => frmNames.has(f.name)) : paFrms;
  const frmPool = frmPoolRaw.length ? frmPoolRaw : paFrms;
  // FRM coverage tracks ~92% of the scoped patients, spread by territory size.
  const frmCounts = scaleCounts(
    frmPool.map((f) => f.patients),
    Math.max(frmPool.length, Math.round(patients * 0.92)),
  );
  const frms: PaFrm[] = frmPool.map((f, i) => ({ ...f, patients: frmCounts[i] }));
  const frmCovered = frms.reduce((s, f) => s + f.patients, 0);



  const cmCounts = scaleCounts(
    paCaseManagers.map((c) => c.patients),
    patients,
  );
  const caseManagers: PaCaseManager[] = paCaseManagers.map((c, i) => ({
    ...c,
    patients: cmCounts[i],
    openCases: Math.max(1, Math.round(cmCounts[i] * 0.36)),
    avgProcessingDays: Number((c.avgProcessingDays * (avgDays / 9.4 || 1) ** 0.4).toFixed(1)),
  }));

  const intakeCounts = scaleCounts(
    paIntakeSpecialists.map((s) => s.patients),
    patients,
  );
  const intakeSpecialists: PaIntakeSpecialist[] = paIntakeSpecialists.map((s, i) => ({
    ...s,
    patients: intakeCounts[i],
  }));

  const showNurseNavigators = isAll || (stage ? nurseStages.has(stage.id) : false);
  const navSeeds = [
    { name: "Hannah Boyd", pod: "Nurse educators – Southwest", avgDaysToTrain: 6.4, completionRate: 0.82, weight: 34 },
    { name: "Grace Mullins", pod: "Nurse educators – Southwest", avgDaysToTrain: 5.8, completionRate: 0.85, weight: 27 },
    { name: "Theo Nakamura", pod: "Nurse educators – West", avgDaysToTrain: 4.1, completionRate: 0.91, weight: 20 },
    { name: "Ivy Sandoval", pod: "Nurse educators – Southeast / Central", avgDaysToTrain: 3.9, completionRate: 0.93, weight: 19 },
  ];
  const navCounts = scaleCounts(
    navSeeds.map((n) => n.weight),
    showNurseNavigators ? patients : navSeeds.length,
  );
  const nurseNavigators = navSeeds.map((n, i) => ({
    name: n.name,
    pod: n.pod,
    patients: navCounts[i],
    avgDaysToTrain: n.avgDaysToTrain,
    completionRate: n.completionRate,
  }));

  const avgDaysSinceFrmCall = Number(
    (
      accounts.reduce((s, a) => s + a.lastFrmCallDaysAgo * a.patients, 0) / (totals.patients || 1)
    ).toFixed(0),
  );
  const genericCallShare = Number(
    (
      accounts
        .filter((a) => /^Gener(al|ic) reimbursement/.test(a.lastFrmCallTopic))
        .reduce((s, a) => s + a.patients, 0) / (totals.patients || 1)
    ).toFixed(2),
  );

  /* ------------------------------------------------------------ insights */
  const swPct = Math.round((totals.southwest / (totals.patients || 1)) * 100);
  const topState = states[0];
  const topReason = reasons[0];
  const regional = payers.filter((p) => p.scope === "Regional");
  const regionalStep = regional.reduce((s, p) => s + (payerStep[p.id] ?? 0), 0);
  const stageWord = isAll ? "the journey" : `the ${label.toLowerCase()} stage`;
  const scopeWord = stateLabel ? `${stageWord} in ${stateLabel}` : stageWord;
  const ruralShare = Math.round(
    (accounts.filter((a) => a.setting === "Rural").reduce((s, a) => s + a.patients, 0) /
      (totals.patients || 1)) *
      100,
  );

  const insights: StageView["insights"] = {
    exec: [
      stateLabel
        ? `${stateLabel} holds ${totals.patients} patients in ${stageWord} across ${accounts.length} accounts and ${frms.length} FRM territor${frms.length === 1 ? "y" : "ies"}; ${ruralShare}% sit in rural or small sites.`
        : `The Southwest holds ${swPct}% of ${stageWord} (${totals.southwest} of ${totals.patients} patients) across ${frms.filter((f) => f.region.includes("Southwest")).length} FRM territories.`,
      isAll && !stateLabel
        ? `Prior auth and benefit investigation together hold the largest share of open patients; ${topReason.patients} patients are blocked by ${topReason.short.toLowerCase()}.`
        : `${topReason.short} is the largest blocker in ${scopeWord} (${topReason.patients} patients, ${Math.round((topReason.patients / (patients || 1)) * 100)}%) and average time in stage is ${avgDays}d vs ${expectedDays}d expected.`,
    ],
    geography: [
      stateLabel
        ? `${stateLabel} carries ${totals.patients} patients in ${stageWord}; ${accounts[0]?.name} alone holds ${accounts[0]?.patients}.`
        : `Five Southwest states carry ${totals.southwest} of ${totals.patients} patients in ${stageWord}; ${topState?.name} alone holds ${topState?.patients}.`,
      `${riskLabel[0].toUpperCase()}${riskLabel.slice(1)} is concentrated in rural and small sites — they run 8-11 points above the national average.`,
    ],

    accounts: [
      `On average these accounts were last called on ${avgDaysSinceFrmCall} days ago or longer.`,
      `${Math.round(genericCallShare * 100)}% of the last FRM calls covered generic reimbursement education rather than the specific blockers in ${stageWord}.`,
    ],
    payers: showStepTherapy
      ? [
          `${regional.length} regional plans hold ${regional.reduce((s, p) => s + p.patients, 0)} of these patients and drive ${totalStepPatients ? Math.round((regionalStep / totalStepPatients) * 100) : 0}% of all step-therapy holds.`,
          `Regional Medicaid MCOs approve only ~50% of requests on first pass versus 74% for national commercial plans.`,
        ]
      : [
          `${regional.length} regional plans hold ${regional.reduce((s, p) => s + p.patients, 0)} of these patients and run the slowest turnaround (10-13 days) whenever a coverage question re-opens.`,
          `Utilisation management is not the active blocker at ${stageWord} — payer mix matters here mainly for site-of-care and copay exposure.`,
        ],
    sp: [
      `${sps[0].name.split(" ")[0]} and ${sps[1].name.split(" ")[0]} handle ${Math.round(((sps[0].patients + sps[1].patients) / (patients || 1)) * 100)}% of volume in ${stageWord} and ship fastest; the two smallest average 4+ days.`,
      `The two slowest SPs also have the lowest historical fill rate (74-79%), so delays there convert into abandonment.`,
    ],
    roles: [
      `${frms.length} FRMs cover accounts holding ${frmCovered} of ${totals.patients} patients (${Math.round((frmCovered / (totals.patients || 1)) * 100)}%).`,
      `Three Southwest pods hold ${caseManagers.slice(0, 3).reduce((s, c) => s + c.patients, 0)} patients and take ${caseManagers[0].avgProcessingDays}-${caseManagers[2].avgProcessingDays} days per case versus ${caseManagers[caseManagers.length - 1].avgProcessingDays} days elsewhere.`,
    ],
  };

  return {
    stageId: stage?.id ?? null,
    stateId: scopedState,
    riskBucket,
    stateLabel,
    label,

    isAll,
    patients,
    avgDays,
    expectedDays,
    riskLabel,
    riskLabelShort,
    showStepTherapy,
    showNurseNavigators,
    spEmphasis: isAll || (stage ? fulfilmentStages.has(stage.id) : false),
    reasons,
    supplementalReasons,

    reasonById,
    accounts,
    states,
    totals,
    payers,
    payerStep,
    totalStepPatients,
    sps,
    frms,
    frmCovered,
    caseManagers,
    intakeSpecialists,
    nurseNavigators,
    avgDaysSinceFrmCall,
    genericCallShare,
    insights,
    planIds: stepPlanIds,
    plans: payerPlans,
  };
}

/* ------------------------------------------------------------------ context */

const StageViewContext = createContext<StageView | null>(null);

export function StageViewProvider({
  brandId,
  stageId,
  reasonId,
  stateId,
  riskBucket,
  children,
}: {
  brandId: BrandId | null;
  stageId: JourneyStageId | null;
  reasonId?: string | null;
  stateId?: string | null;
  riskBucket?: "high" | "medium" | "low" | null;
  children: ReactNode;
}) {
  const value = useMemo(() => {
    const base = buildView(brandId, stageId, stateId ?? null, riskBucket ?? null);
    const sliced = reasonId ? sliceViewByReason(base, reasonId) : base;
    return {
      ...sliced,
      stateId: base.stateId,
      stateLabel: base.stateLabel,
      riskBucket: base.riskBucket,
    };
  }, [brandId, stageId, reasonId, stateId, riskBucket]);
  return <StageViewContext.Provider value={value}>{children}</StageViewContext.Provider>;
}


export function useStageView() {
  const ctx = useContext(StageViewContext);
  if (!ctx) throw new Error("useStageView must be used within StageViewProvider");
  return ctx;
}

/** Same view, but null outside a provider — for chrome shared with other pages. */
export function useStageViewOptional(): StageView | null {
  return useContext(StageViewContext);
}


export const journeyStageIds: JourneyStageId[] = [
  "referral",
  "rx",
  "enrollment",
  "benefit-check",
  "prior-auth",
  "triage",
  "shipment",
  "nurse-training",
  "persistent",
];

export function isJourneyStageId(v: unknown): v is JourneyStageId {
  return typeof v === "string" && (journeyStageIds as string[]).includes(v);
}
