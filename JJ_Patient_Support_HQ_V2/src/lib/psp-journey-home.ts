import type { Brand, JourneyStage, JourneyStageId } from "@/lib/psp-brand";
import { stateRisks } from "@/lib/psp-data";

/** ---------- Data-through date: always 3 days behind today ---------- */

export function dataThroughDate(now: Date = new Date()) {
  // Resolve the calendar day in UTC, then rebuild it as local midnight so the
  // server and the browser always render the same date regardless of timezone.
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() - 3);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function formatDataThrough(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getFullYear()}`;
}

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function formatBriefingStamp(d: Date) {
  return `${WEEKDAYS[d.getDay()]}, 8:15 AM`;
}


/** ---------- Morning briefing metrics, derived from the journey stages ---------- */

const stageOf = (brand: Brand, id: string) =>
  brand.stages.find((s) => s.id === id) as JourneyStage | undefined;

export type BriefingMetric = {
  label: string;
  value: string;
  delta: string;
  deltaGood: boolean;
};

export type Briefing = {
  stamp: string;
  greeting: string;
  narrative: string;
  metrics: BriefingMetric[];
};

function weightedWow(stages: (JourneyStage | undefined)[]) {
  const valid = stages.filter(Boolean) as JourneyStage[];
  const total = valid.reduce((a, s) => a + s.patients, 0) || 1;
  return valid.reduce((a, s) => a + s.patients * (s.wow ?? 0), 0) / total;
}

export function buildBriefing(brand: Brand, now: Date = new Date()): Briefing {
  const through = dataThroughDate(now);

  const persistent = stageOf(brand, "persistent")!;

  // Fulfilment: patients past the shipment gate vs everyone enrolled onwards.
  const fulfilled = ["shipment", "nurse-training", "persistent"].map((id) => stageOf(brand, id));
  const enrolledOnwards = brand.stages.filter(
    (s) => !["referral", "rx"].includes(s.id),
  );
  const fulfilledCount = fulfilled.reduce((a, s) => a + (s?.patients ?? 0), 0);
  const enrolledCount = enrolledOnwards.reduce((a, s) => a + s.patients, 0) || 1;
  const fulfilmentRate = (fulfilledCount / enrolledCount) * 100;
  const fulfilWow = weightedWow(fulfilled) * 100;

  // Time to ship: enrollment through shipment.
  const toShip = ["enrollment", "benefit-check", "prior-auth", "triage", "shipment"].map((id) =>
    stageOf(brand, id),
  );
  const timeToShip = toShip.reduce((a, s) => a + (s?.avgTat ?? 0), 0);
  const priorTimeToShip = toShip.reduce(
    (a, s) => a + (s?.avgTat ?? 0) / (1 + (s?.wow ?? 0) * 0.5),
    0,
  );
  const shipDelta = timeToShip - priorTimeToShip;

  const persistency = persistent.persistency6 ?? 65;
  const persistencyDelta = (persistent.wow ?? 0) * 100;

  const flagged = brand.stages.find((s) => s.flagged) ?? brand.stages[4];
  const slip = (flagged.avgTat ?? 0) - (flagged.expectedTat ?? 0);

  return {
    stamp: formatBriefingStamp(through),
    greeting: "Good morning, John.",
    narrative:
      `${brand.name} (${brand.indicationShort}) is holding ${persistency}% six-month persistency with a ` +
      `${fulfilmentRate.toFixed(0)}% fulfilment rate, and it takes ${timeToShip.toFixed(1)} days to get a ` +
      `patient from enrollment to first ship. One signal explains most of the drag: ` +
      `${flagged.label.toLowerCase()} is running ${slip.toFixed(1)} days over target with ` +
      `${flagged.patients.toLocaleString()} patients waiting. Here is your day.`,
    metrics: [
      {
        label: "Persistency (6-month)",
        value: `${persistency}%`,
        delta: `${persistencyDelta >= 0 ? "+" : ""}${persistencyDelta.toFixed(1)} pts vs prior week`,
        deltaGood: persistencyDelta >= 0,
      },
      {
        label: "Fulfilment rate",
        value: `${fulfilmentRate.toFixed(0)}%`,
        delta: `${fulfilWow >= 0 ? "+" : ""}${fulfilWow.toFixed(1)}% vs prior week`,
        deltaGood: fulfilWow >= 0,
      },
      {
        label: "Time to ship",
        value: `${timeToShip.toFixed(1)} days`,
        delta: `${shipDelta >= 0 ? "+" : ""}${shipDelta.toFixed(1)} days vs prior week`,
        deltaGood: shipDelta <= 0,
      },
    ],
  };
}

/** ---------- Alerts ---------- */

export type AlertSeverity = "high" | "medium" | "low";

export type JourneyAlert = {
  id: string;
  severity: AlertSeverity;
  category: string;
  status: "Active" | "In progress" | "Dismissed" | "Completed";
  age: string;
  title: string;
  body: string;
  patients: number;
  owner: string;
  confidence: number;
  stageId: JourneyStageId;
};

type StageAlertCopy = { category: string; owner: string; detail: string };

const stageAlertCopy: Record<string, StageAlertCopy> = {
  referral: {
    category: "Referral intake",
    owner: "Intake Specialist team",
    detail: "referrals arriving without complete prescriber demographics, forcing rework at intake",
  },
  rx: {
    category: "Intake",
    owner: "Intake Specialist team",
    detail: "incomplete Rx forms and missing dosing details bouncing back to the prescriber",
  },
  enrollment: {
    category: "Enrollment TAT",
    owner: "Hub Coordinator",
    detail: "mostly incomplete consent and missing prescriber signatures at intake",
  },
  "benefit-check": {
    category: "Benefit investigation",
    owner: "Hub Supervisor",
    detail:
      "payer verifications stalling on missing plan IDs and unreturned benefit calls, with the backlog concentrated in commercial plans",
  },
  "prior-auth": {
    category: "Prior authorization",
    owner: "Unassigned",
    detail:
      "concentrated in offices new to the brand, where step-therapy and clinical documentation requirements are least familiar",
  },
  triage: {
    category: "Triage",
    owner: "Case Manager team",
    detail: "hand-offs waiting on case assignment before the pharmacy can be engaged",
  },
  shipment: {
    category: "Shipment",
    owner: "SP Liaison",
    detail: "specialty pharmacy scheduling and patient-reachability delays before first fill",
  },
  "nurse-training": {
    category: "Nurse training",
    owner: "Nurse Navigator team",
    detail: "injection-training visits waiting on nurse scheduling capacity",
  },
};

const fallbackCopy: StageAlertCopy = {
  category: "Journey delay",
  owner: "Hub Supervisor",
  detail: "patients waiting longer than target at this step",
};

export function buildAlerts(brand: Brand): JourneyAlert[] {
  const persistent = stageOf(brand, "persistent")!;

  const slipping = brand.stages
    .filter((s) => s.avgTat != null && s.expectedTat != null)
    .map((s) => ({ stage: s, slip: (s.avgTat ?? 0) - (s.expectedTat ?? 0) }))
    .filter((x) => x.slip > 0)
    .sort((a, b) => {
      if (!!b.stage.flagged !== !!a.stage.flagged) return b.stage.flagged ? 1 : -1;
      return b.slip - a.slip;
    });

  const toAlert = (
    { stage, slip }: { stage: JourneyStage; slip: number },
    rank: number,
  ): JourneyAlert => {
    const copy = stageAlertCopy[stage.id] ?? fallbackCopy;
    const severity: AlertSeverity = rank === 0 ? "high" : slip >= 1.5 ? "medium" : "low";
    return {
      id: `stage-${stage.id}`,
      severity,
      category: copy.category,
      status: rank === 0 ? "Active" : "In progress",
      age: rank === 0 ? "6 hours ago" : `${rank + 2} days ago`,
      title: `${stage.label} running ${slip.toFixed(1)} days over target`,
      body:
        `${stage.patients.toLocaleString()} ${brand.name} patients are sitting at ${stage.label.toLowerCase()} ` +
        `at an average ${stage.avgTat}d versus ${stage.expectedTat}d expected — ${copy.detail}.`,
      patients: stage.patients,
      owner: copy.owner,
      confidence: Math.max(70, 90 - rank * 6),
      stageId: stage.id,
    };
  };

  const persistencyAlert: JourneyAlert = {
    id: "persistency",
    severity: "high",
    category: "Persistency",
    status: "Active",
    age: "1 day ago",
    title: `6-month persistency holding at ${persistent.persistency6}%`,
    body:
      `${persistent.patients.toLocaleString()} ${brand.name} patients are on therapy at an average ` +
      `${persistent.daysOnTherapy} days. Drop-off clusters as dosing escalates, with tolerability ` +
      `and side-effect burden the leading discontinuation reasons.`,
    patients: Math.round(persistent.patients * (1 - (persistent.persistency6 ?? 65) / 100)),
    owner: "Nurse Navigator team",
    confidence: 84,
    stageId: "persistent",
  };

  const top = slipping.slice(0, 2).map(toAlert);
  return [top[0], persistencyAlert, ...top.slice(1)].filter(Boolean) as JourneyAlert[];
}


export const alertStatusCounts = [
  { label: "Active", key: "active", count: 2 },
  { label: "In progress", key: "in-progress", count: 1 },
  { label: "Dismissed", key: "dismissed", count: 1 },
  { label: "Completed", key: "completed", count: 1 },
] as const;

/** ---------- PSP utilization trend ---------- */

export type UtilizationSeriesKey = "copay" | "bridge" | "hub" | "nurse";

export const utilizationSeries: {
  key: UtilizationSeriesKey;
  label: string;
  color: string;
}[] = [
  { key: "copay", label: "Copay enrollment", color: "var(--risk-5)" },
  { key: "bridge", label: "Bridge", color: "var(--risk-3)" },
  { key: "hub", label: "Hub enrollment", color: "var(--signal)" },
  { key: "nurse", label: "Nurse enrollment", color: "var(--risk-1)" },
];

export type UtilizationPoint = { week: string } & Record<UtilizationSeriesKey, number>;

function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function buildUtilizationTrend(
  brand: Brand,
  weeks: number,
  now: Date = new Date(),
): UtilizationPoint[] {
  const total = brand.stages.reduce((a, s) => a + s.patients, 0);
  const rand = seeded(brand.id.length * 977 + total);
  const base: Record<UtilizationSeriesKey, number> = {
    copay: total * 0.34,
    bridge: total * 0.12,
    hub: total * 0.46,
    nurse: total * 0.21,
  };
  const drift: Record<UtilizationSeriesKey, number> = {
    copay: 0.006,
    bridge: -0.004,
    hub: 0.009,
    nurse: 0.003,
  };
  const through = dataThroughDate(now);

  return Array.from({ length: weeks }, (_, i) => {
    const step = i - (weeks - 1);
    const d = new Date(through);
    d.setDate(d.getDate() + step * 7);
    const point = {
      week: `${d.getMonth() + 1}/${d.getDate()}`,
    } as UtilizationPoint;
    for (const s of utilizationSeries) {
      const trend = 1 + drift[s.key] * (weeks + step);
      const noise = 0.94 + rand() * 0.12;
      point[s.key] = Math.round(base[s.key] * trend * noise);
    }
    return point;
  });
}

/** ---------- Patient locations for the choropleth ---------- */

export function buildStatePatients(brand: Brand): Record<string, number> {
  const brandTotal = brand.stages.reduce((a, s) => a + s.patients, 0);
  const refTotal = stateRisks.reduce((a, s) => a + s.patients, 0) || 1;
  const scale = brandTotal / refTotal;
  return Object.fromEntries(
    stateRisks.map((s) => [s.code, Math.max(1, Math.round(s.patients * scale))]),
  );
}

/**
 * Patients currently stuck in one journey stage, spread across states.
 * Deterministic: state patient volume weighted by that state's risk profile,
 * so bottleneck stages concentrate in the higher-friction geographies.
 */
export function buildStageStatePatients(
  brand: Brand,
  stageId: JourneyStageId,
): Record<string, number> {
  const stage = stageOf(brand, stageId);
  if (!stage) return {};
  const weights = stateRisks.map((s) => ({
    code: s.code,
    w: s.patients * (0.5 + s.neverStartRisk + s.discontinuationRisk * 0.5),
  }));
  const totalW = weights.reduce((a, s) => a + s.w, 0) || 1;
  return Object.fromEntries(
    weights
      .map((s) => [s.code, Math.round((s.w / totalW) * stage.patients)] as const)
      .filter(([, v]) => (v as number) > 0),
  );
}

/** PE.AI fulfillment risk buckets used by the Daily Summary map filter. */
export type RiskBucket = "all" | "high" | "medium" | "low";

export const riskBucketLabel: Record<RiskBucket, string> = {
  all: "All risk levels",
  high: "High risk",
  medium: "Medium risk",
  low: "Low risk",
};

export function isRiskBucket(v: unknown): v is RiskBucket {
  return v === "all" || v === "high" || v === "medium" || v === "low";
}

/**
 * Split a state's stage count into high / medium / low fulfillment risk.
 * Deterministic and exhaustive: the three buckets always sum back to `total`.
 */
export function splitStateRisk(code: string, total: number) {
  const s = stateRisks.find((x) => x.code === code);
  const highShare = Math.min(0.8, Math.max(0.12, s?.neverStartRisk ?? 0.3));
  const medShare = Math.min(0.6, Math.max(0.15, (s?.discontinuationRisk ?? 0.25) * 0.9));
  const high = Math.round(total * highShare);
  const medium = Math.min(total - high, Math.round(total * medShare));
  return { high, medium, low: Math.max(0, total - high - medium) };
}

/** Stage-stuck patients by state, optionally narrowed to one PE.AI risk bucket. */
export function buildStageStateRiskPatients(
  brand: Brand,
  stageId: JourneyStageId,
  bucket: RiskBucket = "all",
): Record<string, number> {
  const base = buildStageStatePatients(brand, stageId);
  if (bucket === "all") return base;
  return Object.fromEntries(
    Object.entries(base)
      .map(([code, v]) => [code, splitStateRisk(code, v)[bucket]] as const)
      .filter(([, v]) => v > 0),
  );
}

export function stageLabel(brand: Brand, stageId: JourneyStageId) {
  return stageOf(brand, stageId)?.label ?? stageId;
}

export function stateName(code: string) {
  return stateRisks.find((s) => s.code === code)?.name ?? code;
}
