/**
 * Reason slicing.
 *
 * Takes a StageView (a whole stage, or the whole book of business) and narrows
 * every lens — payers, states, accounts, specialty pharmacies and PSP roles —
 * to the patients blocked by one specific reason. All slices are apportioned
 * with a largest-remainder pass, so every panel reconciles exactly to the
 * reason's patient count shown on the executive summary.
 */

import type { StageView } from "./psp-stage-view";
import type {
  PaAccount,
  PaCaseManager,
  PaFrm,
  PaIntakeSpecialist,
  PaPayer,
  PaSp,
  PaState,
  RiskSplit,
} from "./psp-stage-data";

/** Largest-remainder apportionment. Zero weights stay at zero. */
function apportion(weights: number[], target: number): number[] {
  const out = weights.map(() => 0);
  const idx = weights.map((w, i) => ({ w, i })).filter((x) => x.w > 0);
  if (!idx.length || target <= 0) return out;
  const sum = idx.reduce((s, x) => s + x.w, 0);
  const exact = idx.map((x) => (x.w / sum) * target);
  const base = exact.map((v) => Math.floor(v));
  let remainder = target - base.reduce((s, v) => s + v, 0);
  const order = exact
    .map((v, k) => ({ k, frac: v % 1 }))
    .sort((a, b) => b.frac - a.frac)
    .map((x) => x.k);
  let c = 0;
  while (remainder > 0) {
    base[order[c % order.length]] += 1;
    remainder -= 1;
    c += 1;
  }
  idx.forEach((x, k) => {
    out[x.i] = base[k];
  });
  return out;
}

/* --------------------------------------------------------------- affinities */

/**
 * How strongly a reason pulls toward a given entity. Weights are multiplied by
 * the entity's stage-level patient count, so slices stay proportional but tilt
 * toward the parts of the network that actually cause the blocker.
 */
function payerAffinity(
  reasonId: string,
  p: PaPayer,
  plans: { plans: number; plansRequiringStep: number },
  swCodes: Set<string>,
): number {
  const stepShare = plans.plans ? plans.plansRequiringStep / plans.plans : 0;
  switch (reasonId) {
    case "new-hcp":
      // New offices submit against whatever plan the patient already has, but
      // the plans with the most criteria bite hardest on an inexperienced office.
      return 0.5 + p.complexity / 7 + (p.requiresLmn ? 0.4 : 0) + 1.4 * stepShare;

    case "step":
      return p.requiresStepTherapy ? 0.35 + 2.4 * stepShare : 0;

    case "lmn":
      return p.requiresLmn ? 1.7 : 0.35;
    case "appeal":
      return 0.3 + 3 * (1 - p.firstPassApproval);
    case "docs":
      return 0.35 + p.complexity / 8;
    case "verification":
    case "inactive":
    case "secondary":
    case "bin-pcn":
    case "reauth":
      return 0.4 + p.complexity / 9;
    case "copay":
    case "copay-lapse":
      return p.channel === "Medicare" ? 2.1 : 0.8;
    default:
      return 1;
  }
}

function accountAffinity(reasonId: string, a: PaAccount): number {
  // Only offices that recently started prescribing carry these patients.
  if (reasonId === "new-hcp") return a.newToBrand ? 1 : 0;
  const rank = a.reasons.indexOf(reasonId);
  const base = rank === 0 ? 2.2 : rank === 1 ? 1.4 : rank === 2 ? 1 : 0.3;
  switch (reasonId) {

    case "lmn":
    case "office-followup":
    case "no-signature":
      // Offices that have not been worked recently hold the paperwork.
      return base * (1 + Math.min(1.1, a.lastFrmCallDaysAgo / 26));
    case "docs":
    case "incomplete-referral":
      return base * (a.size === "Small" ? 1.45 : 0.85);
    case "appeal":
      return base * (a.centerOfExcellence ? 1.3 : 0.95);
    case "unreachable":
      return base * (a.setting === "Rural" ? 1.5 : 0.85);
    default:
      return base;
  }
}

function spAffinity(reasonId: string, s: PaSp): number {
  switch (reasonId) {
    case "lmn":
    case "appeal":
      return s.paSupport.toLowerCase().includes("manual") ? 1.8 : 0.8;
    case "cold-chain":
    case "sp-capacity":
      return 0.4 + s.avgDaysToShip / 2.5;
    default:
      return 1;
  }
}

/* -------------------------------------------------------------------- slice */

