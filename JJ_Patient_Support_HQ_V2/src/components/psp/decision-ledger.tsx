import { Fragment, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionCard } from "@/components/psp/stage-bits";
import { useLedger } from "@/lib/psp-ledger";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Send, Trash2 } from "lucide-react";

export function DecisionLedger() {
  const { entries, toggleSelect, selectAll, remove, submitSelected, selectedCount, pendingCount } =
    useLedger();
  const [expanded, setExpanded] = useState<string | null>(null);

  const patientsCovered = entries
    .filter((e) => e.status === "pending" && e.selected)
    .reduce((s, e) => s + e.patients, 0);

  if (entries.length === 0) {
    return (
      <SectionCard
        title="Decision ledger"
        subtitle="Actions you capture while drilling into an insight land here"
      >
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No decisions captured yet. Open a reason tile on Key Barriers, drill down, and use
            “Add to ledger” next to a recommended action.
          </p>
          <Link to="/sense" search={{ section: "summary" }}>
            <Button variant="signal" size="sm" className="mt-4 h-8 text-xs">
              Go to Key Barriers
            </Button>
          </Link>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Decision ledger"
      subtitle={`${selectedCount} of ${pendingCount} decisions selected · ${patientsCovered.toLocaleString()} patients covered`}
      right={
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Checkbox
            checked={pendingCount > 0 && selectedCount === pendingCount}
            onCheckedChange={(v) => selectAll(Boolean(v))}
          />
          Select all
        </label>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-xs">
          <thead className="bg-surface-muted text-left text-muted-foreground">
            <tr>
              <th className="w-8 px-3 py-2" />
              <th className="px-3 py-2 font-medium">Stage</th>
              <th className="px-3 py-2 font-medium">Issue addressed</th>
              <th className="px-3 py-2 text-right font-medium">Patients</th>
              <th className="px-3 py-2 font-medium">What the action does</th>
              <th className="px-3 py-2 font-medium">Recipient</th>
              <th className="w-8 px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => {
              const open = expanded === e.id;
              return (
                <Fragment key={e.id}>
                  <tr key={e.id} className="border-t border-border align-top">
                    <td className="px-3 py-2">
                      <Checkbox
                        checked={e.selected}
                        disabled={e.status === "sent"}
                        onCheckedChange={(v) => toggleSelect(e.id, Boolean(v))}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-medium">{e.stageLabel}</p>
                      {e.status === "sent" && (
                        <span className="mt-1 inline-block rounded bg-risk-1/25 px-1.5 py-0.5 text-[10px] font-semibold text-foreground/80">
                          Sent
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-medium">{e.issue}</td>
                    <td className="tabular px-3 py-2 text-right font-semibold">
                      {e.patients.toLocaleString()}
                    </td>
                    <td className="max-w-[22rem] px-3 py-2 text-muted-foreground">
                      <button
                        type="button"
                        className="flex items-start gap-1 text-left hover:text-signal"
                        onClick={() => setExpanded(open ? null : e.id)}
                      >
                        {open ? (
                          <ChevronDown className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        )}
                        {e.description}
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-medium">{e.recipientName}</p>
                      <p className="text-[11px] text-muted-foreground">{e.recipientEmail}</p>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        aria-label="Remove decision"
                        className="text-muted-foreground transition-colors hover:text-risk-5"
                        onClick={() => remove(e.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr key={`${e.id}-preview`} className="border-t border-border bg-surface-muted/50">
                      <td />
                      <td colSpan={6} className="px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Subject
                        </p>
                        <p className="text-xs font-medium">{e.subject}</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Message
                        </p>
                        <pre className="mt-0.5 whitespace-pre-wrap font-sans text-xs text-foreground/80">
                          {e.body}
                        </pre>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
        <p className={cn("text-xs text-muted-foreground")}>
          Triggering sends each selected email to its recipient and marks the decision as sent.
        </p>
        <Button
          variant="signal"
          size="sm"
          className="h-8 text-xs"
          disabled={selectedCount === 0}
          onClick={() => {
            const fired = submitSelected();
            toast.success(
              `Triggered ${fired.length} action${fired.length === 1 ? "" : "s"} · ${fired
                .reduce((s, f) => s + f.patients, 0)
                .toLocaleString()} patients covered`,
            );
          }}
        >
          <Send className="h-3.5 w-3.5" /> Trigger {selectedCount} action
          {selectedCount === 1 ? "" : "s"}
        </Button>
      </div>
    </SectionCard>
  );
}
