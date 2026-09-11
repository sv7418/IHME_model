import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { accounts, pct, stateRisks, type StateRisk } from "@/lib/psp-data";
import { allRecipients } from "@/lib/psp-workflows";
import { useLedger } from "@/lib/psp-ledger";
import { toast } from "sonner";
import { ClipboardList, Paperclip, Send } from "lucide-react";


export type EmailPrefill = {
  subject?: string;
  body?: string;
  recipientId?: string;
  customTo?: string;
  /** Extra evidence rows rendered as an inline table instead of the account list. */
  evidenceTitle?: string;
  evidence?: { label: string; detail: string; metric: string }[];
};

export type LedgerMeta = {
  stageId: string | null;
  stageLabel: string;
  reasonId: string | null;
  issue: string;
  patients: number;
  description: string;
};

export function DraftEmailDialog({
  open,
  onOpenChange,
  selectedAccounts,
  selectedState,
  prefill,
  ledgerMeta,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedAccounts: string[];
  selectedState: StateRisk | null;
  prefill?: EmailPrefill | null;
  ledgerMeta?: LedgerMeta | null;
}) {

  const [recipientId, setRecipientId] = useState(allRecipients[0].id);
  const [customTo, setCustomTo] = useState("");
  const [subject, setSubject] = useState(
    "Top accounts with major payer / SP challenges – action requested",
  );
  const [includeAccounts, setIncludeAccounts] = useState(true);
  const [includeGeo, setIncludeGeo] = useState(true);
  const [body, setBody] = useState("");

  const rows = useMemo(
    () => accounts.filter((a) => selectedAccounts.includes(a.name)),
    [selectedAccounts],
  );

  const geoHighlights = useMemo(() => {
    if (selectedState) return [selectedState];
    return [...stateRisks].sort((a, b) => b.neverStartRisk - a.neverStartRisk).slice(0, 3);
  }, [selectedState]);

  useEffect(() => {
    if (!open) return;

    if (prefill) {
      if (prefill.recipientId && allRecipients.some((r) => r.id === prefill.recipientId)) {
        setRecipientId(prefill.recipientId);
      }
      setCustomTo(prefill.customTo ?? "");
      if (prefill.subject) setSubject(prefill.subject);
      setIncludeAccounts(!prefill.evidence);
      setIncludeGeo(false);
      setBody(prefill.body ?? "");
      return;
    }

    setIncludeAccounts(true);
    setIncludeGeo(true);
    setBody(
      [
        "Hi team,",
        "",
        `Please see below the ${rows.length} account${rows.length === 1 ? "" : "s"} with the most significant payer and specialty pharmacy challenges this week.`,
        "Request your partnership to review these accounts and help align on immediate actions and escalation needs.",
        "",
        "Please advise on:",
        "• Priority accounts for remediate intervention",
        "• FRM resource support needed",
        "• Escalations required with payers / SPs",
        "",
        "Thank you,",
        "Maria Alvarez",
        "VP, Patient Services — Johnson & Johnson",
      ].join("\n"),
    );
  }, [open, rows.length, prefill]);

  const ledger = useLedger();
  const selectedRecipient = allRecipients.find((r) => r.id === recipientId);
  const toValue = customTo || selectedRecipient?.email || "";
  const recipientLabel = customTo
    ? customTo
    : `${selectedRecipient?.name ?? ""}${selectedRecipient?.title ? ` — ${selectedRecipient.title}` : ""}`;


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Draft email</DialogTitle>
          <DialogDescription>
            Share aggregated insights with field, access and hub leaders. Attach the supporting
            evidence, account list or geographic risk snapshot.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Recipient</Label>
              <Select value={recipientId} onValueChange={setRecipientId}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allRecipients.map((r) => (
                    <SelectItem key={r.id} value={r.id} className="text-sm">
                      {r.name} — {r.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Or enter a custom recipient</Label>
              <Input
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                placeholder="name@jnj.example"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-5 rounded-md border border-border bg-surface-muted px-3 py-2.5">
            <label className="flex items-center gap-2 text-xs">
              <Checkbox
                checked={includeAccounts}
                onCheckedChange={(v) => setIncludeAccounts(Boolean(v))}
              />
              Include account list ({rows.length})
            </label>
            <label className="flex items-center gap-2 text-xs">
              <Checkbox checked={includeGeo} onCheckedChange={(v) => setIncludeGeo(Boolean(v))} />
              Include geographic risk snapshot
              {selectedState ? ` (${selectedState.name})` : " (top 3 states)"}
            </label>
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Paperclip className="h-3.5 w-3.5" /> Attachments render inline
            </span>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Message</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={9}
              className="text-sm"
            />
          </div>

          {prefill?.evidence && prefill.evidence.length > 0 && (
            <div className="overflow-hidden rounded-md border border-border">
              <p className="bg-surface-muted px-2 py-1.5 text-xs font-semibold">
                {prefill.evidenceTitle ?? "Supporting evidence"}
              </p>
              <table className="w-full text-xs">
                <tbody>
                  {prefill.evidence.map((e) => (
                    <tr key={e.label} className="border-t border-border">
                      <td className="px-2 py-1.5 font-medium">{e.label}</td>
                      <td className="px-2 py-1.5 text-muted-foreground">{e.detail}</td>
                      <td className="px-2 py-1.5 text-right tabular">{e.metric}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {includeAccounts && rows.length > 0 && (
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full text-xs">
                <thead className="bg-surface-muted text-left text-muted-foreground">
                  <tr>
                    <th className="px-2 py-1.5 font-medium">Account</th>
                    <th className="px-2 py-1.5 text-right font-medium">Never-start patients</th>
                    <th className="px-2 py-1.5 text-right font-medium">Never-start risk</th>
                    <th className="px-2 py-1.5 font-medium">Major payer / SP challenges</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => (
                    <tr key={a.name} className="border-t border-border">
                      <td className="px-2 py-1.5 font-medium">{a.name}</td>
                      <td className="px-2 py-1.5 text-right tabular">
                        {a.neverStartPatients.toLocaleString()}
                      </td>
                      <td className="px-2 py-1.5 text-right tabular">{pct(a.neverStartRisk)}</td>
                      <td className="px-2 py-1.5 text-muted-foreground">{a.challenges}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {includeGeo && (
            <div className="rounded-md border border-border p-3">
              <p className="text-xs font-semibold">Geographic risk snapshot</p>
              <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                {geoHighlights.map((s) => (
                  <li key={s.code} className="flex items-center justify-between gap-3">
                    <span className="font-medium text-foreground">{s.name}</span>
                    <span className="tabular">
                      Never-start {pct(s.neverStartRisk)} · Discontinuation{" "}
                      {pct(s.discontinuationRisk)} · FRM coverage {pct(s.frmCoverage)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {ledgerMeta && (
              <Button
                variant="outline"
                disabled={!toValue}
                onClick={() => {
                  ledger.add({
                    stageId: ledgerMeta.stageId,
                    stageLabel: ledgerMeta.stageLabel,
                    reasonId: ledgerMeta.reasonId,
                    issue: ledgerMeta.issue,
                    patients: ledgerMeta.patients,
                    description: ledgerMeta.description,
                    recipientName: recipientLabel,
                    recipientEmail: toValue,
                    subject,
                    body,
                  });
                  onOpenChange(false);
                  toast.success("Added to the Decision Ledger");
                }}
              >
                <ClipboardList className="h-4 w-4" /> Add to Decision Ledger
              </Button>
            )}
            <Button variant="outline" onClick={() => toast.success("Saved as template")}>
              Save as template
            </Button>

            <Button
              variant="signal"
              onClick={() => {
                onOpenChange(false);
                toast.success(`Email sent to ${toValue}`);
              }}
              disabled={!toValue}
            >
              <Send className="h-4 w-4" /> Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
