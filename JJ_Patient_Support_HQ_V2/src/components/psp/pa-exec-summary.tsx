import { useState } from "react";
import { KpiCard } from "@/components/psp/kpi-card";
import { SectionCard } from "@/components/psp/stage-bits";
import { ReasonDrawer } from "@/components/psp/reason-drawer";
import { useStageView, type StageView } from "@/lib/psp-stage-view";
import { insightLenses } from "@/lib/psp-sections";
import { PaGeography } from "@/components/psp/pa-geography";
import { PaAccounts } from "@/components/psp/pa-accounts";
import { PaPayers } from "@/components/psp/pa-payers";
import { sliceViewByReason } from "@/lib/psp-reason-slice";
import { cn } from "@/lib/utils";
import { AlertTriangle, ChevronRight, Clock, Users } from "lucide-react";

/** One-line "so what" per reason, built from the same slice the drawer shows. */
function reasonInsight(view: StageView, reasonId: string): string {
  const slice = sliceViewByReason(view, reasonId);
  const payer = slice.payers[0];
  const state = slice.states[0];
  const account = slice.accounts[0];
  const parts: string[] = [];
  if (state) {
    parts.push(
      `${Math.round((state.patients / (slice.patients || 1)) * 100)}% sit in ${state.name}`,
    );
  }
  if (payer) {
    parts.push(
      `${payer.name} carries ${payer.patients} of them at ${Math.round(payer.firstPassApproval * 100)}% first-pass`,
    );
  }
  if (account) {
    parts.push(`${account.name} is the densest account (${account.patients} patients)`);
  }
  return parts.length ? `${parts.join("; ")}.` : "Open the drill-down for the full breakdown.";
}

export function PaExecSummary() {
  const view = useStageView();
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [lens, setLens] = useState<"geography" | "accounts" | "payer" | null>(null);

  const slow = view.avgDays > view.expectedDays;

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard
          label={view.isAll ? "Open patients" : "Patients in stage"}
          value={view.totals.patients.toLocaleString()}
          caption={`${view.label} · active today`}
          icon={<Users className="h-4 w-4" />}
        />
        <KpiCard
          label={`% at ${view.riskLabel}`}
          value={`${Math.round((view.totals.risk.high / (view.totals.patients || 1)) * 100)}%`}
          caption={`${view.totals.risk.high.toLocaleString()} of ${view.totals.patients.toLocaleString()} patients`}
          tone={view.totals.risk.high / (view.totals.patients || 1) > 0.5 ? "alert" : "default"}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <KpiCard
          label={view.isAll ? "Avg. days per open stage" : "Avg. days in stage"}
          value={view.avgDays.toFixed(1)}
          unit="days"
          caption={`vs ${view.expectedDays.toFixed(1)} days expected`}
          tone={slow ? "alert" : "default"}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Look at these barriers by:</span>
          {insightLenses.map((l) => {
            const Icon = l.icon;
            const on = lens === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setLens(on ? null : l.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-surface-muted",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {l.label}
              </button>
            );
          })}
        </div>

        {lens === "geography" && <PaGeography />}
        {lens === "accounts" && <PaAccounts />}
        {lens === "payer" && <PaPayers />}
      </div>

      <SectionCard
        title={
          view.isAll
            ? "Key barriers holding patients across the journey"
            : `Key barriers holding patients in ${view.label.toLowerCase()}`
        }
        subtitle={`Ranked by patient volume — barriers overlap, so a patient can carry more than one and the shares add to more than 100% of the ${view.totals.patients.toLocaleString()} patients`}
      >
        <div className="flex flex-col gap-3 p-3">
          {view.reasons.map((r, i) => {
            const share = Math.round((r.patients / (view.patients || 1)) * 100);
            const top = i === 0;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setOpenReason(r.id)}
                className={cn(
                  "group flex h-full flex-col rounded-lg border border-border bg-card p-3.5 text-left shadow-panel transition-colors",
                  "hover:border-signal/60 hover:bg-signal/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50",
                  top && "border-l-2 border-l-risk-5",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="tabular mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-surface-muted text-[11px] font-semibold text-muted-foreground">
                      {i + 1}
                    </span>
                    <p className="text-sm font-semibold leading-snug">{r.label}</p>
                  </div>
                  <p className="tabular shrink-0 text-right">
                    <span className="text-xl font-semibold">{r.patients}</span>
                    <span className="block text-[11px] font-normal text-muted-foreground">
                      {share}% {view.isAll ? "of patients" : "of stage"}
                    </span>
                  </p>
                </div>

                <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-risk-5/85"
                    style={{ width: `${Math.min(100, share)}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-muted-foreground">{r.detail}</p>

                <div className="mt-2.5 rounded-md border border-border bg-surface-muted/60 p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Insight
                  </p>
                  <p className="mt-0.5 text-xs text-foreground/85">{reasonInsight(view, r.id)}</p>
                </div>

                <div className="mt-3 flex justify-end">
                  <span className="inline-flex items-center gap-1 rounded-md border border-signal/40 bg-signal/[0.06] px-2 py-1 text-xs font-medium text-signal transition-colors group-hover:bg-signal/15">
                    Drill down
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <ReasonDrawer reasonId={openReason} onOpenChange={(o) => !o && setOpenReason(null)} />

    </>
  );
}
