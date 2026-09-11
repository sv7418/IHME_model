import { useMemo, useState } from "react";
import { UsChoropleth } from "@/components/psp/us-choropleth";
import { InsightBar, SectionCard } from "@/components/psp/stage-bits";
import { BarList, PieSplit, StatTile } from "@/components/psp/drill-bits";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { accountRiskOf, useStageView, type StageView } from "@/lib/psp-stage-view";
import { ageDistribution, settingSplit, statePayerMix } from "@/lib/psp-drill-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


function HighPct({ high, total }: { high: number; total: number }) {
  const pct = total ? Math.round((high / total) * 100) : 0;
  return (
    <span className={cn("tabular font-semibold", pct >= 60 ? "text-risk-5" : "text-foreground/80")}>
      {pct}%
    </span>
  );
}

function RiskBucket({
  label,
  count,
  total,
  tone,
}: {
  label: string;
  count: number;
  total: number;
  tone: "high" | "medium" | "low";
}) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  const toneClass =
    tone === "high"
      ? "border-risk-5/30 bg-risk-5/10 text-risk-5"
      : tone === "medium"
        ? "border-risk-3/30 bg-risk-3/10 text-risk-3"
        : "border-risk-1/30 bg-risk-1/10 text-risk-1";
  return (
    <div className={cn("rounded-md border p-2.5", toneClass)}>
      <p className="text-[10px] font-semibold uppercase tracking-wide">{label}</p>
      <p className="tabular text-xl font-semibold">{count}</p>
      <p className="text-[10px] text-muted-foreground">{pct}% of state</p>
    </div>
  );
}

