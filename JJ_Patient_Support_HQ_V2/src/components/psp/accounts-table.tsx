import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { accounts, pct, riskBand, riskBandClass, type Account } from "@/lib/psp-data";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Download, Search } from "lucide-react";

export function AccountsTable({
  selected,
  onToggle,
  onToggleAll,
  onDraftEmail,
  filterState,
  onOpenAccount,
}: {
  selected: string[];
  onToggle: (name: string) => void;
  onToggleAll: (names: string[], checked: boolean) => void;
  onDraftEmail: () => void;
  filterState?: string | null;
  onOpenAccount?: (account: Account) => void;
}) {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    return accounts.filter((a) => {
      const matchesQuery =
        !query ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.challenges.toLowerCase().includes(query.toLowerCase());
      const matchesState = !filterState || a.state === filterState;
      return matchesQuery && matchesState;
    });
  }, [query, filterState]);

  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.name));

  return (
    <div className="rounded-lg border border-border bg-card shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">
            Accounts{" "}
            <span className="font-normal text-muted-foreground">
              (Top 20 by never-start risk patients{filterState ? ` · ${filterState}` : ""})
            </span>
          </h3>
          <p className="text-xs text-muted-foreground">
            {selected.length} selected for outreach · {rows.length} shown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accounts or barriers"
              className="h-8 w-56 pl-8 text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
          <Button
            size="sm"
            variant="signal"
            className="h-8 text-xs"
            onClick={onDraftEmail}
            disabled={selected.length === 0}
          >
            <Mail className="h-3.5 w-3.5" /> Draft Email
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-muted text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="w-10 px-3 py-2">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={(v) => onToggleAll(rows.map((r) => r.name), Boolean(v))}
                  aria-label="Select all accounts"
                />
              </th>
              <th className="px-3 py-2 font-medium">Rank</th>
              <th className="px-3 py-2 font-medium">Account</th>
              <th className="px-3 py-2 font-medium">State</th>
              <th className="px-3 py-2 text-right font-medium">Never-start patients</th>
              <th className="px-3 py-2 font-medium">Never-start risk</th>
              <th className="px-3 py-2 text-right font-medium">Fulfillment</th>
              <th className="px-3 py-2 font-medium">Major payer / SP challenges</th>
              <th className="px-3 py-2 font-medium">Last activity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <AccountRow
                key={a.name}
                account={a}
                checked={selected.includes(a.name)}
                onToggle={() => onToggle(a.name)}
                onOpen={onOpenAccount ? () => onOpenAccount(a) : undefined}
              />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No accounts match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
        <span>Showing {rows.length} of 156 accounts</span>
        <span>Data as of Oct 18, 2024 5:00 PM ET</span>
      </div>
    </div>
  );
}

function AccountRow({
  account,
  checked,
  onToggle,
  onOpen,
}: {
  account: Account;
  checked: boolean;
  onToggle: () => void;
  onOpen?: () => void;
}) {
  const band = riskBand(account.neverStartRisk);
  return (
    <tr className={cn("border-b border-border/70 last:border-0 hover:bg-secondary/60", checked && "bg-accent/40")}>
      <td className="px-3 py-2">
        <Checkbox checked={checked} onCheckedChange={onToggle} aria-label={`Select ${account.name}`} />
      </td>
      <td className="px-3 py-2 tabular text-muted-foreground">{account.rank}</td>
      <td className="px-3 py-2 font-medium">
        {onOpen ? (
          <button
            onClick={onOpen}
            className="text-left font-medium underline-offset-2 hover:text-signal hover:underline"
          >
            {account.name}
          </button>
        ) : (
          account.name
        )}
      </td>
      <td className="px-3 py-2 text-muted-foreground">{account.state}</td>
      <td className="px-3 py-2 text-right tabular">{account.neverStartPatients.toLocaleString()}</td>
      <td className="px-3 py-2">
        <span
          className={cn(
            "inline-flex min-w-12 justify-center rounded px-2 py-0.5 text-xs font-semibold tabular text-foreground/85",
            riskBandClass[band],
          )}
        >
          {pct(account.neverStartRisk)}
        </span>
      </td>
      <td className="px-3 py-2 text-right tabular">{pct(account.fulfillmentRate)}</td>
      <td className="max-w-72 px-3 py-2 text-xs text-muted-foreground">{account.challenges}</td>
      <td className="px-3 py-2 text-xs text-muted-foreground">{account.lastActivity}</td>
    </tr>
  );
}
