import {
  accounts,
  rolePeople,
  stateRisks,
  type Account,
  type SupportRole,
} from "@/lib/psp-data";

// ---------- deterministic pseudo-random helpers ----------
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic value in [min, max] derived from a seed string. */
function rand(seed: string, min: number, max: number) {
  const h = hash(seed);
  return min + ((h % 10000) / 10000) * (max - min);
}

function round(value: number, digits = 2) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

/** Normalizes a set of weights into percentage shares summing to 1. */
function normalize(values: number[]) {
  const total = values.reduce((a, b) => a + b, 0);
  return values.map((v) => v / total);
}

// ---------- shared types ----------
export type ChannelMix = {
  commercial: number;
  medicare: number;
  medicaid: number;
  other: number;
};

export type PayerRow = {
  name: string;
  share: number;
  approvalRate: number;
  denialRate: number;
  paTurnaround: number;
};

export type PharmacyRow = {
  name: string;
  patients: number;
  fulfillmentRate: number;
  persistencyRate: number;
  timeToFirstFill: number;
};

export type DriverRow = {
  label: string;
  contribution: number;
  detail: string;
};

export type StateAccountRow = {
  name: string;
  patients: number;
  neverStartRisk: number;
  persistencyRate: number;
  fulfillmentRate: number;
};

export type StateDetail = {
  channelMix: ChannelMix;
  payers: PayerRow[];
  pharmacies: PharmacyRow[];
  accountsInState: StateAccountRow[];
};

export type AccountDetail = {
  persistencyRate: number;
  patients: number;
  neverStartDrivers: DriverRow[];
  discontinuationDrivers: DriverRow[];
  channelMix: ChannelMix;
  payers: PayerRow[];
  pharmacies: PharmacyRow[];
  coverage: { role: SupportRole; name: string; territory: string; actionRate: number }[];
};

// ---------- reference pools ----------
const payerPool = [
  "UnitedHealthcare",
  "Elevance / Anthem",
  "Aetna (CVS Health)",
  "Cigna Healthcare",
  "Blue Cross Blue Shield (state plan)",
  "Humana",
  "Centene / Ambetter",
  "State Medicaid FFS",
  "Kaiser Permanente",
  "Molina Healthcare",
];

const pharmacyPool = [
  "Accredo",
  "CVS Specialty",
  "Optum Specialty",
  "BioPlus Specialty",
  "Onco360",
  "Senderra Rx",
  "PANTHERx Rare",
  "Amber Specialty",
  "US Bioservices",
  "Biologics by McKesson",
];

const healthSystemPool = [
  "Regional Medical Center",
  "University Health",
  "Mercy Health Partners",
  "St. Vincent Health",
  "Community Oncology Network",
  "Providence Care Group",
  "Summit Specialty Clinic",
  "Riverside Health System",
  "Cornerstone Physicians Group",
  "Lakeview Medical Group",
];

const neverStartDriverPool: { label: string; detail: string }[] = [
  { label: "Prior authorization latency", detail: "Median PA turnaround exceeds payer SLA" },
  { label: "Copay abandonment > $250", detail: "Out-of-pocket exposure at first fill" },
  { label: "Benefit verification delays", detail: "Incomplete intake documentation from site" },
  { label: "Specialty pharmacy onboarding", detail: "Triage and transfer friction to in-network SP" },
  { label: "Formulary exclusion / step edit", detail: "Payer requires documented prior therapy" },
  { label: "Patient unreachable at intake", detail: "No response within the 72-hour outreach window" },
  { label: "FRM coverage gap", detail: "No assigned field reimbursement support in territory" },
];

const discontinuationDriverPool: { label: string; detail: string }[] = [
  { label: "Ongoing copay burden", detail: "Refill cost sensitivity after bridge program ends" },
  { label: "Tolerability follow-up gap", detail: "No nurse navigator touchpoint after week 4" },
  { label: "Refill lapse > 14 days", detail: "Missed re-authorization or shipment scheduling" },
  { label: "Re-authorization denial", detail: "Payer requires new clinical documentation" },
  { label: "Site-of-care disruption", detail: "Transfer between infusion or dispensing sites" },
  { label: "Navigation / education gap", detail: "Low adherence-program enrollment at the account" },
];

function pickPool<T>(pool: T[], seed: string, count: number) {
  const start = hash(seed) % pool.length;
  const rotated = [...pool.slice(start), ...pool.slice(0, start)];
  return rotated.slice(0, Math.min(count, pool.length));
}

