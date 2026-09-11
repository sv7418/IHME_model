import { Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/psp-brand";
import { buildBriefing } from "@/lib/psp-journey-home";

export function MorningBriefing({ brand }: { brand: Brand }) {
  const briefing = buildBriefing(brand);

  return (
    <section className="overflow-hidden rounded-2xl bg-[image:var(--gradient-hero)] p-4 text-primary-foreground shadow-panel sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
          <Coffee className="h-3 w-3" />
          {briefing.stamp}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 py-1 pl-1 pr-3">
          <span className="grid h-7 place-items-center rounded-full bg-card px-2.5">
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="h-5 w-auto max-w-[100px] object-contain"
            />
          </span>
          <span className="text-[11px] font-medium text-primary-foreground">
            {brand.name} · {brand.indicationShort}
          </span>
        </span>
      </div>

      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{briefing.greeting}</h1>
          <p className="mt-1.5 max-w-3xl text-[13px] leading-snug text-primary-foreground/85">
            {briefing.narrative}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[420px]">
          {briefing.metrics.map((m) => (
            <div key={m.label} className="rounded-lg bg-white/15 px-3 py-2">
              <p className="text-[10px] font-medium uppercase tracking-wide text-primary-foreground/70">
                {m.label}
              </p>
              <p className="mt-0.5 text-xl font-bold tracking-tight tabular">{m.value}</p>
              <p
                className={cn(
                  "text-[11px] font-semibold tabular",
                  m.deltaGood ? "text-risk-1" : "text-risk-3",
                )}
              >
                {m.delta}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
