import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { CalendarDays, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { periodPresets, presetPeriod, usePeriod } from "@/lib/psp-period";

export function DateRangeFilter() {
  const { period, setPeriod, label } = usePeriod();
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>({ from: period.from, to: period.to });

  const applyPreset = (key: string) => {
    const p = presetPeriod(key);
    setRange({ from: p.from, to: p.to });
    setPeriod(p);
    setOpen(false);
  };

  const applyCustom = (r: DateRange | undefined) => {
    setRange(r);
    if (r?.from && r?.to) {
      setPeriod({ key: "custom", from: r.from, to: r.to });
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 text-xs font-normal">
          <CalendarDays className="h-3.5 w-3.5" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="flex shrink-0 flex-col gap-0.5 border-b border-border p-2 sm:border-b-0 sm:border-r">
            {periodPresets.map((p) => {
              const active = period.key === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => applyPreset(p.key)}
                  className={cn(
                    "flex items-center justify-between gap-6 rounded px-2.5 py-1.5 text-left text-xs hover:bg-secondary",
                    active && "bg-secondary font-medium",
                  )}
                >
                  {p.label}
                  {active && <Check className="h-3.5 w-3.5 text-signal" />}
                </button>
              );
            })}
            <span className="px-2.5 pt-2 text-[11px] text-muted-foreground">
              Or pick a custom range
            </span>
          </div>
          <Calendar
            mode="range"
            numberOfMonths={2}
            defaultMonth={period.from}
            selected={range}
            onSelect={applyCustom}
            className={cn("p-3 pointer-events-auto")}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
