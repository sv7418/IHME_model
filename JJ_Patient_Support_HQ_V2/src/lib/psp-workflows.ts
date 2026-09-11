import { accounts, rolePeople, stateRisks } from "@/lib/psp-data";
import { extendedRecipients } from "@/lib/psp-actions";
import { recipients } from "@/lib/psp-data";

export type WorkflowMetric =
  | "fulfillmentRate"
  | "timeToFirstFill"
  | "neverStartRisk"
  | "discontinuationRisk"
  | "paApprovalRate"
  | "actionRate";

export type WorkflowScope =
  | "frmTerritories"
  | "accounts"
  | "states"
  | "specialtyPharmacies"
  | "payers"
  | "atRiskPatients";

export type Comparator = "below" | "above";
export type ThresholdMode = "absolute" | "relativeToNational";

export type WorkflowRule = {
  metric: WorkflowMetric;
  scope: WorkflowScope;
  comparator: Comparator;
  /** percent for rate metrics, days for duration metrics */
  threshold: number;
  thresholdMode: ThresholdMode;
  /** minimum number of matching entities before the workflow fires */
  minMatches: number;
  windowDays: number;
};

export type Workflow = {
  id: string;
  name: string;
  active: boolean;
  rule: WorkflowRule;
  recipientId: string;
  customRecipient?: string;
  attachList: boolean;
  lastRun: string;
  timesFired: number;
};

export const metricOptions: {
  value: WorkflowMetric;
  label: string;
  unit: "pct" | "days";
  defaultThreshold: number;
}[] = [
  { value: "fulfillmentRate", label: "Fulfillment rate", unit: "pct", defaultThreshold: 85 },
  { value: "timeToFirstFill", label: "Time to first fill / TAT", unit: "days", defaultThreshold: 5 },
  { value: "neverStartRisk", label: "Never-start risk", unit: "pct", defaultThreshold: 60 },
  {
    value: "discontinuationRisk",
    label: "Discontinuation risk",
    unit: "pct",
    defaultThreshold: 50,
  },
  { value: "paApprovalRate", label: "PA approval rate", unit: "pct", defaultThreshold: 75 },
  { value: "actionRate", label: "Trigger action rate", unit: "pct", defaultThreshold: 70 },
];

export const scopeOptions: { value: WorkflowScope; label: string; noun: string }[] = [
  { value: "frmTerritories", label: "FRM territories", noun: "territories" },
  { value: "accounts", label: "Accounts", noun: "accounts" },
  { value: "states", label: "States", noun: "states" },
  { value: "specialtyPharmacies", label: "Specialty pharmacies", noun: "pharmacies" },
  { value: "payers", label: "Payers", noun: "payers" },
  { value: "atRiskPatients", label: "At-risk patient cohort", noun: "patient cohorts" },
];

export const allRecipients = [...recipients, ...extendedRecipients];

export function metricMeta(metric: WorkflowMetric) {
  return metricOptions.find((m) => m.value === metric)!;
}

export function scopeMeta(scope: WorkflowScope) {
  return scopeOptions.find((s) => s.value === scope)!;
}

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

/** Entities in a scope, with the value of the requested metric (percent or days). */
function scopeValues(scope: WorkflowScope, metric: WorkflowMetric, seed: string) {
  const unit = metricMeta(metric).unit;

  const synth = (name: string) =>
    unit === "days" ? rand(`${seed}|${name}|${metric}`, 2.4, 9.6) : rand(`${seed}|${name}|${metric}`, 48, 94);

  switch (scope) {
    case "accounts":
      return accounts.map((a) => ({
        name: a.name,
        detail: a.state,
        value:
          metric === "fulfillmentRate"
            ? a.fulfillmentRate * 100
            : metric === "neverStartRisk"
              ? a.neverStartRisk * 100
              : metric === "discontinuationRisk"
                ? a.discontinuationRisk * 100
                : synth(a.name),
      }));
    case "states":
      return stateRisks.map((s) => ({
        name: s.name,
        detail: `${s.patients.toLocaleString()} patients`,
        value:
          metric === "neverStartRisk"
            ? s.neverStartRisk * 100
            : metric === "discontinuationRisk"
              ? s.discontinuationRisk * 100
              : metric === "actionRate"
                ? s.frmCoverage * 100
                : synth(s.name),
      }));
    case "frmTerritories":
      return rolePeople
        .filter((p) => p.role === "FRM" || p.role === "Field Reimbursement Specialist")
        .map((p) => ({
          name: p.territory,
          detail: p.name,
          value:
            metric === "actionRate"
              ? p.actionRate * 100
              : metric === "timeToFirstFill"
                ? p.avgTimeToAction + rand(`${seed}|${p.id}`, 1.5, 4.5)
                : synth(p.id),
        }));
    case "specialtyPharmacies":
      return [
        "Accredo",
        "CVS Specialty",
        "Optum Specialty",
        "BioPlus Specialty",
        "Onco360",
        "Senderra Rx",
        "PANTHERx Rare",
        "Amber Specialty",
      ].map((n) => ({ name: n, detail: "Network SP", value: synth(n) }));
    case "payers":
      return [
        "UnitedHealthcare",
        "Elevance / Anthem",
        "Aetna (CVS Health)",
        "Cigna Healthcare",
        "Humana",
        "Centene / Ambetter",
        "State Medicaid FFS",
      ].map((n) => ({ name: n, detail: "Plan", value: synth(n) }));
    case "atRiskPatients":
      return [
        "Never-start, PA pending",
        "Never-start, copay barrier",
        "Discontinuation, refill lapse",
        "Discontinuation, tolerability",
        "Re-authorization pending",
      ].map((n) => ({ name: n, detail: "Cohort", value: synth(n) }));
  }
}

