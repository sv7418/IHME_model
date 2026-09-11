import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { UsChoropleth, redHeatBands } from "@/components/psp/us-choropleth";
import type { Brand, JourneyStageId } from "@/lib/psp-brand";
import {
  buildStatePatients,
  buildStageStateRiskPatients,
  riskBucketLabel,
  stageLabel,
  stateName,
  type RiskBucket,
} from "@/lib/psp-journey-home";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PatientLocationMap({
  brand,
  stageId,
  onClearStage,
  onDeepDive,
}: {
  brand: Brand;
  stageId?: JourneyStageId | null;
  onClearStage?: () => void;
  onDeepDive?: (stateCode: string, risk: RiskBucket) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [bucket, setBucket] = useState<RiskBucket>("all");

  useEffect(() => {
    if (!stageId) setBucket("all");
  }, [stageId]);

  const values = useMemo(
    () =>
      stageId
        ? buildStageStateRiskPatients(brand, stageId, bucket)
        : buildStatePatients(brand),
    [brand, stageId, bucket],
  );
  const bands = useMemo(() => redHeatBands(values), [values]);
  const count = selected ? (values[selected] ?? 0) : 0;
  const label = stageId ? stageLabel(brand, stageId) : null;
  const riskWord = bucket === "all" ? "" : `${bucket}-risk `;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {label
              ? `Where ${riskWord}patients are stuck in ${label.toLowerCase()}`
              : "Where our patients are"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {label
              ? `${bucket === "all" ? "All" : riskBucketLabel[bucket]} · patients currently waiting at the ${label.toLowerCase()} step, by state.`
              : `Active ${brand.name} patients by state. Select a state for its count.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {label && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                PE.AI Fulfillment Risk
              </span>
              <Select value={bucket} onValueChange={(v) => setBucket(v as RiskBucket)}>
                <SelectTrigger className="h-8 w-[150px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["all", "high", "medium", "low"] as const).map((b) => (
                    <SelectItem key={b} value={b} className="text-xs">
                      {riskBucketLabel[b]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selected && (
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{stateName(selected)}</span> ·{" "}
              <span className="font-semibold text-foreground tabular">
                {count.toLocaleString()}
              </span>{" "}
              {riskWord}patients
            </p>
          )}
          {selected && onDeepDive && (
            <button
              type="button"
              onClick={() => onDeepDive(selected, bucket)}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Deep dive into key barriers
            </button>
          )}

          {label && onClearStage && (
            <button
              type="button"
              onClick={onClearStage}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/15"
            >
              Stuck in {label}
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-3">
        <UsChoropleth
          values={values}
          selected={selected}
          onSelect={setSelected}
          bands={bands}
          metricLabel={
            label
              ? `${riskWord}patients stuck in ${label.toLowerCase()}`
              : "active patients by state"
          }
        />
      </div>
    </div>
  );
}