function buildChannelMix(seed: string): ChannelMix {
  const [commercial, medicare, medicaid, other] = normalize([
    rand(seed + "c", 30, 60),
    rand(seed + "mc", 15, 40),
    rand(seed + "md", 8, 30),
    rand(seed + "o", 2, 8),
  ]);
  return {
    commercial: round(commercial, 3),
    medicare: round(medicare, 3),
    medicaid: round(medicaid, 3),
    other: round(other, 3),
  };
}

function buildPayers(seed: string, count: number, risk: number): PayerRow[] {
  const names = pickPool(payerPool, seed, count);
  const shares = normalize(names.map((n, i) => rand(seed + n + i, 10, 40)));
  return names.map((name, i) => {
    const approvalRate = round(Math.min(0.95, Math.max(0.42, 0.95 - risk * rand(seed + name, 0.4, 0.8))), 2);
    return {
      name,
      share: round(shares[i], 3),
      approvalRate,
      denialRate: round(1 - approvalRate, 2),
      paTurnaround: round(rand(seed + name + "pa", 1.8, 9.5) * (0.6 + risk), 1),
    };
  });
}

function buildPharmacies(seed: string, count: number, risk: number, patientBase: number): PharmacyRow[] {
  const names = pickPool(pharmacyPool, seed, count);
  return names
    .map((name) => {
      const fulfillmentRate = round(
        Math.min(0.96, Math.max(0.5, 0.95 - risk * rand(seed + name + "f", 0.25, 0.75))),
        2,
      );
      return {
        name,
        patients: Math.round(rand(seed + name + "p", 0.05, 0.28) * patientBase),
        fulfillmentRate,
        persistencyRate: round(Math.max(0.45, fulfillmentRate - rand(seed + name + "pr", 0.03, 0.16)), 2),
        timeToFirstFill: round(rand(seed + name + "t", 2.2, 11) * (0.6 + risk), 1),
      };
    })
    .sort((a, b) => b.fulfillmentRate - a.fulfillmentRate);
}

// ---------- state detail ----------
export function getStateDetail(code: string, periodSeed = ""): StateDetail {
  const state = stateRisks.find((s) => s.code === code)!;
  const seed = `state-${code}|${periodSeed}`;
  const risk = state.neverStartRisk;

  const real: StateAccountRow[] = accounts
    .filter((a) => a.state === code)
    .map((a) => ({
      name: a.name,
      patients: a.neverStartPatients,
      neverStartRisk: a.neverStartRisk,
      persistencyRate: accountPersistency(a),
      fulfillmentRate: a.fulfillmentRate,
    }));

  const synthetic: StateAccountRow[] = pickPool(healthSystemPool, seed, 8).map((base, i) => {
    const name = `${base} – ${state.code}${i > 4 ? " North" : ""}`;
    const fulfillmentRate = round(
      Math.min(0.95, Math.max(0.48, 0.94 - risk * rand(seed + name, 0.3, 0.8))),
      2,
    );
    return {
      name,
      patients: Math.round(rand(seed + name + "pt", 0.02, 0.12) * state.patients + 40),
      neverStartRisk: round(Math.min(0.94, risk * rand(seed + name + "r", 0.8, 1.25)), 2),
      persistencyRate: round(Math.max(0.42, fulfillmentRate - rand(seed + name + "ps", 0.05, 0.2)), 2),
      fulfillmentRate,
    };
  });

  const accountsInState = [...real, ...synthetic].sort(
    (a, b) => a.fulfillmentRate - b.fulfillmentRate,
  );

  return {
    channelMix: buildChannelMix(seed),
    payers: buildPayers(seed, 5, risk).sort((a, b) => b.share - a.share),
    pharmacies: buildPharmacies(seed, 10, risk, state.patients),
    accountsInState,
  };
}

// ---------- account detail ----------
export function accountPersistency(a: Account) {
  return round(Math.max(0.4, 1 - a.discontinuationRisk * rand(`p-${a.name}`, 0.55, 0.95)), 2);
}

function buildDrivers(
  seed: string,
  pool: { label: string; detail: string }[],
  count: number,
): DriverRow[] {
  const picked = pickPool(pool, seed, count);
  const weights = normalize(picked.map((d, i) => rand(seed + d.label + i, 8, 40)));
  return picked
    .map((d, i) => ({ ...d, contribution: round(weights[i], 3) }))
    .sort((a, b) => b.contribution - a.contribution);
}

