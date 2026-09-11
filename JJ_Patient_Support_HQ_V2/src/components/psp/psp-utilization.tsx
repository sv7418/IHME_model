import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SectionCard } from "@/components/psp/stage-bits";
import { UsChoropleth } from "@/components/psp/us-choropleth";
import { RoleCoverage } from "@/components/psp/role-coverage";
import { useStageView } from "@/lib/psp-stage-view";
import {
  buildCohortRegistrations,
  buildContactMetrics,
  buildStateUtilization,
  services,
  statePatientsFor,
  type ServiceId,
} from "@/lib/psp-utilization";
import { cn } from "@/lib/utils";

export function PspUtilization() {
  const view = useStageView();

  const [service, setService] = useState<ServiceId | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);

  const registrations = useMemo(() => buildCohortRegistrations(view), [view]);
  const metrics = useMemo(() => buildContactMetrics(view), [view]);
  const stateValues = useMemo(() => buildStateUtilization(view, service), [view, service]);


  const cohortLabel = view.reasonLabel
    ? `${view.label} · ${view.reasonLabel}`
    : view.label;

  const metricLabel =
    service === "all"
      ? "% registered in any PSP service"
      : `% registered in ${services.find((s) => s.id === service)?.short}`;

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((m) => (
          <div key={m.id} className="rounded-lg border border-border bg-card p-3 shadow-panel">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {m.label}
            </p>
            <p className="tabular mt-1 text-xl font-semibold">{m.value}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{m.sub}</p>
            <p className="mt-1 text-[11px]">
              <span className="text-muted-foreground">{m.benchmark}</span>
              {m.delta !== 0 && (
                <span
                  className={cn(
                    "ml-1.5 font-semibold",
                    m.delta > 0 ? "text-risk-1" : "text-risk-5",
                  )}
                >
                  {m.delta > 0 ? "+" : ""}
                  {m.delta}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      <SectionCard
        title="Service registrations in this cohort"
        subtitle={`${cohortLabel} — ${view.patients.toLocaleString()} patients. Every service count is a subset of the same cohort.`}
      >
        <div className="h-[320px] w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={registrations} margin={{ top: 18, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="service"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
                width={56}
              />
              <Tooltip
                cursor={{ fill: "var(--surface-muted)", opacity: 0.5 }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--popover-foreground)",
                }}
                formatter={(value: number, _n, item) => {
                  const p = item?.payload as (typeof registrations)[number];
                  return [
                    `${value.toLocaleString()} patients (${p.share}% of cohort) · ${p.yoy >= 0 ? "+" : ""}${p.yoy} pts vs last year`,
                    p.label,
                  ];
                }}
              />
              <Bar dataKey="patients" radius={[3, 3, 0, 0]}>
                {registrations.map((r) => (
                  <Cell key={r.id} fill={services.find((s) => s.id === r.id)?.color} />
                ))}
                <LabelList
                  dataKey="share"
                  position="top"
                  formatter={(v: number) => `${v}%`}
                  style={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard
        title="Registration by state"
        subtitle="Share of this cohort's patients in each state registered for the selected service. Click a state for the full service mix."
        right={
          <Select value={service} onValueChange={(v) => setService(v as ServiceId | "all")}>
            <SelectTrigger className="h-8 w-[240px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All services (blended)</SelectItem>
              {services.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        <div className="p-4">
          <UsChoropleth
            values={stateValues}
            selected={selected}
            onSelect={setSelected}
            metricLabel={metricLabel}
            bands={[
              { min: 65, fill: "var(--risk-1)", label: "65%+" },
              { min: 45, fill: "var(--risk-2)", label: "45–64%" },
              { min: 30, fill: "var(--risk-3)", label: "30–44%" },
              { min: 1, fill: "var(--risk-5)", label: "under 30%" },
            ]}
            suffix="%"
          />
        </div>
      </SectionCard>

      <RoleCoverage />


      <Sheet open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>
                  {view.states.find((s) => s.code === selected)?.name ?? selected} — service
                  registrations
                </SheetTitle>
                <SheetDescription>
                  {statePatientsFor(view, selected).toLocaleString()} patients · {cohortLabel}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-2 px-4 pb-6">
                {services.map((s) => {
                  const rate = buildStateUtilization(view, s.id)[selected] ?? 0;
                  const cohortRate = registrations.find((r) => r.id === s.id)?.share ?? 0;
                  const below = rate < cohortRate;
                  return (
                    <div key={s.id} className="rounded-md border border-border p-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{s.label}</span>
                        <span className="tabular">
                          {rate}%{" "}
                          <span className={cn(below ? "text-risk-5" : "text-risk-1")}>
                            ({below ? "" : "+"}
                            {rate - cohortRate} vs cohort)
                          </span>
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted">
                        <div
                          className={cn("h-full rounded-full", below ? "bg-risk-5/80" : "bg-risk-1/80")}
                          style={{ width: `${Math.min(100, rate)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        ≈{" "}
                        {Math.round(
                          (statePatientsFor(view, selected) * rate) / 100,
                        ).toLocaleString()}{" "}
                        patients registered
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

    </>
  );
}
