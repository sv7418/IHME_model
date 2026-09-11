import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { kpis as baseKpis } from "@/lib/psp-data";
import { dataThroughDate } from "@/lib/psp-journey-home";

export type Period = {
  /** preset key, or "custom" */
  key: string;
  from: Date;
  to: Date;
};

export type PeriodPreset = {
  key: string;
  label: string;
  days: number;
};

/** Anchor date of the dataset — always the "data through" date shown in the top bar. */
export function dataAnchor() {
  return dataThroughDate();
}

/** Monday of the reporting week that contains the data-through date. */
export function weekStart(d: Date) {
  const c = new Date(d);
  const dow = (c.getDay() + 6) % 7; // Monday = 0
  c.setDate(c.getDate() - dow);
  return c;
}

function daysBetween(from: Date, to: Date) {
  return Math.max(1, Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1);
}

export const periodPresets: PeriodPreset[] = [
  { key: "this-week", label: "This week", days: 7 },
  { key: "7d", label: "Last 7 days", days: 7 },
  { key: "30d", label: "Last 30 days", days: 30 },
  { key: "90d", label: "Last 90 days", days: 90 },
  { key: "qtd", label: "Quarter to date", days: 0 },
  { key: "ytd", label: "Year to date", days: 0 },
];

function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

export function presetPeriod(key: string): Period {
  const anchor = dataAnchor();
  const preset = periodPresets.find((p) => p.key === key) ?? periodPresets[0];

  if (preset.key === "this-week") {
    return { key: preset.key, from: weekStart(anchor), to: anchor };
  }
  if (preset.key === "qtd") {
    const q = Math.floor(anchor.getMonth() / 3) * 3;
    return { key: preset.key, from: new Date(anchor.getFullYear(), q, 1), to: anchor };
  }
  if (preset.key === "ytd") {
    return { key: preset.key, from: new Date(anchor.getFullYear(), 0, 1), to: anchor };
  }
  return { key: preset.key, from: addDays(anchor, -(preset.days - 1)), to: anchor };
}

/** Length in days of a preset, resolved against the current anchor. */
export function presetDays(key: string) {
  const p = presetPeriod(key);
  return daysBetween(p.from, p.to);
}


export function periodDays(p: Period) {
  return Math.max(1, Math.round((p.to.getTime() - p.from.getTime()) / 86_400_000) + 1);
}

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtShort = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function periodLabel(p: Period) {
  return `${fmtShort.format(p.from)} – ${fmt.format(p.to)}`;
}

export function periodSeed(p: Period) {
  return `${p.from.toISOString().slice(0, 10)}~${p.to.toISOString().slice(0, 10)}`;
}

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic multiplier in [1 - spread, 1 + spread] for a given period + metric. */
export function periodJitter(seed: string, metric: string, spread: number) {
  const u = (hash(`${seed}|${metric}`) % 10_000) / 10_000;
  return 1 + (u * 2 - 1) * spread;
}

/** Volume metrics scale roughly with period length (sub-linear to stay readable). */
export function volumeFactor(p: Period) {
  return Math.pow(periodDays(p) / 7, 0.85);
}

export type PeriodKpis = typeof baseKpis;

export function getPeriodKpis(p: Period): PeriodKpis {
  const seed = periodSeed(p);
  const vf = volumeFactor(p);
  const j = (metric: string, spread = 0.06) => periodJitter(seed, metric, spread);
  const clamp = (v: number, min = 0.3, max = 0.98) => Math.min(max, Math.max(min, v));

  const triggersGenerated = Math.round(baseKpis.triggersGenerated * vf * j("trig"));
  const actionRate = clamp(baseKpis.actionRate * j("action", 0.08), 0.4, 0.92);

  return {
    triggersGenerated,
    triggersActedOn: Math.round(triggersGenerated * actionRate),
    actionRate: Number(actionRate.toFixed(2)),
    patientsOnTherapy: Math.round(baseKpis.patientsOnTherapy * Math.pow(vf, 0.35) * j("pot", 0.04)),
    patientsOnTherapyDelta: Number((baseKpis.patientsOnTherapyDelta * j("potd", 0.5)).toFixed(3)),
    neverStartRiskPatients: Math.round(
      baseKpis.neverStartRiskPatients * Math.pow(vf, 0.35) * j("nsp", 0.07),
    ),
    neverStartRiskDelta: Number((baseKpis.neverStartRiskDelta * j("nsd", 0.6)).toFixed(3)),
    criticalGeographies: Math.max(
      3,
      Math.round(baseKpis.criticalGeographies * j("geo", 0.25)),
    ),
    frmCoverage: Number(clamp(baseKpis.frmCoverage * j("frm", 0.06)).toFixed(2)),
    frmCoverageDelta: Number((baseKpis.frmCoverageDelta * j("frmd", 0.6)).toFixed(3)),
    fulfillmentRate: Number(clamp(baseKpis.fulfillmentRate * j("ff", 0.05)).toFixed(3)),
    fulfillmentRateDelta: Number((baseKpis.fulfillmentRateDelta * j("ffd", 0.6)).toFixed(3)),
    discontinuationRiskPatients: Math.round(
      baseKpis.discontinuationRiskPatients * Math.pow(vf, 0.35) * j("dsc", 0.08),
    ),
    discontinuationRiskDelta: Number((baseKpis.discontinuationRiskDelta * j("dscd", 0.6)).toFixed(3)),
    avgTimeToFill: Number((baseKpis.avgTimeToFill * j("ttf", 0.12)).toFixed(1)),
    avgTimeToFillDelta: Number((baseKpis.avgTimeToFillDelta * j("ttfd", 0.5)).toFixed(2)),
    paApprovalRate: Number(clamp(baseKpis.paApprovalRate * j("pa", 0.05)).toFixed(3)),
    paApprovalRateDelta: Number((baseKpis.paApprovalRateDelta * j("pad", 0.6)).toFixed(3)),
  };
}

type PeriodContextValue = {
  period: Period;
  setPeriod: (p: Period) => void;
  seed: string;
  label: string;
  days: number;
  kpis: PeriodKpis;
};

const PeriodContext = createContext<PeriodContextValue | null>(null);

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<Period>(() => presetPeriod("this-week"));

  const value = useMemo<PeriodContextValue>(
    () => ({
      period,
      setPeriod,
      seed: periodSeed(period),
      label: periodLabel(period),
      days: periodDays(period),
      kpis: getPeriodKpis(period),
    }),
    [period],
  );

  return <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>;
}

export function usePeriod() {
  const ctx = useContext(PeriodContext);
  if (!ctx) throw new Error("usePeriod must be used inside a PeriodProvider");
  return ctx;
}
