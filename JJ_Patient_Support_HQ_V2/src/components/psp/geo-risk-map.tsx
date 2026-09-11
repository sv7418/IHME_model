import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  riskBand,
  riskBandClass,
  riskBandLabel,
  stateRisks,
  pct,
  type StateRisk,
} from "@/lib/psp-data";
import { Button } from "@/components/ui/button";

type Metric = "neverStartRisk" | "discontinuationRisk";

const rows = Array.from({ length: 7 }, (_, r) => r);
const cols = Array.from({ length: 12 }, (_, c) => c + 1);

export function GeoRiskMap({
  selectedState,
  onSelectState,
}: {
  selectedState: StateRisk | null;
  onSelectState: (s: StateRisk | null) => void;
}) {
  const [metric, setMetric] = useState<Metric>("neverStartRisk");

  return (
    <div className="rounded-lg border border-border bg-card shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Geographic Risk Map</h3>
          <p className="text-xs text-muted-foreground">
            Select a state to drill into barriers, coverage and interventions.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-secondary p-1">
          {(
            [
              ["neverStartRisk", "Never-start risk"],
              ["discontinuationRisk", "Discontinuation risk"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMetric(key)}
              className={cn(
                "rounded px-2.5 py-1 text-xs transition-colors",
                metric === key
                  ? "bg-card font-medium text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-[1fr_240px]">
        <div className="space-y-3">
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(12, minmax(0,1fr))" }}>
            {rows.flatMap((r) =>
              cols.map((c) => {
                const s = stateRisks.find((x) => x.row === r && x.col === c);
                if (!s) return <div key={`${r}-${c}`} className="aspect-square" />;
                const band = riskBand(s[metric]);
                const isSel = selectedState?.code === s.code;
                return (
                  <button
                    key={s.code}
                    onClick={() => onSelectState(isSel ? null : s)}
                    title={`${s.name} — ${pct(s[metric])}`}
                    className={cn(
                      "aspect-square rounded-[3px] text-[10px] font-semibold text-foreground/80 transition-transform hover:scale-110",
                      riskBandClass[band],
                      isSel && "ring-2 ring-signal ring-offset-1 ring-offset-card",
                    )}
                  >
                    {s.code}
                  </button>
                );
              }),
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-[11px] font-medium text-muted-foreground">% of patients at risk</span>
            {([1, 2, 3, 4, 5] as const).map((b) => (
              <span key={b} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className={cn("h-3 w-3 rounded-[3px]", riskBandClass[b])} />
                {riskBandLabel[b]}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-border bg-surface-muted p-3">
          {selectedState ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold">{selectedState.name}</p>
                <p className="text-xs text-muted-foreground">{selectedState.code} · State drill-down</p>
              </div>
              <dl className="space-y-2 text-xs">
                <Row label="Never-start risk" value={pct(selectedState.neverStartRisk)} />
                <Row label="Discontinuation risk" value={pct(selectedState.discontinuationRisk)} />
                <Row label="Patients on therapy" value={selectedState.patients.toLocaleString()} />
                <Row label="FRM coverage" value={pct(selectedState.frmCoverage)} />
              </dl>
              <div className="rounded border border-border bg-card p-2 text-xs">
                <p className="font-medium text-foreground">Top barrier</p>
                <p className="mt-0.5 text-muted-foreground">{selectedState.topBarrier}</p>
              </div>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => onSelectState(null)}>
                Clear selection
              </Button>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Select a state to preview.</p>
              <p className="mt-2">
                Drill-down shows payer friction, SP performance, FRM coverage and executed
                interventions. Selected geographies can be attached to an email.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tabular font-medium">{value}</dd>
    </div>
  );
}
