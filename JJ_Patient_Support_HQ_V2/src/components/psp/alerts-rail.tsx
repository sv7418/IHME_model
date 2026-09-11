import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/psp-brand";
import { alertStatusCounts, buildAlerts, type AlertSeverity } from "@/lib/psp-journey-home";

const dotClass: Record<AlertSeverity, string> = {
  high: "bg-risk-5",
  medium: "bg-risk-3",
  low: "bg-muted-foreground",
};

/** Compact alerts list that lives in the left rail on every page. */
export function AlertsRail({ brand }: { brand: Brand }) {
  const navigate = useNavigate();
  const alerts = buildAlerts(brand);

  return (
    <div className="space-y-3">
      <p className="px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Alerts
      </p>

      <div className="grid grid-cols-2 gap-1.5">
        {alertStatusCounts.map((s, i) => (
          <div
            key={s.key}
            className={cn(
              "rounded-md border px-2 py-1.5",
              i === 0
                ? "border-primary/40 bg-primary/[0.06]"
                : "border-sidebar-border bg-sidebar-accent",
            )}
          >
            <span className="tabular block text-sm font-bold leading-none text-sidebar-accent-foreground">
              {s.count}
            </span>
            <span className="text-[10px] leading-tight text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <ul className="space-y-1.5">
        {alerts.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => navigate({ to: "/sense", search: { stage: a.stageId } })}
              className="w-full rounded-md border border-sidebar-border bg-card px-2.5 py-2 text-left transition-colors hover:border-primary/40 hover:bg-sidebar-accent"
            >
              <span className="flex items-start gap-2">
                <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", dotClass[a.severity])} />
                <span className="min-w-0">
                  <span className="block text-[12px] font-medium leading-snug text-sidebar-accent-foreground">
                    {a.title}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-muted-foreground">
                    <span className="tabular">{a.patients.toLocaleString()}</span> patients · {a.age}
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
