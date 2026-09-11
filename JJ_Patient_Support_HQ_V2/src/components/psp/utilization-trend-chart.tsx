import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/psp-brand";
import {
  buildUtilizationTrend,
  utilizationSeries,
  type UtilizationSeriesKey,
} from "@/lib/psp-journey-home";

const WINDOWS = [8, 12, 26] as const;

export function UtilizationTrendChart({ brand }: { brand: Brand }) {
  const [weeks, setWeeks] = useState<number>(12);
  const [hidden, setHidden] = useState<UtilizationSeriesKey[]>([]);

  const data = buildUtilizationTrend(brand, weeks);
  const toggle = (key: UtilizationSeriesKey) =>
    setHidden((h) => (h.includes(key) ? h.filter((k) => k !== key) : [...h, key]));

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            PSP utilization trend
          </h3>
          <p className="text-xs text-muted-foreground">
            Patients enrolled in each support program, last {weeks} weeks
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-secondary p-1">
          {WINDOWS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWeeks(w)}
              className={cn(
                "rounded px-2.5 py-1 text-xs transition-colors",
                weeks === w
                  ? "bg-card font-medium text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {w}w
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              interval="preserveStartEnd"
              minTickGap={16}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--popover-foreground)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={28}
              iconType="plainline"
              wrapperStyle={{ fontSize: 11, cursor: "pointer" }}
              onClick={(e) => toggle(e.dataKey as UtilizationSeriesKey)}
            />
            {utilizationSeries.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                hide={hidden.includes(s.key)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-1 text-[11px] text-muted-foreground">
        Click a series in the legend to hide or show it.
      </p>
    </div>
  );
}