export function sliceViewByReason(view: StageView, reasonId: string): StageView {
  const reason = view.reasonById[reasonId];
  if (!reason) return view;
  const total = reason.patients;

  /* accounts */
  const accountWeights = view.accounts.map((a) => a.patients * accountAffinity(reasonId, a));
  const accountCounts = apportion(accountWeights, total);
  const accounts: PaAccount[] = view.accounts
    .map((a, i) => ({ ...a, patients: accountCounts[i] }))
    .filter((a) => a.patients > 0)
    .sort((x, y) => y.patients - x.patients);

  /* states derived from the sliced accounts, so geography always reconciles */
  const codes = Array.from(new Set(accounts.map((a) => a.state)));
  const states: PaState[] = codes
    .map((code) => {
      const list = accounts.filter((a) => a.state === code);
      const source = view.states.find((s) => s.code === code);
      const patients = list.reduce((s, a) => s + a.patients, 0);
      const risk = list.reduce<RiskSplit>(
        (acc, a) => {
          const high = Math.min(a.patients, Math.round(a.patients * a.highShare));
          const medium = Math.round((a.patients - high) * 0.62);
          return {
            high: acc.high + high,
            medium: acc.medium + medium,
            low: acc.low + (a.patients - high - medium),
          };
        },
        { high: 0, medium: 0, low: 0 },
      );
      return {
        code,
        name: list[0].stateName,
        region: list[0].region,
        patients,
        accounts: list,
        risk,
        avgDays: source?.avgDays ?? view.avgDays,
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

  /* payers */
  const swCodes = new Set(states.filter((s) => s.region === "Southwest").map((s) => s.code));
  const payerWeights = view.payers.map(
    (p) => p.patients * payerAffinity(reasonId, p, view.plans(p), swCodes),
  );

  const payerCounts = apportion(payerWeights, total);
  const payers: PaPayer[] = view.payers
    .map((p, i) => ({ ...p, patients: payerCounts[i] }))
    .filter((p) => p.patients > 0)
    .sort((a, b) => b.patients - a.patients);

  const payerStep: Record<string, number> =
    reasonId === "step"
      ? Object.fromEntries(payers.map((p) => [p.id, p.patients]))
      : Object.fromEntries(
          payers
            .filter((p) => p.requiresStepTherapy)
            .map((p) => [p.id, Math.min(p.patients, view.payerStep[p.id] ?? 0)]),
        );
  const totalStepPatients = Object.values(payerStep).reduce((s, v) => s + v, 0);

  /* specialty pharmacies */
  const spCounts = apportion(
    view.sps.map((s) => s.patients * spAffinity(reasonId, s)),
    total,
  );
  const sps: PaSp[] = view.sps
    .map((s, i) => ({ ...s, patients: spCounts[i] }))
    .filter((s) => s.patients > 0);

  /* roles — FRMs follow their own accounts exactly */
  const frmPatients = accounts.reduce<Record<string, number>>((acc, a) => {
    acc[a.frm] = (acc[a.frm] ?? 0) + a.patients;
    return acc;
  }, {});
  const frms: PaFrm[] = view.frms
    .map((f) => ({
      ...f,
      patients: frmPatients[f.name] ?? 0,
      accounts: accounts.filter((a) => a.frm === f.name).length,
    }))
    .filter((f) => f.patients > 0)
    .sort((a, b) => b.patients - a.patients);
  const frmCovered = frms.reduce((s, f) => s + f.patients, 0);

  const cmCounts = apportion(
    view.caseManagers.map((c) => c.patients),
    total,
  );
  const caseManagers: PaCaseManager[] = view.caseManagers
    .map((c, i) => ({
      ...c,
      patients: cmCounts[i],
      openCases: Math.max(1, Math.round(cmCounts[i] * 0.36)),
    }))
    .filter((c) => c.patients > 0);

  const intakeCounts = apportion(
    view.intakeSpecialists.map((s) => s.patients),
    total,
  );
  const intakeSpecialists: PaIntakeSpecialist[] = view.intakeSpecialists
    .map((s, i) => ({ ...s, patients: intakeCounts[i] }))
    .filter((s) => s.patients > 0);

  const navCounts = apportion(
    view.nurseNavigators.map((n) => n.patients),
    view.showNurseNavigators ? total : 0,
  );
  const nurseNavigators = view.nurseNavigators.map((n, i) => ({ ...n, patients: navCounts[i] }));

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

  const stageWord = view.isAll ? "the journey" : `the ${view.label.toLowerCase()} stage`;
  const topState = states[0];
  const topAccount = accounts[0];
  const topPayer = payers[0];
  const regional = payers.filter((p) => p.scope === "Regional");

  return {
    ...view,
    reasonId,
    reasonLabel: reason.short,
    patients: total,
    reasons: [reason],
    supplementalReasons: [],

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
    insights: {
      exec: [
        `${total} patients in ${stageWord} are blocked by ${reason.short.toLowerCase()} — ${Math.round((total / (view.patients || 1)) * 100)}% of the stage.`,
        reason.detail,
      ],
      geography: [
        `${topState?.name ?? "—"} holds the most of these patients (${topState?.patients ?? 0} of ${totals.patients}); the Southwest carries ${totals.southwest}.`,
        `Rural and small sites run the highest ${view.riskLabelShort} within this blocker.`,
      ],
      accounts: [
        `${topAccount?.name ?? "—"} alone holds ${topAccount?.patients ?? 0} of these patients.`,
        `Average last FRM touch on these accounts was ${avgDaysSinceFrmCall} days ago; ${Math.round(genericCallShare * 100)}% of those calls were generic reimbursement education.`,
      ],
      payers: [
        `${topPayer?.name ?? "—"} holds ${topPayer?.patients ?? 0} of these patients; ${regional.length} regional plans hold ${regional.reduce((s, p) => s + p.patients, 0)}.`,
        `Regional plans in this slice approve only ${Math.round((regional.reduce((s, p) => s + p.firstPassApproval, 0) / (regional.length || 1)) * 100)}% on first pass.`,
      ],
      sp: [
        `${sps[0]?.name ?? "—"} carries the largest share of this blocker (${sps[0]?.patients ?? 0} patients).`,
        `The slowest pharmacies in this slice average ${Math.max(...sps.map((s) => s.avgDaysToShip)).toFixed(1)} days to ship.`,
      ],
      roles: [
        `${frms.length} FRMs cover the accounts holding these ${frmCovered} patients.`,
        `${caseManagers[0]?.name ?? "—"} carries the largest case load in this slice (${caseManagers[0]?.patients ?? 0} patients).`,
      ],
    },
  };
}
