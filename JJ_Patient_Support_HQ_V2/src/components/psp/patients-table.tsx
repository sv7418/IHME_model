import { useMemo, useState } from "react";
import { SectionCard } from "@/components/psp/stage-bits";
import { PatientDrawer, RiskTag } from "@/components/psp/patient-drawer";
import { buildPatients, type PatientRow } from "@/lib/psp-patients";
import { useStageView, type StageView } from "@/lib/psp-stage-view";
import { cn } from "@/lib/utils";

export function PatientsTable({
  patients,
  compact = false,
}: {
  patients: PatientRow[];
  compact?: boolean;
}) {
  const [selected, setSelected] = useState<PatientRow | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-xs">
          <thead className="bg-surface-muted text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Patient</th>
              <th className="px-3 py-2 font-medium">Risk label</th>
              <th className="px-3 py-2 font-medium">Risk score</th>
              <th className="px-3 py-2 font-medium">Top barrier</th>
              {!compact && <th className="px-3 py-2 font-medium">Profile</th>}
              <th className="px-3 py-2 font-medium">Payer / plan</th>
              <th className="px-3 py-2 font-medium">Top 3 risk drivers</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id + p.accountName}
                className="cursor-pointer border-t border-border hover:bg-surface-muted/60"
                onClick={() => setSelected(p)}
              >
                <td className="px-3 py-2">
                  <p className="tabular font-medium">{p.id}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.accountName}
                    {p.newToBrandOffice && " · new office"}
                  </p>
                </td>
                <td className="px-3 py-2">
                  <RiskTag label={p.riskLabel} />
                </td>
                <td className="tabular px-3 py-2 font-medium">{p.riskScore}</td>
                <td className="px-3 py-2">{p.barrierLabel}</td>
                {!compact && (
                  <td className="px-3 py-2 text-muted-foreground">
                    {p.ageBucket} · {p.setting} · {p.stateName}
                  </td>
                )}
                <td className="px-3 py-2">
                  <p>{p.payer}</p>
                  <p className="tabular text-[11px] text-muted-foreground">{p.planId}</p>
                </td>
                <td className="px-3 py-2 text-muted-foreground">{p.drivers.join(" · ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PatientDrawer patient={selected} onOpenChange={(v) => !v && setSelected(null)} />
    </>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs transition-colors",
        on
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:bg-surface-muted",
      )}
    >
      {children}
    </button>
  );
}

/** Full patient list section with barrier and risk filters. */
export function PaPatients({ view: passed }: { view?: StageView } = {}) {
  const ctx = useStageView();
  const view = passed ?? ctx;
  const [barrier, setBarrier] = useState<string | null>(null);
  const [risk, setRisk] = useState<PatientRow["riskLabel"] | null>(null);

  const all = useMemo(() => buildPatients(view, 80), [view]);
  const rows = all.filter(
    (p) => (!barrier || p.barrierId === barrier) && (!risk || p.riskLabel === risk),
  );

  return (
    <SectionCard
      title="Patients"
      subtitle={`${rows.length} of ${all.length} sampled patients in ${
        view.isAll ? "the journey" : view.label.toLowerCase()
      } · click any row for the full profile`}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
        <span className="text-xs font-medium text-muted-foreground">Top barrier:</span>
        <Chip on={!barrier} onClick={() => setBarrier(null)}>
          All
        </Chip>
        {view.reasons.map((r) => (
          <Chip key={r.id} on={barrier === r.id} onClick={() => setBarrier(r.id)}>
            {r.short}
          </Chip>
        ))}
        <span className="ml-2 text-xs font-medium text-muted-foreground">Risk:</span>
        {(["High", "Medium", "Low"] as const).map((r) => (
          <Chip key={r} on={risk === r} onClick={() => setRisk(risk === r ? null : r)}>
            {r}
          </Chip>
        ))}
      </div>
      <PatientsTable patients={rows} />
    </SectionCard>
  );
}
