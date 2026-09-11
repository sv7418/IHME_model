import type { StageView } from "@/lib/psp-stage-view";

export type ServiceId =
  | "hub"
  | "frm"
  | "nurse"
  | "copay"
  | "bridge"
  | "sp-services"
  | "digital";

export type Service = { id: ServiceId; label: string; short: string; color: string };

export const services: Service[] = [
  { id: "hub", label: "Hub enrollment (Case Manager)", short: "Hub / CM", color: "var(--signal)" },
  { id: "frm", label: "Field Reimbursement Manager", short: "FRM", color: "var(--risk-1)" },
  { id: "nurse", label: "Nurse Navigator", short: "Nurse Nav", color: "var(--risk-2)" },
  { id: "copay", label: "Copay / Savings Card", short: "Copay", color: "var(--risk-3)" },
  { id: "bridge", label: "Bridge / Free Goods", short: "Bridge", color: "var(--risk-4)" },
  { id: "sp-services", label: "SP Services", short: "SP Services", color: "var(--risk-5)" },
  { id: "digital", label: "Digital enrollment & reminders", short: "Digital", color: "var(--primary)" },
];

export function serviceLabel(id: ServiceId) {
  return services.find((s) => s.id === id)?.label ?? id;
}

export function serviceShort(id: ServiceId) {
  return services.find((s) => s.id === id)?.short ?? id;
}

