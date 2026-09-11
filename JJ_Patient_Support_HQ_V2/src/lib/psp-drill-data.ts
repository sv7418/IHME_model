/**
 * Deterministic derived distributions used by the drill-down drawers.
 *
 * Everything here is generated from a seeded hash of stable identifiers
 * (state code, payer id, person name) and then apportioned so the parts always
 * sum back to the entity's patient count shown in the parent table.
 */

import type { PaAccount, PaPayer } from "./psp-stage-data";
import type { StageView } from "./psp-stage-view";

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Stable pseudo-random number in [min, max) for a seed. */
export function seeded(seed: string, min: number, max: number) {
  return min + ((hash(seed) % 10000) / 10000) * (max - min);
}

/** Largest-remainder apportionment so slices always sum to `target`. */
export function apportion(weights: number[], target: number): number[] {
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

export type Slice = { label: string; value: number; sub?: string };

/* ------------------------------------------------------------------ state */

/** Payer mix inside one state, reconciled to that state's patient count. */
export function statePayerMix(view: StageView, code: string, patients: number): Slice[] {
  const inState = view.payers.filter((p) => p.states.includes(code));
  const pool = inState.length ? inState : view.payers.slice(0, 5);
  const weights = pool.map((p) => p.patients * seeded(`${code}|${p.id}`, 0.7, 1.4));
  const counts = apportion(weights, patients);
  return pool
    .map((p, i) => ({ label: p.name, value: counts[i], sub: `${p.scope} · ${p.channel}` }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
}

/** Urban vs. rural split, taken straight from the accounts in that state. */
export function settingSplit(accounts: PaAccount[]): Slice[] {
  const urban = accounts.filter((a) => a.setting === "Urban").reduce((s, a) => s + a.patients, 0);
  const rural = accounts.filter((a) => a.setting === "Rural").reduce((s, a) => s + a.patients, 0);
  return [
    { label: "Urban", value: urban, sub: `${accounts.filter((a) => a.setting === "Urban").length} sites` },
    { label: "Rural", value: rural, sub: `${accounts.filter((a) => a.setting === "Rural").length} sites` },
  ];
}

const ageBands = ["18–39", "40–54", "55–64", "65–74", "75+"];

/** Age distribution for a state, tilted older where the mix is more rural. */
export function ageDistribution(code: string, patients: number, ruralShare: number): Slice[] {
  const base = [0.08, 0.18, 0.26, 0.3, 0.18];
  const weights = base.map(
    (b, i) => b * seeded(`${code}|age|${i}`, 0.85, 1.15) * (1 + ruralShare * (i >= 3 ? 0.35 : -0.2)),
  );
  const counts = apportion(weights, patients);
  return ageBands.map((label, i) => ({ label, value: counts[i] }));
}

/* ------------------------------------------------------------------ payer */

/** Patients held by this payer, split across the current stage's blockers. */
export function payerReasonMix(view: StageView, p: PaPayer): Slice[] {
  const weights = view.reasons.map((r) => {
    let w = r.patients * seeded(`${p.id}|${r.id}`, 0.6, 1.5);
    if (r.id === "step") w *= p.requiresStepTherapy ? 2.2 : 0.15;
    if (r.id === "lmn") w *= p.requiresLmn ? 1.8 : 0.5;
    if (r.id === "appeal") w *= 0.4 + 2.4 * (1 - p.firstPassApproval);
    if (r.id === "docs") w *= 0.6 + p.complexity / 9;
    return w;
  });
  const counts = apportion(weights, p.patients);
  return view.reasons
    .map((r, i) => ({ label: r.short, value: counts[i], sub: r.label }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
}

/** Patient volume by plan design for this payer. */
export function payerPlanVolumes(view: StageView, p: PaPayer): Slice[] {
  const { plans, plansRequiringStep } = view.plans(p);
  const stepIds = p.requiresStepTherapy ? view.planIds(p) : [];
  const ids: string[] = [];
  for (let i = 0; i < plans; i++) {
    ids.push(stepIds[i] ?? `${p.id.toUpperCase()}-PLAN-${String(i + 1).padStart(2, "0")}`);
  }
  const weights = ids.map((id, i) => seeded(`${p.id}|${id}`, 0.5, 1.6) * (i < plansRequiringStep ? 1.5 : 1));
  const counts = apportion(weights, p.patients);
  return ids
    .map((id, i) => ({
      label: id,
      value: counts[i],
      sub: i < plansRequiringStep ? "Step edit applied" : "No step edit",
    }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
}

/* ----------------------------------------------------------------- people */

export type PersonWeek = { week: string; value: number; team: number };

/**
 * Eight-week performance trend for one person against the team average.
 * `metric` is a percentage (0-100) or a day count depending on `unit`.
 */
export function personTrend(name: string, current: number, teamAvg: number): PersonWeek[] {
  return Array.from({ length: 8 }, (_, i) => {
    const drift = (i - 7) * 0.035 * current;
    return {
      week: `W-${7 - i}`,
      value: Number((current - drift * seeded(`${name}|w|${i}`, 0.4, 1.6)).toFixed(1)),
      team: Number((teamAvg * seeded(`team|w|${i}`, 0.96, 1.04)).toFixed(1)),
    };
  });
}

/** Accounts covered by an FRM inside the current view. */
export function accountsForFrm(view: StageView, name: string) {
  return view.accounts.filter((a) => a.frm === name).sort((a, b) => b.patients - a.patients);
}

/** Accounts a hub person touches, apportioned from their patient load. */
export function accountsForHubPerson(view: StageView, name: string, patients: number) {
  const pool = view.accounts.slice(0, 10);
  const weights = pool.map((a) => a.patients * seeded(`${name}|${a.name}`, 0.3, 1.7));
  const counts = apportion(weights, patients);
  return pool
    .map((a, i) => ({ ...a, patients: counts[i] }))
    .filter((a) => a.patients > 0)
    .sort((a, b) => b.patients - a.patients);
}

/* ------------------------------------------------------- time-to-fill shape */

export type FillBucket = {
  bucket: string;
  /** Share of patients (%) at the entity's overall average. */
  overall: number;
  /** Share of patients (%) inside the currently filtered reason cohort. */
  filtered: number;
};

const FILL_BUCKETS = ["0-3d", "4-7d", "8-14d", "15-21d", "22-30d", "30d+"];
const BUCKET_MID = [2, 5.5, 11, 18, 26, 36];

function shapeAround(avg: number, seed: string, spread: number): number[] {
  const raw = BUCKET_MID.map((mid, i) => {
    const dist = Math.abs(mid - avg) / spread;
    return Math.exp(-dist * dist) * seeded(`${seed}|b${i}`, 0.75, 1.25) + 0.02;
  });
  const sum = raw.reduce((s, v) => s + v, 0);
  return raw.map((v) => Math.round((v / sum) * 1000) / 10);
}

/**
 * Deterministic time-to-fill distribution for one entity (account, payer, SP).
 * `filteredLabel` shifts the curve right — the blocker always adds days — while
 * both series stay stable across renders and centre on the given averages.
 */
export function fillTimeHistogram(
  entityKey: string,
  avgDays: number,
  filteredKey: string | null,
  filteredAvgDays?: number,
): FillBucket[] {
  const base = shapeAround(Math.max(2, avgDays), entityKey, 9);
  const filtAvg = filteredAvgDays ?? avgDays * 1.55 + 3;
  const filt = filteredKey ? shapeAround(filtAvg, `${entityKey}|${filteredKey}`, 11) : [];
  return FILL_BUCKETS.map((bucket, i) => ({
    bucket,
    overall: base[i],
    filtered: filteredKey ? filt[i] : 0,
  }));
}

/** Weighted mean (days) implied by a histogram series. */
export function histogramMean(rows: FillBucket[], key: "overall" | "filtered") {
  const total = rows.reduce((s, r) => s + r[key], 0) || 1;
  return rows.reduce((s, r, i) => s + r[key] * BUCKET_MID[i], 0) / total;
}

