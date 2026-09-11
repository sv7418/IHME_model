import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/psp/stage-bits";
import { UsChoropleth } from "@/components/psp/us-choropleth";
import { BarList } from "@/components/psp/drill-bits";
import { PatientsTable } from "@/components/psp/patients-table";
import { buildPatients } from "@/lib/psp-patients";
import { DraftEmailDialog, type EmailPrefill } from "@/components/psp/draft-email-dialog";
import { sliceViewByReason } from "@/lib/psp-reason-slice";
import { reasonBrief } from "@/lib/psp-reason-actions";
import { useStageView } from "@/lib/psp-stage-view";
import { ledgerKey, useLedger } from "@/lib/psp-ledger";
import { allRecipients } from "@/lib/psp-workflows";
import type { SectionId } from "@/lib/psp-sections";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowRight, Check, ClipboardList, Lightbulb, Mail } from "lucide-react";


function Panel({
  title,
  subtitle,
  section,
  onDeepDive,
  children,
}: {
  title: string;
  subtitle: string;
  section: SectionId;
  onDeepDive: (s: SectionId) => void;
  children: React.ReactNode;
}) {
  return (
    <SectionCard
      title={title}
      subtitle={subtitle}
      right={
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => onDeepDive(section)}
        >
          Deep dive <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      }
    >
      {children}
    </SectionCard>
  );
}

function Bar({ value, max }: { value: number; max: number }) {
  return (
    <span className="block h-2 w-24 overflow-hidden rounded-full bg-surface-muted">
      <span
        className="block h-full rounded-full bg-primary"
        style={{ width: `${max ? (value / max) * 100 : 0}%` }}
      />
    </span>
  );
}

