import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  unit,
  delta,
  deltaGood,
  caption,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: number;
  deltaGood?: boolean;
  caption?: string;
  icon?: ReactNode;
  tone?: "default" | "alert";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-panel",
        tone === "alert" && "border-l-2 border-l-signal",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {icon && <span className="text-muted-foreground/70">{icon}</span>}
      </div>
      <p className="mt-2 flex items-baseline gap-1 text-3xl font-semibold tracking-tight tabular">
        {value}
        {unit && <span className="text-base font-medium text-muted-foreground">{unit}</span>}
      </p>
      <div className="mt-1.5 flex items-center gap-1.5 text-xs">
        {typeof delta === "number" && (
          <span
            className={cn(
              "flex items-center gap-0.5 font-medium",
              deltaGood ? "text-success" : "text-destructive",
            )}
          >
            {delta >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(delta * 100).toFixed(delta * 100 < 10 ? 1 : 0)}%
          </span>
        )}
        {caption && <span className="text-muted-foreground">{caption}</span>}
      </div>
    </div>
  );
}