/** Deterministic 0..1 hash so every render (and SSR) produces identical numbers. */
function hash01(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

function viewSeed(view: StageView) {
  return `${view.stageId ?? "all"}|${view.reasonId ?? "none"}`;
}

/* --------------------------------------------------------------- registrations */

export type Registration = {
  id: ServiceId;
  service: string;
  label: string;
  patients: number;
  share: number;
  /** Percentage-point change vs the prior year for the same cohort definition. */
  yoy: number;
  cap: string;
};

/** Per-service registered patients for the filtered cohort. Every count is a
 *  strict subset of the cohort, and each service is capped by the population
 *  that can logically use it. */
export function buildCohortRegistrations(view: StageView): Registration[] {
  const cohort = view.patients;
  if (!cohort) return [];

  const commercial = view.payers
    .filter((p) => p.channel === "Commercial")
    .reduce((s, p) => s + p.patients, 0);
  const publicPay = view.payers
    .filter((p) => p.channel !== "Commercial")
    .reduce((s, p) => s + p.patients, 0);
  const highRisk = view.totals.risk.high;

  const clamp = (n: number, cap: number) => Math.max(0, Math.min(cap, Math.round(n)));
  const j = (id: string, spread = 0.06) => 1 + (hash01(`${viewSeed(view)}|${id}`) - 0.5) * spread;

  // Hub enrollment is the front door and the upper bound for hub-delivered services.
  const hubShare =
    view.stageId === "referral" || view.stageId === "rx"
      ? 0.74
      : view.stageId === "enrollment"
        ? 0.88
        : 0.94;
  const hub = clamp(cohort * hubShare * j("hub", 0.03), cohort);

  const frm = clamp(Math.min(view.frmCovered, cohort) * 0.82 * j("frm"), cohort);

  const nurseBase = view.showNurseNavigators ? 0.61 : 0.27;
  const nurse = clamp(hub * nurseBase * j("nurse"), hub);

  const copay = clamp(
    Math.min(commercial, cohort) * 0.63 * j("copay"),
    Math.min(hub, Math.min(commercial, cohort)),
  );

  const bridgeEligible = Math.round(highRisk * 0.55 + publicPay * 0.08);
  const bridge = clamp(bridgeEligible * 0.42 * j("bridge", 0.1), Math.min(hub, bridgeEligible));

  const spTotal = view.sps.reduce((s, x) => s + x.patients, 0);
  const spServices = clamp(Math.min(spTotal, cohort) * 0.88 * j("sp"), cohort);

  const digital = clamp(hub * 0.36 * j("digital", 0.12), hub);

  const counts: Record<ServiceId, number> = {
    hub,
    frm,
    nurse,
    copay,
    bridge,
    "sp-services": spServices,
    digital,
  };

  const caps: Record<ServiceId, string> = {
    hub: "All enrolled patients in this cohort",
    frm: `FRM-covered accounts hold ${Math.min(view.frmCovered, cohort).toLocaleString()} patients`,
    nurse: "Capped by hub-enrolled patients",
    copay: `${commercial.toLocaleString()} commercially covered patients eligible`,
    bridge: `${bridgeEligible.toLocaleString()} at-risk / public-pay patients eligible`,
    "sp-services": "Patients dispensed through a contracted SP",
    digital: "Capped by hub-enrolled patients",
  };

  return services.map((s) => {
    const patients = counts[s.id];
    const priorRate =
      (patients / cohort) * (1 - (0.02 + hash01(`${viewSeed(view)}|yoy|${s.id}`) * 0.09));
    return {
      id: s.id,
      service: s.short,
      label: s.label,
      patients,
      share: Math.round((patients / cohort) * 100),
      yoy: Math.round(((patients / cohort) - priorRate) * 100),
      cap: caps[s.id],
    };
  });
}

/* ------------------------------------------------------------ contact metrics */

export type ContactMetric = {
  id: string;
  label: string;
  value: string;
  sub: string;
  benchmark: string;
  delta: number;
};

const BENCHMARK = { frm: 0.42, cm: 2.4, nurse: 1.7 };

/** Average outreach effort this cohort received, versus the team average. */
export function buildContactMetrics(view: StageView): ContactMetric[] {
  const cohort = view.patients || 1;
  const regs = buildCohortRegistrations(view);
  const reg = (id: ServiceId) => regs.find((r) => r.id === id)?.patients ?? 0;

  // FRM calls: each FRM's 30-day cadence applies to every account they cover.
  const frmCalls = view.frms.reduce((s, f) => s + f.callsLast30 * f.accounts, 0);
  const frmPerPatient = frmCalls / cohort;

  const cmWeighted =
    view.caseManagers.reduce((s, c) => s + c.touchesPerCase * c.patients, 0) /
    (view.caseManagers.reduce((s, c) => s + c.patients, 0) || 1);

  const nurseCompletion =
    view.nurseNavigators.reduce((s, n) => s + n.completionRate, 0) /
    (view.nurseNavigators.length || 1);
  const nursePerPatient = (reg("nurse") / cohort) * (1.6 + nurseCompletion * 0.9);

  const round1 = (n: number) => Number(n.toFixed(1));
  const round2 = (n: number) => Number(n.toFixed(2));

  return [
    {
      id: "cohort",
      label: "Patients in this view",
      value: cohort.toLocaleString(),
      sub: view.reasonLabel ? `${view.label} · ${view.reasonLabel}` : view.label,
      benchmark: `${view.totals.risk.high.toLocaleString()} at risk`,
      delta: 0,
    },
    {
      id: "hub",
      label: "Registered with the hub",
      value: `${Math.round((reg("hub") / cohort) * 100)}%`,
      sub: `${reg("hub").toLocaleString()} of ${cohort.toLocaleString()} patients`,
      benchmark: "case-managed",
      delta: 0,
    },
    {
      id: "frm",
      label: "Avg FRM calls / patient",
      value: round2(frmPerPatient).toFixed(2),
      sub: `${frmCalls.toLocaleString()} account calls in the last 30 days`,
      benchmark: `team avg ${BENCHMARK.frm.toFixed(2)}`,
      delta: round2(frmPerPatient - BENCHMARK.frm),
    },
    {
      id: "cm",
      label: "Avg case manager touches",
      value: round1(cmWeighted).toFixed(1),
      sub: "per open case in this cohort",
      benchmark: `team avg ${BENCHMARK.cm.toFixed(1)}`,
      delta: round1(cmWeighted - BENCHMARK.cm),
    },
    {
      id: "nurse",
      label: "Avg nurse touchpoints",
      value: round1(nursePerPatient).toFixed(1),
      sub: `${reg("nurse").toLocaleString()} patients with a nurse navigator`,
      benchmark: `team avg ${BENCHMARK.nurse.toFixed(1)}`,
      delta: round1(nursePerPatient - BENCHMARK.nurse),
    },
  ];
}

/* ------------------------------------------------------------------ geography */

/** State-level registration rate (0-100) for one service, or the blended average,
 *  computed against the filtered cohort's patients in each state. */
export function buildStateUtilization(
  view: StageView,
  service: ServiceId | "all",
): Record<string, number> {
  const regs = buildCohortRegistrations(view);
  const ids: ServiceId[] = service === "all" ? services.map((s) => s.id) : [service];
  const out: Record<string, number> = {};

  for (const st of view.states) {
    let sum = 0;
    for (const id of ids) {
      const national = (regs.find((r) => r.id === id)?.share ?? 0) / 100;
      const local = national * (0.62 + hash01(`${viewSeed(view)}|${id}|${st.code}`) * 0.76);
      sum += Math.min(0.98, local);
    }
    out[st.code] = Math.round((sum / ids.length) * 100);
  }
  return out;
}

export function statePatientsFor(view: StageView, code: string) {
  return view.states.find((s) => s.code === code)?.patients ?? 0;
}

/* --------------------------------------------------------------------- alerts */

export type UtilizationAlert = {
  id: string;
  service: ServiceId;
  serviceLabel: string;
  states: { code: string; name: string; rate: number; patients: number }[];
  localRate: number;
  nationalRate: number;
  gap: number;
  patientsAffected: number;
  title: string;
  body: string;
  recommendation: string;
};

/** Services materially under-registered in a cluster of states within this cohort. */
export function buildUtilizationAlerts(view: StageView, limit = 3): UtilizationAlert[] {
  const regs = buildCohortRegistrations(view);
  if (!view.states.length) return [];

  const alerts = services.map((s) => {
    const national = regs.find((r) => r.id === s.id)?.share ?? 0;
    const rates = buildStateUtilization(view, s.id);
    const laggards = view.states
      .map((st) => ({
        code: st.code,
        name: st.name,
        rate: rates[st.code] ?? 0,
        patients: st.patients,
      }))
      .filter((st) => st.patients > 0)
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 4);

    const localRate = Math.round(
      laggards.reduce((a, l) => a + l.rate, 0) / (laggards.length || 1),
    );
    const covered = laggards.reduce((a, l) => a + l.patients, 0);
    const gap = national - localRate;
    const patientsAffected = Math.max(0, Math.round((covered * gap) / 100));

    return {
      id: `util-${s.id}`,
      service: s.id,
      serviceLabel: s.label,
      states: laggards,
      localRate,
      nationalRate: national,
      gap,
      patientsAffected,
      title: `${s.label} registration ${localRate}% in ${laggards.length} states vs ${national}% across this cohort`,
      body:
        `${laggards.map((l) => l.code).join(", ")} sit ${gap} points below the ${view.label.toLowerCase()} ` +
        `average for ${s.label.toLowerCase()}. That leaves roughly ` +
        `${patientsAffected.toLocaleString()} patients in this cohort never registered for the service.`,
      recommendation: recommendationFor(s.id),
    };
  });

  return alerts.sort((a, b) => b.gap - a.gap).slice(0, limit);
}

function recommendationFor(id: ServiceId): string {
  switch (id) {
    case "hub":
      return "Route these states to a dedicated hub pod so every referral gets an owner within one business day.";
    case "frm":
      return "Rebalance FRM territory coverage into the lagging states and add a weekly account touch cadence.";
    case "nurse":
      return "Add nurse navigator outreach at the training stage — patients here start therapy unsupported.";
    case "copay":
      return "Push copay card enrollment at intake; ask the hub to screen commercial patients on the first call.";
    case "bridge":
      return "Review bridge / free-goods eligibility screening with the hub supervisor for stalled coverage cases.";
    case "sp-services":
      return "Escalate to SP contracting — these states are not receiving the full service package.";
    case "digital":
      return "Enable digital enrollment and refill reminders for these territories.";
  }
}
