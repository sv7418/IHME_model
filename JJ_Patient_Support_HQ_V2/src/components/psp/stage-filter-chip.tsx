import { Filter } from "lucide-react";
import { brands, getBrand, type BrandId, type JourneyStageId } from "@/lib/psp-brand";

/**
 * Stage filter. The whole app is filtered by journey stage — "All stages"
 * means every open patient for the brand.
 */
export function StageFilter({
  brandId,
  value,
  onChange,
}: {
  brandId: BrandId | null;
  value: JourneyStageId | null;
  onChange: (stage: JourneyStageId | null) => void;
}) {
  const brand = getBrand(brandId) ?? brands[0];
  return (
    <label className="flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-2.5 py-1 text-xs font-medium text-foreground">
      <Filter className="h-3.5 w-3.5 text-signal" />
      <span className="text-muted-foreground">Stage:</span>
      <select
        aria-label="Filter by journey stage"
        value={value ?? "all"}
        onChange={(e) => onChange(e.target.value === "all" ? null : (e.target.value as JourneyStageId))}
        className="cursor-pointer bg-transparent pr-1 text-xs font-semibold outline-none"
      >
        <option value="all">All stages</option>
        {brand.stages.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Static, read-only variant used on pages that do not own the filter. */
export function StageFilterChip({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-2.5 py-1 text-xs font-medium text-foreground">
      <Filter className="h-3.5 w-3.5 text-signal" />
      Stage: <span className="font-semibold">{label}</span>
    </span>
  );
}
