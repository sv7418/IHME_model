import { useState } from "react";
import { InsightBar, SectionCard } from "@/components/psp/stage-bits";
import { accountRiskOf, useStageView, type StageView } from "@/lib/psp-stage-view";
import type { PaAccount } from "@/lib/psp-stage-data";
import { FillHistogram, PieSplit } from "@/components/psp/drill-bits";
import { ageDistribution, fillTimeHistogram, settingSplit } from "@/lib/psp-drill-data";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function PaAccounts() {
  const view = useStageView();
  const [open, setOpen] = useState<PaAccount | null>(null);

  return (
    <>
      <SectionCard
        title={
          view.isAll
            ? "Accounts holding open patients"
            : `Accounts holding ${view.label.toLowerCase()} patients`
        }
        subtitle={`${view.accounts.length} accounts · ${view.totals.patients.toLocaleString()} patients · click an account for its profile`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-xs">
            <thead className="bg-surface-muted text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Account</th>
                <th className="px-3 py-2 font-medium">State</th>
                <th className="px-3 py-2 text-right font-medium">Patients</th>
                <th className="px-3 py-2 text-right font-medium">% high risk</th>
                <th className="px-3 py-2 font-medium">
                  Top 3 reasons for {view.riskLabelShort}
                </th>
                <th className="px-3 py-2 text-right font-medium">Last FRM call</th>
                <th className="px-3 py-2 font-medium">Education topic</th>
              </tr>
            </thead>
            <tbody>
              {view.accounts.map((a) => {
                const risk = accountRiskOf(a);
                const stale = a.lastFrmCallDaysAgo >= 12;
                const generic = a.lastFrmCallTopic.startsWith("General reimbursement");
                return (
                  <tr
                    key={a.name}
                    onClick={() => setOpen(a)}
                    className="cursor-pointer border-t border-border hover:bg-surface-muted/60"
                  >
                    <td className="px-3 py-2">
                      <p className="font-medium">{a.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {a.setting} · {a.size}
                        {a.centerOfExcellence ? " · center of excellence" : ""}
                      </p>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{a.state}</td>
                    <td className="px-3 py-2 text-right tabular font-semibold">{a.patients}</td>
                    <td className="px-3 py-2 text-right tabular font-semibold text-risk-5">
                      {Math.round((risk.high / (a.patients || 1)) * 100)}%
                    </td>
                    <td className="px-3 py-2">
                      <ol className="space-y-0.5">
                        {a.reasons.map((id, i) => (
                          <li key={id} className="text-muted-foreground">
                            <span className="font-medium text-foreground/80">{i + 1}.</span>{" "}
                            {view.reasonById[id]?.short ?? id}
                            {i === 0 && !a.centerOfExcellence && a.size === "Small" && (
                              <span className="text-muted-foreground">
                                {" "}
                                · low prescriber experience with treatment
                              </span>
                            )}
                          </li>
                        ))}
                      </ol>
                    </td>
                    <td
                      className={cn(
                        "px-3 py-2 text-right tabular",
                        stale ? "font-semibold text-risk-5" : "text-muted-foreground",
                      )}
                    >
                      {a.lastFrmCallDaysAgo}d ago
                    </td>
                    <td className={cn("px-3 py-2", generic ? "text-risk-4" : "text-muted-foreground")}>
                      {a.lastFrmCallTopic}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t border-border bg-surface-muted font-semibold">
                <td className="px-3 py-2" colSpan={2}>
                  Total
                </td>
                <td className="px-3 py-2 text-right tabular">{view.totals.patients}</td>
                <td className="px-3 py-2 text-right tabular text-risk-5">
                  {Math.round((view.totals.risk.high / (view.totals.patients || 1)) * 100)}%
                </td>
                <td className="px-3 py-2" colSpan={3} />
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {open && <AccountProfile account={open} view={view} />}
        </SheetContent>
      </Sheet>

      <InsightBar points={view.insights.accounts} />
    </>
  );
}

function AccountProfile({ account: a, view }: { account: PaAccount; view: StageView }) {
  const risk = accountRiskOf(a);
  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-base">{a.name}</SheetTitle>
        <SheetDescription>
          {a.stateName} ({a.state}) · {a.region} · {a.setting} {a.size}
          {a.centerOfExcellence ? " · center of excellence" : ""}
        </SheetDescription>
      </SheetHeader>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Tile label={`Patients in ${view.label.toLowerCase()}`} value={String(a.patients)} />
        <Tile
          label={`% high ${view.riskLabelShort}`}
          value={`${Math.round((risk.high / (a.patients || 1)) * 100)}%`}
          alert
        />
        <Tile label="Medium risk" value={String(risk.medium)} />
        <Tile label="Low risk" value={String(risk.low)} />
      </div>

      <div className="mt-5 space-y-4 text-sm">
        <Row label="Assigned FRM" value={a.frm} />
        <Row label="Last FRM call" value={`${a.lastFrmCallDaysAgo} days ago`} />
        <Row label="Last education topic" value={a.lastFrmCallTopic} />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Top drivers of {view.riskLabelShort}
          </p>
          <ol className="mt-1.5 space-y-1.5">
            {a.reasons.map((id, i) => (
              <li key={id} className="text-sm text-foreground/85">
                <span className="font-medium">
                  {i + 1}. {view.reasonById[id]?.short ?? id}
                </span>
                <p className="text-xs text-muted-foreground">{view.reasonById[id]?.detail}</p>
              </li>
            ))}
          </ol>
        </div>
        <Row
          label="Recommended next action"
          value={
            a.lastFrmCallDaysAgo >= 12
              ? `Stage-specific field visit focused on ${view.reasonById[a.reasons[0]]?.short.toLowerCase() ?? "the top blocker"} at this site`
              : "Maintain cadence; confirm the outstanding items on open cases"
          }
        />

        <div className="space-y-4 pt-1">
          <FillHistogram
            title="Time to fill at this account"
            rows={fillTimeHistogram(`acct|${a.name}`, view.avgDays, view.reasonId ?? null, view.avgDays * 1.6)}
            filteredLabel={view.reasonId ? view.reasonLabel : null}
            overallLabel="Account average"
          />
          <PieSplit title="Age distribution" slices={ageDistribution(`${a.state}|${a.name}`, a.patients, a.setting === "Rural" ? 0.8 : 0.15)} />
          <PieSplit title="Setting mix in this territory" slices={settingSplit(view.accounts.filter((x) => x.state === a.state))} />
        </div>
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
