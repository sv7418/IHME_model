import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import type { Slice } from "@/lib/psp-drill-data";
import { histogramMean, type FillBucket } from "@/lib/psp-drill-data";

/** Horizontal bar list used across every drill-down drawer. */
export function BarList({
  title,
  slices,
  unit = "patients",
  tone = "primary",
  max: maxOverride,
  emptyLabel = "No data in this slice",
  showShare = true,
  valueSuffix = "",
  hideTotal = false,
}: {
  title: string;
  slices: Slice[];
  unit?: string;
  tone?: "primary" | "risk" | "signal";
  max?: number;
  emptyLabel?: string;
  /** Show each row's share of the total. Off for lists of percentages. */
  showShare?: boolean;
  /** Suffix appended to each row's value, e.g. "%". */
  valueSuffix?: string;
  hideTotal?: boolean;
}) {
  const max = maxOverride ?? Math.max(...slices.map((s) => s.value), 1);
  const total = slices.reduce((s, x) => s + x.value, 0);
  const barClass =
    tone === "risk" ? "bg-risk-5/85" : tone === "signal" ? "bg-signal/70" : "bg-primary";

  return (
    <div className="rounded-md border border-border">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-surface-muted px-3 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide">{title}</p>
        {!hideTotal && (
          <p className="tabular text-[11px] text-muted-foreground">
            {total.toLocaleString()} {unit}
          </p>
        )}
      </div>
      <ul className="space-y-2 p-3">
        {slices.length === 0 && <li className="text-xs text-muted-foreground">{emptyLabel}</li>}
        {slices.map((s) => (
          <li key={s.label} className="text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{s.label}</span>
              <span className="tabular font-semibold">
                {s.value}
                {valueSuffix}
                {showShare && (
                  <span className="ml-1.5 font-normal text-muted-foreground">
                    {total ? Math.round((s.value / total) * 100) : 0}%
                  </span>
                )}
              </span>
            </div>
            <span className="mt-1 block h-2 overflow-hidden rounded-full bg-surface-muted">
              <span
                className={cn("block h-full rounded-full", barClass)}
                style={{ width: `${(s.value / max) * 100}%` }}
              />
            </span>
            {s.sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{s.sub}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatTile({
  label,
  value,
  caption,
  alert,
}: {
  label: string;
  value: string;
  caption?: string;
  alert?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-surface-muted p-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-1 tabular text-xl font-semibold", alert && "text-risk-5")}>{value}</p>
      {caption && <p className="text-[10px] text-muted-foreground">{caption}</p>}
    </div>
  );
}

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-risk-3)",
];

/** Donut chart for share-style splits (age bands, urban vs. rural). */
export function PieSplit({
  title,
  slices,
  unit = "patients",
}: {
  title: string;
  slices: Slice[];
  unit?: string;
}) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  return (
    <div className="rounded-md border border-border">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-surface-muted px-3 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide">{title}</p>
        <p className="tabular text-[11px] text-muted-foreground">
          {total.toLocaleString()} {unit}
        </p>
      </div>
      <div className="grid items-center gap-2 p-3 sm:grid-cols-[150px_1fr]">
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="label"
                innerRadius={38}
                outerRadius={62}
                paddingAngle={2}
                stroke="none"
                isAnimationActive={false}
              >
                {slices.map((s, i) => (
                  <Cell key={s.label} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 6,
                  border: "1px solid var(--color-border)",
                  background: "var(--color-card)",
                  color: "var(--color-foreground)",
                }}
                formatter={(v: number) => [`${v} ${unit}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-1">
          {slices.map((s, i) => (
            <li key={s.label} className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
              />
              <span className="flex-1 truncate">{s.label}</span>
              <span className="tabular font-semibold">
                {s.value}
                <span className="ml-1.5 font-normal text-muted-foreground">
                  {total ? Math.round((s.value / total) * 100) : 0}%
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Time-to-fill histogram: entity average vs. the filtered reason cohort. */
export function FillHistogram({
  title,
  rows,
  filteredLabel,
  overallLabel = "Account average",
}: {
  title: string;
  rows: FillBucket[];
  filteredLabel?: string | null;
  overallLabel?: string;
}) {
  const meanAll = histogramMean(rows, "overall");
  const meanFiltered = filteredLabel ? histogramMean(rows, "filtered") : null;

  return (
    <div className="rounded-md border border-border">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-surface-muted px-3 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide">{title}</p>
        <p className="tabular text-[11px] text-muted-foreground">
          avg {meanAll.toFixed(1)}d
          {meanFiltered !== null && (
            <span className="ml-1.5 font-semibold text-risk-5">
              · filtered {meanFiltered.toFixed(1)}d
            </span>
          )}
        </p>
      </div>
      <div className="h-[180px] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="bucket" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip
              cursor={{ fill: "var(--color-surface-muted)" }}
              contentStyle={{
                fontSize: 11,
                borderRadius: 6,
                border: "1px solid var(--color-border)",
                background: "var(--color-card)",
                color: "var(--color-foreground)",
              }}
              formatter={(v: number) => `${v}%`}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar
              dataKey="overall"
              name={overallLabel}
              fill="var(--color-chart-1)"
              radius={[3, 3, 0, 0]}
              isAnimationActive={false}
            />
            {filteredLabel && (
              <Bar
                dataKey="filtered"
                name={filteredLabel}
                fill="var(--color-risk-5)"
                radius={[3, 3, 0, 0]}
                isAnimationActive={false}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
