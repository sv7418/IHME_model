import { cn } from "@/lib/utils";
import { pct } from "@/lib/psp-data";
import type { ChannelMix, DriverRow, PayerRow, PharmacyRow } from "@/lib/psp-detail-data";

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-border bg-card shadow-panel", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatTile({
  label,
  value,
  caption,
  tone,
}: {
  label: string;
  value: string;
  caption?: string;
  tone?: "alert" | "good";
}) {
  return (
    <div className="rounded-md border border-border bg-surface-muted px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={cn(
          "tabular text-lg font-semibold tracking-tight",
          tone === "alert" && "text-signal",
        )}
      >
        {value}
      </p>
      {caption && <p className="text-[11px] text-muted-foreground">{caption}</p>}
    </div>
  );
}

const channelColors = [
  "bg-primary",
  "bg-signal",
  "bg-risk-3",
  "bg-secondary-foreground/40",
] as const;

export function ChannelMixBar({ mix }: { mix: ChannelMix }) {
  const parts = [
    ["Commercial", mix.commercial],
    ["Medicare", mix.medicare],
    ["Medicaid", mix.medicaid],
    ["Other / cash", mix.other],
  ] as const;
  return (
    <div className="space-y-2 px-4 py-3">
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {parts.map(([label, value], i) => (
          <div
            key={label}
            className={channelColors[i]}
            style={{ width: `${value * 100}%` }}
            title={`${label} ${pct(value)}`}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1">
        {parts.map(([label, value], i) => (
          <li key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("h-2.5 w-2.5 rounded-sm", channelColors[i])} />
            {label} <span className="tabular font-medium text-foreground">{pct(value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DriverList({ drivers }: { drivers: DriverRow[] }) {
  const max = drivers[0]?.contribution ?? 1;
  return (
    <ol className="divide-y divide-border">
      {drivers.map((d, i) => (
        <li key={d.label} className="px-4 py-2.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium">
              <span className="mr-2 text-xs text-muted-foreground">{i + 1}</span>
              {d.label}
            </p>
            <span className="tabular text-sm font-semibold">{pct(d.contribution)}</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-signal"
              style={{ width: `${(d.contribution / max) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{d.detail}</p>
        </li>
      ))}
    </ol>
  );
}

export function PayerTable({ payers }: { payers: PayerRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[440px] text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-muted text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2 font-medium">Payer</th>
            <th className="px-3 py-2 text-right font-medium">Share of patients</th>
            <th className="px-3 py-2 text-right font-medium">Approval</th>
            <th className="px-3 py-2 text-right font-medium">Denial</th>
            <th className="px-4 py-2 text-right font-medium">PA turnaround</th>
          </tr>
        </thead>
        <tbody>
          {payers.map((p) => (
            <tr key={p.name} className="border-b border-border/70 last:border-0">
              <td className="px-4 py-2 font-medium">{p.name}</td>
              <td className="px-3 py-2 text-right tabular">{pct(p.share, 1)}</td>
              <td className="px-3 py-2 text-right tabular">{pct(p.approvalRate)}</td>
              <td className="px-3 py-2 text-right tabular text-muted-foreground">
                {pct(p.denialRate)}
              </td>
              <td className="px-4 py-2 text-right tabular">{p.paTurnaround.toFixed(1)} d</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PharmacyTable({ rows }: { rows: PharmacyRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[440px] text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-muted text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2 font-medium">Specialty pharmacy</th>
            <th className="px-3 py-2 text-right font-medium">Patients</th>
            <th className="px-3 py-2 text-right font-medium">Fulfillment</th>
            <th className="px-3 py-2 text-right font-medium">Persistency</th>
            <th className="px-4 py-2 text-right font-medium">Time to 1st fill</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.name} className="border-b border-border/70 last:border-0">
              <td className="px-4 py-2 font-medium">{p.name}</td>
              <td className="px-3 py-2 text-right tabular">{p.patients.toLocaleString()}</td>
              <td className="px-3 py-2 text-right tabular">{pct(p.fulfillmentRate)}</td>
              <td className="px-3 py-2 text-right tabular">{pct(p.persistencyRate)}</td>
              <td className="px-4 py-2 text-right tabular">{p.timeToFirstFill.toFixed(1)} d</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
