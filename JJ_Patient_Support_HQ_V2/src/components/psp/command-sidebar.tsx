import { Link } from "@tanstack/react-router";
import { brands, useBrand } from "@/lib/psp-brand";
import type { SectionId } from "@/lib/psp-sections";
import { AlertsRail } from "@/components/psp/alerts-rail";
import { RailInsights } from "@/components/psp/rail-insights";

import { Activity } from "lucide-react";

export type { SectionId };

export function CommandSidebar({ activeSection }: { activeSection?: SectionId }) {
  const { brand } = useBrand();
  const active = brand ?? brands[0];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
      <Link
        to="/journey"
        className="flex items-center gap-2 border-b border-sidebar-border px-5 py-4"
      >
        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
          J
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">{active.name}</p>
          <p className="text-[11px] text-muted-foreground">
            {active.indicationShort
              ? `${active.indicationShort} · Patient Support`
              : "Patient Support"}
          </p>
        </div>
      </Link>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {activeSection ? (
          <RailInsights section={activeSection} />
        ) : (
          <AlertsRail brand={active} />
        )}
      </div>

      <Link
        to="/"
        className="border-t border-sidebar-border px-5 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Switch brand
      </Link>

      <div className="flex items-center gap-2 border-t border-sidebar-border px-5 py-3 text-[11px] text-muted-foreground">
        <Activity className="h-3.5 w-3.5" />
        Predictive engine v3.6 · Week 42
      </div>
    </aside>
  );
}
