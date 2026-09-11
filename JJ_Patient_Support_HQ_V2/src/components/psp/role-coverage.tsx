import { useMemo, useState } from "react";
import { SectionCard } from "@/components/psp/stage-bits";
import { PersonDrawer, type PersonKind, type PersonRef } from "@/components/psp/person-drawer";
import { useStageView } from "@/lib/psp-stage-view";
import { cn } from "@/lib/utils";

const roleTabs: { id: PersonKind; label: string }[] = [
  { id: "frm", label: "FRM" },
  { id: "nurse", label: "Nurse Navigator" },
  { id: "case", label: "Case Manager" },
  { id: "intake", label: "Intake Specialist" },
];

/** Deterministic 0..1 hash so tenure is stable across renders and SSR. */
function hash01(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

function tenureFor(name: string, role: PersonKind) {
  const r = hash01(`${role}|${name}`);
  const isNew = r < 0.28;
  const months = isNew ? 3 + Math.round(r * 30) : 14 + Math.round(r * 70);
  return { isNew, months };
}

type Row = {
  name: string;
  where: string;
  patients: number;
  coverage: string;
  metric: string;
  metricSub: string;
  person: PersonRef;
};

export function RoleCoverage() {
  const view = useStageView();
  const [role, setRole] = useState<PersonKind>("frm");
  const [person, setPerson] = useState<PersonRef | null>(null);

  const rows = useMemo<Row[]>(() => {
    const mk = (
      kind: PersonKind,
      name: string,
      where: string,
      patients: number,
      coverage: string,
      metric: string,
      metricSub: string,
      stats: PersonRef["stats"],
      m: PersonRef["metric"],
    ): Row => {
      const t = tenureFor(name, kind);
      return {
        name,
        where,
        patients,
        coverage,
        metric,
        metricSub,
        person: {
          kind,
          name,
          where,
          patients,
          stats: [
            ...stats,
            {
              label: "Tenure on brand",
              value: t.isNew ? "New" : "Experienced",
              caption: `${t.months} months`,
              alert: t.isNew,
            },
          ],
          metric: m,
        },
      };
    };

    if (role === "frm") {
      return view.frms.map((f) =>
        mk(
          "frm",
          f.name,
          f.territory,
          f.patients,
          `${f.accounts} accounts`,
          `${f.callsLast30} calls`,
          "last 30 days",
          [
            { label: "Patients covered", value: f.patients.toLocaleString() },
            { label: "Accounts", value: String(f.accounts) },
            { label: "Calls last 30 days", value: String(f.callsLast30) },
            { label: "Region", value: f.region },
          ],
          { label: "Calls per week", current: f.callsLast30, teamAvg: 3, unit: "" },
        ),
      );
    }
    if (role === "nurse") {
      return view.nurseNavigators.map((n) =>
        mk(
          "nurse",
          n.name,
          n.pod,
          n.patients,
          `${n.avgDaysToTrain.toFixed(1)} days to train`,
          `${Math.round(n.completionRate * 100)}%`,
          "training completion",
          [
            { label: "Patients covered", value: n.patients.toLocaleString() },
            { label: "Avg days to train", value: n.avgDaysToTrain.toFixed(1) },
            {
              label: "Completion rate",
              value: `${Math.round(n.completionRate * 100)}%`,
              alert: n.completionRate < 0.7,
            },
            { label: "Pod", value: n.pod },
          ],
          {
            label: "Training completion",
            current: Math.round(n.completionRate * 100),
            teamAvg: 74,
            unit: "%",
          },
        ),
      );
    }
    if (role === "case") {
      return view.caseManagers.map((c) =>
        mk(
          "case",
          c.name,
          c.pod,
          c.patients,
          `${c.openCases} open cases`,
          `${c.avgProcessingDays.toFixed(1)} days`,
          `${c.touchesPerCase.toFixed(1)} touches / case`,
          [
            { label: "Patients covered", value: c.patients.toLocaleString() },
            { label: "Open cases", value: String(c.openCases) },
            {
              label: "Avg processing days",
              value: c.avgProcessingDays.toFixed(1),
              alert: c.avgProcessingDays > 5.5,
            },
            { label: "Touches per case", value: c.touchesPerCase.toFixed(1) },
          ],
          {
            label: "Days to process a case",
            current: c.avgProcessingDays,
            teamAvg: 5,
            unit: "d",
          },
        ),
      );
    }
    return view.intakeSpecialists.map((s) =>
      mk(
        "intake",
        s.name,
        s.pod,
        s.patients,
        `${Math.round(s.cleanSubmissionRate * 100)}% clean submissions`,
        `${s.avgTat.toFixed(1)} days`,
        "intake turnaround",
        [
          { label: "Patients covered", value: s.patients.toLocaleString() },
          { label: "Avg intake TAT", value: `${s.avgTat.toFixed(1)} d`, alert: s.avgTat > 2.5 },
          {
            label: "Clean submissions",
            value: `${Math.round(s.cleanSubmissionRate * 100)}%`,
            alert: s.cleanSubmissionRate < 0.75,
          },
          { label: "Pod", value: s.pod },
        ],
        { label: "Intake turnaround", current: s.avgTat, teamAvg: 2.2, unit: "d" },
      ),
    );
  }, [role, view]);

  const sorted = useMemo(() => [...rows].sort((a, b) => b.patients - a.patients), [rows]);
  const max = Math.max(...sorted.map((r) => r.patients), 1);
  const covered = sorted.reduce((s, r) => s + r.patients, 0);
  const roleLabel = roleTabs.find((r) => r.id === role)!.label;

  return (
    <>
      <SectionCard
        title="Who is covering these patients"
        subtitle="Field and hub staff supporting this cohort. Click a person for their performance profile."
        right={
          <div className="flex flex-wrap items-center gap-1 rounded-md bg-secondary p-1">
            {roleTabs.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={cn(
                  "rounded px-2.5 py-1 text-xs transition-colors",
                  role === r.id
                    ? "bg-card font-medium text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/60 text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2 text-left font-medium">{roleLabel}</th>
                <th className="px-3 py-2 text-left font-medium">Tenure</th>
                <th className="px-3 py-2 text-left font-medium">Patients in cohort</th>
                <th className="px-3 py-2 text-left font-medium">Coverage</th>
                <th className="px-4 py-2 text-right font-medium">Performance</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => {
                const t = tenureFor(r.name, role);
                return (
                  <tr
                    key={r.name}
                    onClick={() => setPerson(r.person)}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-muted/50"
                  >
                    <td className="px-4 py-2.5">
                      <p className="font-medium">{r.name}</p>
                      <p className="text-[11px] text-muted-foreground">{r.where}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          t.isNew
                            ? "bg-risk-3/15 text-risk-3"
                            : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {t.isNew ? "New" : "Experienced"}
                      </span>
                      <span className="ml-1.5 text-[11px] text-muted-foreground">
                        {t.months} mo
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="tabular w-10 text-sm font-semibold">{r.patients}</span>
                        <span className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                          <span
                            className="block h-full rounded-full bg-primary"
                            style={{ width: `${(r.patients / max) * 100}%` }}
                          />
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.coverage}</td>
                    <td className="px-4 py-2.5 text-right">
                      <p className="tabular text-sm font-semibold">{r.metric}</p>
                      <p className="text-[11px] text-muted-foreground">{r.metricSub}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
          {sorted.length} {roleLabel}s covering {covered.toLocaleString()} of{" "}
          {view.patients.toLocaleString()} patients in this cohort
          {covered < view.patients &&
            ` — ${(view.patients - covered).toLocaleString()} without ${roleLabel} coverage`}
          .
        </div>
      </SectionCard>

      <PersonDrawer person={person} view={view} onOpenChange={(o) => !o && setPerson(null)} />
    </>
  );
}
