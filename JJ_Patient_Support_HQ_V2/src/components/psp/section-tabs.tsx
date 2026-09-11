import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { sectionItems, type SectionId } from "@/lib/psp-sections";
import { useLedger } from "@/lib/psp-ledger";
import { Brain } from "lucide-react";

/** Horizontal section switcher shown under the page title on every page. */
export function SectionTabs({
  active,
  onChange,
}: {
  active?: SectionId;
  onChange?: (id: SectionId) => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { selectedCount } = useLedger();
  const onJourney = pathname === "/journey";

  const base =
    "relative flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-[13px] transition-colors";
  const off = "border-transparent text-muted-foreground hover:text-foreground";
  const on = "border-primary font-semibold text-foreground";

  return (
    <nav className="flex items-center gap-1 overflow-x-auto border-b border-border bg-card px-3">
      <Link to="/journey" className={cn(base, onJourney ? on : off)}>
        <Brain className="h-4 w-4" />
        Daily Summary
      </Link>

      {sectionItems.map((item) => {
        const Icon = item.icon;
        const isActive = !onJourney && active === item.id;
        const badge = item.id === "decisions" && selectedCount > 0 ? selectedCount : null;
        const content = (
          <>
            <Icon className="h-4 w-4" />
            {item.label}
            {badge !== null && (
              <span className="tabular rounded-full bg-signal px-1.5 text-[10px] font-semibold text-signal-foreground">
                {badge}
              </span>
            )}
          </>
        );

        if (onChange && !onJourney) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(base, isActive ? on : off)}
            >
              {content}
            </button>
          );
        }

        return (
          <Link
            key={item.id}
            to="/sense"
            search={{ section: item.id }}
            className={cn(base, isActive ? on : off)}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