export function PaGeography() {
  const view = useStageView();
  const [code, setCode] = useState<string | null>(null);
  const [drill, setDrill] = useState<string | null>(null);

  const values = useMemo(
    () => Object.fromEntries(view.states.map((s) => [s.code, s.patients])),
    [view.states],
  );
  const state = view.states.find((s) => s.code === code) ?? null;
  const drillState = view.states.find((s) => s.code === drill) ?? null;
  const stageWord = view.isAll ? "the journey" : `the ${view.label.toLowerCase()} stage`;

  const select = (next: string | null) => {
    setCode(next);
    setDrill(next);
  };

  return (
    <>
      <SectionCard
        title={view.isAll ? "Where open patients sit" : `Where the ${view.label.toLowerCase()} backlog sits`}
        subtitle={`${view.totals.patients.toLocaleString()} patients in ${stageWord} · click a state to drill in`}
        right={
          state && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => select(null)}>
              Clear selection
            </Button>
          )
        }
      >
        <div className="grid gap-4 p-4 xl:grid-cols-[1.5fr_1fr]">
          <UsChoropleth values={values} selected={drill} onSelect={(next) => setDrill(next)} />



          <div className="space-y-3">
            {state ? (
              <>
                <div className="rounded-md border border-border bg-surface-muted p-3">
                  <p className="text-sm font-semibold">
                    {state.name} <span className="text-muted-foreground">({state.code})</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {state.region} · {state.patients} patients · avg {state.avgDays} days in stage
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <RiskBucket
                    label="High risk"
                    count={state.risk.high}
                    total={state.patients}
                    tone="high"
                  />
                  <RiskBucket
                    label="Medium risk"
                    count={state.risk.medium}
                    total={state.patients}
                    tone="medium"
                  />
                  <RiskBucket
                    label="Low risk"
                    count={state.risk.low}
                    total={state.patients}
                    tone="low"
                  />
                </div>

                <div className="overflow-hidden rounded-md border border-border">
                  <p className="bg-surface-muted px-2.5 py-1.5 text-[11px] font-semibold">
                    Accounts in {state.name} · {view.riskLabelShort} buckets
                  </p>
                  <table className="w-full text-xs">
                    <thead className="text-left text-muted-foreground">
                      <tr className="border-t border-border">
                        <th className="px-2.5 py-1.5 font-medium">Account</th>
                        <th className="px-2.5 py-1.5 text-right font-medium">High</th>
                        <th className="px-2.5 py-1.5 text-right font-medium">Med</th>
                        <th className="px-2.5 py-1.5 text-right font-medium">Low</th>
                        <th className="px-2.5 py-1.5 text-right font-medium"># pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.accounts.map((a) => {
                        const r = accountRiskOf(a);
                        return (
                          <tr key={a.name} className="border-t border-border">
                            <td className="px-2.5 py-1.5 font-medium">
                              {a.name}
                              <span className="block text-[10px] font-normal text-muted-foreground">
                                {a.setting} · {a.size}
                                {a.centerOfExcellence ? " · CoE" : ""}
                              </span>
                            </td>
                            <td className="px-2.5 py-1.5 text-right tabular font-semibold text-risk-5">
                              {r.high}
                            </td>
                            <td className="px-2.5 py-1.5 text-right tabular text-risk-3">
                              {r.medium}
                            </td>
                            <td className="px-2.5 py-1.5 text-right tabular text-risk-1">
                              {r.low}
                            </td>
                            <td className="px-2.5 py-1.5 text-right tabular">{a.patients}</td>
                          </tr>
                        );
                      })}
                      <tr className="border-t border-border bg-surface-muted font-semibold">
                        <td className="px-2.5 py-1.5">{state.name} total</td>
                        <td className="px-2.5 py-1.5 text-right tabular">{state.risk.high}</td>
                        <td className="px-2.5 py-1.5 text-right tabular">{state.risk.medium}</td>
                        <td className="px-2.5 py-1.5 text-right tabular">{state.risk.low}</td>
                        <td className="px-2.5 py-1.5 text-right tabular">{state.patients}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="rounded-md border border-border bg-surface-muted p-3 text-xs text-muted-foreground">
                  <p className="text-sm font-semibold text-foreground">Select a state</p>
                  <p className="mt-1">
                    Each state shows its patient volume and the share at {view.riskLabel}. Everything
                    reconciles to the {view.totals.patients.toLocaleString()} patients in the current{" "}
                    {view.isAll ? "all-stage" : view.label.toLowerCase()} filter.
                  </p>
                </div>

                <div className="overflow-hidden rounded-md border border-border">
                  <p className="bg-surface-muted px-2.5 py-1.5 text-[11px] font-semibold">
                    All states in this cohort
                  </p>
                  <table className="w-full text-xs">
                    <thead className="text-left text-muted-foreground">
                      <tr className="border-t border-border">
                        <th className="px-2.5 py-1.5 font-medium">State</th>
                        <th className="px-2.5 py-1.5 font-medium">Region</th>
                        <th className="px-2.5 py-1.5 text-right font-medium"># patients</th>
                        <th className="px-2.5 py-1.5 text-right font-medium">% high risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {view.states.map((s) => (
                        <tr
                          key={s.code}
                          className="cursor-pointer border-t border-border hover:bg-surface-muted"
                          onClick={() => select(s.code)}
                        >
                          <td className="px-2.5 py-1.5 font-medium">{s.name}</td>
                          <td className="px-2.5 py-1.5 text-muted-foreground">{s.region}</td>
                          <td className="px-2.5 py-1.5 text-right tabular">{s.patients}</td>
                          <td className="px-2.5 py-1.5 text-right">
                            <HighPct high={s.risk.high} total={s.patients} />
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t border-border bg-surface-muted font-semibold">
                        <td className="px-2.5 py-1.5" colSpan={2}>
                          Total
                        </td>
                        <td className="px-2.5 py-1.5 text-right tabular">
                          {view.totals.patients}
                        </td>
                        <td className="px-2.5 py-1.5 text-right">
                          <HighPct high={view.totals.risk.high} total={view.totals.patients} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      <Sheet open={!!drillState} onOpenChange={(v) => !v && setDrill(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {drillState && <StateProfile state={drillState} view={view} />}
        </SheetContent>
      </Sheet>

      <InsightBar points={view.insights.geography} />
    </>

  );
}

function StateProfile({
  state,
  view,
}: {
  state: StageView["states"][number];
  view: StageView;
}) {
  const setting = settingSplit(state.accounts);
  const ruralShare = state.patients ? (setting[1]?.value ?? 0) / state.patients : 0;
  const accountBars = [...state.accounts]
    .map((a) => {
      const r = accountRiskOf(a);
      return {
        label: a.name,
        value: a.patients ? Math.round((r.high / a.patients) * 100) : 0,
        sub: `${a.patients} patients · ${r.high} at ${view.riskLabelShort.toLowerCase()} · ${a.setting}, ${a.size}`,
      };
    })
    .sort((a, b) => b.value - a.value);

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-base">
          {state.name} <span className="text-muted-foreground">({state.code})</span>
        </SheetTitle>
        <SheetDescription>
          {state.region} · {state.patients} patients · avg {state.avgDays} days in{" "}
          {view.isAll ? "stage" : view.label.toLowerCase()}
        </SheetDescription>
      </SheetHeader>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatTile
          label="High risk"
          value={String(state.risk.high)}
          caption={`${Math.round((state.risk.high / (state.patients || 1)) * 100)}% of state`}
          alert
        />
        <StatTile
          label="Medium risk"
          value={String(state.risk.medium)}
          caption={`${Math.round((state.risk.medium / (state.patients || 1)) * 100)}% of state`}
        />
        <StatTile
          label="Low risk"
          value={String(state.risk.low)}
          caption={`${Math.round((state.risk.low / (state.patients || 1)) * 100)}% of state`}
        />
      </div>

      <div className="mt-4 space-y-4">
        <BarList title="Payer distribution" slices={statePayerMix(view, state.code, state.patients)} />
        <PieSplit title="Urban vs. rural" slices={setting} />
        <PieSplit
          title="Age distribution"
          slices={ageDistribution(state.code, state.patients, ruralShare)}
        />
        <BarList
          title={`Accounts by % of patients at ${view.riskLabel}`}
          slices={accountBars}
          tone="risk"
          max={100}
          showShare={false}
          valueSuffix="%"
          hideTotal
        />
      </div>
    </>
  );
}