function RoleBarList({
  heading,
  rows,
}: {
  heading: string;
  rows: { name: string; patients: number; detail: string }[];
}) {
  const max = Math.max(...rows.map((r) => r.patients), 1);
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {heading}
      </p>
      <ul className="mt-1.5 space-y-2">
        {rows.map((r) => (
          <li key={r.name} className="text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{r.name}</span>
              <span className="tabular font-semibold">{r.patients}</span>
            </div>
            <span className="mt-1 block h-2 overflow-hidden rounded-full bg-surface-muted">
              <span
                className="block h-full rounded-full bg-primary"
                style={{ width: `${(r.patients / max) * 100}%` }}
              />
            </span>
            {r.detail && <p className="mt-0.5 text-[11px] text-muted-foreground">{r.detail}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReasonDrawer({
  reasonId,
  onOpenChange,
}: {
  reasonId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const view = useStageView();
  const navigate = useNavigate();
  const ledger = useLedger();
  const [prefill, setPrefill] = useState<EmailPrefill | null>(null);


  const slice = useMemo(
    () => (reasonId ? sliceViewByReason(view, reasonId) : null),
    [view, reasonId],
  );

  const stageWord = view.isAll ? "the journey" : `the ${view.label.toLowerCase()} stage`;
  const brief = useMemo(
    () => (slice ? reasonBrief(slice, stageWord) : null),
    [slice, stageWord],
  );

  const patientRows = useMemo(() => (slice ? buildPatients(slice, 40) : []), [slice]);

  const geoValues = useMemo(
    () => (slice ? Object.fromEntries(slice.states.map((s) => [s.code, s.patients])) : {}),
    [slice],
  );

  if (!slice || !brief || !reasonId) {
    return <Sheet open={false} onOpenChange={onOpenChange} />;
  }

  const reason = view.reasonById[reasonId];
  const share = Math.round((slice.patients / (view.patients || 1)) * 100);
  const topAccounts = slice.accounts.slice(0, 8);
  const newAccounts = slice.accounts.filter((a) => a.newToBrand);
  const atRisk = slice.accounts.reduce(
    (s, a) => s + Math.min(a.patients, Math.round(a.patients * a.highShare)),
    0,
  );
  const accountSubtitle =
    reasonId === "new-hcp"
      ? `${newAccounts.length} offices started prescribing recently and hold ${slice.patients} patients · ${Math.round((atRisk / (slice.patients || 1)) * 100)}% at risk · last FRM call ${slice.avgDaysSinceFrmCall}d ago, mostly generic reimbursement or copay content`
      : `${topAccounts.reduce((s, a) => s + a.patients, 0)} of ${slice.patients} patients sit at these ${topAccounts.length} accounts`;
  const maxAccount = Math.max(...topAccounts.map((a) => a.patients), 1);

  const deepDive = (section: SectionId) => {
    onOpenChange(false);
    navigate({
      to: "/sense",
      search: {
        stage: view.stageId ?? undefined,
        section,
        reason: reasonId,
        state: view.stateId ?? undefined,
      },
    });
  };


  return (
    <>
      <Sheet open={Boolean(reasonId)} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto p-0 sm:max-w-3xl"
        >
          <div className="border-b border-border bg-surface-muted/60 px-5 py-4">
            <SheetHeader className="space-y-1 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {view.label} · blocker drill-down
              </p>
              <SheetTitle className="text-base">{reason?.label}</SheetTitle>
              <SheetDescription className="text-xs">
                <span className="tabular font-semibold text-foreground">
                  {slice.patients.toLocaleString()}
                </span>{" "}
                patients · {share}% of {stageWord} · {reason?.detail}
              </SheetDescription>
            </SheetHeader>
          </div>

          <div className="space-y-4 p-5">
            {/* key insight + actions */}
            <div className="rounded-lg border border-border bg-accent/40 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-[16rem] flex-1">
                  <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">
                    <Lightbulb className="h-3.5 w-3.5" /> Key insight
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {brief.insight.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-foreground/85">
                        <span className="text-signal">→</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-2">
                  {brief.actions.map((a, i) => {
                    const rec = allRecipients.find((r) => r.id === a.prefill.recipientId);
                    const email = a.prefill.customTo || rec?.email || "";
                    const key = ledgerKey(reasonId, a.prefill.subject ?? a.label, email);
                    const added = ledger.hasKey(key);
                    return (
                      <div key={a.id} className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={i === 0 ? "signal" : "outline"}
                          className="h-8 flex-1 justify-start text-xs"
                          onClick={() => setPrefill(a.prefill)}
                        >
                          <Mail className="h-3.5 w-3.5" /> {a.label}
                        </Button>
                        <Button
                          size="sm"
                          variant={added ? "secondary" : "outline"}
                          className="h-8 shrink-0 text-xs"
                          onClick={() => {
                            if (added) {
                              ledger.removeByKey(key);
                              return;
                            }
                            ledger.add({
                              stageId: view.stageId ?? null,
                              stageLabel: view.label,
                              reasonId,
                              issue: reason?.label ?? slice.reasonLabel ?? "Blocker",
                              patients: slice.patients,
                              description: `${a.label} — ${a.prefill.subject ?? ""}`.trim(),
                              recipientName: rec ? `${rec.name} — ${rec.title}` : email,
                              recipientEmail: email,
                              subject: a.prefill.subject ?? a.label,
                              body: a.prefill.body ?? "",
                            });
                            toast.success("Added to the Decision Ledger");
                          }}
                        >
                          {added ? (
                            <>
                              <Check className="h-3.5 w-3.5" /> Added
                            </>
                          ) : (
                            <>
                              <ClipboardList className="h-3.5 w-3.5" /> Add to ledger
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* 1. accounts */}
            <Panel
              title="Accounts behind this barrier"
              subtitle={accountSubtitle}
              section="accounts"
              onDeepDive={deepDive}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-xs">
                  <thead className="bg-surface-muted text-left text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Account</th>
                      <th className="px-3 py-2 font-medium">Profile</th>
                      <th className="px-3 py-2 font-medium">Last FRM call</th>
                      <th className="px-3 py-2 text-right font-medium">Patients</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAccounts.map((a) => (
                      <tr key={a.name} className="border-t border-border">
                        <td className="px-3 py-2">
                          <p className="font-medium">{a.name}</p>
                          <p className="text-[11px] text-muted-foreground">{a.stateName}</p>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {a.setting} · {a.size}
                          {a.centerOfExcellence ? " · CoE" : ""}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={cn(
                              "tabular font-semibold",
                              a.lastFrmCallDaysAgo >= 21 ? "text-risk-5" : "text-foreground/80",
                            )}
                          >
                            {a.lastFrmCallDaysAgo}d ago
                          </span>
                          <p className="text-[11px] text-muted-foreground">{a.lastFrmCallTopic}</p>
                        </td>
                        <td className="px-3 py-2">
                          <span className="flex items-center justify-end gap-2">
                            <Bar value={a.patients} max={maxAccount} />
                            <span className="tabular font-semibold">{a.patients}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            {/* 2. geography */}
            <Panel
              title="Where these patients are"
              subtitle={`${slice.states.length} states · ${slice.totals.southwest} of ${slice.totals.patients} in the Southwest`}
              section="geography"
              onDeepDive={deepDive}
            >
              <div className="p-4">
                <UsChoropleth
                  values={geoValues}
                  selected={null}
                  onSelect={() => undefined}
                  metricLabel={`patients blocked by ${(slice.reasonLabel ?? "").toLowerCase()}`}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {slice.states.slice(0, 6).map((s) => (
                    <span
                      key={s.code}
                      className="rounded-md border border-border bg-surface-muted px-2 py-1 text-[11px]"
                    >
                      <span className="font-semibold">{s.name}</span>{" "}
                      <span className="tabular text-muted-foreground">{s.patients}</span>
                    </span>
                  ))}
                </div>
              </div>
            </Panel>

            {/* 3. payer distribution */}
            <Panel
              title="Payer distribution"
              subtitle={`${slice.payers.length} plans hold these ${slice.patients} patients`}
              section="payer"
              onDeepDive={deepDive}
            >
              <div className="p-4">
                <BarList
                  title="Patients by payer"
                  tone="risk"
                  slices={slice.payers.slice(0, 8).map((p) => ({
                    label: p.name,
                    value: p.patients,
                    sub: `${p.scope} · ${p.channel}${
                      p.requiresStepTherapy ? " · step therapy" : ""
                    }${p.requiresLmn ? " · LMN" : ""}`,
                  }))}
                />
              </div>
            </Panel>

            {/* 4. specialty pharmacy distribution */}
            <Panel
              title="Specialty pharmacy distribution"
              subtitle={`${slice.sps.length} pharmacies dispense for these ${slice.patients} patients`}
              section="sp"
              onDeepDive={deepDive}
            >
              <div className="p-4">
                <BarList
                  title="Patients by specialty pharmacy"
                  tone="signal"
                  slices={slice.sps.map((s) => ({
                    label: s.name,
                    value: s.patients,
                    sub: `${s.avgDaysToShip.toFixed(1)}d avg. to ship · ${Math.round(
                      s.pastFillRate * 100,
                    )}% fill rate`,
                  }))}
                />
              </div>
            </Panel>


            {/* 5. PSP coverage */}
            <Panel
              title="PSP roles serving these patients"
              subtitle="Field, hub and intake coverage for this blocker"
              section="roles"
              onDeepDive={deepDive}
            >
              <div className="grid gap-4 p-4 md:grid-cols-3">
                <RoleBarList
                  heading="Field reimbursement"
                  rows={slice.frms.slice(0, 5).map((f) => ({
                    name: f.name,
                    patients: f.patients,
                    detail: `${f.territory} · ${Math.round(f.paFocusedCallShare * 100)}% blocker-focused calls`,
                  }))}
                />
                <RoleBarList
                  heading="Case managers"
                  rows={slice.caseManagers.slice(0, 5).map((c) => ({
                    name: c.name,
                    patients: c.patients,
                    detail: `${c.pod} · ${c.avgProcessingDays}d avg per case`,
                  }))}
                />
                <RoleBarList
                  heading="Intake specialists"
                  rows={slice.intakeSpecialists.slice(0, 5).map((s) => ({
                    name: s.name,
                    patients: s.patients,
                    detail: `${s.pod} · ${s.avgTat}d TAT · ${Math.round(s.cleanSubmissionRate * 100)}% clean`,
                  }))}
                />
                {slice.showNurseNavigators && (
                  <div className="md:col-span-3">
                    <RoleBarList
                      heading="Nurse navigators"
                      rows={slice.nurseNavigators
                        .filter((n) => n.patients > 0)
                        .slice(0, 6)
                        .map((n) => ({ name: n.name, patients: n.patients, detail: "" }))}
                    />
                  </div>
                )}
              </div>

            </Panel>
            {/* 6. patients */}
            <Panel
              title="Patients behind this barrier"
              subtitle={`Highest predicted never-start risk first · ${patientRows.length} sampled of ${slice.patients}`}
              section="patients"
              onDeepDive={deepDive}
            >
              <PatientsTable patients={patientRows.slice(0, 15)} compact />
            </Panel>
          </div>
        </SheetContent>
      </Sheet>

      <DraftEmailDialog
        open={Boolean(prefill)}
        onOpenChange={(v) => !v && setPrefill(null)}
        selectedAccounts={[]}
        selectedState={null}
        prefill={prefill}
        ledgerMeta={{
          stageId: view.stageId ?? null,
          stageLabel: view.label,
          reasonId,
          issue: reason?.label ?? slice.reasonLabel ?? "Blocker",
          patients: slice.patients,
          description: prefill?.subject ?? "Drill-down action",
        }}
      />

    </>
  );
}
