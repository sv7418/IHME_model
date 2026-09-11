import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pct, riskBand, riskBandClass, type StateRisk } from "@/lib/psp-data";
import { getStateDetail } from "@/lib/psp-detail-data";
import { usePeriod } from "@/lib/psp-period";
import { cn } from "@/lib/utils";
import { ChannelMixBar, Panel, PayerTable, PharmacyTable, StatTile } from "./detail-bits";

const nOptions = [5, 10];

export function StateDetail({
  state,
  onBack,
}: {
  state: StateRisk;
  onBack: () => void;
}) {
  const [topN, setTopN] = useState(5);
  const { seed, label: periodText } = usePeriod();
  const detail = useMemo(() => getStateDetail(state.code, seed), [state.code, seed]);

  const bottomAccounts = detail.accountsInState.slice(0, topN);
  const half = Math.min(topN, Math.floor(detail.pharmacies.length / 2));
  const topPharmacies = detail.pharmacies.slice(0, half);
  const bottomPharmacies = detail.pharmacies.slice(-half).reverse();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-panel">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onBack}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back to map
          </Button>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              {state.name} <span className="text-muted-foreground">({state.code})</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              State drill-down · {periodText} · top barrier: {state.topBarrier}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Show</span>
          <Select value={String(topN)} onValueChange={(v) => setTopN(Number(v))}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {nOptions.map((n) => (
                <SelectItem key={n} value={String(n)} className="text-xs">
                  Top / bottom {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Never-start risk" value={pct(state.neverStartRisk)} caption="of patients" tone="alert" />
        <StatTile label="Discontinuation risk" value={pct(state.discontinuationRisk)} caption="of patients on therapy" />
        <StatTile label="Patients on therapy" value={state.patients.toLocaleString()} caption="active in state" />
        <StatTile label="FRM coverage" value={pct(state.frmCoverage)} caption="weighted by patient volume" />
      </div>

      <Panel
        title={`Bottom ${topN} accounts by fulfillment`}
        subtitle={`Lowest-performing accounts in ${state.name}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2 font-medium">Account</th>
                <th className="px-3 py-2 text-right font-medium">Patients</th>
                <th className="px-3 py-2 font-medium">Never-start risk</th>
                <th className="px-3 py-2 text-right font-medium">Persistency</th>
                <th className="px-4 py-2 text-right font-medium">Fulfillment</th>
              </tr>
            </thead>
            <tbody>
              {bottomAccounts.map((a) => (
                <tr key={a.name} className="border-b border-border/70 last:border-0">
                  <td className="px-4 py-2 font-medium">{a.name}</td>
                  <td className="px-3 py-2 text-right tabular">{a.patients.toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "inline-flex min-w-12 justify-center rounded px-2 py-0.5 text-xs font-semibold tabular text-foreground/85",
                        riskBandClass[riskBand(a.neverStartRisk)],
                      )}
                    >
                      {pct(a.neverStartRisk)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right tabular">{pct(a.persistencyRate)}</td>
                  <td className="px-4 py-2 text-right tabular">{pct(a.fulfillmentRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Payer mix" subtitle="Channel split and top payers in state">
          <ChannelMixBar mix={detail.channelMix} />
          <PayerTable payers={detail.payers} />
        </Panel>

        <div className="space-y-4">
          <Panel title={`Top ${half} specialty pharmacies`} subtitle="Best fulfillment and persistency">
            <PharmacyTable rows={topPharmacies} />
          </Panel>
          <Panel title={`Bottom ${half} specialty pharmacies`} subtitle="Priority for SP performance review">
            <PharmacyTable rows={bottomPharmacies} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