export type RuleEvaluation = {
  nationalAverage: number;
  effectiveThreshold: number;
  matches: { name: string; detail: string; value: number }[];
  total: number;
  wouldFire: boolean;
};

export function evaluateRule(rule: WorkflowRule, seed: string): RuleEvaluation {
  const rows = scopeValues(rule.scope, rule.metric, seed);
  const nationalAverage = rows.reduce((a, r) => a + r.value, 0) / Math.max(1, rows.length);

  const effectiveThreshold =
    rule.thresholdMode === "absolute"
      ? rule.threshold
      : rule.comparator === "below"
        ? nationalAverage * (1 - rule.threshold / 100)
        : nationalAverage * (1 + rule.threshold / 100);

  const matches = rows
    .filter((r) => (rule.comparator === "below" ? r.value < effectiveThreshold : r.value > effectiveThreshold))
    .sort((a, b) => (rule.comparator === "below" ? a.value - b.value : b.value - a.value));

  return {
    nationalAverage,
    effectiveThreshold,
    matches,
    total: rows.length,
    wouldFire: matches.length >= rule.minMatches,
  };
}

export function formatValue(metric: WorkflowMetric, value: number) {
  return metricMeta(metric).unit === "days" ? `${value.toFixed(1)}d` : `${value.toFixed(1)}%`;
}

export function ruleSentence(rule: WorkflowRule) {
  const m = metricMeta(rule.metric);
  const s = scopeMeta(rule.scope);
  const threshold =
    rule.thresholdMode === "absolute"
      ? m.unit === "days"
        ? `${rule.threshold} days`
        : `${rule.threshold}%`
      : `${rule.threshold}% ${rule.comparator} the national average`;

  const cmp = rule.thresholdMode === "absolute" ? `${rule.comparator} ${threshold}` : threshold;

  return `When ${m.label.toLowerCase()} for at least ${rule.minMatches} ${s.noun} is ${cmp} over ${rule.windowDays} days`;
}

export const seededWorkflows: Workflow[] = [
  {
    id: "wf-frm-fulfillment",
    name: "FRM territory fulfillment below national average",
    active: true,
    rule: {
      metric: "fulfillmentRate",
      scope: "frmTerritories",
      comparator: "below",
      threshold: 10,
      thresholdMode: "relativeToNational",
      minMatches: 3,
      windowDays: 30,
    },
    recipientId: "r-frm",
    attachList: true,
    lastRun: "Oct 17, 2024",
    timesFired: 4,
  },
  {
    id: "wf-hub-tat",
    name: "High TAT for at-risk patients → Hub Supervisor",
    active: true,
    rule: {
      metric: "timeToFirstFill",
      scope: "atRiskPatients",
      comparator: "above",
      threshold: 6,
      thresholdMode: "absolute",
      minMatches: 2,
      windowDays: 14,
    },
    recipientId: "r-hub",
    attachList: true,
    lastRun: "Oct 18, 2024",
    timesFired: 7,
  },
  {
    id: "wf-payer-pa",
    name: "PA approval rate collapse → Payer Contracting",
    active: false,
    rule: {
      metric: "paApprovalRate",
      scope: "payers",
      comparator: "below",
      threshold: 65,
      thresholdMode: "absolute",
      minMatches: 3,
      windowDays: 60,
    },
    recipientId: "r-payer-contracting",
    attachList: true,
    lastRun: "Oct 04, 2024",
    timesFired: 1,
  },
];

export function defaultRule(): WorkflowRule {
  return {
    metric: "fulfillmentRate",
    scope: "frmTerritories",
    comparator: "below",
    threshold: 10,
    thresholdMode: "relativeToNational",
    minMatches: 3,
    windowDays: 30,
  };
}
