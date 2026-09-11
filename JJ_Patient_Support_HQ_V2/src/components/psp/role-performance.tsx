import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { pct, rolePeople, supportRoles, type SupportRole } from "@/lib/psp-data";
import { coverageGaps, roleExtraValue, roleMetricConfig } from "@/lib/psp-detail-data";
import { AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatTile } from "./detail-bits";

const nOptions = [3, 5, 10];

export function RolePerformance() {
  const [role, setRole] = useState<SupportRole>("FRM");
  const [topN, setTopN] = useState(5);
  const [order, setOrder] = useState<"top" | "bottom">("top");

  const config = roleMetricConfig[role];

  const people = useMemo(() => {
    const sorted = rolePeople
      .filter((p) => p.role === role)
      .sort((a, b) =>
        order === "top" ? b.actionRate - a.actionRate : a.actionRate - b.actionRate,
      );
    return sorted.slice(0, topN);
  }, [role, topN, order]);

  const gaps = coverageGaps(role);
  const maxRate = Math.max(...people.map((p) => p.actionRate), 0.01);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card shadow-panel">
        <div className="flex flex-wrap gap-1 border-b border-border px-2 pt-2">
          {supportRoles.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                "rounded-t-md border-b-2 px-3 py-2 text-xs transition-colors",
                role === r
                  ? "border-signal font-semibold text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold tracking-tight">{role} performance</h3>
            <p className="text-xs text-muted-foreground">{config.blurb}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md bg-secondary p-1">
              {(["top", "bottom"] as const).map((o) => (
                <button
                  key={o}
                  onClick={() => setOrder(o)}
                  className={cn(
                    "rounded px-2.5 py-1 text-xs capitalize transition-colors",
                    order === o
                      ? "bg-card font-medium text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {o} performers
                </button>
              ))}
            </div>
            <Select value={String(topN)} onValueChange={(v) => setTopN(Number(v))}>
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {nOptions.map((n) => (
                  <SelectItem key={n} value={String(n)} className="text-xs">
                    {order === "top" ? "Top" : "Bottom"} {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
          {config.kpis.map((k) => (
            <StatTile key={k.label} label={k.label} value={k.value} caption={k.caption} />
          ))}
        </div>

        <ul className="divide-y divide-border border-t border-border">
          {people.map((p, i) => (
            <li key={p.id} className="flex items-center gap-4 px-4 py-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                {i + 1}
              </span>
              <div className="min-w-44">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.territory}</p>
              </div>
              <div className="hidden flex-1 md:block">
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(p.actionRate / maxRate) * 100}%` }}
                  />
                </div>
              </div>
              <dl className="flex shrink-0 flex-wrap items-center justify-end gap-x-5 gap-y-1 text-right text-xs">
                <Stat label="Action rate" value={pct(p.actionRate)} strong />
                <Stat
                  label={config.extra.label}
                  value={roleExtraValue(p.id, role, p.actionRate)}
                />
                <Stat label="Triggers" value={p.triggersActedOn.toLocaleString()} />
                <Stat label="Patients" value={p.patientsSupported.toLocaleString()} />
                <Stat label="Accounts" value={String(p.accountsCovered)} />
                <Stat label="Days to act" value={p.avgTimeToAction.toFixed(1)} />
              </dl>
            </li>
          ))}
        </ul>
      </div>

      {gaps.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-border bg-accent/40 px-4 py-3 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
          <p className="text-foreground/85">
            <span className="font-semibold">Coverage gaps · {role}:</span> {gaps.join(", ")} are
            below the 70% action-rate target.
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="min-w-16">
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={cn("tabular", strong ? "text-sm font-semibold" : "text-sm")}>{value}</dd>
    </div>
  );
}
