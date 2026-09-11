import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BarList, StatTile } from "@/components/psp/drill-bits";
import { accountsForFrm, accountsForHubPerson, personTrend } from "@/lib/psp-drill-data";
import type { StageView } from "@/lib/psp-stage-view";

export type PersonKind = "frm" | "case" | "intake" | "nurse";

export type PersonRef = {
  kind: PersonKind;
  name: string;
  where: string;
  patients: number;
  stats: { label: string; value: string; caption?: string; alert?: boolean }[];
  /** Trend metric shown against the team average. */
  metric: { label: string; current: number; teamAvg: number; unit: string };
};

const roleLabel: Record<PersonKind, string> = {
  frm: "Field Reimbursement Manager",
  case: "Case Manager",
  intake: "Intake Specialist",
  nurse: "Nurse Navigator",
};

export function PersonDrawer({
  person,
  view,
  onOpenChange,
}: {
  person: PersonRef | null;
  view: StageView;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Sheet open={!!person} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {person && <PersonProfile person={person} view={view} />}
      </SheetContent>
    </Sheet>
  );
}

function PersonProfile({ person, view }: { person: PersonRef; view: StageView }) {
  const accounts =
    person.kind === "frm"
      ? accountsForFrm(view, person.name)
      : accountsForHubPerson(view, person.name, person.patients);

  const trend = personTrend(person.name, person.metric.current, person.metric.teamAvg);
  const states = Array.from(new Set(accounts.map((a) => a.stateName)));

  return (
    <>
      <SheetHeader>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {roleLabel[person.kind]}
        </p>
        <SheetTitle className="text-base">{person.name}</SheetTitle>
        <SheetDescription>
          {person.where} · {person.patients} patients in{" "}
          {view.isAll ? "the journey" : view.label.toLowerCase()}
          {states.length > 0 && ` · ${states.slice(0, 4).join(", ")}`}
        </SheetDescription>
      </SheetHeader>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {person.stats.map((s) => (
          <StatTile key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-4 rounded-md border border-border">
        <div className="border-b border-border bg-surface-muted px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide">
            {person.metric.label} — last 8 weeks vs. team average
          </p>
        </div>
        <div className="h-48 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(v: number, n) => [`${v}${person.metric.unit}`, n === "value" ? person.name : "Team avg"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="team"
                stroke="var(--muted-foreground)"
                strokeDasharray="4 3"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4">
        <BarList
          title={person.kind === "frm" ? "Accounts covered" : "Accounts touched"}
          slices={accounts.slice(0, 8).map((a) => ({
            label: a.name,
            value: a.patients,
            sub: `${a.stateName} · ${a.setting}, ${a.size}${a.centerOfExcellence ? " · CoE" : ""}`,
          }))}
          emptyLabel="No accounts attributed in this stage filter"
        />
      </div>
    </>
  );
}