export function getAccountDetail(account: Account, periodSeed = ""): AccountDetail {
  const seed = `acct-${account.name}|${periodSeed}`;
  const patients = Math.round(account.neverStartPatients / Math.max(0.2, account.neverStartRisk));

  const coverage = (["FRM", "Case Manager", "Nurse Navigator"] as SupportRole[]).map((role) => {
    const pool = rolePeople.filter((p) => p.role === role);
    const person = pool[hash(seed + role) % pool.length];
    return {
      role,
      name: person.name,
      territory: person.territory,
      actionRate: person.actionRate,
    };
  });

  return {
    persistencyRate: accountPersistency(account),
    patients,
    neverStartDrivers: buildDrivers(seed + "-ns", neverStartDriverPool, 5),
    discontinuationDrivers: buildDrivers(seed + "-dc", discontinuationDriverPool, 4),
    channelMix: buildChannelMix(seed),
    payers: buildPayers(seed, 5, account.neverStartRisk).sort((a, b) => b.share - a.share),
    pharmacies: buildPharmacies(seed, 4, account.neverStartRisk, patients),
    coverage,
  };
}

// ---------- role metrics ----------
export type RoleMetric = { key: string; label: string; format: "pct" | "days" | "count" };

export const roleMetricConfig: Record<
  SupportRole,
  { blurb: string; kpis: { label: string; value: string; caption: string }[]; extra: RoleMetric }
> = {
  FRM: {
    blurb: "Field reimbursement managers resolving payer friction at the account level.",
    kpis: [
      { label: "Avg. PA turnaround", value: "4.2 days", caption: "target ≤ 3.0 days" },
      { label: "Benefit verifications cleared", value: "3,184", caption: "this reporting period" },
      { label: "Accounts covered", value: "76", caption: "of 92 priority accounts" },
      { label: "Never-start saves", value: "612", caption: "patients converted to first fill" },
    ],
    extra: { key: "paTurnaround", label: "PA days", format: "days" },
  },
  "Case Manager": {
    blurb: "Hub case managers owning enrollment through first fill and re-authorization.",
    kpis: [
      { label: "Cases closed", value: "1,842", caption: "this reporting period" },
      { label: "Avg. time to resolution", value: "2.1 days", caption: "target ≤ 2.0 days" },
      { label: "Reopen rate", value: "7.4%", caption: "cases reopened within 30 days" },
      { label: "Enrollment completion", value: "88%", caption: "of started enrollments" },
    ],
    extra: { key: "casesClosed", label: "Cases", format: "count" },
  },
  "Nurse Navigator": {
    blurb: "Clinical navigators driving adherence and tolerability follow-up.",
    kpis: [
      { label: "Adherence calls completed", value: "2,410", caption: "94% of scheduled" },
      { label: "90-day persistency lift", value: "+9.2 pts", caption: "vs unsupported cohort" },
      { label: "Tolerability escalations", value: "218", caption: "routed to prescriber" },
      { label: "Patients supported", value: "2,640", caption: "active on therapy" },
    ],
    extra: { key: "persistencyLift", label: "Persist. lift", format: "pct" },
  },
  "Field Reimbursement Specialist": {
    blurb: "Payer-desk specialists handling appeals, step edits and formulary exceptions.",
    kpis: [
      { label: "Appeals overturned", value: "64%", caption: "of appeals filed" },
      { label: "Step-edit exceptions won", value: "381", caption: "this reporting period" },
      { label: "Avg. appeal cycle", value: "6.8 days", caption: "submission to decision" },
      { label: "Accounts covered", value: "65", caption: "national payer desk" },
    ],
    extra: { key: "appealWin", label: "Appeal win", format: "pct" },
  },
  "Hub Coordinator": {
    blurb: "Intake coordinators moving referrals from receipt to enrollment.",
    kpis: [
      { label: "Intake-to-enrollment", value: "1.6 days", caption: "target ≤ 1.5 days" },
      { label: "Referrals processed", value: "5,120", caption: "this reporting period" },
      { label: "Incomplete referrals", value: "11%", caption: "returned to site" },
      { label: "Same-day triage", value: "82%", caption: "of inbound referrals" },
    ],
    extra: { key: "sameDayTriage", label: "Same-day", format: "pct" },
  },
};

/** Deterministic role-specific extra metric per person. */
export function roleExtraValue(personId: string, role: SupportRole, actionRate: number) {
  const cfg = roleMetricConfig[role].extra;
  const seed = `x-${personId}`;
  if (cfg.format === "days") return `${round(rand(seed, 1.4, 6.5) * (1.4 - actionRate), 1)} d`;
  if (cfg.format === "count") return String(Math.round(rand(seed, 180, 640)));
  return `${Math.round(actionRate * rand(seed, 60, 95))}%`;
}

export function coverageGaps(role: SupportRole) {
  return rolePeople
    .filter((p) => p.role === role && p.actionRate < 0.7)
    .map((p) => p.territory);
}
