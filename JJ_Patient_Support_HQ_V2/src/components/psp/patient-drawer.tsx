import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatTile } from "@/components/psp/drill-bits";
import type { PatientRow } from "@/lib/psp-patients";
import { cn } from "@/lib/utils";

export function RiskTag({ label, score }: { label: PatientRow["riskLabel"]; score?: number }) {
  return (
    <span
      className={cn(
        "tabular inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold",
        label === "High"
          ? "bg-risk-5/20 text-risk-5"
          : label === "Medium"
            ? "bg-risk-3/25 text-foreground/80"
            : "bg-risk-1/25 text-foreground/80",
      )}
    >
      {label}
      {score !== undefined && <span className="font-normal">· {score}</span>}
    </span>
  );
}

export function PatientDrawer({
  patient,
  onOpenChange,
}: {
  patient: PatientRow | null;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Sheet open={!!patient} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {patient && <Profile p={patient} />}
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-1.5 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-right text-xs font-medium", alert && "text-risk-5")}>{value}</span>
    </div>
  );
}

function Profile({ p }: { p: PatientRow }) {
  return (
    <>
      <SheetHeader>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Patient profile · masked ID
        </p>
        <SheetTitle className="text-base tabular">{p.id}</SheetTitle>
        <SheetDescription className="flex flex-wrap items-center gap-2 text-xs">
          <RiskTag label={p.riskLabel} score={p.riskScore} />
          <span>
            {p.ageBucket} · {p.sex === "F" ? "Female" : "Male"} · {p.setting} · {p.stateName}
          </span>
        </SheetDescription>
      </SheetHeader>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <StatTile label="Predicted risk score" value={String(p.riskScore)} caption="never-start model" alert={p.riskLabel === "High"} />
        <StatTile label="Days in stage" value={`${p.daysInStage}`} caption="since case created" />
        <StatTile label="Top barrier" value={p.barrierLabel} caption="primary blocker today" />
        <StatTile label="Clinical" value={p.whoClass} caption="functional class at referral" />
      </div>

      <div className="mt-4 rounded-md border border-border">
        <div className="border-b border-border bg-surface-muted px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide">Top risk drivers</p>
        </div>
        <ul className="space-y-1 p-3">
          {p.drivers.map((d) => (
            <li key={d} className="flex gap-2 text-xs text-foreground/85">
              <span className="text-signal">→</span>
              {d}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-md border border-border p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide">Support touchpoints</p>
        <div className="mt-1">
          <Row
            label="Welcome call"
            value={p.welcomeCall ? `Completed ${p.welcomeCallDaysAgo}d ago` : "Not completed"}
            alert={!p.welcomeCall}
          />
          <Row label="Case manager" value={p.caseManager} />
          <Row
            label="Last FRM touch at the office"
            value={`${p.frm} · ${p.lastFrmTouchDaysAgo}d ago — ${p.lastFrmTopic}`}
            alert={p.lastFrmTouchDaysAgo >= 21}
          />
          <Row
            label="Nurse navigator touchpoint"
            value={p.nurseTouchDaysAgo ? `${p.nurseTouchDaysAgo}d ago` : "None yet"}
            alert={!p.nurseTouchDaysAgo}
          />
          <Row label="Specialty pharmacy" value={p.sp} />
        </div>
      </div>

      <div className="mt-4 rounded-md border border-border p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide">Coverage</p>
        <div className="mt-1">
          <Row label="Payer" value={p.payer} />
          <Row label="Plan ID" value={p.planId} />
          <Row
            label="Prescribing account"
            value={`${p.accountName}${p.newToBrandOffice ? " · new to brand" : ""}`}
          />
        </div>
      </div>

      <div className="mt-4 rounded-md border border-border p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide">Clinical picture</p>
        <div className="mt-1">
          <Row label="Symptoms" value={p.symptoms.join(", ")} />
          <Row label="Comorbidities" value={p.comorbidities.join(", ")} />
        </div>
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        Illustrative, de-identified patient record. IDs are masked.
      </p>
    </>
  );
}
