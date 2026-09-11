import { useState } from "react";
import { InsightBar, SectionCard } from "@/components/psp/stage-bits";
import { useStageView, type StageView } from "@/lib/psp-stage-view";
import type { PaPayer } from "@/lib/psp-stage-data";
import { BarList, FillHistogram } from "@/components/psp/drill-bits";
import { fillTimeHistogram, payerPlanVolumes, payerReasonMix } from "@/lib/psp-drill-data";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Check, Minus } from "lucide-react";

function Flag({ on }: { on: boolean }) {
  return on ? (
    <Check className="mx-auto h-3.5 w-3.5 text-risk-5" />
  ) : (
    <Minus className="mx-auto h-3.5 w-3.5 text-muted-foreground/50" />
  );
}

export function PaPayers() {
  const view = useStageView();
  const [open, setOpen] = useState<PaPayer | null>(null);
  const regional = view.payers.filter((p) => p.scope === "Regional");
  const regionalStep = regional.reduce((s, p) => s + (view.payerStep[p.id] ?? 0), 0);
  const totalPlansWithStep = view.payers.reduce((s, p) => s + view.plans(p).plansRequiringStep, 0);
  const stageWord = view.isAll ? "open patients" : `${view.label.toLowerCase()} patients`;

  return (
    <>
      <SectionCard
        title={`Payers holding ${stageWord}`}
        subtitle={
          view.showStepTherapy
            ? `${view.payers.length} payers · ${view.totals.patients.toLocaleString()} patients · ${view.totalStepPatients} sit on a step-therapy plan (matches the executive summary) · ${regional.length} small regional payers drive ${view.totalStepPatients ? Math.round((regionalStep / view.totalStepPatients) * 100) : 0}% of those holds`
            : `${view.payers.length} payers · ${view.totals.patients.toLocaleString()} patients · utilisation management is not the active blocker at this stage, so coverage terms are shown for context`
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-xs">
            <thead className="bg-surface-muted text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Payer</th>
                <th className="px-3 py-2 font-medium">Channel</th>
                <th className="px-3 py-2 font-medium">Scope</th>
                <th className="px-3 py-2 text-right font-medium">Patients</th>
                {view.showStepTherapy && (
                  <>
                    <th className="px-3 py-2 text-right font-medium">
                      Plans requiring step therapy
                    </th>
                    <th className="px-3 py-2 text-center font-medium">Step therapy</th>
                  </>
                )}
                <th className="px-3 py-2 text-center font-medium">Letter of med. necessity</th>
                <th className="px-3 py-2 text-right font-medium">PA TAT</th>
              </tr>
            </thead>
            <tbody>
              {view.payers.map((p) => {
                const plans = view.plans(p);
                return (
                  <tr
                    key={p.id}
                    onClick={() => setOpen(p)}
                    className="cursor-pointer border-t border-border hover:bg-surface-muted/60"
                  >
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.channel}</td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          p.scope === "Regional"
                            ? "border-risk-5/30 bg-risk-5/10 text-risk-5"
                            : "border-border text-muted-foreground",
                        )}
                      >
                        {p.scope}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tabular font-semibold">{p.patients}</td>
                    {view.showStepTherapy && (
                      <>
                        <td
                          className={cn(
                            "px-3 py-2 text-right tabular",
                            plans.plansRequiringStep === plans.plans && plans.plansRequiringStep > 0
                              ? "font-semibold text-risk-5"
                              : "text-foreground/80",
                          )}
                        >
                          {plans.plansRequiringStep} of {plans.plans}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <Flag on={p.requiresStepTherapy} />
                          {p.requiresStepTherapy && (
                            <span className="tabular text-[10px] text-muted-foreground">
                              {view.payerStep[p.id] ?? 0} pts
                            </span>
                          )}
                        </td>
                      </>
                    )}
                    <td className="px-3 py-2 text-center">
                      <Flag on={p.requiresLmn} />
                    </td>
                    <td
                      className={cn(
                        "px-3 py-2 text-right tabular",
                        p.paTat > 10 ? "font-semibold text-risk-5" : "text-muted-foreground",
                      )}
                    >
                      {p.paTat.toFixed(1)}d
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t border-border bg-surface-muted font-semibold">
                <td className="px-3 py-2" colSpan={3}>
                  Total
                </td>
                <td className="px-3 py-2 text-right tabular">{view.totals.patients}</td>
                {view.showStepTherapy && (
                  <>
                    <td className="px-3 py-2 text-right tabular">{totalPlansWithStep} plans</td>
                    <td className="px-3 py-2 text-center tabular">
                      {view.totalStepPatients} pts
                    </td>
                  </>
                )}
                <td className="px-3 py-2" colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {open && <PayerProfile payer={open} view={view} />}
        </SheetContent>
      </Sheet>

      <InsightBar points={view.insights.payers} />
    </>
  );
}

function PayerProfile({ payer: p, view }: { payer: PaPayer; view: StageView }) {
  const plans = view.plans(p);
  const step = view.payerStep[p.id] ?? 0;
  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-base">{p.name}</SheetTitle>
        <SheetDescription>
          {p.channel} · {p.scope} payer · {p.states.join(", ")}
        </SheetDescription>
      </SheetHeader>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Tile label={`Patients in ${view.label.toLowerCase()}`} value={String(p.patients)} />
        <Tile
          label="Plans requiring step therapy"
          value={`${plans.plansRequiringStep} of ${plans.plans}`}
          alert={plans.plansRequiringStep > 0}
        />
        <Tile label="Avg. PA turnaround" value={`${p.paTat.toFixed(1)}d`} alert={p.paTat > 10} />
        <Tile
          label="First-pass approval"
          value={`${Math.round(p.firstPassApproval * 100)}%`}
          alert={p.firstPassApproval < 0.6}
        />
      </div>

      <div className="mt-5 space-y-4">
        <BarList
          title="Patients by blocking reason"
          slices={payerReasonMix(view, p)}
          tone="risk"
        />
        <BarList title="Patient volume by plan ID" slices={payerPlanVolumes(view, p)} />
        <FillHistogram
          title="Time to fill under this payer"
          rows={fillTimeHistogram(`payer|${p.name}`, p.paTat + view.avgDays * 0.4, view.reasonId ?? null)}
          filteredLabel={view.reasonId ? view.reasonLabel : null}
          overallLabel="Payer average"
        />



        <Row label="Quantity limit requirements" value={p.quantityLimit} />
        <Row
          label="Typical step therapy requirement"
          value={p.requiresStepTherapy ? p.stepRequirement : "No step edit applied"}
        />
        {view.showStepTherapy && (
          <Row
            label="Patients carrying step-therapy requirement"
            value={
              p.requiresStepTherapy
                ? `${step} of ${p.patients} patients — only ${plans.plansRequiringStep} of ${plans.plans} plan designs carry the edit`
                : "None — no step edit on this payer's plans"
            }
          />
        )}
        {p.requiresStepTherapy && (
          <Row
            label="Payer–plan combinations with a step edit"
            value={view.planIds(p).join(" · ")}
          />
        )}
        <Row
          label="Letter of medical necessity"
          value={
            p.requiresLmn
              ? "Required with signed prescriber attestation and diagnostic data"
              : "Not required"
          }
        />
      </div>
    </>
  );
}

function Tile({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-surface-muted p-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-1 tabular text-xl font-semibold", alert && "text-risk-5")}>{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-foreground/85">{value}</p>
    </div>
  );
}
