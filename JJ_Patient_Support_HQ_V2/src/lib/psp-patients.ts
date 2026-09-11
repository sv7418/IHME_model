/**
 * Patient-level sample.
 *
 * Deterministically expands a StageView (or a reason slice of one) into an
 * illustrative patient list. Every patient is attached to a real account,
 * payer, plan ID, specialty pharmacy and PSP team from the same view, so the
 * list always reconciles with the charts above it.
 */

import type { StageView } from "./psp-stage-view";
import type { PaAccount, PaPayer } from "./psp-stage-data";

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rand(seed: string, min: number, max: number) {
  return min + ((hash(seed) % 10000) / 10000) * (max - min);
}

function pick<T>(seed: string, list: T[]): T {
  return list[hash(seed) % list.length];
}

export type RiskLabel = "High" | "Medium" | "Low";

export type PatientRow = {
  id: string;
  accountName: string;
  state: string;
  stateName: string;
  setting: "Urban" | "Rural";
  newToBrandOffice: boolean;
  ageBucket: string;
  age: number;
  sex: "F" | "M";
  payer: string;
  planId: string;
  riskScore: number;
  riskLabel: RiskLabel;
  barrierId: string;
  barrierLabel: string;
  drivers: string[];
  daysInStage: number;
  welcomeCall: boolean;
  welcomeCallDaysAgo: number | null;
  frm: string;
  lastFrmTouchDaysAgo: number;
  lastFrmTopic: string;
  caseManager: string;
  nurseTouchDaysAgo: number | null;
  sp: string;
  whoClass: string;
  symptoms: string[];
  comorbidities: string[];
};

const ageBuckets = ["18-34", "35-49", "50-64", "65-74", "75+"];
const symptomPool = [
  "Exertional dyspnea",
  "Fatigue",
  "Peripheral edema",
  "Chest discomfort",
  "Dizziness on exertion",
  "Palpitations",
  "Reduced 6-minute walk distance",
];
const comorbidityPool = [
  "Hypertension",
  "Type 2 diabetes",
  "Chronic kidney disease (stage 2)",
  "Atrial fibrillation",
  "Obstructive sleep apnea",
  "Hypothyroidism",
  "Obesity (BMI 32)",
];

function driversFor(barrierShort: string, a: PaAccount, p: PaPayer, seed: string): string[] {
  const out = [barrierShort];
  if (p.requiresStepTherapy) out.push("Plan requires documented prior therapy");
  if (p.requiresLmn) out.push("Signed letter of medical necessity outstanding");
  if (a.newToBrand) out.push("Prescriber office new to the brand");
  if (a.setting === "Rural") out.push("Rural site, limited on-site support");
  if (a.lastFrmCallDaysAgo >= 21) out.push("No field touch in 3+ weeks");
  if (p.paTat > 9) out.push(`Plan PA turnaround ${p.paTat}d`);
  out.push(rand(seed + "d", 0, 1) > 0.55 ? "Copay exposure above $250" : "Benefit verification re-opened");
  return Array.from(new Set(out)).slice(0, 3);
}

function planIdFor(view: StageView, p: PaPayer, seed: string) {
  const step = view.planIds(p);
  if (step.length) return pick(seed, step);
  const prefix = p.name.replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase();
  return `${prefix}-${3200 + (hash(seed) % 700)}`;
}

/** Builds up to `limit` illustrative patients for the given view. */
export function buildPatients(view: StageView, limit = 60): PatientRow[] {
  const accounts = view.accounts.filter((a) => a.patients > 0);
  const payers = view.payers.filter((p) => p.patients > 0);
  const sps = view.sps.filter((s) => s.patients > 0);
  if (!accounts.length || !payers.length) return [];

  const totalPatients = accounts.reduce((s, a) => s + a.patients, 0);
  const take = Math.min(limit, totalPatients);
  const rows: PatientRow[] = [];

  // Round-robin across accounts weighted by their patient volume.
  const quota = accounts.map((a) => Math.max(1, Math.round((a.patients / totalPatients) * take)));

  accounts.forEach((a, ai) => {
    for (let k = 0; k < quota[ai] && rows.length < take; k++) {
      const seed = `${view.stageId ?? "all"}|${view.reasonId ?? "-"}|${a.name}|${k}`;
      const payer = pick(seed + "payer", payers.slice(0, Math.max(3, Math.min(payers.length, 8))));
      const barrier = a.newToBrand && view.reasonById["new-hcp"]
        ? view.reasonById["new-hcp"]
        : view.reasons.length === 1
          ? view.reasons[0]
          : pick(seed + "barrier", view.reasons.filter((r) => r.id !== "new-hcp"));
      const base = a.highShare * 100;
      const riskScore = Math.round(
        Math.min(96, Math.max(12, base + rand(seed + "risk", -22, 18) + (a.newToBrand ? 6 : 0))),
      );
      const riskLabel: RiskLabel = riskScore >= 70 ? "High" : riskScore >= 45 ? "Medium" : "Low";
      const age = Math.round(rand(seed + "age", 27, 82));
      const welcome = rand(seed + "wc", 0, 1) > (a.newToBrand ? 0.55 : 0.3);
      const nurseSeen = rand(seed + "nn", 0, 1) > 0.5;
      rows.push({
        id: `PT-••${1000 + (hash(seed) % 8999)}`,
        accountName: a.name,
        state: a.state,
        stateName: a.stateName,
        setting: a.setting,
        newToBrandOffice: a.newToBrand,
        age,
        ageBucket:
          age < 35 ? ageBuckets[0] : age < 50 ? ageBuckets[1] : age < 65 ? ageBuckets[2] : age < 75 ? ageBuckets[3] : ageBuckets[4],
        sex: hash(seed + "sex") % 2 ? "F" : "M",
        payer: payer.name,
        planId: planIdFor(view, payer, seed),
        riskScore,
        riskLabel,
        barrierId: barrier?.id ?? "",
        barrierLabel: barrier?.short ?? "—",
        drivers: driversFor(barrier?.short ?? "Open case", a, payer, seed),
        daysInStage: Math.round(rand(seed + "dis", view.avgDays * 0.4, view.avgDays * 2.1)),
        welcomeCall: welcome,
        welcomeCallDaysAgo: welcome ? Math.round(rand(seed + "wcd", 2, 26)) : null,
        frm: a.frm,
        lastFrmTouchDaysAgo: a.lastFrmCallDaysAgo,
        lastFrmTopic: a.lastFrmCallTopic,
        caseManager: pick(seed + "cm", view.caseManagers).name,
        nurseTouchDaysAgo: nurseSeen ? Math.round(rand(seed + "nnd", 3, 34)) : null,
        sp: (sps.length ? pick(seed + "sp", sps) : view.sps[0])?.name ?? "Unassigned",
        whoClass: pick(seed + "who", ["WHO FC II", "WHO FC III", "WHO FC III", "WHO FC IV"]),
        symptoms: [
          pick(seed + "s1", symptomPool),
          pick(seed + "s2", symptomPool.slice(2)),
          pick(seed + "s3", symptomPool.slice(4)),
        ].filter((v, i, arr) => arr.indexOf(v) === i),
        comorbidities: [
          pick(seed + "c1", comorbidityPool),
          pick(seed + "c2", comorbidityPool.slice(3)),
        ].filter((v, i, arr) => arr.indexOf(v) === i),
      });
    }
  });

  return rows.sort((a, b) => b.riskScore - a.riskScore);
}
