import { useStageViewOptional } from "@/lib/psp-stage-view";
import type { SectionId } from "@/lib/psp-sections";

type Block = {
  title: string;
  lens: "exec" | "geography" | "accounts" | "payers";
};

const blockBySection: Partial<Record<SectionId, Block>> = {
  summary: { title: "Where this is happening", lens: "exec" },
  geography: { title: "Geography signals", lens: "geography" },
  accounts: { title: "Account signals", lens: "accounts" },
  payer: { title: "Payer signals", lens: "payers" },
};

const fallbackBlock: Block = { title: "Key insights", lens: "exec" };

/**
 * Geo colour for the Key Barriers rail: observations about *where* the cohort
 * sits, rather than repeating the ranked drivers already on the page.
 */
function geoColour(view: NonNullable<ReturnType<typeof useStageViewOptional>>): string[] {
  const total = view.totals.patients || 1;
  const out: string[] = [];

  if (view.stateLabel) {
    const top3 = view.accounts.slice(0, 3);
    const share = Math.round((top3.reduce((s, a) => s + a.patients, 0) / total) * 100);
    out.push(
      `${top3.length} accounts hold ${share}% of ${view.stateLabel}'s ${view.label.toLowerCase()} patients — ${top3[0]?.name} alone carries ${top3[0]?.patients}.`,
    );
  } else {
    const s0 = view.states[0];
    const s1 = view.states[1];
    if (s0) {
      out.push(
        `${s0.name} carries ${s0.patients} patients (${Math.round((s0.patients / total) * 100)}% of the cohort)${s1 ? `, ahead of ${s1.name} at ${s1.patients}` : ""}.`,
      );
    }
  }

  const rural = view.accounts
    .filter((a) => a.setting === "Rural")
    .reduce((s, a) => s + a.patients, 0);
  const ruralPct = Math.round((rural / total) * 100);
  out.push(
    `${ruralPct}% of these patients sit in rural or small sites, where field reach is thinnest and risk runs 8-11 points above average.`,
  );

  const newOffices = view.accounts.filter((a) => a.newToBrand);
  if (newOffices.length) {
    out.push(
      `${newOffices.length} ${newOffices.length === 1 ? "office is" : "offices are"} new to the brand here, holding ${newOffices.reduce((s, a) => s + a.patients, 0)} patients with no prior workflow history.`,
    );
  }

  out.push(
    `Last FRM contact in this geography averages ${view.avgDaysSinceFrmCall} days ago, and ${Math.round(view.genericCallShare * 100)}% of those calls were generic education.`,
  );

  return out;
}

/**
 * Key insights block in the left rail on deep-dive pages. Reads the same insight
 * text the analysis page shows, so the rail always reconciles with the main view.
 */
export function RailInsights({ section }: { section?: SectionId }) {
  const view = useStageViewOptional();
  const block = (section ? blockBySection[section] : undefined) ?? fallbackBlock;
  if (!view) return null;

  const isExec = block.lens === "exec";
  const lines = isExec ? geoColour(view) : (view.insights[block.lens] ?? []);

  return (
    <div className="space-y-3">

      <p className="px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {block.title}
      </p>

      <div className="rounded-md border border-sidebar-border bg-sidebar-accent px-2.5 py-2">
        <p className="text-[11px] font-semibold text-sidebar-accent-foreground">
          {view.label}
          {view.stateLabel ? ` · ${view.stateLabel}` : ""}
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          <span className="tabular">{view.patients.toLocaleString()}</span> patients ·{" "}
          <span className="tabular">{view.totals.risk.high.toLocaleString()}</span> high risk
          {view.reasonLabel ? ` · ${view.reasonLabel}` : ""}
        </p>
      </div>

      {lines.length > 0 && (
        <ul className="space-y-1.5">
          {lines.slice(0, 3).map((line) => (
            <li
              key={line}
              className="rounded-md border border-sidebar-border bg-card px-2.5 py-2 text-[11px] leading-snug text-muted-foreground"
            >
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
