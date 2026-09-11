import { useMemo } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pct, type Account } from "@/lib/psp-data";
import { getAccountDetail } from "@/lib/psp-detail-data";
import { usePeriod } from "@/lib/psp-period";
import {
  ChannelMixBar,
  DriverList,
  Panel,
  PayerTable,
  PharmacyTable,
  StatTile,
} from "./detail-bits";

export function AccountDetail({
  account,
  onBack,
  onDraftEmail,
}: {
  account: Account;
  onBack: () => void;
  onDraftEmail: () => void;
}) {
  const { seed, label: periodText } = usePeriod();
  const detail = useMemo(() => getAccountDetail(account, seed), [account, seed]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-panel">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onBack}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back to accounts
          </Button>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">{account.name}</h3>
            <p className="text-xs text-muted-foreground">
              {account.state} · rank #{account.rank} · {periodText}
            </p>
          </div>
        </div>
        <Button size="sm" variant="signal" className="h-8 text-xs" onClick={onDraftEmail}>
          <Mail className="h-3.5 w-3.5" /> Draft Email
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatTile label="Patients" value={detail.patients.toLocaleString()} caption="attributed to account" />
        <StatTile
          label="Never-start risk"
          value={pct(account.neverStartRisk)}
          caption={`${account.neverStartPatients.toLocaleString()} patients`}
          tone="alert"
        />
        <StatTile
          label="Discontinuation risk"
          value={pct(account.discontinuationRisk)}
          caption="of patients on therapy"
          tone="alert"
        />
        <StatTile label="Fulfillment rate" value={pct(account.fulfillmentRate)} caption="filled / approved" />
        <StatTile label="Persistency" value={pct(detail.persistencyRate)} caption="90-day on therapy" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Top drivers of never-start risk" subtitle="Contribution to modeled risk">
          <DriverList drivers={detail.neverStartDrivers} />
        </Panel>
        <Panel title="Top drivers of discontinuation risk" subtitle="Contribution to modeled risk">
          <DriverList drivers={detail.discontinuationDrivers} />
        </Panel>
      </div>

      <Panel title="Payer mix" subtitle="Commercial / Medicare / Medicaid split and named payers">
        <ChannelMixBar mix={detail.channelMix} />
        <PayerTable payers={detail.payers} />
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Specialty pharmacy mix" subtitle="Dispensing partners serving this account">
          <PharmacyTable rows={detail.pharmacies} />
        </Panel>
        <Panel title="Assigned field coverage" subtitle="Patient support roles supporting this account">
          <ul className="divide-y divide-border">
            {detail.coverage.map((c) => (
              <li key={c.role} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.role} · {c.territory}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Action rate
                  </p>
                  <p className="tabular text-sm font-semibold">{pct(c.actionRate)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
