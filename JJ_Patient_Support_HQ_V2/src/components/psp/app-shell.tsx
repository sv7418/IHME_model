import type { ReactNode } from "react";
import { CommandSidebar, type SectionId } from "@/components/psp/command-sidebar";
import { SectionTabs } from "@/components/psp/section-tabs";

import { DateRangeFilter } from "@/components/psp/date-range-filter";
import { TopBar } from "@/components/psp/top-bar";
import { Button } from "@/components/ui/button";
import { usePeriod } from "@/lib/psp-period";
import { useBrand } from "@/lib/psp-brand";
import { Download } from "lucide-react";


export function AppShell({
  title,
  subtitle,
  children,
  actions,
  filters,
  activeSection,
  onSectionChange,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  filters?: ReactNode;
  activeSection?: SectionId;
  onSectionChange?: (id: SectionId) => void;
}) {
  const { label: periodText, days } = usePeriod();
  const { brand } = useBrand();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <CommandSidebar activeSection={activeSection} />

        <div className="flex min-w-0 flex-1 flex-col">
          <SectionTabs active={activeSection} onChange={onSectionChange} />
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-5 py-3">
            <div>
              <h1 className="text-base font-semibold tracking-tight">{title}</h1>
              <p className="text-xs text-muted-foreground">
                {brand ? `${brand.name} · ` : ""}
                {subtitle ? `${subtitle} · ` : ""}
                {periodText} · {days}-day window
              </p>
            </div>

            <div className="flex items-center gap-2">
              {filters}
              <DateRangeFilter />

              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
              {actions}
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                JS
              </span>
            </div>
          </header>

          <main className="flex-1 space-y-4 p-5">{children}</main>
        </div>
      </div>
    </div>
  );
}
