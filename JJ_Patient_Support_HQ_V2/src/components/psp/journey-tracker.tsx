import { useNavigate } from "@tanstack/react-router";
import type { Brand, JourneyStage } from "@/lib/psp-brand";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Status = "bottleneck" | "watch" | "retention" | "flowing";

const statusMeta: Record<Status, { label: string; dot: string; text: string }> = {
  bottleneck: {
    label: "Bottleneck — patients backing up",
    dot: "bg-risk-5",
    text: "text-risk-5",
  },
  watch: { label: "Watchout", dot: "bg-risk-3", text: "text-risk-3" },
  retention: {
    label: "Watchout",
    dot: "bg-risk-3",
    text: "text-risk-3",
  },
  flowing: { label: "Flowing normally", dot: "bg-risk-1", text: "text-risk-1" },
};

const retentionStages = new Set(["persistent"]);

const retentionNote =
  "Watch out for drop-off as dosing escalates, and screen for AEs (anemia, telangiectasia, injection-site and tolerability issues) driving discontinuation.";

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function wowLabel(wow: number) {
  return `${wow >= 0 ? "+" : ""}${(wow * 100).toFixed(1)}% WoW`;
}

export function JourneyTracker({
  brand,
  selectedStage,
  onSelectStage,
}: {
  brand: Brand;
  selectedStage?: JourneyStage["id"] | null;
  onSelectStage?: (id: JourneyStage["id"] | null) => void;
}) {
  const navigate = useNavigate();

  const counts = brand.stages.map((s) => s.patients);
  const total = counts.reduce((a, b) => a + b, 0);
  const max = Math.max(...counts);
  const med = median(counts.filter((_, i) => !retentionStages.has(brand.stages[i].id)));

  const statusOf = (stage: JourneyStage): Status =>
    stage.flagged
      ? "bottleneck"
      : retentionStages.has(stage.id)
        ? "retention"
        : stage.patients > med * 1.6
          ? "watch"
          : "flowing";

  const open = (stage: JourneyStage) =>
    navigate({ to: "/sense", search: { stage: stage.id } });

  const selectable = Boolean(onSelectStage);
  const activate = (stage: JourneyStage) => {
    if (onSelectStage) onSelectStage(selectedStage === stage.id ? null : stage.id);
    else open(stage);
  };

  return (
    <TooltipProvider delayDuration={80}>
      <section className="rounded-2xl border border-border bg-card p-4 text-foreground shadow-panel sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Active patient journey — today
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {total.toLocaleString()} active patients across 9 stages
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
            {(["flowing", "watch", "bottleneck"] as Status[]).map((s) => (
              <li key={s} className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", statusMeta[s].dot)} />
                {statusMeta[s].label.split(" — ")[0]}
              </li>
            ))}
            <li className="flex items-center gap-1.5">
              <span className="h-2 w-6 rounded-full bg-[color:var(--journey-rail)]/60" />
              Bar length = share of patients
            </li>
            <li className="text-[11px] italic">
              {selectable ? "Click any tile to filter the map" : "Click any tile to diagnose"}
            </li>
          </ul>
        </div>

        <div className="-mx-2 mt-3 overflow-x-auto px-2 pb-1 pt-1">
          <div className="mx-auto flex min-w-[1080px] items-stretch justify-center gap-2">
            {brand.stages.map((stage, i) => {
              const status = statusOf(stage);
              const meta = statusMeta[status];
              
              const wow = stage.wow ?? 0;
              const wowGood = retentionStages.has(stage.id) ? wow >= 0 : wow <= 0;

              return (
                <div key={stage.id} className="flex flex-1 items-stretch">
                  <div className="flex min-w-0 flex-1 flex-col items-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => activate(stage)}
                          aria-pressed={selectable ? selectedStage === stage.id : undefined}
                          aria-label={`${selectable ? "Filter map by" : "Open"} ${stage.label} — ${stage.patients} patients, ${meta.label}`}
                          className={cn(
                            "group relative flex h-full w-full cursor-pointer flex-col items-center rounded-xl border bg-background/40 px-2 pb-2 pt-4 shadow-sm outline-none transition-all hover:-translate-y-0.5 hover:border-signal/60 hover:bg-signal/[0.04] hover:shadow-panel focus-visible:ring-2 focus-visible:ring-signal/60",
                            status === "bottleneck" ? "border-risk-5/40" : "border-border",
                            selectedStage === stage.id &&
                              "border-primary bg-primary/[0.06] ring-2 ring-primary/50",
                          )}
                        >
                          <span className="absolute right-1 top-1 text-[10px] font-semibold text-muted-foreground">
                            {i + 1}
                          </span>

                          <span
                            className={cn(
                              "whitespace-nowrap text-center text-[12.5px] font-semibold tracking-tight transition-colors group-hover:text-signal",
                              status === "bottleneck" ? "text-risk-5" : "text-foreground",
                            )}
                          >
                            {stage.label}
                          </span>

                          <span
                            className={cn(
                              "mt-0.5 tabular text-[22px] font-bold leading-none",
                              status === "bottleneck" ? "text-risk-5" : "text-foreground",
                            )}
                          >
                            {stage.patients.toLocaleString()}
                          </span>

                          <span
                            className={cn(
                              "text-[10px] font-semibold tabular",
                              wowGood ? "text-risk-1" : "text-risk-5",
                            )}
                          >
                            {wowLabel(wow)}
                          </span>

                          <span className="mt-1.5 h-1.5 w-12 overflow-hidden rounded-full bg-[color:var(--journey-rail)]/30">
                            <span
                              className={cn(
                                "block h-full rounded-full",
                                status === "bottleneck"
                                  ? "bg-risk-5"
                                  : status === "watch" || status === "retention"
                                    ? "bg-risk-3"
                                    : "bg-risk-1",
                              )}
                              style={{ width: `${Math.max(6, (stage.patients / max) * 100)}%` }}
                            />
                          </span>

                          {stage.id === "persistent" ? (
                            <span className="mt-1.5 flex flex-col items-center gap-0 text-[10px] leading-tight text-muted-foreground">
                              <span className="tabular">
                                Avg. days on therapy:{" "}
                                <span className="font-semibold text-foreground">
                                  {stage.daysOnTherapy}
                                </span>
                              </span>
                              <span className="tabular">
                                6 mo. persistency:{" "}
                                <span className="font-semibold text-risk-3">
                                  {stage.persistency6}%
                                </span>
                              </span>
                            </span>
                          ) : (
                            <span className="mt-1.5 flex flex-col items-center gap-0 text-[10px] leading-tight text-muted-foreground">
                              <span className="tabular">
                                Avg. TAT:{" "}
                                <span
                                  className={cn(
                                    "font-semibold",
                                    (stage.avgTat ?? 0) > (stage.expectedTat ?? 0)
                                      ? status === "bottleneck"
                                        ? "text-risk-5"
                                        : "text-risk-3"
                                      : "text-foreground",
                                  )}
                                >
                                  {stage.avgTat}d
                                </span>
                              </span>
                              <span className="tabular">Expected: {stage.expectedTat}d</span>
                            </span>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[220px]">
                        <p className="text-xs font-semibold">
                          {i + 1}. {stage.label}
                        </p>
                        <p className="mt-1 text-xs">
                          {stage.patients.toLocaleString()} active patients of{" "}
                          {total.toLocaleString()} ({wowLabel(wow)})
                        </p>
                        {i > 0 && stage.id !== "persistent" && (
                          <p className="mt-1 text-xs">
                            {Math.round(
                              (stage.patients / brand.stages[i - 1].patients) * 100,
                            )}
                            % of the {brand.stages[i - 1].label.toLowerCase()} stage carried
                            forward
                          </p>
                        )}
                        {stage.id === "persistent" ? (
                          <p className="mt-1 text-xs">
                            Avg. {stage.daysOnTherapy} days on therapy · {stage.persistency6}%
                            persistent at 6 months
                          </p>
                        ) : (
                          <p className="mt-1 text-xs">
                            Avg. TAT {stage.avgTat}d vs {stage.expectedTat}d expected
                            {(stage.avgTat ?? 0) > (stage.expectedTat ?? 0)
                              ? ` (+${((stage.avgTat ?? 0) - (stage.expectedTat ?? 0)).toFixed(1)}d)`
                              : " (on target)"}
                          </p>
                        )}
                        <p className={cn("mt-1 text-xs font-medium", meta.text)}>{meta.label}</p>
                        {retentionStages.has(stage.id) && (
                          <p className="mt-1 text-[11px] opacity-80">{retentionNote}</p>
                        )}
                        <p className="mt-1 text-[11px] opacity-70">
                          {selectable
                            ? "Click to filter the map to patients stuck here."
                            : "Click to diagnose this stage in Sense & Diagnose."}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
