import { Lightbulb } from "lucide-react";

export function InsightBar({ points }: { points: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-accent/40 p-3.5">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">
        <Lightbulb className="h-3.5 w-3.5" /> What this means
      </p>
      <ul className="mt-1.5 space-y-1">
        {points.map((p) => (
          <li key={p} className="flex gap-2 text-sm text-foreground/85">
            <span className="text-signal">→</span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SectionCard({
  title,
  subtitle,
  children,
  right,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

export function RiskChips({
  risk,
}: {
  risk: { high: number; medium: number; low: number };
}) {
  return (
    <span className="flex items-center gap-1.5 tabular">
      <span className="rounded bg-risk-5/20 px-1.5 py-0.5 text-[11px] font-semibold text-risk-5">
        {risk.high} H
      </span>
      <span className="rounded bg-risk-3/25 px-1.5 py-0.5 text-[11px] font-semibold text-foreground/80">
        {risk.medium} M
      </span>
      <span className="rounded bg-risk-1/25 px-1.5 py-0.5 text-[11px] font-semibold text-foreground/80">
        {risk.low} L
      </span>
    </span>
  );
}
